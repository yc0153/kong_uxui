import TitleBar from './TitleBar.jsx'

function AppWindow({
  title,
  subtitle,
  window,
  isActive,
  onClose,
  onFocus,
  onStartDrag,
  onToggleMaximize,
  isMaximized = false,
  compact = false,
  className = '',
  children,
}) {
  return (
    <section
      className={`app-window ${isActive ? 'active' : ''} ${compact ? 'compact' : ''} ${className}`.trim()}
      style={{
        top: window.y,
        left: window.x,
        width: window.width,
        height: window.height,
      }}
      onMouseDown={onFocus}
    >
      <TitleBar
        title={title}
        subtitle={subtitle}
        onClose={onClose}
        onStartDrag={onStartDrag}
        onToggleMaximize={onToggleMaximize}
        isMaximized={isMaximized}
      />
      <div className="app-window-content">{children}</div>
    </section>
  )
}

export default AppWindow
