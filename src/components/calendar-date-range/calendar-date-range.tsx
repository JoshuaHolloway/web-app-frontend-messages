import { useState, useEffect } from 'react';
import type { DateRangeTuple } from '@src/code/functions/dates/date-index';
import { date2Index, index2Date, start_of_time, initializeDateRange } from '@src/code/functions/dates/date-index';
import Calendar from './calendar';
import css from './calendar-date-range.module.scss';
import { leftMonth, months, getMonthInfo } from './date';
import type { DateDisplay, DateData, EventData } from './date';

// ==============================================

export default function CalendarDateRange(props: { setDateRange: any }) {
  // render_count++;
  // console.log('CalendarDateRange render, render-count', render_count);
  const calendar_title_center_width = 400;
  const calendar_title_padding = 55;
  const chevron_svg_size = 30;
  // --------------------------------------------

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, [mounted]);

  // --------------------------------------------
  // -Three click_num states:
  //  --0. Before first click
  //  --1.    After first (and odd-numbered) click(s)
  //  --2.    After second (and even-numbered) click(s)
  const [click_num, setClickNum] = useState(2);
  const [date_display, setDateDisplay] = useState<DateDisplay>({
    year_left: NaN,
    month_left: NaN,
    year_right: NaN,
    month_right: NaN,
    days_in_month_left: NaN,
    first_day_left: NaN,
    days_in_month_right: NaN,
    first_day_right: NaN,
  });

  const init_event = {
    index: NaN,
    idx: NaN,
    jdx: NaN,
    calendar_num: NaN,
    year: NaN,
    month: NaN,
    day: NaN,
    type: '',
  };
  const [click, setClick] = useState<EventData>({ ...init_event, type: 'click' });
  const [hover, setHover] = useState<EventData>({ ...init_event, type: 'hover' });

  const [ellipses_on, setEllipsesOn] = useState(false);

  const init_date = { year: NaN, month: NaN, day: NaN, calendar_num: NaN, index: NaN };
  const [date_0, setDate0] = useState<DateData>(init_date);
  const [date_1, setDate1] = useState<DateData>(init_date);

  // --------------------------------------------

  useEffect(() => {
    // -Run on page load

    // if (!date_display.month_left || !date_display.year_left) {
    const today = new Date();
    const m_r = today.getMonth();
    const y_r = today.getFullYear();
    const { y_l, m_l } = leftMonth(y_r, m_r);

    const { days_in_month: days_in_month_left, first_day: first_day_left } = getMonthInfo(y_l, m_l);
    const { days_in_month: days_in_month_right, first_day: first_day_right } = getMonthInfo(y_r, m_r);

    setDateDisplay({
      year_left: y_l,
      month_left: m_l,
      year_right: y_r,
      month_right: m_r,
      days_in_month_left,
      first_day_left,
      days_in_month_right,
      first_day_right,
    });
    // }

    // -This will set the date_range in the data.tsx file to the past week
    //  which triggers the useEffect(, [date_range]) callback
    // -date_range is used to make the SQL queries when grabbing the
    //  number of units sold of a specific product in a date range.
    // -We also want to set date_0 and date_1 here in calendar-date-range.tsx
    //  in order to display the initial date range in the calendar UI.
    // -Setting date_0 and date_1 here will udpate the child calendar
    //  components and render the date range in the appropriate calendar (left or right).
    const init_date_range: DateRangeTuple = initializeDateRange();
    props.setDateRange(init_date_range); // This is done in parent
    // -Need to do setDateRange in parent because if you place the calendar in a dropdown
    //  the calendar does not render until the dropdown is pressed!

    const [y0, m0, d0] = index2Date(init_date_range[0]); // one-week ago
    const [y1, m1, d1] = index2Date(init_date_range[1]); // today

    // TODO: apply correct index here:
    //  -

    console.log('d0: ', d0, '\tfirst_day_left: ', first_day_left);

    // -One week ago (d0) is possibly not in right calendar.
    // -If m0 === m1 then both (d0 and d1) are in right calendary.
    // -Else, m0 in left and m1 in right.
    setDate0({
      year: y0,
      month: m0,
      day: d0,
      calendar_num: m0 === m1 ? 1 : 0,
      index: m0 === m1 ? d0 + first_day_right - 1 : d0 + first_day_left - 1,
    }); // -On page load right-calendar contains current month
    setDate1({ year: y1, month: m1, day: d1, calendar_num: 1, index: d1 + first_day_right - 1 }); // Currently, (ON PAGE LOAD) left calendar contains current month

    // -TODO:
    //  1. Do not allow calenar to move further into the future beyond current month
    //  2. Do not allow calendar to move backward into past beyond jan 1 2021
    //  3. Do not let user click after today
    //  4. Do not allow user to click before jan 1 2021
    //  5. Only allow the user to select a maximum of two weeks!
  }, []);

  // --------------------------------------------

  useEffect(() => {
    // -This sets the date range to be sent for the HTTP requests in data.tsx (data page)
    // -This is set when the date_1 is set
    //    --Currently, date_1 is set upon the second click of the date-range in the calendar GUI.
    //    --We want the

    if (!isNaN(date_1.year)) {
      const d0 = date2Index({ y: date_0.year, m: date_0.month, d: date_0.day });
      const d1 = date2Index({ y: date_1.year, m: date_1.month, d: date_1.day });
      console.log('d0: ', d0, '\td1: ', d1);

      props.setDateRange([
        date2Index({ y: date_0.year, m: date_0.month, d: date_0.day }),
        date2Index({ y: date_1.year, m: date_1.month, d: date_1.day }),
      ]);
    }
  }, [date_1]);

  // --------------------------------------------

  const updateDateHandler =
    (type = 'increment') =>
    () => {
      // -Ensure that not trying to change to a date before the beginning of time

      // -Reset dates and click-num
      setDate0(init_date);
      setDate1(init_date);
      setClickNum(0);

      // -Reset month data for GUI and event-handling logic:
      let { month_right: m, year_right: y } = date_display;

      if (type === 'decrement') {
        if (0 <= m - 1) {
          m = m - 1;
        } else {
          y = y - 1;
          m = 11;
        }
        if (y === start_of_time.y && m <= start_of_time.m) {
          alert('You have no orders before Jan 1, 2021.');
          return;
        }
      } else if (type === 'increment') {
        if (m + 1 < 12) {
          m = m + 1;
        } else {
          m = 0; // jan following year
          y = y + 1;
        }
        const today = new Date();
        if (y === today.getFullYear() && m > today.getMonth()) {
          alert(
            `No orders have been placed in the future (beyond today: ${
              months[today.getMonth()]
            } ${today.getDate()}, ${today.getFullYear()}).`
          );
          return;
        }
      }
      const { y_l, m_l } = leftMonth(y, m);

      const { days_in_month: days_in_month_left, first_day: first_day_left } = getMonthInfo(y_l, m_l);
      const { days_in_month: days_in_month_right, first_day: first_day_right } = getMonthInfo(y, m);

      // -This triggers the useEffect(, [date_display])
      //  in the each Calendar component.
      // -The UI is reset there for each calendar.
      setDateDisplay({
        month_left: m_l,
        year_left: y_l,
        year_right: y,
        month_right: m,
        days_in_month_left,
        days_in_month_right,
        first_day_left,
        first_day_right,
      });
    };

  // --------------------------------------------

  return (
    <>
      <div style={{ width: 'fit-content' }}>
        <>
          <div
            style={{
              height: '100px',
              background: 'black',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
            }}
          >
            <div
              style={{
                // border: 'solid hotpink 2px',
                position: 'relative', // used to fix the month in the center so it does not move when the arrows are clicked
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <svg
                style={{ position: 'absolute', left: `${calendar_title_padding}px`, cursor: 'pointer' }}
                width={`${chevron_svg_size}`}
                height={`${chevron_svg_size}`}
                fill="currentColor"
                className="chevron-left"
                viewBox="0 0 16 16"
                onClick={updateDateHandler('decrement')}
              >
                <path
                  fillRule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                }}
              >
                <h3
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: `${calendar_title_center_width}px`,
                  }}
                >
                  <span>
                    {months[date_display.month_left]} {date_display.year_left}
                  </span>
                  <span>
                    {months[date_display.month_right]} {date_display.year_right}
                  </span>
                </h3>
              </div>

              <svg
                style={{ position: 'absolute', right: `${calendar_title_padding}px`, cursor: 'pointer' }}
                width={`${chevron_svg_size}`}
                height={`${chevron_svg_size}`}
                fill="currentColor"
                className="chevron-right"
                viewBox="0 0 16 16"
                onClick={updateDateHandler('increment')}
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </div>
          </div>
        </>

        <div className={css['calendar-containers']}>
          <Calendar
            calendar_num={0}
            month_data={{
              year: date_display.year_left,
              month: date_display.month_left,
              days_in_month: date_display.days_in_month_left,
              first_day: date_display.first_day_left,
            }}
            click={click}
            hover={hover}
            setClick={setClick}
            setHover={setHover}
            click_num={click_num}
            setClickNum={setClickNum}
            date_0={date_0}
            date_1={date_1}
            setDate0={setDate0}
            setDate1={setDate1}
            ellipses_on={ellipses_on}
            date_display={date_display}
            setEllipsesOn={setEllipsesOn}
          />

          <Calendar
            calendar_num={1}
            month_data={{
              year: date_display.year_right,
              month: date_display.month_right,
              days_in_month: date_display.days_in_month_right,
              first_day: date_display.first_day_right,
            }}
            click={click}
            hover={hover}
            setClick={setClick}
            setHover={setHover}
            click_num={click_num}
            setClickNum={setClickNum}
            date_0={date_0}
            date_1={date_1}
            setDate0={setDate0}
            setDate1={setDate1}
            ellipses_on={ellipses_on}
            date_display={date_display}
            setEllipsesOn={setEllipsesOn}
          />
        </div>
        <div className={css['display-container']}>
          <span className={css.date}>
            {!isNaN(date_0.month) && `${months[date_0?.month]} ${date_0?.day}, ${date_0?.year}`}
          </span>

          <span className={css.date}>&#8212; </span>

          <span className={css.date}>
            {!isNaN(date_1.month) && `${months[date_1?.month]} ${date_1?.day}, ${date_1?.year}`}
          </span>
        </div>
      </div>
    </>
  );

  // --------------------------------------------
}
