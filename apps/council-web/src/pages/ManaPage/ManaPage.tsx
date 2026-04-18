import { Page, PageHeader } from '@/components/Page';

export const ManaPage = () => {
  return (
    <Page
      header={
        <PageHeader title="Mana" breadcrumbs={[{ label: 'Home', to: '/' }]} />
      }
    />
  );
};
