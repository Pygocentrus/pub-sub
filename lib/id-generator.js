function* idGenerator() {
  let _start = -1;
  while(true) {
    yield `id_${++_start}`;
  }
}

module.exports = idGenerator();
