/********************************************************************************
 * Copyright (C) 2019 Red Hat, Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { ChePluginMetadata } from '../che-protocol';

export namespace PluginFilter {

    // @installed
    // @builtin
    // @enabled
    // @disabled
    export function hasType(filter: string, type: string): boolean {
        if (filter) {
            const filters = filter.split(' ');
            const found = filters.find(value => value === type);
            return found !== undefined;
        }

        return false;
    }

    export function filterByType(plugins: ChePluginMetadata[], type: string): ChePluginMetadata[] {
        return plugins.filter(plugin => {
            const regex = / /gi;
            const t = plugin.type.toLowerCase().replace(regex, '_');
            return t === type;
        });
    }

    export function filterByText(plugins: ChePluginMetadata[], text: string): ChePluginMetadata[] {
        return plugins;
    }

    export function filterPlugins(plugins: ChePluginMetadata[], filter: string): ChePluginMetadata[] {
        let filteredPlugins = plugins;
        const filters = filter.split(' ');

        filters.forEach(f => {
            if (f) {
                if (f.startsWith('@')) {
                    if (f.startsWith('@type:')) {
                        const type = f.substring('@type:'.length);
                        filteredPlugins = PluginFilter.filterByType(filteredPlugins, type);
                    }
                } else {
                    filteredPlugins = PluginFilter.filterByText(filteredPlugins, f);
                }
            }
        });

        return filteredPlugins;
    }

}
