# ngx-remote-component

An Angular library for loading remote components dynamically in Nx workspaces.

> **Important**: This library is specifically designed for use with [Nx](https://nx.dev/) workspaces and Module Federation. It is not intended for use with standalone Angular applications or other workspace structures.

### Recommended Module Federation Loader

This library is designed to work with Nx workspaces and Module Federation. Strongly recommend using the [`ngx-mf-remote-loader`](https://github.com/eurusik/ngx-mf-remote-loader) package for Module Federation support

## Usage

### 1. Configure the module

```typescript
import { NgModule } from '@angular/core';
import { RemoteComponentModule, REMOTE_COMPONENT_LOADER } from 'ngx-remote-component';
import { RemoteLoaderBrowser, RemoteLoaderServer } from 'ngx-mf-remote-loader';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@NgModule({
  imports: [
    RemoteComponentModule
  ],
  providers: [
    {
      provide: REMOTE_COMPONENT_LOADER,
      useFactory: (platformId: Object) => {
        // Use RemoteLoaderBrowser for browser environments
        if (isPlatformBrowser(platformId)) {
          return new RemoteLoaderBrowser();
        }
        // Use RemoteLoaderServer for server-side rendering
        return new RemoteLoaderServer();
      },
      deps: [PLATFORM_ID]
    }
  ]
})
export class AppModule { }
```

### 2. Set up Module Federation

Create a `module-federation.config.ts` file next to your application's `webpack.config.ts` file:

```typescript
import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'my-remote-app',
  exposes: {
    './Module': 'apps/my-remote-app/src/app/remote-entry/entry.module.ts',
    './MyComponent': 'apps/my-remote-app/src/app/remote-entry/components/my-component.ts'
  }
};

export default config;
```

### 3. Create wrapper components for remote components

Place your wrapper components in the `remote-entry` directory of your application (e.g., `apps/my-app/src/app/remote-entry`). These wrapper components should expose your actual components to be consumed remotely:

```typescript
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { ProductCardComponent } from '@my-org/product-components'
import { ProductAnalyticsParams } from '@my-org/analytics'
import { ProductModifierModel } from '@my-org/core-models'

@Component({
  selector: 'my-app-remote-product-card',
  imports: [ProductCardComponent],
  template: `
    <my-org-product-card
      [class]="className()"
      [productId]="productId()"
      [productParams]="productParams()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteComponent {
  readonly productId = input.required<{ id: string }>()
  readonly productParams = input.required<any>()
}
```

Then expose this component in your `module-federation.config.ts` file:

```typescript
import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'my-app',
  exposes: {
    './Module': 'apps/my-app/src/app/remote-entry/entry.module.ts',
    './ProductCard': 'apps/my-app/src/app/remote-entry/product-card/remote.component.ts'
  }
};

export default config;
```

### 4. Use the directive in your templates

```html
<div 
  ngxRemoteComponent
  [remoteName]="'my-app'"
  [componentName]="'ProductCard'"
  [inputs]="{ 
    productId: { id: '12345' },
    productParams: { quantity: 1, price: 19.99 }
  }"
  (outputs)="handleOutputs($event)">
</div>
```

### 4. Handle outputs in your component

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  myData = { foo: 'bar' };
  
  handleOutputs(outputs: Record<string, any>) {
    // Handle outputs from the remote component
    console.log('Output received:', outputs);
    
    // Example: Handle a specific output
    if ('buttonClick' in outputs) {
      console.log('Button clicked with data:', outputs['buttonClick']);
    }
  }
}
```

## API Reference

### RemoteComponentLoaderDirective

A directive for loading remote components.

#### Inputs

- `remoteName` (required): The name of the remote application
- `componentName` (required): The name of the component to load
- `inputs`: An object containing inputs to pass to the remote component

#### Outputs

- `outputs`: An EventEmitter that emits when any output from the remote component is triggered

### RemoteComponentLoader

An interface for implementing remote component loading.

#### Methods

- `load(remote: string, component: string): Promise<any>`: Load a remote component

## License

MIT
