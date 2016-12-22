import React from 'react'
import Item from './timelineitem'

class Timeline extends React.Component{
	// Step 1: Load initial data
	constructor(props, context){
		super(props)
		this.state = context.store.getState()
	}

	// Step 2: Send request to get server/actual data
	// Step 3: Receive data
	// Step 4: Update global store
	// Step 5: Render function gets called because it's subsribed to the store
	// Step 6: React diffs virtual DOM and applies changes to acutal DOM

	render(){
		var items = (this.state.TimelineReducer && this.state.TimelineReducer.timeline) || this.state.InitialData.timeline.items
		var data = Object.keys(items).map((key)=>{
			return <Item key={key.toString()} title={items[key].title} content={items[key].content}/>
		})
		return(
			<div className="container-fluid">
				{data}
			</div>
		)
	}
}

Timeline.contextTypes = {
	store: React.PropTypes.object
}

module.exports = Timeline