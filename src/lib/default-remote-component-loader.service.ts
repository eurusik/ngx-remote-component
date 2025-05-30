import { Injectable } from '@angular/core';
import { RemoteComponentLoader } from './interfaces';

/**
 * Default implementation of the remote component loader.
 * 
 * This is a placeholder implementation that should be replaced with a proper implementation
 * in your application. It throws an error if used without being overridden.
 */
@Injectable()
export class DefaultRemoteComponentLoader implements RemoteComponentLoader {
  /**
   * Default implementation of the remote component loader.
   * This is a placeholder implementation that should be replaced with a proper implementation.
   * @param remote The name of the remote application
   * @param component The name of the component to load
   * @returns A promise that resolves to the remote component
   */
  async load(remote: string, component: string): Promise<any> {
    throw new Error('DefaultRemoteComponentLoader is not implemented. Please provide your own implementation.');
  }
}
