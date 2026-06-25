import * as XLSX from "xlsx"
import { ZodSchema } from "zod"

export interface ImportError {
  row: number
  field?: string
  message: string
}

export interface ImportResult<T> {
  valid: T[]
  errors: ImportError[]
  total: number
  imported: number
}

export function parseImportFile<T>(
  buffer: Buffer,
  schema: ZodSchema<T>,
  fieldMapping?: Record<string, string>
): ImportResult<T> {
  const wb = XLSX.read(buffer, { type: "buffer" })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)

  const valid: T[] = []
  const errors: ImportError[] = []

  rows.forEach((rawRow, index) => {
    let mappedRow = rawRow
    if (fieldMapping) {
      mappedRow = {}
      Object.entries(rawRow).forEach(([key, value]) => {
        const mappedKey = fieldMapping[key] || key
        mappedRow[mappedKey] = value
      })
    }

    const result = schema.safeParse(mappedRow)
    if (result.success) {
      valid.push(result.data)
    } else {
      result.error.issues.forEach(issue => {
        errors.push({
          row: index + 2,
          field: issue.path.join(".") || undefined,
          message: issue.message,
        })
      })
    }
  })

  return {
    valid,
    errors,
    total: rows.length,
    imported: valid.length,
  }
}

export function validateImportFile(file: File): void {
  const MAX_SIZE = 5 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    throw new Error("El archivo excede el tamaño máximo de 5MB")
  }

  const ext = file.name.split(".").pop()?.toLowerCase()
  if (!ext || !["xlsx", "xls"].includes(ext)) {
    throw new Error("Solo se permiten archivos .xlsx y .xls")
  }
}
