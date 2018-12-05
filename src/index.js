import React from 'react';
import ReactDOM from 'react-dom';
import { DrizzleProvider } from 'drizzle-react';
import { Router } from 'react-router';
import { LoadingContainer } from 'drizzle-react-components';

// Layouts
import App from './App';

import { history, store } from './store';
import drizzleOptions from './drizzleOptions';

ReactDOM.render(
  <DrizzleProvider options={drizzleOptions} store={store}>
    <LoadingContainer>
      <Router history={history} store={store}>
        <App />
      </Router>
    </LoadingContainer>
  </DrizzleProvider>,
  document.getElementById('root')
);
