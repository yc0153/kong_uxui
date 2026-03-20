function TodoManagerWindow({
  title,
  state,
  variant = 'good',
  onInputChange,
  onPriorityChange,
  onAddTask,
  onToggleTask,
  onDeleteRequest,
}) {
  const progress = state.tasks.length
    ? Math.round((state.tasks.filter((task) => task.completed).length / state.tasks.length) * 100)
    : 0

  return (
    <div className={`todo-window ${variant === 'bad' ? 'bad' : 'good'}`}>
      <section className="todo-input-area">
        <div className="todo-heading">
          <h1>{title}</h1>
          <p>
            {variant === 'bad'
              ? '기능은 같지만 일부러 어색하고 불편하게 배치된 나쁜 UX 예시입니다.'
              : '할 일을 빠르게 추가하고, 진행률을 분명하게 확인하며, 우선순위를 한눈에 파악할 수 있습니다.'}
          </p>
        </div>

        <div className="todo-composer">
          <input
            type="text"
            value={state.input}
            placeholder="할 일을 입력하세요..."
            onChange={(event) => onInputChange(event.target.value)}
          />

          <fieldset className="todo-priority-group">
            <legend>우선순위</legend>
            {[
              ['High', '높음'],
              ['Medium', '보통'],
              ['Low', '낮음'],
            ].map(([priority, label]) => (
              <label key={priority}>
                <input
                  type="radio"
                  name={`${variant}-priority`}
                  value={priority}
                  checked={state.priority === priority}
                  onChange={(event) => onPriorityChange(event.target.value)}
                />
                {label}
              </label>
            ))}
          </fieldset>

          <button type="button" className="todo-add-button" onClick={onAddTask}>
            추가
          </button>
        </div>
      </section>

      <section className="todo-progress-area">
        <div className="todo-progress-head">
          <strong>진행률</strong>
          <span>{progress}%</span>
        </div>
        <div className="todo-progress-track" aria-label="Todo completion progress">
          <div className="todo-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="todo-list-area">
        {state.tasks.length === 0 ? (
          <p className="todo-empty">아직 할 일이 없습니다. 위 입력창에서 첫 작업을 추가해 주세요.</p>
        ) : (
          <ul className="todo-list">
            {state.tasks.map((task) => (
              <li key={task.id} className={`todo-item ${task.completed ? 'completed' : ''}`}>
                <label className="todo-check">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(task.id)}
                  />
                </label>

                <span className="todo-text">{task.text}</span>

                <span className={`todo-priority ${task.priority.toLowerCase()}`}>{task.priority}</span>

                <button
                  type="button"
                  className="todo-delete-button"
                  onClick={() => onDeleteRequest(task.id)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default TodoManagerWindow
