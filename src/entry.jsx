import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.jsx'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import rootReducer from './reducers/reducer.jsx'
import thunkMiddleware from 'redux-thunk'

var store = createStore(rootReducer,
	applyMiddleware(thunkMiddleware))

ReactDOM.render(
	<Provider store={store}>
	    <App/>
    </Provider>,
    document.getElementById('app')
);
/*
What i'm thinking the store should look like...
Should somewhat mirror the timeline-timelineitem structure
{
	timeLine: {
		id: {type: 'integer'},
		name: {type: 'string', minLength: 1, maxLength: 255},
		enable: {type: 'boolean'},
		createdDate: {type: 'string', format: 'date-time'},
		updatedDate: {type: 'string', format: 'date-time'},
		items: {
			id: {
					timelineId: {type: 'integer'},
					title: {type: 'string'},
					content: {type: 'string'},
					userId: {type: 'integer'},
					createdDate: {type: 'string', format: 'date-time'},
					updatedDate: {type: 'string', format: 'date-time'}
				},
			id: {},
			id: {}
		}
	}
}
*/