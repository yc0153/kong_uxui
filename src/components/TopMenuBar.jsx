const menus = [
  { label: '시세', behavior: 'any-menu' },
  { label: '주문', behavior: 'any-menu' },
  { label: '관심종목', behavior: 'any-menu' },
  { label: '설정', behavior: 'any-menu' },
  { label: '도움말', behavior: 'any-menu' },
]

function TopMenuBar({ onMenuAction }) {
  return (
    <header className="top-menu-bar">
      <div className="brand-block">
        <strong>BAD HTS 4.0</strong>
        <span>UI/UX Assignment Mock</span>
      </div>

      <nav className="menu-strip" aria-label="상단 메뉴">
        {menus.map((menu) => (
          <button
            key={menu.label}
            className="menu-button"
            type="button"
            onClick={() => onMenuAction(menu.label, menu.behavior)}
          >
            {menu.label}
          </button>
        ))}
      </nav>

      <div className="market-badges" aria-label="상태 요약">
        <span className="badge badge-danger">과도한 정보 밀도</span>
        <span className="badge">실거래 불가 데모</span>
      </div>
    </header>
  )
}

export default TopMenuBar
