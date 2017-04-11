const blocks = require('./data/unicode_blocks.min.json')
const fs = require('fs')

const blockRanges = []
const blockData = Object.keys(blocks).reduce((reducer, element) => {
  const block = blocks[element]
  blockRanges.push(block.range.map((m) => parseInt(m, 16)))
  reducer.push({ key: element, name: block.name, range: block.range, count: parseInt(block.count) })
  return reducer
}, [])

fs.writeFile('./output/unicode_block_data.min.json', JSON.stringify(blockData), function (err) {
  if (err) { return console.log(err) }
  console.log('The "unicode_block_data.json" file was saved!')
})

fs.writeFile('./output/unicode_block_ranges.min.json', JSON.stringify(blockRanges), function (err) {
  if (err) { return console.log(err) }
  console.log('The "unicode_block_ranges.json" file was saved!')
})
