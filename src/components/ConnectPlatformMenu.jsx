export default function ConnectPlatformButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      className="btn btn--primary connect-platform-menu__trigger"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="connect-platform-menu__plus" aria-hidden="true">+</span>
      Connect platform
    </button>
  );
}
