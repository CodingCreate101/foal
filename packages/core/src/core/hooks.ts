// 3p
import 'reflect-metadata';

// FoalTS
import { Context, HttpResponse } from './http';
import { ServiceManager } from './service-manager';

/**
 * Interface of a function that can be returned in a hook function. This function is then
 * executed after the controller method execution.
 *
 * @export
 */
export type HookPostFunction = (response: HttpResponse) => void | Promise<void>;

/**
 * Interface of a function from which a hook can be created.
 *
 * @export
 */
export type HookFunction = (ctx: Context, services: ServiceManager) =>
  void | HttpResponse | HookPostFunction | Promise <void | HttpResponse | HookPostFunction>;

/**
 * Interface of a hook. It is actually the interface of a decorator.
 *
 * @export
 */
export type HookDecorator = (target: any, propertyKey?: string) => any;

/**
 * Create a hook from one or several functions.
 *
 * @export
 * @param {...HookFunction[]} hookFunctions - The function(s) from which the hook should be created.
 * @returns {HookDecorator} - The hook decorator.
 */
export function Hook(...hookFunctions: HookFunction[]): HookDecorator {
  return (target: any, propertyKey?: string) => {
    // Note that propertyKey can be undefined as it's an optional parameter in getMetadata.
    const hooks: HookFunction[] = Reflect.getOwnMetadata('hooks', target, propertyKey as string) || [];
    hooks.unshift(...hookFunctions);
    Reflect.defineMetadata('hooks', hooks, target, propertyKey as string);
  };
}

/**
 * Get the function from which the hook was made.
 *
 * @export
 * @param {HookDecorator} hook - The hook decorator.
 * @returns {HookFunction} The hook function.
 */
export function getHookFunction(hook: HookDecorator): HookFunction {
  @hook
  class Foo {}

  return Reflect.getOwnMetadata('hooks', Foo)[0];
}

/**
 * Get the functions from which the hook was made.
 *
 * @export
 * @param {HookDecorator} hook - The hook decorator.
 * @returns {HookFunction[]} The hook functions.
 */
export function getHookFunctions(hook: HookDecorator): HookFunction[] {
  @hook
  class Foo {}

  return Reflect.getOwnMetadata('hooks', Foo);
}

/**
 * Group multiple hooks into a new one.
 *
 * @export
 * @param {...HookDecorator[]} hookDecorators - The hooks to merge.
 * @returns {HookDecorator} The new hook.
 */
export function MergeHooks(...hookDecorators: HookDecorator[]): HookDecorator {
  const hookFunctions: HookFunction[] = [];
  for (const hook of hookDecorators) {
    hookFunctions.push(...getHookFunctions(hook));
  }
  return Hook(...hookFunctions);
}
