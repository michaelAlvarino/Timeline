
const reducer = function(state = {}, action){
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
						}
				}
			}
		})
	}
}

module.exports = reducer;
