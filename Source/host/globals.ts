/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import spawn from 'cross-spawn';
import { IInitializer, Initializer, ICanFindLocalToolingPlatform, LocalNpmToolingPlatformFinder, ICanDownloadToolingPlatform, NpmToolingPlatformDownloader } from './internal';

const commonToolingPackages = [
    '@dolittle/tooling.common',
    '@dolittle/tooling.common.boilerplates',
    '@dolittle/tooling.common.commands',
    '@dolittle/tooling.common.configurations',
    '@dolittle/tooling.common.dependencies',
    '@dolittle/tooling.common.files',
    '@dolittle/tooling.common.logging',
    '@dolittle/tooling.common.login',
    '@dolittle/tooling.common.packages',
    '@dolittle/tooling.common.plugins',
    '@dolittle/tooling.common.utilities',
];

const npmRootSpawn = spawn.sync('npm', ['root', '-g']);
if (npmRootSpawn.error) throw npmRootSpawn.error;
const nodeModulesPath = npmRootSpawn.stdout.toString().replace(/\n$/, '');

const toolingPackage = process.env.WALLABY_TESTING ? require('./package.json') : require('../package.json');

const localToolingPlatformFinder: ICanFindLocalToolingPlatform = new LocalNpmToolingPlatformFinder(nodeModulesPath, commonToolingPackages);
const toolingPlatformDownloader: ICanDownloadToolingPlatform = new NpmToolingPlatformDownloader(commonToolingPackages);
export let initializer: IInitializer = new Initializer(toolingPackage, localToolingPlatformFinder, toolingPlatformDownloader);
