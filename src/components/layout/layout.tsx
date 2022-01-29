import { FC, useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '@src/code/context/auth-context';
import NotificationContext from '@src/code/context/notification-context';
import Loading from '@src/components/loading/loading';
import Navbar from '@src/components/navbar/navbar';
import Notification from '@src/components/notification/notification';
import Sidedrawer from '@src/components/sidedrawer/sidedrawer';
import DashboardLayout from './dashboard-layout/dashboard-layout';
import css from './layout.module.scss';

// ==============================================

type Props = {
  children: JSX.Element;
};

// ==============================================

const Layout: FC<Props> = (props) => {
  // --------------------------------------------

  const router = useRouter();

  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const active_notification = notificationCtx.notification;

  const blur_ref = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // --------------------------------------------

  let main_layout: JSX.Element | null = null;
  if (mounted) {
    if (authCtx.isLoggedIn && authCtx.user?.role === 'admin') {
      // Case 3: Logged in admin
      // console.clear();
      // console.log('Layout Case 3: authCtx.isLoggedIn && authCtx.user.role === admin');
      // console.log('authCtx.isLoggedIn: ', authCtx.isLoggedIn, '\tauthCtx.user.role: ', authCtx.user.role);
      main_layout = <DashboardLayout>{props.children}</DashboardLayout>;
    } else if (!authCtx.isLoggedIn && router.pathname.includes('/admin')) {
      // Case 5: Non-logged in user is attempting to access an admin page
      // console.clear();
      // console.log('Layout Case 5: Non-logged in user is attempting to access an admin page');
      // console.log('router.pathname: ', router.pathname);
      debugger;
      router.replace('/');
    } else if (router.pathname.includes('/auth')) {
      // Case 4: On Login or Register page
      // console.clear();
      // console.log('Layout Case 4: On Login or Register page');
      main_layout = (
        <div className={css.auth}>
          <main className={css.main}>{props.children}</main>
        </div>
      );
    } else {
      // Case 1: Not logged in
      // Case 2: Logged in customer
      // console.clear();
      // console.log('Layout Case 1 or 2: Non-logged in user or logged in customer');
      main_layout = (
        <div ref={blur_ref} className={css.app}>
          <nav className={css.nav}>
            <Navbar />
          </nav>
          {/* <DashboardLayout>{props.children}</DashboardLayout> */}
          <main className={css.main}>{props.children}</main>
        </div>
      );
    }
  }

  // --------------------------------------------

  return (
    <>
      {/* ----------------------------------- */}

      {main_layout}

      {/* ----------------------------------- */}

      {/* loading-spinner and backdrop */}
      <Loading />

      {/* ----------------------------------- */}

      {/* notification UI-feedback */}
      {active_notification && (
        <Notification
          title={active_notification?.title}
          message={active_notification?.message}
          status={active_notification?.status}
        />
      )}

      {/* ----------------------------------- */}
    </>
  );

  // --------------------------------------------
};

// ==============================================

export default Layout;
