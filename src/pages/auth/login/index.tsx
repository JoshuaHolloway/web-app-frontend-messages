import { useState, useContext } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import AuthContext from '@src/code/context/auth-context';
import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
import { useHttpClient } from '@src/code/hooks/http-hook';
import useInput from '@src/code/hooks/use-input';
import Button from '@src/components/button/button';
import FormInput from '@src/components/form-input/form-input';
import Tooltip from '@src/components/tooltip/tooltip';
import css from './login.module.scss';

// ==============================================

const AuthPage: NextPage = () => {
  // --------------------------------------------

  const { sendRequest } = useHttpClient();
  const notificationCtx = useContext(NotificationContext);
  const loadingCtx = useContext(LoadingContext);
  const authCtx = useContext(AuthContext);
  const [attempted_submission, setAttemptedSubmission] = useState(false);

  // --------------------------------------------

  // const [username, setUsername] = useState('homer');
  const {
    value: username,
    has_error: username_has_error,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    error_message: username_error_message,
  } = useInput(
    [
      {
        validate_func: (v: string) => 4 <= v.trim().length,
        error_message: 'username must be at least 4 characters',
      },
      {
        validate_func: (v: string) => v.trim().length <= 20,
        error_message: 'username must be less than 20 characters',
      },
    ],
    'email'
  );

  const {
    value: password,
    has_error: password_has_error,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    error_message: password_error_message,
  } = useInput([
    {
      validate_func: (v: string) => 4 <= v.trim().length,
      error_message: 'password must be at least 4 characters',
    },
    {
      validate_func: (v: string) => v.trim().length <= 20,
      error_message: 'password must be less than 20 characters',
    },
  ]);

  // --------------------------------------------

  let form_is_valid = false;
  if (!username_has_error && !password_has_error) {
    form_is_valid = true;
  }

  // --------------------------------------------

  const formSubmissionHandler = async () => {
    setAttemptedSubmission(true);

    if (password_has_error || username_has_error) {
      return;
    }

    try {
      loadingCtx.startLoading(0.5);
      notificationCtx.begin({ message: 'logging in...' });

      const data = await sendRequest(
        '/api/auth/login',
        'POST',
        JSON.stringify({
          username: username.toLowerCase(),
          password,
        }),
        {
          'Content-Type': 'application/json',
        }
      );
      // console.log('data: ', data);

      authCtx.login(data.token);
      notificationCtx.endSuccess({ message: 'successfully logged in!' });
      loadingCtx.endLoading();
    } catch (err: any) {
      notificationCtx.endError({ message: err.message });
      loadingCtx.endLoading();
    }
  };

  // --------------------------------------------

  return (
    <div className={css.form_container}>
      <div className={css.form}>
        <h3 className={css.form_title}>LOG IN TO YOUR ACCOUNT</h3>

        <Tooltip has_error={attempted_submission && username_has_error} data_tooltip={username_error_message}>
          <FormInput
            id="username"
            placeholder="Username"
            onChangeHandler={usernameChangeHandler}
            onBlurHandler={usernameBlurHandler}
            value={username}
            has_error={attempted_submission && username_has_error}
            type="text"
          />
        </Tooltip>

        <Tooltip has_error={attempted_submission && password_has_error} data_tooltip={password_error_message}>
          <FormInput
            id="password"
            placeholder="Password"
            onChangeHandler={passwordChangeHandler}
            onBlurHandler={passwordBlurHandler}
            value={password}
            has_error={attempted_submission && password_has_error}
            type="password"
          />
        </Tooltip>

        {/* <button onClick={formSubmissionHandler} disabled={attempted_submission && !form_is_valid}></button> */}
        <Button
          clickHandler={formSubmissionHandler}
          style_type="auth"
          disabled={attempted_submission && !form_is_valid}
        >
          <h5>Submit</h5>
        </Button>

        <div className={css.form_footer}>
          <p>Need to sign up?</p>
          <Link href="/auth/register">Register</Link>
        </div>
      </div>
    </div>
  );

  // --------------------------------------------
};

// ==============================================

export default AuthPage;
