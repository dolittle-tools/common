/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { DiscoverDependency, DiscoverDependencyHasFileMatchWhenDiscoveringFiles } from '../../../../internal';
import { expect } from 'chai';

describe('and it has a discover type it cannot validate', () => {
    const validator = new DiscoverDependencyHasFileMatchWhenDiscoveringFiles();
    const dep = new DiscoverDependency('name', 'desc', [], 'some type');
    const result = validator.canValidate(dep as any);

    it('Should not be able to validate dependency', () => result.should.be.equal(false));
});
