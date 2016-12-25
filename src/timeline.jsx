import React from 'react'
import TimelineItem from './timelineitem'

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

	render() {
		const state = this.context.store.getState()

		let timelines = state.TimelineReducer.timelines

		return(
			<div className="container-fluid">
				{
					Object.keys(timelines).map(timelineId => {
						let timeline = timelines[timelineId]
						let timelineItems = timeline.items || {0: {title: 'A TITLE', content: 'DRAMATIC CONTENT???'}}
						
						return Object.keys(timelineItems).map(timelineItemId => {
							let timelineItem = timelineItems[timelineItemId]

							return <div>
								<h2>{timeline.name}</h2>
								<TimelineItem 
								title={timelineItem.title}
								content={timelineItem.content} />
							</div>
						})
					})
				}
			</div>
		)
	}
}

Timeline.contextTypes = {
	store: React.PropTypes.object
}

module.exports = Timeline