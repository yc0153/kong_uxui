const orderbookRows = [
  ['52,300', '+1.22%', '1,204'],
  ['52,250', '+1.12%', '2,829'],
  ['52,200', '+1.03%', '4,201'],
  ['52,150', '+0.93%', '5,802'],
  ['52,100', '+0.84%', '9,115'],
]

const watchlistRows = [
  ['BAD전자', '52,100', '+0.84%', '12,440,020'],
  ['혼란홀딩스', '18,750', '-2.14%', '5,882,111'],
  ['팝업테크', '101,200', '+5.01%', '8,102,003'],
  ['다크패턴랩', '7,830', '-0.48%', '992,101'],
]

function Workspace({ activityNote }) {
  return (
    <section className="workspace">
      <aside className="panel panel-sidebar">
        <div className="panel-header">
          <h2>관심종목</h2>
          <span>9개 탭 중 1개</span>
        </div>

        <table className="dense-table">
          <thead>
            <tr>
              <th>종목</th>
              <th>현재가</th>
              <th>등락</th>
              <th>거래량</th>
            </tr>
          </thead>
          <tbody>
            {watchlistRows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="assignment-warning">
          <strong>과제 의도</strong>
          <p>실제 금융 서비스가 아니라 불편한 UX를 분석하기 위한 데스크톱 모형입니다.</p>
        </div>
      </aside>

      <div className="workspace-main">
        <section className="panel hero-panel">
          <div className="panel-header">
            <h2>호가 / 차트 / 주문이 한 화면에 과도하게 압축됨</h2>
            <span>가독성 희생</span>
          </div>

          <div className="hero-grid">
            <div className="chart-block">
              <div className="fake-chart" aria-hidden="true">
                <div className="chart-overlay">120개 지표가 겹친 차트 영역</div>
              </div>
              <div className="chart-footnotes">
                <span>1분</span>
                <span>3분</span>
                <span>5분</span>
                <span>10분</span>
                <span>일</span>
                <span>주</span>
                <span>월</span>
              </div>
            </div>

            <div className="orderbook-block">
              <h3>호가창</h3>
              <table className="dense-table">
                <thead>
                  <tr>
                    <th>호가</th>
                    <th>등락</th>
                    <th>잔량</th>
                  </tr>
                </thead>
                <tbody>
                  {orderbookRows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell) => (
                        <td key={cell}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="workspace-bottom">
          <div className="panel ticket-panel">
            <div className="panel-header">
              <h2>주문 입력</h2>
              <span>실행되지 않는 샘플</span>
            </div>

            <div className="form-grid">
              <label>
                <span>계좌</span>
                <input defaultValue="815-44-003921" />
              </label>
              <label>
                <span>종목코드</span>
                <input defaultValue="BAD001" />
              </label>
              <label>
                <span>수량</span>
                <input defaultValue="100" />
              </label>
              <label>
                <span>가격</span>
                <input defaultValue="52,100" />
              </label>
            </div>

            <div className="order-actions">
              <button type="button" className="order-button order-buy">
                매수
              </button>
              <button type="button" className="order-button order-sell">
                매도
              </button>
              <button type="button" className="order-button order-neutral">
                정정
              </button>
            </div>
          </div>

          <div className="panel log-panel">
            <div className="panel-header">
              <h2>알림 로그</h2>
              <span>불필요하게 큼</span>
            </div>

            <ul className="log-list">
              <li>{activityNote}</li>
              <li>팝업은 닫아도 메뉴 또는 일정 시간이 지나면 다시 열리도록 구성되어 있습니다.</li>
              <li>드래그는 마우스 이벤트로 직접 구현되어 있으며 외부 윈도우 라이브러리를 사용하지 않습니다.</li>
              <li>시각적으로는 HTS처럼 빽빽하지만 텍스트로 과제 목적을 명확히 표시했습니다.</li>
            </ul>
          </div>
        </section>
      </div>
    </section>
  )
}

export default Workspace
