var assert = require('assert')
var Theme = require('../src/react-theme')

describe('Theme', () => {
  it('is creatable', () => {
    assert(new Theme())
  })

  it('takes initial state', () => {
    var sources = {}
    var theme = new Theme(sources)

    assert.strictEqual(sources, theme._sources)
  })

  it('can get', () => {
    var theme = new Theme()
    theme.setSource('a', () => ({foo: 1}))

    var style = theme.getStyle('a')

    assert.strictEqual(style.foo, 1)
  })

  it('is cloneable', () => {
    var theme = new Theme()
    theme.setSource('a', () => ({foo: 1}))
    var themeClone = theme.clone()

    assert.notEqual(themeClone, theme)
    assert.deepEqual(theme.getStyle('a'), themeClone.getStyle('a'))
  })

  it('merges mixins in order and removes them', () => {
    var theme = new Theme()

    theme.setSource('a', () => ({foo: 1, bar: 1, baz: 1}))
    theme.setSource('b', () => ({foo: 2, bar: 2}))
    theme.setSource('c', () => ({
      mixins: ['a', 'b'],
      foo: 3
    }))

    var style = theme.getStyle('c')

    assert.deepEqual(style, {foo: 3, bar: 2, baz: 1})
    assert.strictEqual(style.mixins, undefined)
  })

  it('is extendable', () => {
    var theme = new Theme()

    theme.setSource('a', () => ({foo: 1, bar: 1}))
    theme.extendSource('a', () => ({foo: 2}))

    var style = theme.getStyle('a')

    assert.deepEqual(style, {foo: 2, bar: 1})
  })

  it('passes itself to the source function', () => {
    var theme = new Theme()

    theme.setSource('a', (_theme) => {
      assert.strictEqual(_theme, theme)
      return {}
    })

    theme.getStyle('a')
  })

  it('can teme.getStyle() in source function', () => {
    var theme = new Theme()

    theme.setSource('a', () => ({foo: 1}))
    theme.setSource('b', (theme) => {
      var style = theme.getStyle('a')
      assert.strictEqual(style.foo, 1)
      return {qux: style.foo}
    })

    var style = theme.getStyle('b')
    assert.strictEqual(style.qux, 1)
  })

  it('passes mod to the source function', () => {
    var theme = new Theme()
    var mod = {}

    theme.setSource('a', (theme, _mod) => {
      assert.strictEqual(_mod, mod)
      return {}
    })
  })

  it('merges with additinal styles', () => {
    var theme = new Theme()
    theme.setSource('a', () => ({foo: 1, bar: 1}))

    var style = theme.getStyle('a', null, {foo: 2, baz: 0})
    assert.deepEqual(style, {foo: 2, bar: 1, baz: 0})
  })

  it('merges with additinal styles', () => {
    var theme = new Theme()
    theme.setSource('a', () => ({foo: 1, bar: 1}))

    var style = theme.getStyle('a', null, {foo: 2, baz: 0})
    assert.deepEqual(style, {foo: 2, bar: 1, baz: 0})
  })
})

describe('resolve modifiers', () => {
  it('resolves booleans', () => {
    var theme = new Theme()
    theme.setSource('a', () => ({
      qux: 1,
      quz: 2,
      foo: {qux: 3},
      bar: {qux: 4},
      baz: {qux: 5},
    }))

    var style = theme.getStyle('a', {foo: true, bar: false})
    assert.strictEqual(style.qux, 3)
    assert.strictEqual(style.quz, 2)
  })

  it('resolves keyeds', () => {
    var theme = new Theme()
    theme.setSource('a', () => ({
      qux: 1,
      quz: 2,
      taz: {
        foo: {qux: 3},
        bar: {qux: 4},
        baz: {qux: 5},
      }
    }))

    var style = theme.getStyle('a', {taz: 'bar'})
    assert.strictEqual(style.qux, 4)
    assert.strictEqual(style.quz, 2)
  })

  it('resolves nesteds', () => {
    var theme = new Theme()
    theme.setSource('a', () => ({
      qux: 1,
      taz: {
        qux: 3,
        foo: {
          qux: 4,
          bar: {
            qux: 5,
            taz: {
              foo: {qux: 6}
            }
          }
        }
      }
    }))

    var style = theme.getStyle('a', {taz: 'foo', bar: true})
    assert.strictEqual(style.qux, 6)
  })
})
