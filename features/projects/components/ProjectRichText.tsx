export function ProjectRichText({
  text,
  emphasis = [],
}: {
  text: string;
  emphasis?: string[];
}) {
  if (emphasis.length === 0) return text;

  const escaped = emphasis.map((value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "g"));

  return parts.map((part, index) =>
    emphasis.includes(part) ? (
      <strong key={`${part}-${index}`}>{part}</strong>
    ) : (
      part
    ),
  );
}
