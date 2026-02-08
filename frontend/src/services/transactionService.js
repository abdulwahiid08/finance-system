import api from "../api/axios";

export const transactionService = {
  // GET SEMUA TRANSAKSI
  getAll: async () => {
    const response = await api.get("/transactions");
    return response.data.data;
  },

  // GET TRANSAKSI BY FILTER
  filter: async (params) => {
    const response = await api.get("/transactions/filter", { params });
    return response.data.data;
  },

  // GET TRANSAKSI BY ID
  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  },

  // CREATE TRANSAKSI
  create: async (data) => {
    const response = await api.post("/transactions", data);
    return response.data.data;
  },

  // UPDATE TRANSAKSI
  update: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data.data;
  },

  // HAPUS TRANSAKSI
  delete: async (id) => {
    await api.delete(`/transactions/${id}`);
  },

  // GET Buku Besar Transaksi
  getLedger: async (accountId, startDate = null, endDate = null) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await api.get(`/transactions/ledger/${accountId}`, {
      params,
    });
    return response.data.data;
  },
};
