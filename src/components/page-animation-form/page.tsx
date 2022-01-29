import { FC, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NotificationContext from '@src/code/context/notification-context';
import { useHttpClient } from '@src/code/hooks/http-hook';
import useInput from '@src/code/hooks/use-input';
import Button from '@src/components/button/button';
import FormInput from '@src/components/form-input/form-input';
import Tooltip from '@src/components/tooltip/tooltip';
import css from './page.module.scss';

// ==============================================
interface Props {
  page_num: number;
  pageChangeHandler: (n: number) => void;
  pageUnchangeHandler: () => void;
  setPageRef: (page_num: number) => (el: HTMLDivElement) => void;
  // last_page,
  setFilterCriteria: any;
  clickable?: boolean;
  message: string;
  placeholder: string;
  min_length: number;
  max_length: number;
}
const Page: FC<Props> = (props) => {
  const {
    page_num,
    pageChangeHandler,
    pageUnchangeHandler,
    setPageRef,
    // last_page,
    setFilterCriteria,
    clickable,
  } = props;

  // --------------------------------------------

  const { sendRequest } = useHttpClient();
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();

  // --------------------------------------------

  const { value, has_error, valueChangeHandler, inputBlurHandler, error_message } = useInput(
    [
      {
        validate_func: (v: string) => props.min_length <= v.trim().length,
        error_message: `${props.placeholder} must be at least ${props.min_length} characters`,
      },
      {
        validate_func: (v: string) => v.trim().length <= props.max_length,
        error_message: `${props.placeholder} must be less than ${props.max_length} characters`,
      },
    ],
    props.placeholder === 'email' ? 'email' : 'text'
  );

  // --------------------------------------------

  const onClickHandler = (str: string) => async () => {
    str = str.trim();

    setFilterCriteria((prev: string[]) => {
      let returned: string[];
      if (page_num < prev.length) {
        // -Modify previously selected value.
        // -This runs if back button is pressed.
        const prev_temp = [...prev];
        prev_temp[page_num] = str;
        returned = prev_temp;
      } else {
        // -push on new element
        // -This adds a new search critera (without pressing back button)
        returned = [...prev, str];
      }
      return returned;
    });

    pageChangeHandler(page_num + 1);

    // -Ensure username is not already taken
    // -Begin page-change animation.
    // -If username already exists in db,
    //  then simply send user to the login page.
    // -An error message will also display
    //  so the user knows why they are sent
    //  to the login page.
    if (page_num === 0) {
      // -do HTTP request
      try {
        const data = await sendRequest('/api/users/getUserByUsername', 'POST', JSON.stringify({ username: str }), {
          'Content-Type': 'application/json',
        });
        console.log('data: ', data);
      } catch (err: any) {
        notificationCtx.begin({ message: 'pending...' });
        notificationCtx.endError({ message: err.message });
        router.push('/auth/login');
      }
    }
  };

  // --------------------------------------------

  return (
    <div
      ref={setPageRef(page_num)}
      style={{
        // background: color_map[page_num],
        position: 'absolute',
        top: 0,
        left: page_num === 0 ? '0%' : '-100%',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '5rem',
      }}
    >
      <div
        className="container"
        style={{
          // border: 'solid yellow 5px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '400px',
        }}
      >
        <div
          style={{
            // border: 'dashed orange 2px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2 data-testid={`filter-criteria-title-${page_num}`}>{props.message}</h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '6rem',
            }}
          >
            {page_num > 0 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 16 16"
                onClick={pageUnchangeHandler}
              >
                <path
                  fillRule="evenodd"
                  d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                />
              </svg>
            )}
          </div>
        </div>

        <div>
          <Tooltip has_error={has_error} data_tooltip={error_message}>
            <FormInput
              id="username"
              placeholder={props.placeholder}
              onChangeHandler={valueChangeHandler}
              onBlurHandler={inputBlurHandler}
              value={value}
              has_error={has_error}
              type={props.placeholder === 'password' ? 'password' : 'text'}
            />
          </Tooltip>

          <br />

          <Button
            clickHandler={onClickHandler(value)}
            style_type="auth"
            disabled={has_error || !clickable || value.length < 1}
          >
            <h5>Submit</h5>
          </Button>
        </div>

        <div className={css.form_footer}>
          <p>Already have an account?</p>
          <Link href="/auth/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

// ==============================================

export default Page;
