import Clippings from '../models/Clippings';

function generateGUID(str) {
  let i = str.length;
  let hash = 5381;
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

function parseClippingsText(textFile) {
  const seperator = '==========';
  const clippings = textFile.split(seperator).map(section => {
    const lines = section.trim().split(/\r?\n/);
    const defaultValue = ['', '', ''];

    const clip = {};
    clip.id = generateGUID(section);
    clip.title = (lines[0].match(/(.+?)\((.*?)\)$/) || defaultValue)[1].trim();
    clip.text = lines.slice(2).join('\n').trim();
    clip.author = (lines[0].match(/(.+?)\((.*?)\)$/) || defaultValue)[2].trim();
    return clip.text.length ? clip : null;
  });
  return clippings.filter(n => n !== null);
}

function insertClippings(textFile) {
  const clippings = parseClippingsText(textFile);
  Clippings.collection.insert(clippings, err => {
    if (err) {
      console.log(err);
    } else {
      console.info('Clips were successfully stored.');
    }
  });
}

export default insertClippings;
