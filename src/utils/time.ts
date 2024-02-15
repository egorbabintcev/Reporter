import { TimeString, DateString } from '@/shared-kernel';
import dayjs, { Dayjs } from 'dayjs';

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

export function getDateFromTimeString(timeString: TimeString): Dayjs {
  let date = dayjs(0).utc();
  const [hrs = 0, mins = 0] = timeString.split(':');

  date = date.hour(Number(hrs));
  date = date.minute(Number(mins));

  return date;
}

export function timeStringFormatter(str: string): TimeString {
  str = str.replace(/\D/g, '');
  let hours = str.slice(0, 2);
  let minutes = str.slice(2, 4);

  if (Number(hours) > 23) hours = '23';
  if (Number(minutes) > 59) minutes = '59';

  if (str.length > 2) str = `${hours}:${minutes}`;
  if (str.length > 5) str = str.slice(0, 5);

  return str;
}

export const MILLISECOND = 1;
export const SECOND = MILLISECOND * 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
