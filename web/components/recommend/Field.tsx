export default function Field({ label, required, icon, children }: any) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        {icon} {label} {required && <span className="text-pink-500">*</span>}
      </label>
      {children}
    </div>
  );
}