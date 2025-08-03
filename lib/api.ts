import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface System {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  avatars?: Avatar[];
}

export interface Avatar {
  id: string;
  name: string;
  systemId: string;
  createdAt: string;
  updatedAt: string;
  system?: System;
  goals?: Goal[];
}

export interface Goal {
  id: string;
  description: string;
  status: "pending" | "in-progress" | "fulfilled" | "canceled";
  avatarId: string;
  createdAt: string;
  updatedAt: string;
  avatar?: Avatar;
  needs?: Need[];
}

export interface Need {
  id: string;
  description: string;
  goalId: string;
  createdAt: string;
  updatedAt: string;
  goal?: Goal;
  mappings?: Mapping[];
}

export interface Mapping {
  id: string;
  needId: string;
  fulfillerSystemId: string;
  fulfillerAvatarId?: string;
  status: "PENDING" | "IN_PROGRESS" | "FULFILLED" | "REJECTED" | "CANCELED";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  need?: Need;
  fulfillerSystem?: System;
  fulfillerAvatar?: Avatar;
}

export interface Log {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  entityId: string;
  metadata?: any;
}

// System APIs
export const systemApi = {
  create: (data: { name: string; type: string }) =>
    api.post<System>("/systems", data),

  getAll: () => api.get<System[]>("/systems"),

  getById: (id: string) => api.get<System>(`/systems/${id}`),
};

// Avatar APIs
export const avatarApi = {
  create: (data: { systemId: string; name: string }) =>
    api.post<Avatar>("/avatars", data),

  getById: (id: string) => api.get<Avatar>(`/avatars/${id}`),

  getBySystemId: (systemId: string) =>
    api.get<Avatar[]>(`/avatars/system/${systemId}`),
};

// Goal APIs
export const goalApi = {
  create: (data: { avatarId: string; description: string }) =>
    api.post<Goal>("/goals", data),

  getAllGoals: () => api.get<Goal>(`/goals`),

  getById: (id: string) => api.get<Goal>(`/goals/${id}`),

  getByAvatarId: (avatarId: string) =>
    api.get<Goal[]>(`/goals/avatar/${avatarId}`),

  updateStatus: (id: string, status: Goal["status"]) =>
    api.patch<Goal>(`/goals/${id}/status`, { status }),
};

// Need APIs
export const needApi = {
  create: (data: { goalId: string; description: string }) =>
    api.post<Need>("/needs", data),

  getById: (id: string) => api.get<Need>(`/needs/${id}`),

  getByGoalId: (goalId: string) => api.get<Need[]>(`/needs/goal/${goalId}`),
};

// Mapping APIs
export const mappingApi = {
  create: (data: {
    needId: string;
    fulfillerSystemId: string;
    fulfillerAvatarId?: string;
    notes?: string;
  }) => api.post<Mapping>("/mappings", data),

  getById: (id: string) => api.get<Mapping>(`/mappings/${id}`),

  updateStatus: (
    id: string,
    data: { status: Mapping["status"]; notes?: string }
  ) => api.patch<Mapping>(`/mappings/${id}/status`, data),

  getByNeedId: (needId: string) =>
    api.get<Mapping[]>(`/mappings/need/${needId}`),

  getByFulfillerSystemId: (fulfillerSystemId: string) =>
    api.get<Mapping[]>(`/mappings/fulfillerSystem/${fulfillerSystemId}`),

  autoMap: (data: { needId: string; threshold?: number }) =>
    api.post("/mappings/auto-map", data),

  getSuggestions: (needId: string) =>
    api.get(`/mappings/suggestions/${needId}`),

  batchAutoMap: (data: { needIds: string[]; threshold?: number }) =>
    api.post("/mappings/batch-auto-map", data),

  autoMapPending: (data: { threshold?: number }) =>
    api.post("/mappings/auto-map-pending", data),

  createFromSuggestion: (data: {
    needId: string;
    fulfillerSystemId: string;
    fulfillerAvatarId?: string;
    notes?: string;
  }) => api.post("/mappings/from-suggestion", data),
};

// Log APIs
export const logApi = {
  getAll: () => api.get<Log[]>("/logs"),
};

export default api;
