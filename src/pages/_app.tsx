import { ThemeProvider } from '@mui/material/styles';
import type { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthContextProvider } from '@src/code/context/auth-context';
import { LoadingContextProvider } from '@src/code/context/loading-context';
import { NotificationContextProvider } from '@src/code/context/notification-context';
import Layout from '@src/components/layout/layout';
import theme from '@src/style/theme';
import '@style/globals.scss';

// ==============================================

const App: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  // --------------------------------------------

  // const { is_loading, startLoading, endLoading } = useLoading();

  // --------------------------------------------

  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <>
      <Head>
        <title>eCommerce Web-App by Josh Holloway</title>
        <meta name="description" content="This eCommerce Web-App was created by Josh Holloway (joshua-holloway.com)" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/alien.svg" />
        {/* <link rel='manifest' href='/manifest.json' /> */}
      </Head>

      <AuthContextProvider>
        <NotificationContextProvider>
          {/* <LoadingContext.Provider value={{ is_loading, startLoading, endLoading }}> */}
          <LoadingContextProvider>
            <Layout>
              <ThemeProvider theme={theme}>
                <Component {...pageProps} />
              </ThemeProvider>
            </Layout>
          </LoadingContextProvider>
        </NotificationContextProvider>
      </AuthContextProvider>
    </>
  );
};

// ==============================================

export default App;
