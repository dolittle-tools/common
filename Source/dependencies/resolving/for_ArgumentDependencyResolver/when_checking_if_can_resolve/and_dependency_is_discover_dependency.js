/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { dependencies_and_an_argument_dependency_resolver } from "../given/dependencies_and_an_argument_dependency_resolver";

describe('and dependency is discover dependency', () => {
    let context = new dependencies_and_an_argument_dependency_resolver();
    
    it('Should not be able to resolve', context.argumentDependencyResolver.canResolve(context.discoverDependency).should.be.false);
});