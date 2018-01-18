import React from 'react'
import StringInfo from './StringInfo'
import StatsTable from './StatsTable'
import { FormattedMessage, intlShape, injectIntl, defineMessages } from 'react-intl'

import { parseString } from './utilities/StringParser'

const messages = defineMessages({
  second_name: {
    id: 'app.second_name',
    defaultMessage: 'Hammer Strongpassword Game'
  }
})

const App = React.createClass({
  propTypes: {
    intl: intlShape.isRequired
  },
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
          <a href='/' className='nav-brand'>
            <img src='public/assets/logo.svg' width='48' height='48' />
            <FormattedMessage id='app.name' defaultMessage='Password Strength Interactive' />
          </a>
        </nav>
        <main>
          <div className='password-input'>
            <label htmlFor='password-input'>{this.props.intl.formatMessage(messages.second_name)}</label>
            <input type='text' name='password-input' placeholder='Type password' onChange={this.handleChange} />
          </div>
          <StringInfo meta={this.state.meta} />
          <StatsTable meta={{length: this.state.meta.length, depth: this.state.meta.depth}} />
        </main>
      </div>
    )
  }
})

export default injectIntl(App)
