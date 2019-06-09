/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IBoilerplate, ITemplate } from '../index';

/**
 * Defines a {Boilerplate} that has templates
 */
export interface ITemplatesBoilerplate extends IBoilerplate {

    /**
     * Gets the templates belonging under this boilerplate
     * @readonly
     * @type {ITemplate[]}
     */
    readonly templates: ITemplate[]

    /**
     * Gets the templates with the given type
     *
     * @param {string} type The type of the {Template}
     * @returns {ITemplate[]}
     */
    templatesByType(type: string): ITemplate[]
}

