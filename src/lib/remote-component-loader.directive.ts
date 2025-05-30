import {
  AfterViewInit,
  Directive,
  inject,
  input,
  ViewContainerRef,
  ComponentRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { REMOTE_COMPONENT_LOADER } from './remote-component-loader.token';
import { Subscription } from 'rxjs';

/**
 * Directive for loading remote components dynamically.
 * 
 * This directive allows loading components from remote sources at runtime.
 * It handles passing inputs to the remote component and capturing outputs.
 * 
 * @example
 * ```html
 * <div
 *   ngxRemoteComponent
 *   [remoteName]="'my-remote-app'"
 *   [componentName]="'MyComponent'"
 *   [inputs]="{ title: 'Hello World', data: myData }"
 *   (outputs)="handleOutputs($event)">
 * </div>
 * ```
 */
@Directive({
  selector: '[ngxRemoteComponent]',
  standalone: true
})
export class RemoteComponentLoaderDirective implements AfterViewInit, OnDestroy {
  /** 
   * The name of the remote application to load the component from.
   * This is required for the directive to work.
   */
  readonly remoteName = input.required<string>();
  
  /**
   * The name of the component to load from the remote application.
   * This is required for the directive to work.
   */
  readonly componentName = input.required<string>();
  /**
   * Reference to the loaded component instance.
   */
  private componentRef: ComponentRef<any> | null = null;
  /**
   * Current inputs to be passed to the remote component.
   */
  private currentInputs: Record<string, any> | null = null;
  /**
   * Reference to the view container where the remote component will be loaded.
   */
  private readonly viewContainerRef = inject(ViewContainerRef);
  /**
   * Reference to the remote component loader service.
   */
  private readonly remoteComponentLoader = inject(REMOTE_COMPONENT_LOADER);
  /**
   * Array of subscriptions to handle cleanup of event listeners.
   */
  private subscriptions: Subscription[] = [];

  /**
   * Dynamic inputs to pass to the remote component.
   * These inputs will be set on the remote component instance.
   * 
   * @param value An object containing key-value pairs to set as inputs on the remote component
   */
  @Input() set inputs(value: Record<string, any>) {
    this.currentInputs = value;
    if (this.componentRef) {
      this.setComponentInputs(value);
    }
  }

  /**
   * Sets inputs on the remote component instance.
   * @param inputs An object containing key-value pairs to set as inputs on the remote component
   */
  private setComponentInputs(inputs: Record<string, any>): void {
    Object.entries(inputs).forEach(([key, val]) => {
      this.componentRef?.setInput(key, val);
    });
  }

  /**
   * Event emitter that fires when any output from the remote component is triggered.
   * The event data is an object with the output name as the key and the output value as the value.
   */
  @Output() readonly outputs = new EventEmitter<Record<string, EventEmitter<any>>>();

  /**
   * Lifecycle hook that is called after the directive's view has been initialized.
   * This is where the remote component is loaded and initialized.
   */
  ngAfterViewInit(): void {
    this.remoteComponentLoader.load(this.remoteName(), this.componentName()).then((remote) => {
      this.componentRef = this.viewContainerRef.createComponent(remote.RemoteComponent);

      if (this.currentInputs) {
        this.setComponentInputs(this.currentInputs);
      }

      Object.entries(this.componentRef.instance).forEach(([key, value]) => {
        if (value instanceof EventEmitter) {
          const subscription = (value as EventEmitter<any>).subscribe((event: any) => {
            this.outputs.emit({ [key]: event });
          });
          this.subscriptions.push(subscription);
        }
      });
    });
  }

  /**
   * Lifecycle hook that is called when the directive is destroyed.
   * This is where subscriptions are cleaned up to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    
    this.subscriptions = [];
  }
}
