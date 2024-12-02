export interface IUser {
    id?: number;
    email: string;
    username: string;
    password?: string; // Valfritt för Google-användare
    role?: string;
    googleId?: string;
    githubId?: string;
  }