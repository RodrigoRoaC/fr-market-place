export const steps = {
  items: [
    {
      key: 0,
      label: 'Identificate'
    },
    {
      key: 1,
      label: 'Servicio'
    },
    {
      key: 2,
      label: 'Datos contacto'
    },
    {
      key: 3,
      label: 'Finalizado'
    },
  ],
};

export const flow = {
  key: 'atencion-programa',
  options: [
    {
      key: 'programa',
      options: [
        {
          key: 'agudo',
          options: []
        },
        {
          key: 'cronico',
          options: []
        },
      ]
    },
    {
      key: 'particular',
      options: [
        {
          key: 'agudo',
          options: [],
        }
      ]
    },
  ]
};

export const fields = {
  isReqByUser: true,
  hasMedicalRecord: false,
  atentionType: '',

  cod_tipo_atencion: '',
  cod_tipo_servicio: 1,
  cod_modalidad: '',
  cod_iafa: '',
  fecha_programacion: '',
  sintomas: '',
  diagnostico: '',
  cod_doctor: '',

  cod_tipo_doc: '',
  num_documento: '',
  departamento: '',
  provincia: '',
  distrito: '',
  direccion: '',
  email: '',
  telefono1: '',
  nombres: '',
  ape_paterno: '',
  ape_materno: '',
};
