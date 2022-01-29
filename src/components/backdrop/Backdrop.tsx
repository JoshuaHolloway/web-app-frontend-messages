import { FC, useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { createPortal } from 'react-dom';
import css from './Backdrop.module.scss';

// ==============================================

type Props = {
  show: boolean;
  hideHandler?: () => void;
  duration: number;
  children?: JSX.Element;
};
const Backdrop: FC<Props> = ({ show, hideHandler, duration, children }: Props) => {
  // --------------------------------------------

  const [cssClassList, setCssClassList] = useState(`${css.backdrop} ${css.hide}`);

  // --------------------------------------------

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // --------------------------------------------

  const backdrop_ref = useRef<HTMLDivElement>(null);
  const tl = useRef(gsap.timeline());

  // --------------------------------------------

  useEffect(() => {
    // console.log('show: ', show);

    if (show) {
      setCssClassList(css.backdrop);

      tl.current = gsap.timeline().to(backdrop_ref.current!, {
        duration,
        background: 'rgba(0, 0, 0, 0.75)',
        // onReverseComplete: () => {
        //  NOTE: If you don't set duration, or if for some reason the reverse
        //        does not trigger or finish, then the .hide class is never applied
        //        and blocks the user interaction with the screen.
        //        -To be safe I just do this via a setTimeout after
        //         attempting to trigger .reverse().
        //   setCssClassList(`${css.backdrop} ${css.hide}`);
        // },
      });
    } else {
      tl.current?.reverse();
      setTimeout(() => {
        setCssClassList(`${css.backdrop} ${css.hide}`);
      }, duration);
    }
  }, [show]);

  // --------------------------------------------

  // const classes = `${css.backdrop} ${show ? '' : css.hide}`;

  // --------------------------------------------

  const backdrop = (
    <div ref={backdrop_ref} className={cssClassList} onClick={hideHandler} role="presentation">
      {children}
    </div>
  );

  // --------------------------------------------

  return mounted ? createPortal(backdrop, document.getElementById('backdrop-hook')!) : null;

  // --------------------------------------------
};

// ==============================================

export default Backdrop;
