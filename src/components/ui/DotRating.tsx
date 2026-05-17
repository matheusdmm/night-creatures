interface Props {
  value: number;
  max?: number;
  onChange?: (v: number) => void;
  size?: 'sm' | 'md';
  color?: 'blood' | 'gold';
}

export default function DotRating({
  value,
  max = 5,
  onChange,
  size = 'md',
  color = 'blood',
}: Props) {
  const dim = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const gap = size === 'sm' ? 'gap-1' : 'gap-1.5';

  const filledClass =
    color === 'gold'
      ? 'bg-gold border-gold'
      : 'bg-blood-bright border-blood-bright';
  const emptyClass = 'bg-transparent border-parchment-dim/50';

  function handleClick(i: number) {
    if (!onChange) return;
    onChange(value === i + 1 ? 0 : i + 1);
  }

  return (
    <div className={`flex ${gap} items-center`}>
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => handleClick(i)}
          disabled={!onChange}
          className={`
            ${dim} rounded-full border transition-all duration-150
            ${i < value ? filledClass : emptyClass}
            ${onChange ? 'cursor-pointer hover:border-blood-bright hover:scale-110' : 'cursor-default'}
          `}
          aria-label={`Set rating to ${i + 1}`}
        />
      ))}
    </div>
  );
}
