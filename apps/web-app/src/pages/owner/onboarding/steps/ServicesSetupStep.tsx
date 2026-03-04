import { Badge, Button, FormField, SectionCard, Select, Textarea } from '@slotra/ui';
import type { ServiceRecord } from '@/domain/service/types';

interface ServicesSetupStepProps {
  services: ServiceRecord[];
  errors: Record<string, string>;
  onAddService: () => void;
  onRemoveService: (serviceId: string) => void;
  onServiceChange: <K extends keyof ServiceRecord>(serviceId: string, field: K, value: ServiceRecord[K]) => void;
}

export function ServicesSetupStep({
  services,
  errors,
  onAddService,
  onRemoveService,
  onServiceChange,
}: ServicesSetupStepProps) {
  return (
    <SectionCard
      title="Service setup"
      description="Seed the booking catalog with your core services. You can refine pricing and visibility later in Services."
      actions={<Button type="button" variant="outline" onClick={onAddService}>Add service</Button>}
    >
      {errors.services && <p className="onboarding-error-banner">{errors.services}</p>}

      <div className="owner-settings-stack">
        {services.map((service) => (
          <div key={service.id} className="onboarding-editor-card">
            <div className="onboarding-editor-card__header">
              <div>
                <p className="onboarding-editor-card__title">{service.name || 'New service'}</p>
                <p className="onboarding-editor-card__meta">Used for the future public booking catalog.</p>
              </div>
              <div className="onboarding-editor-card__actions">
                <Badge variant={service.visibility === 'Public' ? 'success' : 'default'}>
                  {service.visibility}
                </Badge>
                <Button type="button" variant="ghost" onClick={() => onRemoveService(service.id)}>
                  Remove
                </Button>
              </div>
            </div>

            <div className="owner-form-grid">
              <FormField label="Service name" htmlFor={`service-name-${service.id}`} error={errors[`service-name-${service.id}`]}>
                <input
                  id={`service-name-${service.id}`}
                  className="input"
                  value={service.name}
                  onChange={(event) => onServiceChange(service.id, 'name', event.target.value)}
                />
              </FormField>

              <FormField label="Category" htmlFor={`service-category-${service.id}`}>
                <input
                  id={`service-category-${service.id}`}
                  className="input"
                  value={service.category}
                  onChange={(event) => onServiceChange(service.id, 'category', event.target.value)}
                />
              </FormField>

              <FormField label="Duration (minutes)" htmlFor={`service-duration-${service.id}`} error={errors[`service-duration-${service.id}`]}>
                <input
                  id={`service-duration-${service.id}`}
                  className="input"
                  type="number"
                  min="5"
                  step="5"
                  value={service.durationMinutes}
                  onChange={(event) => onServiceChange(service.id, 'durationMinutes', Number(event.target.value))}
                />
              </FormField>

              <FormField label="Price" htmlFor={`service-price-${service.id}`} error={errors[`service-price-${service.id}`]}>
                <input
                  id={`service-price-${service.id}`}
                  className="input"
                  type="number"
                  min="0"
                  step="50"
                  value={service.price}
                  onChange={(event) => onServiceChange(service.id, 'price', Number(event.target.value))}
                />
              </FormField>

              <Select
                id={`service-visibility-${service.id}`}
                label="Visibility"
                value={service.visibility}
                onChange={(event) => onServiceChange(service.id, 'visibility', event.target.value as ServiceRecord['visibility'])}
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </Select>

              <Select
                id={`service-status-${service.id}`}
                label="Status"
                value={service.status}
                onChange={(event) => onServiceChange(service.id, 'status', event.target.value as ServiceRecord['status'])}
              >
                <option value="Active">Active</option>
                <option value="Hidden">Hidden</option>
                <option value="Archived">Archived</option>
              </Select>
            </div>

            <Textarea
              id={`service-description-${service.id}`}
              label="Description"
              rows={3}
              value={service.description}
              onChange={(event) => onServiceChange(service.id, 'description', event.target.value)}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
