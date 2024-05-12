import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const getClientsByInvocePeriod = createAsyncThunk(
  'invoice/getClientsByInvocePeriod',
  async (period) => {
    try {
      const access_token = localStorage.getItem('access_token');
      const { data } = await axios.get(
        `/invoices/clients?yearInvoice=${period.yearInvoice}&monthInvoice=${period.monthInvoice}`, { headers: { Authorization: access_token } }, {}
      )
      console.log('GET CLIENT', data)
      return data
    } catch (error) {
      console.error(error)
    }
  }
)

export const postInvoices = createAsyncThunk(
  'invoice/postInvoices',
  async (payload) => {
    try {
      const access_token = localStorage.getItem('access_token');
      const response = await axios.post(
        '/invoices', { year: payload.year, month: payload.month, ids: payload.ids }, { headers: { Authorization: access_token } }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const getAllInvoices = createAsyncThunk(
  'invoice/getAllInvoices',
  async () => {
    try {
      const access_token = localStorage.getItem('access_token');
      const response = await axios.get(
        '/invoices/all', { headers: { Authorization: access_token } }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const deleteInvoices = createAsyncThunk(
  'invoice/deleteInvoices',
  async (id) => {
    try {
      const access_token = localStorage.getItem('access_token');
      const response = await axios.patch(
        `/invoices/delete/${id}`,  { params: id }, { headers: { Authorization: access_token } }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    users: [],
    year: 2024,
    months: [5, 6, 7, 8, 9, 10, 11, 12],
    invoices: []
  },
  reducers: {
    setYearAndMonths: (state, action) => {
      state.year = action.payload.year;
      state.months = action.payload.months;
    },
    removeMonth: (state, action) => {
      state.months = state.months.filter(item => item !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getClientsByInvocePeriod.fulfilled, (state, action) => {
      state.users = action.payload || null;
    }),
      builder.addCase(postInvoices.fulfilled, (state, action) => {
        state.users = action.payload || null;
        if (!action.payload.success) return
        state.months = state.months.filter(month => month !== action.payload.response[0].period.month);
      }),
      builder.addCase(getAllInvoices.fulfilled, (state, action) => {
        if (!action.payload.success) return
        state.invoices = action.payload.response || null;
      }),
      builder.addCase(deleteInvoices.fulfilled, (state, action) => {
        if (!action.payload.success) return
        const newInvoices = state.invoices.filter(invoice => invoice._id !== action.payload.response._id);
        state.invoices = newInvoices.length ? newInvoices : null;
      })
  }
});

export const { setYearAndMonths, removeMonth } = invoiceSlice.actions
export default invoiceSlice.reducer