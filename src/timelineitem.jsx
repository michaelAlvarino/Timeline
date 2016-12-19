import React from 'react'

class Item extends React.Component{

	constructor(props){
		super(props)
	}

	render(){
		const divstyle = {
			"border": "solid grey 2px",
			"border-radius": "5px",
			"margin": "10px"
		}
		return(
			<div className="col-md-4" style={divstyle}>
				<h2>{this.props.title}</h2>
				<p>{this.props.content}</p>
			</div>
		)
	}
}

Item.contextTypes = {
	store: React.PropTypes.object
}

module.exports = Item