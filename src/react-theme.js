import merge from 'lodash/object/merge'
import assign from 'lodash/object/assign'
import forOwn from 'lodash/object/forOwn'
import cloneDeep from 'lodash/lang/cloneDeep'

export default class ReactTheme {
  constructor(sources) {
    this._sources = sources || {}
  }

  clone() {
    return new ReactTheme(cloneDeep(this._sources))
  }

  setSource(name, source) {
    this._sources[name] = source
  }

  extendSource(name, source) {
    var originalSource = this._sources[name]

    if (originalSource) {
      this.setSource(name, (...args) => {
        var extension = source(...args)
        var original = originalSource(...args)

        return merge(original, extension)
      })
    }
    else {
      this.setSource(name, source)
    }
  }

  get = (name, mod, additionalStyle) => {
    console.warn('theme.get() is renamed to theme.getStyle()')
    return this.getStyle(name, mod, additionalStyle)
  }

  getStyle(name, mod, additionalStyle) {
    var styleSrc = this._sources[name]

    if (!styleSrc) {
      throw Error(`Can't find style source for "${name}"`)
    }

    styleSrc = styleSrc(this, mod)

    if (!styleSrc) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`style source "${name}" doesn't return "${styleSrc}" instead an object!`)
      }
      styleSrc = {}
    }

    if (styleSrc.mixins) {
      let mixin = {}

      styleSrc.mixins.slice().forEach(mixinName => {

        merge(mixin, this.getStyle(mixinName, mod))
      })

      delete styleSrc.mixins
      styleSrc = merge(mixin, styleSrc)
    }

    var ret = this.resolveMod(styleSrc, mod)

    var postProcessor = this.getPostProcessor()
    if (postProcessor) {
      ret = postProcessor(ret)
    }

    return (assign(ret, additionalStyle))
  }

  resolveMod(styleSrc, mod) {
    forOwn(mod, (value, key) => {
      if (styleSrc[key]) {
        var modStyleSrc = styleSrc[key]

        if (typeof value === 'boolean') {
          if (value) {
            let modStyle = this.resolveMod(modStyleSrc, mod)
            assign(styleSrc, modStyle)
          }
        }
        else if (typeof value === 'string') {
          if (modStyleSrc[value]) {
            let modStyle = this.resolveMod(modStyleSrc[value], mod)
            assign(styleSrc, modStyle)
          }
        }
      }
    })

    return styleSrc
  }

  setPostProcessor(processor) {
    this._postProcessor = processor
  }

  getPostProcessor() {
    return this._postProcessor
  }
}
