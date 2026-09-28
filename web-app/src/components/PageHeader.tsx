import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function PageHeader({ title, description, icon, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-brand-600 dark:text-brand-400">
            {icon}
          </div>
        )}
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-text-light dark:text-text-dark">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-text-muted-light dark:text-text-muted-dark">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
