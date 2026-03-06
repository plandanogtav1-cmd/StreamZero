import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { WatchlistClient } from './WatchlistClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Watchlist' };

export default async function WatchlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: items } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <WatchlistClient initialItems={items || []} />;
}
