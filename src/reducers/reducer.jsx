import {combineReducers} from 'redux'

function TimelineReducer(state={}, action){
	switch(action.type){
		case "InvalidateTimeline":
			return Object.assign({}, state, {
				didInvalidate: true
			})
		case "RequestTimeline":
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			})
		case "ReceiveTimeline":
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

function ItemReducer(state={}, action){
	switch(action.type){
		case "InvalidateItem":
			return Object.assign({}, state, {
				didInvalidate: true
			})
		case "RequestItem":
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			})
		case "ReceiveItem":
			return Object.assign({}, state, {
				isFetching: false, 
				didInvalidate: false,
				item: action.item,
				lastUpdated: action.receivedAt
			})
		default:
			return state
	}
}

function InitialData(state = {}, action){
	switch(action.type){
		case "GetInitialData":
			return Object.assign({}, state, {
			  	loading: false
			})
		default: 
		// for now lets return this object, later we'll return something from the actual server/database
			return Object.assign({}, state, {
			timeline: {
				id: 1,
				name: "Giants vs. Lions",
				enable: true,
				createdDate: (new Date()).toISOString(),
				updatedDate: (new Date()).toISOString(),
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
		})
	}
}

const rootReducer = combineReducers({
	TimelineReducer, 
	ItemReducer,
	InitialData
})

module.exports = rootReducer
