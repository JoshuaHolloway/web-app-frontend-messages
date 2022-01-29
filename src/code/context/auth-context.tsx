import { useState, useEffect, useCallback, createContext } from 'react';
import decodeJWT from 'jwt-decode';
import { useRouter } from 'next/router';

let logoutTimer: number; // set this whenever token changes.
let delta: number;

// ==============================================

// Type of data stored in local-storage:
interface UserData {
  userId: number;
  username: string;
  role: string;
  token: string;
  expiration: string;
}

// ==============================================

interface Auth {
  isLoggedIn: boolean;
  token: string | null;
  user: {
    username: string;
    userId: number;
    role: string;
  };
  login: (token: string, expirationDate?: Date) => void;
  logout: () => void;
}
const AuthContext = createContext<Auth>({
  isLoggedIn: false,
  token: null,
  user: {
    username: '',
    userId: NaN,
    role: '',
  },
  login: () => {},
  logout: () => {},
});

// ==============================================
type Props = {
  children: JSX.Element;
};
const AuthContextProvider = (props: Props) => {
  const router = useRouter();

  const [tokenExpirationDate, setTokenExpirationDate] = useState<any>();

  // -token & user are are used in context.
  // -Hence, when this token state updates
  //  it sets its value to the context token.
  const [token, setToken] = useState<any>(null);
  const [user, setUser] = useState<any>({});

  // --------------------------------------------

  // -These f()'s are stored in context.
  const login = useCallback((token: string, expirationDate: any) => {
    const decoded: { exp: number; iat: number; userId: string; username: string; role: string } = decodeJWT(token);
    // console.log('decoded: ', decoded);
    delta = decoded.exp - decoded.iat;
    // console.log('delta: ', delta);
    // -NOTE: Can extract expiration date from
    //        decoded token!!!

    // -This function runs upon logging in
    //  AND upon page refresh.

    // -Set expiration date
    const currentDate = new Date().getTime(); // # of ms since beginning of time

    let is_auto_login = false;
    if (expirationDate) is_auto_login = true;
    // -login() is used in two places
    //  --1. authCtx.login(tokey) on /auth/login page
    //    ---non-auto-login
    //  --2. in useEffect hook in this file
    //    ---auto-login
    // -If second arguement to login() is provided
    //  then the auto-login functionality is being used.

    // -Shadowed variable
    // -Does not overwrite our actual state
    // -NOTE: State variable with same name!
    const tokenExpirationDate: any =
      expirationDate || // if expirationDate is NOT retreived from local-storage, then calculate it from the current time + delta
      new Date( // now + 1d
        // currentDate + 1e3 /*1s*/ * 60 /*1min*/ * 60 /*1hr*/ * 24 /* 1d */
        // currentDate + 1e3 /*1s*/ * 10 /* 10s. */
        currentDate + 1e3 /*1s*/ * delta /* delta-seconds */
        // ^Extracted from the actual expiration date
        //  encoded in token!!
      );

    // Update state:
    setTokenExpirationDate(tokenExpirationDate);
    // -In the next re-render cycle we will have the correct
    //  token expiration date.

    // -Set local storage
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
        token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );

    // setIsLoggedIn(true);
    setToken(token);
    setUser({
      username: decoded.username,
      userId: decoded.userId,
      role: decoded.role,
    });

    // -re-direct if NOT auto-login (i.e. if manual login)
    if (!is_auto_login) {
      if (decoded.role === 'admin') {
        router.push('/mail');
      } else {
        router.push('/');
      }
    }
  }, []);

  // --------------------------------------------

  const logout = useCallback(() => {
    if (localStorage.getItem('userData')) {
      localStorage.removeItem('userData');
      localStorage.removeItem('cart'); // ensures the user doesn't load stale course data (e.g. if admin deletes or modifies a course)
    }

    setUser(null);
    setToken(null);
    setTokenExpirationDate(null);
    router.push('/');
  }, []);

  // --------------------------------------------

  useEffect(() => {
    // -When we login, we set a new timer.
    // -When we logout, we clear the timer.
    // -Both logging out and logging in
    //  change the state of token
    //  which triggers this useEffect callback.

    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();

      logoutTimer = Number(setTimeout(logout, remainingTime));
    } else {
      // -the else block runs when the user
      //  manually presss the log-out button.
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);
  // -Token either changed because:
  //  - we logged in (through form or auto-login)
  //  - we logged out

  // --------------------------------------------

  // -NOTE: useEffect runs AFTER the render-cycle!
  useEffect(() => {
    const storedData: UserData = JSON.parse(String(localStorage.getItem('userData')));

    // if (storedData) {
    // console.log('current time:    ', new Date());
    // console.log('expiration time: ', new Date(storedData.expiration));
    // }

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() // expiration in future => still valid
    ) {
      // -Don't create a new expiration time
      // -We want to only create a new expiration time
      //  upon new login.
      login(storedData.token, new Date(storedData.expiration));
    }
  }, [login]);
  // -Due to useCallbac, login creation will only run once.
  // -In other words, this useEffect callback
  //  will only run directly after initial page render.
  // -Since this runs AFTER page render,
  //  the user will see a flash of the non-logged-in
  //  user screen before this runs.

  // return { token, login, logout, user };

  const context: Auth = {
    isLoggedIn: !!token,
    token,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={context}>{props.children}</AuthContext.Provider>;
};

// ==============================================

export { AuthContextProvider };
export default AuthContext;
