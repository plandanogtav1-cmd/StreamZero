import Link from 'next/link';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      {icon && (
        <div className="mb-6 text-primary/40 text-6xl">
          {icon}
        </div>
      )}
      <h2 className="text-2xl font-bold text-textPrimary mb-3">{title}</h2>
      <p className="text-textMuted max-w-md mb-8">{description}</p>
      {action && (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
