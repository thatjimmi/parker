import { is_function, SvelteComponent, init, safe_not_equal, create_slot, element, space, attr, insert, append, action_destroyer, update_slot_base, get_all_dirty_from_scope, get_slot_changes, transition_in, transition_out, detach, destroy_each, component_subscribe, text, set_data, create_component, mount_component, destroy_component, set_store_value, empty, binding_callbacks, construct_svelte_component, listen, group_outros, check_outros, run_all, set_style, noop, update_keyed_each, outro_and_destroy_block } from 'svelte/internal';
import { getContext, onMount, createEventDispatcher, afterUpdate, setContext } from 'svelte';
import { derived } from 'svelte/store';
import { createDate, cloneDate, addDuration, createDuration, min, max, DAY_IN_SECONDS, bgEvent, sortEventChunks, setContent, helperEvent, toEventWithLocalDates, toViewWithLocalDates, ghostEvent, createEventContent, eventIntersects, createEventChunk, datesEqual, setPayload, rect, floor, previewEvent, repositionEvent, height, setMidnight, addDay, prepareEventChunks } from '@event-calendar/core';

function times(state, localState) {
    return derived(
        [localState._slotTimeLimits, state._intlSlotLabel, state.slotDuration],
        ([$_slotTimeLimits, $_intlSlotLabel, $slotDuration]) => {
            let compact = $slotDuration.seconds >= 3600;
            let times = [];
            let date = createDate('2020-01-01');
            let end = cloneDate(date);
            let i = 1;
            addDuration(date, $_slotTimeLimits.min);
            addDuration(end, $_slotTimeLimits.max);
            while (date < end) {
                times.push(times.length && (i || compact) ? $_intlSlotLabel.format(date) : '');
                addDuration(date, $slotDuration);
                i = 1 - i;
            }

            return times;
        }
    );
}

function slotTimeLimits(state) {
    return derived(
        [state._events, state._viewDates, state.flexibleSlotTimeLimits, state.slotMinTime, state.slotMaxTime],
        ([$_events, $_viewDates, $flexibleSlotTimeLimits, $slotMinTime, $slotMaxTime]) => {
            let min$1 = createDuration($slotMinTime);
            let max$1 = createDuration($slotMaxTime);

            if ($flexibleSlotTimeLimits) {
                let minMin = createDuration(min(min$1.seconds, max(0, max$1.seconds - DAY_IN_SECONDS)));
                let maxMax = createDuration(max(max$1.seconds, minMin.seconds + DAY_IN_SECONDS));
                let filter = is_function($flexibleSlotTimeLimits?.eventFilter)
                    ? $flexibleSlotTimeLimits.eventFilter
                    : event => !bgEvent(event.display);
                loop: for (let date of $_viewDates) {
                    let start = addDuration(cloneDate(date), min$1);
                    let end = addDuration(cloneDate(date), max$1);
                    let minStart = addDuration(cloneDate(date), minMin);
                    let maxEnd = addDuration(cloneDate(date), maxMax);
                    for (let event of $_events) {
                        if (!event.allDay && filter(event) && event.start < maxEnd && event.end > minStart) {
                            if (event.start < start) {
                                let seconds = max((event.start - date) / 1000, minMin.seconds);
                                if (seconds < min$1.seconds) {
                                    min$1.seconds = seconds;
                                }
                            }
                            if (event.end > end) {
                                let seconds = min((event.end - date) / 1000, maxMax.seconds);
                                if (seconds > max$1.seconds) {
                                    max$1.seconds = seconds;
                                }
                            }
                            if (min$1.seconds === minMin.seconds && max$1.seconds === maxMax.seconds) {
                                break loop;
                            }
                        }
                    }
                }
            }

            return {min: min$1, max: max$1};
        }
    );
}

class State {
    constructor(state) {
        this._slotTimeLimits = slotTimeLimits(state);  // flexible limits
        this._times = times(state, this);
    }
}

function groupEventChunks(chunks) {
    if (!chunks.length) {
        return;
    }

    sortEventChunks(chunks);

    // Group
    let group = {
        columns: [],
        end: chunks[0].end
    };
    for (let chunk of chunks) {
        let c = 0;
        if (chunk.start < group.end) {
            for (; c < group.columns.length; ++c) {
                if (group.columns[c][group.columns[c].length - 1].end <= chunk.start) {
                    break;
                }
            }
            if (chunk.end > group.end) {
                group.end = chunk.end;
            }
        } else {
            group = {
                columns: [],
                end: chunk.end
            };
        }

        if (group.columns.length < c + 1) {
            group.columns.push([]);
        }
        group.columns[c].push(chunk);

        chunk.group = group;
        chunk.column = c;
    }
}

function createAllDayContent(allDayContent) {
    let text = 'all-day';
    let content;
    if (allDayContent) {
        content = is_function(allDayContent) ? allDayContent({text}) : allDayContent;
        if (typeof content === 'string') {
            content = {html: content};
        }
    } else {
        content = {
            html: text
        };
    }

    return content;
}

/* packages/time-grid/src/Section.svelte generated by Svelte v3.59.1 */
const get_lines_slot_changes = dirty => ({});
const get_lines_slot_context = ctx => ({});

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	return child_ctx;
}

// (15:4) {#each $_times as time}
function create_each_block$5(ctx) {
	let div;
	let t_value = /*time*/ ctx[9] + "";
	let t;
	let div_class_value;

	return {
		c() {
			div = element("div");
			t = text(t_value);
			attr(div, "class", div_class_value = /*$theme*/ ctx[1].time);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, dirty) {
			if (dirty & /*$_times*/ 4 && t_value !== (t_value = /*time*/ ctx[9] + "")) set_data(t, t_value);

			if (dirty & /*$theme*/ 2 && div_class_value !== (div_class_value = /*$theme*/ ctx[1].time)) {
				attr(div, "class", div_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function create_fragment$8(ctx) {
	let div1;
	let div0;
	let div0_class_value;
	let setContent_action;
	let t0;
	let div1_class_value;
	let t1;
	let div3;
	let div2;
	let div2_class_value;
	let t2;
	let div3_class_value;
	let current;
	let mounted;
	let dispose;
	let each_value = /*$_times*/ ctx[2];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
	}

	const lines_slot_template = /*#slots*/ ctx[8].lines;
	const lines_slot = create_slot(lines_slot_template, ctx, /*$$scope*/ ctx[7], get_lines_slot_context);
	const default_slot_template = /*#slots*/ ctx[8].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			div3 = element("div");
			div2 = element("div");
			if (lines_slot) lines_slot.c();
			t2 = space();
			if (default_slot) default_slot.c();
			attr(div0, "class", div0_class_value = /*$theme*/ ctx[1].sidebarTitle);
			attr(div1, "class", div1_class_value = /*$theme*/ ctx[1].sidebar);
			attr(div2, "class", div2_class_value = /*$theme*/ ctx[1].lines);
			attr(div3, "class", div3_class_value = /*$theme*/ ctx[1].days);
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div1, t0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div1, null);
				}
			}

			insert(target, t1, anchor);
			insert(target, div3, anchor);
			append(div3, div2);

			if (lines_slot) {
				lines_slot.m(div2, null);
			}

			append(div3, t2);

			if (default_slot) {
				default_slot.m(div3, null);
			}

			current = true;

			if (!mounted) {
				dispose = action_destroyer(setContent_action = setContent.call(null, div0, /*allDayText*/ ctx[0]));
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (!current || dirty & /*$theme*/ 2 && div0_class_value !== (div0_class_value = /*$theme*/ ctx[1].sidebarTitle)) {
				attr(div0, "class", div0_class_value);
			}

			if (setContent_action && is_function(setContent_action.update) && dirty & /*allDayText*/ 1) setContent_action.update.call(null, /*allDayText*/ ctx[0]);

			if (dirty & /*$theme, $_times*/ 6) {
				each_value = /*$_times*/ ctx[2];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$5(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$5(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (!current || dirty & /*$theme*/ 2 && div1_class_value !== (div1_class_value = /*$theme*/ ctx[1].sidebar)) {
				attr(div1, "class", div1_class_value);
			}

			if (lines_slot) {
				if (lines_slot.p && (!current || dirty & /*$$scope*/ 128)) {
					update_slot_base(
						lines_slot,
						lines_slot_template,
						ctx,
						/*$$scope*/ ctx[7],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
						: get_slot_changes(lines_slot_template, /*$$scope*/ ctx[7], dirty, get_lines_slot_changes),
						get_lines_slot_context
					);
				}
			}

			if (!current || dirty & /*$theme*/ 2 && div2_class_value !== (div2_class_value = /*$theme*/ ctx[1].lines)) {
				attr(div2, "class", div2_class_value);
			}

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[7],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*$theme*/ 2 && div3_class_value !== (div3_class_value = /*$theme*/ ctx[1].days)) {
				attr(div3, "class", div3_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(lines_slot, local);
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(lines_slot, local);
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			destroy_each(each_blocks, detaching);
			if (detaching) detach(t1);
			if (detaching) detach(div3);
			if (lines_slot) lines_slot.d(detaching);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};
}

function instance$8($$self, $$props, $$invalidate) {
	let $allDayContent;
	let $theme;
	let $_times;
	let { $$slots: slots = {}, $$scope } = $$props;
	let { allDayContent, theme } = getContext('state');
	component_subscribe($$self, allDayContent, value => $$invalidate(6, $allDayContent = value));
	component_subscribe($$self, theme, value => $$invalidate(1, $theme = value));
	let { _times } = getContext('view-state');
	component_subscribe($$self, _times, value => $$invalidate(2, $_times = value));
	let allDayText;

	$$self.$$set = $$props => {
		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$allDayContent*/ 64) {
			$$invalidate(0, allDayText = createAllDayContent($allDayContent));
		}
	};

	return [
		allDayText,
		$theme,
		$_times,
		allDayContent,
		theme,
		_times,
		$allDayContent,
		$$scope,
		slots
	];
}

class Section extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});
	}
}

