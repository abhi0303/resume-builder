import { useCallback, useRef, useState } from 'react'
import Toolbar from './components/Toolbar'
import FormattingToolbar from './components/FormattingToolbar'
import EditorPanel from './components/editor/EditorPanel'
import PreviewPane from './components/preview/PreviewPane'
import Splitter from './components/Splitter'
import { useResume } from './state/ResumeContext'
import { useSplitPane } from './state/useSplitPane'
import { useConfirm } from './state/DialogContext'
import { getTemplate } from './templates'
import { resumeFileName } from './utils/fileName'

export default function App() {
  const { resume, dispatch, loadSample, clearAll } = useResume()
  const confirm = useConfirm()
  const template = getTemplate(resume.templateId)
  const sheetRef = useRef(null)
  const bodyRef = useRef(null)
  const split = useSplitPane(bodyRef)
  const [busy, setBusy] = useState(null)
  const [toast, setToast] = useState(null)

  const notify = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2600)
  }, [])

  const handlePdf = useCallback(async () => {
    if (!sheetRef.current) return
    setBusy('pdf')
    try {
      // Loaded on demand: jsPDF + html2canvas are ~1MB and are not needed to edit.
      const { exportPdf } = await import('./export/exportPdf')
      await exportPdf(sheetRef.current, { fileName: resumeFileName(resume, 'pdf'), page: template.page })
      notify('PDF downloaded')
    } catch (error) {
      console.error(error)
      notify('Could not build the PDF — see the console for details')
    } finally {
      setBusy(null)
    }
  }, [resume, template, notify])

  const handleDocx = useCallback(async () => {
    setBusy('docx')
    try {
      const { exportDocx } = await import('./export/exportDocx')
      await exportDocx(resume, template, resumeFileName(resume, 'docx'))
      notify('DOCX downloaded')
    } catch (error) {
      console.error(error)
      notify('Could not build the DOCX — see the console for details')
    } finally {
      setBusy(null)
    }
  }, [resume, template, notify])

  return (
    <div className={`app${split.dragging ? ' app--dragging' : ''}`}>
      <Toolbar
        resume={resume}
        dispatch={dispatch}
        busy={busy}
        onExportPdf={handlePdf}
        onExportDocx={handleDocx}
        onLoadSample={async () => {
          const ok = await confirm({
            title: 'Load the sample CV?',
            message: 'Your current content will be replaced by the sample document.',
            confirmLabel: 'Load sample',
          })
          if (ok) loadSample()
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
        className="app__body"
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

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  )
}
