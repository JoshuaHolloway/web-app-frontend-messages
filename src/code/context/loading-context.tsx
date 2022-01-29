import { createContext, useState } from 'react';

// ==============================================

interface LoadingContextInterface {
  is_loading: boolean;
  startLoading: (duration: number) => void;
  endLoading: () => void;
  loading_animation_duration: number;
}

const LoadingContext = createContext<LoadingContextInterface>({
  is_loading: false,
  startLoading: () => {},
  endLoading: () => {},
  loading_animation_duration: 1,
});

// ==============================================

type Props = {
  children: JSX.Element;
};
const LoadingContextProvider = (props: Props) => {
  const [is_loading, setIsLoading] = useState(false);
  const [loading_animation_duration, setLoadingAnimationDuration] = useState(1);

  const startLoading = (duration: number) => {
    setLoadingAnimationDuration(duration);
    setIsLoading(true);
  };

  const endLoading = () => {
    setIsLoading(false);
  };

  const context = {
    is_loading,
    startLoading,
    endLoading,
    loading_animation_duration,
  };

  return <LoadingContext.Provider value={context}>{props.children}</LoadingContext.Provider>;
};

// ==============================================

export { LoadingContextProvider };
export default LoadingContext;
