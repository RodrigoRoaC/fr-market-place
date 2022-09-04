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

  async delete(payload) {
    try {
      const response = await client.post('/auth/authenticate-unr', payload);
  
      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }
}
