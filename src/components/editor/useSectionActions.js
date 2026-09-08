import { useMemo } from 'react'

/** Binds the generic reducer actions to one section id. */
export function useSectionActions(sectionId, dispatch) {
  return useMemo(
    () => ({
      updateSection: (patch) => dispatch({ type: 'UPDATE_SECTION', sectionId, patch }),
      addEntry: () => dispatch({ type: 'ADD_ENTRY', sectionId }),
      updateEntry: (entryId, patch) => dispatch({ type: 'UPDATE_ENTRY', sectionId, entryId, patch }),
      removeEntry: (entryId) => dispatch({ type: 'REMOVE_ENTRY', sectionId, entryId }),
      moveEntry: (entryId, delta) => dispatch({ type: 'MOVE_ENTRY', sectionId, entryId, delta }),
      addChild: (entryId) => dispatch({ type: 'ADD_CHILD', sectionId, entryId }),
      updateChild: (entryId, childId, patch) => dispatch({ type: 'UPDATE_CHILD', sectionId, entryId, childId, patch }),
      removeChild: (entryId, childId) => dispatch({ type: 'REMOVE_CHILD', sectionId, entryId, childId }),
      moveChild: (entryId, childId, delta) => dispatch({ type: 'MOVE_CHILD', sectionId, entryId, childId, delta }),
    }),
    [sectionId, dispatch],
  )
}
