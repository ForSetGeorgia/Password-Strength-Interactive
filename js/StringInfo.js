import React from 'react'

const latinItems = [] // ['lower', 'upper', 'number', 'symbol']
const otherItems = [] // ['letter', 'lower', 'upper', 'symbol']
//
//  //  - {this.state.meta.other[item].length}
const CharacterBar = React.createClass({
  propTypes: {
    meta: React.PropTypes.object
  },
  render () {
    return (
      <div className='characterBar'>
        <label>Latin</label>
        <ul>{latinItems.map((item) => <li key={'latin-' + item}>{item} - {this.props.meta.latin[item].length}</li>)}</ul>
        <label>Other</label>
        <ul>{otherItems.map((item) => <li key={'other-' + item}>{item} - {this.props.meta.other[item].length}</li>)}</ul>
      </div>
    )
  }
})

export default CharacterBar
