/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Command, CommandContext, IFailedCommandOutputter } from '@dolittle/tooling.common.commands';
import { ILoggers } from '@dolittle/tooling.common.logging';
import { ICanOutputMessages, NullMessageOutputter, IBusyIndicator, NullBusyIndicator } from '@dolittle/tooling.common.utilities';
import { IDependencyResolvers } from '@dolittle/tooling.common.dependencies';
import { getBoilerplatesInUse, IBoilerplates } from '../internal';

const name = 'list';
const description = 'Lists the boilerplates in use by the tooling';

/**
 * Represents an implementation of {ICommand} for listing boilerplates in use by the tooling
 *
 * @export
 * @class ListCommand
 * @extends {Command}
 */
export class ListCommand extends Command {

    /**
     * Instantiates an instance of {ListCommand}
     */
    constructor(private _boilerplates: IBoilerplates, private _logger: ILoggers) {
        super(name, description, false);
    }

    async onAction(commandContext: CommandContext, dependencyResolvers: IDependencyResolvers, failedCommandOutputter: IFailedCommandOutputter, outputter: ICanOutputMessages, busyIndicator: IBusyIndicator) {
        this._logger.info("Executing 'boilerplates list' command");
        const boilerplatesInUse = await getBoilerplatesInUse(this._boilerplates, busyIndicator)
            .catch((error: Error) => {
                outputter.warn('An error occured while getting the used boilerplates.\nError message:');
                outputter.error(error.message);
                outputter.warn('There problem might be that you haven\'t initialized the tooling');
                return [];
        });
        boilerplatesInUse.forEach(_ => outputter.print(`${_.name} - ${_.description}`));
    }

}
