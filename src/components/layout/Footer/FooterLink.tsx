import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-block py-1 text-xs text-gray-300 transition-colors hover:text-red-500 md:text-sm"
    >
      {children}
    </Link>
  );
}
