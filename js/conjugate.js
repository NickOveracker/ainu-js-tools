/**
 * @param stem:         The immutable stem of the verb in Latin characters.
 * @param transitivity: One of the following values.
 *                      0: Impersonal
 *                      1: Intransitive
 *                      2: Transitive
 *                      3: Ditransitive
 * @param plurality:    One of the following values.
 *                      0: Singular or plural
 *                      1: Singular only
 *                      2: Plural only
 * @param accent:       0 if regular, -1 if unaccented.
 *                      Otherwise, the number of the accented syllable.
 * @param definition:   English definition.
 */
function Verb(stem, transitivity, plurality, accent, definition) {
	this.stem = stem;
	this.transitivity = transitivity;
	this.plurality = plurality;
	this.accent = accent;
	this.definition = definition;
}

Verb.prototype.useShortPrefix = function() {
	return this.stem.charAt(0) !== 'i' && this.startsWithVowel();
}

Verb.prototype.startsWithVowel = function() {
	switch(this.stem.charAt(0).toLowerCase()) {
		case 'a':
		case 'e':
		case 'i':
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
				prefix = "a=";
				break;
		}
	}
	else {
		switch(person) {
			case 1:
				if(this.useShortPrefix()) {
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
