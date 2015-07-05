'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashObjectMerge = require('lodash/object/merge');

var _lodashObjectMerge2 = _interopRequireDefault(_lodashObjectMerge);

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var _lodashObjectForOwn = require('lodash/object/forOwn');

var _lodashObjectForOwn2 = _interopRequireDefault(_lodashObjectForOwn);

var _lodashLangCloneDeep = require('lodash/lang/cloneDeep');

var _lodashLangCloneDeep2 = _interopRequireDefault(_lodashLangCloneDeep);

var ReactTheme = (function () {
  function ReactTheme(sources) {
    var _this = this;

    _classCallCheck(this, ReactTheme);

    this.get = function (name, mod, additionalStyle) {
      console.warn('theme.get() is renamed to theme.getStyle()');
      return _this.getStyle(name, mod, additionalStyle);
    };

    this._sources = sources || {};
  }

  _createClass(ReactTheme, [{
    key: 'clone',
    value: function clone() {
      return new ReactTheme((0, _lodashLangCloneDeep2['default'])(this._sources));
    }
  }, {
    key: 'setSource',
    value: function setSource(name, source) {
      this._sources[name] = source;
    }
  }, {
    key: 'extendSource',
    value: function extendSource(name, source) {
      var originalSource = this._sources[name];

      if (originalSource) {
        this.setSource(name, function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var extension = source.apply(undefined, args);
          var original = originalSource.apply(undefined, args);

          return (0, _lodashObjectMerge2['default'])(original, extension);
        });
      } else {
        this.setSource(name, source);
      }
    }
  }, {
    key: 'getStyle',
    value: function getStyle(name, mod, additionalStyle) {
      var _this2 = this;

      var styleSrc = this._sources[name];

      if (!styleSrc) {
        throw Error('Can\'t find style source for "' + name + '"');
      }

      styleSrc = styleSrc(this, mod);

      if (typeof styleSrc !== 'object') {
        throw Error('style source "' + name + '" returned "' + styleSrc + '" instead an object!');
      }

      if (styleSrc.mixins) {
        (function () {
          var mixin = {};

          styleSrc.mixins.slice().forEach(function (mixinName) {

            (0, _lodashObjectMerge2['default'])(mixin, _this2.getStyle(mixinName, mod));
          });

          delete styleSrc.mixins;
          styleSrc = (0, _lodashObjectMerge2['default'])(mixin, styleSrc);
        })();
      }

      var ret = this.resolveMod(styleSrc, mod);

      var postProcessor = this.getPostProcessor();
      if (postProcessor) {
        ret = postProcessor(ret);
      }

      return (0, _lodashObjectAssign2['default'])(ret, additionalStyle);
    }
  }, {
    key: 'resolveMod',
    value: function resolveMod(styleSrc, mod) {
      var _this3 = this;

      (0, _lodashObjectForOwn2['default'])(mod, function (value, key) {
        if (styleSrc[key]) {
          var modStyleSrc = styleSrc[key];

          if (typeof value === 'boolean') {
            if (value) {
              var modStyle = _this3.resolveMod(modStyleSrc, mod);
              (0, _lodashObjectAssign2['default'])(styleSrc, modStyle);
            }
          } else if (typeof value === 'string') {
            if (modStyleSrc[value]) {
              var modStyle = _this3.resolveMod(modStyleSrc[value], mod);
              (0, _lodashObjectAssign2['default'])(styleSrc, modStyle);
            }
          }
        }
      });

      return styleSrc;
    }
  }, {
    key: 'setPostProcessor',
    value: function setPostProcessor(processor) {
      this._postProcessor = processor;
    }
  }, {
    key: 'getPostProcessor',
    value: function getPostProcessor() {
      return this._postProcessor;
    }
  }]);

  return ReactTheme;
})();

exports['default'] = ReactTheme;
module.exports = exports['default'];
//# sourceMappingURL=react-theme.js.map