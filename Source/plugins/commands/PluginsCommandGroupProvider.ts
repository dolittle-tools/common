/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { ICanProvideDefaultCommandGroups, ICommandGroup } from "@dolittle/tooling.common.commands";
import { IFileSystem } from "@dolittle/tooling.common.files";
import { ILoggers } from "@dolittle/tooling.common.logging";
import { ILatestCompatiblePackageFinder, IConnectionChecker, ICanDownloadPackages } from "@dolittle/tooling.common.packages";
import { PluginsCommandGroup, IPluginDiscoverers, IPlugins, OnlinePluginsFinder, OnlineDolittlePluginsFinder, CheckCommand, InitCommand, InstalledCommand, ListCommand, InstallCommand } from "../index";

export class PluginsCommandGroupProvider implements ICanProvideDefaultCommandGroups {

    private _pluginsCommandGroup: PluginsCommandGroup
    

    constructor(pluginDiscoverers: IPluginDiscoverers, latestPackageFinder: ILatestCompatiblePackageFinder, plugins: IPlugins, 
                onlinePluginsFinder: OnlinePluginsFinder, onlineDolittlePluginsFinder: OnlineDolittlePluginsFinder, 
                packageDownloader: ICanDownloadPackages, connectionChecker: IConnectionChecker, fileSystem: IFileSystem, logger: ILoggers ) {
        this._pluginsCommandGroup = new PluginsCommandGroup([
            new CheckCommand(plugins, pluginDiscoverers, latestPackageFinder, packageDownloader, connectionChecker, fileSystem, logger),
            new InitCommand(plugins, logger),
            new InstallCommand(plugins, pluginDiscoverers, onlinePluginsFinder, onlineDolittlePluginsFinder, packageDownloader, connectionChecker, fileSystem, logger),
            new InstalledCommand(pluginDiscoverers, fileSystem, logger),
            new ListCommand(plugins, logger),
        ]);
    }
    provide(): ICommandGroup[] { return [this._pluginsCommandGroup]; }

}