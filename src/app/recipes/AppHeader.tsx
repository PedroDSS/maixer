'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Menu, User, ChefHat, Book, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and navigation - left side */}
          <div className="flex items-center gap-2">
            <Link href="/recipes" className="font-bold text-xl flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow group-hover:shadow-md transition-all">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Maixer</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-6 lg:ml-8">
              <ul className="flex space-x-2 items-center">
                <li>
                  <Link 
                    href="/recipes" 
                    className={cn(
                      'inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive('/recipes') && !isActive('/recipes/new') && !isActive('/recipes/search') 
                        ? 'text-orange-600 bg-orange-50' 
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                    )}
                  >
                    <Book className="h-4 w-4" />
                    <span>Mes Recettes</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/recipes/new" 
                    className={cn(
                      'inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive('/recipes/new') 
                        ? 'text-orange-600 bg-orange-50' 
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                    )}
                  >
                    <ChefHat className="h-4 w-4" />
                    <span>Générer</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/recipes/search" 
                    className={cn(
                      'inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive('/recipes/search') 
                        ? 'text-orange-600 bg-orange-50' 
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                    )}
                  >
                    <Search className="h-4 w-4" />
                    <span>Rechercher</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* User profile - right side */}
          <div className="flex items-center gap-3">
            {session && (
              <>
                <p className="text-sm hidden lg:block text-gray-600 mr-2">
                  Bonjour, <span className="font-medium text-orange-600">{session.user?.name || session.user?.email}</span>
                </p>
                
                {/* Mobile menu dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden text-gray-600 hover:text-orange-600 hover:bg-orange-50">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-orange-100 shadow-md w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/recipes" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 flex items-center">
                        <Book className="h-4 w-4 mr-2" />
                        Mes Recettes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/recipes/new" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 flex items-center">
                        <ChefHat className="h-4 w-4 mr-2" />
                        Générer une Recette
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/recipes/search" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 flex items-center">
                        <Search className="h-4 w-4 mr-2" />
                        Rechercher
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })} className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* User profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50 h-9 pl-2.5 pr-3.5 gap-1.5">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline text-xs font-medium">Profil</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-orange-100 shadow-md w-44">
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })} className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}