import client from "../../utils/axios";

export class IndicatorService {
  async list() {
    try {
      const response = await client.get('/indicator');

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: true }
    }
  }

  async upload(payload) {
    try {
      const response = await client.post('/indicator/upload', payload);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: true }
    }
  }

  async update(payload) {
    try {
      const response = await client.put('/indicator', payload);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: true }
    }
  }

  async delete(payload) {
    try {
      const response = await client.post('/indicator/delete', payload);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: true }
    }
  }

  async listMae(payload) {
    try {
      const response = await client.get('/indicator/mae', payload);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: true }
    }
  }

  async registerMae(payload) {
    try {
      const response = await client.post('/indicator/mae', payload);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: true }
    }
  }

  async updateMae(payload) {
    try {
      const response = await client.put('/indicator/mae', payload);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: true }
    }
  }
}
