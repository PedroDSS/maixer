'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, Construction, ArrowLeft, Utensils, Cookie, Coffee } from 'lucide-react';
import '../animations.css';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="absolute top-20 left-10 animate-float">
          <Cookie className="w-8 h-8 text-amber-400 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <Coffee className="w-6 h-6 text-orange-400 opacity-60" />
        </div>
        <div className="absolute bottom-40 left-32 animate-float">
          <Utensils className="w-7 h-7 text-yellow-500 opacity-50" />
        </div>
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/90 shadow-2xl border-0 ring-1 ring-orange-200">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
            <Construction className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Fonctionnalité en développement
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Cette page est en cours de construction
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="text-center">
          <div className="mb-8">
            <p className="text-gray-700 mb-4">
              La réinitialisation de mot de passe n'est pas encore disponible.
            </p>
            <p className="text-gray-700 mb-4">
              Nous travaillons actuellement sur cette fonctionnalité et elle sera disponible prochainement.
            </p>
            <p className="text-gray-700">
              Si vous voulez réinitialiser votre mot de passe, veuillez contactez nos grand chefs.
            </p>
          </div>

          <Link href="/login">
            <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}