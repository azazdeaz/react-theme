#react-theme [![Build Status](https://img.shields.io/travis/azazdeaz/react-theme.svg?style=flat-square)](https://travis-ci.org/azazdeaz/react-theme) [![Coverage Status](https://img.shields.io/coveralls/azazdeaz/react-theme.svg?style=flat-square)](https://coveralls.io/r/azazdeaz/react-theme?branch=master) [![npm](https://img.shields.io/npm/dm/react-theme.svg?style=flat-square)]()

Simple inline style manager for the organized and customizable css styles in React.
If you know [material-ui](https://github.com/callemall/material-ui) it's similar to the [ThemeManager](http://material-ui.com/#/customization/themes) but more general.

[Here is an example](https://github.com/azazdeaz/react-matterkit/tree/master/src/styles/sources) about managing a set of styles with react-theme and [Radium](https://github.com/FormidableLabs/radium).

It isn't handle pseudo selectors, prefixing, media queries, or convert to CSS but works well with other libraries who does.

- [Basic usage](#basic-usage)
- [Mixins](#mixins)
- [Doing logic in style source](#doing-logic-in-style-source)
- [Using modifiers](#using-modifiers)
- [Extending source](#extending-source)
- [Button example](#button-example)
- [API](#API)


###Basic usage
A theme has a list of style sources. Every source is a function which returns an object:
```javascript
import ReactTheme from 'react-theme'

var theme = new ReactTheme()

theme.setSource('label', () => ({
  color: 'red'
}))

theme.getStyle('label') // {color: red}
```
#####[JS Bin][jsbin-basic-useage]

###Mixins
The returned style object can have a [old React style mixins](https://facebook.github.io/react/docs/reusable-components.html#mixins) with the name of other sources.
```javascript
theme.setSource('label', () => ({
  mixins: ['font'],
  color: 'red'
}))
theme.setSource('font', () => ({
  color: 'white',
  fontFamily: 'Roboto'
}))

theme.getStyle('label') // {color: red, fontFamily: 'Roboto'}
```
#####[JS Bin][jsbin-mixins]


###Doing logic in style source
The first argument of the style source is the theme so you can ```.getStyle()``` other styles in it.
```javascript
theme.setSource('palette', () => ({
  textColor: 'navajowhite'
}))
theme.setSource('label', (theme) => {
  var { textColor } = theme.getStyle('palette')
  return {
    color: textColor,
    backgroudColor: complement(textColor)
  }
})

theme.getStyle('label') // {color: 'navajowhite', backgroudColor: ?}
```
#####[JS Bin][jsbin-doing-logic-in-style]

You can manage (and later customize)  your other configs and variables (like colors, spacing, transitions, etc.) it the same way as the other styles!


###Using modifiers
If you used that, it's similar to the [old Radium modifiers](https://github.com/FormidableLabs/radium/blob/v0.10.3/docs/guides/overview.md#modifiers):  
```javascript
theme.setSource('label', () => ({
  color: 'white',
  //merge in if the modifier.error === true
  error: {
    color: 'red'
  },
  kind: {
    //merge in if the modifier.kind === 'dotted'
    dotted: {borderStyle: 'dotted'},
    dashed: {borderStyle: 'dashed'}
  }
}))

var modifier = {error: true, kind: 'dotted'}
theme.getStyle('label', modifier) // {color: 'red', borderStyle: 'dotted'}
```
#####[JS Bin][jsbin-using-modifiers]

You can add some optional part to your style as objects and activate them with the values of the modifier object.
Nested parts will be also resolved:
```javascript
theme.setSource('label', () => ({
  color: 'white',
  primary: {
    color: 'blue'
  },
  hover: {
    color: 'navy',
    primary: {
      color: 'teal'
    }
  }
}))

var modifier = {primary: true, hover: true}
theme.getStyle('label', modifier) // {color: 'teal'}
```
#####[JS Bin][jsbin-nested-modifiers]

Modifiers is passed as the second argument to the style source so you you can use it to get other styles with the same modifier:
```javascript
theme.setSource('label', (theme, modifier) => {
  var { lineHeight } = theme.getStyle('config', modifier)
  return {
    //mixins are automatically resolved with the given modifier
    mixins: ['font', 'roundedBorders'],
    lineHeight
  }
})
var style = theme.getStyle('label', {size: 'xl'})
```
#####[JS Bin][jsbin-modifiers-logic]
###Extending source
```theme.setSource(name, source)``` simply replaces  the old source if the theme has one with the same name. If you want to keep the original source and extend with an other one you can use ```theme.extendSource(name, source)```:
```javascript
theme.setSource('label', () => ({
  color: 'lime',
  bordered: {
    borderStyle: 'double',
    resize: 'both'
  }
}))
theme.extendSource('label', () => ({
  bordered: {
    borderStyle: 'groove'
  }
}))

var modifier = {bordered: true}
theme.getStyle('label', modifier)
// {color: 'lime', borderStyle: 'groove', resize: 'both'}
```
#####[JS Bin][jsbin-extending-source]

Theme calls both source function and merges them.

###Button example
Maybe the best way to provide the theme is to have a default theme that the user can clone, customize and put the custom theme into the [context](https://blog.jscrambler.com/react-js-communication-between-components-with-contexts/) so the component can easily check it there is a custom style to use instead of the default.
```javascript
import defaultTheme from './defaultTheme'

class Button extends React.Component() {
  static contextTypes = {
    theme: React.PropTypes.object
  }
  getTheme() {
    return this.context.theme || defaultTheme
  }
  reder() {
    var {label, mod, style} = this.props;
    var s = this.getTheme().getStyle('button', mod, style)
    return <button style={s}>{label}</button>
  }
}
```
#####[JS Bin - Bootstrap buttons example][jsbin-bootstrap-buttons-example]

###API
####```theme.getStyle(sourceName,  modifier,  additionalStyleObejct)```
- sourceName [see above](#basic-usage)
- modifier [see above](#using-modifiers)
- additionalStyleObejct: This object will be merged with the resolved style object. It's usefull to merge the built in styles with the user dfined props.style.

####```theme.setSource(sourceName,  sourceFunction)```
[see above](#basic-usage)

####```theme.extendSource(sourceName,  sourceFunction)```
[see above](#extending source)

####```theme.clone()```
Returns a new Theme instance whit the same style sources.

[jsbin-basic-useage]: http://jsbin.com/sesitu/4/edit?js,console
[jsbin-mixins]: http://jsbin.com/qiyafa/5/edit?js,console
[jsbin-doing-logic-in-style]: http://jsbin.com/nijisa/5/edit?js,console
[jsbin-using-modifiers]: http://jsbin.com/fatuzi/6/edit?js,console
[jsbin-nested-modifiers]: http://jsbin.com/zawifi/5/edit?js,console
[jsbin-modifiers-logic]: http://jsbin.com/mogigo/5/edit?js,console
[jsbin-extending-source]: http://jsbin.com/vibaxu/6/edit?js,console
[jsbin-bootstrap-buttons-example]: http://jsbin.com/rebojat/5/edit?js,output
