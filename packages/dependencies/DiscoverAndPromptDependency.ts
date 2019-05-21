/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {DiscoverDependency, IPromptDependency, PromptDependency} from './internal';

export class DiscoverAndPromptDependency extends DiscoverDependency implements IPromptDependency {
    
    constructor (name: string, description: string, discoverType: string, userInputType: string, promptMessage: string,
            choices?: any[], customInput?: string, withNamespace?: boolean, milestone?: string, fileMatch?: string, 
            contentMatch?: string, fromArea?: string ) {
        super(name, description, discoverType, withNamespace, milestone, fileMatch, contentMatch, fromArea);
        this.userInputType = userInputType;
        this.choices = choices;
        this.promptMessage = promptMessage;
        this.customInput = customInput;

        PromptDependency.throwIfInvalidPromptDependency(this.userInputType, this.promptMessage);
    }
    readonly userInputType: string;
    readonly promptMessage: string;
    readonly choices?: any[];
    readonly customInput?: string;
}