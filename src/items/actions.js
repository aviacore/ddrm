import getItems from './getItems';

export const GET_ITEMS = 'GET_ITEMS';
export const ITEMS_RECEIVED = 'ITEMS_RECEIVED';
export const FETCH_CONTENT_LIST = 'FETCH_CONTENT_LIST';

export const getData = dispatch => async () => {
  return dispatch({
    type: ITEMS_RECEIVED,
    data: await getItems()
  });
};


export function fetchContentList() {
  
  return {
      type: FETCH_CONTENT_LIST,
      payload: {}
  }
}
