export function LogoMark({ name, logo }: { name: string; logo: string | null }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span className="logo-mark" aria-hidden="true">
      {logo ? <span className="logo-image" style={{ backgroundImage: `url("${logo}")` }} /> : initials}
    </span>
  );
}
