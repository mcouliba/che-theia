/*********************************************************************
 * Copyright (c) 2018-2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as theia from '@theia/plugin';
import { LanguagesExtImpl } from '@theia/plugin-ext/lib/plugin/languages';
import URI from 'vscode-uri';

export class LanguagesContainerAware {

    static makeLanguagesContainerAware(languagesExt: LanguagesExtImpl) {
        const languagesContainerAware = new LanguagesContainerAware();
        languagesContainerAware.overrideDefinitionProvider(languagesExt);
    }

    overrideDefinitionProvider(languagesExt: LanguagesExtImpl) {
        const originalRegisterDefinitionProvider = languagesExt.registerDefinitionProvider.bind(languagesExt);
        const registerDefinitionProvider = (selector: theia.DocumentSelector, provider: theia.DefinitionProvider) =>
            originalRegisterDefinitionProvider(selector, {
                provideDefinition: async (
                    document: theia.TextDocument,
                    position: theia.Position,
                    token: theia.CancellationToken | undefined
                ): Promise<theia.Definition | theia.DefinitionLink[]> => {

                    const result = await provider.provideDefinition(document, position, token);
                    if (Array.isArray(result)) {
                        // tslint:disable-next-line: no-any
                        (result as any[]).forEach(value => this.overrideResult(value));
                    } else {
                        this.overrideResult(result);
                    }

                    return result;
                }
            });

        languagesExt.registerDefinitionProvider = registerDefinitionProvider;
    }

    overrideResult(reference: theia.Location | theia.DefinitionLink): void {
        if ('uri' in reference) {
            reference.uri = this.overrideUri(reference.uri);
        } else {
            reference.targetUri = this.overrideUri(reference.targetUri);
        }
    }

    overrideUri(uri: URI | theia.Uri) {
        if (!uri.path.startsWith('/projects')) {
            const newScheme = 'file-sidecar-' + process.env.CHE_MACHINE_NAME;
            uri = uri.with({ scheme: newScheme });
        }
        return uri;
    }
}
