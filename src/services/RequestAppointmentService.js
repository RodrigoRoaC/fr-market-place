import { data } from "../data/products";
import client from "../utils/axios";

export class RequestAppointmentService {
  getAppointments() {
    return data;
  }

  async healthCheck() {
    const response = await client.get('/health');

    return response;
  }

  async register(appointment) {
    try {
      console.log(appointment);
      const response = await client.post('/request-appointment/register', appointment);
      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }

  async update(appointment) {
    try {
      const response = await client.put('/request-appointment/update', appointment);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }

  async getAppointmentsBy(cod_usuario) {
    try {
      const response = await client.get(`/request-appointment/${cod_usuario}`);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async getComboData() {
    try {
      const response = await client.get(`/request-appointment/combo/get-data`);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async delete({ cod_solicitud }) {
    try {
      const response = await client.post(`/request-appointment/remove`, { cod_solicitud });

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }

  async asignToOperator(cod_usuario, cod_solicitud) {
    try {
      const response = await client.post('/request-appointment/assign-operator', { cod_usuario, cod_solicitud });

      return { data: response.data };
    } catch (error) {
      console.error(error);
      return { error };
    }
  }
}
