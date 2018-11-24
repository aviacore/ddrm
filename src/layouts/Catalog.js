import React, {Component} from 'react';

import '../css/styles.css';

class Catalog extends Component {
  constructor(props) {
      super(props);
      this.state = {};
  }


  /**
   * <div className="bg"></div>
          <div className="bg"></div>
          <div className="bg"></div>
          <div className="list">
   * 
   * 
   */
  render = () => {
    return (
      <div className="catalog">
        <div className="catalog-wrapper">
          
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
                <div className="id"><span>1</span></div>
                <div className="name"><span>Project1</span></div>
                <div className="price"><span>43</span></div>
                <div className="button">
                  <div></div>
                </div>
              </div>
              <div className="el tile">
                <div className="id"><span>1</span></div>
                <div className="name"><span>Project1</span></div>
                <div className="price"><span>43</span></div>
                <div className="button">
                  <div></div>
                </div>
              </div>
              <div className="el tile">
                <div className="id"><span>1</span></div>
                <div className="name"><span>Project1</span></div>
                <div className="price"><span>43</span></div>
                <div className="button">
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Catalog;