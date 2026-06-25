import * as XLSX from "xlsx"

export interface Column {
  key: string
  header: string
  width?: number
}

export interface ExportOptions {
  filename: string
  sheetName: string
  data: Record<string, unknown>[]
  columns: Column[]
  format: "csv" | "xlsx"
}

export function generateExportFile(options: ExportOptions): Blob {
  const { filename, sheetName, data, columns, format } = options

  const rows = data.map(item => {
    const row: Record<string, unknown> = {}
    columns.forEach(col => {
      row[col.header] = item[col.key]
    })
    return row
  })

  const ws = XLSX.utils.json_to_sheet(rows, { header: columns.map(c => c.header) })

  ws["!cols"] = columns.map(c => ({ wch: c.width || 20 }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  if (format === "csv") {
    const csv = XLSX.utils.sheet_to_csv(ws)
    return new Blob([csv], { type: "text/csv;charset=utf-8" })
  }

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
  return new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
}

export function generateTemplateFile(
  columns: Column[],
  sampleData?: Record<string, unknown>[]
): Blob {
  const data = sampleData || []
  const rows = data.length > 0 ? data : [{}]
  const mappedRows = rows.map(item => {
    const row: Record<string, unknown> = {}
    columns.forEach(col => {
      row[col.header] = item[col.key] !== undefined ? item[col.key] : ""
    })
    return row
  })

  const ws = XLSX.utils.json_to_sheet(mappedRows, { header: columns.map(c => c.header) })
  ws["!cols"] = columns.map(c => ({ wch: c.width || 20 }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Plantilla")

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
  return new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
}

export function getExportHeaders(format: "csv" | "xlsx", filename: string): Record<string, string> {
  if (format === "csv") {
    return {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    }
  }
  return {
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
  }
}
