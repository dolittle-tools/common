/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * The error that gets throw when there aren't any dependency resolvers that can resolve a dependency
 *
 * @export
 * @class CannotResolveDependencyError
 * @extends {Error}
 */
export class CannotResolveDependencyError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, CannotResolveDependencyError);
    }

    static get new() {
        return new CannotResolveDependencyError('Cannot resolve given dependency');
    } 
}