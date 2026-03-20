import { useEffect, useState } from 'react'
import popupAlert from '../assets/popup-alert.svg'
import popupEvent from '../assets/popup-event.svg'
import popupMarket from '../assets/popup-market.svg'
import AnnoyingPopupManager from './AnnoyingPopupManager.jsx'
import AppWindow from './AppWindow.jsx'
import DesktopIcon from './DesktopIcon.jsx'
import Dialog from './Dialog.jsx'
import ModernTodoWindow from './ModernTodoWindow.jsx'
import PopupWindow from './PopupWindow.jsx'
import Toolbar from './Toolbar.jsx'
import TopMenuBar from './TopMenuBar.jsx'
import Workspace from './Workspace.jsx'

const desktopIcons = [
  {
    id: 'notes',
    label: 'Notes',
    subtitle: '빠른 메모',
    accent: 'mint',
    kind: 'notes',
  },
  {
    id: 'trash',
    label: 'Trash',
    subtitle: '비어 있음',
    accent: 'slate',
    kind: 'trash',
  },
  {
    id: 'hts',
    label: 'HTS Mock',
    subtitle: 'Dense Trading UI',
    accent: 'rose',
    kind: 'hts',
  },
  {
    id: 'todoGood',
    label: 'To Do',
    subtitle: '집중 작업',
    accent: 'violet',
    kind: 'todo',
  },
]

const initialWindows = {
  notes: {
    open: false,
    x: 1040,
    y: 130,
    width: 280,
    height: 260,
    maximized: false,
    restoreBounds: null,
  },
  trash: {
    open: false,
    x: 1000,
    y: 430,
    width: 300,
    height: 240,
    maximized: false,
    restoreBounds: null,
  },
  hts: {
    open: false,
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    maximized: false,
    restoreBounds: null,
  },
  todoGood: {
    open: false,
    x: 250,
    y: 74,
    width: 1140,
    height: 690,
    maximized: false,
    restoreBounds: null,
  },
}

const htsAdPages = [
  {
    id: 'ad-1',
    eyebrow: '특별 프로모션',
    title: '해외선물 수수료 할인 이벤트',
    body: '신규 및 휴면 고객 대상 비대면 계좌 개설 시 해외선물 온라인 수수료 할인 혜택을 제공합니다. 자세한 내용은 다음 페이지에서 확인해 주세요.',
  },
  {
    id: 'ad-2',
    eyebrow: '이벤트 유의사항',
    title: '신청 가능 시간 및 대상 확인',
    body: '이벤트 신청은 영업일 08:00~17:00에 가능하며, 제휴은행 계좌 및 법인 계좌는 대상에서 제외될 수 있습니다.',
  },
  {
    id: 'ad-3',
    eyebrow: '투자 유의',
    title: '원금 손실 가능성 안내',
    body: '파생상품 거래는 원금 초과 손실이 발생할 수 있으며, 투자 전 상품설명서 및 위험고지를 반드시 확인하시기 바랍니다.',
  },
]

const initialHtsPopups = [
  {
    id: 'compliance',
    title: '시스템 운영 및 투자유의 안내',
    subtitle: '장중 주요 공지',
    body: '09:00~09:10 예상체결가 단일가 구간에서는 호가 변동이 크게 나타날 수 있습니다. 시장가 주문 입력 전 주문수량과 계좌 비밀번호 저장 여부를 다시 확인해 주십시오.',
    image: popupMarket,
    x: 250,
    y: 70,
    width: 760,
    height: 500,
    visible: true,
    lockForSession: false,
    allowLockForSession: false,
    behavior: 'menu-reopen',
    reopenOnAnyMenu: true,
  },
  {
    id: 'survey',
    title: '주문체결 알림 및 설정 점검',
    subtitle: '자동 재표시 공지',
    body: '실시간 체결통보, 조건검색 진입 알림, 시세 경고음 설정이 기본값으로 활성화되어 있습니다. 장 시작 전 알림 수신 채널과 관심종목 등록 상태를 확인하시기 바랍니다.',
    image: popupAlert,
    x: 390,
    y: 96,
    width: 800,
    height: 560,
    visible: true,
    lockForSession: false,
    allowLockForSession: true,
    behavior: 'timed-reopen',
  },
  {
    id: 'event',
    title: '국내주식 거래 이벤트 안내',
    subtitle: '툴바 클릭 시 재노출',
    body: '유관기관 제비용 및 제세금은 별도 부과될 수 있으며, 이벤트 기간 내 거래 조건 충족 시 수수료 우대가 적용됩니다. 이벤트 상세 조건은 공지사항을 확인해 주십시오.',
    image: popupEvent,
    x: 530,
    y: 84,
    width: 720,
    height: 480,
    visible: true,
    lockForSession: false,
    allowLockForSession: true,
    behavior: 'toolbar-reopen',
  },
]

