import { data } from "../data/products";
import client from "../utils/axios";

export class AppointmentService {
  getAppointments() {
    return data;
  }

  async healthCheck() {
    const response = await client.get('/health');

    return response;
  }

  async register(appointment) {
    try {
      const response = await client.post('/appointment/register', appointment);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }

  async update(appointment) {
    try {
      const response = await client.post('/appointment/update', appointment);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }

  async getAppointmentsBy(cod_usuario) {
    try {
      const response = await client.get(`/appointment/${cod_usuario}`);
  
      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async getComboData() {
    try {
      const response = await client.get(`/appointment/combo/get-data`);
  
      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async delete({ cod_solicitud }) {
    try {
      const response = await client.post(`/appointment/remove`, { cod_solicitud });
  
      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }
}
