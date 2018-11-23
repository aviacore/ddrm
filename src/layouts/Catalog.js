import React, {Component} from 'react';

import '../css/styles.css';

class Catalog extends Component {
  constructor(props) {
      super(props);
      this.state = {};
  }

  render = () => {
    return (
    <div className="catalog">
      <div className="catalog-wrapper">
        <div className="bg"></div>
        <div className="bg"></div>
        <div className="bg"></div>
        <div className="list">
          <div className="list-wrapper tile">
            <div className="el header">
              <div className="id"></div>
              <div className="name">
                <div></div>
              </div>
              <div className="price">
                <div></div>
              </div>
              <div className="button">
              </div>
            </div>
            <div className="el tile">
              <div className="id">1</div>
              <div className="name">Project1</div>
              <div className="price">43</div>
              <div className="button">
                <div></div>
              </div>
            </div>
            <div className="el tile">
              <div className="id">1</div>
              <div className="name">Project1</div>
              <div className="price">43</div>
              <div className="button">
              <div></div>
              </div>
            </div>
            <div className="el tile">
              <div className="id">1</div>
              <div className="name">Project1</div>
              <div className="price">43</div>
              <div className="button">
              <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

export default Catalog;