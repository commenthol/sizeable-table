import assert from 'assert'
import { SizeableTable } from '../src'

describe('SizeableTable', function () {
  describe('general', function () {
    it('should create an empty table', function () {
      const table = new SizeableTable()
      assert.ok(table instanceof SizeableTable)
      assert.deepStrictEqual(table.dim, [1, 0])
    })

    it('should add a row', function () {
      const table = new SizeableTable([])
      table.addRow()
      assert.deepStrictEqual(table.dim, [2, 0])
    })

    it('should add a row in front', function () {
      const table = new SizeableTable([[2]])
      table.addRow(0, 1)
      assert.deepStrictEqual(table.table, [[1], [2]])
      assert.deepStrictEqual(table.dim, [2, 1])
    })

    it('should add a row in front and back using fill', function () {
      const table = new SizeableTable([[2]], { fill: '#' })
      table.addRow(0)
      table.addRow()
      assert.deepStrictEqual(table.table, [['#'], [2], ['#']])
      assert.deepStrictEqual(table.dim, [3, 1])
    })

    it('should add a given row', function () {
      const table = new SizeableTable([[2, 2, 2]], { fill: '#' })
      table.addRow(0, [0, 1])
      table.addRow()
      assert.deepStrictEqual(table.table, [[0, 1, '#'], [2, 2, 2], ['#', '#', '#']])
      assert.deepStrictEqual(table.dim, [3, 3])
    })

    it('should add a column', function () {
      const table = new SizeableTable([[2]])
      table.addColumn(undefined, 1)
      assert.deepStrictEqual(table.table, [[2, 1]])
      assert.deepStrictEqual(table.dim, [1, 2])
    })

    it('should add a column using fill', function () {
      const table = new SizeableTable([[2]], { fill: '#' })
      table.addColumn(0)
      table.addColumn()
      assert.deepStrictEqual(table.table, [['#', 2, '#']])
      assert.deepStrictEqual(table.dim, [1, 3])
    })

    it('should add a given column', function () {
      const table = new SizeableTable([[1], [2], [3]], { fill: '#' })
      table.addColumn(0, [0, 1])
      table.addColumn()
      assert.deepStrictEqual(table.table, [[0, 1, '#'], [1, 2, '#'], ['#', 3, '#']])
      assert.deepStrictEqual(table.dim, [3, 3])
    })

    it('should remove last row', function () {
      const table = new SizeableTable([[1], [2]])
      table.removeRow()
      assert.deepStrictEqual(table.table, [[1]])
      assert.deepStrictEqual(table.dim, [1, 1])
    })

    it('should remove first row', function () {
      const table = new SizeableTable([[1], [2]])
      table.removeRow(0)
      assert.deepStrictEqual(table.table, [[2]])
      assert.deepStrictEqual(table.dim, [1, 1])
    })

    it('should remove last column', function () {
      const table = new SizeableTable([[1, 2], [3, 4]])
      table.removeColumn()
      assert.deepStrictEqual(table.table, [[1], [3]])
      assert.deepStrictEqual(table.dim, [2, 1])
    })

    it('should remove first row', function () {
      const table = new SizeableTable([[1, 2], [3, 4]])
      table.removeColumn(0)
      assert.deepStrictEqual(table.table, [[2], [4]])
      assert.deepStrictEqual(table.dim, [2, 1])
    })

    it('should not addRow if max row is reached', function () {
      const table = new SizeableTable([[1], [2]], { max: [2, 2] })
      const result = table.addRow()
      assert.strictEqual(result, false)
      assert.deepStrictEqual(table.table, [[1], [2]])
      assert.deepStrictEqual(table.dim, [2, 1])
    })

    it('should not removeRow if min row is reached', function () {
      const table = new SizeableTable([[1], [2]], { min: [2, 1] })
      const result = table.removeRow()
      assert.strictEqual(result, false)
      assert.deepStrictEqual(table.table, [[1], [2]])
      assert.deepStrictEqual(table.dim, [2, 1])
    })

    it('should not addColumn if max column is reached', function () {
      const table = new SizeableTable([[1, 2]], { max: [1, 2] })
      const result = table.addColumn()
      assert.strictEqual(result, false)
      assert.deepStrictEqual(table.table, [[1, 2]])
      assert.deepStrictEqual(table.dim, [1, 2])
    })

    it('should not removeColumn if min column is reached', function () {
      const table = new SizeableTable([[1, 2]], { min: [1, 2] })
      const result = table.removeColumn()
      assert.strictEqual(result, false)
      assert.deepStrictEqual(table.table, [[1, 2]])
      assert.deepStrictEqual(table.dim, [1, 2])
    })
  })

  describe('creation', function () {
    it('should create a 3x3 table with 1', function () {
      const table = new SizeableTable()
      table.create([3, 3], 1)
      assert.deepStrictEqual(table.table, [[1, 1, 1], [1, 1, 1], [1, 1, 1]])
      assert.deepStrictEqual(table.dim, [3, 3])
    })

    it('should create a 2x2 table with undefined', function () {
      const table = new SizeableTable()
      table.create([1, 2])
      assert.deepStrictEqual(table.table, [[undefined, undefined]])
      assert.deepStrictEqual(table.dim, [1, 2])
    })

    it('should not create a 2x2 table if min rows is not matched', function () {
      const table = new SizeableTable([], { min: [2, 2] })
      assert.strictEqual(table.create([1, 2]), undefined)
    })

    it('should not create a 2x2 table if min columns is not matched', function () {
      const table = new SizeableTable([], { min: [2, 2] })
      assert.strictEqual(table.create([2, 1]), undefined)
    })

    it('should not create a 2x2 table if max rows is not matched', function () {
      const table = new SizeableTable([], { max: [1, 2] })
      assert.strictEqual(table.create([2, 2]), undefined)
    })

    it('should not create a 2x2 table if max columns is not matched', function () {
      const table = new SizeableTable([], { max: [2, 1] })
      assert.strictEqual(table.create([2, 2]), undefined)
    })
  })

  describe('paste', function () {
    it('shall paste a table', function () {
      const table = new SizeableTable()
      table.create([4, 4], 1)
      const insert = new SizeableTable()
      insert.create([2, 2], 2)
      table.paste(insert.table, [1, 1])
      // console.log(table.table)
      assert.deepStrictEqual(table.table, [[1, 1, 1, 1], [1, 2, 2, 1], [1, 2, 2, 1], [1, 1, 1, 1]])
    })

    it('shall paste a table at [0, 0]', function () {
      const table = new SizeableTable()
      table.create([4, 4], 1)
      const insert = new SizeableTable()
      insert.create([2, 2], 2)
      table.paste(insert.table)
      // console.log(table.table)
      assert.deepStrictEqual(table.table, [[2, 2, 1, 1], [2, 2, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]])
    })

    it('shall paste outside table at [3, 3]', function () {
      const table = new SizeableTable(undefined, { fill: 0 })
      table.create([4, 4], 1)
      const insert = new SizeableTable()
      insert.create([2, 2], 2)
      table.paste(insert.table, [3, 3])
      assert.deepStrictEqual(table.table,
        [
          [1, 1, 1, 1, 0],
          [1, 1, 1, 1, 0],
          [1, 1, 1, 1, 0],
          [1, 1, 1, 2, 2],
          [0, 0, 0, 2, 2]
        ]
      )
    })

    it('shall not paste outside max allowed range', function () {
      const table = new SizeableTable(undefined, { fill: 0, max: [4, 4] })
      table.create([4, 4], 1)
      const insert = new SizeableTable()
      insert.create([2, 2], 2)
      table.paste(insert.table, [3, 3])
      assert.deepStrictEqual(table.table,
        [
          [1, 1, 1, 1],
          [1, 1, 1, 1],
          [1, 1, 1, 1],
          [1, 1, 1, 2]
        ]
      )
    })
  })
})
