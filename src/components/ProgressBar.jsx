function ProgressBar({ value }) {
  return (
    <div className="progress-bar" aria-label="Completion progress">
      <div className="progress-bar-fill" style={{ width: `${value}%` }} />
    </div>
  )
}

export default ProgressBar
