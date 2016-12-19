import React from 'react'

class Item extends React.Component{

	constructor(props){
		super(props)
	}

	render(){
		return(
			<div className="col-md-4">
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