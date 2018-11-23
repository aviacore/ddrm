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
      </div>
    </div>);
  }
}
  
  export default Cabinet;