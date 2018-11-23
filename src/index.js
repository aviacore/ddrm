import React from 'react';
import ReactDOM from 'react-dom';
import { DrizzleProvider } from 'drizzle-react';
import { Router, Route } from 'react-router';
 
// Layouts
import Catalog from './layouts/Catalog';
import { LoadingContainer } from 'drizzle-react-components';

import { history, store } from './store';
import drizzleOptions from './drizzleOptions';

ReactDOM.render((
    <DrizzleProvider options={drizzleOptions} store={store}>
      <Router history={history} store={store}>
        <Route exact path="/" component={Catalog} />
      </Router>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);
