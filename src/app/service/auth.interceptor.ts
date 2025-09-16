import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

export const supabaseInterceptor: HttpInterceptorFn = (req, next) => {
  const supabaseUrl = environment.supabaseUrl + '/rest/v1';
  const supabaseKey = environment.supabaseKey;

  const isSupabaseRequest = (url: string): boolean => {
    return url.startsWith(supabaseUrl) || url.includes(environment.supabaseUrl);
  };

  const isSupabaseAuthRequest = (url: string): boolean => {
    return url.includes('/auth/v1/token') || url.includes('/auth/v1/signup');
  };

  const handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur: ${error.status} - ${error.message}`;

      switch (error.status) {
        case 401:
          console.error('Token expiré ou invalide');
          break;
        case 403:
          console.error('Permissions insuffisantes');
          break;
        case 404:
          console.error(' Ressource non trouvée');
          break;
        case 409:
          console.error('Données déjà existantes');
          break;
        default:
          console.error(' Erreur inconnue');
      }
    }

    console.error(' Détails de l\'erreur:', errorMessage);
    return throwError(() => error);
  };

  if (isSupabaseAuthRequest(req.url)) {
    return next(req).pipe(catchError(handleError));
  }

  if (isSupabaseRequest(req.url)) {

    return from(supabase.auth.getSession()).pipe(
      switchMap(({ data: { session }, error }) => {
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error);
        }

        const headers: any = {
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        };

        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        } else {
          headers['Authorization'] = `Bearer ${supabaseKey}`;
        }

        const modifiedRequest = req.clone({
          setHeaders: headers
        });

        return next(modifiedRequest);
      }),
      catchError(handleError)
    );
  }

  return next(req).pipe(catchError(handleError));
};
