import { useState, useEffect, useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import AuthContext from '@src/code/context/auth-context';
// import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
import { toDollarsStr } from '@src/code/functions/money/money';
import { useHttpClient } from '@src/code/hooks/http-hook';

// ==============================================

interface Order {
  uuid: string;
  uuid_short: string;
  order_id: number;
  status: string;
  date: string;
  date_index: number;
  date_year: number;
  date_month: number;
  date_day: number;
  time: string;
  total: number;
  username: string;
  first_name: string;
  last_name: string;
}

interface Product {
  order_id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

// ==============================================

const OrderDetailsPage: NextPage = () => {
  // --------------------------------------------

  const router = useRouter();

  const { sendRequest } = useHttpClient();
  const authCtx = useContext(AuthContext);
  // const loadingCtx = useContext(LoadingContext);
  const notificationCtx = useContext(NotificationContext);

  const [order, setOrder] = useState<Order>();
  const [products, setProducts] = useState<Product[]>();

  // --------------------------------------------

  useEffect(() => {
    const uuid = router.query.uuid;
    console.log('uuid: ', uuid);

    // For some reason when you refresh this page the uuid param is undefined
    // -Redirect back to orders table if uuid is undefined:
    if (!uuid) {
      router.push('/admin/orders');
    } else {
      // -[GET] /api/orders/:order_id

      console.log('Making request to: [GET] /api/orders/:uuid, where uuid = ', uuid);

      // Get distinc product_id's for date range
      (async () => {
        try {
          const res = await sendRequest(`/api/orders/${uuid}`, 'GET', null, {
            'Content-Type': 'application/json',
            Authorization: authCtx.token,
          });

          setOrder(res.order);
          setProducts(res.products);

          console.log('order_details: ', res);
        } catch (err: any) {
          console.log('error: ', err);
          notificationCtx.endError({ message: err.message });
        }
      })();
    }
  }, []);

  // --------------------------------------------

  return (
    <>
      <div>Order Details Page</div>

      <hr />

      <h2>Order:</h2>
      <p>
        <strong>UUID (full):</strong> {order?.uuid}
      </p>
      <p>
        <strong>UUID (short):</strong> {order?.uuid_short}
      </p>
      <p>
        <strong>date_index:</strong> {order?.date_index}
      </p>
      <p>
        <strong>first_name:</strong> {order?.first_name}
      </p>
      <p>
        <strong>Last Name:</strong> {order?.last_name}
      </p>
      <p>
        <strong>Year:</strong> {order?.date_year}
      </p>
      <p>
        <strong>Month:</strong> {order?.date_month}
      </p>
      <p>
        <strong>Day:</strong> {order?.date_day}
      </p>
      <p>
        <strong>Order Status:</strong> {order?.status}
      </p>
      <p>
        <strong>Time:</strong> {order?.time}
      </p>
      <p>
        <strong>Total:</strong> {toDollarsStr(order?.total)}
      </p>
      <p>
        <strong>Username:</strong> {order?.username}
      </p>

      <hr />

      <h2>Products in Order:</h2>

      <ul>
        {products?.map((product: Product) => (
          <li key={`${order?.order_id}-${product.product_id}`}>
            <p>
              <strong>Product ID:</strong> {product?.product_id}
            </p>
            <p>
              <strong>Product Name:</strong> {product?.product_name}
            </p>
            <p>
              <strong>Price:</strong> {toDollarsStr(product?.product_price)}
            </p>
            <p>
              <strong>Quantity:</strong> {product?.quantity}
            </p>
            <p>
              <strong>Line-Item Subtotal:</strong> {toDollarsStr(product?.product_price * product?.quantity)}
            </p>
          </li>
        ))}
      </ul>
    </>
  );

  // --------------------------------------------
};

// ==============================================

export default OrderDetailsPage;
