import { useState, useEffect, createContext } from 'react';

// ==============================================

interface NotificationMessage {
  message: string;
}
interface Notification {
  title: string;
  message: string;
  status: string;
  animation: string;
}
interface NotificationContext {
  notification: Notification; // { title, message, status, animation },
  // animation: 'hide',
  // showNotification: function (notification_data: NotificationData) {},
  showNotification: (notification: Notification) => void;
  hideNotification: () => void;
  begin: (notification: NotificationMessage) => void;
  endSuccess: (notification: NotificationMessage) => void;
  endError: (notification: NotificationMessage) => void;
  resetActiveNotification: () => void;
}
const NotificationContext = createContext<NotificationContext>({
  notification: { title: '', message: '', status: '', animation: 'hide' },
  showNotification: () => {},
  hideNotification: () => {},
  begin: () => {},
  endSuccess: () => {},
  endError: () => {},
  resetActiveNotification: () => {},
});

// ==============================================

const duration = 2e3; // ms.
const error_duration = 2e3; // ms

// ==============================================

type Props = {
  children: JSX.Element;
};
function NotificationContextProvider({ children }: Props) {
  // --------------------------------------------

  const init_state = {
    title: '',
    message: '',
    status: '',
    animation: '',
  };

  const [active_notification, setActiveNotification] = useState<Notification>(init_state);

  useEffect(() => {
    if ((active_notification && active_notification.status === 'success') || active_notification.status === 'error') {
      const timer = setTimeout(
        () => {
          hideNotificationHandler();
        },
        active_notification.status === 'success' ? duration : error_duration
      );

      // -Clear the timer if useEffect runs
      //  before the previous timer ends.
      return () => clearTimeout(timer);
    }
  }, [active_notification]);

  // --------------------------------------------

  const resetActiveNotification = () => {
    setActiveNotification({ ...init_state });
  };

  // --------------------------------------------

  const showNotificationHandler = (notification: Notification) => {
    setActiveNotification({
      title: notification.title,
      message: notification.message,
      status: notification.status,
      animation: notification.animation,
    });
  };

  // --------------------------------------------

  const hideNotificationHandler = () => {
    if (active_notification.status !== 'pending') {
      setActiveNotification({ ...active_notification, animation: 'hide' });
    }
  };

  // --------------------------------------------

  const beginNotification = (notification: NotificationMessage) => {
    showNotificationHandler({
      title: 'Loading...',
      message: notification.message,
      status: 'pending',
      animation: 'show',
    });
  };

  const endNotificationSuccess = (notification: NotificationMessage) => {
    showNotificationHandler({
      title: 'Done!',
      message: notification.message,
      status: 'success',
      animation: 'show',
    });
  };

  const endNotificationError = (notification: NotificationMessage) => {
    showNotificationHandler({
      title: 'Error!',
      message: notification.message,
      status: 'error',
      animation: 'show',
    });
  };

  // --------------------------------------------

  const context = {
    notification: active_notification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
    begin: beginNotification,
    endSuccess: endNotificationSuccess,
    endError: endNotificationError,
    resetActiveNotification,
  };

  // --------------------------------------------

  return <NotificationContext.Provider value={context}>{children}</NotificationContext.Provider>;

  // --------------------------------------------
}

// ==============================================

export { NotificationContextProvider };
export default NotificationContext;
