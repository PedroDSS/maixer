'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/MainNav';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Menu, User, ChefHat } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gradient-to-r from-orange-600 to-amber-500 relative">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-300 rounded-full mix-blend-overlay filter blur-3xl opacity-30"></div>
        <div className="absolute top-10 right-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
      </div>
      <div className="container flex h-20 items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-2xl text-white flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <ChefHat className="w-5 h-5 text-orange-600" />
            </div>
            <span className="tracking-wide group-hover:tracking-wider transition-all">Maixer</span>
          </Link>
          {session && <MainNav />}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <p className="text-sm hidden md:block text-white">
                Bonjour, <span className="font-medium">{session.user?.name || session.user?.email}</span>
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/20">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-orange-200 shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link href="/" className="text-gray-700 hover:text-orange-600">Accueil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/recipes" className="text-gray-700 hover:text-orange-600">Mes Recettes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/recipes/new" className="text-gray-700 hover:text-orange-600">Générer une Recette</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/recipes/search" className="text-gray-700 hover:text-orange-600">Rechercher</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="text-gray-700 hover:text-orange-600">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" className="rounded-full bg-white/20 hover:bg-white/30 border-0 text-white">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-orange-200 shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="text-gray-700 hover:text-orange-600">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/20 border-white/30">
                  Se connecter
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-white text-orange-600 hover:bg-white/90 transition-all shadow-lg hover:shadow-xl">
                  S'inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-amber-300 to-orange-300 opacity-50"></div>
    </header>
  );
}