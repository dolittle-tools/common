/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IDependency, ICanResolveDependencies } from '../index';

/**
 * Defines a system that can resolve async dependencies
 *
 * @export
 * @interface ICanResolveASyncDependencies
 */
export interface ICanResolveASyncDependencies extends ICanResolveDependencies {
    
    /**
     * Resolves async dependencies
     *
     * @param {*} context The context to base off of. Fields will be appended to the context and returned
     * @param {IDependency[]} dependencies The dependencies to resolve
     * @param {string} [destinationPath] The optional source path for where the discovery mechanism should start from 
     * @param {string} [coreLanguage] The optional core language 
     * @param {string[]} [args] The optional list of arguments, only used for resolving argument dependencies
     * @returns {Promise<any>}
     */
    resolve(context: any, dependencies: IDependency[], destinationPath?: string, coreLanguage?: string, args?: string[]): Promise<any>

}