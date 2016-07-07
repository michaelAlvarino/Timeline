'use strict';
// walt... am I creating the class correctly in es5 here? i so we cna keep it or change it to es6, idc i just wanted tot learn

const Model = require('objection').Model;

/**
 * @class TimelineItem
 * @extends {Model}
 */
var TimelineItem = function() {
	// Need to call 'super()' here
	// You can do it by using call or apply
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
	// 
	// If you feel like it, you can run through some exercises on bind, call, and apply
	// It's pretty important for JS interviews
	// http://javascriptissexy.com/javascript-apply-call-and-bind-methods-are-essential-for-javascript-professionals/
	// If you're up for it, you can also write myBind, myCall, myApply (knowing that 'context' is an object is helpful)
}

// Bruh, so close. Remember if you set Timeline.prototype to Model.prototype, you actually just write to Model
// You need to set up the prototype chain to _point_ to Model.prototype using Object.create();
// Fortunately for us, Model actually comes with an extends method. It calls Object.create()
// 		https://github.com/Vincit/objection.js/blob/master/src/utils/classUtils.js
// So we can just write Model.extend(TimelineItem);
TimelineItem.prototype = Model.prototype;

TimlineItem.tableName = 'timelineItems';

TimelineItem.jsonSchema = {
	type: 'object',
	required: ['timelineId', 'title', 'content', 'userId', 'createdDate', 'updatedDate'],
	properties:{
		id: {type: 'integer'},
		timelineId: {type: 'integer'},
		// is text the correct type?
		// From what I can see it'll still be string?
		// https://spacetelescope.github.io/understanding-json-schema/reference/type.html
		content: {type: 'string'}
	}
};

// These last two are kind of weird because we declare them to be static in the ES6 version
// 
// Some preface... Basically, everything in JS is an object, even functions like constructors. 
// So, when you wrote var TimelineItem = function () {}, you made a new function object
// {
// 		constructor: something,
// 		prototype: something
// }
// 
// At this point, you can see that you can just add properties to that object like TimelineItem.jsonSchema
// If you set a function to jsonSchema, you can run
// TimelineItem.jsonSchema(); like you would for a static method
// 
// Unfortunately, there are more things going on with how Objection uses these static things...
// We don't actually just write static tableName() in the ES6 version, we write:
// 		static get tableName() { return 'tableName???'; }
// dat 'get'
// 
// What 'get' does is dynamically set a property onto the Constructor
// So, static get tableName() { return 'tableName???'; } roughly translates to:
// 
// TimelineItem.tableName = 'tableName???';
// 
// And static get jsonSchema () { return {}; } turns into
// 
// TimelineItem.jsonSchema = {};
//
//
// So yeah... just set TimelineItem.jsonSchema to the return object you wrote