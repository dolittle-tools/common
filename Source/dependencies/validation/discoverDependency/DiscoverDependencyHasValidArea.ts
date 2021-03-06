/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { areas } from '@dolittle/tooling.common.utilities';
import { InvalidField, IDiscoverDependency, DiscoverDependencyValidator, CannotValidateDependency } from '../../internal';

/**
 * Represents a concrete implementation of {DiscoverDependencyValidator} that validates that a discover dependency has a valid the 'fromArea' field
 *
 * @export
 * @class DependencyHasValidArea
 * @extends {DiscoverDependencyValidator}
 */
export class DiscoverDependencyHasValidArea extends DiscoverDependencyValidator {

    canValidate(dependency: IDiscoverDependency) {
        return super.canValidate(dependency) && dependency.fromArea !== undefined;
    }
    validate(dependency: IDiscoverDependency) {
        if (!this.canValidate(dependency)) throw new CannotValidateDependency(dependency, this);
        if (! areas.includes(dependency.fromArea!))
            throw new InvalidField(dependency, 'fromArea', `Expected 'fromArea' to be any of [${areas.join(', ')}]`);
    }

}
