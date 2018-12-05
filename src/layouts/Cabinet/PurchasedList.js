import React from 'react';
import moment from 'moment';

export default ({ items }) =>
  items.map(({ id, name, time }) => {
    const now = Date.now();
    const estimate = time * 1000 - now;
    const duration = moment.duration(estimate, 'milliseconds');
    const days = moment(time * 1000).diff(now, 'days');

    return (
      <div className="el tile" key={id}>
        <div className="el-wrapper">
          <div className="name">
            <span className="proj-name">{name}</span>
            <span className="proj-descr" />
          </div>
          <div className="time">
            <div className="label">
              <div className="icon" />
              <span>You have left</span>
            </div>
            <div className="digits">
              <div className="block">
                <div className="panel">{days}</div>
                <div className="panel-label">days</div>
              </div>
              <div className="sep">:</div>
              <div className="block">
                <div className="panel">{duration.hours()}</div>
                <div className="panel-label">hours</div>
              </div>
              <div className="sep">:</div>
              <div className="block">
                <div className="panel">{duration.minutes()}</div>
                <div className="panel-label">minutes</div>
              </div>
              <div className="sep">:</div>
              <div className="block">
                <div className="panel">{duration.seconds()}</div>
                <div className="panel-label">seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
