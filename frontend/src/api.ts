import axios from 'axios';

const API_BASE = '/api';

export const createPipeline = (title: string, content: string, channels: string[], locales: string[]) => {
  return axios.post(`${API_BASE}/pipelines`, {
    title,
    source_content: content,
    channels: channels,
    locales: locales
  });
};

export const getPipelines = () => {
  return axios.get(`${API_BASE}/pipelines`);
};

export const getPipelineStatus = (id: string) => {
  return axios.get(`${API_BASE}/pipelines/${id}`);
};
