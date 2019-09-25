/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { dependencies_and_a_system_that_knows_about_no_resolvers } from "../given/dependencies_and_a_system_that_knows_about_no_resolvers";
import { NonOptionalArgumentDependencyResolver, CannotResolveDependency } from "../../../internal";

describe('and resolving a dependency that cannot be resolved', async () => {
    let context = new dependencies_and_a_system_that_knows_about_no_resolvers();
    let exception = null;
    context.dependencyResolvers.add(new NonOptionalArgumentDependencyResolver())

    try {
        await context.dependencyResolvers.resolve({}, [context.discoverDependency]);
    } catch (error) {
        exception = error;
    }

    it('Should throw an exception', () => expect(exception).to.not.be.null);
    it('Should throw a CannotResolveDependency exception', () => exception.should.be.instanceof(CannotResolveDependency));
    
});