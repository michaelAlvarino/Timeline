const paramsRegex 	= /(.*)(:[a-zA-Z0-9\-_]+\b)\((.*)\)/;
const regexRegex 	= /[?^{}()|[\]\\]/;

/**
 * @constructor
 * @param {string}	partition	
 * @param {boolean}	regex
 * @param {boolean}	leaf
 */
var RegexTrieNode = function (partition, regex, leaf) {
	this.partition 	= partition || '';
	this.regex		= regex 	|| false;
	this.leaf		= leaf 		|| false;
	this.children	= {};
	this.regexNodes = {};
};

RegexTrieNode.prototype.getMatchingRegexNode = function (partition) {
	var key, currentNode;

	if (this.children.hasOwnProperty(partition)) {
		return this.children[partition];
	}

	for (key in this.regexNodes) {
		currentNode = this.regexNodes[key];
		if (this.regexNodes.hasOwnProperty(key) && currentNode.partition.exec(partition)) {
			return currentNode;
		}
	}

	return null;
}

/**
 * @constructor
 */
var RegexTrie = function () {
	this.root 		= new RegexTrieNode();
	this.patterns 	= {};
};

/**
 * Inserts a regex pattern into the trie
 * 
 * @param	{string}	pattern	A URL or path
 * @return	{RegexTrie}			Fluent setter
 */
RegexTrie.prototype.insert = function (pattern) {
	if (typeof pattern !== 'string') { 
		throw 'Pattern must be a string!';
	}

	if (!this.patterns.hasOwnProperty(pattern)) {
		var pathPartitions = pattern.split('/');
		this._insert(pathPartitions);
	}

	return this;
};

/**
 * @param  {string[]} pathPartitions [description]
 */
RegexTrie.prototype._insert = function (pathPartitions) {
	var currentNode 		= this.root,
		pathPartitionLength = pathPartitions.length,
		index, partition, leaf, regex, matches, regexNode;

	for (index = 0; index < pathPartitionLength; index++) {
		partition 	= pathPartitions[index];
		regex		= partition.search(regexRegex) !== -1;
		leaf		= index === pathPartitionLength - 1;
		matches 	= partition.match(paramsRegex);

		if (regex) {
			if (matches !== null) partition = matches[3];

			partition = new RegExp(partition);
		}

		if (!currentNode.children.hasOwnProperty(partition)) {
			regexNode = new RegexTrieNode(partition, regex, leaf);
			currentNode.children[partition]  = regexNode;

			if (regex) currentNode.regexNodes[partition] = regexNode;
		}

		currentNode = currentNode.children[partition];
	}
};

/**
 * @param {string}	path
 */
RegexTrie.prototype.match = function (path) {
	var pathPartitions		= path.split('/'),
		pathPartitionLength = pathPartitions.length,
		currentNode			= this.root,
		index, partition, match;

	for (index = 0; index < pathPartitionLength; index++) {
		partition = pathPartitions[index];

		currentNode = currentNode.getMatchingRegexNode(partition);

		if (!currentNode) {
			return false;
		}
	}

	return currentNode.leaf;
}

module.exports = RegexTrie;