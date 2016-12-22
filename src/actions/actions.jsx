var request = require('reqwest')

const Actions = { 
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
		return{
			type: "ReceiveTimeline",
			name,
			timeline: json.data.children.map(child => child.data),
			receivedAt: Date.now()
		}
	},
	// redux-thunk lets us dispatch functions and promises
	// if i dispatch this function with the id parameter it will return a
	// promise with which we can dispatch other stuff like receiveTimeline...
	FetchTimeline: function(id){
		return new Promise((resolve, reject)=>{
			request({
				url: 'localhost:8000/api/timeline/1',
				method: 'get',
				success: resolve,
				error: reject
			})

		})
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
		return{
			type: "ReceiveItems",
			timelineId,
			items: json.data.children.map(child => child.data),
			receivedAt: Date.now()
		}
	}
}

module.exports = Actions;