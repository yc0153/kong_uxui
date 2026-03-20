function TitleBar({ title, subtitle, onClose, onStartDrag, onToggleMaximize, isMaximized = false }) {
  return (
    <header className="title-bar" onMouseDown={onStartDrag}>
      <div className="title-bar-copy">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <div className="title-bar-actions">
        {onToggleMaximize ? (
          <button
            type="button"
            className="title-bar-maximize"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onToggleMaximize}
            aria-label={isMaximized ? '복원' : '최대화'}
          >
            {isMaximized ? '❐' : '□'}
          </button>
        ) : null}
        <button
          type="button"
          className="title-bar-close"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={onClose}
        >
          x
        </button>
      </div>
    </header>
  )
}

export default TitleBar
