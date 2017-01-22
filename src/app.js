import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';

import 'font-awesome/css/font-awesome.css';

import App from 'containers/App/App';
import makeRoutes from './routes';
import './app.css';

const routes = makeRoutes();

const mountNode = document.querySelector('#root');

ReactDOM.render(<App history={browserHistory} routes={routes}/>, mountNode);