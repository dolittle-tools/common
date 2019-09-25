/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { a_templates_boilerplate_parser } from "../given/a_templates_boilerplate_parser";
import { Scripts, ContentBoilerplate } from "../../../internal";


describe('and boilerplate cannot be parsed', () => {
    let context = new a_templates_boilerplate_parser();
    let boilerplate = new ContentBoilerplate('language', 'name', 'desc', 'type', context.dependencies, 'namespace', new Scripts([], [], [], {}), undefined, undefined, undefined, 'Content', [], []);

    it('Should not be able to parse', () => context.parser.canParse(boilerplate).should.not.be.true);
});    