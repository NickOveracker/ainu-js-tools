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

function addAccent(word, syllable) {
    let ret = word;
    let vowels = [];
    let offset = 0;
    
    // Skip certain prefixes
    if(word.indexOf('eci=') === 0) {
        offset = 'eci='.length;
    } else if(word.indexOf('a=') === 0) {
        offset = 'a='.length;
    } else if(word.indexOf('i=') === 0) {
        offset = 'i='.length;
    } else if(word.indexOf('=') >= 0) {
        // otherwise, ignore the default accented syllable
        syllable = 0;
    }

    if(syllable !== -1) {

        for(let ii = 0 + offset; ii < word.length; ii++) {
            if(isVowel(word.charAt(ii))) {
                vowels.push(ii);
            }
        }

        if((offset > 0 || vowels.length > 1) && (syllable <= vowels.length)) {
             if(syllable === 0) {
                // Heavy if there are two consonants between the first and second vowels.
                let firstSyllHeavy = (word.charAt(vowels[0]+1) !== '=') && (vowels[1] - vowels[0] > 2);
                syllable = firstSyllHeavy ? 1 : 2;
            }
            ret = swapVowel(word, vowels[syllable-1]);
        }
    }

    return ret;
}

function latinToKana(word) {
    let retStr = '';
    let vowels = [];

    for(let ii = 0; ii < word.length; ii++) {
        if(isVowel(word.toLowerCase().charAt(ii))) {
            vowels.push(ii);
        }
    }
    if(vowels.length === 1) {
        retStr += kanaMap[word];
    }
    else {
        let syllStart = 0;
        let syllEnd = 0;
        for(let ii = 1; ii < vowels.length; ii++) {
            if(vowels[ii] - vowels[ii-1] > 2) {
                syllEnd = vowels[ii-1]+1;
            }
            else {
                syllEnd = vowels[ii-1];
            }
            retStr += kanaMap[word.substring(syllStart, syllEnd + 1)];
            syllStart = syllEnd + 1;
        }
        
        retStr += kanaMap[word.substring(syllStart, word.length)];
    }
    
    return retStr;
}

/**
 * Generate a tooltip with a verb conjugation table
 * Returns undefined if the verb passed is not recognized.
 *
 * @param verbElement: The HTML element containing the verb.
 */
function generateVerbTooltip(verbElement) {
    let tooltip;
    
    if(verbElement.classList.contains("vocab-verb0") || 
       verbElement.classList.contains("vocab-verb1") || 
       verbElement.classList.contains("vocab-verb2") || 
       verbElement.classList.contains("vocab-verb3")) {
           
        // Get the stem.
        var verb = verbElement.textContent;
        
        // Add the tooltip class to enable mousover.
        verbElement.classList.add("tooltip");
        
        // Now, create the table span.
        tooltip = document.createElement("span");
        tooltip.classList.add("tooltiptext");
        // Create the table itself inside the span.
        var table = tooltip.appendChild(document.createElement("table"));
        table.classList.add("conjugation-table");
        for(var jj = 0; jj < 5; jj++) {
            var row  = table.appendChild(document.createElement("tr"));
            if(jj === 0) {
                // Generate the header row.
                let cell = row.appendChild(document.createElement("th"));
                cell.textContent = "Person";
                cell = row.appendChild(document.createElement("th"));
                cell.textContent = "Singular";
                cell = row.appendChild(document.createElement("th"));
                cell.textContent = "Plural";
            } else {
                // Generate the regular rows.
                // Start with the text elements...
                let singularLatin = document.createElement("p");
                singularLatin.textContent = verbList[verb].conjugate(jj, true);
                let pluralLatin = document.createElement("p");
                pluralLatin.textContent = verbList[verb].conjugate(jj, false);
                let singularKana = document.createElement("p");
                singularKana.textContent = latinToKana(singularLatin);
                let pluralKana = document.createElement("p");
                pluralKana.textElement = latinToKana(pluralLatin);
                
                // Add accents to the latin text
                if(verbList[verb].accent >= 0) {
                    singularLatin = addAccent(singularLatin, verbList[verb].accent);
                    pluralLatin = addAccent(pluralLatin, verbList[verb].accent);
                }
                
                // Now generate the cells themselves.
                let cell = row.appendChild(document.createElement("td"));
                cell.textContent = jj;
                cell = row.appendChild(document.createElement("td"));
                cell.appendChild(singularLatin);
                cell.appendChild(singularKana);
                cell = row.appendChild(document.createElement("td"));
                cell.appendChild(pluralLatin);
                cell.appendChild(pluralKana);
            }
        }
    }
    
    return tooltip;
}

