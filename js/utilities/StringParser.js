import letterMap from '../../public/data/letters_map.min.json'
import alphabets from '../../public/data/alpabets_info.min.json'
import blockData from '../../public/data/unicode_block_data.min.json'
import blockRanges from '../../public/data/unicode_block_ranges.min.json'

const SYMBOL_TYPE = { number: 0, main: 1, other: 9}
const meta = {
  meta: {
    latin: {
      lower: [],
      upper: [],
      number: [],
      symbol: []
    },
    other: {
      letter: [],
      lower: [],
      upper: [],
      symbol: []
    },
    length: 0,
    depth: 36
  }
}
function StringParserException (message) {
  this.message = message
  this.name = 'StringParserException'
}
const latinIndex = alphabets.findIndex((f) => { return f.name === 'latin' })

const parser = {

  isSymbolNumber: (charCode) => {
    return charCode >= 48 && charCode <= 57
  },

  isSymbolMain: (charCode) => {
    return ((charCode >= 32 && charCode <= 47) ||
      (charCode >= 58 && charCode <= 64) ||
      (charCode >= 91 && charCode <= 96) ||
      (charCode >= 123 && charCode <= 126))
  },

  isLetterLatin: (charCode) => {
    return letterMap[charCode].languages.indexOf(latinIndex) !== -1
  },

  isCharacterSymbol: (charCode) => {
    if (parser.isCharacterLetter(charCode)) {
      throw new StringParserException('Symbol can\'t be letter! (isCharacterSymbol)')
    }
    const isSymbol = blockRanges.filter((f) => {
      return charCode >= f[0] && charCode <= f[1]
    }).length > 0

    if (!isSymbol) {
      throw new StringParserException('Neither letter nor symbol, this should not happen. (isCharacterSymbol)')
    }
    return isSymbol
  },

  getSymbolData: (charCode) => {
    if (parser.isCharacterSymbol(charCode)) {
      let blockIndex = -1
      blockRanges.forEach((r, ri) => {
        if (charCode >= r[0] && charCode <= r[1]) {
          blockIndex = ri
          return
        }
      })
      if (blockIndex !== -1) {
        return blockData[blockIndex]
      }
    }

    throw new StringParserException('Probably symbol, replace error message when symbolMap is ready. (isCharacterSymbol)')
  },

  getLetterData: (charCode) => {
    if (!parser.isCharacterLetter(charCode)) throw new StringParserException('This should not happen! (getLetterData: character is not a letter' + charCode + ')')
    return letterMap[charCode]
  },

  isCharacterLetter: (charCode) => {
    return letterMap.hasOwnProperty(charCode)
  },

  getCharacterData: (charCode) => {
    const isLetter = parser.isCharacterLetter(charCode)
    return Object.assign({ isLetter: isLetter }, isLetter ? parser.getLetterData(charCode) : parser.getSymbolData(charCode))
  },

  decompoundString: (string) => { // Ä
    const chars = string.split('').map((char) => {
      const code = char.charCodeAt()
      return Object.assign(
        {
          char: char,
          code: code,
          processed: false,
          isSymbol: false,
          symbolType: 0
          // isNumber - 1
          // isMain - 2
          // isOther - 9
        },
        parser.getCharacterData(code)
      )
    })
    chars.forEach((d, i) => {
      if (d.isLetter) {
        if (d.languages.length === 1) {
          d.processed = true
          const alphabetIndex = d.languages[0]
          chars.filter((f) => (!f.processed && f.isLetter)).forEach((dd, ii) => {
          // cyrilic if letter present only in one of lang and than we
          // choose letter from cyrilic but it can be in multiple we treat it as first lang

            if (dd.languages.indexOf(alphabetIndex) !== -1) {
              dd.processed = true
              dd.binding = i
              dd.possible_languages = dd.languages.length
            }
          })
        }
      } else {
        // if (!d.error) {
        d.processed = true
        d.isSymbol = true

        if (parser.isSymbolNumber(d.code)) {
          d.symbolType = SYMBOL_TYPE['number']
          console.log(d.char, ' - symbol:number')
        } else if (parser.isSymbolMain(d.code)) {
          d.symbolType = SYMBOL_TYPE['main']
          console.log(d.char, ' - symbol:main') // block of main symbols, look at isSymbolMain
        } else {
          d.symbolType = SYMBOL_TYPE['other']
          console.log(d.char, ' - symbol:other') // other than number and main block symbol
        }
      }
    })

    // const latinIndex = letterMap
    // console.log(alphabets)
    let tmp = chars.filter((f) => (!f.processed))
    if (tmp.length > 0) {
      tmp.forEach((d, i) => {
        console.log(d.char)
        if (d.isLetter && parser.isLetterLatin(d.code)) {
          d.processed = true
          d.isLatin = true
          console.log(d.char, ' - is latin')
        } else {
          console.log('is not latin, and multiple languages')
        }
      })
    }

    tmp = chars.filter((f) => (!f.processed))
    if (tmp.length > 0) {
      throw new StringParserException('Characters to process ' + JSON.stringify(tmp))
    } else {
      return { length: string.length, depth: chars.length }
      // TODO return whole meta block with all filled data
      console.log('All characters processed', chars)
    }
  }
}

module.exports = {
  parseString: (v) => {
    if (typeof v !== 'string') {
      v = ''
    }
    return parser.decompoundString(v)
  }
}

