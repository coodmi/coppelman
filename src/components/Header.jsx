export default function Header({ onMenuClick }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger" aria-label="Menu" onClick={onMenuClick}>
          <span />
          <span />
        </button>
      </div>
      <div className="header-title">Quick Search</div>
    </header>
  )
}
