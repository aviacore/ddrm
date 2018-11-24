import {GET_ITEMS} from "./actions";
import { CHOOSE_CONTENT, FETCH_CONTENT_LIST, RESET_CONTENT_CHOICE } from './actions';

const initialState = {
  data: [],
  contentList: [],
  chosenContentId: null,
  purchasedContentList: [
    {
      id: 3,
      name: 'Project 3',
      timeLeft: '20min'
    }
  ]
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

  if( action.type === CHOOSE_CONTENT ) {
    return { ...state, chosenContentId: action.data.id}
  }

  if( action. type === FETCH_CONTENT_LIST) {
    return { ...state, contentList: [
      {
        id: 1,
        name: 'Project 1',
        price: 43
      },
      {
        id: 2,
        name: 'Project 2',
        price: 58
      },
      {
        id: 3,
        name: 'Project 3',
        price: 12
      }
    ]}
  }

  if( action.type === RESET_CONTENT_CHOICE ) {
    return { ...state, chosenContentId: null}
  }

  return state;
};

export default reducer;
