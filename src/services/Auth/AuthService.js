import client from "../../utils/axios";

export class AuthService {
  async authenticate(payload) {
    try {
      const response = await client.post('/auth/authenticate', payload);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async authenticateUNR(payload) {
    try {
      const response = await client.post('/auth/authenticate-unr', payload);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }
}
