/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { ICanRegisterProviders, ICanProvideDefaultCommands, ICommandManager } from "@dolittle/tooling.common.commands";
import { ILoggers } from "@dolittle/tooling.common.logging";
import { CommandsProvider, IInitializer } from "../index";

/**
 * Represents an implementation of {ICanRegisterProviders}
 *
 * @export
 * @class ProviderRegistrator
 * @implements {ICanRegisterProviders}
 */
export class ProviderRegistrator implements ICanRegisterProviders {
    
    private _commandsProvider: ICanProvideDefaultCommands[] = [];

    /**
     * Instantiates an instance of {ProviderRegistrator}.
     * @param {ICommandManager} _commandManager
     * @param {ILoggers} logger
     */
    constructor(private _commandManager: ICommandManager, initializer: IInitializer, logger: ILoggers) {
        this._commandsProvider.push(new CommandsProvider(initializer, logger));
    }

    register() {
        this._commandManager.registerDefaultProviders(this._commandsProvider, [], [])
    }

}
