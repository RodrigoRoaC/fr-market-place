import client from "../../utils/axios";

export class AppointmentService {
  async register(appointment) {
    try {
      console.log(appointment);
      const response = await client.post('/appointment', appointment);
      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }

  async update(appointment) {
    try {
      console.log(appointment);
      const response = await client.put('/appointment', appointment);
      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }

  async getAppointments(cod_usuario, cod_perfil) {
    try {
      const url = cod_perfil === 4 ? '/appointment' : `/appointment/${cod_usuario}`;
      const response = await client.get(url);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }

  async delete({ cod_cita }) {
    try {
      const response = await client.post(`/appointment/remove`, { cod_cita });

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }
}
