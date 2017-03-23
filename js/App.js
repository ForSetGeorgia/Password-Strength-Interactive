import React from 'react'
import './array'
// import { findIndex }
// var array = require('lodash/array');
import { letterMap, alphabetInfos as alphabets } from './Alphabet'
import { blockData, blockRanges } from './CharacterBlock'

const App = React.createClass({
  getInitialState () {
    return {
      languages: [],
      characters: []
    }
  },

  getSymbolData (charCode) {
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

  isCharacterSymbol (charCode) {
    const isSymbol = !this.isCharacterLetter(charCode) && blockRanges.filter((f) => {
      return charCode >= f[0] && charCode <= f[1]
    }).length > 0

    if (!isSymbol) {
      console.error('Neither letter nor symbol, this should not happen')
    }
    return isSymbol
  },

  isSymbolNumber (char) {
    const charCode = char.charCodeAt()
    return charCode >= 48 && charCode <= 57
  },

  isSymbolMain (char) {
    const charCode = char.charCodeAt()
    return ((charCode >= 32 && charCode <= 47) ||
      (charCode >= 58 && charCode <= 64) ||
      (charCode >= 91 && charCode <= 96) ||
      (charCode >= 123 && charCode <= 126))
  },

  isLetterLatin (char) {
    latinAlphabetIndex = alphabets.
    return
  },

  getLetterData (charCode) {
    return this.isCharacterLetter(charCode) ? letterMap[charCode] : { error: true, message: 'This should not happen!' }
  },

  isCharacterLetter (charCode) {
    return letterMap.hasOwnProperty(charCode)
  },

  getCharacterData (char) {
    const charCode = char.charCodeAt()
    const isLetter = this.isCharacterLetter(charCode)
    // console.log(char, this.isCharacterLetter(charCode), this.getLetterData(charCode))
    return Object.assign({ char: char, isLetter: isLetter }, isLetter ? this.getLetterData(charCode) : this.getSymbolData(charCode))
  },

  decompoundCharacters (chars) { // Ä
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
            console.log('Symbol:Number from block:', d.name, '(', d.count, ')')
          } else {
            if (this.isSymbolMain(d.char)) {
              console.log('Symbol:Main from block:', d.name, '(', d.count, ')')
            }
            else {
              console.log('Symbol:Other from block:', '(', d.name, d.count, ')')
            }
          }
        } else {
          console.log('Probably symbol but not found')
        }
      }
    })


    // const latinIndex = letterMap
     console.log(alphabets);
    const tmp = meta.filter((f) => (!f.processed))
    if (tmp.length > 0) {
      tmp.forEach((d, i) => {
        if (d.isLetter) {

        }
      })
       console.log('Check if latin');
      console.log('Characters to process', tmp)
    } else {
      console.log('All characters processed')
    }
    // console.log(meta, 'here')
  },
  handleChange (event) {
    console.log('------------------------')
    this.decompoundCharacters(event.target.value)
    // this.setCharactersList(this.identifyString(event.target.value))
    // this.setLanguagesList(this.identifyStringLanguages(event.target.value))
  },

  render () {
    return (
      <div className='app'>
        <input type='text' onChange={this.handleChange} />
        <hr />
        <label>Current letters:</label>
        <ul>{this.state.characters.map((character) => <li key={character}>{character}</li>)}</ul>
        <hr />
        <label>All possible languages for current letters:</label>
        <ul>{this.state.languages.map((language) => <li key={language}>{language}</li>)}</ul>
      </div>
    )
  }
})

export default App

/* getLanguageCaseInformation (info) {
    if (info.error) { return info.error_message }
    if (info.cased) {
      return `Upper: ${info.upper_count}, Lower: ${info.lower_count}`
    } else {
      return info.count
    }
  },
  getLanguageInformation (langId) {
    return `${alphabetNames[langId]} - ${this.getLanguageCaseInformation(alphabetInfos[langId])}`
  },
  identifyCharacterLanguages (character) {
    return letterMap[character.charCodeAt()].languages.map((element) => this.getLanguageInformation(element))
  },
  identifyStringLanguages (str) {
    return uniq(uniq(str.split('')).reduce((reducer, character) => {
      return reducer.concat(this.identifyCharacterLanguages(character))
    }, []))
  },
  setLanguagesList (langs) {
    this.setState({
      languages: langs
    })
  },

  getCaseInformation (caseState) {
    switch (caseState) {
      case 0:
        return 'Not sensitive to case'
      case 1:
        return 'Upper Case'
      case 2:
        return 'Lower Case'
      default:
        return 'N/A'
    }
  },
  identifyCharacter (character) {
    const characterInfo = letterMap[character.charCodeAt()]

    return `${characterInfo.title} - ${this.getCaseInformation(characterInfo.case)}`
  },
  identifyString (str) {
    return uniq(uniq(str.split('')).reduce((reducer, character) => {
      return reducer.concat(this.identifyCharacter(character))
    }, []))
  },
  setCharactersList (chars) {
    this.setState({
      characters: chars
    })
  },
*/
