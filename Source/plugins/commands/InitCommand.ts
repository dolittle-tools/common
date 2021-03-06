/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Command, CommandContext, IFailedCommandOutputter } from '@dolittle/tooling.common.commands';
import { ILoggers } from '@dolittle/tooling.common.logging';
import { ICanOutputMessages, NullMessageOutputter, IBusyIndicator, NullBusyIndicator } from '@dolittle/tooling.common.utilities';
import { initPluginSystem, IPlugins } from '../internal';
import { IDependencyResolvers } from '@dolittle/tooling.common.dependencies';

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
    constructor(private _plugins: IPlugins, private _logger: ILoggers) {
        super(name, description, false);
    }

    async onAction(commandContext: CommandContext, dependencyResolvers: IDependencyResolvers, failedCommandOutputter: IFailedCommandOutputter, outputter: ICanOutputMessages, busyIndicator: IBusyIndicator) {
        this._logger.info("Executing 'plugins init' command");
        await initPluginSystem(this._plugins, busyIndicator);
    }

}
