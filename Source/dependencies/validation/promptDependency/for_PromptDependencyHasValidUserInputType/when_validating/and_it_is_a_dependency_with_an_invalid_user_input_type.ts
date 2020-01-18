/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { PromptDependency, PromptDependencyHasValidUserInputType, InvalidField } from '../../../../internal';
import { expect } from 'chai';

describe('and it is a dependency with an invalid user input type', () => {
    const validator = new PromptDependencyHasValidUserInputType();
    const dep = new PromptDependency('name', 'desc', [], 'some invalid field', 'prompt');
    let exception: Error;
    try {
        validator.validate(dep as any);
    } catch (error) {
        exception = error;
    }
    it('Should throw an exception', () => expect(exception).to.not.be.undefined);
    it('Should throw InvalidField', () => exception.should.be.instanceof(InvalidField));
});
