import React from 'react';
import moment from 'moment';

export default ({ items }) =>
  items.map(({ id, name, time }) => {
    const now = Date.now();
    const estimate = time * 1000 - now;
    const duration = moment.duration(estimate, 'milliseconds');
    const days = moment(time * 1000).diff(now, 'days');

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
            <span>{`${days} Days, ${duration.hours()}:${duration.minutes()}:${duration.seconds()}`}</span>
          </div>
        </div>
      </div>
    );
  });
