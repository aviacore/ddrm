import React, { Component } from 'react';
import { Route } from 'react-router';
import { Switch } from 'react-router-dom';
// import HomeContainer from './layouts/home/HomeContainer';

import Header from './layouts/Header';
import Catalog from './layouts/Catalog/Catalog';
import Cabinet from './layouts/Cabinet/Cabinet';
import Admin from './layouts/Admin/Admin';

// Styles
import './css/styles.less';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Catalog} />
          <Route exact path="/cabinet" component={Cabinet} />
          <Route exact path="/admin" component={Admin} />
        </Switch>
      </div>
    );
  }
}

export default App;
