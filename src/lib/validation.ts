// lib/validation.ts
import { RegisterRequest } from '@/types/auth';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  static validateRegistrationData(data: RegisterRequest): void {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      throw new ValidationError('Tous les champs sont requis');
    }

    if (!this.isValidEmail(email)) {
      throw new ValidationError('Format d\'email invalide');
    }

    if (!this.isValidPassword(password)) {
      throw new ValidationError('Le mot de passe doit contenir au moins 8 caractères');
    }
  }
}