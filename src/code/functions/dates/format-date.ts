// const formatTime_12hr = (time: string) => {
//   // 2022-01-01T06:00:00.000Z  =>  2022-01-01
//   // console.log('time:\n', time);

//   // TODO: Fix the 12 & 24-o'clock hour edge case

//   return (
//     time &&
//     `${String(Number(time.split(':')[0]) % 12).padStart(2, '0')}:${time.split(':')[1]} ${
//       Number(time.split(':')[0]) >= 12 ? 'PM' : 'AM'
//     }`
//   );
// };

// ==============================================

const formatTime_12hr = (time: string) => {
  // xx:yy

  if (time) {
    const time_split = time.split(':');
    const { hr_12, period } = twentyFour2Twelve(Number(time_split[0]));

    return `${hr_12}:${time_split[1]} ${period}`;
  } else return null;
};

// ==============================================

const zero2oneBasedMonth = (date: string) => {
  // 2022-11-01  =>  2022-12-01
  if (date) {
    const split = date.split('-');
    const one_based_month = Number(split[1]) + 1;
    return `${split[0]}-${one_based_month}-${split[2]}`;
  } else return null;
};

// ==============================================

const formatDate = (date: string) => {
  // 2022-01-01T06:00:00.000Z  =>  2022-01-01
  // console.log('date:\n', date);
  return date && date.split('T')[0];
};

// ==============================================

const twentyFour2Twelve = (hr_24: number): { hr_12: number; period: string } => {
  // Input  [number]: 12
  // Output [string]: '12 AM'

  const time_mod = hr_24 % 12;
  const hr_12 = time_mod === 0 ? 12 : time_mod;
  const period = hr_24 / 12 < 1 ? 'AM' : 'PM';

  return { hr_12, period };
};

// ==============================================

const formatDateAndTime = (date_time: string) => {
  // 2022-01-01T06:00:00.000Z  =>  2022-01-01
  // console.log('date:\n', date);

  const splitted = date_time.split('T');
  // console.log('splitted: ', splitted);

  const date = splitted[0];
  const time = splitted[1];
  const times = time.split(':');
  // console.log('times: ', times);

  const sec = times[2].split('.')[0];
  // console.log('sec: ', sec);

  const min = times[1];
  // console.log('min: ', min);

  const hr = twentyFour2Twelve(Number(times[0]));
  // console.log('hr: ', hr);

  return `${date} @ ${hr.hr_12}:${min}:${sec} ${hr.period}`;
};

// ==============================================

const zeroPad = (x: number) => String(x).padStart(2, '0');

// ==============================================

export { formatTime_12hr, formatDate, formatDateAndTime, zero2oneBasedMonth, twentyFour2Twelve, zeroPad };
