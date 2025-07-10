'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChefHat, Search, BookOpen, Cookie, Coffee, Utensils, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import './animations.css';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check session status
    if (status === 'authenticated' && session) {
      router.push('/recipes');
    } else if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status, session, router]);
  
  if (status === 'loading' || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-60 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Food icons */}
        <div className="absolute top-40 left-20 animate-float">
          <Cookie className="w-16 h-16 text-amber-400 opacity-50" />
        </div>
        <div className="absolute top-80 right-40 animate-float-delayed">
          <Coffee className="w-10 h-10 text-orange-400 opacity-50" />
        </div>
        <div className="absolute bottom-60 left-1/4 animate-float">
          <Utensils className="w-12 h-12 text-yellow-500 opacity-40" />
        </div>
      </div>
      
      <div className="container mx-auto py-20 px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl mb-8">
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Cuisinez avec l'IA
          </h1>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed">
            Transformez vos ingrédients en recettes délicieuses avec analyses nutritionnelles et recommandations personnalisées.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                <Sparkles className="h-5 w-5 mr-2" />
                Générer une recette
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-400">
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="backdrop-blur-sm bg-white/90 rounded-xl p-8 text-center shadow-xl border-0 ring-1 ring-orange-200 transform hover:-translate-y-1 transition-all hover:shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-orange-600">Recettes IA</h2>
            <p className="text-gray-700 leading-relaxed">
              Générez des recettes personnalisées basées sur vos ingrédients disponibles et vos préférences alimentaires.
            </p>
          </div>
          
          <div className="backdrop-blur-sm bg-white/90 rounded-xl p-8 text-center shadow-xl border-0 ring-1 ring-orange-200 transform hover:-translate-y-1 transition-all hover:shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-orange-600">Recherche & Découverte</h2>
            <p className="text-gray-700 leading-relaxed">
              Trouvez des recettes par nom, ingrédients ou type de plat pour explorer de nouvelles possibilités culinaires.
            </p>
          </div>
          
          <div className="backdrop-blur-sm bg-white/90 rounded-xl p-8 text-center shadow-xl border-0 ring-1 ring-orange-200 transform hover:-translate-y-1 transition-all hover:shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-orange-600">Analyse Nutritionnelle</h2>
            <p className="text-gray-700 leading-relaxed">
              Obtenez des informations nutritionnelles détaillées pour chaque recette, incluant calories, protéines, glucides et plus.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
