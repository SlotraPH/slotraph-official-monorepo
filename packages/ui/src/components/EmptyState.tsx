import type { HTMLAttributes, ReactNode } from 'react';

interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    align?: 'left' | 'center';
}

export function EmptyState({
    icon,
    title,
    description,
    actions,
    align = 'center',
    className = '',
    children,
    ...rest
}: EmptyStateProps) {
    return (
        <div
            className={[
                'empty-state',
                `empty-state--${align}`,
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...rest}
        >
            {icon && <div className="empty-state__icon">{icon}</div>}
            <div className="empty-state__body">
                <h2 className="empty-state__title">{title}</h2>
                {description && <p className="empty-state__description">{description}</p>}
            </div>
            {actions && <div className="empty-state__actions">{actions}</div>}
            {children}
        </div>
    );
}
