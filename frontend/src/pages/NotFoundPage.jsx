import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[var(--color-bg)]">
      <h1 className="text-6xl font-bold text-[var(--color-primary)] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-2">Page Not Found</h2>
      <p className="text-[var(--color-text-muted)] mb-8 max-w-md text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
