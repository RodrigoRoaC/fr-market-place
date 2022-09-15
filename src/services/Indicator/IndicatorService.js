import client from "../../utils/axios";

export class IndicatorService {
  async upload(payload) {
    try {
      const response = await client.post('/indicator/upload', payload);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: true }
    }
  }
}
