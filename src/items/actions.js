import getItems from './getItems';

export const GET_ITEMS = 'GET_ITEMS';
export const ITEMS_RECEIVED = 'ITEMS_RECEIVED';

export const getData = dispatch => async () => {
  return dispatch({
    type: ITEMS_RECEIVED,
    data: await getItems()
  });
};
