import React from 'react';
import ReactDOM from 'react-dom';
import { DrizzleProvider } from 'drizzle-react';
import { Router, Route } from 'react-router';
 
// Layouts
import App from './App';

import { history, store } from './store';
import drizzleOptions from './drizzleOptions';


ReactDOM.render((
    <DrizzleProvider options={drizzleOptions} store={store}>
        <Router history={history} store={store}>
          <App />
        </Router>
      
    </DrizzleProvider>
  ),
  document.getElementById('root')
);
