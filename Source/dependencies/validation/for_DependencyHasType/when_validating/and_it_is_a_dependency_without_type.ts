/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { MissingField, DependencyHasType } from "../../../internal";
import { expect } from "chai";
import { a_dependency } from "../given/a_dependency";

describe('and it is a dependency without type', () => {
    let validator = new DependencyHasType();
    let dep = new a_dependency('name', 'desc', undefined,[]);
    let exception; 
    try {
        validator.validate(dep as any);    
    } catch(error) {
        exception = error;
        
    }
    it('Should throw an exception', () => expect(exception).to.not.be.undefined);
    it('Should throw MissingField', () => exception.should.be.instanceof(MissingField));
});