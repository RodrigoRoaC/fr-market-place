import client from "../../utils/axios";

export class PaymentService {
  async list(cod_tipo_perfil, codigo) {
    try {
      const url = [6, 7].includes(cod_tipo_perfil) ? '/auth/authenticate' : '';

      const response = await client.get(url);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }
}
