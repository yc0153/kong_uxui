import { useState } from 'react'

const TIME_OPTIONS = Array.from({ length: 96 }, (_, index) => {
  const hour = String(Math.floor(index / 4)).padStart(2, '0')
  const minute = String((index % 4) * 15).padStart(2, '0')
  return `${hour}:${minute}`
})

const WEEKDAY_OPTIONS = ['월', '화', '수', '목', '금', '토', '일']
const COACH_STEPS = [
  {
    id: 'sidebar',
    title: '1. 왼쪽 탐색',
    body: '내 하루, 중요, 계획됨으로 작업을 빠르게 필터링하고 진행률을 한눈에 볼 수 있습니다.',
    targetClass: 'coach-target-sidebar',
    bubbleClass: 'sidebar',
  },
  {
    id: 'composer',
    title: '2. 빠른 작업 추가',
    body: '제목을 입력하고 우선순위를 고른 뒤 바로 추가할 수 있어 처음 쓰는 사람도 흐름을 이해하기 쉽습니다.',
    targetClass: 'coach-target-composer',
    bubbleClass: 'composer',
  },
  {
    id: 'detail',
    title: '3. 상세 패널',
    body: '선택한 작업의 알림, 기한, 반복, 카테고리, 메모를 오른쪽에서 바로 수정할 수 있습니다.',
    targetClass: 'coach-target-detail',
    bubbleClass: 'detail',
  },
  {
    id: 'calendar',
    title: '4. 캘린더 보기',
    body: '목록과 캘린더를 전환해 같은 작업을 다른 방식으로 확인할 수 있습니다.',
    targetClass: 'coach-target-calendar',
    bubbleClass: 'calendar',
  },
]

