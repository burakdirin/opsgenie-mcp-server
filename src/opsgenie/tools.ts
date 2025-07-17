import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  acknowledgeAlert,
  addDetailsToAlert,
  addNoteToAlert,
  closeAlert,
  createAlert,
  listAlertLogs,
  listAlertNotes,
  listAlerts,
  OpsgenieAPIError,
} from './api.js';

// Zod schemas for validation
const RecipientSchema = z.object({
  type: z.enum(['user', 'team', 'escalation', 'schedule']),
  id: z.string().optional(),
  name: z.string().optional(),
});

const CreateAlertSchema = z.object({
  apiKey: z.string().describe('Opsgenie API key'),
  message: z.string().describe('Message of the alert'),
  alias: z
    .string()
    .optional()
    .describe('Client-defined identifier of the alert'),
  description: z.string().optional().describe('Description field of the alert'),
  responders: z
    .array(RecipientSchema)
    .optional()
    .describe('Responders that the alert will be routed to'),
  visibleTo: z
    .array(RecipientSchema)
    .optional()
    .describe('Teams and users that the alert will become visible to'),
  actions: z
    .array(z.string())
    .optional()
    .describe('Custom actions that will be available for the alert'),
  tags: z.array(z.string()).optional().describe('Tags of the alert'),
  details: z
    .record(z.string())
    .optional()
    .describe('Map of key-value pairs to use as custom properties'),
  entity: z.string().optional().describe('Entity field of the alert'),
  priority: z
    .enum(['P1', 'P2', 'P3', 'P4', 'P5'])
    .optional()
    .describe('Priority level of the alert'),
  user: z.string().optional().describe('Display name of the request owner'),
  note: z
    .string()
    .optional()
    .describe('Additional note that will be added while creating the alert'),
  source: z.string().optional().describe('Source field of the alert'),
});

