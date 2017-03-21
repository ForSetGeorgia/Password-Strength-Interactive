import React from 'react'
import alphabets from '../public/data/unicode_alphabets.min.json'
import blocks from '../public/data/unicode_blocks.min.json'
import { uniq } from 'lodash'

/*
Ä german
Ó czech hungarian polish
 */
/* TODO - put in separate file */
const charmap = {}
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
  }, charmap)

  // if (alphabetInfo.lower_count !== alphabetInfo.upper_count) {
  //   alphabetInfo.error = true
  //   alphabetInfo.error_message = "Upper is not matching lower letters"
  // }
  if (alphabetInfo.lower_count > 0 || alphabetInfo.upper_count > 0) {
    alphabetInfo.cased = true
  }

  alphabetInfos.push(alphabetInfo)
})
// console.log(alphabetInfos, alphabetNameToId)
/* TODO end */

const App = React.createClass({
  getInitialState () {
    return {
      languages: [],
      characters: []
    }
  },
  getLanguageCaseInformation (info) {
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
    return charmap[character.charCodeAt()].languages.map((element) => this.getLanguageInformation(element))
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
    const characterInfo = charmap[character.charCodeAt()]

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
  decompoundCharacters (chars) {
    const meta = chars.split('').map((char) => {
      return charmap[char.charCodeAt()]
    })

    meta.forEach((d, i) => {
      if (d.languages.length === 1) {
        const alp = alphabetInfos[d.languages[0]]
        console.log(alp, alp.name)
        meta.forEach((dd, ii) => {
          if (i !== ii) {

          }
        })
      } else {
        console.log(d.title, d.languages)
      }
    })
    console.log(meta, 'here')
  },
  handleChange (event) {
    this.decompoundCharacters(event.target.value)
    this.setCharactersList(this.identifyString(event.target.value))
    this.setLanguagesList(this.identifyStringLanguages(event.target.value))
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