/* packages/time-grid/src/Body.svelte generated by Svelte v3.59.1 */

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[24] = list[i];
	return child_ctx;
}

// (36:8) <Section>
function create_default_slot$1(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[16].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

	return {
		c() {
			if (default_slot) default_slot.c();
		},
		m(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[18],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
						null
					);
				}
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};
}

// (38:16) {#each lines as line}
function create_each_block$4(ctx) {
	let div;
	let div_class_value;

	return {
		c() {
			div = element("div");
			attr(div, "class", div_class_value = /*$theme*/ ctx[3].line);
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*$theme*/ 8 && div_class_value !== (div_class_value = /*$theme*/ ctx[3].line)) {
				attr(div, "class", div_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (37:12) <svelte:fragment slot="lines">
function create_lines_slot(ctx) {
	let each_1_anchor;
	let each_value = /*lines*/ ctx[2];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
	}

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert(target, each_1_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*$theme, lines*/ 12) {
				each_value = /*lines*/ ctx[2];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$4(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

function create_fragment$7(ctx) {
	let div1;
	let div0;
	let section;
	let div0_class_value;
	let div1_class_value;
	let current;

	section = new Section({
			props: {
				$$slots: {
					lines: [create_lines_slot],
					default: [create_default_slot$1]
				},
				$$scope: { ctx }
			}
		});

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			create_component(section.$$.fragment);
			attr(div0, "class", div0_class_value = /*$theme*/ ctx[3].content);

			attr(div1, "class", div1_class_value = "" + (/*$theme*/ ctx[3].body + (/*compact*/ ctx[1]
			? ' ' + /*$theme*/ ctx[3].compact
			: '')));
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			mount_component(section, div0, null);
			/*div1_binding*/ ctx[17](div1);
			current = true;
		},
		p(ctx, [dirty]) {
			const section_changes = {};

			if (dirty & /*$$scope, lines, $theme*/ 262156) {
				section_changes.$$scope = { dirty, ctx };
			}

			section.$set(section_changes);

			if (!current || dirty & /*$theme*/ 8 && div0_class_value !== (div0_class_value = /*$theme*/ ctx[3].content)) {
				attr(div0, "class", div0_class_value);
			}

			if (!current || dirty & /*$theme, compact*/ 10 && div1_class_value !== (div1_class_value = "" + (/*$theme*/ ctx[3].body + (/*compact*/ ctx[1]
			? ' ' + /*$theme*/ ctx[3].compact
			: '')))) {
				attr(div1, "class", div1_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(section.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(section.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			destroy_component(section);
			/*div1_binding*/ ctx[17](null);
		}
	};
}

function instance$7($$self, $$props, $$invalidate) {
	let $slotHeight;
	let $slotDuration;
	let $scrollTime;
	let $_viewDates;
	let $_slotTimeLimits;
	let $_times;
	let $_bodyEl;
	let $theme;
	let { $$slots: slots = {}, $$scope } = $$props;
	let { _bodyEl, _viewDates, scrollTime, slotDuration, slotHeight, theme } = getContext('state');
	component_subscribe($$self, _bodyEl, value => $$invalidate(22, $_bodyEl = value));
	component_subscribe($$self, _viewDates, value => $$invalidate(13, $_viewDates = value));
	component_subscribe($$self, scrollTime, value => $$invalidate(21, $scrollTime = value));
	component_subscribe($$self, slotDuration, value => $$invalidate(12, $slotDuration = value));
	component_subscribe($$self, slotHeight, value => $$invalidate(20, $slotHeight = value));
	component_subscribe($$self, theme, value => $$invalidate(3, $theme = value));
	let { _slotTimeLimits, _times } = getContext('view-state');
	component_subscribe($$self, _slotTimeLimits, value => $$invalidate(14, $_slotTimeLimits = value));
	component_subscribe($$self, _times, value => $$invalidate(15, $_times = value));
	let el;
	let compact;
	let lines = [];
	let timeLimitMin;

	function scrollToTime() {
		$$invalidate(0, el.scrollTop = (($scrollTime.seconds - timeLimitMin) / $slotDuration.seconds - 0.5) * $slotHeight, el);
	}

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			el = $$value;
			$$invalidate(0, el);
		});
	}

	$$self.$$set = $$props => {
		if ('$$scope' in $$props) $$invalidate(18, $$scope = $$props.$$scope);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*el*/ 1) {
			set_store_value(_bodyEl, $_bodyEl = el, $_bodyEl);
		}

		if ($$self.$$.dirty & /*$slotDuration, $_times, $_slotTimeLimits*/ 53248) {
			{
				$$invalidate(1, compact = $slotDuration.seconds >= 3600);
				$$invalidate(2, lines.length = $_times.length, lines);

				// Use intermediate variable so that changes in _slotTimeLimits do not trigger setting the el.scrollTop
				timeLimitMin = $_slotTimeLimits.min.seconds;
			}
		}

		if ($$self.$$.dirty & /*el, $_viewDates*/ 8193) {
			if (el && $_viewDates) {
				scrollToTime();
			}
		}
	};

	return [
		el,
		compact,
		lines,
		$theme,
		_bodyEl,
		_viewDates,
		scrollTime,
		slotDuration,
		slotHeight,
		theme,
		_slotTimeLimits,
		_times,
		$slotDuration,
		$_viewDates,
		$_slotTimeLimits,
		$_times,
		slots,
		div1_binding,
		$$scope
	];
}

class Body extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});
	}
}

/* packages/time-grid/src/Event.svelte generated by Svelte v3.59.1 */

