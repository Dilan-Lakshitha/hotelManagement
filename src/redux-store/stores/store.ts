import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/auth-reducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import driverReducer from '../reducers/driver-reducer';
import guideReducer from '../reducers/guide-reducer';
import hotelReducer from '../reducers/hotel-reducer';
import locationReducer from '../reducers/location-reducer';
import travelerReducer from '../reducers/traveler-reducer';
import itineraryReducer from '../reducers/itinerary-reducer';
import bookingtourReducer from '../reducers/bookingtour-reducer';


const persistConfig = {
  key: 'root',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    driver: driverReducer,
    guide: guideReducer,
    hotel : hotelReducer,
    location:locationReducer,
    traveler : travelerReducer,
    itinerary : itineraryReducer,
    bookingtour : bookingtourReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
