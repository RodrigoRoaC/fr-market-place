import React, { useContext, useEffect, useRef, useState } from 'react'
import PaymentForm from '../../components/PaymentForm/PaymentForm';
import PaymentFormPatient from '../../components/PaymentForm/PaymentFormPatient';
import PaymentTable from '../../components/PaymentTable/PaymentTable';
import { UserContext } from '../../context/UserContext';
import emptyPayment from '../../data/payment';
import { PaymentService } from '../../services/Payment/PaymentService';

const Payment = () => {
  const { user } = useContext(UserContext);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [payment, setPayment] = useState({...emptyPayment});
  const toast = useRef(null);
  const [disablePatient, setDisablePatient] = useState(true);
  const [disablePayment, setDisablePayment] = useState(true);

  const [payments, setPayments] = useState(null);

  const paymentService = new PaymentService();

  useEffect(() => {
    paymentService.getPaymentsBy(user.cod_perfil, user.cod_usuario)
      .then(res => setPayments(res.data))
      .catch(err => {
        console.error(err);
        setPayments([]);
      });
    const isPatient = [6, 7].includes(user.cod_perfil);
    setDisablePatient(isPatient);
    setDisablePayment(!isPatient);
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
                  setPayment = {setPayment}
                  payments = {payments}
                  setPayments = {setPayments}
                  userPerfil = {user.cod_perfil}
                  payment = {payment}
                />
                <PaymentForm
                  toast = {toast}
                  paymentDialog = {paymentDialog}
                  payment = {payment}
                  setPaymentDialog = {setPaymentDialog}
                  submitted = {submitted}
                  setSubmitted = {setSubmitted}
                  setPayment = {setPayment}
                  payments = {payments}
                  setPayments = {setPayments}
                  emptyPayment = {emptyPayment}
                  disablePatient = {disablePatient}
                  disablePayment = {disablePayment}
                />
              </>
            )
          : (
              <>
                <PaymentTable 
                  toast = {toast}
                  setPaymentDialog = {setPaymentDialog}
                  setPayment = {setPayment}
                  payments = {payments}
                  setPayments = {setPayments}
                  userPerfil = {user.cod_perfil}
                  payment = {payment}
                />
                <PaymentFormPatient
                  toast = {toast}
                  paymentDialog = {paymentDialog}
                  payment = {payment}
                  setPaymentDialog = {setPaymentDialog}
                  submitted = {submitted}
                  setSubmitted = {setSubmitted}
                  setPayment = {setPayment}
                  payments = {payments}
                  setPayments = {setPayments}
                  emptyPayment = {emptyPayment}
                  disablePatient = {disablePatient}
                  disablePayment = {disablePayment}
                />
              </>
            )
      }
    </div>
  )
}

export default Payment;
