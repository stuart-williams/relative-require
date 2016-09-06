# Relative Require [![Build Status](https://travis-ci.org/stuwilliams47/relative-require.svg?branch=master)](https://travis-ci.org/stuwilliams47/relative-require) [![Stories in Ready](https://badge.waffle.io/stuwilliams47/relative-require.png?label=ready&title=Ready)](https://waffle.io/stuwilliams47/relative-require)

Injects module require statements with the correct relative require path

## Usage

### From the Editor

Highlight one or more modules you want to import and hit `ctrl-alt-r` to inject the require statements

![Demo](https://s13.postimg.org/rnstpvi13/relative_require_text_editor.gif)

### From the Tree View

Right click a module file from the tree view and select 'Relative Require'

![Demo](https://s10.postimg.org/pnuwb89uh/menu.gif)

## Features

* Require project modules with correct relative path
* Require from your projects `package.json` dependencies
* Infers the import statement syntax from the active files contents i.e. `require` or `import`
* Import multiple modules
* Import native node modules; `fs`, `path` etc,
* Right click a file in the tree view to import
