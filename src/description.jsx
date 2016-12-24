import React from 'react'

class Description extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return <div className="row">
				<p>
					Welcome to Timeline, where you can create, update, and provide 
					sources for local histories.
				</p>
			</div>
	}
}

module.exports = Description;