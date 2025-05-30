import { NgModule } from '@angular/core';
import { RemoteComponentLoaderDirective } from './remote-component-loader.directive';
import { REMOTE_COMPONENT_LOADER } from './remote-component-loader.token';
import { DefaultRemoteComponentLoader } from './default-remote-component-loader.service';

@NgModule({
  declarations: [],
  imports: [RemoteComponentLoaderDirective],
  exports: [RemoteComponentLoaderDirective],
  providers: [
    {
      provide: REMOTE_COMPONENT_LOADER,
      useClass: DefaultRemoteComponentLoader
    }
  ]
})
export class RemoteComponentModule {}
