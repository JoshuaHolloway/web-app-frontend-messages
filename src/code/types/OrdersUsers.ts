// -Joins Orders and Users tables
// -Return type for endpoing: [GET] /api/orders

import type { Order } from '@src/code/types/Order';

interface OrdersUsers extends Order {
  // user_id: number;
  // uuid: string;
  // uuid_short: string;
  // total: number;
  // status: number;
  // date_time: string; // for debugging
  // date_time_index: number;

  order_id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export type { OrdersUsers };
