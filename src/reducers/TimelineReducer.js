const TimelineConstants = require('../constants/TimelineConstants')

const initialState = {
	timelines: {
		// TODO: Leave this as an empty object in the future
		1: {
			items: {
				1: {
						timelineId: 1,
						title: "OBJ Touchdown",
						content: "Pass from Eli Manning to OBJ",
						userId: 1,
						createdDate: (new Date()).toISOString(),
						updatedDate: (new Date()).toISOString()
					},
				2: {
						timelineId: 1,
						title: "Matt Stafford Sacked",
						content: "Giants defense is getting way better",
						userId: 1,
						createdDate: (new Date()).toISOString(),
						updatedDate: (new Date()).toISOString()
					},
				3: {
						timelineId: 1,
						title: "Matt Stafford leads a comeback?",
						content: "IDK the game isn't over yet...",
						userId: 1,
						createdDate: (new Date()).toISOString(),
						updatedDate: (new Date()).toISOString()
					},
				4: {
					timelineId: 1,
					title: "Game Over",
					content: "Game over, Giants win, tough loss to the Lions who are a pretty good team",
					userId: 1,
					createdDate: (new Date()).toISOString(),
					updatedDate: (new Date()).toISOString()
				}
			}
		}
	},
	isFetching: null,
	didInvalidate: null
}

const TimelineReducer = (state = initialState, action) => {
	switch(action.type){
		case TimelineConstants.REQUEST_TIMELINES:
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			})

		case TimelineConstants.RECEIVE_TIMELINES:
			console.log(action)
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false,
				timelines: action.payload
			})

		// TODO: Update this action
		case "InvalidateTimeline":
			return Object.assign({}, state, {
				didInvalidate: true
			})

		case TimelineConstants.REQUEST_TIMELINE:
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			})

		case TimelineConstants.RECEIVE_TIMELINE:
			return Object.assign({}, state, {
				isFetching: false, 
				didInvalidate: false,
				timeline: action.timeline,
				lastUpdated: action.receivedAt
			})

		default:
			return state
	}
}

module.exports = TimelineReducer