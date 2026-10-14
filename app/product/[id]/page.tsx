import { redirect } from 'next/navigation';

export default async function ProductAliasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cleanId = String(id || '').trim();

  // Validate slug against directory traversal / malicious redirect patterns
  if (!cleanId || !/^[a-zA-Z0-9_-]+$/.test(cleanId)) {
    redirect('/shop');
  }

  redirect(`/shop/${encodeURIComponent(cleanId)}`);
}
