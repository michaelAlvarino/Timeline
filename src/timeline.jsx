import React from 'react'

class Timeline extends React.Component{
	constructor(props, context){
		super(props)
		this.state = context.store.getState();
	}

	render(){
		var items = this.state.timeline.items
		var data = Object.keys(items).map((key)=>{
			return <Item title={items[key].title} content={items[key].content}/>
		})
		return(
			<div>
				{data}
			</div>
			);
	}
}

// should probably move this out to its own component to add some styles and make it more dynamic
var Item = (props) =>{ return(<div><h2>{props.title}</h2><p>{props.content}</p></div>)}

Timeline.contextTypes = {
	store: React.PropTypes.object
}

module.exports = Timeline