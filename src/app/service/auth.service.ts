import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string | null = null;

  login() {
    // Appel à l'API pour obtenir un token d'authentification
    // Le token est stocké dans la propriété `token`
  }
}
