function PopupWindow({ popup, isFocused, onClose, onFocus, onStartDrag, onToggleLock }) {
  return (
    <article
      className={`popup-window ${isFocused ? 'focused' : ''}`}
      style={{ left: popup.x, top: popup.y, width: popup.width, minHeight: popup.height }}
      onMouseDown={() => onFocus(popup.id)}
    >
      <header className="popup-titlebar" onMouseDown={(event) => onStartDrag(popup.id, event)}>
        <div>
          <strong>{popup.title}</strong>
          <span>{popup.subtitle}</span>
        </div>
        <button type="button" className="popup-close" onClick={() => onClose(popup.id)}>
          x
        </button>
      </header>

      <div className="popup-body">
        {popup.image ? (
          <div className="popup-image-frame">
            <img className="popup-image" src={popup.image} alt={`${popup.title} 관련 이미지`} />
          </div>
        ) : null}

        <p>{popup.body}</p>

        {popup.allowLockForSession && (
          <label className="popup-checkbox">
            <input
              type="checkbox"
              checked={popup.lockForSession}
              onChange={() => onToggleLock(popup.id)}
            />
            이번 세션만 숨기기
          </label>
        )}

        <div className="popup-actions">
          <button type="button" onClick={() => onClose(popup.id)}>
            닫기
          </button>
          <button type="button" className="popup-primary" onClick={() => onClose(popup.id)}>
            나중에 보기
          </button>
        </div>
      </div>
    </article>
  )
}

export default PopupWindow
