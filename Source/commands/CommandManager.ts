/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { ICanOutputMessages, NullMessageOutputter, NullBusyIndicator, IBusyIndicator } from "@dolittle/tooling.common.utilities";
import { ILoggers } from "@dolittle/tooling.common.logging";
import { 
    INamespaces, IDefaultCommands, IDefaultCommandGroups, ICanProvideDefaultCommands, 
    ICanProvideDefaultCommandGroups, ICanProvideNamespaces, Namespaces, 
    DefaultCommandGroups, DefaultCommands, ICommand, NoArgumentsGiven, NoMatchingCommand, INamespace, ICommandGroup, ICanValidateProviderFor 
} from "@dolittle/tooling.common.commands";
import { IDependencyResolvers } from "@dolittle/tooling.common.dependencies";
import { ICommandManager } from "./index";

/**
 * Represents an implementation of {ICommandManager}
 */
export class CommandManager implements ICommandManager {
    
    private _namespaces: INamespaces;
    private _defaultCommandGroups: IDefaultCommandGroups;
    private _defaultCommands: IDefaultCommands;

    /**
     * Instantiates an instance of {CommandManager}.
     * @param {ICanValidateProviderFor<ICommand>} _commandProviderValidator
     * @param {ICanValidateProviderFor<ICommandGroup>} _commandGroupProviderValidator
     * @param {ICanValidateProviderFor<INamespace>} _namespaceProviderValidator
     * @param {ILoggers} _logger
     */
    constructor(private _commandProviderValidator: ICanValidateProviderFor<ICommand>, private _commandGroupProviderValidator: ICanValidateProviderFor<ICommandGroup>,
                private _namespaceProviderValidator: ICanValidateProviderFor<INamespace>, private _logger: ILoggers) {
        this._namespaces = new Namespaces(this._namespaceProviderValidator, this._logger);
        this._defaultCommandGroups = new DefaultCommandGroups(this._commandGroupProviderValidator, this._logger);
        this._defaultCommands = new DefaultCommands(this._commandProviderValidator, this._logger);
    }
    
    get namespaces() { 
        let namespaces = this._namespaces.namespaces;
        this.addBoilerplateCommandsToNamespaces(namespaces);
        return namespaces;
    }
    
    get commands() { 
        return this._defaultCommands.commands;
    }

    get commandGroups() { 
        return this._defaultCommandGroups.commandGroups;
    }

    async execute(dependencyResolvers: IDependencyResolvers, allArguments: string[], currentWorkingDirectory: string, coreLanguage: string, commandOptions?: Map<string, any>, 
                    outputter: ICanOutputMessages = new NullMessageOutputter(), busyIndicator: IBusyIndicator = new NullBusyIndicator()) {
        
        if (allArguments.length < 1) throw new NoArgumentsGiven();
        this._logger.info(`Executing command with arguments ${allArguments}`);
        const {command, commandArguments, namespace} = await this.getCommandContext(allArguments);
        await command.action(dependencyResolvers, currentWorkingDirectory, coreLanguage, commandArguments, commandOptions, namespace, outputter, busyIndicator);
        this._logger.info('Finished executing command');
    }

    clear() {
        this._logger.info('Clearing command manager');
        this._defaultCommands.clear();
        this._defaultCommandGroups.clear();
        this._namespaces.clear();
    }

    async registerProviders(defaultCommandProviders: ICanProvideDefaultCommands[], defaultCommandGroupsProviders: ICanProvideDefaultCommandGroups[], namespaceProviders: ICanProvideNamespaces[]) {
        this._logger.info('Registering providers');
        await Promise.all([
            this._defaultCommands.register(...defaultCommandProviders),
            this._defaultCommandGroups.register(...defaultCommandGroupsProviders),
            this._namespaces.register(...namespaceProviders)
        ]);
        this._logger.info('Finished registering providers');
    }
    async registerDefaultProviders(defaultCommandProviders: ICanProvideDefaultCommands[], defaultCommandGroupsProviders: ICanProvideDefaultCommandGroups[], namespaceProviders: ICanProvideNamespaces[]) {
        this._logger.info('Registering default providers');
        await Promise.all([
            this._defaultCommands.registerDefault(...defaultCommandProviders),
            this._defaultCommandGroups.registerDefault(...defaultCommandGroupsProviders),
            this._namespaces.registerDefault(...namespaceProviders)
        ]);
        this._logger.info('Finished registering default providers');
    }

    private addBoilerplateCommandsToNamespaces(namespaces: INamespace[]) {
        namespaces.filter(_ => _.hasBoilerplates).forEach(_ => {
            _.addDefaultCommands(this._defaultCommands.commands.filter(_ => _.isBoilerplatesCommand));
            _.addDefaultCommandGroups(this._defaultCommandGroups.commandGroups.filter(_ => _.isBoilerplatesCommandGroup));
        });
    }

    private async getCommandContext(allArguments: string[]): Promise<{ command: ICommand, commandArguments: string[], namespace?: string}> {
        let [firstArgument, ...restArguments] = allArguments;
        let namespace = this.namespaces.find(_ => _.name === firstArgument);
        if (namespace) {
            let nextArgument = restArguments.shift();
            if (!nextArgument) throw new NoMatchingCommand(firstArgument);
            firstArgument = nextArgument;
            return await this.getCommandContextFromNamespace(firstArgument, restArguments, namespace);
        }
        let commandGroup = this.commandGroups.find(_ => _.name === firstArgument);
        if (commandGroup) {
            let nextArgument = restArguments.shift();
            if (!nextArgument) throw new NoMatchingCommand(firstArgument);
            firstArgument = nextArgument;
            return await this.getCommandContextFromCommandGroup(firstArgument, restArguments, commandGroup);
        }
        let command = this.commands.find(_ => _.name);
        if (command) return {command, commandArguments: restArguments};

        throw new NoMatchingCommand(firstArgument);
    }

    private async getCommandContextFromNamespace(firstArgument: string, restArguments: string[], namespace: INamespace): Promise<{ command: ICommand, commandArguments: string[], namespace?: string }> {
        let commandGroup = this.commandGroups.find(_ => _.name === firstArgument);
        if (commandGroup) {
            let nextArgument = restArguments.shift();
            if (!nextArgument) throw new NoMatchingCommand(firstArgument, namespace.name);
            firstArgument = nextArgument;
            return await this.getCommandContextFromCommandGroup(firstArgument, restArguments, commandGroup, namespace.name);
        }
        let command = this.commands.find(_ => _.name);
        if (command) return {command, commandArguments: restArguments, namespace: namespace.name};

        throw new NoMatchingCommand(firstArgument, namespace.name);
    }

    private async getCommandContextFromCommandGroup(firstArgument: string, restArguments: string[], commandGroup: ICommandGroup, namespace?: string): Promise<{ command: ICommand, commandArguments: string[], namespace?: string }> {
        let command = (await commandGroup.getCommands()).find(_ => _.name);
        if (command) return {command, commandArguments: restArguments, namespace};

        throw new NoMatchingCommand(firstArgument, namespace, commandGroup.name);
    }
}