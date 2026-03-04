import { CollectorForm } from "../../features/collectors/slice/collectors.state";
import Api from "../axios";
import { CollectorType } from "../models/collector.type";

export async function fetchCollectorsReq(): Promise<CollectorType[]> {
  try {
    const api = Api.getInstance()
    const response = await api.get({ path: `collectors` })
    const { error } = response
    if (error == null) {
      return response.result
    } else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON fetchCollectorsReq');
    console.error({ error });
    throw error;
  }
}

export async function addCollectorReq({ collector }: { collector: CollectorForm }): Promise<CollectorType> {
  try {
    const api = Api.getInstance()
    const response = await api.post({ path: `collectors`, data: collector })
    const { error } = response
    if (error == null) {
      return response.result
    } else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addCollector');
    console.error({ error });
    throw error;
  }
}

export async function getCollectorByIdReq({ collectorId }: { collectorId: string }): Promise<any> {
  try {
    const api = Api.getInstance()
    const response = await api.get({ path: `collectors/${collectorId}` })
    const { error } = response
    if (error == null) {
      return response.result
    } else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCollectorById');
    console.error({ error });
    throw error;
  }
}

export async function updateCollectorReq({ collectorId, collector }: { collectorId: string, collector: CollectorForm }): Promise<CollectorType> {
  try {
    const api = Api.getInstance()
    const response = await api.patch({ path: `collectors/${collectorId}`, data: collector })
    const { error } = response
    if (error == null) {
      return response.result
    } else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON updateCollectorReq');
    console.error({ error });
    throw error;
  }
}

export async function addOfficeToCollectorReq({ officeId, collectorId }: { officeId: string, collectorId: string }): Promise<CollectorType> {
  try {
    const api = Api.getInstance()
    const response = await api.patch({ path: `collectors/${collectorId}/add-office`, data: { officeId } })
    const { error } = response
    if (error == null) {
      return response.result
    } else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addOfficeToCollector');
    console.error({ error });
    throw error;
  }
}

export async function removeOfficeFromCollectorReq({ officeId, collectorId }: { officeId: string, collectorId: string }): Promise<CollectorType> {
  try {
    const api = Api.getInstance()
    const response = await api.patch({ path: `collectors/${collectorId}/remove-office`, data: { officeId } })
    const { error } = response
    if (error == null) {
      return response.result
    } else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addOfficeToCollector');
    console.error({ error });
    throw error;
  }
}

export async function getCollectorsForUserReq({ userId }: { userId: string }): Promise<CollectorType[]> {
  try {
    const api = Api.getInstance()
    const response = await api.get({ path: `collectors/collectors-for-user/${userId}` })
    console.log('getCollectorsForUser', { response });
    const { error } = response
    if (error == null) {
      return response.result
    } else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCollectorsForUser');
    console.error({ error });
    throw error;
  }
}

export async function toggleEnableCollectorReq({ collectorId, enable }: { collectorId: string, enable: boolean }): Promise<CollectorType> {
  try {
    const api = Api.getInstance()
    const response = await api.patch({ path: `collectors/${collectorId}/enable`, data: { enable } })
    const { error } = response
    if (error == null) {
      return response.result
    } else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON toggleEnableCollectorReq');
    console.error({ error });
    throw error;
  }
}
