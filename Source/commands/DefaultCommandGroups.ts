/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Logger } from "@dolittle/tooling.common.logging";
import { ICanProvideDefaultCommandGroups, IDefaultCommandGroups, ICommandGroup, DuplicateCommandGroupName, DuplicateCommandName } from "./index";

/**
 * Represents an implementation of {IDefaultCommandGroups}
 *
 * @export
 * @interface DefaultCommandGroups
 */
export class DefaultCommandGroups implements IDefaultCommandGroups {

    private _defaultProviders: ICanProvideDefaultCommandGroups[] = [];
    private _nonDefaultProviders: ICanProvideDefaultCommandGroups[] = [];
    private _commandGroups: ICommandGroup[] = []

    /**
     * Instantiates an instance of {DefaultCommandGroups}.
     * @param {Logger} _logger
     */
    constructor (private _logger: Logger) {}

    get providers() {
        let providers: ICanProvideDefaultCommandGroups[] = [];
        this._defaultProviders.forEach(_ => providers.push(_));
        this._nonDefaultProviders.forEach(_ => providers.push(_));
        return providers;
    }

    get commandGroups() {
        this.loadCommandGroups();
        return this._commandGroups;
    } 
    
    clear() { 
        this._nonDefaultProviders = [];
    }

    register(...providers: ICanProvideDefaultCommandGroups[]) {
        this.throwIfInvalidProviders(providers);
        this._nonDefaultProviders.push(...providers);
        this.throwIfDuplicates();
    }
    
    registerDefault(...providers: ICanProvideDefaultCommandGroups[]) {
        this.throwIfInvalidProviders(providers);
        this._defaultProviders.push(...providers);
        this.throwIfDuplicates();
    }

    private loadCommandGroups() {
        this._logger.info('Providing default command groups');
        this._commandGroups = [];
        this.providers.forEach(_ => this._commandGroups.push(..._.provide()));
    }
    
    private throwIfInvalidProviders(providers: ICanProvideDefaultCommandGroups[]) {
        providers.forEach(_ => {
            _.provide().forEach(this.throwIfCommandGroupHasDuplicateCommands);
        });
    }
    private throwIfCommandGroupHasDuplicateCommands(commandGroup: ICommandGroup) {
        let names = commandGroup.commands.map(_ => _.name);
        names.forEach((name, i) => {
            if (names.slice(i + 1).includes(name)) throw new DuplicateCommandName(name);
        });
    }
    private throwIfDuplicates() {
        let names = this.commandGroups.map(_ => _.name);
        names.forEach((name, i) => {
            if (names.slice(i + 1).includes(name)) throw new DuplicateCommandGroupName(name);
        })
    }
}