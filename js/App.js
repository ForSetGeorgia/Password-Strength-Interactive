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
        <input type='text' onChange={this.handleChange} />
        <hr />
        <StringInfo meta={this.state.meta} />
        <StatsTable meta={{length: this.state.meta.length, depth: this.state.meta.depth}} />
      </div>
    )
  }
})

export default App
