import { useContext } from 'react';

import AuthContext from '@src/code/context/auth-context';
import NotificationContext from '@src/code/context/notification-context';
import { useHttpClient } from '@src/code/hooks/http-hook';
import { MessageHttp } from '@src/code/types/MessageHttp';

// ==============================================

const boxs = ['inbox', 'outbox'];
const sub_boxs = ['unread', 'read', 'starred', 'trash', 'category'];

// ==============================================

const useMessageRequests = () => {
  const { sendRequest } = useHttpClient();
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  // const loadingCtx = useContext(LoadingContext);

  // --------------------------------------------

  const getMessages = async ({
    box,
    sub_box,
    category,
    order_by,
    sort_type,
    rows_per_page,
    page_num,
    date_lo,
    date_hi,
    setMessages,
  }: {
    box: 'inbox' | 'outbox';
    sub_box: 'unread & read' | 'unread' | 'read' | 'starred' | 'trash' | 'category';
    category: number | null;
    order_by: 'date & time' | 'name-first' | 'name-last' | 'username';
    sort_type: 'asc' | 'desc';
    rows_per_page: number;
    page_num: number;
    date_lo: number;
    date_hi: number;
    setMessages: (msgs: MessageHttp[]) => void;
  }) => {
    console.log('do_fetch()', '\nbox: ', box, '\nsub_box: ', sub_box);

    try {
      // loadingCtx.startLoading();
      // notificationCtx.begin({ message: 'logging in...' });

      const data: MessageHttp[] = await sendRequest(
        `/api/messages`,
        'POST',
        JSON.stringify({ box, sub_box, category }),
        {
          'Content-Type': 'application/json',
          Authorization: authCtx.token,
        }
      );

      // console.log('num_rows: ', num_rows, '\nmessages_rows: ', rows);
      // setRowCount(Number(num_rows)); // apparently, row_count actually comes in as a string!
      setMessages(data);

      // authCtx.login(data.token);
      // notificationCtx.endSuccess({ message: 'successfully logged in!' });
      // loadingCtx.endLoading();
    } catch (err: any) {
      notificationCtx.endError({ message: err.message });
      // loadingCtx.endLoading();
      console.log('catch, error: ', err.message);
    }
  };

  // --------------------------------------------

  const createMessage = async () => {};

  // --------------------------------------------

  const updateMessage = async () => {};

  // --------------------------------------------

  return { getMessages, createMessage, updateMessage };
};

// ==============================================

export { useMessageRequests };
