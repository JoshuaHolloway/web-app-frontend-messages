import { useState } from 'react';
import type { NextPage } from 'next';
import MailList from '@src/components/list/mail-list';
import MessagesTable from '@src/components/tables/messages-table/messages-table';
import css from './mail.module.scss';
import Button from '@mui/material/Button';
import MessageModal from '@src/components/modal/message-modal';

// ==============================================

const MessagesDashboardPage: NextPage = () => {
  // --------------------------------------------

  const filter_options = ['unread', 'read', 'trash'];
  const [filter_criterion, setFilterCriterion] = useState(filter_options[0]);

  // --------------------------------------------

  const [modal_open, setModalOpen] = useState(false);
  const [modal_type, setModalType] = useState('update');

  const [id, setId] = useState<number | null>(null); // id to send to modal
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

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

        <MailList {...{ filter_options, filter_criterion, setFilterCriterion }} />
      </div>

      <div className={css.right}>
        <MessagesTable {...{ filter_options, filter_criterion, setFilterCriterion }} />
      </div>
    </div>
  );

  // --------------------------------------------
};

// ==============================================

export default MessagesDashboardPage;
