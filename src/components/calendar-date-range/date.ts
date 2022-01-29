// ==============================================

interface DateDisplay {
  year_left: number;
  month_left: number;
  year_right: number;
  month_right: number;
  days_in_month_left: number;
  first_day_left: number;
  days_in_month_right: number;
  first_day_right: number;
}

interface DateData {
  year: number;
  month: number;
  day: number;
  calendar_num: number;
  index: number;
}

interface EventData {
  index: number; // 1D-index [idx * 7(cols) + jdx]
  idx: number; // 2D-index (y-dimension) [Math.floor(index / 7(cols))]
  jdx: number; // 2D-index (x-dimension) [index % 7(cols)]
  calendar_num: number; // calendar number the event occurred in
  year: number;
  month: number;
  day: number;
  type: string;
}

// ==============================================

const getFirstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

// ==============================================

const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

// ==============================================

const getMonthInfo = (y: number, m: number) => {
  // Input:
  //  y (year):   number
  //  m (month):  number [zero-indexed]
  //
  // Output:
  //  { days_in_month, first_day}
  //  -days_in_month: number  - number of days in a specific month
  //  -first_day:     string  - the col-index the 1st day of the month occurs on (0: sun, 1: mon, ..., 6: sat)

  const first_day = getFirstDay(y, m);
  // const first_day_str = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][first_day];

  const days_in_month = getDaysInMonth(y, m);

  return { days_in_month, first_day };
};

// ==============================================

const lin_index = (idx: number, jdx: number) => idx * 7 + jdx;

// ==============================================

// -2D-indices to date
const indices2day = (idx: number, jdx: number, year: number, month: number) => {
  const { first_day, days_in_month } = getMonthInfo(year, month);

  // 7 = num-days-in-week === num elements in each row
  const lin_index = idx * 7 + jdx;
  const d = lin_index - first_day + 1;
  // -days are 1-based
  // -this indexing is zero-based
  // -adjust by adding 1
  // -without the +1 the first day of the month is labeld as zero

  const is_valid = 0 < d && d <= days_in_month;
  return { is_valid, lin_index, d };
};
// ==============================================

// -Date to 1D-index
const day2index = (year: number, month: number, day: number) => {
  const { first_day } = getMonthInfo(year, month);
  return first_day + day - 1;
};

// ==============================================

const leftMonth = (y: number, m: number) => {
  if (0 <= m - 1) {
    m = m - 1;
  } else {
    y = y - 1;
    m = 11;
  }
  return { y_l: y, m_l: m };
};

// ==============================================

// const rightMonth = (year: number, month: number) => {
//   const month_right = (month + 1) % 12;
//   const year_right = month_right === 0 ? year + 1 : year;

//   return { month_right, year_right };
// };

// ==============================================

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ==============================================

export type { DateDisplay, DateData, EventData };
export { getMonthInfo, days, months, indices2day, day2index, lin_index, leftMonth };
