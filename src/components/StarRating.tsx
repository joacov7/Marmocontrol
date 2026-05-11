export default function StarRating({ value, count }: { value: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(value))}{"☆".repeat(5 - Math.round(value))}</span>
      <span className="text-slate-600 text-sm font-semibold">{value.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-slate-400 text-xs">({count} trabajos)</span>
      )}
    </div>
  );
}
