import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Operator Dossier & Profile',
  description: 'Your verified REBELIVE operator profile, order history, addresses, and member pass.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
