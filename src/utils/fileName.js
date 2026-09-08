import { plainText } from './richText'

export function resumeFileName(resume, extension) {
  const base = plainText(resume.header?.name)
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
  return `${base || 'resume'}_CV.${extension}`
}
