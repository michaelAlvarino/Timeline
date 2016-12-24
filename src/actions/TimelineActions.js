import TimelineConstants from '../constants/TimelineConstants'
import reqwest from 'reqwest'

const TimelineActions = {
	requestTimelines: function requestTimelines() {
		return {
			type: TimelineConstants.REQUEST_TIMELINES
		}
	},

	receiveTimelines: function receiveTimelines(timelines) {
		return {
			type: TimelineConstants.RECEIVE_TIMELINES,
			payload: timelines
		}
	},

	fetchTimelines: function fetchTimelines() {
		return (dispatch) => {
			// TODO: Try to understand what this is doing
			// I assume this is to display some type of loading spinner?
			// dispatch(TimelineActions.RequestTimelines())

			return reqwest({ 
					url: 'api/timelines', 
					method: 'GET' 
				})				
				.then(response => dispatch(TimelineActions.receiveTimelines(response.data)))
				.catch(err => dispatch(TimelineActions.errorTimelines(response.errors)))
		}
	},

	errorTimelines: function errorTimelines(errors) {
		return {
			type: TimelineConstants.ERROR_TIMELINES,
			payload: errors
		}
	},

	requestTimeline: function requestTimeline() {
		return {
			type: TimelineConstants.REQUEST_TIMELINE
		}
	},

	receiveTimeline: function receiveTimeline(timeline) {
		return {
			type: TimelineConstants.RECEIVE_TIMELINE,
			payload: timelines
		}
	},

	fetchTimeline: function fetchTimeline(timelineId) {
		return (dispatch) => {
			// I assume this is to display some type of loading spinner?
			dispatch(TimelineActions.RequestTimelines())

			return reqwest({ 
					url: `api/timelines/${timelineId}`, 
					method: 'GET'
				})				
				.then(response => dispatch(Actions.ReceiveTimelines(response.data)))
				.catch(err => dispatch(Actions.errorTimelines(response.errors)))
		}
	},

	errorTimeline: function errorTimeline(errors) {
		return {
			type: TimelineConstants.ERROR_TIMELINE,
			payload: errors
		}
	}
}

module.exports = TimelineActions