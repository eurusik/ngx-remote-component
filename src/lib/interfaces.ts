/**
 * Interfaces for the ngx-remote-component library
 */

/**
 * Interface for loading remote components
 */
export interface RemoteComponentLoader {
  /**
   * Load a remote component
   * @param remote The name of the remote application
   * @param component The name of the component to load
   * @returns A promise that resolves to the remote component
   */
  load(remote: string, component: string): Promise<any>;
}
