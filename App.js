import React from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Main from './Main';
import { AppRegistry } from 'react-native';
import { Loader } from './components/Loader';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <Main />
      </PersistGate>
    </Provider>
  );
}
AppRegistry.registerComponent('project', () => App);
