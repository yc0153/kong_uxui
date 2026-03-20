const dialogTypes = {
  okCancel: {
    title: '작업 확인',
    message: '현재 설정을 적용할까요?',
    buttons: ['확인', '취소'],
  },
  yesNo: {
    title: '저장 확인',
    message: '변경한 내용을 저장하시겠습니까?',
    buttons: ['예', '아니요'],
  },
  yesNoStop: {
    title: '주문 전 최종 점검',
    message: '조건 충족 시 자동 주문이 실행될 수 있습니다. 계속하시겠습니까?',
    buttons: ['예', '아니오', '중지'],
  },
}

function SystemDialog({ dialog, onSelect }) {
  if (!dialog) {
    return null
  }

  const config = dialogTypes[dialog.type]
  if (!config) {
    return null
  }

  return (
    <div className="system-dialog-overlay" role="presentation">
      <article className="system-dialog" role="dialog" aria-modal="true" aria-label={config.title}>
        <header className="system-dialog-titlebar">
          <strong>{config.title}</strong>
        </header>
        <div className="system-dialog-body">
          <p>{config.message}</p>
          <div className="system-dialog-actions">
            {config.buttons.map((button) => (
              <button key={button} type="button" onClick={() => onSelect(button)}>
                {button}
              </button>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}

export default SystemDialog
