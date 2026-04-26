import type { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Portal branding */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <p className="font-bold text-slate-800 leading-tight">Sentosa Trade Portal</p>
              <p className="text-xs text-slate-400">Sentosa Development Corporation</p>
            </div>
          </div>
          {children}
        </div>
      </div>
      <footer className="text-center py-4 text-xs text-slate-400">
        © {new Date().getFullYear()} Sentosa Development Corporation. Authorised agent access only.
      </footer>
    </div>
  );
}
