function DesktopWindow({ title, subtitle, style, className = '', onClose, onFocus, children }) {
  return (
    <section
      className={`desktop-window ${className}`.trim()}
      style={style}
      onMouseDown={onFocus}
    >
      <header className="desktop-window-titlebar">
        <div>
          <strong>{title}</strong>
          {subtitle ? <span>{subtitle}</span> : null}
        </div>
        <button type="button" className="desktop-window-close" onClick={onClose}>
          x
        </button>
      </header>
      <div className="desktop-window-body">{children}</div>
    </section>
  )
}

export default DesktopWindow