function create_fragment$6(ctx) {
	let div1;
	let div0;
	let div0_class_value;
	let setContent_action;
	let t;
	let switch_instance;
	let current;
	let mounted;
	let dispose;
	var switch_value = /*$_interaction*/ ctx[10].resizer;

	function switch_props(ctx) {
		return { props: { event: /*event*/ ctx[0] } };
	}

	if (switch_value) {
		switch_instance = construct_svelte_component(switch_value, switch_props(ctx));

		switch_instance.$on("pointerdown", function () {
			if (is_function(/*createDragHandler*/ ctx[32](/*$_interaction*/ ctx[10], true))) /*createDragHandler*/ ctx[32](/*$_interaction*/ ctx[10], true).apply(this, arguments);
		});
	}

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t = space();
			if (switch_instance) create_component(switch_instance.$$.fragment);
			attr(div0, "class", div0_class_value = /*$theme*/ ctx[2].eventBody);
			attr(div1, "class", /*classes*/ ctx[4]);
			attr(div1, "style", /*style*/ ctx[5]);
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div1, t);
			if (switch_instance) mount_component(switch_instance, div1, null);
			/*div1_binding*/ ctx[49](div1);
			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(setContent_action = setContent.call(null, div0, /*content*/ ctx[6])),
					listen(div1, "click", function () {
						if (is_function(!bgEvent(/*display*/ ctx[1]) && /*createHandler*/ ctx[31](/*$eventClick*/ ctx[7], /*display*/ ctx[1]))) (!bgEvent(/*display*/ ctx[1]) && /*createHandler*/ ctx[31](/*$eventClick*/ ctx[7], /*display*/ ctx[1])).apply(this, arguments);
					}),
					listen(div1, "mouseenter", function () {
						if (is_function(/*createHandler*/ ctx[31](/*$eventMouseEnter*/ ctx[8], /*display*/ ctx[1]))) /*createHandler*/ ctx[31](/*$eventMouseEnter*/ ctx[8], /*display*/ ctx[1]).apply(this, arguments);
					}),
					listen(div1, "mouseleave", function () {
						if (is_function(/*createHandler*/ ctx[31](/*$eventMouseLeave*/ ctx[9], /*display*/ ctx[1]))) /*createHandler*/ ctx[31](/*$eventMouseLeave*/ ctx[9], /*display*/ ctx[1]).apply(this, arguments);
					}),
					listen(div1, "pointerdown", function () {
						if (is_function(!bgEvent(/*display*/ ctx[1]) && !helperEvent(/*display*/ ctx[1]) && /*createDragHandler*/ ctx[32](/*$_interaction*/ ctx[10]))) (!bgEvent(/*display*/ ctx[1]) && !helperEvent(/*display*/ ctx[1]) && /*createDragHandler*/ ctx[32](/*$_interaction*/ ctx[10])).apply(this, arguments);
					})
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (!current || dirty[0] & /*$theme*/ 4 && div0_class_value !== (div0_class_value = /*$theme*/ ctx[2].eventBody)) {
				attr(div0, "class", div0_class_value);
			}

			if (setContent_action && is_function(setContent_action.update) && dirty[0] & /*content*/ 64) setContent_action.update.call(null, /*content*/ ctx[6]);
			const switch_instance_changes = {};
			if (dirty[0] & /*event*/ 1) switch_instance_changes.event = /*event*/ ctx[0];

			if (dirty[0] & /*$_interaction*/ 1024 && switch_value !== (switch_value = /*$_interaction*/ ctx[10].resizer)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = construct_svelte_component(switch_value, switch_props(ctx));

					switch_instance.$on("pointerdown", function () {
						if (is_function(/*createDragHandler*/ ctx[32](/*$_interaction*/ ctx[10], true))) /*createDragHandler*/ ctx[32](/*$_interaction*/ ctx[10], true).apply(this, arguments);
					});

					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, div1, null);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}

			if (!current || dirty[0] & /*classes*/ 16) {
				attr(div1, "class", /*classes*/ ctx[4]);
			}

			if (!current || dirty[0] & /*style*/ 32) {
				attr(div1, "style", /*style*/ ctx[5]);
			}
		},
		i(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			if (switch_instance) destroy_component(switch_instance);
			/*div1_binding*/ ctx[49](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$6($$self, $$props, $$invalidate) {
	let $_view;
	let $eventDidMount;
	let $_intlEventTime;
	let $theme;
	let $eventContent;
	let $displayEventEnd;
	let $_classes;
	let $slotEventOverlap;
	let $eventTextColor;
	let $_resTxtColor;
	let $eventColor;
	let $eventBackgroundColor;
	let $_resBgColor;
	let $slotHeight;
	let $_slotTimeLimits;
	let $slotDuration;
	let $eventClick;
	let $eventMouseEnter;
	let $eventMouseLeave;
	let $_interaction;
	let { date } = $$props;
	let { chunk } = $$props;
	let { displayEventEnd, eventBackgroundColor, eventTextColor, eventColor, eventContent, eventClick, eventDidMount, eventMouseEnter, eventMouseLeave, slotEventOverlap, slotDuration, slotHeight, theme, _view, _intlEventTime, _interaction, _classes, _resBgColor, _resTxtColor } = getContext('state');
	component_subscribe($$self, displayEventEnd, value => $$invalidate(38, $displayEventEnd = value));
	component_subscribe($$self, eventBackgroundColor, value => $$invalidate(44, $eventBackgroundColor = value));
	component_subscribe($$self, eventTextColor, value => $$invalidate(41, $eventTextColor = value));
	component_subscribe($$self, eventColor, value => $$invalidate(43, $eventColor = value));
	component_subscribe($$self, eventContent, value => $$invalidate(37, $eventContent = value));
	component_subscribe($$self, eventClick, value => $$invalidate(7, $eventClick = value));
	component_subscribe($$self, eventDidMount, value => $$invalidate(51, $eventDidMount = value));
	component_subscribe($$self, eventMouseEnter, value => $$invalidate(8, $eventMouseEnter = value));
	component_subscribe($$self, eventMouseLeave, value => $$invalidate(9, $eventMouseLeave = value));
	component_subscribe($$self, slotEventOverlap, value => $$invalidate(40, $slotEventOverlap = value));
	component_subscribe($$self, slotDuration, value => $$invalidate(48, $slotDuration = value));
	component_subscribe($$self, slotHeight, value => $$invalidate(46, $slotHeight = value));
	component_subscribe($$self, theme, value => $$invalidate(2, $theme = value));
	component_subscribe($$self, _view, value => $$invalidate(35, $_view = value));
	component_subscribe($$self, _intlEventTime, value => $$invalidate(36, $_intlEventTime = value));
	component_subscribe($$self, _interaction, value => $$invalidate(10, $_interaction = value));
	component_subscribe($$self, _classes, value => $$invalidate(39, $_classes = value));
	component_subscribe($$self, _resBgColor, value => $$invalidate(45, $_resBgColor = value));
	component_subscribe($$self, _resTxtColor, value => $$invalidate(42, $_resTxtColor = value));
	let { _slotTimeLimits } = getContext('view-state');
	component_subscribe($$self, _slotTimeLimits, value => $$invalidate(47, $_slotTimeLimits = value));
	let el;
	let event;
	let display;
	let classes;
	let style;
	let content;
	let timeText;

	onMount(() => {
		if (is_function($eventDidMount)) {
			$eventDidMount({
				event: toEventWithLocalDates(event),
				timeText,
				el,
				view: toViewWithLocalDates($_view)
			});
		}
	});

	function createHandler(fn, display) {
		return !helperEvent(display) && is_function(fn)
		? jsEvent => fn({
				event: toEventWithLocalDates(event),
				el,
				jsEvent,
				view: toViewWithLocalDates($_view)
			})
		: undefined;
	}

	function createDragHandler(interaction, resize) {
		return interaction.action
		? jsEvent => interaction.action.drag(event, jsEvent, resize)
		: undefined;
	}

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			el = $$value;
			$$invalidate(3, el);
		});
	}

	$$self.$$set = $$props => {
		if ('date' in $$props) $$invalidate(33, date = $$props.date);
		if ('chunk' in $$props) $$invalidate(34, chunk = $$props.chunk);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[1] & /*chunk*/ 8) {
			$$invalidate(0, event = chunk.event);
		}

		if ($$self.$$.dirty[0] & /*event, style, display, $theme*/ 39 | $$self.$$.dirty[1] & /*$slotDuration, $_slotTimeLimits, chunk, date, $slotHeight, $_resBgColor, $eventBackgroundColor, $eventColor, $_resTxtColor, $eventTextColor, $slotEventOverlap, $_classes*/ 261900) {
			{
				$$invalidate(1, display = event.display);

				// Style
				let step = $slotDuration.seconds / 60;

				let offset = $_slotTimeLimits.min.seconds / 60;
				let start = (chunk.start - date) / 1000 / 60;
				let end = (chunk.end - date) / 1000 / 60;
				let top = (start - offset) / step * $slotHeight;
				let height = (end - start) / step * $slotHeight;
				let maxHeight = ($_slotTimeLimits.max.seconds / 60 - start) / step * $slotHeight;
				let bgColor = event.backgroundColor || $_resBgColor(event) || $eventBackgroundColor || $eventColor;
				let txtColor = event.textColor || $_resTxtColor(event) || $eventTextColor;
				$$invalidate(5, style = `top:${top}px;` + `min-height:${height}px;` + `height:${height}px;` + `max-height:${maxHeight}px;`);

				if (bgColor) {
					$$invalidate(5, style += `background-color:${bgColor};`);
				}

				if (txtColor) {
					$$invalidate(5, style += `color:${txtColor};`);
				}

				if (!bgEvent(display) && !helperEvent(display) || ghostEvent(display)) {
					$$invalidate(5, style += `z-index:${chunk.column + 1};` + `left:${100 / chunk.group.columns.length * chunk.column}%;` + `width:${100 / chunk.group.columns.length * ($slotEventOverlap
					? 0.5 * (1 + chunk.group.columns.length - chunk.column)
					: 1)}%;`);
				}

				// Class
				$$invalidate(4, classes = $_classes(bgEvent(display) ? $theme.bgEvent : $theme.event, event));
			}
		}

		if ($$self.$$.dirty[0] & /*$theme*/ 4 | $$self.$$.dirty[1] & /*chunk, $displayEventEnd, $eventContent, $_intlEventTime, $_view*/ 248) {
			// Content
			$$invalidate(6, [timeText, content] = createEventContent(chunk, $displayEventEnd, $eventContent, $theme, $_intlEventTime, $_view), content);
		}
	};

	return [
		event,
		display,
		$theme,
		el,
		classes,
		style,
		content,
		$eventClick,
		$eventMouseEnter,
		$eventMouseLeave,
		$_interaction,
		displayEventEnd,
		eventBackgroundColor,
		eventTextColor,
		eventColor,
		eventContent,
		eventClick,
		eventDidMount,
		eventMouseEnter,
		eventMouseLeave,
		slotEventOverlap,
		slotDuration,
		slotHeight,
		theme,
		_view,
		_intlEventTime,
		_interaction,
		_classes,
		_resBgColor,
		_resTxtColor,
		_slotTimeLimits,
		createHandler,
		createDragHandler,
		date,
		chunk,
		$_view,
		$_intlEventTime,
		$eventContent,
		$displayEventEnd,
		$_classes,
		$slotEventOverlap,
		$eventTextColor,
		$_resTxtColor,
		$eventColor,
		$eventBackgroundColor,
		$_resBgColor,
		$slotHeight,
		$_slotTimeLimits,
		$slotDuration,
		div1_binding
	];
}

class Event$1 extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$6, create_fragment$6, safe_not_equal, { date: 33, chunk: 34 }, null, [-1, -1]);
	}
}

/* packages/time-grid/src/NowIndicator.svelte generated by Svelte v3.59.1 */

