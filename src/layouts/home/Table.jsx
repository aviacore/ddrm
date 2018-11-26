import React from 'react';
import Table from 'react-table';

export default ({ data }) => (
  <Table
    data={data}
    columns={[
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Info',
        accessor: 'name'
      },
      {
        Header: 'Price',
        accessor: 'price'
      }
    ]}
  />
);
