export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AirtableUser {
  id: string;
  fields: {
    Name: string;
    Email: string;
    Password: string;
    CreatedAt: string;
  };
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
}

export interface ApiError {
  error: string;
}

export interface RegisterResponse {
  message: string;
  user: UserResponse;
}