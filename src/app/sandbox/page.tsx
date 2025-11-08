'use client';
import { Input, Container, Button, Typography, Card } from '@/components/ui';

export default function SandboxPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col gap-6 items-center py-10">
      <h1 className="text-2xl font-semibold">Card Component Sandbox</h1>

      <Card>
        <p>This is a simple card with text content.</p>
      </Card>

      <Card className="bg-primary text-white">
        <p>This is a card using the primary color background.</p>
      </Card>

      <Card className="p-8 shadow-lg">
        <h2 className="text-lg font-medium">Custom padding and shadow</h2>
        <p>Cards can accept className for customization.</p>
      </Card>

      <Button onClick={() => console.log('click')} name="test">
        {' '}
        CLick me{' '}
      </Button>

      <Input />

      <Container>
        <Typography variant="h1">test</Typography>
      </Container>
    </main>
  );
}
