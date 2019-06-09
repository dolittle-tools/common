/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { IBusyIndicator } from '@dolittle/tooling.common.utilities';
import { IPlugins } from './index';

/**
 * Initializes the boilerplates system in the common tooling
 * 
 * @param {IPlugins} plugins
 * @param {IBusyIndicator} busyIndicator
 */
export async function initPluginSystem(plugins: IPlugins, busyIndicator: IBusyIndicator) {
    busyIndicator = busyIndicator.createNew().start('Initializing plugin system');
    try {
        plugins.discoverNewPlugins();
        let loadedPlugins = await plugins.getPlugins();
        
        busyIndicator.succeed('Plugin system initialized');
    } catch (error) {
        busyIndicator.fail(`An error occurred: ${error.message? error.message : error}`);
        throw error;
    }
}