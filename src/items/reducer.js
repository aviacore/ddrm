import {GET_ITEMS} from "./actions";

const initialState = {
  data: []
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

  return state;
};

export default reducer;
