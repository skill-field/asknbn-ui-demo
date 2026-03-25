import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

const resource = (name) => ({
  list: () => api.get(`/${name}`).then(r => r.data),
  get: (id) => api.get(`/${name}/${id}`).then(r => r.data),
  create: (data) => api.post(`/${name}`, data).then(r => r.data),
  update: (id, data) => api.put(`/${name}/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/${name}/${id}`).then(r => r.data),
});

export const chatbotsApi = resource('chatbots');
export const modelsApi = resource('models');
export const guardrailsApi = resource('guardrails');
export const promptsApi = resource('prompts');
export const toolsApi = resource('tools');
export const udfsApi = resource('udfs');

export default api;
