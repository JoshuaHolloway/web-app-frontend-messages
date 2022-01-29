import { FC } from 'react';
import css from './button.module.scss';

// ==============================================

interface Props {
  clickHandler: () => void;
  children: JSX.Element;
  style_type: string;
  disabled?: boolean;
}
const Button: FC<Props> = (props) => {
  let classList;
  if (props.style_type === 'product') {
    classList = `${css.button} ${css.pseudo_hover} ${css.product}`;
  } else if (props.style_type === 'auth') {
    classList = `${css.button} ${css.pseudo_hover} ${css.auth}`;
  } else if (props.style_type === 'navbar') {
    classList = `${css.button} ${css.pseudo_hover} ${css.navbar}`;
  }

  return (
    <button className={classList} onClick={props.clickHandler} disabled={props.disabled}>
      {props.children}
    </button>
  );
};

// ==============================================

export default Button;
