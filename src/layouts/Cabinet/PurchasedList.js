import React from 'react';

export default ({ items }) =>
  items.map(({ id, name, time }) => (
    <div className="el" key={id}>
      <div className="project tile">
        <div className="id">
          <span>{id}</span>
        </div>
        <div className="name">
          <span>{name}</span>
        </div>
      </div>
      <div className="time tile">
        <div className="time-wrapper">
          <span>{new Date(time*1000).toDateString()}</span>
        </div>
      </div>
    </div>
  ));