function Desktop() {
  const [windows, setWindows] = useState(initialWindows)
  const [activeWindowId, setActiveWindowId] = useState(null)
  const [windowDragState, setWindowDragState] = useState(null)
  const [dialog, setDialog] = useState(null)
  const [htsPopups, setHtsPopups] = useState(initialHtsPopups)
  const [popupDragState, setPopupDragState] = useState(null)
  const [focusedPopupId, setFocusedPopupId] = useState(initialHtsPopups.at(-1)?.id ?? null)
  const [htsActivityNote, setHtsActivityNote] = useState(
    '학습용 데모입니다. 불편한 정보 밀도와 반복 팝업으로 나쁜 UX를 의도적으로 보여줍니다.'
  )
  const [adPopupVisible, setAdPopupVisible] = useState(true)
  const [adPageIndex, setAdPageIndex] = useState(0)
  const [clock, setClock] = useState(getFormattedClock())
  const [calendarText, setCalendarText] = useState(getFormattedDate())
  const [todoState, setTodoState] = useState({
    good: {
      input: '',
      priority: 'Medium',
      theme: 'light',
      activeView: 'tasks',
      selectedTaskId: 11,
      tasks: [
        {
          id: 11,
          text: '새 광고 연동 검토',
          priority: 'Medium',
          completed: false,
          list: '마케팅',
          dueDate: '2026-03-20',
          reminderDate: '2026-03-20',
          reminderTime: '00:45',
          durationMinutes: 30,
          categoryA: '그린 카테고리',
          categoryB: '레드 카테고리',
          note: '광고 매체별 태그 설치 상태와 유입 추적 이벤트 누락 여부를 확인합니다.',
          repeat: '매주 월요일',
          repeatDays: ['월'],
          myDay: true,
        },
        {
          id: 12,
          text: '신규 통합 테스트 정리',
          priority: 'High',
          completed: false,
          list: '업무',
          dueDate: '2026-03-24',
          reminderDate: '2026-03-24',
          reminderTime: '01:15',
          durationMinutes: 30,
          categoryA: '시스템 점검',
          categoryB: 'QA',
          note: '테스트 시나리오 정리 후 체크리스트를 배포합니다.',
          repeat: '반복 없음',
          repeatDays: [],
          myDay: false,
        },
        {
          id: 13,
          text: '팀 회의 메모 공유',
          priority: 'Low',
          completed: true,
          list: '개인',
          dueDate: '2026-03-18',
          reminderDate: '',
          reminderTime: '',
          durationMinutes: 30,
          categoryA: '공유',
          categoryB: '후속 없음',
          note: '회의 후속 작업은 이미 메일로 전달했습니다.',
          repeat: '반복 없음',
          repeatDays: [],
          myDay: true,
        },
      ],
    },
  })

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(getFormattedClock())
      setCalendarText(getFormattedDate())
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (!windowDragState) {
      return undefined
    }

    const handleMouseMove = (event) => {
      setWindows((current) => {
        const target = current[windowDragState.id]
        if (!target) {
          return current
        }

        const nextX = windowDragState.originX + event.clientX - windowDragState.startX
        const nextY = windowDragState.originY + event.clientY - windowDragState.startY

        return {
          ...current,
          [windowDragState.id]: {
            ...target,
            x: Math.max(36, Math.min(nextX, window.innerWidth - target.width - 36)),
            y: Math.max(36, Math.min(nextY, window.innerHeight - target.height - 48)),
          },
        }
      })
    }

    const handleMouseUp = () => {
      setWindowDragState(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [windowDragState])

  const openWindow = (windowId) => {
    setWindows((current) => ({
      ...current,
      [windowId]: {
        ...current[windowId],
        open: true,
      },
    }))
    setActiveWindowId(windowId)
  }

  const closeWindow = (windowId) => {
    setWindows((current) => ({
      ...current,
      [windowId]: {
        ...current[windowId],
        open: false,
      },
    }))
    setActiveWindowId((current) => (current === windowId ? null : current))
  }

  const startWindowDrag = (windowId, event) => {
    const targetWindow = windows[windowId]
    if (!targetWindow || targetWindow.maximized) {
      return
    }

    setActiveWindowId(windowId)
    setWindowDragState({
      id: windowId,
      startX: event.clientX,
      startY: event.clientY,
      originX: targetWindow.x,
      originY: targetWindow.y,
    })
  }

  const openWindowIds = Object.entries(windows)
    .filter(([, value]) => value.open)
    .map(([key]) => key)
  const taskbarPins = ['edge', 'folder', 'mail', 'store']

  const toggleWindowMaximize = (windowId) => {
    setWindows((current) => {
      const target = current[windowId]
      if (!target) {
        return current
      }

      if (target.maximized) {
        const restoreBounds = target.restoreBounds
        if (!restoreBounds) {
          return {
            ...current,
            [windowId]: {
              ...target,
              maximized: false,
            },
          }
        }

        return {
          ...current,
          [windowId]: {
            ...target,
            ...restoreBounds,
            maximized: false,
            restoreBounds: null,
          },
        }
      }

      return {
        ...current,
        [windowId]: {
          ...target,
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight - 42,
          maximized: true,
          restoreBounds: {
            x: target.x,
            y: target.y,
            width: target.width,
            height: target.height,
          },
        },
      }
    })
    setActiveWindowId(windowId)
  }

  const reopenMatchingHtsPopups = (behavior, reason) => {
    setHtsPopups((current) =>
      current.map((popup) =>
        (popup.behavior === behavior || (behavior === 'any-menu' && popup.reopenOnAnyMenu)) &&
        !popup.lockForSession
          ? { ...popup, visible: true }
          : popup
      )
    )
    setHtsActivityNote(reason)
  }

  const reopenMandatoryHtsPopupForAnyButton = (reason) => {
    setHtsPopups((current) =>
      current.map((popup) => (popup.reopenOnAnyMenu ? { ...popup, visible: true } : popup))
    )
    setFocusedPopupId('compliance')
    setHtsActivityNote(reason)
  }

  const dismissHtsPopup = (popupId) => {
    setHtsPopups((current) =>
      current.map((popup) => (popup.id === popupId ? { ...popup, visible: false } : popup))
    )
    setHtsActivityNote(`"${popupId}" 팝업을 닫았습니다. 하지만 다시 돌아올 수 있습니다.`)
  }

  const toggleHtsLockForSession = (popupId) => {
    setHtsPopups((current) =>
      current.map((popup) =>
        popup.id === popupId ? { ...popup, lockForSession: !popup.lockForSession } : popup
      )
    )
  }

  const startHtsPopupDrag = (popupId, event) => {
    event.preventDefault()

    const popup = htsPopups.find((item) => item.id === popupId)
    if (!popup) {
      return
    }

    setFocusedPopupId(popupId)
    setPopupDragState({
      id: popupId,
      startX: event.clientX,
      startY: event.clientY,
      originX: popup.x,
      originY: popup.y,
    })
  }

  const moveDraggingHtsPopup = (event) => {
    if (!popupDragState) {
      return
    }

    const nextX = popupDragState.originX + event.clientX - popupDragState.startX
    const nextY = popupDragState.originY + event.clientY - popupDragState.startY

    setHtsPopups((current) =>
      current.map((popup) =>
        popup.id === popupDragState.id
          ? {
              ...popup,
              x: Math.max(16, Math.min(nextX, window.innerWidth - popup.width - 24)),
              y: Math.max(40, Math.min(nextY, window.innerHeight - popup.height - 32)),
            }
          : popup
      )
    )
  }

  const stopDraggingHtsPopup = () => {
    setPopupDragState(null)
  }

  const showNextHtsAdPage = () => {
    setAdPageIndex((current) => Math.min(current + 1, htsAdPages.length - 1))
    setHtsActivityNote('오른쪽 아래 광고 팝업은 끝 페이지까지 넘겨야만 닫기 버튼이 나타납니다.')
  }

  const closeHtsAdPopup = () => {
    setAdPopupVisible(false)
    setHtsActivityNote('광고 팝업을 끝까지 본 뒤에야 닫을 수 있었습니다.')
  }

  const updateTodoState = (variant, updater) => {
    setTodoState((current) => ({
      ...current,
      [variant]: updater(current[variant]),
    }))
  }

  const addTodoTask = (variant) => {
    updateTodoState(variant, (current) => {
      const text = current.input.trim()
      if (!text) {
        return current
      }

      const newTaskId = Date.now() + Math.random()

      return {
        ...current,
        input: '',
        selectedTaskId: variant === 'good' ? newTaskId : current.selectedTaskId,
        tasks: [
          ...current.tasks,
          {
            id: newTaskId,
            text,
            priority: current.priority,
            completed: false,
            ...(variant === 'good'
              ? {
                  list: '마케팅',
                  dueDate: '',
                  reminderDate: '',
                  reminderTime: '',
                  durationMinutes: 30,
                  categoryA: '새 작업',
                  categoryB: '분류 필요',
                  note: '상세 메모를 아직 작성하지 않았습니다.',
                  repeat: '반복 없음',
                  repeatDays: [],
                  myDay: false,
                }
              : {}),
          },
        ],
      }
    })
  }

  const selectTodoTask = (variant, taskId) => {
    updateTodoState(variant, (current) => ({
      ...current,
      selectedTaskId: taskId,
    }))
  }

  const selectTodoView = (variant, nextView) => {
    updateTodoState(variant, (current) => {
      const filteredTasks = getFilteredTodoTasks(current.tasks, nextView)

      return {
        ...current,
        activeView: nextView,
        selectedTaskId: filteredTasks.some((task) => task.id === current.selectedTaskId)
          ? current.selectedTaskId
          : (filteredTasks[0]?.id ?? null),
      }
    })
  }

  const toggleTodoTheme = (variant) => {
    updateTodoState(variant, (current) => ({
      ...current,
      theme: current.theme === 'dark' ? 'light' : 'dark',
    }))
  }

  const toggleTodoTask = (variant, taskId) => {
    updateTodoState(variant, (current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }))
  }

  const updateTodoTaskDetails = (variant, taskId, updates) => {
    updateTodoState(variant, (current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
    }))
  }

  const requestTodoDelete = (variant, taskId) => {
    setDialog({
      type: 'yesNo',
      source: `todo-delete-${variant}`,
      title: 'To Do',
      message: '이 할 일을 삭제하시겠습니까?',
      buttons: ['예', '아니요'],
      taskId,
      variant,
    })
  }

  const handleDialogAction = (choice) => {
    if (!dialog) {
      return
    }

    if (dialog.source?.startsWith('todo-delete-')) {
      if (choice === '예') {
        updateTodoState(dialog.variant, (current) => ({
          ...current,
          tasks: current.tasks.filter((task) => task.id !== dialog.taskId),
          selectedTaskId:
            current.selectedTaskId === dialog.taskId
              ? current.tasks.find((task) => task.id !== dialog.taskId)?.id ?? null
              : current.selectedTaskId,
        }))
      }
    }

    setDialog(null)
  }

  return (
    <main
      className="desktop"
      onClickCapture={(event) => {
        if (!windows.hts.open) {
          return
        }

        const clickedButton = event.target.closest('button')
        if (!clickedButton) {
          return
        }

        reopenMandatoryHtsPopupForAnyButton(
          `"${clickedButton.textContent?.trim() || '버튼'}" 버튼을 눌러서 숨김 불가 공지가 다시 나타났습니다.`
        )
      }}
    >
      <AnnoyingPopupManager
        dragState={popupDragState}
        moveDraggingPopup={moveDraggingHtsPopup}
        popups={htsPopups}
        setPopups={setHtsPopups}
        stopDraggingPopup={stopDraggingHtsPopup}
      />
      <div className="desktop-background" />

      <section className="desktop-icons" aria-label="Desktop icons">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon}
            onOpen={() => openWindow(icon.id)}
          />
        ))}
      </section>

      {windows.notes.open && (
        <AppWindow
          title="메모"
          subtitle="빠른 참고"
          window={windows.notes}
          isActive={activeWindowId === 'notes'}
          isMaximized={Boolean(windows.notes.maximized)}
          onClose={() => closeWindow('notes')}
          onFocus={() => setActiveWindowId('notes')}
          onStartDrag={(event) => startWindowDrag('notes', event)}
          onToggleMaximize={() => toggleWindowMaximize('notes')}
          compact
        >
          <div className="mini-window-content">
            <h2>도움말</h2>
            <p>명확한 라벨, 안전한 기본값, 실시간 진행률은 설정 과정을 더 쉽게 이해하게 도와줍니다.</p>
            <p>이 바탕화면은 단순하게 구성되어 처음 봐도 무엇을 해야 하는지 바로 알 수 있습니다.</p>
          </div>
        </AppWindow>
      )}

      {windows.trash.open && (
        <AppWindow
          title="휴지통"
          subtitle="정리할 항목 없음"
          window={windows.trash}
          isActive={activeWindowId === 'trash'}
          isMaximized={Boolean(windows.trash.maximized)}
          onClose={() => closeWindow('trash')}
          onFocus={() => setActiveWindowId('trash')}
          onStartDrag={(event) => startWindowDrag('trash', event)}
          onToggleMaximize={() => toggleWindowMaximize('trash')}
          compact
        >
          <div className="mini-window-content">
            <h2>휴지통이 비어 있습니다</h2>
            <p>삭제된 설정 프로필이 없습니다. 현재 내용은 모두 그대로 보존되어 있습니다.</p>
          </div>
        </AppWindow>
      )}

      {windows.hts.open && (
        <AppWindow
          title="HTS Mock"
          subtitle="Dense Trading UI"
          window={windows.hts}
          isActive={activeWindowId === 'hts'}
          isMaximized={Boolean(windows.hts.maximized)}
          onClose={() => closeWindow('hts')}
          onFocus={() => setActiveWindowId('hts')}
          onStartDrag={(event) => startWindowDrag('hts', event)}
          onToggleMaximize={() => toggleWindowMaximize('hts')}
          className="hts-window"
        >
          <div className="embedded-hts-shell">
            <TopMenuBar
              onMenuAction={(label, behavior) =>
                reopenMatchingHtsPopups(
                  behavior,
                  `${label} 메뉴를 눌렀습니다. 이미 닫은 공지도 다시 떠서 화면을 가립니다.`
                )
              }
            />
            <Toolbar
              onToolbarAction={(label, behavior) =>
                reopenMatchingHtsPopups(
                  behavior,
                  `${label} 툴을 눌렀습니다. 방금 닫은 팝업이 다시 튀어나오도록 설계했습니다.`
                )
              }
            />
            <Workspace activityNote={htsActivityNote} compact />

            <section className="popup-layer embedded-popup-layer" aria-label="방해 팝업 레이어">
              {htsPopups
                .filter((popup) => popup.visible)
                .sort((left, right) => {
                  if (left.id === focusedPopupId) {
                    return 1
                  }

                  if (right.id === focusedPopupId) {
                    return -1
                  }

                  return 0
                })
                .map((popup) => (
                  <PopupWindow
                    key={popup.id}
                    popup={popup}
                    isFocused={popup.id === focusedPopupId}
                    onClose={dismissHtsPopup}
                    onFocus={setFocusedPopupId}
                    onStartDrag={startHtsPopupDrag}
                    onToggleLock={toggleHtsLockForSession}
                  />
                ))}
            </section>
          </div>
        </AppWindow>
      )}

      {windows.todoGood.open && (
        <AppWindow
          title="To Do"
          subtitle="집중 작업 관리"
          window={windows.todoGood}
          isActive={activeWindowId === 'todoGood'}
          isMaximized={Boolean(windows.todoGood.maximized)}
          onClose={() => closeWindow('todoGood')}
          onFocus={() => setActiveWindowId('todoGood')}
          onStartDrag={(event) => startWindowDrag('todoGood', event)}
          onToggleMaximize={() => toggleWindowMaximize('todoGood')}
          className="todo-app-window todo-modern-window"
        >
          <ModernTodoWindow
            state={todoState.good}
            onInputChange={(value) =>
              updateTodoState('good', (current) => ({ ...current, input: value }))
            }
            onPriorityChange={(value) =>
              updateTodoState('good', (current) => ({ ...current, priority: value }))
            }
            onAddTask={() => addTodoTask('good')}
            onToggleTask={(taskId) => toggleTodoTask('good', taskId)}
            onSelectTask={(taskId) => selectTodoTask('good', taskId)}
            onSelectView={(view) => selectTodoView('good', view)}
            onToggleTheme={() => toggleTodoTheme('good')}
            onUpdateTaskDetails={(taskId, updates) => updateTodoTaskDetails('good', taskId, updates)}
            onDeleteRequest={(taskId) => requestTodoDelete('good', taskId)}
          />
        </AppWindow>
      )}

      {windows.hts.open && adPopupVisible && (
        <aside className="ad-popup" aria-label="HTS 광고 팝업">
          <div className="ad-popup-header">
            <div>
              <strong>스폰서드 메시지</strong>
              <span>
                {adPageIndex + 1} / {htsAdPages.length} 페이지
              </span>
            </div>
            {adPageIndex === htsAdPages.length - 1 ? (
              <button type="button" className="ad-popup-close" onClick={closeHtsAdPopup}>
                x
              </button>
            ) : null}
          </div>

          <div className="ad-popup-viewport">
            <div className="ad-popup-track" style={{ transform: `translateX(-${adPageIndex * 100}%)` }}>
              {htsAdPages.map((page) => (
                <section key={page.id} className="ad-popup-page">
                  <span className="ad-eyebrow">{page.eyebrow}</span>
                  <h3>{page.title}</h3>
                  <p>{page.body}</p>
                </section>
              ))}
            </div>
          </div>

          <div className="ad-popup-footer">
            <div className="ad-progress">
              {htsAdPages.map((page, index) => (
                <span key={page.id} className={`ad-dot ${index <= adPageIndex ? 'active' : ''}`} />
              ))}
            </div>

            {adPageIndex < htsAdPages.length - 1 ? (
              <button type="button" className="secondary-button ad-next-button" onClick={showNextHtsAdPage}>
                다음 광고 보기 →
              </button>
            ) : (
              <span className="ad-close-hint">모든 광고를 봐야만 닫기 가능</span>
            )}
          </div>
        </aside>
      )}

      <footer className="taskbar" aria-label="작업 표시줄">
        <button
          type="button"
          className="taskbar-start"
          onClick={() => openWindow('notes')}
          aria-label="시작"
        />

        <div className="taskbar-search" aria-hidden="true">
          검색하려면 여기에 입력하십시오.
        </div>

        <div className="taskbar-pins" aria-label="고정된 앱">
          {taskbarPins.map((pin) => (
            <button key={pin} type="button" className={`taskbar-pin ${pin}`} aria-label={pin} />
          ))}
        </div>

        <div className="taskbar-apps" aria-label="열린 앱">
          {openWindowIds.map((windowId) => {
            const icon = desktopIcons.find((item) => item.id === windowId)
            if (!icon) {
              return null
            }

            return (
              <button
                key={windowId}
                type="button"
                className={`taskbar-app ${activeWindowId === windowId ? 'active' : ''}`}
                onClick={() => setActiveWindowId(windowId)}
              >
                <span className={`taskbar-app-dot ${icon.accent}`} aria-hidden="true" />
                <span>{icon.label}</span>
              </button>
            )
          })}
        </div>

        <div className="taskbar-status">
          <span className="taskbar-weather">3°C</span>
          <div className="taskbar-datetime">
            <time dateTime={new Date().toISOString()}>{clock}</time>
            <span>{calendarText}</span>
          </div>
        </div>
      </footer>

      <Dialog dialog={dialog} onAction={handleDialogAction} />
    </main>
  )
}

function getFormattedClock() {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

function getFormattedDate() {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function getFilteredTodoTasks(tasks, activeView) {
  if (activeView === 'myDay') {
    return tasks.filter((task) => task.myDay)
  }

  if (activeView === 'important') {
    return tasks.filter((task) => task.priority === 'High')
  }

  if (activeView === 'planned') {
    return tasks.filter((task) => task.dueDate && !task.completed)
  }

  return tasks
}

export default Desktop
