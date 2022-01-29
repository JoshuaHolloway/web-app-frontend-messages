import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import type { NextPage } from 'next';

import MailList from '@src/components/list/mail-list';
import MessageModal from '@src/components/modal/message-modal';
import MessagesTable from '@src/components/tables/messages-table/messages-table';

import { useMessageRequests } from '@src/code/hooks/use-message-requests';
import { initializeDateRange } from '@src/code/functions/dates/date-index';

import css from './mail.module.scss';

// ==============================================

// export interface HTTPMessage {
//   x: number;
// }

// ==============================================

const MessagesDashboardPage: NextPage = () => {
  // --------------------------------------------

  const filter_options = ['unread', 'read', 'trash'];
  const [filter_criterion, setFilterCriterion] = useState(filter_options[0]);

  // --------------------------------------------

  const [messages, setMessages] = useState<any[]>([]);
  const [modal_open, setModalOpen] = useState(false);

  // --------------------------------------------

  const { getMessages } = useMessageRequests();

  useEffect(() => {
    const [date_lo, date_hi] = initializeDateRange();

    getMessages({
      box: 'inbox',
      sub_box: 'unread & read',
      category: null,
      order_by: 'date & time',
      sort_type: 'desc',
      rows_per_page: 10,
      page_num: 1,
      date_lo,
      date_hi,
      setMessages,
    });
  }, []);

  // --------------------------------------------

  return (
    <div className={css.container}>
      <div className={css.left}>
        <MessageModal open={modal_open} setOpen={setModalOpen} />

        <div
          style={{
            // background: 'yellow',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80px',
          }}
        >
          <Button variant="outlined" onClick={() => setModalOpen(true)}>
            Compose
          </Button>
        </div>

        <MailList {...{ filter_options, filter_criterion, setFilterCriterion, setMessages }} />
      </div>

      <div className={css.right}>
        <MessagesTable {...{ filter_options, filter_criterion, setFilterCriterion, messages }} />
      </div>
    </div>
  );

  // --------------------------------------------
};

// ==============================================

export default MessagesDashboardPage;
