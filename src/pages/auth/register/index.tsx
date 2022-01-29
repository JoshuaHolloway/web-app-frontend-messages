import { useState, useEffect, useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
import { useHttpClient } from '@src/code/hooks/http-hook';
import PageAnimation from '@src/components/page-animation-form/page-animation';
import css from './register.module.scss';

const Storefront: NextPage = () => {
  // --------------------------------------------

  const { sendRequest } = useHttpClient();

  const notificationCtx = useContext(NotificationContext);
  const loadingCtx = useContext(LoadingContext);

  const router = useRouter();

  // --------------------------------------------

  const [filter_criteria, setFilterCriteria] = useState<string[]>([]);

  useEffect(() => {
    if (filter_criteria.length > 0) {
      (async () => {
        // -do HTTP request
        try {
          loadingCtx.startLoading(0.5);
          notificationCtx.begin({ message: 'registering...' });

          let formData = {
            username: filter_criteria[0].toLowerCase(),
            password: filter_criteria[1],
            first_name: filter_criteria[2],
            last_name: filter_criteria[3],
            role: 'customer',
          };
          await sendRequest('/api/auth/register', 'POST', JSON.stringify(formData), {
            'Content-Type': 'application/json',
          });
          // console.log('data: ', data);

          notificationCtx.endSuccess({ message: 'successfully registered' });
          loadingCtx.endLoading();
          router.push('/auth/login');
        } catch (err: any) {
          notificationCtx.endError({ message: err.message });
          loadingCtx.endLoading();
        }
      })();
    }
  }, [filter_criteria]);

  // --------------------------------------------
  // --------------------------------------------

  return (
    <div className={css.page}>
      <PageAnimation setFilterCriteria={setFilterCriteria} />
    </div>
  );

  // --------------------------------------------
};

export default Storefront;
