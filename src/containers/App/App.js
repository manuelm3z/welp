import React from 'react';

import styles from './styles.module.css';

export default class App extends React.Component {
	render() {
		return (
			<div className={styles.wrapper}>
				<h1>
					<i className="fa fa-star"></i>
					Enviroment: {__NODE_ENV__}
				</h1>
			</div>
			);
	}
}