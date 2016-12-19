import React from 'react'
import Item from './timelineitem'

class Timeline extends React.Component{
	constructor(props, context){
		super(props)
		this.state = context.store.getState();
	}

	render(){
		var items = this.state.timeline.items
		var data = Object.keys(items).map((key)=>{
			return <Item key={key.toString()} title={items[key].title} content={items[key].content}/>
		})
		return(
			<div className="container-fluid">
				{data}
			</div>
			);
	}
}

Timeline.contextTypes = {
	store: React.PropTypes.object
}

module.exports = Timeline