// app.initializer.ts
import { APP_INITIALIZER, Provider } from '@angular/core';
import { AuthService } from './auth/auth.service';

export function appInitializerFactory(authService: AuthService) {
  return () => authService.loadUser();
}

export const APP_INIT_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: appInitializerFactory,
  deps: [AuthService],
  multi: true,
};