function create_fragment$5(ctx) {
	let div;
	let div_class_value;

	return {
		c() {
			div = element("div");
			attr(div, "class", div_class_value = /*$theme*/ ctx[1].nowIndicator);
			set_style(div, "top", /*top*/ ctx[0] + "px");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p(ctx, [dirty]) {
			if (dirty & /*$theme*/ 2 && div_class_value !== (div_class_value = /*$theme*/ ctx[1].nowIndicator)) {
				attr(div, "class", div_class_value);
			}

			if (dirty & /*top*/ 1) {
				set_style(div, "top", /*top*/ ctx[0] + "px");
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function instance$5($$self, $$props, $$invalidate) {
	let $slotHeight;
	let $_slotTimeLimits;
	let $slotDuration;
	let $_today;
	let $_now;
	let $theme;
	let { slotDuration, slotHeight, theme, _now, _today } = getContext('state');
	component_subscribe($$self, slotDuration, value => $$invalidate(11, $slotDuration = value));
	component_subscribe($$self, slotHeight, value => $$invalidate(9, $slotHeight = value));
	component_subscribe($$self, theme, value => $$invalidate(1, $theme = value));
	component_subscribe($$self, _now, value => $$invalidate(13, $_now = value));
	component_subscribe($$self, _today, value => $$invalidate(12, $_today = value));
	let { _slotTimeLimits } = getContext('view-state');
	component_subscribe($$self, _slotTimeLimits, value => $$invalidate(10, $_slotTimeLimits = value));
	let start;
	let top = 0;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$_now, $_today*/ 12288) {
			$$invalidate(8, start = ($_now - $_today) / 1000 / 60);
		}

		if ($$self.$$.dirty & /*$slotDuration, $_slotTimeLimits, start, $slotHeight*/ 3840) {
			{
				// Style
				let step = $slotDuration.seconds / 60;

				let offset = $_slotTimeLimits.min.seconds / 60;
				$$invalidate(0, top = (start - offset) / step * $slotHeight);
			}
		}
	};

	return [
		top,
		$theme,
		slotDuration,
		slotHeight,
		theme,
		_now,
		_today,
		_slotTimeLimits,
		start,
		$slotHeight,
		$_slotTimeLimits,
		$slotDuration,
		$_today,
		$_now
	];
}

class NowIndicator extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});
	}
}

/* packages/time-grid/src/Day.svelte generated by Svelte v3.59.1 */

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[33] = list[i];
	return child_ctx;
}

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[33] = list[i];
	return child_ctx;
}

