const ROW = 0
const COL = 1

interface Dimension {
  [index: number]: number
}
interface Options {
  min?: Dimension
  max?: Dimension
  dim?: Dimension
  fill?: any
}

export class SizeableTable {
  private static exceeds(source: Dimension, comp: Dimension): boolean {
    return source[ROW] > comp[ROW] || source[COL] > comp[COL]
  }
  private static maxCols(table: any[]): number {
    return table.reduce((length, arr) => Math.max(length, arr.length), 0)
  }

  public min: Dimension
  public max: Dimension
  public dim: Dimension
  public table: any[][]
  private _fill: any

  /**
   * @constructor
   * @param table - 2 dimensional array
   * @param options
   * @param options.max - max. dimensions of table
   * @param options.min - min. dimensions of table
   * @param options.fill - content to fill new rows/ columns
   */
  constructor(table?: any[][], options?: Options) {
    const { min = [1, 0], max = [Infinity, Infinity], fill } = options || {}

    if (!Array.isArray(table)) {
      table = []
    }
    if (!Array.isArray(table[0])) {
      table[0] = []
    }

    this.min = min
    this.max = max
    this._fill = fill
    this.table = table
    this.dim = [0, 0]

    this.dim[ROW] = table.length
    this.dim[COL] = SizeableTable.maxCols(table)
  }

  /**
   * creates a new table with dimensions `dim`
   * @param dim - dimension of new table
   * @param fill - content to fill whole new table
   * @returns `undefined` if min or max dimensions where not followed otherwith the new table
   */
  public create(dim: Dimension, fill?: any): any[] | undefined {
    if (
      SizeableTable.exceeds(dim, this.max) ||
      SizeableTable.exceeds(this.min, dim)
    ) {
      return
    }

    this.dim = dim
    this.table = new Array(dim[ROW]).fill(1).map(() => new Array(dim[COL]).fill(fill))
    return this.table
  }

  /**
   * adds a new row
   * @param row - number adds at that position, `undefined` the new row is created at the end
   * @param fill - content to fill new row
   * @returns `false` if creation went wrong
   */
  public addRow(row?: number, fill?: any | any[]): boolean {
    if (this.dim[ROW] >= this.max[ROW]) {
      return false
    }

    this.dim[ROW]++
    const _fill = Array.isArray(fill) ? this._fill : fill || this._fill

    let arr = new Array(this.dim[COL]).fill(_fill)

    if (Array.isArray(fill)) {
      arr = arr.map((_, i) => (fill[i] !== undefined ? fill[i] : _fill))
    }

    if (row !== undefined) {
      this.table.splice(row, 0, arr)
    } else {
      this.table.push(arr)
    }

    return true
  }

  /**
   * removes a row
   * @param row - number removes at that position, `undefined` at the end
   * @returns `false` if removal went wrong
   */
  public removeRow(row?: number): boolean {
    if (this.dim[ROW] <= this.min[ROW]) {
      return false
    }

    this.dim[ROW]--

    if (row !== undefined) {
      this.table.splice(row, 1)
    } else {
      this.table.pop()
    }

    return true
  }

  /**
   * add a column
   * @param col - number adds at that position, `undefined` at the end
   * @returns `false` if adding column went wrong
   */
  public addColumn(col?: number, fill?: any | any[]): boolean {
    if (this.dim[COL] >= this.max[COL]) {
      return false
    }

    const getFill = (i: number) =>
      Array.isArray(fill)
        ? fill[i] !== undefined
          ? fill[i]
          : this._fill
        : fill || this._fill

    this.dim[COL]++

    this.table.forEach((row, i) =>
      col !== undefined ? row.splice(col, 0, getFill(i)) : row.push(getFill(i))
    )

    return true
  }

  /**
   * removes a column
   * @param col - number removes at that position, `undefined` at the end
   * @returns `false` if removal went wrong
   */
  public removeColumn(col?: number): boolean {
    if (this.dim[COL] <= this.min[COL]) {
      return false
    }

    this.dim[COL]--

    this.table.forEach(row =>
      col !== undefined ? row.splice(col, 1) : row.pop()
    )

    return true
  }

  /**
   * paste table at position
   * @param insert - 2dim array to paste into table
   * @param pos - position
   */
  public paste (insert: any[][], pos?: Dimension) : void {
    pos = pos || [0, 0]
    const rows = insert.length 
    const cols = SizeableTable.maxCols(insert)

    for (let y = 0; y < rows; y++) {
      const posY = y + pos[ROW]
      if (posY >= this.dim[ROW]) {
        if (posY < this.max[ROW]) {
          this.addRow()
        } else {
          break
        }
      }
      for (let x = 0; x < cols; x++) {
        const posX = x + pos[COL]
        if (posX >= this.dim[COL]) {
          if (posX < this.max[COL]) {
            this.addColumn()
          } else {
            break
          }
        }
        this.table[posY][posX] = insert[y][x]
      }
    }
  }
}
