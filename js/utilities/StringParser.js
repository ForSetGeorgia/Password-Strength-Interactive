import letterMap from '../../public/data/letters_map.min.json'
import alphabets from '../../public/data/alpabets_info.min.json'
import blockData from '../../public/data/unicode_block_data.min.json'
import blockRanges from '../../public/data/unicode_block_ranges.min.json'

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

const parser = {

  getSymbolData: (charCode) => {
    if (this.isCharacterSymbol(charCode)) {
      let blockIndex = -1
      blockRanges.forEach((r, ri) => {
        if (charCode >= r[0] && charCode <= r[1]) {
          blockIndex = ri
        }
      })
      if (blockIndex !== -1) {
        return blockData[blockIndex]
      }
    }

    return { error: true, message: 'Probably symbol, replace error message when symbolMap is ready' }
  },

  isCharacterSymbol: (charCode) => {
    const isSymbol = !this.isCharacterLetter(charCode) && blockRanges.filter((f) => {
      return charCode >= f[0] && charCode <= f[1]
    }).length > 0

    if (!isSymbol) {
      console.error('Neither letter nor symbol, this should not happen')
    }
    return isSymbol
  },

  isSymbolNumber: (char) => {
    const charCode = char.charCodeAt()
    return charCode >= 48 && charCode <= 57
  },

  isSymbolMain: (char) => {
    const charCode = char.charCodeAt()
    return ((charCode >= 32 && charCode <= 47) ||
      (charCode >= 58 && charCode <= 64) ||
      (charCode >= 91 && charCode <= 96) ||
      (charCode >= 123 && charCode <= 126))
  },

  isLetterLatin: (char) => {
    const charCode = char.charCodeAt()
    const latinAlphabetIndex = alphabets.findIndex((f) => { return f.name === 'latin' })
    return letterMap[charCode].languages.indexOf(latinAlphabetIndex) !== -1
  },

  getLetterData: (charCode) => {
    return this.isCharacterLetter(charCode) ? letterMap[charCode] : { error: true, message: 'This should not happen!' }
  },

  isCharacterLetter: (charCode) => {
    return letterMap.hasOwnProperty(charCode)
  },

  getCharacterData: (char) => {
    const charCode = char.charCodeAt()
    const isLetter = this.isCharacterLetter(charCode)
    // console.log(char, this.isCharacterLetter(charCode), this.getLetterData(charCode))
    return Object.assign({ char: char, isLetter: isLetter }, isLetter ? this.getLetterData(charCode) : this.getSymbolData(charCode))
  },

  decompoundCharacters: (chars) => { // Ä
    console.log('parseString')//, parser)
    return { indecompound: true }
    /*
    const meta = chars.split('').map((char) => {
      return Object.assign(
        this.getCharacterData(char),
        { processed: false }
      )
    })
    // console.log(meta)
    meta.forEach((d, i) => {
      if (d.isLetter) {
        if (d.languages.length === 1) {
          d.processed = true
          const alphabetIndex = d.languages[0]
          meta.filter((f) => (!f.processed && f.isLetter)).forEach((dd, ii) => {
            if (dd.languages.indexOf(alphabetIndex) !== -1) {
              dd.processed = true
              dd.binding = i
            }
          })
        }
      } else {
        if (!d.error) {
          d.processed = true
          if (this.isSymbolNumber(d.char)) {
            console.log(d.char, ' - symbol:number') // from block:', d.name, '(', d.count, ')')
          } else {
            if (this.isSymbolMain(d.char)) {
              console.log(d.char, ' - symbol:main') // from block:', d.name, '(', d.count, ')')
            } else {
              console.log(d.char, ' - symbol:other') // from block:', '(', d.name, d.count, ')')
            }
          }
        } else {
          console.log('Probably symbol but not found')
        }
      }
    })

    // const latinIndex = letterMap
    // console.log(alphabets)
    let tmp = meta.filter((f) => (!f.processed))
    if (tmp.length > 0) {
      tmp.forEach((d, i) => {
        if (d.isLetter && this.isLetterLatin(d.char)) {
          d.processed = true
          d.isLatin = true
          console.log(d.char, ' - is latin')
        } else {
          console.log('is not latin, and multiple languages')
        }
      })
    }

    tmp = meta.filter((f) => (!f.processed))
    if (tmp.length > 0) {
      console.log('Characters to process', tmp)
    } else {
      console.log('All characters processed')
    }
    // console.log(meta, 'here') */
  }

}

module.exports = {
  parseString: (v) => {
    if (typeof v === 'undefined') { return {} }
    return parser.decompoundCharacters(v)
  }
}

