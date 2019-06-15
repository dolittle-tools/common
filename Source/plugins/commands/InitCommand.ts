/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Command, ICommandManager } from "@dolittle/tooling.common.commands";
import { Logger } from "@dolittle/tooling.common.logging";
import { ICanOutputMessages, NullMessageOutputter, IBusyIndicator, NullBusyIndicator } from "@dolittle/tooling.common.utilities";
import { initPluginSystem, IPlugins } from '../index';

const name = 'init';
const description = 'Initializes the plugin system';

/**
 * Represents an implementation of {ICommand} for initializing the plugin system
 *
 * @export
 * @class InitCommand
 * @extends {Command}
 */
export class InitCommand extends Command {

    /**
     * Instantiates an instance of {InitCommand}.
     */
    constructor(private _plugins: IPlugins, private _commandManager: ICommandManager, private _logger: Logger) {
        super(name, description);
    }

    async action(cwd: string, coreLanguage: string, commandArguments?: string[], commandOptions?: Map<string, string>, namespace?: string, 
                outputter: ICanOutputMessages = new NullMessageOutputter(), busyIndicator: IBusyIndicator = new NullBusyIndicator()) {
        
        this._logger.info(`Executing 'plugins init' command`);
        await initPluginSystem(this._plugins, busyIndicator, this._commandManager);
        if (busyIndicator.isBusy) busyIndicator.stop();
    }

    getAllDependencies(cwd: string, coreLanguage: string, commandArguments?: string[], commandOptions?: Map<string, string>, namespace?: string) {
        return this.dependencies;
    }
}