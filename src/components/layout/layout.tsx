import { FC, useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '@src/code/context/auth-context';
import NotificationContext from '@src/code/context/notification-context';
import Loading from '@src/components/loading/loading';
import Navbar from '@src/components/navbar/navbar';
import Notification from '@src/components/notification/notification';
import css from './layout.module.scss';

// ==============================================

type Props = {
  children: JSX.Element;
};

// ==============================================

const Layout: FC<Props> = (props) => {
  // --------------------------------------------

  const notificationCtx = useContext(NotificationContext);
  const active_notification = notificationCtx.notification;

  const blur_ref = useRef<HTMLDivElement | null>(null);

  // --------------------------------------------

  let main_layout = (
    <div ref={blur_ref} className={css.app}>
      <nav className={css.nav}>
        <Navbar />
      </nav>
      {/* <DashboardLayout>{props.children}</DashboardLayout> */}
      <main className={css.main}>{props.children}</main>
    </div>
  );

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
