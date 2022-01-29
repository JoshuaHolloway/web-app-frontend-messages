import type { NextPage } from 'next';
import UsersTable from '@src/components/tables/users-table/users-table';

// ==============================================

const UsersDashboardPage: NextPage = () => {
  // --------------------------------------------

  return (
    <>
      <UsersTable />
    </>
  );

  // --------------------------------------------
};

// ==============================================

export default UsersDashboardPage;
