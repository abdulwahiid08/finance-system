import api from "../api/axios";

export const accountService = {
  // GET SEMUA AKUN
  getAll: async () => {
    const response = await api.get("/accounts");
    return response.data.data;
  },

  // GET TREE AKUN INDUK DAN ANAK AKUN
  getTree: async (type = null) => {
    const response = await api.get("/accounts/tree", {
      params: type ? { type } : {},
    });
    return response.data.data;
  },

  // GET AKUN AKTIF
  getActive: async () => {
    const response = await api.get("/accounts/active");
    return response.data.data;
  },

  // GET AKUN BY ID
  getById: async (id) => {
    const response = await api.get(`/accounts/${id}`);
    return response.data.data;
  },

  // CREATE AKUN
  create: async (data) => {
    const response = await api.post("/accounts", data);
    return response.data.data;
  },

  // UPDATE AKUN
  update: async (id, data) => {
    const response = await api.put(`/accounts/${id}`, data);
    return response.data.data;
  },

  // HAPUS AKUN
  delete: async (id) => {
    await api.delete(`/accounts/${id}`);
  },

  // UBAH STATUS AKUN
  toggleStatus: async (id) => {
    const response = await api.post(`/accounts/${id}/toggle`);
    return response.data.data;
  },

  // GET AKUN BY SEARCH
  search: async (keyword) => {
    const response = await api.get("/accounts/search", {
      params: { q: keyword },
    });
    return response.data.data;
  },

  // GET SALDO AKUN
  getSummary: async () => {
    const response = await api.get("/accounts/summary");
    return response.data.data;
  },
};
