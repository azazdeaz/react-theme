#react-theme [![Build Status](https://img.shields.io/travis/azazdeaz/react-theme.svg?style=flat-square)](https://travis-ci.org/azazdeaz/react-theme)
Simple inline style manager for the organized and customizable css styles in React.
If you know [material-ui](https://github.com/callemall/material-ui) it's similar to the [ThemeManager](http://material-ui.com/#/customization/themes) but more general.

[Here is an example](https://github.com/azazdeaz/react-matterkit/tree/master/src/styles/sources) about managing the styles with react-theme.

It isn't handle pseudo selectors, prefixing, media queries, or convert to CSS but works well with other libraries who does. (I'm using it with [Radium](https://github.com/FormidableLabs/radium))  

- [Basic usage](#basic-usage)
- [Mixins](#mixins)
- [Doing logic in style source](#doing-logic-in-style-source)
- [Using modifiers](#using-modifiers)
- [Extending source](#extending-source)
- [Button example](#button-example)
- [API](#api) ```//TODO```
- [JS Bin demos]() ```//TODO```


###Basic usage
A theme has a list of style sources. Every source is a function which returns an object: 
```javascript
import ReactTheme from 'react-theme'

var theme = new ReactTheme()

theme.setSource('label', () => ({
  color: 'red'
}))

theme.get('label') // {color: red}
```
[JS Bin](http://jsbin.com/sesitu/edit?js,console)

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

theme.get('label') // {color: red, fontFamily: 'Roboto'}
```


###Doing logic in style source
The first argument of the style source is the theme so you can ```.get()``` other styles in it.
```javascript
theme.setSource('palette', () => ({
  textColor: 'navajowhite'
}))
theme.setSource('label', (theme) => {
  var { textColor } = theme.get('palette')
  return {
    color: textColor,
    backgroudColor: complement(textColor)
  }
})

theme.get('label') // {color: 'navajowhite', backgroudColor: ?}
```
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
theme.get('label', modifier) // {color: 'red', borderStyle: 'dotted'}
```
You can add some optional part to your style as objects and activate them with the values of the modifier object. 
Nested parts will be also resolved:
```javascript
theme.setSource('label', () => ({
  color: 'white',
  //merge in if the modifier.error === true
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
theme.get('label', modifier) // {color: 'teal'}
```
Modifiers is passed as the second argument to the style source so you you can use it to get other styles with the same modifier: 
```javascript
theme.setSource('label', (theme, modifier) => {
  var { lineHeight } = theme.get('config', modifier)
  return {
    //mixins are automatically resolved with the given modifier
    mixins: ['font', 'roundedBorders'],
    lineHeight
  }
})
var style = theme.get('label', {size: 'xl'})
```
###Extending source
```theme.setSource(name, source)``` simply replaces  the old source if the theme has one with the same name. If you want to keep the original source and extend with an other one you can use ```theme.extendSource(name, source)```:
```javascript
theme.setSource('label', () => ({
  color: 'lime'
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
theme.get('label', modifier) 
// {color: 'lime', borderStyle: 'groove', resize: 'both'}
```
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
    var s = this.getTheme().get('button', mod, style)
    return <button style={s}>{label}</button>
  }
}
```

###API ```//TODO```
####```theme.get(sourceName,  modifier,  additionalStyleObejct)```

####```theme.setSource(sourceName,  sourceFunction)```

####```theme.extendSource(sourceName,  sourceFunction)```
####```theme.clone()```
