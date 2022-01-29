import { useState, useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { createPortal } from 'react-dom';
import NotificationContext from '@src/code/context/notification-context';
import classes from './notification.module.scss';

// ==============================================

type Props = {
  title: string;
  message: string;
  status: string;
};
export default function Notification({ title, message, status }: Props) {
  // --------------------------------------------

  const notificationCtx = useContext(NotificationContext);

  // --------------------------------------------

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // --------------------------------------------

  const div_ref = useRef<HTMLDivElement>(null);
  const timeline_ref = useRef(gsap.timeline());

  useEffect(() => {
    if (mounted && notificationCtx.notification?.animation === 'show') {
      timeline_ref.current = gsap.timeline().to(div_ref.current!, {
        duration: 0.2,
        yPercent: '-100',
        onReverseComplete: () => {
          setActiveClasses(`${classes.hide} ${classes.notification}`);

          // -Changing color of div sets inline background,
          //  which needs to be removed in order
          //  for next notification to start with pending status.
          div_ref.current?.style.removeProperty('background');

          notificationCtx.resetActiveNotification();
        },
      });
    } else if (mounted && notificationCtx.notification?.animation === 'hide') {
      if (timeline_ref.current) {
        timeline_ref.current?.reverse();
      }
    }
  }, [mounted, notificationCtx.notification?.animation]);

  // --------------------------------------------

  const [active_classes, setActiveClasses] = useState(`${classes.hide} ${classes.notification}`);
  useEffect(() => {
    let statusClasses = '';
    // console.log('status: ', status);
    if (status === 'success') {
      gsap.to(div_ref.current, {
        duration: 0.4,
        background: '#10be58', // success color (notification.module.scss)
      });
      statusClasses = classes.success;
    }
    if (status === 'error') {
      gsap.to(div_ref.current, {
        duration: 0.4,
        background: '#e65035', // error color (notification.module.scss)
      });
      statusClasses = classes.error;
    }
    if (status === 'pending') {
      statusClasses = classes.pending;
    }

    setActiveClasses(`${classes.notification} ${statusClasses}`);
  }, [notificationCtx.notification.status]);

  // --------------------------------------------

  const notification_div = (
    <div
      ref={div_ref}
      className={active_classes}
      onClick={notificationCtx?.hideNotification}
      role="presentation"
      // onKeyDown={notificationCtx?.hideNotification}
      // tabIndex={0}
    >
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
  // --------------------------------------------

  return mounted ? createPortal(notification_div, document.getElementById('notification-hook')!) : null;

  // --------------------------------------------
}
