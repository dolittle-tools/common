/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Command } from '@dolittle/tooling.common.commands';
import { IDependencyResolvers, PromptDependency, argumentUserInputType } from '@dolittle/tooling.common.dependencies';
import { IFileSystem } from '@dolittle/tooling.common.files';
import { ILoggers } from '@dolittle/tooling.common.logging';
import { requireInternet, isGreaterVersion, ToolingPackage, ICanDownloadPackages, IConnectionChecker } from '@dolittle/tooling.common.packages';
import { ICanOutputMessages, NullMessageOutputter, IBusyIndicator, NullBusyIndicator } from '@dolittle/tooling.common.utilities';
import { fetchOnlinePlugins, fetchDolittlePlugins, OnlinePluginsFinder, OnlineDolittlePluginsFinder, getInstalledPlugins, IPluginDiscoverers, askToDownloadOrUpdatePlugins, PluginPackageInfo, IPlugins } from '../index';

const name = 'install';
const description = `Prompt to install plugins`;

const dolittlePluginsDependency = new PromptDependency(
    'dolittle',
    'Whether to only find plugins under the Dolittle scope / user',
    argumentUserInputType,
    'Find only plugins under Dolittle scope / user?',
    true
);

/**
 * Represents an implementation of {ICommand} for finding and installing boilerplates 
 *
 * @export
 * @class InstallCommand
 * @extends {Command}
 */
export class InstallCommand extends Command {
    /**
     * Instantiates an instance of {DolittleCommand}.
     */
    constructor(private _plugins: IPlugins, private _pluginDiscoverers: IPluginDiscoverers, private _onlinePluginsFinder: OnlinePluginsFinder, private _onlineDolittlePluginsFinder: OnlineDolittlePluginsFinder, 
                private _packageDownloader: ICanDownloadPackages, private _connectionChecker: IConnectionChecker, private _fileSystem: IFileSystem, private _logger: ILoggers) {
        super(name, description, false, undefined, [dolittlePluginsDependency]);
    }

    async action(dependencyResolvers: IDependencyResolvers, cwd: string, coreLanguage: string, commandArguments: string[], commandOptions: Map<string, string>, namespace?: string, 
                outputter: ICanOutputMessages = new NullMessageOutputter(), busyIndicator: IBusyIndicator = new NullBusyIndicator()) {
        this._logger.info(`Executing 'plugins install' command`);
        await requireInternet(this._connectionChecker, busyIndicator);
        let plugins: ToolingPackage[]
        if (commandOptions.get(dolittlePluginsDependency.name))
            plugins = await fetchDolittlePlugins(this._onlineDolittlePluginsFinder, this._connectionChecker, busyIndicator);
        else 
            plugins = await fetchOnlinePlugins(this._onlinePluginsFinder, this._connectionChecker,busyIndicator, namespace? [namespace]: []);

        let localPlugins = await getInstalledPlugins(this._pluginDiscoverers, this._fileSystem, busyIndicator);
        let newAvailablePlugins = plugins.filter(boilerplate => !localPlugins.map(_ => _.name).includes(boilerplate.name));
        let upgradeablePlugins = plugins.filter(boilerplate => localPlugins.map(_ => _.name).includes(boilerplate.name))
            .map(plugin => {
                let localPlugin = localPlugins.find(_ => _.name === plugin.name);
                if (localPlugin) {
                    return {name: plugin.name, version: plugin.version, localVersion: localPlugin.version};
                }
                return undefined;
            })
            .filter(_ => _ && isGreaterVersion(_.version, _.localVersion));
        
        outputter.warn(`Found ${newAvailablePlugins.length} new plugins`);
        outputter.print(newAvailablePlugins.map(_ => `${_.name} v${_.version}`).join('\t\n'));
        
        outputter.warn(`Found ${upgradeablePlugins.length} upgradeable plugins`);
        outputter.print(upgradeablePlugins.map((_: any) => `${_.name} v${_.localVersion} --> v${_.version}`).join('\t\n'));
            
        let pluginsToDownload = newAvailablePlugins.concat(<any>upgradeablePlugins);
        await askToDownloadOrUpdatePlugins(pluginsToDownload as PluginPackageInfo[], this._plugins, dependencyResolvers, this._packageDownloader, this._connectionChecker, busyIndicator);    
    }

    getAllDependencies(cwd: string, coreLanguage: string, commandArguments?: string[], commandOptions?: Map<string, string>, namespace?: string) {
        return this.dependencies;
    }
}