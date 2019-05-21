/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { path_with_one_feature } from './given/path_with_one_feature.given';
import { determineDestination } from '../../../../helpers';
const path = require('path');

describe('when creating artifact without a feature from a path with one feature', () => {
    let context = null;
    let result = '';
    (beforeEach => {
        context = new path_with_one_feature();
        result = determineDestination(context.area, context.language, context.name, context.cwd, context.boundedContextPath, context.dolittleConfig);
    })();
    it('Should determine the correct destination', () => result.destination.should.equal(path.join(context.boundedContextRoot, context.dolittleConfig[context.language][context.area], context.featureSegments.split('.').join(path.sep) + path.sep)));
});