function ModernTodoWindow({
  state,
  onInputChange,
  onPriorityChange,
  onAddTask,
  onToggleTask,
  onSelectTask,
  onSelectView,
  onToggleTheme,
  onUpdateTaskDetails,
  onDeleteRequest,
}) {
  const completedCount = state.tasks.filter((task) => task.completed).length
  const progress = state.tasks.length ? Math.round((completedCount / state.tasks.length) * 100) : 0
  const filteredTasks = getFilteredTasks(state.tasks, state.activeView)
  const selectedTask =
    filteredTasks.find((task) => task.id === state.selectedTaskId) ?? filteredTasks[0] ?? null

  const [editingField, setEditingField] = useState(null)
  const [boardMode, setBoardMode] = useState('list')
  const [calendarMonth, setCalendarMonth] = useState(selectedTask?.dueDate ?? getTodayIso())
  const [draftValues, setDraftValues] = useState(getDefaultDraft())
  const [coachStepIndex, setCoachStepIndex] = useState(0)
  const [coachVisible, setCoachVisible] = useState(true)

  const smartLists = [
    { id: 'myDay', label: '내 하루', count: state.tasks.filter((task) => task.myDay).length },
    { id: 'important', label: '중요', count: state.tasks.filter((task) => task.priority === 'High').length },
    {
      id: 'planned',
      label: '계획됨',
      count: state.tasks.filter((task) => task.dueDate && !task.completed).length,
    },
    { id: 'tasks', label: '할 일', count: state.tasks.length },
  ]

  const customLists = [
    {
      group: '업무',
      items: [
        {
          label: '마케팅',
          count: state.tasks.filter((task) => task.list === '마케팅').length,
          active: true,
        },
      ],
    },
    {
      group: '개인',
      items: [{ label: '개인 메모', count: state.tasks.filter((task) => task.list === '개인').length }],
    },
  ]

  const dueCalendar = buildMonthGrid(calendarMonth)
  const boardCalendar = buildMonthGrid(selectedTask?.dueDate || getTodayIso())

  const openEditor = (field) => {
    if (!selectedTask) {
      return
    }

    setDraftValues({
      dueDate: selectedTask.dueDate || getTodayIso(),
      reminderDate: selectedTask.reminderDate || selectedTask.dueDate || getTodayIso(),
      reminderTime: selectedTask.reminderTime || '09:00',
      durationMinutes: selectedTask.durationMinutes || 30,
      repeat: selectedTask.repeat,
      repeatDays: selectedTask.repeatDays || [],
      categoryA: selectedTask.categoryA,
      categoryB: selectedTask.categoryB,
      note: selectedTask.note,
    })
    setCalendarMonth(selectedTask.dueDate || getTodayIso())
    setEditingField(field)
  }

  const closeEditor = () => {
    setEditingField(null)
  }

  const saveField = (field) => {
    if (!selectedTask) {
      return
    }

    if (field === 'categories') {
      onUpdateTaskDetails(selectedTask.id, {
        categoryA: draftValues.categoryA.trim() || '미분류',
        categoryB: draftValues.categoryB.trim() || '추가 없음',
      })
      closeEditor()
      return
    }

    if (field === 'schedule') {
      onUpdateTaskDetails(selectedTask.id, {
        reminderDate: draftValues.reminderDate,
        reminderTime: draftValues.reminderTime,
        durationMinutes: draftValues.durationMinutes,
      })
      closeEditor()
      return
    }

    if (field === 'dueDate') {
      onUpdateTaskDetails(selectedTask.id, {
        dueDate: draftValues.dueDate,
      })
      closeEditor()
      return
    }

    if (field === 'repeat') {
      onUpdateTaskDetails(selectedTask.id, {
        repeatDays: draftValues.repeatDays,
        repeat: formatRepeatLabel(draftValues.repeatDays),
      })
      closeEditor()
      return
    }

    onUpdateTaskDetails(selectedTask.id, {
      [field]: draftValues[field].trim() || getEmptyFallback(field),
    })
    closeEditor()
  }

  const selectedMonthIso = selectedTask?.dueDate || getTodayIso()
  const currentCoachStep = COACH_STEPS[coachStepIndex]

  return (
    <div className={`modern-todo ${state.theme === 'dark' ? 'dark' : 'light'}`}>
      <header className="modern-todo-topbar">
        <div className="modern-todo-brand">
          <button type="button" className="modern-todo-apps-button" aria-label="앱 목록" />
          <strong>To Do</strong>
        </div>

        <label className="modern-todo-search">
          <span aria-hidden="true" />
          <input type="text" value="" readOnly aria-label="검색" placeholder="검색" />
        </label>

        <div className="modern-todo-top-actions">
          <button
            type="button"
            className="modern-todo-guide-button"
            onClick={() => {
              setCoachVisible(true)
              setCoachStepIndex(0)
            }}
          >
            Guide
          </button>
          <button type="button" className="modern-todo-theme-toggle" onClick={onToggleTheme}>
            {state.theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <span className="modern-todo-utility gear" />
          <span className="modern-todo-utility help" />
          <span className="modern-todo-utility bell" />
          <span className="modern-todo-avatar">J</span>
        </div>
      </header>

      <div className="modern-todo-layout">
        <aside
          className={`modern-todo-sidebar ${coachVisible && currentCoachStep?.targetClass === 'coach-target-sidebar' ? 'coach-target-active coach-target-sidebar' : 'coach-target-sidebar'}`}
        >
          <button type="button" className="modern-todo-sidebar-toggle" aria-label="사이드바 축소" />

          <nav className="modern-todo-nav">
            {smartLists.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`modern-todo-nav-item ${state.activeView === item.id ? 'active' : ''}`}
                onClick={() => onSelectView(item.id)}
              >
                <span className="modern-todo-nav-icon" aria-hidden="true" />
                <span>{item.label}</span>
                <em>{item.count}</em>
              </button>
            ))}
          </nav>

          <div className="modern-todo-list-groups">
            {customLists.map((group) => (
              <section key={group.group} className="modern-todo-group">
                <header>
                  <strong>{group.group}</strong>
                  <span aria-hidden="true">⌄</span>
                </header>

                {group.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className={`modern-todo-list-item ${item.active ? 'active' : ''}`}
                  >
                    <span>{item.label}</span>
                    <em>{item.count}</em>
                  </button>
                ))}
              </section>
            ))}
          </div>

          <div className="modern-todo-progress-card">
            <div className="modern-todo-progress-copy">
              <strong>진행률</strong>
              <span>{progress}% 완료</span>
            </div>
            <div className="modern-todo-progress-track" aria-label="진행률">
              <div className="modern-todo-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </aside>

        <section
          className={`modern-todo-board ${boardMode === 'calendar' ? 'calendar-mode' : ''} ${
            coachVisible && currentCoachStep?.targetClass === 'coach-target-calendar'
              ? 'coach-target-active coach-target-calendar'
              : 'coach-target-calendar'
          }`}
        >
          <div className="modern-todo-board-toolbar">
            <div className="modern-todo-view-controls" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="modern-todo-board-actions">
              <button type="button" className={boardMode === 'list' ? 'active' : ''} onClick={() => setBoardMode('list')}>
                목록
              </button>
              <button type="button" className={boardMode === 'calendar' ? 'active' : ''} onClick={() => setBoardMode('calendar')}>
                캘린더
              </button>
              <button type="button">공유</button>
            </div>
          </div>

          {boardMode === 'list' ? (
            <>
              <div
                className={`modern-todo-add-card ${
                  coachVisible && currentCoachStep?.targetClass === 'coach-target-composer'
                    ? 'coach-target-active coach-target-composer'
                    : 'coach-target-composer'
                }`}
              >
                <div className="modern-todo-add-row">
                  <span className="modern-todo-add-plus" aria-hidden="true">
                    +
                  </span>
                  <input
                    type="text"
                    value={state.input}
                    placeholder="작업 추가"
                    onChange={(event) => onInputChange(event.target.value)}
                  />
                  <button type="button" className="modern-todo-add-button" onClick={onAddTask}>
                    추가
                  </button>
                </div>

                <fieldset className="modern-todo-priority">
                  <legend>우선순위</legend>
                  {[
                    ['High', '높음'],
                    ['Medium', '보통'],
                    ['Low', '낮음'],
                  ].map(([value, label]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="modern-todo-priority"
                        value={value}
                        checked={state.priority === value}
                        onChange={(event) => onPriorityChange(event.target.value)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </fieldset>
              </div>

              <div className="modern-todo-task-list">
                {filteredTasks.length === 0 ? (
                  <div className="modern-todo-empty-state">선택한 목록에 표시할 작업이 없습니다.</div>
                ) : null}

                {filteredTasks.map((task) => (
                  <article
                    key={task.id}
                    className={`modern-todo-task-card ${selectedTask?.id === task.id ? 'selected' : ''} ${task.completed ? 'completed' : ''}`}
                    onClick={() => onSelectTask(task.id)}
                  >
                    <label className="modern-todo-task-check" onClick={(event) => event.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(task.id)}
                      />
                    </label>

                    <div className="modern-todo-task-main">
                      <strong>{task.text}</strong>
                      <div className="modern-todo-task-meta">
                        <span>{task.list}</span>
                        <span>{formatDueDate(task.dueDate, task.completed)}</span>
                        <span className={`priority ${task.priority.toLowerCase()}`}>
                          {translatePriority(task.priority)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="modern-todo-task-delete"
                      onClick={(event) => {
                        event.stopPropagation()
                        onDeleteRequest(task.id)
                      }}
                    >
                      삭제
                    </button>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="modern-todo-calendar-board">
              <div className="modern-todo-calendar-header">
                <strong>{formatMonthHeading(selectedMonthIso)}</strong>
                <span>월간 일정 보기</span>
              </div>

              <div className="modern-todo-calendar-weekdays">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="modern-todo-calendar-grid">
                {boardCalendar.map((day) => (
                  <article
                    key={day.iso}
                    className={`modern-todo-calendar-cell ${day.isCurrentMonth ? '' : 'muted'} ${day.iso === selectedTask?.dueDate ? 'selected' : ''}`}
                  >
                    <span>{day.dayNumber}</span>
                    <div className="modern-todo-calendar-events">
                      {state.tasks
                        .filter((task) => task.dueDate === day.iso)
                        .slice(0, 2)
                        .map((task) => (
                          <button key={task.id} type="button" onClick={() => onSelectTask(task.id)}>
                            {task.text}
                          </button>
                        ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside
          className={`modern-todo-detail ${
            coachVisible && currentCoachStep?.targetClass === 'coach-target-detail'
              ? 'coach-target-active coach-target-detail'
              : 'coach-target-detail'
          }`}
        >
          {selectedTask ? (
            <>
              <header className="modern-todo-detail-header">
                <div className="modern-todo-detail-title">
                  <label className="modern-todo-task-check">
                    <input
                      type="checkbox"
                      checked={selectedTask.completed}
                      onChange={() => onToggleTask(selectedTask.id)}
                    />
                  </label>
                  <strong>{selectedTask.text}</strong>
                </div>
                <button type="button" className="modern-todo-detail-star" aria-label="중요 표시">
                  ☆
                </button>
              </header>

              <div className="modern-todo-detail-sections">
                <section>
                  <div className="modern-todo-detail-row">
                    <span>알림</span>
                    <button type="button" className="modern-todo-detail-add" onClick={() => openEditor('schedule')}>
                      +
                    </button>
                  </div>
                  <strong>{formatReminderSummary(selectedTask)}</strong>
                  {editingField === 'schedule' ? (
                    <div className="modern-todo-floating-picker schedule">
                      <div className="modern-todo-scheduler">
                        <div className="modern-todo-scheduler-summary">
                          <div className="modern-todo-scheduler-summary-top">
                            <strong>{formatTime(draftValues.reminderTime)}</strong>
                            <div className="modern-todo-scheduler-top-actions">
                              <button type="button" onClick={() => saveField('schedule')}>
                                저장
                              </button>
                              <button type="button" onClick={closeEditor}>
                                취소
                              </button>
                            </div>
                          </div>
                          <span>
                            {formatTimeRange(draftValues.reminderTime, draftValues.durationMinutes)} {draftValues.durationMinutes}분
                          </span>
                        </div>
                        <div className="modern-todo-scheduler-layout">
                          <div className="modern-todo-mini-calendar">
                            <div className="modern-todo-mini-calendar-header">
                              <strong>{formatMonthHeading(calendarMonth)}</strong>
                              <div>
                                <button type="button" onClick={() => setCalendarMonth(shiftMonth(calendarMonth, -1))}>
                                  ‹
                                </button>
                                <button type="button" onClick={() => setCalendarMonth(shiftMonth(calendarMonth, 1))}>
                                  ›
                                </button>
                              </div>
                            </div>
                            <div className="modern-todo-mini-weekdays">
                              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                                <span key={day}>{day}</span>
                              ))}
                            </div>
                            <div className="modern-todo-mini-grid">
                              {dueCalendar.map((day) => (
                                <button
                                  key={day.iso}
                                  type="button"
                                  className={`${day.isCurrentMonth ? '' : 'muted'} ${draftValues.reminderDate === day.iso ? 'selected' : ''}`}
                                  onClick={() =>
                                    setDraftValues((current) => ({ ...current, reminderDate: day.iso }))
                                  }
                                >
                                  {day.dayNumber}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="modern-todo-time-list">
                            {TIME_OPTIONS.map((time) => (
                              <button
                                key={time}
                                type="button"
                                className={draftValues.reminderTime === time ? 'active' : ''}
                                onClick={() =>
                                  setDraftValues((current) => ({ ...current, reminderTime: time }))
                                }
                              >
                                {formatTime(time)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </section>

                <section>
                  <div className="modern-todo-detail-row">
                    <span>기한</span>
                    <button type="button" className="modern-todo-detail-add" onClick={() => openEditor('dueDate')}>
                      +
                    </button>
                  </div>
                  <strong>{formatDueDate(selectedTask.dueDate, selectedTask.completed)}</strong>
                  {editingField === 'dueDate' ? (
                    <div className="modern-todo-floating-picker due-date">
                      <div className="modern-todo-mini-calendar">
                        <div className="modern-todo-mini-calendar-header">
                          <strong>{formatMonthHeading(calendarMonth)}</strong>
                          <div>
                            <button type="button" onClick={() => setCalendarMonth(shiftMonth(calendarMonth, -1))}>
                              ‹
                            </button>
                            <button type="button" onClick={() => setCalendarMonth(shiftMonth(calendarMonth, 1))}>
                              ›
                            </button>
                          </div>
                        </div>
                        <div className="modern-todo-mini-weekdays">
                          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                            <span key={day}>{day}</span>
                          ))}
                        </div>
                        <div className="modern-todo-mini-grid">
                          {dueCalendar.map((day) => (
                            <button
                              key={day.iso}
                              type="button"
                              className={`${day.isCurrentMonth ? '' : 'muted'} ${draftValues.dueDate === day.iso ? 'selected' : ''}`}
                              onClick={() => setDraftValues((current) => ({ ...current, dueDate: day.iso }))}
                            >
                              {day.dayNumber}
                            </button>
                          ))}
                        </div>
                        <div className="modern-todo-edit-actions">
                          <button type="button" onClick={() => saveField('dueDate')}>
                            저장
                          </button>
                          <button type="button" onClick={closeEditor}>
                            취소
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </section>

                <section>
                  <div className="modern-todo-detail-row">
                    <span>반복</span>
                    <button type="button" className="modern-todo-detail-add" onClick={() => openEditor('repeat')}>
                      +
                    </button>
                  </div>
                  <strong>{selectedTask.repeat}</strong>
                  {editingField === 'repeat' ? (
                    <div className="modern-todo-floating-picker repeat">
                      <div className="modern-todo-repeat-picker">
                        <div className="modern-todo-repeat-grid">
                          {WEEKDAY_OPTIONS.map((day) => (
                            <button
                              key={day}
                              type="button"
                              className={draftValues.repeatDays.includes(day) ? 'active' : ''}
                              onClick={() =>
                                setDraftValues((current) => ({
                                  ...current,
                                  repeatDays: current.repeatDays.includes(day)
                                    ? current.repeatDays.filter((item) => item !== day)
                                    : [...current.repeatDays, day],
                                }))
                              }
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                        <div className="modern-todo-edit-actions">
                          <button type="button" onClick={() => saveField('repeat')}>
                            저장
                          </button>
                          <button type="button" onClick={closeEditor}>
                            취소
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </section>

                <section>
                  <div className="modern-todo-detail-row">
                    <span>카테고리</span>
                    <button type="button" className="modern-todo-detail-add" onClick={() => openEditor('categories')}>
                      +
                    </button>
                  </div>
                  {editingField === 'categories' ? (
                    <div className="modern-todo-edit-block">
                      <input
                        type="text"
                        value={draftValues.categoryA}
                        onChange={(event) =>
                          setDraftValues((current) => ({ ...current, categoryA: event.target.value }))
                        }
                        placeholder="첫 번째 카테고리"
                      />
                      <input
                        type="text"
                        value={draftValues.categoryB}
                        onChange={(event) =>
                          setDraftValues((current) => ({ ...current, categoryB: event.target.value }))
                        }
                        placeholder="두 번째 카테고리"
                      />
                      <div className="modern-todo-edit-actions">
                        <button type="button" onClick={() => saveField('categories')}>
                          저장
                        </button>
                        <button type="button" onClick={closeEditor}>
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="modern-todo-tags">
                      <em>{selectedTask.categoryA}</em>
                      <em className="warm">{selectedTask.categoryB}</em>
                    </div>
                  )}
                </section>

                <section>
                  <div className="modern-todo-detail-row">
                    <span>메모</span>
                    <button type="button" className="modern-todo-detail-add" onClick={() => openEditor('note')}>
                      +
                    </button>
                  </div>
                  {editingField === 'note' ? (
                    <div className="modern-todo-edit-block">
                      <textarea
                        value={draftValues.note}
                        onChange={(event) =>
                          setDraftValues((current) => ({ ...current, note: event.target.value }))
                        }
                        rows={4}
                      />
                      <div className="modern-todo-edit-actions">
                        <button type="button" onClick={() => saveField('note')}>
                          저장
                        </button>
                        <button type="button" onClick={closeEditor}>
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>{selectedTask.note}</p>
                  )}
                </section>
              </div>
            </>
          ) : (
            <div className="modern-todo-detail-empty">작업을 선택하면 세부 정보를 볼 수 있습니다.</div>
          )}
        </aside>
      </div>

      {coachVisible ? (
        <div className="coach-overlay" role="presentation">
          <div className={`coach-bubble ${currentCoachStep.bubbleClass}`}>
            <span className="coach-step-count">
              {coachStepIndex + 1} / {COACH_STEPS.length}
            </span>
            <strong>{currentCoachStep.title}</strong>
            <p>{currentCoachStep.body}</p>
            <div className="coach-actions">
              <button
                type="button"
                onClick={() => setCoachVisible(false)}
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => setCoachStepIndex((current) => Math.max(0, current - 1))}
                disabled={coachStepIndex === 0}
              >
                이전
              </button>
              <button
                type="button"
                onClick={() => {
                  if (coachStepIndex === COACH_STEPS.length - 1) {
                    setCoachVisible(false)
                    return
                  }

                  setCoachStepIndex((current) => current + 1)
                }}
              >
                {coachStepIndex === COACH_STEPS.length - 1 ? '완료' : '다음'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function translatePriority(priority) {
  if (priority === 'High') {
    return '높음'
  }
  if (priority === 'Low') {
    return '낮음'
  }
  return '보통'
}

function getFilteredTasks(tasks, activeView) {
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

function getDefaultDraft() {
  return {
    dueDate: getTodayIso(),
    reminderDate: getTodayIso(),
    reminderTime: '09:00',
    durationMinutes: 30,
    repeat: '반복 없음',
    repeatDays: [],
    categoryA: '',
    categoryB: '',
    note: '',
  }
}

function getEmptyFallback(field) {
  if (field === 'repeat') {
    return '반복 없음'
  }
  if (field === 'note') {
    return '메모가 없습니다.'
  }
  return ''
}

function formatRepeatLabel(repeatDays) {
  if (!repeatDays.length) {
    return '반복 없음'
  }

  return `매주 ${repeatDays.join(', ')}`
}

function formatDueDate(isoDate, completed) {
  if (completed) {
    return '완료됨'
  }
  if (!isoDate) {
    return '기한 미정'
  }
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(`${isoDate}T00:00:00`))
}

function formatReminderSummary(task) {
  if (!task.reminderDate || !task.reminderTime) {
    return '알림 없음'
  }

  return `${formatDateBadge(task.reminderDate)} ${formatTime(task.reminderTime)}`
}

function formatDateBadge(isoDate) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(`${isoDate}T00:00:00`))
}

function formatMonthHeading(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
  }).format(date)
}

function formatTime(time24) {
  if (!time24) {
    return ''
  }
  const [hourText, minuteText] = time24.split(':')
  let hour = Number(hourText)
  const minute = Number(minuteText)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${hour}:${String(minute).padStart(2, '0')} ${suffix}`
}

function formatTimeRange(time24, durationMinutes) {
  if (!time24) {
    return ''
  }
  const [hourText, minuteText] = time24.split(':')
  const totalMinutes = Number(hourText) * 60 + Number(minuteText) + durationMinutes
  const endHour = Math.floor((totalMinutes % (24 * 60)) / 60)
  const endMinute = totalMinutes % 60
  return `→ ${formatTime(`${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`)}`
}

function buildMonthGrid(isoDate) {
  const baseDate = new Date(`${isoDate}T00:00:00`)
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 35 }, (_, index) => {
    const cellDate = new Date(startDate)
    cellDate.setDate(startDate.getDate() + index)
    return {
      iso: toIsoDate(cellDate),
      dayNumber: cellDate.getDate(),
      isCurrentMonth: cellDate.getMonth() === month,
    }
  })
}

function shiftMonth(isoDate, amount) {
  const date = new Date(`${isoDate}T00:00:00`)
  return toIsoDate(new Date(date.getFullYear(), date.getMonth() + amount, 1))
}

function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getTodayIso() {
  return toIsoDate(new Date())
}

export default ModernTodoWindow
