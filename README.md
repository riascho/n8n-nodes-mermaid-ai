# n8n-nodes-mermaid-ai

This is an n8n community node. It lets you use the [Mermaid API](https://api.mermaid.ai/v1/docs) in your n8n workflows.

The Mermaid API checks, renders, writes and fixes [Mermaid](https://mermaid.js.org/) diagrams. You can render diagram code to SVG, PNG, PDF or text, and use Mermaid AI to write diagram code from a description or fix code that does not parse.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

> **Beta:** the Mermaid API is in beta. Its fields, limits and served Mermaid versions may change, and Mermaid advises against building a production dependency on it yet.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. The package name is `n8n-nodes-mermaid-ai`.

## Operations

Each call spends API credits from your Mermaid balance. The costs below are the ones the API published at the time of writing. Use **Balance > Get** to see the current costs.

| Resource | Operation | What it does | Credits |
| --- | --- | --- | --- |
| Balance | Get | Get the credits left this month, when they reset, and what each endpoint costs | 0 |
| Diagram | Validate | Check whether diagram code is valid. If it is not, the output says why and where it breaks | 1 |
| Diagram | Render | Render diagram code to an SVG, PNG, PDF or text file | 5 |
| Diagram | Generate | Use Mermaid AI to write diagram code from a description | 25, only when the result is valid |
| Diagram | Repair | Use Mermaid AI to fix invalid diagram code | 25, or 1 when the code is already valid |

### Validate

- **Code**: the diagram code to check.
- **Options**: Mermaid Config, Mermaid Version.

The output is `{ valid, diagramType, error }`. Invalid code is a normal output item with `valid: false`, not a failed node, so you can branch on it with an If node.

### Render

- **Code**: the diagram code to render.
- **Format**: SVG, PNG, PDF or ASCII.
- **Options**:
  - PNG: **Scale** (0.5 to 4, default 2) and **Background** (`transparent`, a CSS color name, a hex value, or an `rgb()` or `hsl()` value; default `white`).
  - PDF: **Fit Page to Diagram** (default on). Turn it off to get one A4 page.
  - ASCII: **Character Set**, **Padding** and **Max Width**.
  - All formats: **Mermaid Config**, **Mermaid Version**, **Use Cache**, and **Put Output File in Field** (default `data`).

The file is the item's binary data, named `diagram.svg`, `diagram.png`, `diagram.pdf` or `diagram.txt`. The JSON holds the rest of the API's answer: `format`, `contentType`, `diagramType`, `mermaidVersion`, `requestId` and `cacheStatus`. ASCII output also has the text in `text`.

ASCII is experimental. It only works with Mermaid `13.0.0-alpha`, so the node always sends that version for ASCII and ignores Mermaid Version. Mermaid 13 cannot draw every diagram type as text yet.

Render charges credits even when the diagram code is invalid. Run Validate first if you are not sure the code is valid.

### Generate

- **Prompt**: what the diagram should show, in plain language, up to 10,000 characters.
- **Options**: **Diagram Type** (Mermaid AI picks one if not set) and **Semantic Coloring**.

The output is `{ valid, code, diagramType, error, followUpQuestion }`. When Mermaid AI needs more detail it returns `valid: false` with a `followUpQuestion`. Refine the prompt and try again. You are only charged when `valid` is `true`.

### Repair

- **Code**: the code to fix, up to 20,000 characters.
- **Options**: Mermaid Config.

The output is `{ valid, code, diagramType, error }`. Code that is already valid comes back unchanged and costs what Validate costs.

### Mermaid Config and Mermaid Version

**Mermaid Config** takes a standard [Mermaid config](https://mermaid.js.org/config/schema-docs/config.html) object as JSON, for example `{"theme": "forest"}`. The API refuses the keys `secure`, `securityLevel`, `startOnLoad`, `suppressErrorRendering` and `dompurifyConfig`.

**Mermaid Version** pins the Mermaid release to use, for example `11.17.2`. Leave it empty for the latest version. The served versions change during the beta. At the time of writing they were `12.1.0` (latest), `11.17.2` and `13.0.0-alpha`.

## Credentials

You need a Mermaid API key. Any [Mermaid Chart](https://mermaid.ai/) user can create one.

1. Sign in to the [Mermaid API console](https://api.mermaid.ai/console).
2. Create an API key and copy it. It is shown only once.
3. In n8n, create a **Mermaid AI API** credential and paste the key into **API Key**.

n8n tests the credential by calling Balance, which costs no credits.

Personal keys spend your own balance. Organization keys spend the organization's balance. Your Mermaid Chart plan sets the monthly credit allowance and how many calls a key can make per minute. The Basic plan includes 500 credits a month and 20 calls a minute.

## Compatibility

Tested with n8n 2.47.7.

## Usage

### Example: describe a diagram and get a PNG

1. **Mermaid AI** node, **Diagram > Generate**. Prompt: `Our order flow: the customer pays, the warehouse ships, the customer gets a tracking email`.
2. **If** node: continue when `{{ $json.valid }}` is true. On the false branch, `{{ $json.followUpQuestion }}` or `{{ $json.error.message }}` says what went wrong.
3. **Mermaid AI** node, **Diagram > Render**. Code: `{{ $json.code }}`, Format: PNG.
4. Send the `data` binary field on, for example as an email attachment or a Slack file upload.

### Errors and rate limits

When the API refuses a call, the node shows the API's message followed by its error code, for example `The call costs more API credits than the balance holds. [ERR_LIMIT_BALANCE]`, and adds a hint on what to do next. The [error reference](https://api.mermaid.ai/v1/errors.json) lists every code.

If a key makes too many calls in a minute, the API answers `ERR_LIMIT_BURST` and says how long to wait. Turn on **Retry On Fail** in the node settings and set **Wait Between Tries** to a few seconds, or use the batching settings in the node options to space out calls.

Render can take up to about 30 seconds and Generate and Repair up to about 55 seconds.

### Use as an AI agent tool

The node can be used as a tool by an AI Agent. Validate, Generate and Repair return plain JSON that an agent can read. For Render, an agent works with the JSON fields rather than the file; ASCII renders include the diagram as text in `text`.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Mermaid API documentation](https://api.mermaid.ai/v1/docs)
* [Mermaid API OpenAPI specification](https://api.mermaid.ai/v1/openapi.json)
* [Mermaid syntax documentation](https://mermaid.js.org/intro/)

## Version history

### 0.1.1

First release: Balance Get and Diagram Validate, Render, Generate and Repair.
