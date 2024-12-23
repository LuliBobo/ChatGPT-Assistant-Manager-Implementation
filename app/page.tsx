import AssistantManager from '@/components/AssistantManager';

export default function Home() {
  return (
    <main className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">GPT Assistant Manager</h1>
      <AssistantManager />
    </main>
  );
}