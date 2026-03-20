import { useEffect } from 'react'

function AnnoyingPopupManager({
  dragState,
  moveDraggingPopup,
  popups,
  setPopups,
  stopDraggingPopup,
}) {
  useEffect(() => {
    if (!dragState) {
      return undefined
    }

    // Manual drag handling is attached at window level so the popup keeps following
    // the cursor even when the pointer briefly outruns the title bar.
    const handleMouseMove = (event) => {
      moveDraggingPopup(event)
    }

    const handleMouseUp = () => {
      stopDraggingPopup()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragState, moveDraggingPopup, stopDraggingPopup])

  useEffect(() => {
    const timers = popups
      .filter((popup) => popup.behavior === 'timed-reopen' && !popup.visible && !popup.lockForSession)
      .map((popup) =>
        window.setTimeout(() => {
          // Reopen selected popups after a delay to simulate the kind of nagging
          // modal behavior the assignment is meant to critique.
          setPopups((current) =>
            current.map((item) => (item.id === popup.id ? { ...item, visible: true } : item))
          )
        }, 20000)
      )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [popups, setPopups])

  return null
}

export default AnnoyingPopupManager
