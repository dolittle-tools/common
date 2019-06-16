/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Logger } from "@dolittle/tooling.common.logging";
import { ICanProvideNamespaces, INamespaces, INamespace, ICommandGroup, DuplicateCommandName, DuplicateNamespaceName, DuplicateCommandGroupName, ICommand } from "../index";

/**
 * Represents an implementation of {INamespaces}
 *
 * @export
 * @class Namespaces
 * @implements {INamespaces}
 */
export class Namespaces implements INamespaces {

    private _defaultProviders: ICanProvideNamespaces[] = []
    private _nonDefaultProviders: ICanProvideNamespaces[] = []
    private _namespaces: INamespace[] = []

    /**
     * Instantiates an instance of {Namespaces}.
     * @param {Logger} _logger
     */
    constructor (private _logger: Logger) {}

    get providers() {
        let providers: ICanProvideNamespaces[] = [];
        this._defaultProviders.forEach(_ => providers.push(_));
        this._nonDefaultProviders.forEach(_ => providers.push(_));
        return providers;
    }

    get namespaces() {
        this.loadNamespaces();
        return this._namespaces;
    } 

    clear() {
        this._nonDefaultProviders = [];
    }
    
    register(...providers: ICanProvideNamespaces[]) {
        this.throwIfInvalidProviders(providers);
        this._nonDefaultProviders.push(...providers);
        this.throwIfDuplicates();
    }

    registerDefault(...providers: ICanProvideNamespaces[]) {
        this.throwIfInvalidProviders(providers);
        this._defaultProviders.push(...providers);
        this.throwIfDuplicates();
    }

    private loadNamespaces() {
        this._logger.info('Providing namespaces');
        this._namespaces = [];
        this.providers.forEach(_ => this._namespaces.push(..._.provide()));
    }


    private throwIfInvalidProviders(providers: ICanProvideNamespaces[]) {
        providers.forEach(_ => {
            _.provide().forEach(this.throwIfInvalidNamespace);
        });
    }

    private throwIfInvalidNamespace(namespace: INamespace) {
        this.throwIfDuplicateCommands(namespace.commands);
        this.throwIfInvalidCommandGroups(namespace.commandGroups);
    }
    private throwIfInvalidCommandGroups(commandGroups: ICommandGroup[]) {
        this.throwIfDuplicateCommandGroups(commandGroups);
        commandGroups.forEach(this.throwIfCommandGroupHasDuplicateCommands);
    }
    private throwIfCommandGroupHasDuplicateCommands(commandGroup: ICommandGroup) {
        this.throwIfDuplicateCommands(commandGroup.commands);
    }
    private throwIfDuplicateCommandGroups(commandGroups: ICommandGroup[]) {
        let names = commandGroups.map(_ => _.name);
        names.forEach((name, i) => {
            if (names.slice(i + 1).includes(name)) throw new DuplicateCommandGroupName(name);
        });
    }
    private throwIfDuplicateCommands(commands: ICommand[]) {
        let names = commands.map(_ => _.name);
        names.forEach((name, i) => {
            if (names.slice(i + 1).includes(name)) throw new DuplicateCommandName(name);
        });
    }
    
    private throwIfDuplicates() {
        let names = this.namespaces.map(_ => _.name);
        names.forEach((name, i) => {
            if (names.slice(i + 1).includes(name)) throw new DuplicateNamespaceName(name);
        })
    }

}