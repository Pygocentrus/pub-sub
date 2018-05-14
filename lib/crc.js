const crc = require('crc');

module.exports = (content) => {
  if (!content || typeof content !== 'string') {
    throw new Error('Content CRC could not be calculated');
  }
  return crc.crc32(content).toString(16);
};
