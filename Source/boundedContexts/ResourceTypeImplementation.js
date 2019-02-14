/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function resourceTypeImplementationFromJson(obj) {
    return new ResourceTypeImplementation(obj.development, obj.production);
}
/**
  * Represents a Bounded Context's resources configuration
  */
export class ResourceTypeImplementation
{
    #development;
    #production;
    /**
      * Instantiates an instance of {ResourceTypeImplementation}
      * @param {string} development 
      * @param {string} production
      */
    constructor (development, production) {
        this.#development = development;
        this.#production = production;
        
    }
    /**
     * Gets the resource type implementations for read models
     * 
     * @readonly
     * @memberof Core
     */
    get development() {
        return this.#development;
    }
    /**
     * The entry point of the bounded context's Core.  A relative path to the folder
     *
     * @readonly
     * @memberof Core
     */
    get production() {
        return this.#production;
    }

    toJson() {
        return {
            development: this.#development,
            production: this.#production
        };
    }
}