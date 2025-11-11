import { Container, Typography } from '@/components/ui';

export default function Loading() {
  return (
    <Container className="py-10 animate-pulse">
      <Typography variant="h1">Loading seats...</Typography>

      <div className="grid grid-cols-10 gap-2 mt-6">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-md" />
        ))}
      </div>
    </Container>
  );
}
