import { useState, useEffect } from 'react';
import css from './calendar.module.scss';
import type { EventData, DateData, DateDisplay } from './date';
import { days } from './date';
import { Row, Col } from './row-col';

// ==============================================

interface Props {
  calendar_num: number;
  month_data: { year: number; month: number; days_in_month: number; first_day: number };

  click: EventData;
  hover: EventData;

  setHover: (hover: EventData) => void;
  setClick: (click: EventData) => void;

  click_num: number;
  setClickNum: any; // (n: number) => void;

  date_0: DateData;
  setDate0: (date: DateData) => void;

  date_1: DateData;
  setDate1: (date: DateData) => void;

  ellipses_on: boolean;

  date_display: DateDisplay;
  setEllipsesOn: (x: boolean) => void;
}

// ==============================================

// let render_count = 0;

// ==============================================

export default function Calendar(props: Props) {
  // render_count++;
  // console.log('Calendar render-count: ', render_count++);

  // --------------------------------------------

  const [classes, setClasses] = useState<string[]>([]);

  // --------------------------------------------

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, [mounted]);

  // --------------------------------------------

  const resetUI = () => {
    const new_classes = [...classes];
    const N = new_classes.length; // 6-rows, 7-cols
    for (let i = 0; i < N; ++i) new_classes[i] = css.col;
    return new_classes;
  };

  // --------------------------------------------

  const updateUI = (
    event: EventData // props.click or props.hover
  ) => {
    // const N = 6 * 7; // 6-rows, 7-cols
    // let new_classes = new Array(N);
    // let new_classes = [...classes];
    let new_classes = resetUI();

    const drawMiddle = (start: number, end: number) => {
      // -Draw middle of range between (start, end) [exclusive]
      for (let i = start + 1; i < end; ++i) {
        new_classes[i] = css.middle;
      }
    };

    const drawStart = (index: number) => {
      new_classes[index] = css.start;
    };

    const drawEnd = (index: number) => {
      new_classes[index] = css.end;
    };

    const drawSingle = (index: number) => {
      new_classes[index] = css.single;
    };

    if (props.click_num === 0) {
      // -Case 0: Single
      if (props.calendar_num === event.calendar_num) {
        drawSingle(event.index);
      }
      setClasses(new_classes); // update local classes
    } else if (props.click_num === 1) {
      // -Case 1: Range
      if (props.date_0.calendar_num === event.calendar_num) {
        // console.log('Case 1.A');
        // -Case 1.A: Same calendar
        if (props.calendar_num === event.calendar_num) {
          // -remove ellipses (for hover moving from one calendar to the other one)
          props.setEllipsesOn(false);

          // -Restrict update of UI to the calendar the date range is in
          if (props.date_0.index < event.index) {
            // -Case 1.A.1: date_0.index < event.index
            // console.log('case 1.A.1: date_0.index < event.index');
            const start = props.date_0.index;
            const end = event.index;
            drawMiddle(start, end);
            drawStart(start);
            drawEnd(end);
          } else if (props.date_0.index > event.index) {
            // -Case 1.A.2: date_0.index > event.index
            // console.log('case 1.A.2: date_0.index > event.index');
            const end = props.date_0.index;
            const start = event.index;
            drawMiddle(start, end);
            drawStart(start);
            drawEnd(end);
          } else if (props.date_0.index === event.index) {
            // console.log('case 1.A.3: date_0.index === event.index');
            drawSingle(event.index);
          }
        }
      } else if (props.date_0.calendar_num === 0 && event.calendar_num === 1) {
        // console.log('Case 1.B: date_0 in left calendar, click in right calendar');

        // -Turn ellipses on:
        props.setEllipsesOn(true);

        if (props.calendar_num === 0) {
          // -Left Calendar:
          // console.log('Case 1.B.LEFT');
          const start = props.date_0.index;
          const end = props.date_display.days_in_month_left + props.date_display.first_day_left;
          drawStart(start);
          drawMiddle(start, end); // middle exclusive on end => +1
        } else if (props.calendar_num === 1) {
          // -Right Calendar:
          // console.log('Case 1.B.RIGHT');
          const start = props.date_display.first_day_right;
          const end = event.index;
          drawMiddle(start - 1, end); // apply 'middle' class to start inclusive (=> -1)
          drawEnd(end);
        }
      } else if (props.date_0.calendar_num === 1 && event.calendar_num === 0) {
        // console.log('Case 1.C: date_0 in right calendar, click in left calendar');

        // -Turn ellipses on:
        props.setEllipsesOn(true);

        if (props.calendar_num === 0) {
          // -Left Calendar:
          // console.log('Case 1.C.LEFT');
          const end = props.date_display.first_day_left + props.date_display.days_in_month_left;
          const start = event.index;

          drawStart(start);
          drawMiddle(start, end); // middle exclusive on end => +1
        } else if (props.calendar_num === 1) {
          // -Right Calendar:
          // console.log('Case 1.C.RIGHT');
          const end = props.date_0.index;
          const start = props.date_display.first_day_right;
          drawMiddle(start - 1, end); // apply 'middle' class to start inclusive (=> -1)
          drawEnd(end);
        }
      }
      setClasses(new_classes); // update local classes
    } else if (props.click_num === 2) {
      // -Case 2: Reset UI
      props.setEllipsesOn(false);
      setClasses(new_classes); // update local classes
    }
  };

  // --------------------------------------------

  // -If date_display changes (via arrows in parent)
  //  reset the UI.
  useEffect(() => {
    if (mounted) {
      setClasses(resetUI());
      props.setEllipsesOn(false);
    }
  }, [props.date_display]);

  // --------------------------------------------

  const [is_initial_date_range, setIsInitialDateRange] = useState(true);

  useEffect(() => {
    // -Redundant work done here because we call
    //  the updateUI on the second click to end
    //  the date range selection, but I need to
    //  update UI upon initial page load and
    //  forgot to design the component to display
    //  the inital date range!
    // -TODO: Refactor to include this in the
    //  main logic without redundant renders!
    if (is_initial_date_range && !isNaN(props.date_1.day) && props.date_1.calendar_num === props.calendar_num) {
      let new_classes = resetUI();

      const drawMiddle = (start: number, end: number) => {
        // -Draw middle of range between (start, end) [exclusive]
        for (let i = start + 1; i < end; ++i) {
          new_classes[i] = css.middle;
        }
      };

      const drawStart = (index: number) => {
        new_classes[index] = css.start;
      };

      const drawEnd = (index: number) => {
        new_classes[index] = css.end;
      };

      const drawSingle = (index: number) => {
        new_classes[index] = css.single;
      };

      const start = props.date_0.index;
      const end = props.date_1.index;
      if (start === end) {
        drawSingle(start);
      } else {
        drawMiddle(start, end);
        drawStart(start);
        drawEnd(end);
      }
      setClasses(new_classes); // update local classes
      setIsInitialDateRange(false);
    }
  }, [props.date_1]);

  // --------------------------------------------

  // -Handle the click event:
  useEffect(() => {
    if (mounted) {
      // -Run for both calendars:
      updateUI(props.click);

      // -Update the date_0 and date_1 state variables
      // -Only run for the calendar we clicked in:
      if (props.click.calendar_num === props.calendar_num) {
        if (props.click_num === 0) {
          // -Update date_0 and click_num:
          props.setDate0({
            year: props.click.year,
            month: props.click.month,
            day: props.click.day,
            index: props.click.index,
            calendar_num: props.click.calendar_num,
          });
        } else if (props.click_num === 1) {
          const overall_index = (calendar_num: number, index: number) => 7 * 6 * calendar_num + index;

          if (
            overall_index(props.date_0.calendar_num, props.date_0.index) <=
            overall_index(props.click.calendar_num, props.click.index)
          ) {
            // -Standard date range: date_0 <= date_1
            props.setDate1({
              year: props.click.year,
              month: props.click.month,
              day: props.click.day,
              index: props.click.index,
              calendar_num: props.click.calendar_num,
            });
          } else {
            // -Backward date range: date_0 > date_1
            // -Swap such that date_0 < date_1
            props.setDate1({
              year: props.date_0.year,
              month: props.date_0.month,
              day: props.date_0.day,
              index: props.date_0.index,
              calendar_num: props.date_0.calendar_num,
            });
            props.setDate0({
              year: props.click.year,
              month: props.click.month,
              day: props.click.day,
              index: props.click.index,
              calendar_num: props.click.calendar_num,
            });
          }
        } else {
          // Reset date range:
          props.setDate1({
            year: NaN,
            month: NaN,
            day: NaN,
            index: NaN,
            calendar_num: NaN,
          });
          props.setDate0({
            year: NaN,
            month: NaN,
            day: NaN,
            index: NaN,
            calendar_num: NaN,
          });
        }
        props.setClickNum((prev: number) => (prev + 1) % 3); // update props.click_num
      }
    }
  }, [props.click]);

  // --------------------------------------------

  // -Handle the hover event:
  useEffect(() => {
    if (mounted) {
      if (props.click_num !== 2) {
        updateUI(props.hover);
      }
    }
  }, [props.hover]);

  // --------------------------------------------

  return (
    <div className={css['calendar-container']}>
      <div className={`${css.row} ${css['day-titles']}`}>
        {days.map((day) => {
          return (
            <div key={day} className={css.col}>
              <p>{day}</p>
            </div>
          );
        })}
      </div>

      {[...new Array(6)].map((week, idx) => (
        <Row key={idx}>
          <>
            {[...new Array(7)].map((day, jdx) => (
              <Col
                key={`${idx}-${jdx}`}
                idx={idx}
                jdx={jdx}
                month_data={props.month_data}
                calendar_num={props.calendar_num}
                setHover={props.setHover}
                setClick={props.setClick}
                // setClickNum={props.setClickNum}
                classes={classes}
                ellipses_on={props.ellipses_on}
                click_num={props.click_num}
              />
            ))}
          </>
        </Row>
      ))}
    </div>
  );

  // --------------------------------------------
}
