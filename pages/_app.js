import { useReducer } from 'react';
import { Provider } from 'next-auth/client';
import '../styles/globals.css';
import Layout from '../components/Layout/Layout';
import {
  StateContext,
  DispatchContext,
  initialState,
  reducer
} from '../utils/lib/state-store/user-storage';

function MyApp({ Component, pageProps }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Provider session={pageProps.session}>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </Provider>
  );
}

export default MyApp;
