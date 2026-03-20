const dialogButtons = {
  okCancel: ['확인', '취소'],
  yesNo: ['예', '아니요'],
  yesNoStop: ['예', '아니요', '중지'],
}

function Dialog({ dialog, onAction }) {
  if (!dialog) {
    return null
  }

  const buttons = dialog.buttons ?? dialogButtons[dialog.type]

  return (
    <div className="dialog-overlay" role="presentation">
      <article className="dialog-window" role="dialog" aria-modal="true" aria-label={dialog.title}>
        <header className="dialog-title-bar">
          <strong>{dialog.title}</strong>
        </header>
        <div className="dialog-body">
          <p>{dialog.message}</p>
          <div className="dialog-actions">
            {buttons.map((button) => (
              <button key={button} type="button" onClick={() => onAction(button)}>
                {button}
              </button>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}

export default Dialog
