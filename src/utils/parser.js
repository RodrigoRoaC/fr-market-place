export const parseAppointments = (appointments = []) => appointments.map((app) => ({
  ...app,
  fec_nacimiento: app.fec_nacimiento ? new Date(app.fec_nacimiento) : null,
  fecha_programacion: app.fecha_programacion ? new Date(app.fecha_programacion) : null,
  fecha_autorizacion: app.fecha_autorizacion ? new Date(app.fecha_autorizacion) : null,
  hora_programacion: app.hora_programacion ? parseTime(app.hora_programacion) : null,
}));

const parseTime = (time) => {
  const [fec] = new Date().toISOString().split('T');
  const [hours, minutes, sec] = time.split(':');
  const timeGMT = `${(+hours + 5) >= 24 ? `0${(25 - +hours)}` : (+hours + 5)}:${minutes}:${sec}`;

  return new Date(`${fec}T${timeGMT}Z`);
}
