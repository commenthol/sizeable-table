# sizeable-table

> add, remove rows and columns to / from 2 dimensional arrays

[![NPM version](https://badge.fury.io/js/sizeable-table.svg)](https://www.npmjs.com/package/sizeable-table/)
[![Build Status](https://secure.travis-ci.org/commenthol/sizeable-table.svg?branch=master)](https://travis-ci.org/commenthol/sizeable-table)

## installation 

    npm i sizeable-table 

## usage 

### general

```js
import { SizeableTable } from 'sizeable-table'

const array = [
  [1, 2],
  [3, 4]
]

const table = new SizeableTable(array, { 
  min: [2, 2], // min. table size 2x2
  max: [4, 4], // max. table size 4x4
  fill: 0      // fill new rows/ chars with 0
})
// table.table = [[1,2],[3,4]]

table.removeRow() // tries to remove row at end
//> false - min. rows exceeded
table.removeColumn() // tries to remove column at end
//> false - min. columns exceeded

table.addRow() // adds row at end
//> true
// table.table = [[1,2],[3,4],[0,0]]
table.addColumn()   // adds column at end
//> true
// table.table = [[1,2,0],[3,4,0],[0,0,0]]
table.addRow(0, 100)
//> true
// table.table = [[100,100,100],[1,2,0],[3,4,0],[0,0,0]]
table.addColumn(1, 20)
//> true
// table.table = [[100,20,100,100],[1,20,2,0],[3,20,4,0],[0,20,0,0]]
table.addColumn()
//> false - max. column exceeded

table.removeColumn(2)
//> true
// table.table = [[100,20,100],[1,20,0],[3,20,0],[0,20,0]]
table.removeRow(2)
//> true
// table.table = [[100,20,100],[1,20,0],[0,20,0]]
```

### create table with defined dimensions

```js
const table = new SizeableTable()
table.create([2,3], 1)
// table.table = [[1,1,1], [1,1,1]]
// table.dim = [2,3]
```

## license 

MIT licensed
