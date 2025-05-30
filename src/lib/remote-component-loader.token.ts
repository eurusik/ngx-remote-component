import { InjectionToken } from '@angular/core';
import { RemoteComponentLoader } from './interfaces';

/**
 * Injection token for the remote component loader service.
 * Use this token to provide your own implementation of the RemoteComponentLoader interface.
 */

export const REMOTE_COMPONENT_LOADER = new InjectionToken<RemoteComponentLoader>('REMOTE_COMPONENT_LOADER');