// (90:8) {#each bgChunks as chunk (chunk.event)}
function create_each_block_1$1(key_1, ctx) {
	let first;
	let event;
	let current;

	event = new Event$1({
			props: {
				date: /*date*/ ctx[0],
				chunk: /*chunk*/ ctx[33]
			}
		});

	return {
		key: key_1,
		first: null,
		c() {
			first = empty();
			create_component(event.$$.fragment);
			this.first = first;
		},
		m(target, anchor) {
			insert(target, first, anchor);
			mount_component(event, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const event_changes = {};
			if (dirty[0] & /*date*/ 1) event_changes.date = /*date*/ ctx[0];
			if (dirty[0] & /*bgChunks*/ 8) event_changes.chunk = /*chunk*/ ctx[33];
			event.$set(event_changes);
		},
		i(local) {
			if (current) return;
			transition_in(event.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(event.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(first);
			destroy_component(event, detaching);
		}
	};
}

// (96:8) {#if iChunks[1]}
function create_if_block_2(ctx) {
	let event;
	let current;

	event = new Event$1({
			props: {
				date: /*date*/ ctx[0],
				chunk: /*iChunks*/ ctx[4][1]
			}
		});

	return {
		c() {
			create_component(event.$$.fragment);
		},
		m(target, anchor) {
			mount_component(event, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const event_changes = {};
			if (dirty[0] & /*date*/ 1) event_changes.date = /*date*/ ctx[0];
			if (dirty[0] & /*iChunks*/ 16) event_changes.chunk = /*iChunks*/ ctx[4][1];
			event.$set(event_changes);
		},
		i(local) {
			if (current) return;
			transition_in(event.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(event.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(event, detaching);
		}
	};
}

// (99:8) {#each chunks as chunk (chunk.event)}
function create_each_block$3(key_1, ctx) {
	let first;
	let event;
	let current;

	event = new Event$1({
			props: {
				date: /*date*/ ctx[0],
				chunk: /*chunk*/ ctx[33]
			}
		});

	return {
		key: key_1,
		first: null,
		c() {
			first = empty();
			create_component(event.$$.fragment);
			this.first = first;
		},
		m(target, anchor) {
			insert(target, first, anchor);
			mount_component(event, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const event_changes = {};
			if (dirty[0] & /*date*/ 1) event_changes.date = /*date*/ ctx[0];
			if (dirty[0] & /*chunks*/ 4) event_changes.chunk = /*chunk*/ ctx[33];
			event.$set(event_changes);
		},
		i(local) {
			if (current) return;
			transition_in(event.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(event.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(first);
			destroy_component(event, detaching);
		}
	};
}

// (103:8) {#if iChunks[0] && !iChunks[0].event.allDay}
function create_if_block_1(ctx) {
	let event;
	let current;

	event = new Event$1({
			props: {
				date: /*date*/ ctx[0],
				chunk: /*iChunks*/ ctx[4][0]
			}
		});

	return {
		c() {
			create_component(event.$$.fragment);
		},
		m(target, anchor) {
			mount_component(event, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const event_changes = {};
			if (dirty[0] & /*date*/ 1) event_changes.date = /*date*/ ctx[0];
			if (dirty[0] & /*iChunks*/ 16) event_changes.chunk = /*iChunks*/ ctx[4][0];
			event.$set(event_changes);
		},
		i(local) {
			if (current) return;
			transition_in(event.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(event.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(event, detaching);
		}
	};
}

// (109:8) {#if $nowIndicator && isToday}
function create_if_block$2(ctx) {
	let nowindicator;
	let current;
	nowindicator = new NowIndicator({});

	return {
		c() {
			create_component(nowindicator.$$.fragment);
		},
		m(target, anchor) {
			mount_component(nowindicator, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(nowindicator.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(nowindicator.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(nowindicator, detaching);
		}
	};
}

function create_fragment$4(ctx) {
	let div3;
	let div0;
	let each_blocks_1 = [];
	let each0_lookup = new Map();
	let div0_class_value;
	let t0;
	let div1;
	let t1;
	let each_blocks = [];
	let each1_lookup = new Map();
	let t2;
	let div1_class_value;
	let t3;
	let div2;
	let div2_class_value;
	let div3_class_value;
	let current;
	let mounted;
	let dispose;
	let each_value_1 = /*bgChunks*/ ctx[3];
	const get_key = ctx => /*chunk*/ ctx[33].event;

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each0_lookup.set(key, each_blocks_1[i] = create_each_block_1$1(key, child_ctx));
	}

	let if_block0 = /*iChunks*/ ctx[4][1] && create_if_block_2(ctx);
	let each_value = /*chunks*/ ctx[2];
	const get_key_1 = ctx => /*chunk*/ ctx[33].event;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$3(ctx, each_value, i);
		let key = get_key_1(child_ctx);
		each1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
	}

	let if_block1 = /*iChunks*/ ctx[4][0] && !/*iChunks*/ ctx[4][0].event.allDay && create_if_block_1(ctx);
	let if_block2 = /*$nowIndicator*/ ctx[9] && /*isToday*/ ctx[5] && create_if_block$2();

	return {
		c() {
			div3 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t0 = space();
			div1 = element("div");
			if (if_block0) if_block0.c();
			t1 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			if (if_block1) if_block1.c();
			t3 = space();
			div2 = element("div");
			if (if_block2) if_block2.c();
			attr(div0, "class", div0_class_value = /*$theme*/ ctx[7].bgEvents);
			attr(div1, "class", div1_class_value = /*$theme*/ ctx[7].events);
			attr(div2, "class", div2_class_value = /*$theme*/ ctx[7].extra);

			attr(div3, "class", div3_class_value = "" + (/*$theme*/ ctx[7].day + (/*isToday*/ ctx[5] ? ' ' + /*$theme*/ ctx[7].today : '') + (/*highlight*/ ctx[6]
			? ' ' + /*$theme*/ ctx[7].highlight
			: '')));
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(div0, null);
				}
			}

			append(div3, t0);
			append(div3, div1);
			if (if_block0) if_block0.m(div1, null);
			append(div1, t1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div1, null);
				}
			}

			append(div1, t2);
			if (if_block1) if_block1.m(div1, null);
			append(div3, t3);
			append(div3, div2);
			if (if_block2) if_block2.m(div2, null);
			/*div3_binding*/ ctx[29](div3);
			current = true;

			if (!mounted) {
				dispose = [
					listen(div3, "pointerenter", function () {
						if (is_function(/*createPointerEnterHandler*/ ctx[20](/*$_interaction*/ ctx[8]))) /*createPointerEnterHandler*/ ctx[20](/*$_interaction*/ ctx[8]).apply(this, arguments);
					}),
					listen(div3, "pointerleave", function () {
						if (is_function(/*$_interaction*/ ctx[8].pointer?.leave)) /*$_interaction*/ ctx[8].pointer?.leave.apply(this, arguments);
					}),
					listen(div3, "pointerdown", function () {
						if (is_function(/*$_interaction*/ ctx[8].action?.select)) /*$_interaction*/ ctx[8].action?.select.apply(this, arguments);
					})
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*date, bgChunks*/ 9) {
				each_value_1 = /*bgChunks*/ ctx[3];
				group_outros();
				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_1, each0_lookup, div0, outro_and_destroy_block, create_each_block_1$1, null, get_each_context_1$1);
				check_outros();
			}

			if (!current || dirty[0] & /*$theme*/ 128 && div0_class_value !== (div0_class_value = /*$theme*/ ctx[7].bgEvents)) {
				attr(div0, "class", div0_class_value);
			}

			if (/*iChunks*/ ctx[4][1]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty[0] & /*iChunks*/ 16) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_2(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div1, t1);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (dirty[0] & /*date, chunks*/ 5) {
				each_value = /*chunks*/ ctx[2];
				group_outros();
				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value, each1_lookup, div1, outro_and_destroy_block, create_each_block$3, t2, get_each_context$3);
				check_outros();
			}

			if (/*iChunks*/ ctx[4][0] && !/*iChunks*/ ctx[4][0].event.allDay) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty[0] & /*iChunks*/ 16) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_1(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div1, null);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (!current || dirty[0] & /*$theme*/ 128 && div1_class_value !== (div1_class_value = /*$theme*/ ctx[7].events)) {
				attr(div1, "class", div1_class_value);
			}

			if (/*$nowIndicator*/ ctx[9] && /*isToday*/ ctx[5]) {
				if (if_block2) {
					if (dirty[0] & /*$nowIndicator, isToday*/ 544) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block$2();
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(div2, null);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}

			if (!current || dirty[0] & /*$theme*/ 128 && div2_class_value !== (div2_class_value = /*$theme*/ ctx[7].extra)) {
				attr(div2, "class", div2_class_value);
			}

			if (!current || dirty[0] & /*$theme, isToday, highlight*/ 224 && div3_class_value !== (div3_class_value = "" + (/*$theme*/ ctx[7].day + (/*isToday*/ ctx[5] ? ' ' + /*$theme*/ ctx[7].today : '') + (/*highlight*/ ctx[6]
			? ' ' + /*$theme*/ ctx[7].highlight
			: '')))) {
				attr(div3, "class", div3_class_value);
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks_1[i]);
			}

			transition_in(if_block0);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(if_block1);
			transition_in(if_block2);
			current = true;
		},
		o(local) {
			for (let i = 0; i < each_blocks_1.length; i += 1) {
				transition_out(each_blocks_1[i]);
			}

			transition_out(if_block0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(if_block1);
			transition_out(if_block2);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div3);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].d();
			}

			if (if_block0) if_block0.d();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			/*div3_binding*/ ctx[29](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	let $slotDuration;
	let $_slotTimeLimits;
	let $slotHeight;
	let $highlightedDates;
	let $_today;
	let $_iEvents;
	let $_events;
	let $theme;
	let $_interaction;
	let $nowIndicator;
	let { date } = $$props;
	let { resource = undefined } = $$props;
	let { _events, _iEvents, highlightedDates, nowIndicator, slotDuration, slotHeight, theme, _interaction, _today } = getContext('state');
	component_subscribe($$self, _events, value => $$invalidate(28, $_events = value));
	component_subscribe($$self, _iEvents, value => $$invalidate(27, $_iEvents = value));
	component_subscribe($$self, highlightedDates, value => $$invalidate(25, $highlightedDates = value));
	component_subscribe($$self, nowIndicator, value => $$invalidate(9, $nowIndicator = value));
	component_subscribe($$self, slotDuration, value => $$invalidate(30, $slotDuration = value));
	component_subscribe($$self, slotHeight, value => $$invalidate(31, $slotHeight = value));
	component_subscribe($$self, theme, value => $$invalidate(7, $theme = value));
	component_subscribe($$self, _interaction, value => $$invalidate(8, $_interaction = value));
	component_subscribe($$self, _today, value => $$invalidate(26, $_today = value));
	let { _slotTimeLimits } = getContext('view-state');
	component_subscribe($$self, _slotTimeLimits, value => $$invalidate(24, $_slotTimeLimits = value));
	let el;
	let chunks, bgChunks, iChunks = [];
	let isToday, highlight;
	let start, end;

	function dateFromPoint(y) {
		y -= rect(el).top;

		return {
			allDay: false,
			date: addDuration(cloneDate(date), $slotDuration, floor(y / $slotHeight + $_slotTimeLimits.min.seconds / $slotDuration.seconds)),
			resource,
			dayEl: el
		};
	}

	function createPointerEnterHandler(interaction) {
		return interaction.pointer
		? jsEvent => interaction.pointer.enterTimeGrid(date, el, jsEvent, _slotTimeLimits, resource)
		: undefined;
	}

	function div3_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			el = $$value;
			$$invalidate(1, el);
		});
	}

	$$self.$$set = $$props => {
		if ('date' in $$props) $$invalidate(0, date = $$props.date);
		if ('resource' in $$props) $$invalidate(21, resource = $$props.resource);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*date, $_slotTimeLimits*/ 16777217) {
			{
				$$invalidate(22, start = addDuration(cloneDate(date), $_slotTimeLimits.min));
				$$invalidate(23, end = addDuration(cloneDate(date), $_slotTimeLimits.max));
			}
		}

		if ($$self.$$.dirty[0] & /*$_events, start, end, resource, bgChunks, chunks*/ 283115532) {
			{
				$$invalidate(2, chunks = []);
				$$invalidate(3, bgChunks = []);

				for (let event of $_events) {
					if (!event.allDay && eventIntersects(event, start, end, resource, true)) {
						let chunk = createEventChunk(event, start, end);

						switch (event.display) {
							case 'background':
								bgChunks.push(chunk);
								break;
							default:
								chunks.push(chunk);
						}
					}
				}

				groupEventChunks(chunks);
			}
		}

		if ($$self.$$.dirty[0] & /*$_iEvents, start, end, resource*/ 148897792) {
			$$invalidate(4, iChunks = $_iEvents.map(event => event && eventIntersects(event, start, end, resource, true)
			? createEventChunk(event, start, end)
			: null));
		}

		if ($$self.$$.dirty[0] & /*date, $_today*/ 67108865) {
			$$invalidate(5, isToday = datesEqual(date, $_today));
		}

		if ($$self.$$.dirty[0] & /*$highlightedDates, date*/ 33554433) {
			$$invalidate(6, highlight = $highlightedDates.some(d => datesEqual(d, date)));
		}

		if ($$self.$$.dirty[0] & /*el*/ 2) {
			if (el) {
				setPayload(el, dateFromPoint);
			}
		}
	};

	return [
		date,
		el,
		chunks,
		bgChunks,
		iChunks,
		isToday,
		highlight,
		$theme,
		$_interaction,
		$nowIndicator,
		_events,
		_iEvents,
		highlightedDates,
		nowIndicator,
		slotDuration,
		slotHeight,
		theme,
		_interaction,
		_today,
		_slotTimeLimits,
		createPointerEnterHandler,
		resource,
		start,
		end,
		$_slotTimeLimits,
		$highlightedDates,
		$_today,
		$_iEvents,
		$_events,
		div3_binding
	];
}

class Day$1 extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { date: 0, resource: 21 }, null, [-1, -1]);
	}
}

/* packages/time-grid/src/all-day/Event.svelte generated by Svelte v3.59.1 */

function create_fragment$3(ctx) {
	let div1;
	let div0;
	let div0_class_value;
	let setContent_action;
	let t;
	let switch_instance;
	let current;
	let mounted;
	let dispose;
	var switch_value = /*$_interaction*/ ctx[10].resizer;

	function switch_props(ctx) {
		return { props: { event: /*event*/ ctx[0] } };
	}

	if (switch_value) {
		switch_instance = construct_svelte_component(switch_value, switch_props(ctx));

		switch_instance.$on("pointerdown", function () {
			if (is_function(/*createDragHandler*/ ctx[28](/*$_interaction*/ ctx[10], true))) /*createDragHandler*/ ctx[28](/*$_interaction*/ ctx[10], true).apply(this, arguments);
		});
	}

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t = space();
			if (switch_instance) create_component(switch_instance.$$.fragment);
			attr(div0, "class", div0_class_value = /*$theme*/ ctx[1].eventBody);
			attr(div1, "class", /*classes*/ ctx[3]);
			attr(div1, "style", /*style*/ ctx[4]);
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div1, t);
			if (switch_instance) mount_component(switch_instance, div1, null);
			/*div1_binding*/ ctx[43](div1);
			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(setContent_action = setContent.call(null, div0, /*content*/ ctx[5])),
					listen(div1, "click", function () {
						if (is_function(/*createHandler*/ ctx[27](/*$eventClick*/ ctx[7], /*display*/ ctx[6]))) /*createHandler*/ ctx[27](/*$eventClick*/ ctx[7], /*display*/ ctx[6]).apply(this, arguments);
					}),
					listen(div1, "mouseenter", function () {
						if (is_function(/*createHandler*/ ctx[27](/*$eventMouseEnter*/ ctx[8], /*display*/ ctx[6]))) /*createHandler*/ ctx[27](/*$eventMouseEnter*/ ctx[8], /*display*/ ctx[6]).apply(this, arguments);
					}),
					listen(div1, "mouseleave", function () {
						if (is_function(/*createHandler*/ ctx[27](/*$eventMouseLeave*/ ctx[9], /*display*/ ctx[6]))) /*createHandler*/ ctx[27](/*$eventMouseLeave*/ ctx[9], /*display*/ ctx[6]).apply(this, arguments);
					}),
					listen(div1, "pointerdown", function () {
						if (is_function(!helperEvent(/*display*/ ctx[6]) && /*createDragHandler*/ ctx[28](/*$_interaction*/ ctx[10]))) (!helperEvent(/*display*/ ctx[6]) && /*createDragHandler*/ ctx[28](/*$_interaction*/ ctx[10])).apply(this, arguments);
					})
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (!current || dirty[0] & /*$theme*/ 2 && div0_class_value !== (div0_class_value = /*$theme*/ ctx[1].eventBody)) {
				attr(div0, "class", div0_class_value);
			}

			if (setContent_action && is_function(setContent_action.update) && dirty[0] & /*content*/ 32) setContent_action.update.call(null, /*content*/ ctx[5]);
			const switch_instance_changes = {};
			if (dirty[0] & /*event*/ 1) switch_instance_changes.event = /*event*/ ctx[0];

			if (dirty[0] & /*$_interaction*/ 1024 && switch_value !== (switch_value = /*$_interaction*/ ctx[10].resizer)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = construct_svelte_component(switch_value, switch_props(ctx));

					switch_instance.$on("pointerdown", function () {
						if (is_function(/*createDragHandler*/ ctx[28](/*$_interaction*/ ctx[10], true))) /*createDragHandler*/ ctx[28](/*$_interaction*/ ctx[10], true).apply(this, arguments);
					});

					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, div1, null);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}

			if (!current || dirty[0] & /*classes*/ 8) {
				attr(div1, "class", /*classes*/ ctx[3]);
			}

			if (!current || dirty[0] & /*style*/ 16) {
				attr(div1, "style", /*style*/ ctx[4]);
			}
		},
		i(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			if (switch_instance) destroy_component(switch_instance);
			/*div1_binding*/ ctx[43](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let $_view;
	let $eventDidMount;
	let $_intlEventTime;
	let $theme;
	let $eventContent;
	let $displayEventEnd;
	let $_classes;
	let $eventTextColor;
	let $_resTxtColor;
	let $eventColor;
	let $eventBackgroundColor;
	let $_resBgColor;
	let $eventClick;
	let $eventMouseEnter;
	let $eventMouseLeave;
	let $_interaction;
	let { chunk } = $$props;
	let { longChunks = {} } = $$props;
	let { displayEventEnd, eventBackgroundColor, eventTextColor, eventClick, eventColor, eventContent, eventDidMount, eventMouseEnter, eventMouseLeave, theme, _view, _intlEventTime, _interaction, _classes, _resBgColor, _resTxtColor } = getContext('state');
	component_subscribe($$self, displayEventEnd, value => $$invalidate(36, $displayEventEnd = value));
	component_subscribe($$self, eventBackgroundColor, value => $$invalidate(41, $eventBackgroundColor = value));
	component_subscribe($$self, eventTextColor, value => $$invalidate(38, $eventTextColor = value));
	component_subscribe($$self, eventClick, value => $$invalidate(7, $eventClick = value));
	component_subscribe($$self, eventColor, value => $$invalidate(40, $eventColor = value));
	component_subscribe($$self, eventContent, value => $$invalidate(35, $eventContent = value));
	component_subscribe($$self, eventDidMount, value => $$invalidate(45, $eventDidMount = value));
	component_subscribe($$self, eventMouseEnter, value => $$invalidate(8, $eventMouseEnter = value));
	component_subscribe($$self, eventMouseLeave, value => $$invalidate(9, $eventMouseLeave = value));
	component_subscribe($$self, theme, value => $$invalidate(1, $theme = value));
	component_subscribe($$self, _view, value => $$invalidate(33, $_view = value));
	component_subscribe($$self, _intlEventTime, value => $$invalidate(34, $_intlEventTime = value));
	component_subscribe($$self, _interaction, value => $$invalidate(10, $_interaction = value));
	component_subscribe($$self, _classes, value => $$invalidate(37, $_classes = value));
	component_subscribe($$self, _resBgColor, value => $$invalidate(42, $_resBgColor = value));
	component_subscribe($$self, _resTxtColor, value => $$invalidate(39, $_resTxtColor = value));
	createEventDispatcher();
	let el;
	let event;
	let classes;
	let style;
	let content;
	let timeText;
	let margin = 1;
	let display;

	onMount(() => {
		if (is_function($eventDidMount)) {
			$eventDidMount({
				event: toEventWithLocalDates(event),
				timeText,
				el,
				view: toViewWithLocalDates($_view)
			});
		}
	});

	function createHandler(fn, display) {
		return !helperEvent(display) && is_function(fn)
		? jsEvent => fn({
				event: toEventWithLocalDates(event),
				el,
				jsEvent,
				view: toViewWithLocalDates($_view)
			})
		: undefined;
	}

	function createDragHandler(interaction, resize) {
		return interaction.action
		? jsEvent => interaction.action.drag(event, jsEvent, resize)
		: undefined;
	}

	function reposition() {
		if (!el || previewEvent(display)) {
			return;
		}

		$$invalidate(32, margin = repositionEvent(chunk, longChunks, height(el)));
	}

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			el = $$value;
			$$invalidate(2, el);
		});
	}

	$$self.$$set = $$props => {
		if ('chunk' in $$props) $$invalidate(29, chunk = $$props.chunk);
		if ('longChunks' in $$props) $$invalidate(30, longChunks = $$props.longChunks);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*chunk*/ 536870912) {
			$$invalidate(0, event = chunk.event);
		}

		if ($$self.$$.dirty[0] & /*event, chunk, style, $theme*/ 536870931 | $$self.$$.dirty[1] & /*$_resBgColor, $eventBackgroundColor, $eventColor, $_resTxtColor, $eventTextColor, margin, $_classes*/ 4034) {
			{
				$$invalidate(6, display = event.display);

				// Class & Style
				let bgColor = event.backgroundColor || $_resBgColor(event) || $eventBackgroundColor || $eventColor;

				let txtColor = event.textColor || $_resTxtColor(event) || $eventTextColor;
				$$invalidate(4, style = `width:calc(${chunk.days * 100}% + ${(chunk.days - 1) * 7}px);` + `margin-top:${margin}px;`);

				if (bgColor) {
					$$invalidate(4, style += `background-color:${bgColor};`);
				}

				if (txtColor) {
					$$invalidate(4, style += `color:${txtColor};`);
				}

				$$invalidate(3, classes = $_classes($theme.event, event));
			}
		}

		if ($$self.$$.dirty[0] & /*chunk, $theme*/ 536870914 | $$self.$$.dirty[1] & /*$displayEventEnd, $eventContent, $_intlEventTime, $_view*/ 60) {
			// Content
			$$invalidate(5, [timeText, content] = createEventContent(chunk, $displayEventEnd, $eventContent, $theme, $_intlEventTime, $_view), content);
		}
	};

	return [
		event,
		$theme,
		el,
		classes,
		style,
		content,
		display,
		$eventClick,
		$eventMouseEnter,
		$eventMouseLeave,
		$_interaction,
		displayEventEnd,
		eventBackgroundColor,
		eventTextColor,
		eventClick,
		eventColor,
		eventContent,
		eventDidMount,
		eventMouseEnter,
		eventMouseLeave,
		theme,
		_view,
		_intlEventTime,
		_interaction,
		_classes,
		_resBgColor,
		_resTxtColor,
		createHandler,
		createDragHandler,
		chunk,
		longChunks,
		reposition,
		margin,
		$_view,
		$_intlEventTime,
		$eventContent,
		$displayEventEnd,
		$_classes,
		$eventTextColor,
		$_resTxtColor,
		$eventColor,
		$eventBackgroundColor,
		$_resBgColor,
		div1_binding
	];
}

