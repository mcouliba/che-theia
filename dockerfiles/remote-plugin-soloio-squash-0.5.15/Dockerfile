# Copyright (c) 2019 Red Hat, Inc.
# This program and the accompanying materials are made
# available under the terms of the Eclipse Public License 2.0
# which is available at https://www.eclipse.org/legal/epl-2.0/
#
# SPDX-License-Identifier: EPL-2.0
#
# Contributors:
#   Red Hat, Inc. - initial API and implementation

FROM eclipse/che-theia-endpoint-runtime:7.0.0

ENV KUBECTL_VERSION=v1.13.3 \
    SQUASHCTL_VERSION=v0.5.15\
    OC_VERSION=4.2

# Preparation
RUN mkdir /lib64
# The installed `squash` and `oc` binaries were compiled with glibc and on Alpine that is not installed by default
RUN ln -s /lib/libc.musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2

# Install oc
RUN wget -qO- "https://mirror.openshift.com/pub/openshift-v4/clients/oc/${OC_VERSION}/linux/oc.tar.gz" | tar xvz -C /usr/local/bin && \
    oc version

# Install squashctl
RUN wget -qO /usr/local/bin/squashctl https://github.com/solo-io/squash/releases/download/${SQUASHCTL_VERSION}/squashctl-linux && \
    chmod +x /usr/local/bin/squashctl

# Install kubectl
ADD https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl /usr/local/bin/kubectl
RUN chmod +x /usr/local/bin/kubectl && \
    kubectl version --client

# Squash Config
COPY squash/ ${HOME}/.squash