const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  suspended: 'bg-slate-200 text-slate-700',
};

const STATUS_LABELS = {
  pending: 'Pending admin approval',
  approved: 'Approved — live on app',
  rejected: 'Application rejected',
  suspended: 'Account suspended',
};

export default function ApprovalBanner({ status }) {
  if (!status || status === 'approved') return null;

  return (
    <div className={`mb-6 rounded-2xl px-4 py-3 text-sm font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status] || status}
      {status === 'pending' && (
        <p className="mt-1 font-normal opacity-90">
          You can set up prices now. Orders can be accepted once admin approves your shop.
        </p>
      )}
    </div>
  );
}
