import React from 'react';
import moment from 'moment';

export default ({ items }) =>
  items.map(({ id, name, time }) => {
    const now = Date.now();
    const estimate = time * 1000 - now;
    const duration = moment.duration(estimate, 'milliseconds');

    return (
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
            <span>{`${duration.hours()} Days, ${duration.hours()}:${duration.minutes()}:${duration.seconds()}`}</span>
          </div>
        </div>
      </div>
    );
  });