class Event extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance$3,
			create_fragment$3,
			safe_not_equal,
			{
				chunk: 29,
				longChunks: 30,
				reposition: 31
			},
			null,
			[-1, -1]
		);
	}

	get reposition() {
		return this.$$.ctx[31];
	}
}

/* packages/time-grid/src/all-day/Day.svelte generated by Svelte v3.59.1 */

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[20] = list[i];
	child_ctx[21] = list;
	child_ctx[22] = i;
	return child_ctx;
}

// (67:4) {#if iChunks[0] && datesEqual(iChunks[0].date, date)}
function create_if_block$1(ctx) {
	let div;
	let event;
	let div_class_value;
	let current;
	event = new Event({ props: { chunk: /*iChunks*/ ctx[2][0] } });

	return {
		c() {
			div = element("div");
			create_component(event.$$.fragment);
			attr(div, "class", div_class_value = "" + (/*$theme*/ ctx[8].events + " " + /*$theme*/ ctx[8].preview));
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(event, div, null);
			current = true;
		},
		p(ctx, dirty) {
			const event_changes = {};
			if (dirty & /*iChunks*/ 4) event_changes.chunk = /*iChunks*/ ctx[2][0];
			event.$set(event_changes);

			if (!current || dirty & /*$theme*/ 256 && div_class_value !== (div_class_value = "" + (/*$theme*/ ctx[8].events + " " + /*$theme*/ ctx[8].preview))) {
				attr(div, "class", div_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(event.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(event.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(event);
		}
	};
}

// (73:8) {#each dayChunks as chunk, i (chunk.event)}
function create_each_block$2(key_1, ctx) {
	let first;
	let event;
	let i = /*i*/ ctx[22];
	let current;
	const assign_event = () => /*event_binding*/ ctx[17](event, i);
	const unassign_event = () => /*event_binding*/ ctx[17](null, i);

	let event_props = {
		chunk: /*chunk*/ ctx[20],
		longChunks: /*longChunks*/ ctx[1]
	};

	event = new Event({ props: event_props });
	assign_event();

	return {
		key: key_1,
		first: null,
		c() {
			first = empty();
			create_component(event.$$.fragment);
			this.first = first;
		},
		m(target, anchor) {
			insert(target, first, anchor);
			mount_component(event, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (i !== /*i*/ ctx[22]) {
				unassign_event();
				i = /*i*/ ctx[22];
				assign_event();
			}

			const event_changes = {};
			if (dirty & /*dayChunks*/ 16) event_changes.chunk = /*chunk*/ ctx[20];
			if (dirty & /*longChunks*/ 2) event_changes.longChunks = /*longChunks*/ ctx[1];
			event.$set(event_changes);
		},
		i(local) {
			if (current) return;
			transition_in(event.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(event.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(first);
			unassign_event();
			destroy_component(event, detaching);
		}
	};
}

function create_fragment$2(ctx) {
	let div1;
	let show_if = /*iChunks*/ ctx[2][0] && datesEqual(/*iChunks*/ ctx[2][0].date, /*date*/ ctx[0]);
	let t;
	let div0;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let div0_class_value;
	let div1_class_value;
	let current;
	let mounted;
	let dispose;
	let if_block = show_if && create_if_block$1(ctx);
	let each_value = /*dayChunks*/ ctx[4];
	const get_key = ctx => /*chunk*/ ctx[20].event;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$2(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
	}

	return {
		c() {
			div1 = element("div");
			if (if_block) if_block.c();
			t = space();
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div0, "class", div0_class_value = /*$theme*/ ctx[8].events);

			attr(div1, "class", div1_class_value = "" + (/*$theme*/ ctx[8].day + (/*isToday*/ ctx[5] ? ' ' + /*$theme*/ ctx[8].today : '') + (/*highlight*/ ctx[6]
			? ' ' + /*$theme*/ ctx[8].highlight
			: '')));
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			if (if_block) if_block.m(div1, null);
			append(div1, t);
			append(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			/*div1_binding*/ ctx[18](div1);
			current = true;

			if (!mounted) {
				dispose = [
					listen(window, "resize", /*reposition*/ ctx[13]),
					listen(div1, "pointerdown", function () {
						if (is_function(/*$_interaction*/ ctx[9].action?.select)) /*$_interaction*/ ctx[9].action?.select.apply(this, arguments);
					})
				];

				mounted = true;
			}
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;
			if (dirty & /*iChunks, date*/ 5) show_if = /*iChunks*/ ctx[2][0] && datesEqual(/*iChunks*/ ctx[2][0].date, /*date*/ ctx[0]);

			if (show_if) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*iChunks, date*/ 5) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div1, t);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (dirty & /*dayChunks, longChunks, refs*/ 146) {
				each_value = /*dayChunks*/ ctx[4];
				group_outros();
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
				check_outros();
			}

			if (!current || dirty & /*$theme*/ 256 && div0_class_value !== (div0_class_value = /*$theme*/ ctx[8].events)) {
				attr(div0, "class", div0_class_value);
			}

			if (!current || dirty & /*$theme, isToday, highlight*/ 352 && div1_class_value !== (div1_class_value = "" + (/*$theme*/ ctx[8].day + (/*isToday*/ ctx[5] ? ' ' + /*$theme*/ ctx[8].today : '') + (/*highlight*/ ctx[6]
			? ' ' + /*$theme*/ ctx[8].highlight
			: '')))) {
				attr(div1, "class", div1_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			transition_out(if_block);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			if (if_block) if_block.d();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			/*div1_binding*/ ctx[18](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let $highlightedDates;
	let $theme;
	let $_interaction;
	let { date } = $$props;
	let { chunks } = $$props;
	let { longChunks } = $$props;
	let { iChunks = [] } = $$props;
	let { resource = undefined } = $$props;
	let { highlightedDates, theme, _interaction } = getContext('state');
	component_subscribe($$self, highlightedDates, value => $$invalidate(16, $highlightedDates = value));
	component_subscribe($$self, theme, value => $$invalidate(8, $theme = value));
	component_subscribe($$self, _interaction, value => $$invalidate(9, $_interaction = value));
	let el;
	let dayChunks;
	let today = setMidnight(createDate());
	let isToday;
	let highlight;
	let refs = [];

	function reposition() {
		$$invalidate(7, refs.length = dayChunks.length, refs);

		for (let ref of refs) {
			ref && ref.reposition && ref.reposition();
		}
	}

	afterUpdate(reposition);

	function event_binding($$value, i) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			refs[i] = $$value;
			$$invalidate(7, refs);
		});
	}

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			el = $$value;
			$$invalidate(3, el);
		});
	}

	$$self.$$set = $$props => {
		if ('date' in $$props) $$invalidate(0, date = $$props.date);
		if ('chunks' in $$props) $$invalidate(14, chunks = $$props.chunks);
		if ('longChunks' in $$props) $$invalidate(1, longChunks = $$props.longChunks);
		if ('iChunks' in $$props) $$invalidate(2, iChunks = $$props.iChunks);
		if ('resource' in $$props) $$invalidate(15, resource = $$props.resource);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*chunks, date, dayChunks*/ 16401) {
			{
				$$invalidate(4, dayChunks = []);

				for (let chunk of chunks) {
					if (datesEqual(chunk.date, date)) {
						dayChunks.push(chunk);
					}
				}
			}
		}

		if ($$self.$$.dirty & /*date, $highlightedDates*/ 65537) {
			{
				$$invalidate(5, isToday = datesEqual(date, today));
				$$invalidate(6, highlight = $highlightedDates.some(d => datesEqual(d, date)));
			}
		}

		if ($$self.$$.dirty & /*el, date, resource*/ 32777) {
			// dateFromPoint
			if (el) {
				setPayload(el, () => ({ allDay: true, date, resource, dayEl: el }));
			}
		}
	};

	return [
		date,
		longChunks,
		iChunks,
		el,
		dayChunks,
		isToday,
		highlight,
		refs,
		$theme,
		$_interaction,
		highlightedDates,
		theme,
		_interaction,
		reposition,
		chunks,
		resource,
		$highlightedDates,
		event_binding,
		div1_binding
	];
}

class Day extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			date: 0,
			chunks: 14,
			longChunks: 1,
			iChunks: 2,
			resource: 15
		});
	}
}

