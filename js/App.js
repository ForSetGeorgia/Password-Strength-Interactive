import React from 'react'
import StringInfo from './StringInfo'
import StatsTable from './StatsTable'

import { parseString } from './utilities/StringParser'

const App = React.createClass({
  getInitialState () {
    return {
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
      },
      languages: [],
      characters: []
    }
  },
  componentDidMount () {
    parseString('a1')
  },
  setMetaState (metaState) {
    if (metaState !== {}) {
      console.log('setMetaState')
      this.setState({ metaState })
    } else {
      console.log('empty')
    }
    // const meta = this.state.meta
    // meta = metaState
  },
  handleChange (event) {
    // console.log('------------------------')
    this.setMetaState(parseString(event.target.value))
  },
  render () {
    return (
      <div className='app'>
        <nav>
          <a href="/" className="nav-brand">
            <img src="public/assets/logo.svg" width="48" height="48" />
            Password Strength Interactive
          </a>
        </nav>
        <main>
          <div className='password-input'>
            <label for='password-input'>Hammer Strongpassword Game</label>
            <input type='text' name='password-input' placeholder='Type password' onChange={this.handleChange} />
          </div>
          <StringInfo meta={this.state.meta} />
          <StatsTable meta={{length: this.state.meta.length, depth: this.state.meta.depth}} />
        </main>
      </div>
    )
  }
})

export default App
