import { useState, useEffect, useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
// import AuthContext from '@src/code/context/auth-context';
// import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
import { index2Date, index2Time, months } from '@src/code/functions/dates/date-index';
// import { toDollarsStr } from '@src/code/functions/money/money';
import { twentyFour2Twelve, zeroPad } from '@src/code/functions/dates/format-date';
import { useHttpClient } from '@src/code/hooks/http-hook';
import type { User } from '@src/code/types/User';

// ==============================================

const ProductDetailsPage: NextPage = () => {
  // --------------------------------------------

  const router = useRouter();
  const { sendRequest } = useHttpClient();
  // const authCtx = useContext(AuthContext);
  // const loadingCtx = useContext(LoadingContext);
  const notificationCtx = useContext(NotificationContext);

  const [user, setUser] = useState<User>({
    user_id: NaN,
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    role: '',
    date_index: NaN,
    time_index: NaN,
  });

  // --------------------------------------------

  const [y, m, d] = index2Date(user.date_index);
  const [hr, min] = index2Time(user.time_index);

  const { hr_12, period } = twentyFour2Twelve(hr);

  // --------------------------------------------

  useEffect(() => {
    const id = router.query.id;
    console.log('id: ', id);

    // -[GET] /api/orders/:order_id

    // console.log('Making request to: [GET] /api/orders/:uuid, where uuid = ', uuid);

    // Get distinc product_id's for date range
    (async () => {
      try {
        const res = await sendRequest(`/api/users/${id}`);
        console.log('res: ', res);
        setUser(res);
      } catch (err: any) {
        console.log('error: ', err);
        notificationCtx.endError({ message: err.message });
      }
    })();
  }, []);

  // --------------------------------------------

  return (
    <>
      <div>User Details Page</div>
      <p>User ID:{user.user_id}</p>
      <p>Username / Email: {user.username}</p>
      <p>
        User Name: {user.first_name} {user.last_name}
      </p>
      <p>Role: {user.role}</p>

      <p>
        Registration Date: {`${months[m]} ${d}, ${y}`} @ {`${hr_12}:${zeroPad(min)} ${period}`}
      </p>
    </>
  );

  // --------------------------------------------
};

// ==============================================

export default ProductDetailsPage;