/* packages/time-grid/src/all-day/Week.svelte generated by Svelte v3.59.1 */

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	return child_ctx;
}

// (44:0) {#each dates as date}
function create_each_block$1(ctx) {
	let day;
	let current;

	day = new Day({
			props: {
				date: /*date*/ ctx[14],
				chunks: /*chunks*/ ctx[2],
				longChunks: /*longChunks*/ ctx[3],
				iChunks: /*iChunks*/ ctx[4],
				resource: /*resource*/ ctx[1]
			}
		});

	return {
		c() {
			create_component(day.$$.fragment);
		},
		m(target, anchor) {
			mount_component(day, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const day_changes = {};
			if (dirty & /*dates*/ 1) day_changes.date = /*date*/ ctx[14];
			if (dirty & /*chunks*/ 4) day_changes.chunks = /*chunks*/ ctx[2];
			if (dirty & /*longChunks*/ 8) day_changes.longChunks = /*longChunks*/ ctx[3];
			if (dirty & /*iChunks*/ 16) day_changes.iChunks = /*iChunks*/ ctx[4];
			if (dirty & /*resource*/ 2) day_changes.resource = /*resource*/ ctx[1];
			day.$set(day_changes);
		},
		i(local) {
			if (current) return;
			transition_in(day.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(day.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(day, detaching);
		}
	};
}

function create_fragment$1(ctx) {
	let each_1_anchor;
	let current;
	let each_value = /*dates*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*dates, chunks, longChunks, iChunks, resource*/ 31) {
				each_value = /*dates*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let $hiddenDays;
	let $_iEvents;
	let $_events;
	let { dates } = $$props;
	let { resource = undefined } = $$props;
	let { _events, _iEvents, hiddenDays, theme } = getContext('state');
	component_subscribe($$self, _events, value => $$invalidate(12, $_events = value));
	component_subscribe($$self, _iEvents, value => $$invalidate(11, $_iEvents = value));
	component_subscribe($$self, hiddenDays, value => $$invalidate(10, $hiddenDays = value));
	let chunks, longChunks, iChunks = [];
	let start;
	let end;

	$$self.$$set = $$props => {
		if ('dates' in $$props) $$invalidate(0, dates = $$props.dates);
		if ('resource' in $$props) $$invalidate(1, resource = $$props.resource);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*dates*/ 1) {
			{
				$$invalidate(8, start = dates[0]);
				$$invalidate(9, end = addDay(cloneDate(dates[dates.length - 1])));
			}
		}

		if ($$self.$$.dirty & /*$_events, start, end, resource, chunks, $hiddenDays*/ 5894) {
			{
				$$invalidate(2, chunks = []);

				for (let event of $_events) {
					if (event.allDay && event.display !== 'background' && eventIntersects(event, start, end, resource)) {
						let chunk = createEventChunk(event, start, end);
						chunks.push(chunk);
					}
				}

				$$invalidate(3, longChunks = prepareEventChunks(chunks, $hiddenDays));
			}
		}

		if ($$self.$$.dirty & /*$_iEvents, start, end, resource, $hiddenDays*/ 3842) {
			$$invalidate(4, iChunks = $_iEvents.map(event => {
				let chunk;

				if (event && event.allDay && eventIntersects(event, start, end, resource)) {
					chunk = createEventChunk(event, start, end);
					prepareEventChunks([chunk], $hiddenDays);
				} else {
					chunk = null;
				}

				return chunk;
			}));
		}
	};

	return [
		dates,
		resource,
		chunks,
		longChunks,
		iChunks,
		_events,
		_iEvents,
		hiddenDays,
		start,
		end,
		$hiddenDays,
		$_iEvents,
		$_events
	];
}

class Week extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { dates: 0, resource: 1 });
	}
}

