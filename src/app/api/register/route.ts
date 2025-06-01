// app/api/register/route.ts
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { AirtableService } from '@/lib/airtable';
import { ValidationUtils, ValidationError } from '@/lib/validation';
import { RegisterRequest, RegisterResponse, ApiError } from '@/types/auth';

export async function POST(request: NextRequest): Promise<NextResponse<RegisterResponse | ApiError>> {
  try {
    const body: RegisterRequest = await request.json();
    ValidationUtils.validateRegistrationData(body);
    const { name, email, password } = body;

    const userExists = await AirtableService.checkUserExists(email);
    if (userExists) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const userData = {
      Name: name,
      Email: email,
      Password: hashedPassword,
      CreatedAt: new Date().toISOString(),
    };

    const result = await AirtableService.createUser(userData);
    
    return NextResponse.json(
      { 
        message: 'Compte créé avec succès',
        user: {
          id: result.id,
          name: result.fields.Name,
          email: result.fields.Email,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      if (error.message === 'Database query failed') {
        return NextResponse.json(
          { error: 'Erreur de base de données' },
          { status: 500 }
        );
      }
      if (error.message === 'User creation failed') {
        return NextResponse.json(
          { error: 'Erreur lors de la création du compte' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}