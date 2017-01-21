import React from 'react';
import ReactDOM from 'react-dom';
import './app.css';
import styles from './styles.module.css';

class App extends React.Component {
	render() {
		return (
			<div className={styles.wrapper}>
				<h1>Enviroment: {__NODE_ENV__}</h1>
			</div>
			);
	}
}

const mountNode = document.querySelector('#root');

ReactDOM.render(<App />, mountNode);