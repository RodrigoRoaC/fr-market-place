export const validateReqAppointmentValues = ({ 
  fec_nacimiento, 
  nombres,
  ape_paterno,
  ape_materno,
  cod_tipo_doc,
  num_documento,
}) => {
  if (!fec_nacimiento || !nombres || !ape_paterno || !ape_materno || !cod_tipo_doc || !num_documento) {
    return true; 
  }

  return false;
}

export const validateAppointmentValues = ({ 
  cod_doctor, 
  cod_especialidad,
  cod_tipo_atencion,
  cod_vent_horaria,
  fecha_reserva,
}) => {
  if (!cod_doctor || !cod_especialidad || !cod_tipo_atencion || !cod_vent_horaria || !fecha_reserva) {
    return true; 
  }

  return false;
}
