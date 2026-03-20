import ProgressBar from './ProgressBar.jsx'

function SettingsForm({ form, progress, statusMessage, onChange, onPreview, onReset, onSave }) {
  const updateField = (key, value) => {
    onChange((current) => ({
      ...current,
      [key]: value,
    }))
  }

  return (
    <div className="settings-form">
      <section className="settings-hero">
        <h1>한 곳에서 워크스페이스를 설정하세요</h1>
        <p>
          이름을 정하고, 권장 기본값이 잘 맞으면 그대로 사용한 뒤, 진행률 표시가 준비 완료를 알려주면 저장하세요.
        </p>
      </section>

      <div className="settings-grid">
        <section className="settings-card">
          <label className="form-control">
            <span>워크스페이스 이름</span>
            <input
              type="text"
              value={form.workspaceName}
              onChange={(event) => updateField('workspaceName', event.target.value)}
              placeholder="예: 디자인 스튜디오"
            />
          </label>

          <fieldset className="options-group">
            <legend>도움 기능</legend>
            <label>
              <input
                type="checkbox"
                checked={form.notifications}
                onChange={(event) => updateField('notifications', event.target.checked)}
              />
              알림 켜기
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.autoSave}
                onChange={(event) => updateField('autoSave', event.target.checked)}
              />
              자동 저장 켜기
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.syncFiles}
                onChange={(event) => updateField('syncFiles', event.target.checked)}
              />
              파일 자동 동기화
            </label>
          </fieldset>
        </section>

        <section className="settings-card">
          <fieldset className="options-group">
            <legend>사용 모드</legend>
            <label>
              <input
                type="radio"
                name="usageMode"
                value="study"
                checked={form.usageMode === 'study'}
                onChange={(event) => updateField('usageMode', event.target.value)}
              />
              학습
            </label>
            <label>
              <input
                type="radio"
                name="usageMode"
                value="work"
                checked={form.usageMode === 'work'}
                onChange={(event) => updateField('usageMode', event.target.value)}
              />
              업무
            </label>
            <label>
              <input
                type="radio"
                name="usageMode"
                value="creative"
                checked={form.usageMode === 'creative'}
                onChange={(event) => updateField('usageMode', event.target.value)}
              />
              크리에이티브
            </label>
          </fieldset>

          <div className="settings-summary">
            <h2>설정 진행률</h2>
            <ProgressBar value={progress} />
            <p>{progress}% 완료</p>
            <p>{statusMessage}</p>
          </div>
        </section>
      </div>

      <footer className="settings-actions">
        <button type="button" className="secondary-button" onClick={onPreview}>
          미리보기
        </button>
        <button type="button" className="secondary-button" onClick={onReset}>
          초기화
        </button>
        <button type="button" className="primary-button" onClick={onSave}>
          저장
        </button>
      </footer>
    </div>
  )
}

export default SettingsForm