/* packages/time-grid/src/View.svelte generated by Svelte v3.59.1 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	return child_ctx;
}

// (19:8) {#each $_viewDates as date}
function create_each_block_1(ctx) {
	let div;
	let t_value = /*$_intlDayHeader*/ ctx[2].format(/*date*/ ctx[12]) + "";
	let t;
	let div_class_value;

	return {
		c() {
			div = element("div");
			t = text(t_value);
			attr(div, "class", div_class_value = /*$theme*/ ctx[0].day);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, dirty) {
			if (dirty & /*$_intlDayHeader, $_viewDates*/ 6 && t_value !== (t_value = /*$_intlDayHeader*/ ctx[2].format(/*date*/ ctx[12]) + "")) set_data(t, t_value);

			if (dirty & /*$theme*/ 1 && div_class_value !== (div_class_value = /*$theme*/ ctx[0].day)) {
				attr(div, "class", div_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (18:4) <Section>
function create_default_slot_2(ctx) {
	let each_1_anchor;
	let each_value_1 = /*$_viewDates*/ ctx[1];
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert(target, each_1_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*$theme, $_intlDayHeader, $_viewDates*/ 7) {
				each_value_1 = /*$_viewDates*/ ctx[1];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

// (25:0) {#if $allDaySlot}
function create_if_block(ctx) {
	let div2;
	let div1;
	let section;
	let t;
	let div0;
	let div0_class_value;
	let div1_class_value;
	let div2_class_value;
	let current;

	section = new Section({
			props: {
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			div2 = element("div");
			div1 = element("div");
			create_component(section.$$.fragment);
			t = space();
			div0 = element("div");
			attr(div0, "class", div0_class_value = /*$theme*/ ctx[0].hiddenScroll);
			attr(div1, "class", div1_class_value = /*$theme*/ ctx[0].content);
			attr(div2, "class", div2_class_value = /*$theme*/ ctx[0].allDay);
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div1);
			mount_component(section, div1, null);
			append(div1, t);
			append(div1, div0);
			current = true;
		},
		p(ctx, dirty) {
			const section_changes = {};

			if (dirty & /*$$scope, $_viewDates*/ 131074) {
				section_changes.$$scope = { dirty, ctx };
			}

			section.$set(section_changes);

			if (!current || dirty & /*$theme*/ 1 && div0_class_value !== (div0_class_value = /*$theme*/ ctx[0].hiddenScroll)) {
				attr(div0, "class", div0_class_value);
			}

			if (!current || dirty & /*$theme*/ 1 && div1_class_value !== (div1_class_value = /*$theme*/ ctx[0].content)) {
				attr(div1, "class", div1_class_value);
			}

			if (!current || dirty & /*$theme*/ 1 && div2_class_value !== (div2_class_value = /*$theme*/ ctx[0].allDay)) {
				attr(div2, "class", div2_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(section.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(section.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div2);
			destroy_component(section);
		}
	};
}

// (28:12) <Section>
function create_default_slot_1(ctx) {
	let week;
	let current;
	week = new Week({ props: { dates: /*$_viewDates*/ ctx[1] } });

	return {
		c() {
			create_component(week.$$.fragment);
		},
		m(target, anchor) {
			mount_component(week, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const week_changes = {};
			if (dirty & /*$_viewDates*/ 2) week_changes.dates = /*$_viewDates*/ ctx[1];
			week.$set(week_changes);
		},
		i(local) {
			if (current) return;
			transition_in(week.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(week.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(week, detaching);
		}
	};
}

// (36:0) {#each $_viewDates as date}
function create_each_block(ctx) {
	let day;
	let current;
	day = new Day$1({ props: { date: /*date*/ ctx[12] } });

	return {
		c() {
			create_component(day.$$.fragment);
		},
		m(target, anchor) {
			mount_component(day, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const day_changes = {};
			if (dirty & /*$_viewDates*/ 2) day_changes.date = /*date*/ ctx[12];
			day.$set(day_changes);
		},
		i(local) {
			if (current) return;
			transition_in(day.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(day.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(day, detaching);
		}
	};
}

// (35:0) <Body>
function create_default_slot(ctx) {
	let each_1_anchor;
	let current;
	let each_value = /*$_viewDates*/ ctx[1];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*$_viewDates*/ 2) {
				each_value = /*$_viewDates*/ ctx[1];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

function create_fragment(ctx) {
	let div1;
	let section;
	let t0;
	let div0;
	let div0_class_value;
	let div1_class_value;
	let t1;
	let t2;
	let body;
	let current;

	section = new Section({
			props: {
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			}
		});

	let if_block = /*$allDaySlot*/ ctx[3] && create_if_block(ctx);

	body = new Body({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			div1 = element("div");
			create_component(section.$$.fragment);
			t0 = space();
			div0 = element("div");
			t1 = space();
			if (if_block) if_block.c();
			t2 = space();
			create_component(body.$$.fragment);
			attr(div0, "class", div0_class_value = /*$theme*/ ctx[0].hiddenScroll);
			attr(div1, "class", div1_class_value = /*$theme*/ ctx[0].header);
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			mount_component(section, div1, null);
			append(div1, t0);
			append(div1, div0);
			insert(target, t1, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, t2, anchor);
			mount_component(body, target, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			const section_changes = {};

			if (dirty & /*$$scope, $_viewDates, $theme, $_intlDayHeader*/ 131079) {
				section_changes.$$scope = { dirty, ctx };
			}

			section.$set(section_changes);

			if (!current || dirty & /*$theme*/ 1 && div0_class_value !== (div0_class_value = /*$theme*/ ctx[0].hiddenScroll)) {
				attr(div0, "class", div0_class_value);
			}

			if (!current || dirty & /*$theme*/ 1 && div1_class_value !== (div1_class_value = /*$theme*/ ctx[0].header)) {
				attr(div1, "class", div1_class_value);
			}

			if (/*$allDaySlot*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$allDaySlot*/ 8) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(t2.parentNode, t2);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			const body_changes = {};

			if (dirty & /*$$scope, $_viewDates*/ 131074) {
				body_changes.$$scope = { dirty, ctx };
			}

			body.$set(body_changes);
		},
		i(local) {
			if (current) return;
			transition_in(section.$$.fragment, local);
			transition_in(if_block);
			transition_in(body.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(section.$$.fragment, local);
			transition_out(if_block);
			transition_out(body.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			destroy_component(section);
			if (detaching) detach(t1);
			if (if_block) if_block.d(detaching);
			if (detaching) detach(t2);
			destroy_component(body, detaching);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let $_viewClass;
	let $theme;
	let $_viewDates;
	let $_intlDayHeader;
	let $allDaySlot;
	let state = getContext('state');
	let { _viewDates, _intlDayHeader, _viewClass, _scrollable, allDaySlot, theme } = state;
	component_subscribe($$self, _viewDates, value => $$invalidate(1, $_viewDates = value));
	component_subscribe($$self, _intlDayHeader, value => $$invalidate(2, $_intlDayHeader = value));
	component_subscribe($$self, _viewClass, value => $$invalidate(9, $_viewClass = value));
	component_subscribe($$self, allDaySlot, value => $$invalidate(3, $allDaySlot = value));
	component_subscribe($$self, theme, value => $$invalidate(0, $theme = value));
	setContext('view-state', new State(state));
	set_store_value(_viewClass, $_viewClass = 'week', $_viewClass);

	return [
		$theme,
		$_viewDates,
		$_intlDayHeader,
		$allDaySlot,
		_viewDates,
		_intlDayHeader,
		_viewClass,
		allDaySlot,
		theme
	];
}

class View extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

var index = {
	createOptions(options) {
		// Common options
		options.buttonText.timeGridDay = 'day';
		options.buttonText.timeGridWeek = 'week';
		options.view = 'timeGridWeek';
		options.views.timeGridDay = {
			component: View,
			dayHeaderFormat: {weekday: 'long'},
			duration: {days: 1},
			titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
		};
		options.views.timeGridWeek = {
			component: View,
			duration: {weeks: 1}
		};
	}
};

export { Body, Day$1 as Day, Section, State, Week, index as default };
