import blocks from '../public/data/unicode_blocks.min.json'

// const blockMap = {}
// const blockKeyToId = blockKeys.reduce((reducer, element, elementIndex) => {
//   return Object.assign(reducer, { [element]: elementIndex })
// }, {})
const blockRanges = []
const blockData = Object.keys(blocks).reduce((reducer, element) => {
  const block = blocks[element]
  blockRanges.push(block.range.map((m) => parseInt(m, 16)))
  reducer.push({ key: element, name: block.name, range: block.range, count: parseInt(block.count) })
  return reducer
}, [])

export { blockData, blockRanges }
