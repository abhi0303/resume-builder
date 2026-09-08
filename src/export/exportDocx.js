import { saveAs } from 'file-saver'

/** Delegates to the active template's own Word builder, loaded on demand. */
export async function exportDocx(resume, template, fileName) {
  const [{ Packer }, buildDocx] = await Promise.all([import('docx'), template.loadDocxBuilder()])
  const blob = await Packer.toBlob(buildDocx(resume))
  saveAs(blob, fileName)
}
