interface Message {
  id?: number; // pk
  user_id_to: number; // fk
  user_id_from: number; // fk
  message: string;
  date_index: number; // for filtering on date-range
  date_time: string; // for debugging
  date_time_index: number; // for sorting
  status: number; // {0 === unread, 1 === read, 2 === trash}
  starred: boolean;
}

// -Used to display messages in messages-table:
interface MessageUser extends Message {
  message_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
}

export type { Message, MessageUser };
