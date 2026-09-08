import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { resumeReducer } from './resumeReducer'
import { emptyResume } from '../data/sampleResume'
import { getSample, SAMPLES } from '../data/samples'

const STORAGE_KEY = 'resume-builder:document:v1'

const ResumeContext = createContext(null)

function loadInitial() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.sections)) return parsed
    }
  } catch {
    /* corrupted or unavailable storage — fall back to the sample */
  }
  return structuredClone(SAMPLES[0].document)
}

export function ResumeProvider({ children }) {
  const [resume, dispatch] = useReducer(resumeReducer, undefined, loadInitial)
  const saveTimer = useRef(null)

  useEffect(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resume))
      } catch {
        /* quota or private mode — editing still works, it just won't persist */
      }
    }, 300)
    return () => clearTimeout(saveTimer.current)
  }, [resume])

  const value = useMemo(
    () => ({
      resume,
      dispatch,
      loadSample: (id) => dispatch({ type: 'LOAD', resume: structuredClone(getSample(id).document) }),
      clearAll: () => dispatch({ type: 'LOAD', resume: structuredClone(emptyResume) }),
    }),
    [resume],
  )

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used inside <ResumeProvider>')
  return ctx
}
