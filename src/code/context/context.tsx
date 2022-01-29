import * as React from 'react';

// ==============================================

export interface AppContextInterface {
  name: string;
  f: () => void;
}

// ==============================================

const AppCtx = React.createContext<AppContextInterface | null>({
  name: '',
  f: () => {},
});

// ==============================================

const context: AppContextInterface = {
  name: 'Using React Context in a Typescript App',
  f: () => {
    alert('clicked button in context');
  },
};

type Props = {
  children: JSX.Element;
};
const AppCtxProvider = ({ children }: Props) => <AppCtx.Provider value={context}>{children}</AppCtx.Provider>;

// ==============================================

export { AppCtxProvider };
export default AppCtx;

// ==============================================
