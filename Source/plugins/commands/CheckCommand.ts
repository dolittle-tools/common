/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Command, ICommandManager } from '@dolittle/tooling.common.commands';
import { IDependencyResolvers } from '@dolittle/tooling.common.dependencies';
import { IFileSystem } from '@dolittle/tooling.common.files';
import { requireInternet, ILatestCompatiblePackageFinder } from '@dolittle/tooling.common.packages';
import { ICanOutputMessages, NullMessageOutputter, IBusyIndicator, NullBusyIndicator } from '@dolittle/tooling.common.utilities';
import { ILoggers } from '@dolittle/tooling.common.logging';
import { askToDownloadOrUpdatePlugins, checkPlugins, IPluginDiscoverers, IPlugins } from '../index'

const name = 'check';
const description = `Checks whether you have plugins that are out of date.

Lists installed plugins that are out of date with the latest version.

Asks whether to download the latest plugins or not.`;

const shortDescription = 'Checks whether you have plugins that are out of date';

/**
 * Represents an implementation of {ICommand} for checking versions of plugins
 *
 * @export
 * @class CheckCommand
 * @extends {Command}
 */
export class CheckCommand extends Command {

    /**
     * Instantiates an instance of {CheckCommand}.
     */
    constructor(private _plugins: IPlugins, private _pluginDiscoverers: IPluginDiscoverers, private _latestPackageFinder: ILatestCompatiblePackageFinder, 
                private _fileSystem: IFileSystem, private _logger: ILoggers) {
        super(name, description, false, shortDescription);
    }

    async action(dependencyResolvers: IDependencyResolvers, cwd: string, coreLanguage: string, commandArguments?: string[], commandOptions?: Map<string, string>, namespace?: string, 
                outputter: ICanOutputMessages = new NullMessageOutputter(), busyIndicator: IBusyIndicator = new NullBusyIndicator()) {
        this._logger.info(`Executing 'plugins check' command`);
        await requireInternet(busyIndicator);
        if (busyIndicator.isBusy) busyIndicator.stop()
        
        let outOfDatePackages: any = await checkPlugins(this._pluginDiscoverers, this._latestPackageFinder, this._fileSystem, busyIndicator);
        if (busyIndicator.isBusy) busyIndicator.stop()
        await askToDownloadOrUpdatePlugins(outOfDatePackages, this._plugins, dependencyResolvers, busyIndicator);    
    }

    getAllDependencies(cwd: string, coreLanguage: string, commandArguments?: string[], commandOptions?: Map<string, string>, namespace?: string) {
        return this.dependencies;
    }
}