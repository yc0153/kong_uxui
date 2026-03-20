const tools = [
  { label: '긴급알림', behavior: 'toolbar-reopen' },
  { label: '이벤트', behavior: 'toolbar-reopen' },
  { label: '환경설정', behavior: 'timed-reopen' },
  { label: '공지재생성', behavior: 'menu-reopen' },
]

function Toolbar({ onToolbarAction }) {
  return (
    <section className="toolbar" aria-label="도구 모음">
      {tools.map((tool) => (
        <button
          key={tool.label}
          className="tool-button"
          type="button"
          onClick={() => onToolbarAction(tool.label, tool.behavior)}
        >
          <span className="tool-icon" aria-hidden="true">
            {tool.label.slice(0, 1)}
          </span>
          <span>{tool.label}</span>
        </button>
      ))}
    </section>
  )
}

export default Toolbar
