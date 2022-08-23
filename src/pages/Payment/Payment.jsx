import React, { useContext, useEffect, useRef, useState } from 'react'
import PaymentForm from '../../components/PaymentForm/PaymentForm';
import PaymentTable from '../../components/PaymentTable/PaymentTable';
import { UserContext } from '../../context/UserContext';
import emptyAppointment from '../../data/appointment';
import { AppointmentService } from '../../services/AppointmentService';

const Payment = () => {
  const { user } = useContext(UserContext);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [payment, setAppointment] = useState({...emptyAppointment});
  const [deletePaymentDialog, setDeletePaymentDialog] = useState(false);
  const toast = useRef(null);

  const [appointments, setAppointments] = useState(null);

  const appointmentService = new AppointmentService();

  useEffect(() => {
    appointmentService.getAppointmentsBy(user.cod_usuario)
      .then(res => setAppointments(res.data))
      .catch(err => {
        console.error(err);
        setAppointments([]);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className = 'wrapper'>
      {
        user.cod_perfil === 3 
          ? (
              <>
                <PaymentTable 
                  toast = {toast}
                  setPaymentDialog = {setPaymentDialog}
                  setAppointment = {setAppointment}
                  setDeletePaymentDialog = {setDeletePaymentDialog}
                  appointments = {appointments}
                  userPerfil = {user.cod_perfil}
                />
                <PaymentForm
                  toast = {toast}
                  paymentDialog = {paymentDialog}
                  payment = {payment}
                  setPaymentDialog = {setPaymentDialog}
                  submitted = {submitted}
                  setSubmitted = {setSubmitted}
                />
              </>
            )
          : (
              <>
                <PaymentTable 
                    toast = {toast}
                    paymentDialog = {paymentDialog}
                    setPaymentDialog = {setPaymentDialog}
                    setAppointment = {setAppointment}
                    setDeletePaymentDialog = {setDeletePaymentDialog}
                    deletePaymentDialog = {deletePaymentDialog}
                />
              </>
            )
      }
    </div>
  )
}

export default Payment;
