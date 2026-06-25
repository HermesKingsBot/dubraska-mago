"use client"

import React, { useState, useRef, useEffect } from "react"
import { Download, Upload, FileSpreadsheet, ChevronDown } from "lucide-react"
import ImportModal from "./ImportModal"

interface ExportImportButtonsProps {
  entity: "products" | "categories" | "testimonials" | "inventory"
  onImportComplete?: () => void
}

function ExportImportButtons({ entity, onImportComplete }: ExportImportButtonsProps): React.JSX.Element {
  const [exportOpen, setExportOpen] = useState(false)
  const [templateOpen, setTemplateOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)
  const templateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false)
      }
      if (templateRef.current && !templateRef.current.contains(e.target as Node)) {
        setTemplateOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleExport(format: "csv" | "xlsx") {
    setExporting(true)
    setExportOpen(false)
    try {
      const res = await fetch(`/api/admin/export/${entity}?format=${format}`, { credentials: "include" })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${entity}-${new Date().toISOString().slice(0, 10)}.${format === "csv" ? "csv" : "xlsx"}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
    } finally {
      setExporting(false)
    }
  }

  async function handleDownloadTemplate(withSample: boolean) {
    setTemplateOpen(false)
    const url = `/api/admin/import/${entity}/template${withSample ? "?withSample=true" : ""}`
    try {
      const res = await fetch(url, { credentials: "include" })
      const blob = await res.blob()
      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `plantilla-${entity}${withSample ? "-ejemplo" : ""}.xlsx`
      a.click()
      URL.revokeObjectURL(downloadUrl)
    } catch {
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div ref={exportRef} className="relative">
          <button
            onClick={() => { setExportOpen(!exportOpen); setTemplateOpen(false) }}
            disabled={exporting}
            className="px-3 py-2 text-sm rounded-lg border border-[#333] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors flex items-center gap-2 disabled:opacity-40"
          >
            <Download size={14} />
            {exporting ? "Exportando..." : "Exportar"}
            <ChevronDown size={12} />
          </button>
          {exportOpen && (
            <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-20 min-w-[140px] py-1">
              <button
                onClick={() => handleExport("csv")}
                className="w-full px-4 py-2 text-sm text-left text-[var(--color-muted)] hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
              >
                <FileSpreadsheet size={14} />
                CSV
              </button>
              <button
                onClick={() => handleExport("xlsx")}
                className="w-full px-4 py-2 text-sm text-left text-[var(--color-muted)] hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
              >
                <FileSpreadsheet size={14} />
                Excel
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setImportModalOpen(true)}
          className="px-3 py-2 text-sm rounded-lg border border-[#333] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"
        >
          <Upload size={14} />
          Importar
        </button>

        <div ref={templateRef} className="relative">
          <button
            onClick={() => { setTemplateOpen(!templateOpen); setExportOpen(false) }}
            className="px-3 py-2 text-sm rounded-lg border border-[#333] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet size={14} />
            Plantilla
            <ChevronDown size={12} />
          </button>
          {templateOpen && (
            <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-20 min-w-[220px] py-1">
              <button
                onClick={() => handleDownloadTemplate(false)}
                className="w-full px-4 py-2 text-sm text-left text-[var(--color-muted)] hover:bg-white/5 hover:text-white transition-colors"
              >
                Plantilla vacía
              </button>
              <button
                onClick={() => handleDownloadTemplate(true)}
                className="w-full px-4 py-2 text-sm text-left text-[var(--color-muted)] hover:bg-white/5 hover:text-white transition-colors"
              >
                Plantilla con datos de ejemplo
              </button>
            </div>
          )}
        </div>
      </div>

      <ImportModal
        open={importModalOpen}
        entity={entity}
        onClose={() => setImportModalOpen(false)}
        onImportComplete={() => {
          setImportModalOpen(false)
          onImportComplete?.()
        }}
      />
    </>
  )
}

export default ExportImportButtons
