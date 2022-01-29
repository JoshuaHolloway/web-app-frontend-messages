import { useState, useEffect, useRef, useContext } from 'react';
import AuthContext from '@src/code/context/auth-context';
// import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
import type { DateRangeTuple } from '@src/code/functions/dates/date-index';
import { index2Date, range, months } from '@src/code/functions/dates/date-index';
import { useHttpClient } from '@src/code/hooks/http-hook';
import CalendarDateRange from '@src/components/calendar-date-range/calendar-date-range';
// import type { DateData } from '@src/components/calendar-date-range/date';
import Chart from '@src/components/d3-scrub/Chart';
import RadioButtonsGroup from '@src/components/radio/radio';
// import Chart from '@src/components/d3-scrub/App';
// import { getTodaysDate } from '@src/components/calendar/calendar-helper';

// ==============================================

interface UnitsSoldForSpecificDayForSpecificProduct {
  date_index: number;
  product_id: number;
  units_sold: number;
}

// ==============================================

const createDataLabels = (date_range: DateRangeTuple) => {
  // -x-axis labels for date range.

  const today = new Date();
  const data_labels: string[] = [];
  for (let i = date_range[0]; i <= date_range[1]; ++i) {
    const [y, m, d] = index2Date(i);
    data_labels.push(`${months[m]} ${d}${today.getFullYear() === y ? '' : `, ${y}`}`);
  }
  return data_labels;
};

// ==============================================

const transformData = (
  date_range: DateRangeTuple,
  units_sold_per_day_for_each_product: UnitsSoldForSpecificDayForSpecificProduct[]
) => {
  // -Map the data received from the endpoint
  //  ([POST] /api/data  OR  [POST] /api/data/:product_id)
  //  from:
  //    {
  //      date_index: number;
  //      product_id: number;
  //      units_sold: number;
  //    }[]
  //  to:
  //    number[]
  //  where:
  //    -index represents date
  //    -value represents y-value
  //      --(units sold for given day for current product_id)
  //  note:
  //    -Need to fill in days where no units where sold with zeros.

  // -Step 1: Create array with filled with index values
  //          corresponding to date_indices in range
  //    --e.g. date_range = [0, 7]  =>  [0, 1, 2, 3, 4, 5, 6]
  // -Step 2: Loop over array from Step 1 and compare values
  //          to the value for each property value for units_sold.
  //          --If there is not
  //    --The date_index is already sorted in ascending order.

  const date_indices = range(date_range[0], date_range[1]);
  let data: number[] = [];
  let count = 0;
  date_indices.forEach((date_index: number) => {
    if (units_sold_per_day_for_each_product[count]?.date_index === date_index) {
      data.push(units_sold_per_day_for_each_product[count].units_sold);
      ++count;
    } else {
      data.push(0);
    }
  });

  return data;
};

// ==============================================

export default function AdminDataPage() {
  // --------------------------------------------

  const { sendRequest } = useHttpClient();
  const authCtx = useContext(AuthContext);
  // const loadingCtx = useContext(LoadingContext);
  const notificationCtx = useContext(NotificationContext);

  // --------------------------------------------

  let count_http_requests_ref = useRef<number>(0);

  // --------------------------------------------

  const [date_range, setDateRange] = useState<DateRangeTuple>([NaN, NaN]);
  const [product_ids, setProductIds] = useState<number[]>([]);
  const [active_product_id, setActiveProductId] = useState<number>(0);
  const [data_labels, setDataLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);

  const [d3_brush_selection, setD3BrushSelection] = useState<number[]>([]);

  // --------------------------------------------

  // -Initial page load is done in the CalendarDateRange component (calendar-date-range.tsx)
  //  in order to also set the date range graphical UI.
  // useEffect(() => {
  //   // -Step 1: Initialize date range to past week
  //   //  --setDateRange()    ->    trigger useEffect(, [date_range])
  //   const init_date_range: DateRangeTuple = initializeDateRange();
  //   setDateRange(init_date_range);
  // }, []);

  // --------------------------------------------

  useEffect(() => {
    if (!isNaN(date_range[0])) {
      // -Set date labels
      setDataLabels(createDataLabels(date_range));

      // Get distinc product_id's for date range
      (async () => {
        try {
          // -Step 2: Distinct product ids for date range are retrieved
          //  --2.a) Fetch
          //  --2.b) setProductIds()
          //  --2.c) setActiveProductId()    ->    trigger useEffect(, [active_product_id])
          ++count_http_requests_ref.current;
          const distinct_product_ids: number[] = await sendRequest(
            '/api/data/distinct-product-ids-in-date-range',
            'POST',
            JSON.stringify({ date_range: date_range }),
            {
              'Content-Type': 'application/json',
              Authorization: authCtx.token,
            }
          );
          setProductIds(distinct_product_ids);

          if (distinct_product_ids.length > 0) {
            console.log('UPDATING ACTIVE PRODUCT ID');

            // -Get index in product_ids where active_product_id is at:

            // -Change the value (to ensure CHANGE of state on
            //  active_product_id to tritter useEffect(, [active_product_id]))
            let pid: number;
            if (active_product_id === 0 || active_product_id !== distinct_product_ids[0]) {
              pid = distinct_product_ids[0];
            } else {
              pid = distinct_product_ids[distinct_product_ids.length - 1];
            }

            setActiveProductId(pid);
          } else {
            throw new Error('There were no products sold in the specified date range.');
          } // if (distinct_proudct_ids.length > 0)
          // console.log('distinct_product_ids: ', distinct_product_ids);
        } catch (err: any) {
          console.log('error: ', err);
          notificationCtx.endError({ message: err.message });
        }
      })();
    }
  }, [date_range]);

  // --------------------------------------------

  useEffect(() => {
    if (active_product_id) {
      (async () => {
        try {
          console.log('MAKING REQUEST TO GET DATA');

          // loadingCtx.startLoading(0.5);

          // -Step 3: Data for first distinct product is retrieved
          ++count_http_requests_ref.current;
          const units_sold_per_day_for_one_product_in_date_range: UnitsSoldForSpecificDayForSpecificProduct[] =
            await sendRequest(
              `/api/data/get-units-sold-per-day-for-one-product-in-date-range/${active_product_id}`,
              'POST',
              JSON.stringify({ date_range: date_range }),
              {
                'Content-Type': 'application/json',
                Authorization: authCtx.token,
              }
            );

          console.log(
            'units_sold_per_day_for_one_product_in_date_range: ',
            units_sold_per_day_for_one_product_in_date_range
          );

          const transformed_data = transformData(date_range, units_sold_per_day_for_one_product_in_date_range);
          setData(transformed_data);
          console.log('active_product_id: ', active_product_id, '\ntransformed_data: ', transformed_data);
        } catch (err: any) {
          console.log('error: ', err);
          notificationCtx.endError({ message: err.message });
        }
        // loadingCtx.endLoading();
      })();
    } // if (active_product_id)
  }, [active_product_id]);

  return (
    <div>
      <CalendarDateRange setDateRange={setDateRange} />
      <br />
      <RadioButtonsGroup product_ids={product_ids} product_id={active_product_id} setProductId={setActiveProductId} />

      <Chart data={data} data_labels={data_labels} selection={d3_brush_selection} setSelection={setD3BrushSelection} />
    </div>
  );

  // --------------------------------------------
}

// ==============================================
