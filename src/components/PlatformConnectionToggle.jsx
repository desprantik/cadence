export default function PlatformConnectionToggle({
  checked,
  disabled,
  onChange,
  label,
}) {
  return (
    <label className="platform-toggle">
      <input
        type="checkbox"
        className="platform-toggle__input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
      />
      <span className="platform-toggle__track" aria-hidden="true">
        <span className="platform-toggle__thumb" />
      </span>
    </label>
  );
}
