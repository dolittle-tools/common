/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { ICanRegisterProviders, ICanProvideDefaultCommands, ICommandManager } from "@dolittle/tooling.common.commands";
import { ILatestCompatiblePackageFinder } from "@dolittle/tooling.common.packages";
import { FileSystem } from "@dolittle/tooling.common.files";
import { Logger } from "@dolittle/tooling.common.logging";
import { CommandsProvider } from "../index";


/**
 * Represents an implementation of {ICanRegisterProviders}
 *
 * @export
 * @class ProviderRegistrator
 * @implements {ICanRegisterProviders}
 */
export class ProviderRegistrator implements ICanRegisterProviders {
    
    private _commandsProvider: ICanProvideDefaultCommands[] = [];

    constructor(private _commandManager: ICommandManager, logger: Logger) {
        this._commandsProvider.push(new CommandsProvider(logger));
    }

    register() {
        this._commandManager.registerDefaultProviders(this._commandsProvider, [], [])
    }

}