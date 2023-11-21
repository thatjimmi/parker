<script>
  import { fly } from 'svelte/transition'
  import { cubicInOut } from 'svelte/easing'
  import { toText } from './date-utils'
  import { parse, createFormat } from './parse'
  import '../../style.css'
  import DateTimePicker from './DatePicker.svelte'
  import { writable } from 'svelte/store'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  const defaultDate = new Date()
  const innerStore = writable(null)
  export let styling = ''
  const store = (() => {
    return {
      subscribe: innerStore.subscribe,
      set: (d) => {
        if (d === null) {
          innerStore.set(null)
          value = d
        } else if (d.getTime() !== $innerStore?.getTime()) {
          innerStore.set(d)
          value = d
        }
      },
    }
  })()
  export let value = null
  $: store.set(value)
  export let min = new Date(defaultDate.getFullYear() - 20, 0, 1)
  export let max = new Date(defaultDate.getFullYear(), 11, 31, 23, 59, 59, 999)
  export let placeholder = '31/05-2023'
  export let valid = true
  export let disabled = false
  export let format = 'dd/MM-yyyy'

  // export let format = 'den dd. i MM yyyy'
  let formatTokens = createFormat(format)
  $: formatTokens = createFormat(format)
  export let locale = {}
  function valueUpdate(value2, formatTokens2) {
    text = toText(value2, formatTokens2)
  }
  $: valueUpdate($store, formatTokens)
  export let text = toText($store, formatTokens)
  let textHistory = [text, text]
  $: textHistory = [textHistory[1], text]
  function textUpdate(text2, formatTokens2) {
    if (text2.length) {
      const result = parse(text2, formatTokens2, $store)
      if (result.date !== null) {
        valid = true
        store.set(result.date)
      } else {
        valid = false
      }
    } else {
      valid = true
      if (value) {
        value = null
        store.set(null)
      }
    }
  }
  $: textUpdate(text, formatTokens)
  function input(e) {
    if (
      e instanceof InputEvent &&
      e.inputType === 'insertText' &&
      typeof e.data === 'string' &&
      text === textHistory[0] + e.data
    ) {
      let result = parse(textHistory[0], formatTokens, $store)
      if (result.missingPunctuation !== '' && !result.missingPunctuation.startsWith(e.data)) {
        text = textHistory[0] + result.missingPunctuation + e.data
      }
    }
  }
  export let visible = false
  export let closeOnSelection = true
  export let browseWithoutSelecting = false
  function onFocusOut(e) {
    if (
      e?.currentTarget instanceof HTMLElement &&
      e.relatedTarget &&
      e.relatedTarget instanceof Node &&
      e.currentTarget.contains(e.relatedTarget)
    ) {
      return
    } else {
      visible = false
    }
  }
  function keydown(e) {
    if (e.key === 'Escape' && visible) {
      visible = false
      e.preventDefault()
      e.stopPropagation()
    } else if (e.key === 'Enter') {
      visible = !visible
      e.preventDefault()
    }
  }
  function onSelect(e) {
    dispatch('select', e.detail)
    if (closeOnSelection) {
      visible = false
    }
  }

  function formatDate(date) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    const formatter = new Intl.DateTimeFormat('da-DK', options)

    const formattedDate = formatter.format(date)

    const replace = formattedDate.replace(/\//g, '-')
    // first letter uppercase
    return replace.charAt(0).toUpperCase() + replace.slice(1)
  }

  function parseAndFormatDate(timeString) {
    const date = new Date(timeString)
    return formatDate(date)
  }
</script>

<div class="date-time-field" on:focusout={onFocusOut} on:keydown={keydown}>
  <input
    class:invalid={!valid}
    type="text"
    bind:value={text}
    {placeholder}
    {disabled}
    on:focus={() => (visible = true)}
    on:mousedown={() => (visible = true)}
    on:input={input}
    class={styling}
  />
  {#if visible && !disabled}
    <div class="picker" class:visible transition:fly={{ duration: 80, easing: cubicInOut, y: -5 }}>
      <DateTimePicker
        on:focusout={onFocusOut}
        on:select={onSelect}
        bind:value={$store}
        {min}
        {max}
        {locale}
        {browseWithoutSelecting}
        styling="bg-white"
      />
    </div>
  {/if}
</div>

<style>
  .date-time-field {
    position: relative;
  }

  input {
    min-width: 0px;
    box-sizing: border-box;
    padding: 4px 6px;
    margin: 0px;
    border: 1px solid rgba(103, 113, 137, 0.3);
    border-radius: 6px;
    outline: none;
    transition: all 80ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  input:focus {
    border-color: var(--date-picker-highlight-border, #0269f7);
    box-shadow: 0px 0px 0px 2px var(--date-picker-highlight-shadow, rgba(2, 105, 247, 0.4));
  }
  input:disabled {
    opacity: 0.5;
  }

  .invalid {
    border: 1px solid rgba(249, 47, 114, 0.5);
    background-color: rgba(249, 47, 114, 0.1);
  }
  .invalid:focus {
    border-color: #f92f72;
    box-shadow: 0px 0px 0px 2px rgba(249, 47, 114, 0.5);
  }

  .picker {
    display: none;
    position: absolute;
    margin-top: 1px;
    margin: auto;
    right: 0;
    left: 0;
    z-index: 10;
    border: 2px solid var(--date-picker-highlight-border, #dddddd);
    border-radius: 6px;
    padding-top: 8px;
  }
  .picker.visible {
    display: block;
  }
</style>
