export const parseReqAppointments = (appointments = []) => appointments.map((app) => ({
  ...app,
  fec_nacimiento: app.fec_nacimiento ? new Date(app.fec_nacimiento) : null,
  fecha_programacion: app.fecha_programacion ? new Date(app.fecha_programacion) : null,
  fecha_autorizacion: app.fecha_autorizacion ? new Date(app.fecha_autorizacion) : null,
  hora_programacion: app.hora_programacion ? parseTime(app.hora_programacion) : null,
}));

export const parsePayments = (payments = []) => payments.map((pay) => ({
  ...pay,
  fec_registro: pay.fec_registro ? new Date(pay.fec_registro) : null,
  fec_actualizacion: pay.fec_actualizacion ? new Date(pay.fec_actualizacion) : null,
  fecha_cancelacion: pay.fecha_cancelacion ? new Date(pay.fecha_cancelacion) : null,
  fecha_autorizacion: pay.fecha_autorizacion ? new Date(pay.fecha_cancelacion) : null,
}));

export const parseDoctors = (doctors = []) => doctors.map((doc) => ({
  ...doc,
  fecha_reserva: doc.fecha_reserva ? new Date(doc.fecha_reserva) : null,
}));

export const parseAppointments = (appointments = []) => appointments.map((app) => ({
  ...app,
  fecha_reserva: app.fecha_reserva ? new Date(app.fecha_reserva) : null,
  fecha_programacion: app.fecha_programacion ? new Date(app.fecha_programacion) : null,
  f_programacion: app.fecha_reserva ? new Date(app.fecha_reserva).toLocaleDateString() : null,
}));

export const parseIndicators = (indicators = []) => indicators.map((ind) => ({
  ...ind,
  fec_atencion: ind.fec_atencion ? new Date(ind.fec_atencion) : null,
  fecha_atencion: ind.fec_atencion ? new Date(ind.fec_atencion).toLocaleDateString() : null,
}));

const parseTime = (time) => {
  const [fec] = new Date().toISOString().split('T');
  const [hours, minutes, sec] = time.split(':');
  const timeGMT = `${(+hours + 5) >= 24 ? `0${(25 - +hours)}` : (+hours + 5)}:${minutes}:${sec}`;

  return new Date(`${fec}T${timeGMT}Z`);
}

export const dateToISOString = (date) => {
  const [day, month, year] = (date ? new Date(date) : new Date()).toLocaleDateString().split('/');

  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
};

export const parsePatientIndicator = (patient) => ({
  cod_paciente: patient.cod_paciente,
  nombres_paciente: `${patient.nombres} ${patient.ape_paterno || ''} ${patient.ape_materno || ''}`,
  num_documento: patient.num_documento,
});
