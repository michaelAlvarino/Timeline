import React from 'react'
import Item from './timelineitem'

class Timeline extends React.Component{
	// Step 1: Load initial data
	constructor(props, context){
		super(props)
	}

	// Step 2: Send request to get server/actual data
	// Step 3: Receive data
	// Step 4: Update global store
	// Step 5: Render function gets called because it's subsribed to the store
	// Step 6: React diffs virtual DOM and applies changes to acutal DOM

	render(){
		// This seems bad?
		// This should be in our inital state or something
		let name = '' || this.props.timeline && this.props.timeline.name;

		return(
			<div className="container-fluid">
				{name}
			</div>
		)
	}
}

Timeline.contextTypes = {
	store: React.PropTypes.object
}

module.exports = Timeline