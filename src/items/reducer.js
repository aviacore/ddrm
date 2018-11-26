import { GET_ITEMS } from './actions';
import {
  CHOOSE_CONTENT,
  FETCH_CONTENT_LIST,
  RESET_CONTENT_CHOICE,
  FETCH_PURCHASED_CONTENT_LIST,
  CHANGE_THEME
} from './actions';
import { DataBase, DataBasePurchased } from '../layouts/DataBase.jsx';

const initialState = {
  data: [],
  contentList: [],
  chosenContentId: null,
  lightTheme: true,

  user: {
    username: 'Jonh Prodman',
    avatarUrl: 'https://avatanplus.com/files/photos/mid/57d52a901c3e415718ae42f4.jpg',
    address: 'OX23232E3FE21S...',
    purchasedContentList: [],
    balance: 23
  }
};

const reducer = (state = initialState, action) => {
  // if (action.type === 'USER_LOGGED_IN' || action.type === 'USER_UPDATED') {
  //   return Object.assign({}, state, {
  //     data: action.payload
  //   });
  // }
  //
  // if (action.type === 'USER_LOGGED_OUT') {
  //   return Object.assign({}, state, {
  //     data: null
  //   });
  // }

  /*if (action.type === 'ITEMS_RECEIVED'){
    return {...state, data: action.data}
  }*/

  if (action.type === CHOOSE_CONTENT) {
    return { ...state, chosenContentId: action.data.id };
  }

  if (action.type === FETCH_CONTENT_LIST) {
    return { ...state, contentList: DataBase };
  }

  if (action.type === RESET_CONTENT_CHOICE) {
    return { ...state, chosenContentId: null };
  }

  if (action.type === FETCH_PURCHASED_CONTENT_LIST) {
    const user = { ...state.user, purchasedContentList: DataBasePurchased };
    return { ...state, user };
  }

  if (action.type === CHANGE_THEME) {
    return { ...state, lightTheme: !state.lightTheme };
  }

  return state;
};

export default reducer;
