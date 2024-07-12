const BadWordFilterKo = require(`badword-filter-ko`);
const BadWordsFilterMul = require('bad-words-next');
const en = require('bad-words-next/data/en.json');
const es = require('bad-words-next/data/es.json');
const fr = require('bad-words-next/data/fr.json');
const de = require('bad-words-next/data/de.json');
const ru = require('bad-words-next/data/ru.json');
const rl = require('bad-words-next/data/ru_lat.json');
const ua = require('bad-words-next/data/ua.json');
const pl = require('bad-words-next/data/pl.json');
const ch = require('bad-words-next/data/ch.json');

const BadWordsFilterMul = new BadWordsFilterMul({ data: [...en, ...es, ...fr, ...de, ...ru, ...rl, ...ua, ...pl, ...ch] });

const checkBadWords = (text) => {
    
    // 다국어 필터
    if (BadWordsFilterMul.check(text)) {
        return true;
    }

    // 한국어 필터
    const BadWordFilterKo = new BadWordFilterKo();
    if (BadWordFilterKo.has(text)) {
        return true;
    }
    return false;
};

module.exports = checkBadWords;
