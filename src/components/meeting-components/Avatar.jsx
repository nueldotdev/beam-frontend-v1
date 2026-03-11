import { getInitials, nameToHue } from "../../utils/meetingHelpers";
export function Avatar({ name = "User", size = "md" }) {
  const initials = getInitials(name);
  const hue = nameToHue(name);

  return (
    <div
      className={`avatar avatar--${size}`}
      aria-label={name}
      style={{
        "--avatar-hue": hue,
      }}
    >
      {initials}
    </div>
  );
}
