export default function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="font-semibold text-amber-500">★ {rating.toFixed(1)}</span>
      {count != null && <span className="text-slate-400">({count})</span>}
    </div>
  );
}
