import { FC } from 'react';
import css from './tooltip.module.scss';

// ==============================================
interface Props {
  data_tooltip: string;
  children: JSX.Element;
  has_error: boolean;
}
const Tooltip: FC<Props> = (props) => {
  // --------------------------------------------

  return (
    <div className={props.has_error ? `${css.element} ${css.error}` : css.element} data-tooltip={props.data_tooltip}>
      {props.children}
    </div>
  );

  // --------------------------------------------
};

// ==============================================

export default Tooltip;
