import React, { Component } from 'react';
import { Route } from 'react-router';
import { Switch } from 'react-router-dom';
import HomeContainer from './layouts/home/HomeContainer';

// Styles

import './css/styles.css';
import Header from './layouts/Header';
import Catalog from './layouts/Catalog';
import Cabinet from './layouts/Cabinet';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Catalog} />
          <Route exact path="/cabinet" component={Cabinet} />
        </Switch>
      </div>
    );
  }
}

export default App;
