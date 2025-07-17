// Base interfaces from Swagger definitions
export interface AlertActionPayload {
  user?: string;
  note?: string;
  source?: string;
}

export interface Recipient {
  type: 'user' | 'team' | 'escalation' | 'schedule';
  id?: string;
  name?: string;
}

// Request payloads
export interface CreateAlertPayload extends AlertActionPayload {
  message: string;
  alias?: string;
  description?: string;
  responders?: Recipient[];
  visibleTo?: Recipient[];
  actions?: string[];
  tags?: string[];
  details?: Record<string, string>;
  entity?: string;
  priority?: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
}

export interface AcknowledgeAlertPayload extends AlertActionPayload {}

export interface CloseAlertPayload extends AlertActionPayload {}

export interface AddNoteToAlertPayload extends AlertActionPayload {
  note: string;
}

export interface AddDetailsToAlertPayload extends AlertActionPayload {
  details: Record<string, string>;
}

// Query parameters for list endpoints
export interface ListAlertsParams {
  query?: string;
  searchIdentifier?: string;
  searchIdentifierType?: 'id' | 'name';
  offset?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ListAlertNotesParams {
  offset?: number;
  direction?: 'next' | 'prev';
  limit?: number;
  order?: 'asc' | 'desc';
}

export interface ListAlertLogsParams {
  offset?: number;
  direction?: 'next' | 'prev';
  limit?: number;
  order?: 'asc' | 'desc';
}

// Response interfaces
export interface Alert {
  id: string;
  tinyId: string;
  alias?: string;
  message: string;
  status: 'open' | 'acked' | 'closed';
  acknowledged: boolean;
  isSeen: boolean;
  tags: string[];
  snoozed: boolean;
  snoozedUntil?: string;
  count: number;
  lastOccurredAt: string;
  createdAt: string;
  updatedAt: string;
  source?: string;
  owner?: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  responders: Recipient[];
  integration: {
    id: string;
    name: string;
    type: string;
  };
  report?: {
    ackTime?: number;
    closeTime?: number;
    acknowledgedBy?: string;
    closedBy?: string;
  };
  actions?: string[];
  entity?: string;
  description?: string;
  details?: Record<string, string>;
}

export interface AlertNote {
  note: string;
  owner: string;
  createdAt: string;
}

export interface AlertLog {
  log: string;
  type: string;
  owner: string;
  createdAt: string;
}

export interface ListAlertsResponse {
  data: Alert[];
  paging?: {
    next?: string;
    prev?: string;
    first?: string;
    last?: string;
  };
}

export interface ListAlertNotesResponse {
  data: AlertNote[];
  paging?: {
    next?: string;
    first?: string;
  };
}

export interface ListAlertLogsResponse {
  data: AlertLog[];
  paging?: {
    next?: string;
    first?: string;
  };
}

export interface AcceptedResponse {
  result: string;
  took: number;
  requestId: string;
}

// Common parameters
export interface AlertIdentifierParams {
  identifier: string;
  identifierType?: 'id' | 'name' | 'tiny';
}
