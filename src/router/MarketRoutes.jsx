import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from '../components/Sidebar/Sidebar';
import HomePage from '../pages/Home/Home';
import AppointmentPage from '../pages/Appointment/Appointment';
import PaymentPage from '../pages/Payment/Payment';
import DoctorPage from '../pages/Doctor/Doctor';

function MarketRoutes() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/profile' element={<AppointmentPage />} />
        <Route path='/request-appointment' element={<AppointmentPage />} />
        <Route path='/medical-appointment' element={<AppointmentPage />} />
        <Route path='/medical-availability' element={<DoctorPage />} />

        <Route path='/*' element={<Navigate to='/' />}/>
      </Routes>
    </>
  )
}

export default MarketRoutes;
