/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { DependencyMissingField, PromptDependency } from '../internal';
import { a_valid_configuration_for_a_prompt_dependency } from './given/a_valid_configuration_for_a_prompt_dependency';

describe('when creating prompt dependency with undefined name', () => {
    let context = new a_valid_configuration_for_a_prompt_dependency();
    let name = undefined;
    let error = null;
    try {
        new PromptDependency(name, context.description, context.userInputType, context.promptMessage);
    } catch(e) {
        error = e;
    }
    it('Should throw an exception', () => error.should.not.be.null);
    it('Should throw an DependencyMissingField exception', () => error.should.be.an.instanceof(DependencyMissingField));
    
});