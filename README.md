[![Build Status](https://travis-ci.org/stuwilliams47/relative-require.svg?branch=master)](https://travis-ci.org/stuwilliams47/relative-require) [![Stories in Ready](https://badge.waffle.io/stuwilliams47/relative-require.png?label=ready&title=Ready)](https://waffle.io/stuwilliams47/relative-require)

### Relative Require

Injects module require statements with the correct relative require path

## Usage

### From the Editor

Highlight the module you want to import and hit `ctrl-alt-r` to inject the require statement

![Demo](https://s12.postimg.org/ifcu8bvnh/editor.gif)

### From the Tree View

Right click a module file from the tree view and select 'Relative Require'

![Demo](https://s10.postimg.org/pnuwb89uh/menu.gif)

## Features

* Require project modules with correct relative path
* Require from your projects `package.json` dependencies
* Infers the import statement syntax from the active files contents i.e. `require` or `import`
* Right click a file in the tree view to import
