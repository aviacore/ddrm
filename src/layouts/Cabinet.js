import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import '../css/styles.css';

class Cabinet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render = () => {
    return (
    <div className="cabinet">
      <div className="cabinet-wrapper">
        <div className="page">
          <div className="page-wrapper">
            <div className="sidebar tile">
              <div className="sidebar-wrapper">
                <div className="avatar">
                  <div></div>
                </div>
                <div className="address"><span>OX23232E3FE21S...</span></div>
                <div className="separator"></div>
                <div className="balance">
                  <div className="icon"></div>
                  <div className="number"><span>32</span></div>
                </div>
              </div>
            </div>
            <div className="list tile">
              <div className="list-wrapper">

                <div className="el header">
                  <div className="project">
                    <div className="header-icon">
                      <div></div>
                    </div>
                  </div>
                  <div className="time">
                    <div className="time-wrapper header-icon">
                      <div></div>
                    </div>
                  </div>
                </div>

                <div className="el">
                  <div className="project tile">
                    <div className="id"><span>1</span></div>
                    <div className="name"><span>Project1</span></div>
                  </div>
                  <div className="time tile">
                    <div className="time-wrapper">
                      <span>20</span>
                      <span>:</span>
                      <span>43</span>
                    </div>
                  </div>
                </div>
                <div className="el">
                  <div className="project tile">
                    <div className="id"><span>1</span></div>
                    <div className="name"><span>Project1</span></div>
                  </div>
                  <div className="time tile">
                    <div className="time-wrapper">
                      <span>20</span>
                      <span>:</span>
                      <span>43</span>
                    </div>
                  </div>
                </div>
                <div className="el">
                  <div className="project tile">
                    <div className="id"><span>1</span></div>
                    <div className="name"><span>Project1</span></div>
                  </div>
                  <div className="time tile">
                    <div className="time-wrapper">
                      <span>20</span>
                      <span>:</span>
                      <span>43</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    
    
    
    
    );
  }
}
  
  export default Cabinet;