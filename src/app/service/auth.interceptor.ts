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
          console.error('[Interceptor] Non autorisé - Token expiré ou invalide');
          break;
        case 403:
          console.error('[Interceptor] Accès interdit - Permissions insuffisantes');
          break;
        case 404:
          console.error('[Interceptor] Ressource non trouvée');
          break;
        case 409:
          console.error('[Interceptor] Conflit - Données déjà existantes');
          break;
        default:
          console.error('[Interceptor] Erreur inconnue');
      }
    }

    console.error('[Interceptor] Détails de l\'erreur:', errorMessage);
    return throwError(() => error);
  };

  console.log('[Interceptor] Interception de la requête:', req.url);

  if (isSupabaseAuthRequest(req.url)) {
    console.log('[Interceptor] Requête d’authentification détectée (pas d’Authorization ajouté)');
    return next(req).pipe(catchError(handleError));
  }

  if (isSupabaseRequest(req.url)) {
    console.log('[Interceptor] Requête Supabase protégée ✅');

    return from(supabase.auth.getSession()).pipe(
      switchMap(({ data: { session }, error }) => {
        if (error) {
          console.error('[Interceptor] Erreur lors de la récupération de la session:', error);
        } else {
          console.log('[Interceptor] Session récupérée:', session);
        }

        const headers: any = {
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        };

        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
          console.log('[Interceptor] Utilisation du token de session');
        } else {
          headers['Authorization'] = `Bearer ${supabaseKey}`;
          console.log('[Interceptor] Utilisation de la clé API publique');
        }

        const modifiedRequest = req.clone({
          setHeaders: headers
        });

        console.log('[Interceptor] Requête modifiée avec headers:', modifiedRequest.headers);

        return next(modifiedRequest);
      }),
      catchError(handleError)
    );
  }

  console.log('[Interceptor] Requête classique (hors Supabase)');
  return next(req).pipe(catchError(handleError));
};
