
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Boilerplate } from "../internal";

 export type CreatedBoundedContextDetails = {
    /**
     * The boiler plate that was created
     *
     * @type {Boilerplate}
     */
    boilerplate: Boilerplate;
    /**
     * The destination of of the created boiler plate
     *
     * @type {string}
     */
    destination: string;
 }