const ListAlertsSchema = z.object({
  apiKey: z.string().describe('Opsgenie API key'),
  query: z
    .string()
    .optional()
    .describe('Search query to apply while filtering the alerts'),
  searchIdentifier: z
    .string()
    .optional()
    .describe('Identifier of the saved search query'),
  searchIdentifierType: z
    .enum(['id', 'name'])
    .optional()
    .describe('Identifier type of the saved search query'),
  offset: z
    .number()
    .min(0)
    .optional()
    .describe('Start index of the result set (for pagination)'),
  limit: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .describe('Maximum number of items to provide in the result'),
  sort: z
    .string()
    .optional()
    .describe('Name of the field that result set will be sorted by'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Sorting order of the result set'),
});

const AlertActionSchema = z.object({
  apiKey: z.string().describe('Opsgenie API key'),
  identifier: z.string().describe('Alert identifier (id, tiny id, or alias)'),
  identifierType: z
    .enum(['id', 'name', 'tiny'])
    .optional()
    .describe('Type of identifier'),
  user: z.string().optional().describe('Display name of the request owner'),
  note: z.string().optional().describe('Additional note'),
  source: z.string().optional().describe('Source field'),
});

const AddNoteSchema = z.object({
  apiKey: z.string().describe('Opsgenie API key'),
  identifier: z.string().describe('Alert identifier (id, tiny id, or alias)'),
  identifierType: z
    .enum(['id', 'name', 'tiny'])
    .optional()
    .describe('Type of identifier'),
  note: z.string().describe('Note to add to the alert'),
  user: z.string().optional().describe('Display name of the request owner'),
  source: z.string().optional().describe('Source field'),
});

const AddDetailsSchema = z.object({
  apiKey: z.string().describe('Opsgenie API key'),
  identifier: z.string().describe('Alert identifier (id, tiny id, or alias)'),
  identifierType: z
    .enum(['id', 'name', 'tiny'])
    .optional()
    .describe('Type of identifier'),
  details: z
    .record(z.string())
    .describe('Key-value pairs to add as custom properties'),
  user: z.string().optional().describe('Display name of the request owner'),
  note: z.string().optional().describe('Additional note'),
  source: z.string().optional().describe('Source field'),
});

const ListNotesLogsSchema = z.object({
  apiKey: z.string().describe('Opsgenie API key'),
  identifier: z.string().describe('Alert identifier (id, tiny id, or alias)'),
  identifierType: z
    .enum(['id', 'name', 'tiny'])
    .optional()
    .describe('Type of identifier'),
  offset: z
    .number()
    .min(0)
    .optional()
    .describe('Start index of the result set'),
  direction: z.enum(['next', 'prev']).optional().describe('Page direction'),
  limit: z
    .number()
    .min(1)
    .optional()
    .describe('Maximum number of items to provide'),
  order: z.enum(['asc', 'desc']).optional().describe('Sorting order'),
});

// Helper function to format API errors
function formatApiError(error: unknown): string {
  if (error instanceof OpsgenieAPIError) {
    return `Opsgenie API Error (${error.status}): ${error.message}`;
  }
  return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
}

export function registerOpsgenieTools(server: McpServer) {
  // 1. List Alerts - GET /v2/alerts
  server.tool(
    'opsgenie_list_alerts',
    'List alerts from Opsgenie',
    ListAlertsSchema.shape,
    async args => {
      try {
        const { apiKey, ...params } = args;
        const response = await listAlerts(apiKey, params);

        return {
          content: [
            {
              type: 'text' as const,
              text: `Found ${response.data.length} alerts:\n\n${response.data
                .map(
                  alert =>
                    `• ${alert.message} (${alert.id})\n  Status: ${alert.status} | Priority: ${alert.priority}\n  Created: ${alert.createdAt}`
                )
                .join('\n\n')}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: formatApiError(error),
            },
          ],
        };
      }
    }
  );

  // 2. Create Alert - POST /v2/alerts
  server.tool(
    'opsgenie_create_alert',
    'Create a new alert in Opsgenie',
    CreateAlertSchema.shape,
    async args => {
      try {
        const { apiKey, ...payload } = args;
        const response = await createAlert(apiKey, payload);

        return {
          content: [
            {
              type: 'text' as const,
              text: `Alert created successfully!\nRequest ID: ${response.requestId}\nResult: ${response.result}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: formatApiError(error),
            },
          ],
        };
      }
    }
  );

  // 3. Acknowledge Alert - POST /v2/alerts/{identifier}/acknowledge
  server.tool(
    'opsgenie_acknowledge_alert',
    'Acknowledge an alert in Opsgenie',
    AlertActionSchema.shape,
    async args => {
      try {
        const { apiKey, identifier, identifierType = 'id', ...payload } = args;
        const response = await acknowledgeAlert(
          apiKey,
          identifier,
          payload,
          identifierType
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: `Alert acknowledged successfully!\nRequest ID: ${response.requestId}\nResult: ${response.result}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: formatApiError(error),
            },
          ],
        };
      }
    }
  );

  // 4. Close Alert - POST /v2/alerts/{identifier}/close
  server.tool(
    'opsgenie_close_alert',
    'Close an alert in Opsgenie',
    AlertActionSchema.shape,
    async args => {
      try {
        const { apiKey, identifier, identifierType = 'id', ...payload } = args;
        const response = await closeAlert(
          apiKey,
          identifier,
          payload,
          identifierType
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: `Alert closed successfully!\nRequest ID: ${response.requestId}\nResult: ${response.result}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: formatApiError(error),
            },
          ],
        };
      }
    }
  );

  // 5. List Alert Notes - GET /v2/alerts/{identifier}/notes
  server.tool(
    'opsgenie_list_alert_notes',
    'List notes for an alert in Opsgenie',
    ListNotesLogsSchema.shape,
    async args => {
      try {
        const { apiKey, identifier, identifierType = 'id', ...params } = args;
        const response = await listAlertNotes(
          apiKey,
          identifier,
          params,
          identifierType
        );

        return {
          content: [
            {
              type: 'text' as const,
              text:
                response.data.length > 0
                  ? `Found ${response.data.length} notes:\n\n${response.data
                      .map(
                        note =>
                          `• ${note.note}\n  By: ${note.owner} at ${note.createdAt}`
                      )
                      .join('\n\n')}`
                  : 'No notes found for this alert.',
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: formatApiError(error),
            },
          ],
        };
      }
    }
  );

  // 6. Add Note - POST /v2/alerts/{identifier}/notes
  server.tool(
    'opsgenie_add_note',
    'Add a note to an alert in Opsgenie',
    AddNoteSchema.shape,
    async args => {
      try {
        const { apiKey, identifier, identifierType = 'id', ...payload } = args;
        const response = await addNoteToAlert(
          apiKey,
          identifier,
          payload,
          identifierType
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: `Note added successfully!\nRequest ID: ${response.requestId}\nResult: ${response.result}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: formatApiError(error),
            },
          ],
        };
      }
    }
  );

  // 7. List Alert Logs - GET /v2/alerts/{identifier}/logs
  server.tool(
    'opsgenie_list_alert_logs',
    'List logs for an alert in Opsgenie',
    ListNotesLogsSchema.shape,
    async args => {
      try {
        const { apiKey, identifier, identifierType = 'id', ...params } = args;
        const response = await listAlertLogs(
          apiKey,
          identifier,
          params,
          identifierType
        );

        return {
          content: [
            {
              type: 'text' as const,
              text:
                response.data.length > 0
                  ? `Found ${response.data.length} log entries:\n\n${response.data
                      .map(
                        log =>
                          `• [${log.type}] ${log.log}\n  By: ${log.owner} at ${log.createdAt}`
                      )
                      .join('\n\n')}`
                  : 'No log entries found for this alert.',
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: formatApiError(error),
            },
          ],
        };
      }
    }
  );

  // 8. Add Details - POST /v2/alerts/{identifier}/details
  server.tool(
    'opsgenie_add_details',
    'Add custom details to an alert in Opsgenie',
    AddDetailsSchema.shape,
    async args => {
      try {
        const { apiKey, identifier, identifierType = 'id', ...payload } = args;
        const response = await addDetailsToAlert(
          apiKey,
          identifier,
          payload,
          identifierType
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: `Details added successfully!\nRequest ID: ${response.requestId}\nResult: ${response.result}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: formatApiError(error),
            },
          ],
        };
      }
    }
  );
}
