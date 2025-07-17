import type {
  AcceptedResponse,
  AcknowledgeAlertPayload,
  AddDetailsToAlertPayload,
  AddNoteToAlertPayload,
  CloseAlertPayload,
  CreateAlertPayload,
  ListAlertLogsParams,
  ListAlertLogsResponse,
  ListAlertNotesParams,
  ListAlertNotesResponse,
  ListAlertsParams,
  ListAlertsResponse,
} from './types.js';

const OPSGENIE_API_BASE = 'https://api.opsgenie.com';

export class OpsgenieAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'OpsgenieAPIError';
    // Prevent unused parameter warnings
    void status;
    void response;
  }
}

// Helper function for making Opsgenie API requests
async function makeOpsgenieRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    params?: object;
    apiKey: string;
  }
): Promise<T> {
  const { method = 'GET', body, params, apiKey } = options;

  // Build URL with query parameters
  const url = new URL(`${OPSGENIE_API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          url.searchParams.append(key, value.join(','));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });
  }

  const headers: HeadersInit = {
    Authorization: `GenieKey ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const requestOptions: RequestInit = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData = null;

      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If JSON parsing fails, keep the original error message
      }

      throw new OpsgenieAPIError(errorMessage, response.status, errorData);
    }

    // Handle 202 responses (accepted) that might have different structure
    if (response.status === 202) {
      return (await response.json()) as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof OpsgenieAPIError) {
      throw error;
    }
    throw new OpsgenieAPIError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0
    );
  }
}

// API Functions

/**
 * List alerts
 * GET /v2/alerts
 */
export async function listAlerts(
  apiKey: string,
  params?: ListAlertsParams
): Promise<ListAlertsResponse> {
  return makeOpsgenieRequest<ListAlertsResponse>('/v2/alerts', {
    method: 'GET',
    params,
    apiKey,
  });
}

/**
 * Create alert
 * POST /v2/alerts
 */
export async function createAlert(
  apiKey: string,
  payload: CreateAlertPayload
): Promise<AcceptedResponse> {
  return makeOpsgenieRequest<AcceptedResponse>('/v2/alerts', {
    method: 'POST',
    body: payload,
    apiKey,
  });
}

/**
 * Acknowledge alert
 * POST /v2/alerts/{identifier}/acknowledge
 */
export async function acknowledgeAlert(
  apiKey: string,
  identifier: string,
  payload?: AcknowledgeAlertPayload,
  identifierType: 'id' | 'name' | 'tiny' = 'id'
): Promise<AcceptedResponse> {
  return makeOpsgenieRequest<AcceptedResponse>(
    `/v2/alerts/${encodeURIComponent(identifier)}/acknowledge`,
    {
      method: 'POST',
      body: payload,
      params: { identifierType },
      apiKey,
    }
  );
}

/**
 * Close alert
 * POST /v2/alerts/{identifier}/close
 */
export async function closeAlert(
  apiKey: string,
  identifier: string,
  payload?: CloseAlertPayload,
  identifierType: 'id' | 'name' | 'tiny' = 'id'
): Promise<AcceptedResponse> {
  return makeOpsgenieRequest<AcceptedResponse>(
    `/v2/alerts/${encodeURIComponent(identifier)}/close`,
    {
      method: 'POST',
      body: payload,
      params: { identifierType },
      apiKey,
    }
  );
}

/**
 * List alert notes
 * GET /v2/alerts/{identifier}/notes
 */
export async function listAlertNotes(
  apiKey: string,
  identifier: string,
  params?: ListAlertNotesParams,
  identifierType: 'id' | 'name' | 'tiny' = 'id'
): Promise<ListAlertNotesResponse> {
  return makeOpsgenieRequest<ListAlertNotesResponse>(
    `/v2/alerts/${encodeURIComponent(identifier)}/notes`,
    {
      method: 'GET',
      params: { ...params, identifierType },
      apiKey,
    }
  );
}

/**
 * Add note to alert
 * POST /v2/alerts/{identifier}/notes
 */
export async function addNoteToAlert(
  apiKey: string,
  identifier: string,
  payload: AddNoteToAlertPayload,
  identifierType: 'id' | 'name' | 'tiny' = 'id'
): Promise<AcceptedResponse> {
  return makeOpsgenieRequest<AcceptedResponse>(
    `/v2/alerts/${encodeURIComponent(identifier)}/notes`,
    {
      method: 'POST',
      body: payload,
      params: { identifierType },
      apiKey,
    }
  );
}

/**
 * List alert logs
 * GET /v2/alerts/{identifier}/logs
 */
export async function listAlertLogs(
  apiKey: string,
  identifier: string,
  params?: ListAlertLogsParams,
  identifierType: 'id' | 'name' | 'tiny' = 'id'
): Promise<ListAlertLogsResponse> {
  return makeOpsgenieRequest<ListAlertLogsResponse>(
    `/v2/alerts/${encodeURIComponent(identifier)}/logs`,
    {
      method: 'GET',
      params: { ...params, identifierType },
      apiKey,
    }
  );
}

/**
 * Add details to alert
 * POST /v2/alerts/{identifier}/details
 */
export async function addDetailsToAlert(
  apiKey: string,
  identifier: string,
  payload: AddDetailsToAlertPayload,
  identifierType: 'id' | 'name' | 'tiny' = 'id'
): Promise<AcceptedResponse> {
  return makeOpsgenieRequest<AcceptedResponse>(
    `/v2/alerts/${encodeURIComponent(identifier)}/details`,
    {
      method: 'POST',
      body: payload,
      params: { identifierType },
      apiKey,
    }
  );
}
