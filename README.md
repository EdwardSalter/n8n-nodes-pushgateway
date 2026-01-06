# n8n-nodes-pushgateway

This is an n8n community node. It lets you use _Prometheus Pushgateway_ in your n8n workflows.

_Prometheus Pushgateway_ is a service for pushing time series metrics from _n8n_ workflows to a Prometheus server.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

  -[x] Push metrics to Prometheus Pushgateway
  -[ ] TODO: Delete metrics from Prometheus Pushgateway

## Credentials

The host for the Prometheus Pushgateway is required to be set in the node credentials. Basic Auth credentials are optional.

## Compatibility

Tested on n8n v2.2.3.

## Usage

Add a Pushgateway node to your workflow and configure a credential it with the host of your Prometheus Pushgateway.

Upon adding a node, you can add one or more metrics to push to the Pushgateway including the name, help text, value and labels.

Global labels can be added which will automatically be added to all metrics pushed to the Pushgateway.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Pushgateway](https://github.com/prometheus/pushgateway)

## Version history

### 0.1.0
Initial release. Includes push operation only.
 


