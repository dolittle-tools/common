/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { ToolingPackage } from '@dolittle/tooling.common.packages';
import {FileSystem} from '@dolittle/tooling.common.files';
import { IBusyIndicator } from '@dolittle/tooling.common.utilities';
import path from 'path';
import { IPluginDiscoverers } from './index';

/**
 * Finds and gets the plugins installed on the local machine
 *
 * @param {IPluginDiscoverers} pluginDiscoverers
 * @param {FileSystem} filesystem  
 * @param {IBusyIndicator} busyIndicator
 * 
 * @export
 * @returns A list of the package configurations for each plugin
 */

 
export async function listInstalledPlugins(pluginDiscoverers: IPluginDiscoverers, filesystem: FileSystem, busyIndicator: IBusyIndicator) {
    busyIndicator = busyIndicator.createNew().start('Getting installed plugins:\n');

    try {
        let paths = pluginDiscoverers.pluginPaths;
    
        let pluginPackages = paths.map(pluginPath => {
            let packageJson = filesystem.readJsonSync(path.join(pluginPath, 'package.json'));
            return packageJson as ToolingPackage;
        });
        let numPlugins = pluginPackages.length;
        if (numPlugins > 0) busyIndicator.succeed(`Found ${numPlugins} installed plugins`);
        else busyIndicator.info('Could not find any installed plugins.');
        
        return pluginPackages;
        
    } catch (error) {
        busyIndicator.fail(`An error occurred: ${error.message? error.message : error}`);
        throw error;
    }
}