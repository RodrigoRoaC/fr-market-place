import client from "../../utils/axios";

export class DoctorService {
  async getAllDoctors() {
    try {
      const response = await client.get('/doctor');

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async getDoctor(cod_doctor) {
    try {
      const response = await client.get(`/doctor/${cod_doctor}`);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async getComboDoctor(especialidad, atencion) {
    try {
      const response = await client.get(`/doctor/combo?cod_especialidad=${especialidad}&cod_tipo_atencion=${atencion}`);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async register(payload) {
    try {
      const response = await client.post('/doctor', payload);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async update(payload) {
    try {
      const response = await client.put('/doctor', payload);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async delete(payload) {
    try {
      const response = await client.post('/auth/authenticate-unr', payload);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async getEspecialidades() {
    try {
      const response = await client.get('/doctor/specialties');

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async getVentanaHoraria() {
    try {
      const response = await client.get('/doctor/time-window');

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async getVentanaHorariaByDate(params) {
    try {
      const response = await client.get(`/doctor/availability?fecha_reserva=${params.fecha_reserva}&cod_doctor=${params.cod_doctor}`);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }
}
