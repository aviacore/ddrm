import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { drizzleReducers } from 'drizzle';

import items from './layouts/Catalog/reducer';

const reducer = combineReducers({
  routing: routerReducer,
  items,
  ...drizzleReducers
});

export default reducer;
