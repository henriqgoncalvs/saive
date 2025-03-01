import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <div className="backdrop-blur-lg bg-black/40 border border-white/10 rounded-lg p-8 max-w-md text-center space-y-6 animate-fadeIn">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
          <span className="text-3xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gradient">Page Not Found</h1>
        <p className="text-muted-foreground">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="pt-4">
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
