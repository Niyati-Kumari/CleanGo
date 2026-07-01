export default function StepBar({ steps, current }) {
  const currentIdx = steps.findIndex((s) => s.key === current);

  return (
    <ol className="mb-8 flex flex-wrap gap-2">
      {steps.map((step, idx) => {
        const done = idx <= currentIdx;
        return (
          <li
            key={step.key}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              done ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
