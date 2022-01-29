import { FC, useState, useEffect, useContext, useRef } from 'react';
import { gsap } from 'gsap';
import { createPortal } from 'react-dom';
// import { AuthContext } from '@src/code/context/auth-context';
import CartCtx from '@src/code/context/cart-context';
// import { CartItem } from '@src/code/models/CartItem';
import Backdrop from '@src/components/backdrop/Backdrop';
import DrawerCart from './drawer-cart/drawer-cart';
import css from './sidedrawer.module.scss';

// ==============================================

interface Props {
  blur_ref: React.RefObject<HTMLDivElement>;
  duration: number;
}

// ==============================================

const Sidedrawer: FC<Props> = (props) => {
  // --------------------------------------------

  const cartCtx = useContext(CartCtx);

  // --------------------------------------------

  const [mounted, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
    return () => setMount(false);
  }, []);

  // --------------------------------------------

  const [cssClassList, setCssClassList] = useState(`${css.navdrawer}`);

  // --------------------------------------------

  const navdrawer_ref = useRef<HTMLDivElement | null>(null);
  const tl = useRef<any>();

  // --------------------------------------------

  useEffect(() => {
    if (mounted) {
      if (cartCtx?.show_cart) {
        setCssClassList(css.navdrawer);
        tl.current = gsap
          .timeline()
          .to(props.blur_ref.current, {
            duration: props.duration,
            filter: 'blur(8px)',
          })
          .to(
            navdrawer_ref.current,
            {
              duration: props.duration,
              xPercent: '100',
              ease: 'power4.inOut',
              onReverseComplete: () => {
                setCssClassList(`${css.navdrawer} ${css.hide}`);
              },
            },
            '<'
          );
      } else if (!cartCtx.show_cart) {
        tl.current?.reverse();
      }
    }
  }, [cartCtx.show_cart, mounted]);

  // --------------------------------------------

  const sidedrawer = (
    <>
      <Backdrop show={cartCtx.show_cart} hideHandler={cartCtx.hideCart} duration={props.duration} />

      <div ref={navdrawer_ref} className={cssClassList}>
        <svg
          className={css.svg}
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 16 16"
          onClick={() => cartCtx.hideCart()}
        >
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
        </svg>

        <DrawerCart
          // cart={cartCtx.cart}
          // updateQuantity={cartCtx.updateQuantity}
          // removeFromCart={cartCtx.removeFromCart}
          duration={props.duration}
          // total={cartCtx.cart_total}
        />
      </div>
    </>
  );

  // --------------------------------------------

  return mounted ? createPortal(sidedrawer, document.getElementById('drawer-hook')!) : null;

  // --------------------------------------------
};

// ==============================================

export default Sidedrawer;
