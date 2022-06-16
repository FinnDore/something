import { InjectionToken } from '@angular/core';
import { CheckoutProvider } from '../models';

export const S_UI_CHECKOUT_PROVIDER = new InjectionToken<
    CheckoutProvider<unknown>
>('S_UI_CHECKOUT_PROVIDER');
