import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <>
      {/* Black background for bottom overscroll */}
      <div className="fixed inset-x-0 bottom-0 h-screen bg-black -z-10" />

      <div className="min-h-screen flex flex-col relative z-0">
        <Header />
        <main className="flex-grow bg-white">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};