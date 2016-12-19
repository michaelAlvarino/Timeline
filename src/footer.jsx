import React from 'react'
import styles from './index.scss'

class Footer extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		const styles = {
			"position": "absolute",
			"bottom": "0"
		}
		return(
			<footer className="footer" >
				<div className="container" style={styles}>
					<hr/>
					<p>Created by Walter Tan and Michael Alvarino</p>
				</div>
			</footer>
		);
	}
}

module.exports = Footer;