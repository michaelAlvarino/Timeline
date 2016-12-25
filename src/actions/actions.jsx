const request = require('reqwest')
const TimelineConstants = require('../constants/TimelineConstants')

const Actions = { 
	RequestTimelines: function () {
		return {
			type: 'RequestTimelines'
		}
	},

	ReceiveTimelines: function (timelines) {
		return {
			type: 'ReceiveTimelines',
			payload: timelines
		}
	},

	FetchTimelines: function FetchTimelines() {
		// returns a function
		return (dispatch) => {

			// dispatches our requesttimeline action
			dispatch(Actions.RequestTimelines())

			return request({
				url: 'api/timelines',
				method: 'GET'
			}).then(response => {
				dispatch(Actions.ReceiveTimelines(response.data))
			})
		}
	},

	GetInitialData: function() {
		return { 
			type: "GetInitialData"
		}
	},
	// to be used for refreshing a timeline
	InvalidateTimeline: function(name){
		return {
			type: "InvalidateTimeline",
			name
		}
	},
	RequestTimeline: function(name){
		return{
			type: "RequestTimeline",
			name
		}
	},
	ReceiveTimeline: function(json){
		return {
			type: "ReceiveTimeline",
			name: json.name,
			timeline: json,
			receivedAt: Date.now()
		}
	},
	// redux-thunk lets us dispatch functions and promises
	// if i dispatch this function with the id parameter it will return a
	// promise with which we can dispatch other stuff like receiveTimeline...
	FetchTimeline: function(id){

		// returns a function
		return (dispatch) => {

			// dispatches our requesttimeline action
			dispatch(Actions.RequestTimeline("Durmstrang"))

			return request({
				url: 'api/timelines/' + id,
				method: 'get'
			})
			.then((response)=>{
				dispatch(Actions.ReceiveTimeline(response.data))
			})
		}
		/*
		return new Promise((resolve, reject)=>{
			request({
				url: 'localhost:8000/api/timeline/1',
				method: 'get',
				success: resolve,
				error: reject
			})
		})*/
	},
	InvalidateItem: function(itemId){
		return{
			type: "InvalidateItem",
			itemId
		}
	},
	RequestItems: function(timelineId){
		return{
			type: "RequestItems",
			timelineId
		}
	},
	ReceiveItems: function(timelineId, json){
		return {
			type: "ReceiveItems",
			timelineId,
			items: json.data.children.map(child => child.data),
			receivedAt: Date.now()
		}
	}
}

module.exports = Actions;