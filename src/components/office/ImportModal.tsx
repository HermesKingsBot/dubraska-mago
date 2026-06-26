"use client"

import React, { useState, useRef, useCallback } from "react"
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react"

interface ImportModalProps {
  open: boolean
  entity: "products" | "categories" | "testimonials" | "inventory"
  onClose: () => void
  onImportComplete: () => void
}

const ENTITY_LABELS: Record<string, string> = {
  products: "Productos",
  categories: "Categorías",
  testimonials: "Testimonios",
  inventory: "Inventario"
}

function ImportModal({ open, entity, onClose, onImportComplete }: ImportModalProps): React.JSX.Element {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ imported: number; errors: Array<{ row: number; field: string; message: string }> } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setFile(null)
    setDragging(false)
    setResult(null)
    setUploading(false)
  }, [])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [onClose, reset])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && (dropped.name.endsWith(".xlsx") || dropped.name.endsWith(".xls"))) {
      setFile(dropped)
      setResult(null)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setResult(null)
    }
  }, [])

  const handleUpload = useCallback(async () => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch(`/api/admin/import/${entity}`, {
        method: "POST",
        credentials: "include",
        body: formData
      })
      const json = await res.json()
      if (json.success) {
        setResult(json.data)
        onImportComplete()
      } else {
        setResult({ imported: 0, errors: [{ row: 0, field: "general", message: json.error || "Error al importar" }] })
      }
    } catch {
      setResult({ imported: 0, errors: [{ row: 0, field: "general", message: "Error de conexión" }] })
    } finally {
      setUploading(false)
    }
  }, [file, entity, onImportComplete])

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1048576).toFixed(1) + " MB"
  }

  if (!open) return <></>

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div
        className="bg-[#111] border border-[#333] rounded-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Importar {ENTITY_LABELS[entity]}
          </h3>
          <button onClick={handleClose} className="text-[var(--color-muted)] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging
              ? "border-[var(--color-gold)] bg-[var(--color-gold)]/5"
              : "border-[#333] hover:border-[var(--color-muted)]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload size={32} className={`mx-auto mb-3 ${dragging ? "text-[var(--color-gold)]" : "text-[var(--color-muted)]"}`} />
          <p className="text-sm text-[var(--color-muted)]">
            {dragging ? "Suelta tu archivo aquí" : "Arrastra tu archivo Excel aquí o haz clic para seleccionar"}
          </p>
          <p className="text-xs text-[var(--color-muted)] mt-2">Acepta: .xlsx, .xls</p>
        </div>

        {file && (
          <div className="mt-4 flex items-center gap-3 bg-white/5 rounded-lg p-3">
            <FileSpreadsheet size={20} className="text-[var(--color-gold)] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{file.name}</p>
              <p className="text-xs text-[var(--color-muted)]">{formatSize(file.size)}</p>
            </div>
            <button
              onClick={() => { setFile(null); setResult(null) }}
              className="text-[var(--color-muted)] hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-2">
            {result.imported > 0 && (
              <div className="flex items-center gap-2 text-green-400 bg-green-400/10 rounded-lg p-3">
                <CheckCircle size={16} />
                <span className="text-sm">{result.imported} registros importados exitosamente</span>
              </div>
            )}
            {result.errors.length > 0 && (
              <div className="bg-red-400/10 rounded-lg p-3 space-y-1">
                {result.errors.slice(0, 5).map((err, i) => (
                  <div key={i} className="flex items-start gap-2 text-red-400">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span className="text-xs">
                      {err.row > 0 ? `Fila ${err.row}: ` : ""}{err.field !== "general" ? `"${err.field}" - ` : ""}{err.message}
                    </span>
                  </div>
                ))}
                {result.errors.length > 5 && (
                  <p className="text-xs text-red-400/70 ml-6">...y {result.errors.length - 5} errores más</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-[var(--color-muted)] border border-[#333] rounded-lg hover:text-white transition-colors"
          >
            {result ? "Cerrar" : "Cancelar"}
          </button>
          {!result && (
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="px-4 py-2 text-sm rounded-lg font-medium text-black disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              style={{ background: "linear-gradient(135deg, #D4AF37, #B8960C)" }}
            >
              {uploading ? "Importando..." : "Importar"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImportModal
