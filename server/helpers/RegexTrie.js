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
};

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
		index, partition, leaf, regex, matches;

	for (index = 0; index < pathPartitionLength; index++) {
		partition 	= pathPartitions[index];
		regex		= partition.search(regexRegex) !== -1;
		leaf		= index === pathPartitionLength - 1;
		matches 	= partition.match(paramsRegex);

		if (regex && matches !== null) {
			partition = matches[3];
		}

		if (!currentNode.children.hasOwnProperty(partition)) {
			currentNode.children[partition] = new RegexTrieNode(partition, regex, leaf);
		}

		currentNode = currentNode.children[partition];
	}
};

module.exports = RegexTrie;