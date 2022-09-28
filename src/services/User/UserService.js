import client from "../../utils/axios";

export class UserService {
  async getOperators() {
    try {
      const response = await client.get(`/user/list-operators`);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async getPatientCombo() {
    try {
      const response = await client.get(`/user/patient/combo`);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async updateUserPayment(payment) {
    try {
      const response = await client.put(`/user/update-user-payment`, payment);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async getPatientByDoc(numDoc) {
    try {
      const response = await client.get(`/user/patient/${numDoc}`);

      return { data: response.data };
    } catch (err) {
      if (err.response.status === 404) {
        return { data: null };
      }
      return { error: err }
    }
  }
}
