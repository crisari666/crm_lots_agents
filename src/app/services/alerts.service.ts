import Api from "../axios";

export interface AlertInterface {
  _id: string;
  clientId: {
    _id: string;
    name: string;
    lastName: string;
    phone: string;
  };
  agentId: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    office: string
  };
  createdBy: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
  };
  reason: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "VERIFIED" | "REJECTED";
  agentResponse: {
    comment: string;
    respondedAt: string;
  } | null;
  verifiedBy: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
  } | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  officeId?: string;
}

/** Lead team alerts: backend returns an array of { user, userId, alerts } */
export interface LeadTeamAlertsItem {
  user: {
    _id: string;
    email: string;
    lastName: string;
    name: string;
  };
  userId: string;
  alerts: AlertInterface[];
}

export interface CreateAlertPayload {
  reason: string;
  description: string;
}

export interface RespondToAlertPayload {
  comment: string;
}

export interface VerifyAlertPayload {
  status: "VERIFIED" | "REJECTED";
}

export async function createAlertReq({
  clientId,
  data,
}: {
  clientId: string;
  data: CreateAlertPayload;
}): Promise<AlertInterface> {
  try {
    const api = Api.getInstance();
    const response = await api.post({
      path: `alerts/clients/${clientId}/alerts`,
      data,
    });
    const { error } = response;
    if (error == null) {
      return response.result;
    } else {
      throw error;
    }
  } catch (error) {
    console.error("ERROR ON createAlertReq");
    console.error({ error });
    throw error;
  }
}

export async function getAgentAlertsReq(): Promise<AlertInterface[]> {
  try {
    const api = Api.getInstance();
    const response = await api.get({ path: `alerts/agents/me/alerts` });
    const { error } = response;
    if (error == null) {
      return response.result;
    } else {
      throw error;
    }
  } catch (error) {
    console.error("ERROR ON getAgentAlertsReq");
    console.error({ error });
    throw error;
  }
}

export async function respondToAlertReq({
  alertId,
  data,
}: {
  alertId: string;
  data: RespondToAlertPayload;
}): Promise<AlertInterface> {
  try {
    const api = Api.getInstance();
    const response = await api.patch({
      path: `alerts/${alertId}/respond`,
      data,
    });
    const { error } = response;
    if (error == null) {
      return response.result;
    } else {
      throw error;
    }
  } catch (error) {
    console.error("ERROR ON respondToAlertReq");
    console.error({ error });
    throw error;
  }
}

export async function verifyAlertReq({
  alertId,
  data,
}: {
  alertId: string;
  data: VerifyAlertPayload;
}): Promise<AlertInterface> {
  try {
    const api = Api.getInstance();
    const response = await api.patch({
      path: `alerts/${alertId}/verify`,
      data,
    });
    const { error } = response;
    if (error == null) {
      return response.result;
    } else {
      throw error;
    }
  } catch (error) {
    console.error("ERROR ON verifyAlertReq");
    console.error({ error });
    throw error;
  }
}

export async function getAuditorAlertsReq({
  status,
}: {
  status?: string;
}): Promise<AlertInterface[]> {
  try {
    const api = Api.getInstance();
    const path = status
      ? `alerts/auditors/me/alerts?status=${encodeURIComponent(status)}`
      : `alerts/auditors/me/alerts`;
    const response = await api.get({ path });
    const { error } = response;
    if (error == null) {
      return response.result;
    } else {
      throw error;
    }
  } catch (error) {
    console.error("ERROR ON getAuditorAlertsReq");
    console.error({ error });
    throw error;
  }
}

export async function getLeadTeamAlertsReq(): Promise<LeadTeamAlertsItem[]> {
  try {
    const api = Api.getInstance();
    const response = await api.get({ path: `alerts/leads/me/team-alerts` });
    const { error } = response;
    if (error == null) {
      return response.result;
    } else {
      throw error;
    }
  } catch (error) {
    console.error("ERROR ON getLeadTeamAlertsReq");
    console.error({ error });
    throw error;
  }
}

export async function getCustomerAlertsReq({
  clientId,
}: {
  clientId: string;
}): Promise<AlertInterface[]> {
  try {
    const api = Api.getInstance();
    const response = await api.get({ path: `alerts/clients/${clientId}/alerts` });
    const { error } = response;
    if (error == null) {
      return response.result;
    } else {
      throw error;
    }
  } catch (error) {
    console.error("ERROR ON getCustomerAlertsReq");
    console.error({ error });
    throw error;
  }
}
