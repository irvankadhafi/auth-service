export function formatTimeRFC3339(date: Date): string {
    if (!date) {
        return '';
    }

    const isoString = date.toISOString();
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    const nanoseconds = '000000';

    return isoString.replace(/\.\d{3}Z$/, `.${milliseconds}${nanoseconds}Z`);
}