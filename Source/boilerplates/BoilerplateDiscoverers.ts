/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BoilerplatePackage, ICanDiscoverBoilerplates, IBoilerplateDiscoverers } from './index';

/**
 * Represents an implementation of {IBoilerplateDiscoverers}
 *
 * @export
 * @class BoilerplateDiscoverers
 * @implements {IBoilerplateDiscoverers}
 */
export class BoilerplateDiscoverers implements IBoilerplateDiscoverers {
    
    /**
     * Instantiates an instance of {BoilerplateDiscoverers}.
     * @param {ICanDiscoverBoilerplates[]} boilerplateDiscoverers
     */
    constructor(boilerplateDiscoverers: ICanDiscoverBoilerplates[]) {
        this.discoverers = boilerplateDiscoverers;
    }
    
    readonly discoverers: ICanDiscoverBoilerplates[];
    
    get boilerplatePaths() {
        let paths: string[] = [];
        this.discoverers.forEach(_ => paths.push(..._.boilerplatePaths));
        return paths;
    }

    get discovered() {
        let boilerplates: BoilerplatePackage[] = [];
        this.discoverers.forEach(_ => boilerplates.push(..._.discovered));
        return boilerplates;
    }

    add(...boilerplateDiscoverers: ICanDiscoverBoilerplates[]) {
        this.discoverers.push(...boilerplateDiscoverers);
    }

    discover() {
        this.discoverers.forEach(_ => _.discover());
    }
}