/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { dependencies_and_a_system_that_knows_about_no_parsers } from '../given/dependencies_and_a_system_that_knows_about_no_parsers';
import { DiscoverDependencyParser } from '../../../internal';
import Substitute from '@fluffy-spoon/substitute';
import { IRulesParser } from '../../../rules/parsing/IRulesParser';


describe('and parsing a discover dependency', () => {
    const context = new dependencies_and_a_system_that_knows_about_no_parsers();
    context.dependencyParsers.add(new DiscoverDependencyParser(Substitute.for<IRulesParser>()));

    it('Should be able to parse it', () => context.dependencyParsers.parse(context.discoverDependency, context.discoverDependency.name).should.not.be.empty);
});
