import { TimeString, DateString } from '@/shared-kernel';

export function getTimeStringFromDate(date = new Date(0)): TimeString {
  const hrs = String(date.getUTCHours()).padStart(2, '0');
  const mins = String(date.getUTCMinutes()).padStart(2, '0');

  const timeStringArr = [hrs, mins];

  return timeStringArr.join(':');
}

export function getDateStringFromDate(
  date = new Date(),
  timeZone = 'Europe/Moscow',
): DateString {
  date = new Date(date.toLocaleString('en-US', { timeZone }));

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${day}.${month}.${year}`;
}

export function getDateFromTimeString(timeString: TimeString): Date {
  const date = new Date(0);
  const [hrs = 0, mins = 0] = timeString.split(':');

  date.setUTCHours(Number(hrs));
  date.setUTCMinutes(Number(mins));

  return date;
}
