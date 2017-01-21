import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App/App';

import './app.css';
import 'font-awesome/css/font-awesome.css';

const mountNode = document.querySelector('#root');
ReactDOM.render(<App />, mountNode);