const ROW = 0
const COL = 1

type Fill = string | number | undefined
interface Dimension {
  [index: number]: number
}
interface Options {
  min?: Dimension
  max?: Dimension
  dim?: Dimension
  fill?: Fill
}

export class SizeableTable {
  private static exceeds(source: Dimension, comp: Dimension): boolean {
    return source[ROW] > comp[ROW] || source[COL] > comp[COL]
  }

  public min: Dimension
  public max: Dimension
  public dim: Dimension
  public table: any[]
  private _fill: Fill

  constructor(table?: any[], options?: Options) {
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

    for (let r = 0; r < table.length; r++) {
      this.dim[COL] = Math.max(this.dim[COL], table[r].length)
    }
  }

  public create(dim: Dimension, fill?: Fill): any[] | undefined {
    if (
      SizeableTable.exceeds(dim, this.max) ||
      SizeableTable.exceeds(this.min, dim)
    ) {
      return
    }

    this.dim = dim
    this.table = new Array(dim[ROW]).fill(new Array(dim[COL]).fill(fill))
    return this.table
  }

  public addRow(row?: number, fill?: Fill | any[] ): boolean {
    if (this.dim[ROW] >= this.max[ROW]) {
      return false
    }

    this.dim[ROW]++
    const _fill = Array.isArray(fill) ? this._fill : fill || this._fill

    let arr = new Array(this.dim[COL]).fill(_fill)

    if (Array.isArray(fill)) {
      arr = arr.map((_, i) => fill[i] !== undefined ? fill[i] : _fill)
    }

    if (row !== undefined) {
      this.table.splice(row, 0, arr)
    } else {
      this.table.push(arr)
    }

    return true
  }

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

  public addColumn(col?: number, fill?: Fill | any[]): boolean {
    if (this.dim[COL] >= this.max[COL]) {
      return false
    }

    const getFill = (i: number) => Array.isArray(fill) 
      ? fill[i] !== undefined ? fill[i] : this._fill
      : fill || this._fill

    this.dim[COL]++

    this.table.forEach((row, i) =>
      col !== undefined ? row.splice(col, 0, getFill(i)) : row.push(getFill(i))
    )

    return true
  }

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
}
