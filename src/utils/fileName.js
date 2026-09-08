import { plainText } from './richText'

/** Characters no common filesystem accepts in a file name. */
const ILLEGAL = /[\\/:*?"<>|]/g

export const sanitizeFileName = (value) =>
  String(value ?? '')
    .replace(ILLEGAL, '')
    .replace(/\s+/g, ' ')
    .trim()

/** Suggested name, offered in the download dialog and editable there. */
export function resumeFileBase(resume) {
  const name = sanitizeFileName(plainText(resume.header?.name)).replace(/\s+/g, '_')
  return `${name || 'resume'}_CV`
}

/** Adds the extension, tolerating a name the user already typed it onto. */
export function withExtension(base, extension) {
  const clean = sanitizeFileName(base).replace(new RegExp(`\\.${extension}$`, 'i'), '')
  return `${clean || 'resume'}.${extension}`
}
