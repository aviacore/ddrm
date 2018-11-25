import getItems from './getItems';

export const GET_ITEMS = 'GET_ITEMS';
export const ITEMS_RECEIVED = 'ITEMS_RECEIVED';
export const FETCH_CONTENT_LIST = 'FETCH_CONTENT_LIST';
export const CHOOSE_CONTENT = 'CHOOSE_CONTENT';
export const RESET_CONTENT_CHOICE = 'RESET_CONTENT_CHOICE';
export const FETCH_PURCHASED_CONTENT_LIST = 'FETCH_PURCHASED_CONTENT_LIST';
export const CHANGE_THEME = 'CHANGE_THEME';
export const BUY_CONTENT = 'BUY_CONTENT';

export const getData = dispatch => async () => {
  return dispatch({
    type: ITEMS_RECEIVED,
    data: await getItems()
  });
};

export const chooseContent = id => dispatch => {
  dispatch({
    type: CHOOSE_CONTENT,
    data: {
      id
    }
  });
};

export const resetContentChoice = () => dispatch => {
  return dispatch({
    type: RESET_CONTENT_CHOICE
  });
};

export const fetchContentList = () => dispatch => {
  return dispatch({
    type: FETCH_CONTENT_LIST
  });
};

export const fetchPurchasedContentList = () => dispatch => {
  return dispatch({
    type: FETCH_PURCHASED_CONTENT_LIST
  });
};

export const changeTheme = () => dispatch => {
  return dispatch({
    type: CHANGE_THEME
  });
};

export const buyContent = (id) => dispatch => {
  return dispatch({
    type: BUY_CONTENT,
    data: {
      id
    }
  })
}
