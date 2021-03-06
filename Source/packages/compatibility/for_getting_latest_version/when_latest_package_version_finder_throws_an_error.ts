/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { NullBusyIndicator } from '@dolittle/tooling.common.utilities';
import sinon from 'sinon';
import { expect } from 'chai';
import { getLatestVersion } from '../../internal';

describe('When latest package version finder throws an error', () => {
    let exception: Error;
    const error = new Error('some error');
    before(async () => {
        try {
            await getLatestVersion('name', {find: sinon.stub().rejects(error)}, {isConnected: sinon.stub().resolves(true)}, new NullBusyIndicator());
        }
        catch (error) {
            exception = error;
        }
    });

    it('Should throw an exception', () => expect(exception).to.not.be.undefined);
    it('Should throw the correct Error', () => exception.should.be.equal(error));
});
