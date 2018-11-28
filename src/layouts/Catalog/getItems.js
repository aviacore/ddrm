const setTime = (item, time) => ({ ...item, time });

export const data = [
  { id: 1, name: 'Project1', price: 12, description: 'blablalba' },
  { id: 2, name: 'Project2', price: 56, description: 'helloworld' },
  { id: 3, name: 'Project3', price: 21, description: 'blahblah' },
  { id: 4, name: 'Project4', price: 98, description: 'trololo' }
];

export const purchasedData = [setTime(data[0], '20min'), setTime(data[1], '30min')];

export const getData = () => new Promise((resolve, reject) => setTimeout(() => resolve(data)), 100);
export const getPurchasedData = () => new Promise((resolve, reject) => setTimeout(() => resolve(purchasedData)), 100);
