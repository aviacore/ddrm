import {GET_ITEMS} from "./actions";

const initialState = {
  data: [],
  contentList: [
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

  return state;
};

export default reducer;
