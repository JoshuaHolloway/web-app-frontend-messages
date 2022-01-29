import type { NextPage } from 'next';
import ProductsTable from '@src/components/tables/products-table/products-table';

// ==============================================

const ProductsDashboardPage: NextPage = () => {
  // --------------------------------------------

  return (
    <>
      <ProductsTable />
    </>
  );

  // --------------------------------------------
};

// ==============================================

export default ProductsDashboardPage;
