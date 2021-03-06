import React from 'react';
import reactDOM from 'react-dom';
import { App } from './components/routerComponent';
import { AppContainer } from 'react-hot-loader';
import '../src/resources/styles/bootstrap.min.css';
import '../src/resources/styles/custom.scss';
import '../src/resources/styles/bootstrap4switches.css';
import '../src/resources/styles/toastr.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';

const render = () => {
  reactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};
render();
