import type { NextPage } from 'next';
import OrdersTable from '@src/components/tables/orders-table/orders-table';

// ==============================================

const OrdersDashboardPage: NextPage = () => {
  // --------------------------------------------

  return (
    <>
      <OrdersTable />
    </>
  );

  // --------------------------------------------
};

// ==============================================

export default OrdersDashboardPage;
