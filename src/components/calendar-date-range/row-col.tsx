import css from './calendar.module.scss';
import type { EventData } from './date';
import { indices2day, day2index } from './date';

// ==============================================

const Row = (props: { children: JSX.Element }) => <div className={css.row}>{props.children}</div>;

// ==============================================

// let render_count = 0;

// ==============================================

const Col = (props: {
  calendar_num: number;
  idx: number;
  jdx: number;
  setHover: (hover: EventData) => void;
  setClick: (click: EventData) => void;
  classes: string[];
  month_data: { year: number; month: number; days_in_month: number; first_day: number };
  ellipses_on: boolean;
  click_num: number;
}) => {
  // render_count++;
  // console.log(`Col (idx=${props.idx}, jdx=${props.jdx}) render-count: ${render_count}`);

  // --------------------------------------------

  const {
    d: day,
    lin_index,
    is_valid,
  } = indices2day(props.idx, props.jdx, props.month_data.year, props.month_data.month);

  const { year, month } = props.month_data;
  const { idx, jdx, calendar_num, click_num } = props;

  // --------------------------------------------

  const clickCallback = () => {
    props.setClick({
      index: lin_index,
      idx,
      jdx,
      calendar_num,
      year,
      month,
      day,
      type: 'click',
    });
  };

  // --------------------------------------------

  const hoverCallback = () => {
    props.setHover({ index: lin_index, idx, jdx, calendar_num, year, month, day, type: 'hover' });
  };

  const hoverOffCalendarCallback = () => {
    props.setHover({
      index: NaN,
      idx: NaN,
      jdx: NaN,
      calendar_num: NaN,
      year: NaN,
      month: NaN,
      day: NaN,
      type: 'hover',
    });
  };

  // --------------------------------------------

  const is_in_future = () => {
    // -Because we restrict the calendar months to not go into the future
    //  we are certain the current month is always in the right calendar.
    // -Therefore, we can simply only apply this logic to the right calendar.

    const today = new Date();
    if (calendar_num === 1 && month === today.getMonth()) {
      const today_index = day2index(today.getFullYear(), today.getMonth(), today.getDate());
      return lin_index > today_index ? true : false;
    } else {
      return false;
    }
  };

  // --------------------------------------------

  const clickHandler = (is_valid && !is_in_future()) || click_num === 2 ? clickCallback : () => undefined;
  const hoverHandler = is_valid && !is_in_future() ? hoverCallback : () => undefined;

  const hoverExitCalendarHandler = click_num === 0 ? hoverOffCalendarCallback : () => undefined;

  // --------------------------------------------

  const { first_day, days_in_month } = props.month_data;

  let display_ellipses: boolean = false;
  if (props.ellipses_on) {
    if (calendar_num === 1 && first_day !== 0 && lin_index === first_day - 1) {
      display_ellipses = true;
    } else if (calendar_num === 0 && lin_index === days_in_month + first_day) {
      display_ellipses = true;
    }
  }

  // --------------------------------------------

  return (
    <div
      className={`${props.classes[lin_index] || css.col} ${is_in_future() && css.future}`}
      onMouseOver={hoverHandler}
      onMouseLeave={hoverExitCalendarHandler}
      onClick={clickHandler}
      onFocus={clickHandler}
      role="presentation"
      style={{ position: 'relative' }}
    >
      <>
        {is_valid && day}
        {display_ellipses && (
          <div className={css.ellipses_container}>
            <div className={css.ellipses}></div>
            <div className={css.ellipses}></div>
            <div className={css.ellipses}></div>
          </div>
        )}
        {/* <p>{props.month_data.month}</p> */}
        {/* <p>{props.calendar_num}</p> */}
        {/* <p>{props.month_data.days_in_month}</p> */}
      </>
    </div>
  );

  // --------------------------------------------
}; // <Col />

export { Row, Col };
