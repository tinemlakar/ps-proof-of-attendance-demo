import dayjs from 'dayjs';

/**
 * @url https://day.js.org/docs/en/display/format
 */
export function getFormattedDate(ts: number | string, format = 'DD/MM/YY') {
  const date = dayjs(ts);
  if (!date || !date.isValid()) {
    return '';
  }
  return date.format(format);
}

export function datetimeToDateAndTime(datetime: string): string {
  if (!datetime) return '';

  return dateToDateTime(new Date(datetime));
}

export function dateToDateTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return date.toLocaleDateString('en-us', options);
}

export function msToTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);

  // Total number of minutes in the difference
  const totalMinutes = Math.floor(totalSeconds / 60);

  // Total number of hours in the difference
  const totalHours = Math.floor(totalMinutes / 60);

  // Getting the number of seconds left in one minute
  const remSeconds = totalSeconds % 60;

  // Getting the number of minutes left in one hour
  const remMinutes = totalMinutes % 60;

  return `${totalHours}:${remMinutes}:${remSeconds}`;
}
