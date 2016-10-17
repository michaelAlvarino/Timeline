import React from 'react'
import styles from './index.scss'

class Footer extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return(
			<footer className={styles.footer}>
				<hr/>
				<p>Created by Walter Tan and Michael Alvarino</p>
			</footer>
		);
	}
}

module.exports = Footer;