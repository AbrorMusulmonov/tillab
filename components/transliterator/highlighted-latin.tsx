const MARK = /([öÖğĞşŞçÇ]+)/;
const MARK_START = /^[öÖğĞşŞçÇ]/;

export function HighlightedLatin({ text, className }: { text: string; className?: string }) {
  const parts = text.split(MARK);
  return (
    <span className={className}>
      {parts.map((part, index) =>
        MARK_START.test(part) ? (
          <mark key={`${part}-${index}`} className="rounded-[3px] bg-teal-100 px-0.5 text-primary">
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </span>
  );
}
