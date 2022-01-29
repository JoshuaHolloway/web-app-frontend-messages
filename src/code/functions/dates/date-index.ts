type DateRangeTuple = [number, number];

interface DateObj {
  y: number;
  m: number;
  d: number;
}

interface TimeObj {
  h: number;
  m: number;
}

// ==============================================

const start_of_time: DateObj = { y: 2021, m: 0, d: 1 }; //'1/1/2020';

// ==============================================

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ==============================================

const initializeDateRange = (): DateRangeTuple => {
  const today = new Date();
  const m = today.getMonth();
  const y = today.getFullYear();
  const d = today.getDate();

  const one_week_ago = new Date();
  one_week_ago.setDate(one_week_ago.getDate() - 6); // one-week sucka

  const y_past = one_week_ago.getFullYear();
  const m_past = one_week_ago.getMonth();
  const d_past = one_week_ago.getDate();
  const date_index_lo = date2Index({ y: y_past, m: m_past, d: d_past });
  // console.log('date_index_lo: ', date_index_lo);

  const date_index_hi = date2Index({ y, m, d });
  // console.log('date_index_hi: ', date_index_hi);

  return [date_index_lo, date_index_hi];
};

// ==============================================

// [0, 60 * 24 = 1440)
const time2Index = (time: TimeObj): number => 60 * time.h + time.m; // 60 is number of cols, h is row-index, m is col-index

// ==============================================

const dateTimeIndices2Index = ({ date_index, time_index }: { date_index: number; time_index: number }): number =>
  date_index * 24 * 60 + time_index;

// ==============================================

const index2DateTimeIndices = (dt_index: number): { date_index: number; time_index: number } => {
  const date_index = Math.floor(dt_index / (24 * 60));
  const time_index = dt_index - date_index * 24 * 60;
  return { date_index, time_index };
};

// ==============================================

// -Main function (new Date(y, m, d) -> date_time_index)
const dateTime2Index = (date: Date = new Date()) => {
  const [y, m, d] = [date.getFullYear(), date.getMonth(), date.getDate()];
  const [hr, min] = [date.getHours(), date.getMinutes()];

  const date_index = date2Index({ y, m, d });
  const time_index = time2Index({ h: hr, m: min });

  return dateTimeIndices2Index({ date_index, time_index });
};

// ==============================================

// Main inverse function
const index2DateTime = (index: number) => {
  const { date_index, time_index } = index2DateTimeIndices(index);

  const [y, m, d] = index2Date(date_index);
  const [hr, min] = index2Time(time_index);

  return { y, m, d, hr, min };
};

// ==============================================

const date2Index = (date: DateObj): number => {
  return getNumberOfDays(start_of_time, date);
};

// ==============================================

const dateIndexOfToday = (): number => {
  const today = new Date();
  return date2Index({ y: today.getDate(), m: today.getMonth(), d: today.getDate() });
};

// ==============================================

const timeIndexOfToday = (): number => {
  const today = new Date();
  return time2Index({ h: today.getHours(), m: today.getMinutes() });
};

// ==============================================

// const debuggingDateTimeOfToday = (): string => {
//   const today = new Date();
//   return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()} @ ${today.getHours()}:${today.getMinutes()}`;
// };

// ==============================================

const index2Time = (index: number) => {
  let hr = Math.floor(index / 60);
  let min = index - hr * 60;
  return [hr, min];
};

// ==============================================

const index2Date = (index: number) => {
  const { y, m, d } = start_of_time;
  const date = new Date(y, m, d);
  date.setDate(date.getDate() + index);
  return [date.getFullYear(), date.getMonth(), date.getDate()];
};

// ==============================================

const getDateRange = (date_lo: DateObj, date_hi: DateObj): DateRangeTuple => {
  const date_index_lo = date2Index(date_lo);
  // console.log('date_index_lo: ', date_index_lo);

  const date_index_hi = date2Index(date_hi);
  // console.log('date_index_hi: ', date_index_hi);

  return [date_index_lo, date_index_hi];
};

// ==============================================

const getNumberOfDays = ({ y: y0, m: m0, d: d0 }: DateObj, { y: y1, m: m1, d: d1 }: DateObj) => {
  const date1 = new Date(y0, m0, d0);
  const date2 = new Date(y1, m1, d1);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
};
// ==============================================

const getFirstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

// ==============================================

const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

// ==============================================

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#sequence_generator_range
const range = (start: number, stop: number, step: number = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

// ==============================================
export type { DateRangeTuple, DateObj };

export {
  initializeDateRange,
  getNumberOfDays,
  getDateRange,
  dateTime2Index,
  index2DateTime,
  time2Index,
  date2Index,
  dateIndexOfToday,
  timeIndexOfToday,
  // dateTimeIndex,
  index2Time,
  index2Date,
  start_of_time,
  getFirstDay,
  getDaysInMonth,
  days,
  months,
  range,
};
