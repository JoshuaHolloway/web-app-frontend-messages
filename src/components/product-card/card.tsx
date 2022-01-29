import { FC, useContext } from 'react';
// import { toDollarsStr } from '@src/code/functions/money/money';
import Button from '@mui/material/Button';
import CartCtx from '@src/code/context/cart-context';
import { toDollarsAndCents } from '@src/code/functions/money/money';
import { Product } from '@src/code/types/Product';
import css from './card.module.scss';

// ==============================================

interface Props {
  product: Product;
}

// ==============================================

const Card: FC<Props> = (props) => {
  // --------------------------------------------

  const cartCtx = useContext(CartCtx);

  // --------------------------------------------

  const addToCartHandler = (product: Product) => () => {
    cartCtx?.addToCart(product);
  };

  // --------------------------------------------

  const format_money = (price: number) => {
    const [dollars, cents] = toDollarsAndCents(price);

    return (
      <>
        ${dollars}.<span>{cents}</span>
      </>
    );
  };

  // --------------------------------------------

  return (
    <div className={css.card}>
      <div className={css.img}></div>

      <div className={css.bottom}>
        <div className={css.left}>
          <div className={css.row1}>
            <p>by Nike</p>
          </div>
          <div className={css.row2}>
            <p>{props.product.title}</p>
          </div>
          <div className={css.row3}>
            <Button variant="contained" color="error" onClick={addToCartHandler(props.product)}>
              Add to Cart
            </Button>
          </div>
        </div>

        <div className={css.right}>
          <div className={css.row1}>
            <p>Shoes</p>
          </div>
          <div className={css.row2}>
            <p>{format_money(props.product.price)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // --------------------------------------------
};

// ==============================================

export default Card;
