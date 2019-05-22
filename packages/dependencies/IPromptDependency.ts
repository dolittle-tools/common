/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {IDependency} from './internal';

export type DependencyChoice = string | {name: string, value: any};

/**
 * Represents the configuration of a prompt dependency
 *
 * @export
 * @interface IPromptDependency
 * @extends {IDependency}
 */
export interface IPromptDependency extends IDependency {
   
    /**
     * The user input type of the dependency, it defines how the user should be prompted.
     * 
     * The 'argument' user input type is a CLI specific thing defining user input that should be arguments in a command
     * 
     * The 'input' user input type prompts the user for input. Use the 'promptMessage' property for 
     * 
     * The 'chooseOne' user input type prompts the user to choose one alternative. The choices can come from a 'discovery' or from the 'choices' property
     * 
     * The 'chooseMultiple' user input type prompts the user to choose one or more alternatives. The choices can come from a 'discovery' or from the 'choices' property
     *
     * @readonly
     * @memberof IPromptDependency
     */
    readonly userInputType: string;
    /**
     * The message that the user is prompted with
     *
     * @readonly
     * @memberof IPromptDependency
     */
    readonly promptMessage: string;
    /**
     * The list of choices for a user input prompt
     *
     * @readonly
     * @memberof IPromptDependency
     */
    readonly choices?: DependencyChoice[];
    /**
     * The custom input string that is the alternative string of a custom input when the user is prompted to choose between alternatives.
     *
     * @readonly
     * @memberof IPromptDependency
     */
    readonly customInput?: string;
}