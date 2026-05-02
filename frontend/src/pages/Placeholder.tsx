export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 mx-auto w-full max-w-[1440px]">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
        <div className="p-12 text-center text-slate-400 font-medium h-[400px] flex items-center justify-center">
          Work in progress...
        </div>
      </div>
    </div>
  );
}