function formatAinuVocabList() {
    let vocab = document.getElementsByClassName('ainu-vocab');
    let tooltip;
    
    for(let ii = 0; ii < vocab.length; ii++) {
        let syllable = 0;
        let kana = '';
        
        // This will be undefined if not a verb.
        tooltip = generateVerbTooltip(vocab[ii]);
        
        if(vocab[ii].hasAttribute('setkana')) {
            kana = vocab[ii].getAttribute('setkana');
        }
        else {
            kana = latinToKana(vocab[ii].textContent);
        }
        
        if(vocab[ii].hasAttribute('accent')) {
            syllable = vocab[ii].getAttribute('accent');
        }
        if(syllable >= 0) {
            vocab[ii].textContent = addAccent(vocab[ii].textContent, syllable);
        }
        vocab[ii].textContent += "（" + kana + "）";
        if(tooltip) {
            vocab[ii].appendChild(tooltip);
            tooltip = undefined;
        }
    }
}

var kanaMap = {
    "a": "ア",
    "i": "イ",
    "u": "ウ",
    "e": "エ",
    "o": "オ",
    "ka": "カ",
    "ki": "キ",
    "ku": "ク",
    "ke": "ケ",
    "ko": "コ",
    "sa": "サ",
    "si": "シ",
    "su": "ス",
    "se": "セ",
    "so": "ソ",
    "ta": "タ",
    "tu": "トゥ",
    "te": "テ",
    "to": "ト",
    "ca": "チャ",
    "ci": "チ",
    "cu": "チュ",
    "ce": "チェ",
    "co": "チョ",
    "na": "ナ",
    "ni": "ニ",
    "nu": "ヌ",
    "ne": "ネ",
    "no": "ノ",
    "ha": "ハ",
    "hi": "ヒ",
    "hu": "フ",
    "he": "ヘ",
    "ho": "ホ",
    "pa": "パ",
    "pi": "ピ",
    "pu": "プ",
    "pe": "ペ",
    "po": "ポ",
    "ma": "マ",
    "mi": "ミ",
    "mu": "ム",
    "me": "メ",
    "mo": "モ",
    "ya": "ヤ",
    "yu": "ユ",
    "ye": "イェ",
    "yo": "ヨ",
    "ra": "ラ",
    "ri": "リ",
    "ru": "ル",
    "re": "レ",
    "ro": "ロ",
    "wa": "ワ",
    "we": "ウェ",
    "wo": "ウォ",
    "k": "ㇰ",
    "s": "ㇱ",
    "m": "ㇺ",
    "r": "ㇻ",
    /*"r": "ㇼ",
    "r": "ㇽ",
    "r": "ㇾ",
    "r": "ㇿ",*/
    "n": "ン",
    "t": "ッ",
    "y": "イ", 
    "w": "ウ",
    "ak": "アㇰ",
    "as": "アㇱ",
    "am": "アㇺ",
    "an": "アン",
    "at": "アッ",
    "ay": "アイ",
    "aw": "アウ",
    "ik": "イㇰ",
    "is": "イㇱ",
    "im": "イㇺ",
    "in": "イン",
    "it": "イッ",
    "iy": "イイ",
    "iw": "イウ",
    "uk": "ウㇰ",
    "us": "ウㇱ",
    "um": "ウㇺ",
    "un": "ウン",
    "ut": "ウッ",
    "uy": "ウイ",
    "uw": "ウウ",
    "ek": "エㇰ",
    "es": "エㇱ",
    "em": "エㇺ",
    "en": "エン",
    "et": "エッ",
    "ey": "エイ",
    "ew": "エウ",
    "ok": "オㇰ",
    "os": "オㇱ",
    "om": "オㇺ",
    "on": "オン",
    "ot": "オッ",
    "oy": "オイ",
    "ow": "オウ",
    "ar": "アㇻ",
    "ir": "イㇼ",
    "ur": "ウㇽ",
    "er": "エㇾ",
    "or": "オㇿ",
    "ap": "アㇷ゚",
    "ip": "イㇷ゚",
    "ep": "エㇷ゚",
    "up": "ウㇷ゚",
    "op": "オㇷ゚",
    "kak": "カㇰ",
    "kas": "カㇱ",
    "kam": "カㇺ",
    "kan": "カン",
    "kat": "カッ",
    "kay": "カイ",
    "kaw": "カウ",
    "kik": "キㇰ",
    "kis": "キㇱ",
    "kim": "キㇺ",
    "kin": "キン",
    "kit": "キッ",
    "kiy": "キイ",
    "kiw": "キウ",
    "kuk": "クㇰ",
    "kus": "クㇱ",
    "kum": "クㇺ",
    "kun": "クン",
    "kut": "クッ",
    "kuy": "クイ",
    "kuw": "クウ",
    "kek": "ケㇰ",
    "kes": "ケㇱ",
    "kem": "ケㇺ",
    "ken": "ケン",
    "ket": "ケッ",
    "key": "ケイ",
    "kew": "ケウ",
    "kok": "コㇰ",
    "kos": "コㇱ",
    "kom": "コㇺ",
    "kon": "コン",
    "kot": "コッ",
    "koy": "コイ",
    "kow": "コウ",
    "kar": "カㇻ",
    "kir": "キㇼ",
    "kur": "クㇽ",
    "ker": "ケㇾ",
    "kor": "コㇿ",
    "kap": "カㇷ゚",
    "kip": "キㇷ゚",
    "kep": "ケㇷ゚",
    "kup": "クㇷ゚",
    "kop": "コㇷ゚",
    "sak": "サㇰ",
    "sas": "サㇱ",
    "sam": "サㇺ",
    "san": "サン",
    "sat": "サッ",
    "say": "サイ",
    "saw": "サウ",
    "sik": "シㇰ",
    "sis": "シㇱ",
    "sim": "シㇺ",
    "sin": "シン",
    "sit": "シッ",
    "siy": "シイ",
    "siw": "シウ",
    "suk": "スㇰ",
    "sus": "スㇱ",
    "sum": "スㇺ",
    "sun": "スン",
    "sut": "スッ",
    "suy": "スイ",
    "suw": "スウ",
    "sek": "セㇰ",
    "ses": "セㇱ",
    "sem": "セㇺ",
    "sen": "セン",
    "set": "セッ",
    "sey": "セイ",
    "sew": "セウ",
    "sok": "ソㇰ",
    "sos": "ソㇱ",
    "som": "ソㇺ",
    "son": "ソン",
    "sot": "ソッ",
    "soy": "ソイ",
    "sow": "ソウ",
    "sar": "サㇻ",
    "sir": "シㇼ",
    "sur": "スㇽ",
    "ser": "セㇾ",
    "sor": "ソㇿ",
    "sap": "サㇷ゚",
    "sip": "シㇷ゚",
    "sep": "セㇷ゚",
    "sup": "スㇷ゚",
    "sop": "ソㇷ゚",
    "tak": "タㇰ",
    "tas": "タㇱ",
    "tam": "タㇺ",
    "tan": "タン",
    "tat": "タッ",
    "tay": "タイ",
    "taw": "タウ",
    "tuk": "トゥㇰ",
    "tus": "トゥㇱ",
    "tum": "トゥㇺ",
    "tun": "トゥン",
    "tut": "トゥッ",
    "tuy": "トゥイ",
    "tuw": "トゥウ",
    "tek": "テㇰ",
    "tes": "テㇱ",
    "tem": "テㇺ",
    "ten": "テン",
    "tet": "テッ",
    "tey": "テイ",
    "tew": "テウ",
    "tok": "トㇰ",
    "tos": "トㇱ",
    "tom": "トㇺ",
    "ton": "トン",
    "tot": "トッ",
    "toy": "トイ",
    "tow": "トウ",
    "tar": "タㇻ",
    "tur": "トゥㇽ",
    "ter": "テㇾ",
    "tor": "トㇿ",
    "tap": "タㇷ゚",
    "tep": "テㇷ゚",
    "tup": "トゥㇷ゚",
    "top": "トㇷ゚",
    "cak": "チャㇰ",
    "cas": "チャㇱ",
    "cam": "チャㇺ",
    "can": "チャン",
    "cat": "チャッ",
    "cay": "チャイ",
    "caw": "チャウ",
    "cik": "チㇰ",
    "cis": "チㇱ",
    "cim": "チㇺ",
    "cin": "チン",
    "cit": "チッ",
    "ciy": "チイ",
    "ciw": "チウ",
    "cuk": "チュㇰ",
    "cus": "チュㇱ",
    "cum": "チュㇺ",
    "cun": "チュン",
    "cut": "チュッ",
    "cuy": "チュイ",
    "cuw": "チュウ",
    "cek": "チェㇰ",
    "ces": "チェㇱ",
    "cem": "チェㇺ",
    "cen": "チェン",
    "cet": "チェッ",
    "cey": "チェイ",
    "cew": "チェウ",
    "cok": "チョㇰ",
    "cos": "チョㇱ",
    "com": "チョㇺ",
    "con": "チョン",
    "cot": "チョッ",
    "coy": "チョイ",
    "cow": "チョウ",
    "car": "チャㇻ",
    "cir": "チㇼ",
    "cur": "チュㇽ",
    "cer": "チェㇾ",
    "cor": "チョㇿ",
    "cap": "チャㇷ゚",
    "cip": "チㇷ゚",
    "cep": "チェㇷ゚",
    "cup": "チュㇷ゚",
    "cop": "チョㇷ゚",
    "nak": "ナㇰ",
    "nas": "ナㇱ",
    "nam": "ナㇺ",
    "nan": "ナン",
    "nat": "ナッ",
    "nay": "ナイ",
    "naw": "ナウ",
    "nik": "ニㇰ",
    "nis": "ニㇱ",
    "nim": "ニㇺ",
    "nin": "ニン",
    "nit": "ニッ",
    "niy": "ニイ",
    "niw": "ニウ",
    "nuk": "ヌㇰ",
    "nus": "ヌㇱ",
    "num": "ヌㇺ",
    "nun": "ヌン",
    "nut": "ヌッ",
    "nuy": "ヌイ",
    "nuw": "ヌウ",
    "nek": "ネㇰ",
    "nes": "ネㇱ",
    "nem": "ネㇺ",
    "nen": "ネン",
    "net": "ネッ",
    "ney": "ネイ",
    "new": "ネウ",
    "nok": "ノㇰ",
    "nos": "ノㇱ",
    "nom": "ノㇺ",
    "non": "ノン",
    "not": "ノッ",
    "noy": "ノイ",
    "now": "ノウ",
    "nar": "ナㇻ",
    "nir": "ニㇼ",
    "nur": "ヌㇽ",
    "ner": "ネㇾ",
    "nor": "ノㇿ",
    "nap": "ナㇷ゚",
    "nip": "二ㇷ゚",
    "nep": "ネㇷ゚",
    "nup": "ヌㇷ゚",
    "nop": "ノㇷ゚",
    "hak": "ハㇰ",
    "has": "ハㇱ",
    "ham": "ハㇺ",
    "han": "ハン",
    "hat": "ハッ",
    "hay": "ハイ",
    "haw": "ハウ",
    "hik": "ヒㇰ",
    "his": "ヒㇱ",
    "him": "ヒㇺ",
    "hin": "ヒン",
    "hit": "ヒッ",
    "hiy": "ヒイ",
    "hiw": "ヒウ",
    "huk": "フㇰ",
    "hus": "フㇱ",
    "hum": "フㇺ",
    "hun": "フン",
    "hut": "フッ",
    "huy": "フイ",
    "huw": "フウ",
    "hek": "ヘㇰ",
    "hes": "ヘㇱ",
    "hem": "ヘㇺ",
    "hen": "ヘン",
    "het": "ヘッ",
    "hey": "ヘイ",
    "hew": "ヘウ",
    "hok": "ホㇰ",
    "hos": "ホㇱ",
    "hom": "ホㇺ",
    "hon": "ホン",
    "hot": "ホッ",
    "hoy": "ホイ",
    "how": "ホウ",
    "har": "ハㇻ",
    "hir": "ヒㇼ",
    "hur": "フㇽ",
    "her": "ヘㇾ",
    "hor": "ホㇿ",
    "hap": "ハㇷ゚",
    "hip": "ヒㇷ゚",
    "hep": "ヘㇷ゚",
    "hup": "フㇷ゚",
    "hop": "ホㇷ゚",
    "pak": "パㇰ",
    "pas": "パㇱ",
    "pam": "パㇺ",
    "pan": "パン",
    "pat": "パッ",
    "pay": "パイ",
    "paw": "パウ",
    "pik": "ピㇰ",
    "pis": "ピㇱ",
    "pim": "ピㇺ",
    "pin": "ピン",
    "pit": "ピッ",
    "piy": "ピイ",
    "piw": "ピウ",
    "puk": "プㇰ",
    "pus": "プㇱ",
    "pum": "プㇺ",
    "pun": "プン",
    "put": "プッ",
    "puy": "プイ",
    "puw": "プウ",
    "pek": "ペㇰ",
    "pes": "ペㇱ",
    "pem": "ペㇺ",
    "pen": "ペン",
    "pet": "ペッ",
    "pey": "ペイ",
    "pew": "ペウ",
    "pok": "ポㇰ",
    "pos": "ポㇱ",
    "pom": "ポㇺ",
    "pon": "ポン",
    "pot": "ポッ",
    "poy": "ポイ",
    "pow": "ポウ",
    "par": "パㇻ",
    "pir": "ピㇼ",
    "pur": "プㇽ",
    "per": "ペㇾ",
    "por": "ポㇿ",
    "pap": "パㇷ゚",
    "pip": "ピㇷ゚",
    "pep": "ペㇷ゚",
    "pup": "プㇷ゚",
    "pop": "ポㇷ゚",
    "mak": "マㇰ",
    "mas": "マㇱ",
    "mam": "マㇺ",
    "man": "マン",
    "mat": "マッ",
    "may": "マイ",
    "maw": "マウ",
    "mik": "ミㇰ",
    "mis": "ミㇱ",
    "mim": "ミㇺ",
    "min": "ミン",
    "mit": "ミッ",
    "miy": "ミイ",
    "miw": "ミウ",
    "muk": "ムㇰ",
    "mus": "ムㇱ",
    "mum": "ムㇺ",
    "mun": "ムン",
    "mut": "ムッ",
    "muy": "ムイ",
    "muw": "ムウ",
    "mek": "メㇰ",
    "mes": "メㇱ",
    "mem": "メㇺ",
    "men": "メン",
    "met": "メッ",
    "mey": "メイ",
    "mew": "メウ",
    "mok": "モㇰ",
    "mos": "モㇱ",
    "mom": "モㇺ",
    "mon": "モン",
    "mot": "モッ",
    "moy": "モイ",
    "mow": "モウ",
    "mar": "マㇻ",
    "mir": "ミㇼ",
    "mur": "ムㇽ",
    "mer": "メㇾ",
    "mor": "モㇿ",
    "map": "マㇷ゚",
    "mip": "ミㇷ゚",
    "mep": "メㇷ゚",
    "mup": "ムㇷ゚",
    "mop": "モㇷ゚",
    "yak": "ヤㇰ",
    "yas": "ヤㇱ",
    "yam": "ヤㇺ",
    "yan": "ヤン",
    "yat": "ヤッ",
    "yay": "ヤイ",
    "yaw": "ヤウ",
    "yuk": "ユㇰ",
    "yus": "ユㇱ",
    "yum": "ユㇺ",
    "yun": "ユン",
    "yut": "ユッ",
    "yuy": "ユイ",
    "yuw": "ユウ",
    "yek": "イェㇰ",
    "yes": "イェㇱ",
    "yem": "イェㇺ",
    "yen": "イェン",
    "yet": "イェッ",
    "yey": "イェイ",
    "yew": "イェウ",
    "yok": "ヨㇰ",
    "yos": "ヨㇱ",
    "yom": "ヨㇺ",
    "yon": "ヨン",
    "yot": "ヨッ",
    "yoy": "ヨイ",
    "yow": "ヨウ",
    "yar": "ヤㇻ",
    "yur": "ユㇽ",
    "yer": "イェㇾ",
    "yor": "ヨㇿ",
    "yap": "ヤㇷ゚",
    "yep": "イェㇷ゚",
    "yup": "ユㇷ゚",
    "yop": "ヨㇷ゚",
    "rak": "ラㇰ",
    "ras": "ラㇱ",
    "ram": "ラㇺ",
    "ran": "ラン",
    "rat": "ラッ",
    "ray": "ライ",
    "raw": "ラウ",
    "rik": "リㇰ",
    "ris": "リㇱ",
    "rim": "リㇺ",
    "rin": "リン",
    "rit": "リッ",
    "riy": "リイ",
    "riw": "リウ",
    "ruk": "ルㇰ",
    "rus": "ルㇱ",
    "rum": "ルㇺ",
    "run": "ルン",
    "rut": "ルッ",
    "ruy": "ルイ",
    "ruw": "ルウ",
    "rek": "レㇰ",
    "res": "レㇱ",
    "rem": "レㇺ",
    "ren": "レン",
    "ret": "レッ",
    "rey": "レイ",
    "rew": "レウ",
    "rok": "ロㇰ",
    "ros": "ロㇱ",
    "rom": "ロㇺ",
    "ron": "ロン",
    "rot": "ロッ",
    "roy": "ロイ",
    "row": "ロウ",
    "rar": "ラㇻ",
    "rir": "リㇼ",
    "rur": "ルㇽ",
    "rer": "レㇾ",
    "ror": "ロㇿ",
    "rap": "ラㇷ゚",
    "rip": "リㇷ゚",
    "rep": "レㇷ゚",
    "rup": "ルㇷ゚",
    "rop": "ロㇷ゚",
    "wak": "ワㇰ",
    "was": "ワㇱ",
    "wam": "ワㇺ",
    "wan": "ワン",
    "wat": "ワッ",
    "way": "ワイ",
    "waw": "ワウ",
    "wek": "ウェㇰ",
    "wes": "ウェㇱ",
    "wem": "ウェㇺ",
    "wen": "ウェン",
    "wet": "ウェッ",
    "wey": "ウェイ",
    "wew": "ウェウ",
    "wok": "ウォㇰ",
    "wos": "ウォㇱ",
    "wom": "ウォㇺ",
    "won": "ウォン",
    "wot": "ウォッ",
    "woy": "ウォイ",
    "wow": "ウォウ",
    "war": "ワㇻ",
    "wer": "ウェㇽ",
    "wor": "ウォㇿ",
    "wap": "ワㇷ゚",
    "wep": "ウェㇷ゚",
    "wop": "ウォㇷ゚",
}
