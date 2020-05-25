function addAccent(word, syllable) {
  let ret = word;
	let vowels = [];

	if(syllable !== -1) {
    function isVowel(char) {
      switch(char.toLowerCase()) {
        case 'a':
        case 'i':
        case 'e':
        case 'o':
        case 'u':
          return true;
      }
      return false;
    }

		function swapVowel(_word, index) {
      switch(_word.charAt(index).toLowerCase()) {
        case 'a':
					return _word.substring(0, index) + 'á' + _word.substring(index+1, _word.length);
        case 'e':
          return _word.substring(0, index) + 'é' + _word.substring(index+1, _word.length);
				case 'i':
          return _word.substring(0, index) + 'í' + _word.substring(index+1, _word.length);
				case 'o':
          return _word.substring(0, index) + 'ó' + _word.substring(index+1, _word.length);
				case 'u':
          return _word.substring(0, index) + 'ú' + _word.substring(index+1, _word.length);
      }
    }

    for(let ii = 0; ii < word.length; ii++) {
      if(isVowel(word.charAt(ii))) {
        vowels.push(ii);
      }
    }

		if(vowels.length > 1 && (syllable <= vowels.length)) {
   		if(syllable === 0) {
        let firstSyllHeavy = vowels[1] - vowels[0] > 2;
				syllable = firstSyllHeavy ? 1 : 2;
      }
			ret = swapVowel(word, vowels[syllable-1]);
    }
  }

	return ret;
}

function addAllAccents() {
  let vocab = document.getElementsByClassName('ainu-vocab');
  
  for(let ii = 0; ii < vocab.length; ii++) {
    let syllable = 0;
    if(vocab[ii].hasAttribute('accent')) {
      syllable = vocab[ii].getAttribute('accent');
    }
    if(syllable >= 0) {
    	vocab[ii].textContent = addAccent(vocab[ii].textContent, syllable);
    }
  }
}
