const alphabets = require('./data/unicode_alphabets.min.json')
const fs = require('fs')

const letterMap = {}
const alphabetNames = Object.keys(alphabets)
const alphabetInfos = []
const alphabetNameToId = alphabetNames.reduce((reducer, element, elementIndex) => {
  return Object.assign(reducer, { [element]: elementIndex })
}, {})

alphabetNames.forEach((alphabetName) => {
  const alphabet = alphabets[alphabetName].letters
  const alphabetInfo = { name: alphabetName, count: alphabet.length, upper_count: 0, lower_count: 0, cased: false, error: false, error_message: '', upper: [], lower: [] }

  alphabet.reduce((chmap, letter) => {
    const isUpper = letter.title.indexOf('Capital') !== -1
    const isLower = letter.title.indexOf('Small') !== -1
    const letterCase = isUpper ? 1 : isLower ? 2 : 0 // 0 - not cased, 1 - upper case, 2 - lower case

    if (isUpper) {
      ++alphabetInfo.upper_count
      alphabetInfo.upper.push(letter.letter)
    } else if (isLower) {
      ++alphabetInfo.lower_count
      alphabetInfo.lower.push(letter.letter)
    } else {
      alphabetInfo.upper.push(letter.letter)
    }

    const code = parseInt(letter.code.replace('U+', ''), 16) // int format
    if (chmap.hasOwnProperty(code)) {
      chmap[code].languages.push(alphabetNameToId[alphabetName])
    } else {
      chmap[code] = { languages: [alphabetNameToId[alphabetName]], case: letterCase, title: letter.title }
    }
    return chmap
  }, letterMap)

  if (alphabetInfo.lower_count > 0 || alphabetInfo.upper_count > 0) {
    alphabetInfo.cased = true
  }

  alphabetInfos.push(alphabetInfo)
})

fs.writeFile('./output/letters_map.min.json', JSON.stringify(letterMap), function (err) {
  if (err) { return console.log(err) }
  console.log('The "letter_map.json" file was saved!')
})

fs.writeFile('./output/alpabets_info.min.json', JSON.stringify(alphabetInfos), function (err) {
  if (err) { return console.log(err) }
  console.log('The "alpabets_info.json" file was saved!')
})
