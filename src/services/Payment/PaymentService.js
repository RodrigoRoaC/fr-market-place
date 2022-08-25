import client from "../../utils/axios";

export class PaymentService {
  async getPaymentsBy(cod_tipo_perfil, codigo) {
    try {
      const url = [6, 7].includes(cod_tipo_perfil) ? `/payment/patient/list?codUsuario=${codigo}` : `/payment/${codigo}`;

      const response = await client.get(url);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async nullifyPayment(cod_pago) {
    try {
      const response = await client.post('/payment/remove', { cod_pago });

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async sendEmail(payment) {
    try {
      const response = await client.post('/payment/send-payment-link', payment);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async register(payment) {
    try {
      const response = await client.post('/payment/register', payment);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async update(payment) {
    try {
      const response = await client.put('/payment/update', payment);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async validate(payment) {
    try {
      const response = await client.put('/payment/validate-payment', payment);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async confirm(payment) {
    try {
      const response = await client.post('/payment/confirm-payment', payment);

      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }
}
