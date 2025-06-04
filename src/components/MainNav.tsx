'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Book, ChefHat, Home, Search, User } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="bg-white/20 rounded-full px-3 space-x-1 shadow-inner">
        <NavigationMenuItem>
          <Link href="/" passHref legacyBehavior>
            <NavigationMenuLink
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all',
                isActive('/') 
                  ? 'text-orange-600 bg-white rounded-full shadow-md' 
                  : 'text-white hover:text-white hover:bg-white/20 hover:rounded-full'
              )}
            >
              <Home className="h-4 w-4" />
              Accueil
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={cn(
              isActive('/recipes') && !isActive('/recipes/new') && !isActive('/recipes/search') && !isActive('/recipes/all')
                ? 'text-orange-600 bg-white rounded-full shadow-md' 
                : 'text-white hover:text-white hover:bg-white/20 data-[state=open]:bg-white data-[state=open]:text-orange-600',
              "data-[state=open]:rounded-full"
            )}
          >
            <Book className="h-4 w-4 mr-2" />
            Recettes
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[220px] bg-white border-orange-200 shadow-xl rounded-xl">
              <li>
                <Link href="/recipes/all" passHref legacyBehavior>
                  <NavigationMenuLink
                    className={cn(
                      'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
                      isActive('/recipes/all')
                        ? 'bg-orange-50 text-orange-600' 
                        : 'hover:bg-orange-50 hover:text-orange-600'
                    )}
                  >
                    <div className="font-medium flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      Toutes les Recettes
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                      Recettes générées par la communauté
                    </p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link href="/recipes" passHref legacyBehavior>
                  <NavigationMenuLink
                    className={cn(
                      'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
                      isActive('/recipes') && !isActive('/recipes/new') && !isActive('/recipes/search') && !isActive('/recipes/all')
                        ? 'bg-orange-50 text-orange-600' 
                        : 'hover:bg-orange-50 hover:text-orange-600'
                    )}
                  >
                    <div className="font-medium flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      Mes Recettes
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                      Recettes que vous avez générées
                    </p>
                  </NavigationMenuLink>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={cn(
              isActive('/recipes/new') || isActive('/recipes/search') 
                ? 'text-orange-600 bg-white rounded-full shadow-md' 
                : 'text-white hover:text-white hover:bg-white/20 data-[state=open]:bg-white data-[state=open]:text-orange-600',
              "data-[state=open]:rounded-full"
            )}
          >
            <ChefHat className="h-4 w-4 mr-2" />
            Créer & Découvrir
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[220px] bg-white border-orange-200 shadow-xl rounded-xl">
              <li>
                <Link href="/recipes/new" passHref legacyBehavior>
                  <NavigationMenuLink
                    className={cn(
                      'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
                      isActive('/recipes/new') 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'hover:bg-orange-50 hover:text-orange-600'
                    )}
                  >
                    <div className="font-medium flex items-center gap-2">
                      <ChefHat className="h-4 w-4" />
                      Générer une Recette
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                      Créer une nouvelle recette avec l'IA
                    </p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link href="/recipes/search" passHref legacyBehavior>
                  <NavigationMenuLink
                    className={cn(
                      'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
                      isActive('/recipes/search') 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'hover:bg-orange-50 hover:text-orange-600'
                    )}
                  >
                    <div className="font-medium flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Rechercher des Recettes
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                      Trouver des recettes par nom ou ingrédients
                    </p>
                  </NavigationMenuLink>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link href="/profile" passHref legacyBehavior>
            <NavigationMenuLink
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all',
                isActive('/profile') 
                  ? 'text-orange-600 bg-white rounded-full shadow-md' 
                  : 'text-white hover:text-white hover:bg-white/20 hover:rounded-full'
              )}
            >
              <User className="h-4 w-4" />
              Profil
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}