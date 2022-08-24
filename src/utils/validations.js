export const validateAppointmentValues = ({ 
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
