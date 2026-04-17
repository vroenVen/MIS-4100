import { Logo } from './Logo';

interface PageHeaderProps {
  title?: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="absolute top-4 right-4">
      <Logo size="small" />
    </div>
  );
}
