import type { HTMLAttributes, ReactNode } from 'react';
import { Card } from './Card';

interface SectionCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    title?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    contentClassName?: string;
    padded?: boolean;
}

export function SectionCard({
    title,
    description,
    actions,
    contentClassName = '',
    className = '',
    padded = true,
    children,
    ...rest
}: SectionCardProps) {
    return (
        <Card className={['section-card', className].filter(Boolean).join(' ')} padded={padded} {...rest}>
            {(title || description || actions) && (
                <div className="section-card__header">
                    <div className="section-card__heading">
                        {title && <h2 className="section-card__title">{title}</h2>}
                        {description && <p className="section-card__description">{description}</p>}
                    </div>
                    {actions && <div className="section-card__actions">{actions}</div>}
                </div>
            )}
            <div className={['section-card__content', contentClassName].filter(Boolean).join(' ')}>
                {children}
            </div>
        </Card>
    );
}
