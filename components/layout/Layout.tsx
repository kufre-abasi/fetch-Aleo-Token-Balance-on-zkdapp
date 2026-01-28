'use client';
import { ReactNode } from 'react';
 
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
 
  return (
    <div className="min-h-screen relative">
      <main className="pt-20 pb-8 px-4 lg:pl-20">
        <div className="max-w-lg mx-auto">{children}</div>
      </main>
    </div>
  );
};

export { Layout };
