/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { IConnectionChecker, requireInternet } from '@dolittle/tooling.common.packages';
import { ICanOutputMessages, IBusyIndicator } from '@dolittle/tooling.common.utilities';
import { Client, Issuer, custom } from 'openid-client';
import { ICanHandleAuthentication, UserInfoResponse } from '../../internal';

/**
 * Represents a base implementation of {ICanRetrieveTokens} which can retrieve tokens through OpenID Device Authorization Grant
 *
 * @export
 * @class OpenIDDeviceFlowAuthorizer
 * @implements {ICanRetrieveTokens}
 */
export abstract class OpenIDDeviceFlowAuthorizer implements ICanHandleAuthentication {

    /**
     * Instantiates an instance of {OpenIDDeviceFlowAuthorizer}.
     * @param {string} _discoveryDocumentURL The URL of the discovery document for creating an issuer
     * @param {string} _clientID
     * @param {string} _scope The scopes of the grant
     */
    constructor(private _discoveryDocumentURL: string, private _clientID: string, private _scope: string, private _connectionChecker: IConnectionChecker) {}

    async authenticate(outputter: ICanOutputMessages, busyIndicator: IBusyIndicator) {
        await requireInternet(this._connectionChecker, busyIndicator);
        const issuer = await Issuer.discover(this._discoveryDocumentURL);
        const client = new issuer.Client({
            client_id: this._clientID,
            token_endpoint_auth_method: 'none',
        });
        client[custom.clock_tolerance] = 10;
        const tokens = await this._requestTokens(client, outputter);
        const userInfo = await client.userinfo(tokens) as UserInfoResponse;

        return {tokens, userInfo};
    }

    private async _requestTokens(client: Client, outputter: ICanOutputMessages) {
        const handle = await client.deviceAuthorization({
            client_id: client.metadata.client_id,
            scope: this._scope
        });

        outputter.print(`Please go to '${handle.verification_uri}', choose your identity provider and use the code '${handle.user_code}' to login`);
        return handle.poll();
    }

}
