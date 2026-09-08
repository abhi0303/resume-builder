import { useCallback, useRef, useState } from 'react'
import Toolbar from './components/Toolbar'
import FormattingToolbar from './components/FormattingToolbar'
import EditorPanel from './components/editor/EditorPanel'
import PreviewPane from './components/preview/PreviewPane'
import Splitter from './components/Splitter'
import MobileTabs from './components/MobileTabs'
import { useResume } from './state/ResumeContext'
import { useSplitPane } from './state/useSplitPane'
import { useConfirm, usePrompt } from './state/DialogContext'
import { getTemplate } from './templates'
import { resumeFileBase, withExtension } from './utils/fileName'

export default function App() {
  const { resume, dispatch, loadSample, clearAll } = useResume()
  const confirm = useConfirm()
  const prompt = usePrompt()
  const template = getTemplate(resume.templateId)
  const sheetRef = useRef(null)
  const bodyRef = useRef(null)
  const split = useSplitPane(bodyRef)
  const [busy, setBusy] = useState(null)
  const [mobileView, setMobileView] = useState('edit')
  const [toast, setToast] = useState(null)

  const notify = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2600)
  }, [])

  /** Every download asks for its file name, pre-filled from the CV's own header. */
  const askFileName = useCallback(
    async (extension) => {
      const name = await prompt({
        title: `Download ${extension.toUpperCase()}`,
        message: 'Name the file you are about to download.',
        confirmLabel: 'Download',
        input: { label: 'File name', defaultValue: resumeFileBase(resume), suffix: `.${extension}`, placeholder: 'my_cv' },
      })
      return name ? withExtension(name, extension) : null
    },
    [prompt, resume],
  )

  const handlePdf = useCallback(async () => {
    if (!sheetRef.current) return
    const fileName = await askFileName('pdf')
    if (!fileName) return
    setBusy('pdf')
    try {
      // Loaded on demand: jsPDF + html2canvas are ~1MB and are not needed to edit.
      const { exportPdf } = await import('./export/exportPdf')
      await exportPdf(sheetRef.current, { fileName, page: template.page })
      notify(`Saved ${fileName}`)
    } catch (error) {
      console.error(error)
      notify('Could not build the PDF — see the console for details')
    } finally {
      setBusy(null)
    }
  }, [askFileName, template, notify])

  const handleDocx = useCallback(async () => {
    const fileName = await askFileName('docx')
    if (!fileName) return
    setBusy('docx')
    try {
      const { exportDocx } = await import('./export/exportDocx')
      await exportDocx(resume, template, fileName)
      notify(`Saved ${fileName}`)
    } catch (error) {
      console.error(error)
      notify('Could not build the DOCX — see the console for details')
    } finally {
      setBusy(null)
    }
  }, [askFileName, resume, template, notify])

  return (
    <div className={`app${split.dragging ? ' app--dragging' : ''}`}>
      <Toolbar
        resume={resume}
        template={template}
        dispatch={dispatch}
        busy={busy}
        onExportPdf={handlePdf}
        onExportDocx={handleDocx}
        onLoadSample={async (sampleId) => {
          const ok = await confirm({
            title: 'Load this sample CV?',
            message: 'Your current content will be replaced by the sample document and its template.',
            confirmLabel: 'Load sample',
          })
          if (ok) loadSample(sampleId)
        }}
        onClear={async () => {
          const ok = await confirm({
            title: 'Clear everything?',
            message: 'Every section and all header details will be removed, leaving a blank CV.',
            confirmLabel: 'Clear CV',
            danger: true,
          })
          if (ok) clearAll()
        }}
      />

      <FormattingToolbar />

      <div
        className={`app__body app__body--${mobileView}`}
        ref={bodyRef}
        style={split.width === null ? undefined : { '--editor-width': `${split.width}px` }}
      >
        <EditorPanel template={template} collapsed={split.collapsed} />
        <Splitter
          dragging={split.dragging}
          collapsed={split.collapsed}
          canShrink={split.canShrink}
          canGrow={split.canGrow}
          onDragStart={split.startDrag}
          onStep={split.step}
          onReset={split.reset}
          onNudge={split.nudge}
        />
        <PreviewPane template={template} resume={resume} sheetRef={sheetRef} />
      </div>

      <MobileTabs view={mobileView} onChange={setMobileView} />

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  )
}
