function DesktopIcon({ icon, onOpen }) {
  return (
    <button type="button" className="desktop-icon-button" onClick={onOpen}>
      <span className={`desktop-icon-art ${icon.accent} ${icon.kind}`} aria-hidden="true">
        <span className="desktop-icon-sheet" />
        <span className="desktop-icon-badge">
          <span className="desktop-icon-symbol" />
        </span>
      </span>
      <span className="desktop-icon-text">
        <strong>{icon.label}</strong>
        <span>{icon.subtitle}</span>
      </span>
    </button>
  )
}

export default DesktopIcon
