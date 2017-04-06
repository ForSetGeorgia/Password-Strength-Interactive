import React from 'react'

let powerOnline = '—'
let powerOffline = '—'
let powerQuantum = '—'

const StatsTable = React.createClass({
  propTypes: {
    meta: React.PropTypes.shape({
      length: React.PropTypes.number,
      depth: React.PropTypes.number
    })
  },
  getRepeatedPermutations (strLength, charAmount) {
    let power = 0
    for (let i = 1; i <= strLength; ++i) {
      power += Math.pow(charAmount, i)
    }

    powerOnline = this.formatSearchDuration(power / 1000)
    powerOffline = this.formatSearchDuration(power / 100000000000)
    powerQuantum = this.formatSearchDuration(power / 100000000000000)
    return power
  },
  formatExponential (n) {
    if (typeof n !== 'number') { n = 0 }
    return n.toExponential(2) // .replace(/e\+/, ' x 10<sup>') + '</sup>'
  },
  formatSearchDuration (seconds) {
    if (seconds === 0) {
      return '&#8212;'
    }
    if (seconds < 1) {
      var secs = seconds.toFixed(20)
      var i = 2
      while (secs.charAt(i) === '0') {
        ++i
      }
      secs = seconds.toFixed(i + 1)
      return secs.replace(/0*$/, '') + ' seconds'
    }
    if (seconds < 60) {
      return seconds.toFixed(2) + ' seconds'
    }
    let minutes = seconds / 60
    if (minutes < 60) {
      return minutes.toFixed(2) + ' minutes'
    }
    let hours = minutes / 60
    if (hours < 24) {
      return hours.toFixed(2) + ' hours'
    }
    let days = hours / 24
    if (days < 7) {
      return days.toFixed(2) + ' days'
    }
    let weeks = days / 7
    if (weeks < 4.333333333333333) {
      return weeks.toFixed(2) + ' weeks'
    }
    let months = weeks / 4.333333333333333
    if (months < 12) {
      return months.toFixed(2) + ' months'
    }
    let years = months / 12
    if (years < 100) {
      return years.toFixed(2) + ' years'
    }
    let centuries = years / 100
    var suffix = ' centuries'
    while (centuries > 1000000000000) {
      centuries /= 1000000000000
      suffix = ' trillion' + suffix
    }
    while (centuries > 1000000000) {
      centuries /= 1000000000
      suffix = ' billion' + suffix
    }
    while (centuries > 1000000) {
      centuries /= 1000000
      suffix = ' million' + suffix
    }
    while (centuries > 1000) {
      centuries /= 1000
      suffix = ' thousand' + suffix
    }
    while (centuries > 100) {
      centuries /= 100
      suffix = ' hundred' + suffix
    }
    return centuries.toFixed(2) + suffix
  },
  render () {
    const stringLength = this.props.meta.length
    const characterAmount = this.props.meta.depth
    const power = this.getRepeatedPermutations(stringLength, characterAmount)
    return (
      <div className='statsTable'>
        <table>
          <tbody>
            <tr>
              <td>Search Space Depth (Alphabet):</td>
              <td>{characterAmount}</td>
            </tr>
            <tr>
              <td>Search Space Length (Characters):</td>
              <td>{stringLength}</td>
            </tr>
            <tr>
              <td>Exact Search Space Size (Count):
                (count of all possible passwords
                with this alphabet size and up
                to this password's length)
              </td>
              <td>{power}</td>
            </tr>
            <tr>
              <td>Search Space Size (as a power of 10):</td>
              <td>{this.formatExponential(power)}</td>
            </tr>
            <tr>
              <td>
                Online Attack Scenario:
                (Assuming one thousand guesses per second)
              </td>
              <td>{powerOnline}</td>
            </tr>
            <tr>
              <td>
                Offline Fast Attack Scenario:
                (Assuming one hundred billion guesses per second)
              </td>
              <td>{powerOffline}</td>
            </tr>
            <tr>
              <td>
                Massive Cracking Array Scenario:
                (Assuming one hundred trillion guesses per second)
              </td>
              <td>{powerQuantum}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
})

export default StatsTable
