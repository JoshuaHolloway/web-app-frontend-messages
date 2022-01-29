import { FC, useContext } from 'react';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthContext from '@src/code/context/auth-context';
import CartCtx from '@src/code/context/cart-context';
// import Button from '@src/components/button/button';
import css from './navbar.module.scss';

// ==============================================

const Navbar: FC = () => {
  // --------------------------------------------

  const cartCtx = useContext(CartCtx);
  const authCtx = useContext(AuthContext);

  const router = useRouter();

  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true);
  //   return () => setMounted(false);
  // }, []);

  // --------------------------------------------

  const cartClickHandler = () => {
    cartCtx?.showCart();
  };

  // --------------------------------------------

  const auth_navbar_display = () => {
    // console.log('[navbar] router.pathname: ', router.pathname);

    if (router.pathname === '/auth/login' || router.pathname === '/auth/register') {
      return (
        <Link href="/">
          <svg className={css.brand_logo} width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
          </svg>
        </Link>
      );
    } else {
      return (
        <>
          {authCtx?.isLoggedIn ? (
            <span>
              {authCtx?.user.username}
              <Button variant="outlined" onClick={() => authCtx.logout()} style={{ marginLeft: '1rem' }}>
                Log Out
              </Button>
              {authCtx.user.role === 'customer' ? (
                <Button
                  variant="outlined"
                  onClick={() => router.push('/dashboard/mail')}
                  style={{ marginLeft: '1rem' }}
                >
                  Account
                </Button>
              ) : null}
              {authCtx.user.role === 'customer' ? (
                <Button variant="outlined" onClick={() => alert('handle help')} style={{ marginLeft: '1rem' }}>
                  Help
                </Button>
              ) : null}
            </span>
          ) : (
            <Button variant="outlined" onClick={() => router.push('/auth/login')}>
              Log In
            </Button>
          )}
        </>
      );
    }
  };

  // --------------------------------------------

  return (
    <>
      <div className={css.navbar}>
        <div>{auth_navbar_display()}</div>

        {router.pathname === '/auth/login' ||
        router.pathname === '/auth/register' ||
        (authCtx.isLoggedIn && authCtx.user.role === 'admin') ? (
          <div></div>
        ) : (
          <div
            className={css.cart_icon_container}
            onClick={cartClickHandler}
            onKeyDown={cartClickHandler}
            tabIndex={0}
            role="button"
          >
            <div className={css.cart_icon}>
              <svg className={css.svg} width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
              </svg>
            </div>

            <div className={css.num_cart_items}>{cartCtx?.cart.length}</div>
          </div>
        )}
      </div>
    </>
  );

  // --------------------------------------------
};

// ==============================================

export default Navbar;
