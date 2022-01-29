import { useState, useEffect, useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
// import AuthContext from '@src/code/context/auth-context';
// import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
import { toDollarsStr } from '@src/code/functions/money/money';
import { useHttpClient } from '@src/code/hooks/http-hook';
import type { Product } from '@src/code/types/Product';

// ==============================================

const ProductDetailsPage: NextPage = () => {
  // --------------------------------------------

  const router = useRouter();
  const { sendRequest } = useHttpClient();
  // const authCtx = useContext(AuthContext);
  // const loadingCtx = useContext(LoadingContext);
  const notificationCtx = useContext(NotificationContext);

  const [product, setProduct] = useState<Product>({
    id: NaN,
    title: '',
    price: NaN,
    units_in_stock: NaN,
    category: NaN,
  });

  // --------------------------------------------

  useEffect(() => {
    const id = router.query.id;
    console.log('id: ', id);

    // -[GET] /api/orders/:order_id

    // console.log('Making request to: [GET] /api/orders/:uuid, where uuid = ', uuid);

    // Get distinc product_id's for date range
    (async () => {
      try {
        const res = await sendRequest(`/api/products/${id}`);
        console.log('res: ', res);
        setProduct(res);
      } catch (err: any) {
        console.log('error: ', err);
        notificationCtx.endError({ message: err.message });
      }
    })();
  }, []);

  // --------------------------------------------

  return (
    <>
      <div>Product Details Page</div>
      <p>Product ID:{product.id}</p>
      <p>Product Name:{product.title}</p>
      <p>Price:{toDollarsStr(product.price)}</p>
      <p>Units in Stock: {product.units_in_stock}</p>
      <p>Category: {product.category}</p>
    </>
  );

  // --------------------------------------------
};

// ==============================================

export default ProductDetailsPage;
