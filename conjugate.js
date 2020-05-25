function Verb(stem, en_1s, en_3s, en_other, transitivity) {
	this.stem = stem;
	this.transitivity = transitivity;
	this.english = {
		first: {
			singular: en_1s,
			plural: en_other
		},
		second: {
			singular: en_other,
			plural: en_other
		},
		third: {
			singular: en_3s,
			plural: en_other
		}
	};
}

Verb.prototype.useShortPrefix = function() {
	switch(this.stem.charAt(0).toLowerCase()) {
		case 'a':
		case 'e':
		case 'o':
		case 'u':
			return true;
	}
	return false;
}

Verb.prototype.endsWithVowel = function() {
	let last = this.stem.length - 1;
	switch(this.stem.charAt(last).toLowerCase()) {
		case 'a':
		case 'e':
		case 'i':
		case 'o':
		case 'u':
			return true;
	}
	return false;
}

Verb.prototype.conjugateClass0 = function(person, singular) {
	let prefix = "";
	let postfix = "";
	return prefix + this.stem + postfix;
};
Verb.prototype.conjugateClass1 = function(person, singular) {
	let prefix = "";
	let postfix = "";
	if(singular) {
		switch(person) {
			case 1:
				if(this.useShortPrefix()) {
					prefix = "k=";
				}
				else {
					prefix = "ku=";
				}
				break;
			case 2:
				prefix = "e=";				
				break;
			case 3:
				break;
			case 4:
				postfix = "=an";
				break;
		}
	}
	else {
		switch(person) {
			case 1:
				postfix = "=as";
				break;
			case 2:
				prefix = "eci=";
				break;
			case 3:
				break;
			case 4:
				postfix = "=an";
				break;
		}
	}
	return prefix + this.stem + postfix;
};
Verb.prototype.conjugateClass2 = function(person, singular) {
	let prefix = "";
	let postfix = "";
	if(singular) {
		switch(person) {
			case 1:
				if(this.startsWithVowel()) {
					prefix = "k=";
				}
				else {
					prefix = "ku=";
				}
				break;
			case 2:
				prefix = "e=";				
				break;
			case 3:
				break;
			case 4:
				prefix = "a=";
				break;
		}
	}
	else {
		switch(person) {
			case 1:
				if(this.startsWithVowel()) {
					prefix = "c=";
				}
				else {
					prefix = "ci=";
				}
				break;
			case 2:
				prefix = "eci=";
				break;
			case 3:
				break;
			case 4:
				prefix = "a=";
				break;
		}
	}
	return prefix + this.stem + postfix;
};
Verb.prototype.conjugateClass3 = function(person, singular) {
	let prefix = "";
	let postfix = "";
	return prefix + this.stem + postfix;
};

Verb.prototype.conjugate = function(person, singular) {
	return this['conjugateClass' + this.transitivity](person, singular);
};

let foo = new Verb("ne", "am", "is", "are", 2);
console.log("Person\t\tSing.\t\tPlur.");

for(let ii = 1; ii <= 4; ii++) {
	console.log(ii + "\t\t" + foo.conjugate(ii, true) + "\t\t" + foo.conjugate(ii, false));
}
