/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Dependency } from '../dependencies/Dependency';
import { BaseBoilerplate } from './BaseBoilerplate';

/**
 * Represents the standard boilerplate, meaning a non-artifacts boilerplate 
 */
export class Boilerplate extends BaseBoilerplate {
    #_target;
    #_framework;
    #_parent;
    #_pathsNeedingBinding;
    #_filesNeedingBinding;
    /**
     * Initializes a new instance of {Boilerplate}
     * @param {string} language 
     * @param {string} name 
     * @param {string} description 
     * @param {string} type
     * @param {Dependency[]} dependencies
     * @param {string} target
     * @param {string} framework
     * @param {{name: string, type: string, language: string}} parent
     * @param {string} path 
     * @param {string[]} [pathsNeedingBinding]
     * @param {string[]} [filesNeedingBinding]
     */
    constructor(language, name, description, type, dependencies, target, framework, parent, path, pathsNeedingBinding, filesNeedingBinding) {
        super(language, name, description, type, dependencies, path);
        this.#_target = target;
        this.#_framework = framework;
        this.#_parent = parent;
        this.#_pathsNeedingBinding = pathsNeedingBinding || [];
        this.#_filesNeedingBinding = filesNeedingBinding || [];
    }

    /**
     * Get the target of {Boilerplate}.
     * @returns {string} Type of {Boilerplate}
     */
    get target() { return this.#_target; }

    /**
     * Get the framework of {Boilerplate}
     * @returns {string} Type of {Boilerplate}
     */
    get framework() { return this.#_framework; }

    /**
     * Get the parent boilerplate that this is an adornment boilerplate of
     * @returns {string} Type of {Boilerplate}
     */
    get parent() { return this.#_parent; }

    /**
     * Get the paths that need binding - relative within the content of the location of the {Boilerplate}
     * @returns {string[]} Paths
     */
    get pathsNeedingBinding() {return this.#_pathsNeedingBinding; }

    /**
     * Gets the files that need binding - relative within the content of the location of the {Boilerplate}
     * @returns {string[]} Files
     */
    get filesNeedingBinding() {return this.#_filesNeedingBinding; }
}