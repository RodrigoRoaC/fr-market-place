import client from "../../utils/axios";

export class UbigeoService {
  async getProvincias(ubigeoDep) {
    try {
      const response = await client.get(`/ubigeo/provincias?departamento=${ubigeoDep}`);
  
      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }

  async getDistritos(ubigeoDep, ubigeoProv) {
    try {
      const response = await client.get(`/ubigeo/distritos?departamento=${ubigeoDep}&provincia=${ubigeoProv}`);
  
      return { data: response.data };
    } catch (err) {
      console.error(err);
      return { error: err }
    }
  }
}
