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

  async register(payload) {
    try {
      const response = await client.post('/doctor', payload);
  
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
}
