import { SectionCard } from '@slotra/ui';

interface IntegrationRoadmapProps {
  items: string[];
}

export function IntegrationRoadmap({ items }: IntegrationRoadmapProps) {
  return (
    <SectionCard title="Roadmap, not MVP" description="Deferred integrations called out explicitly so the UI does not over-promise.">
      <ul className="owner-simple-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </SectionCard>
  );
}
