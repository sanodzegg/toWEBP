const { ipcMain, dialog } = require('electron')
const fs = require('fs')
const path = require('path')
const { PDFDocument } = require('pdf-lib')

function registerPdfToolsHandlers(mainWindow) {
  ipcMain.handle('pdf-merge', async (_event, { buffers }) => {
    const merged = await PDFDocument.create()

    for (const buf of buffers) {
      const doc = await PDFDocument.load(Buffer.from(buf))
      const pages = await merged.copyPages(doc, doc.getPageIndices())
      pages.forEach(p => merged.addPage(p))
    }

    const result = await merged.save()
    return { buffer: Array.from(result) }
  })

  ipcMain.handle('pdf-merge-save', async (_event, { buffer }) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save merged PDF',
      defaultPath: 'merged.pdf',
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    })
    if (canceled || !filePath) return { canceled: true }
    fs.writeFileSync(filePath, Buffer.from(buffer))
    return { canceled: false, filePath }
  })

  ipcMain.handle('pdf-pick-files', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Select PDF files',
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
      properties: ['openFile', 'multiSelections'],
    })
    if (canceled || !filePaths.length) return { canceled: true, files: [] }
    const files = filePaths.map(fp => ({
      path: fp,
      name: path.basename(fp),
      size: fs.statSync(fp).size,
      buffer: Array.from(fs.readFileSync(fp)),
    }))
    return { canceled: false, files }
  })
}

module.exports = { registerPdfToolsHandlers }
