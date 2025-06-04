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
  
  // Apply the gradient background to all recipe pages
  // Using includes('/recipes') would apply to all pages under recipes
  const isMainPage = true;
  
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <div className="flex-1 bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-x-hidden">
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