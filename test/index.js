var vm = require('vm')
var babel = require('babel-core')
var assert = require('power-assert')

describe('babel-plugin-add-module-exports', () => {
  it('should not export default to `module.exports` if exists named declaration', () => {
    var fixture = `
      export default 'baz'
      export let foo= 'bar'
    `
    var compiled = babel.transform(fixture, {
      presets: ['es2015'],
      plugins: ['../lib/index.js']
    })

    var sandbox = {
      exports: {},
      module: { exports: undefined }
    }
    vm.runInNewContext(compiled.code, sandbox)

    assert(sandbox.exports.default === 'baz')
    assert(sandbox.exports.foo === 'bar')
    assert(sandbox.module.exports === undefined)
  })

  it('should export default directly to `module.exports` if only exists default declaration (#4)', () => {
    var fixture = `
      export default 'baz'
    `
    var compiled = babel.transform(fixture, {
      presets: ['es2015'],
      plugins: ['../lib/index.js']
    })

    var sandbox = {
      exports: {},
      module: { exports: undefined }
    }
    vm.runInNewContext(compiled.code, sandbox)

    assert(sandbox.exports.foo === undefined)
    assert(sandbox.module.exports === 'baz')
  })

  it('should handle duplicated plugin references (#1)', () => {
    var fixture = `
      export default 'baz'
    `
    var compiled = babel.transform(fixture, {
      presets: ['es2015'],
      plugins: [
        '../lib/index.js',
        '../lib/index.js',
        '../lib/index.js'
      ]
    })

    var sandbox = {
      exports: {},
      module: { exports: undefined }
    }
    vm.runInNewContext(compiled.code, sandbox)

    assert(sandbox.exports.foo === undefined)
    assert(sandbox.module.exports === 'baz')
  })
})
