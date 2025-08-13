import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AppNavigation from './src/navigation/AppNavigation';
import {Provider} from 'react-redux';
import {store, persistorStore} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistorStore}>
        <GestureHandlerRootView style={{flex: 1}}>
          <AppNavigation />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
