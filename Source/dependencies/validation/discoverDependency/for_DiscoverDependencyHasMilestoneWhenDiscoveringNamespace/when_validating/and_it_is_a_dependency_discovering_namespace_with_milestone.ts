/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { DiscoverDependency, DiscoverDependencyHasMilestoneWhenDiscoveringNamespace, fileDiscoverType, namespaceDiscoverType } from "../../../../internal";
import { expect } from "chai";

describe('and it is a dependency discovering namespace with milestone', () => {
    let validator = new DiscoverDependencyHasMilestoneWhenDiscoveringNamespace();
    let dep = new DiscoverDependency('name', 'desc', [], namespaceDiscoverType, undefined, 'some milestone');
    let result = validator.validate(dep as any);    
    
    it('Should not return anything', () => expect(result).to.be.undefined);
});