# Deploying to Vercel

This repository exposes a stateless Streamable HTTP MCP endpoint through the root `app.ts` Express entrypoint.

## 1. Import the repository

Create a new Vercel project and import this GitHub repository. Select the `feat/vercel-streamable-http` branch while reviewing the pull request, or deploy `main` after the pull request is merged.

Vercel detects `app.ts` as the Express application entrypoint. No framework preset or custom build command is required.

## 2. Configure the Opsgenie API key

Add the following environment variable in **Project Settings → Environment Variables**:

```text
OPSGENIE_API_KEY=<your Opsgenie API key>
```

Apply it to Production and any Preview environments that should be able to call Opsgenie.

Do not place the key in the MCP URL, query string, source code, or ChatGPT prompt.

## 3. Deploy

After deployment, verify the health endpoint:

```bash
curl https://<your-project>.vercel.app/health
```

Expected response:

```json
{"status":"ok"}
```

The MCP endpoint is:

```text
https://<your-project>.vercel.app/mcp
```

## 4. Connect ChatGPT

In ChatGPT Developer Mode, create an MCP connection using the deployed `/mcp` URL.

This deployment currently relies on the server-side `OPSGENIE_API_KEY` environment variable and does not implement end-user OAuth. Restrict access at the Vercel or network layer before using it with sensitive production data.

## Local HTTP test

```bash
npm install
npm run build
OPSGENIE_API_KEY=... npm run start:http
```

Then connect an MCP inspector to:

```text
http://localhost:3000/mcp
```

## Why the HTTP transport is stateless

Vercel functions may execute consecutive requests on different instances. The HTTP handler therefore creates a fresh MCP server and transport for every POST request and does not use `Mcp-Session-Id` or an in-memory session map.
