export function getLocaleDefaults() {
    return {
        weekdays: ['Sø', 'Ma', 'Ti', 'On', 'To', 'Fr', 'Lø'],
        months: [
            'Januar',
            'Februar',
            'Marts',
            'April',
            'Maj',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'December',
        ],
        weekStartsOn: 1,
    };
}
export function getInnerLocale(locale = {}) {
    const innerLocale = getLocaleDefaults();
    if (typeof locale.weekStartsOn === 'number') {
        innerLocale.weekStartsOn = locale.weekStartsOn;
    }
    if (locale.months)
        innerLocale.months = locale.months;
    if (locale.weekdays)
        innerLocale.weekdays = locale.weekdays;
    return innerLocale;
}
/** Create a Locale from a date-fns locale */
export function localeFromDateFnsLocale(dateFnsLocale) {
    const locale = getLocaleDefaults();
    if (typeof dateFnsLocale?.options?.weekStartsOn === 'number') {
        locale.weekStartsOn = dateFnsLocale.options.weekStartsOn;
    }
    if (dateFnsLocale.localize) {
        for (let i = 0; i < 7; i++) {
            // widths: narrow, short, abbreviated, wide, any
            locale.weekdays[i] = dateFnsLocale.localize.day(i, { width: 'short' });
        }
        for (let i = 0; i < 12; i++) {
            locale.months[i] = dateFnsLocale.localize.month(i, { width: 'wide' });
        }
    }
    return locale;
}
