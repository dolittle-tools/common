/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Format } from 'logform';
import { ILoggers, ConsoleLogger, FileLogger, ICanLogMessages } from './internal';

/**
 * Represents an instance of {ILoggers}
 *
 * @export
 * @class Loggers
 * @implements {ILoggers}
 */
export class Loggers implements ILoggers {
    private _exitOnError = false;
    private _fileLoggers: FileLogger[] = [];

    /**
     * Instantiates an instance of {Loggers}.
     * @param {(ICanLogMessages | undefined)} _consoleLogger
     */
    constructor(private _consoleLogger: ICanLogMessages | undefined) {}

    get loggers() {
        return this._consoleLogger ?
                [this._consoleLogger, ...this._fileLoggers]
                : this._fileLoggers;
    }

    set exitOnError(val: boolean) {
        this._exitOnError = val;
        this.loggers.forEach(_ => _.exitOnError = val);
    }

    get exitOnError() {
        return this._exitOnError;
    }

    get logFilePaths() {
        const paths: string[] = [];
        this.loggers.forEach(_ => paths.push(..._.logFilePaths));
        return paths;
    }

    info(message: string) {
        this.loggers.forEach(_ => _.info(message));
    }

    warn(message: string) {
        this.loggers.forEach(_ => _.warn(message));
    }

    error(message: string) {
        this.loggers.forEach(_ => _.error(message));
    }

    createNewConsoleLogger(level?: string, format?: Format) {
        this._consoleLogger = new ConsoleLogger(this._exitOnError, level, format);
    }

    removeConsoleLogger() {
        this._consoleLogger = undefined;
    }

    createNewFileLogger(filePath: string, separateErrorFile?: boolean, level?: string, format?: Format) {
        this._fileLoggers.push(new FileLogger(this._exitOnError, filePath, separateErrorFile, level, format));
    }

    clear() {
        this._consoleLogger = undefined;
        this._fileLoggers = [];
    }

    turnOffLogging() {
        this.loggers.forEach(_ => _.turnOff());
    }

    turnOnLogging() {
        this.loggers.forEach(_ => _.turnOn());
    }
}
