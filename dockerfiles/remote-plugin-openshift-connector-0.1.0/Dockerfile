# Copyright (c) 2019 Red Hat, Inc.
# This program and the accompanying materials are made
# available under the terms of the Eclipse Public License 2.0
# which is available at https://www.eclipse.org/legal/epl-2.0/
#
# SPDX-License-Identifier: EPL-2.0
#
# Contributors:
#   Red Hat, Inc. - initial API and implementation

FROM eclipse/che-theia-endpoint-runtime:7.2.0

ENV GLIBC_VERSION=2.29-r0 \
    ODO_VERSION=v1.0.0-beta6 \
    OC_VERSION=4.2

# the plugin executes the commands relying on Bash
RUN apk add --no-cache bash && \
    # install glibc compatibility layer package for Alpine Linux
    # see https://github.com/openshift/origin/issues/18942 for the details
    wget -O glibc-${GLIBC_VERSION}.apk https://github.com/andyshinn/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk && \
    apk --update --allow-untrusted add glibc-${GLIBC_VERSION}.apk && \
    rm -f glibc-${GLIBC_VERSION}.apk && \
    # install odo
    wget -O /usr/local/bin/odo https://github.com/openshift/odo/releases/download/${ODO_VERSION}/odo-linux-amd64 && \
    chmod +x /usr/local/bin/odo && \
    odo version && \
    # install oc
    wget -qO- https://mirror.openshift.com/pub/openshift-v4/clients/oc/${OC_VERSION}/linux/oc.tar.gz | tar xvz -C /usr/local/bin && \
    oc version && \
    # CA certificates
    apk --update --allow-untrusted add ca-certificates && rm -rf /var/cache/apk/*
