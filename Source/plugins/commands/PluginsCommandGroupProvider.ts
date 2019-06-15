/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { ICanProvideDefaultCommandGroups, ICommandGroup, ICommandManager } from "@dolittle/tooling.common.commands";
import { IDependencyResolvers } from "@dolittle/tooling.common.dependencies";
import { FileSystem } from "@dolittle/tooling.common.files";
import { Logger } from "@dolittle/tooling.common.logging";
import { ILatestCompatiblePackageFinder } from "@dolittle/tooling.common.packages";
import { PluginsCommandGroup, IPluginDiscoverers, IPlugins, OnlinePluginsFinder, OnlineDolittlePluginsFinder, CheckCommand, DolittleCommand, InitCommand, InstalledCommand, ListCommand, OnlineCommand } from "../index";

export class PluginsCommandGroupProvider implements ICanProvideDefaultCommandGroups {

    private _pluginsCommandGroup: PluginsCommandGroup
    

    constructor(pluginDiscoverers: IPluginDiscoverers, dependencyResolvers: IDependencyResolvers, latestPackageFinder: ILatestCompatiblePackageFinder, plugins: IPlugins, 
                onlinePluginsFinder: OnlinePluginsFinder, onlineDolittlePluginsFinder: OnlineDolittlePluginsFinder, commandManager: ICommandManager, fileSystem: FileSystem, logger: Logger ) {
        this._pluginsCommandGroup = new PluginsCommandGroup([
            new CheckCommand(plugins, pluginDiscoverers, dependencyResolvers, latestPackageFinder, commandManager, fileSystem, logger),
            new DolittleCommand(plugins, pluginDiscoverers, dependencyResolvers, onlineDolittlePluginsFinder, commandManager, fileSystem, logger),
            new InitCommand(plugins, commandManager, logger),
            new InstalledCommand(pluginDiscoverers, fileSystem, logger),
            new ListCommand(plugins, logger),
            new OnlineCommand(plugins, onlinePluginsFinder, pluginDiscoverers, dependencyResolvers, commandManager, fileSystem, logger)
        ]);
    }
    provide(): ICommandGroup[] { return [this._pluginsCommandGroup]; }

}