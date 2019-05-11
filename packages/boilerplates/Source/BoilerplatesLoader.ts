/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import path from 'path';
import * as FsExtra from 'fs-extra';
import {Logger} from 'winston';
import { Boilerplate, boilerplateContentFolderName } from './Boilerplate';
import { Dependency } from '@dolittle/tooling.common.dependencies';
import { boilerplatesConfig } from './index';
import { artifactsBoilerplateType } from './artifacts/ArtifactsManager';
import { BaseBoilerplate } from './BaseBoilerplate';
import { ArtifactsBoilerplate } from './ArtifactsBoilerplate';
import { Scripts } from './Scripts';
import { IBoilerplatesLoader } from './IBoilerplatesLoader';
import { Folders } from '@dolittle/tooling.common.utilities';

const binaryFiles = [
    '.jpg',
    '.png',
    '.obj',
    '.dll',
    '.bin',
    '.exe',
    '.ttf'
];

/**
 * Represents the manager of boiler plates
 */
export class BoilerplatesLoader implements IBoilerplatesLoader {
    
    
    private _folders: Folders;
    private _fileSystem: typeof FsExtra;
    private _logger: Logger;
    private _loadedBoilerplates!: BaseBoilerplate[];

    /**
     * Initializes a new instance of {BoilerplatesManager}
     * @param {Folders} folders
     * @param {typeof FsExtra} fileSystem
     * @param {Logger} logger
     * @param {typeof Handlebars} handlebars
     */
    constructor(folders: Folders, fileSystem: typeof FsExtra, logger: Logger) {
        this._folders = folders;
        this._fileSystem = fileSystem;
        this._logger = logger;

        if (! fileSystem.existsSync(boilerplatesConfig.path)) {
            boilerplatesConfig.store = boilerplatesConfig.store;
        }
    }
    /**
     * @inheritdoc
     *
     * @memberof BoilerplatesLoader
     */
    needsReload = true;
    /**
     * @inheritdoc
     *
     * @readonly
     * @type {string}
     * @memberof BoilerplatesLoader
     */
    get boilerplatesPath(): string {return boilerplatesConfig.path;}
    /**
     * @inheritdoc
     *
     * @readonly
     * @type {BaseBoilerplate[]}
     * @memberof BoilerplatesLoader
     */
    get loadedBoilerplates(): BaseBoilerplate[] {
        if (!this._loadedBoilerplates || this.needsReload) return this.load();
        return this._loadedBoilerplates;
    }

    /**
     * @inheritdoc
     * 
     * @memberof BoilerplatesLoader
     */
    load(): BaseBoilerplate[] {
        this._logger.info('Loading boilerplates')
        this._loadedBoilerplates = [];
        let boilerplatesConfigObject = boilerplatesConfig.store;

        Object.keys(boilerplatesConfigObject).forEach(key => {
            let folderPath = path.resolve(boilerplatesConfigObject[key]);
            this._loadedBoilerplates.push(this.readBoilerplateFromFolder(folderPath));
        });
        this.needsReload = false;
        return this._loadedBoilerplates;
    }
    
    /**
     * Reads the contents of a folder and returns the in-memory representation of the boilerplate.
     *
     * @param {string} folder The folder of a boilerplate
     * @returns {BaseBoilerplate}
     * @memberof BoilerplatesManager
     */
    private readBoilerplateFromFolder(folder: string): BaseBoilerplate {
        let boilerplatePath = path.join(folder, 'boilerplate.json');
        
        if (!this._fileSystem.existsSync(boilerplatePath)) throw new Error(`Could not find boilerplate configuration in '${folder}'`);

        let boilerplateObject = JSON.parse(this._fileSystem.readFileSync(boilerplatePath, 'utf8'));

        return this.parseBoilerplate(boilerplateObject, boilerplatePath);
    }

    /**
     * Parses a boilerplate read from a boilerplate package correctly
     * 
     * @param {*} boilerplateObject
     * @param {string} boilerplatePath The path of the boilerplate.json file
     * @returns {BaseBoilerplate}
     */
    private parseBoilerplate(boilerplateObject: any, boilerplatePath: string): BaseBoilerplate {
        if (boilerplateObject.type === artifactsBoilerplateType) {
            return new ArtifactsBoilerplate(
                boilerplateObject.language || 'any',
                boilerplateObject.name,
                boilerplateObject.description,
                boilerplateObject.type,
                boilerplateObject.dependencies !== undefined? 
                    Object.keys(boilerplateObject.dependencies).map(key => Dependency.fromJson(boilerplateObject.dependencies[key], key))
                    : [],
                boilerplateObject.namespace,
                Scripts.fromJson(boilerplateObject.scripts),
                boilerplatePath,
                this._folders,
                this._fileSystem
            );
        }
        else {
            let bindings = this.getBoilerplateBindings(boilerplatePath);
            return new Boilerplate(
                boilerplateObject.language || 'any',
                boilerplateObject.name,
                boilerplateObject.description,
                boilerplateObject.type,
                boilerplateObject.dependencies !== undefined? 
                    Object.keys(boilerplateObject.dependencies).map(key => Dependency.fromJson(boilerplateObject.dependencies[key], key))
                    : [],
                boilerplateObject.namespace,
                Scripts.fromJson(boilerplateObject.scripts),
                boilerplateObject.target,
                boilerplateObject.framework,
                boilerplateObject.parent,
                boilerplatePath,
                bindings.pathsNeedingBinding,
                bindings.filesNeedingBinding)
        }
    }
    /**
     * Gets the path and file bindings for a boilerplate
     * 
     * @param {string} boilerplatePath The path to the boilerplate.json file
     * @returns {{pathsNeedingBinding: string[], filesNeedingBinding: string[]}} 
     */
    private getBoilerplateBindings(boilerplatePath: string): { pathsNeedingBinding: string[]; filesNeedingBinding: string[]; } {
        let pathsNeedingBinding: string[] = [];
        let filesNeedingBinding: string[] = [];
        const contentFolder = path.join(path.dirname(boilerplatePath), boilerplateContentFolderName);
        if (! this._fileSystem.existsSync(contentFolder)) {
            throw new Error(`Missing folder with name ${boilerplateContentFolderName} at root level when parsing boilerplate at path ${boilerplatePath}`);
        }
        
        let paths = this._folders.getFoldersAndFilesRecursivelyIn(contentFolder);
        paths = paths.filter((_: string) => {
            let include = true;
            binaryFiles.forEach(b => {
                if (_.toLowerCase().indexOf(b) > 0) include = false;
            });
            return include;
        });
        pathsNeedingBinding = paths.filter((_: string) => _.indexOf('{{') > 0).map((_: string) => _.substr(contentFolder.length + 1));
        paths.forEach((_: string) => {
            let stat = this._fileSystem.statSync(_);
            if (!stat.isDirectory()) {
                let file = this._fileSystem.readFileSync(_);
                if (file.indexOf('{{') >= 0) {
                    filesNeedingBinding.push(_.substr(contentFolder.length + 1));
                }
            }
        });
        let ret = {
            pathsNeedingBinding,
            filesNeedingBinding
        };
        return ret;
        
    }
}