import { FC, useContext } from 'react';
// import Spinner from 'react-bootstrap/Spinner';
import LoadingContext from '@src/code/context/loading-context';
import Backdrop from '@src/components/backdrop/Backdrop';
import css from './loading.module.scss';

// ==============================================

const Loading: FC = () => {
  // --------------------------------------------

  const loadingCtx = useContext(LoadingContext);

  // --------------------------------------------

  const show = loadingCtx?.is_loading;
  const classes = show ? css.spinner : `${css.spinner} ${css.hide}`;

  // --------------------------------------------

  return (
    <>
      {/* Slow loading animationduration because if loading state is only about half a second
      then there is a flicker if the loading animation duration is too fast! */}
      <Backdrop show={loadingCtx?.is_loading!} duration={loadingCtx.loading_animation_duration}>
        <svg className={classes} viewBox="0 0 50 50">
          <circle className={css.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        </svg>
      </Backdrop>
    </>
  );
};

// ==============================================

export default Loading;
