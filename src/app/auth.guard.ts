import { inject } from "@angular/core";
import { Router } from "@angular/router";
import {LoginService} from './service/login/login-service';
import {StreaksService} from './service/streaks/streaks-service';
import {SessionService} from './service/session-service/session-service';

export const AuthGuard = async () => {
  const auth = inject(LoginService);
  const router = inject(Router);
  const streaksService = inject(StreaksService);
  const sessionService = inject(SessionService);

  if (!auth.isAuthenticated()) {
    router.navigate(['']);
    return false;
  }

  try {
    const user = await sessionService.getCurrentUser();
    if (user) {
      const streak = await streaksService.userStreak$.value;
      if (!streak) {
        await streaksService.initializeStreak(user.id);
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du streak:', error);
  }

  return true;

}
