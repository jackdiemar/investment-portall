export function LogoMark({ name, logo }: { name: string; logo: string | null }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span className="logo-mark">
      {logo ? <img className="logo-image" src={logo} alt={`${name} logo`} /> : <span aria-hidden="true">{initials}</span>}
    </span>
  );
}
