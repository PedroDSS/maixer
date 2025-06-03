'use client';

import { usePathname } from 'next/navigation';
import { ChefHat, Utensils, Cookie, Coffee } from 'lucide-react';
import '../animations.css';
import { AppHeader } from './AppHeader';

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Only apply the gradient background to the main recipes pages
  const isMainPage = pathname === '/recipes' || pathname === '/recipes/new' || pathname === '/recipes/search';
  
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <div className={`flex-1 ${isMainPage ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50' : 'bg-white'} overflow-x-hidden`}>
        {isMainPage && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/4 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            
            {/* Floating food icons */}
            <div className="absolute top-20 left-[10%] animate-float">
              <Cookie className="w-8 h-8 text-amber-400 opacity-60" />
            </div>
            <div className="absolute top-40 right-[10%] animate-float-delayed">
              <Coffee className="w-6 h-6 text-orange-400 opacity-60" />
            </div>
            <div className="absolute bottom-40 left-[20%] animate-pulse">
              <Utensils className="w-7 h-7 text-yellow-500 opacity-50" />
            </div>
          </div>
        )}
        
        <main className="relative z-10 min-h-[calc(100vh-64px)] flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}