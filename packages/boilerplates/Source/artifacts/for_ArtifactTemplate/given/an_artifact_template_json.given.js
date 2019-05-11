/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Boilerplate } from '../../../boilerplates/Boilerplate';

export class an_artifact_template_json{
    constructor() {
        
        this.included_files = ['{{name}}.cs']
        this.path = 'some path';
        this.boilerplate = new Boilerplate('language', 'name', 'desc', 'type', [], 'namespace', 'target', 'framework', {}, 'path', [], []);
        this.artifact_template_json = {
            name: 'Aggregate Root template', 
            type: 'aggregateRoot', 
            area: 'domain', 
            description: 'Creates an Aggregate Root', 
        }; 
    }
}