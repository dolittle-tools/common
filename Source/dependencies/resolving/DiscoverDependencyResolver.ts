/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { dependencyIsDiscoverDependency, ICanResolveSyncDependencies, IDependency, IDependencyDiscoverResolver, MissingDestinationPath, MissingCoreLanguage, CannotResolveDependency } from "../index";

/**
 * Resolves {DiscoverDependency}
 *
 * @export
 * @class DiscoverDependencyResolver
 * @implements {ICanResolveSyncDependencies}
 */
export class DiscoverDependencyResolver implements ICanResolveSyncDependencies {
    /**
     * Instantiates an instance of {DiscoverDependencyResolver}.
     * @param {IDependencyDiscoverResolver} _discoverResolver
     * @param {*} _dolittleConfig
     */
    constructor(private _discoverResolver: IDependencyDiscoverResolver, private _dolittleConfig: any) {}

    resolve(context: any, dependencies: IDependency[], destinationPath?: string, coreLanguage?: string, args?: string[]) {
        if (!destinationPath) throw new MissingDestinationPath();
        if (!coreLanguage) throw new MissingCoreLanguage();
        dependencies.forEach(dep => {
            if (!this.canResolve(dep)) throw new CannotResolveDependency(dep);
            context[dep.name] = this._discoverResolver.resolve(<any>dep, destinationPath, coreLanguage, this._dolittleConfig);
        });
        return context;
    }    
    
    canResolve(dependency: IDependency): boolean {
        return dependencyIsDiscoverDependency(dependency) && (dependency as any).userInputType === undefined;
    }
}