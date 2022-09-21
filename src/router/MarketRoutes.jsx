import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from '../components/Sidebar/Sidebar';
import HomePage from '../pages/Home/Home';
import RequestAppointmentPage from '../pages/Appointment/RequestAppointment';
import PaymentPage from '../pages/Payment/Payment';
import DoctorPage from '../pages/Doctor/Doctor';
import SingleDoctorPage from '../pages/Doctor/SingleDoctor';
import AppointmentPage from '../pages/Appointment/Appointment';
import IndicatorPage from '../pages/Indicator/IndicatorPage';
import MaeIndicatorPage from '../pages/MaeIndicator/MaeIndicatorPage';

function MarketRoutes() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/payment' element={<PaymentPage />} />
        {/* <Route path='/profile' element={<RequestAppointmentPage />} /> */}
        <Route path='/request-appointment' element={<RequestAppointmentPage />} />
        <Route path='/medical-appointment' element={<AppointmentPage />} />
        <Route path='/doctor-availability' element={<SingleDoctorPage />} />
        <Route path='/medical-availability' element={<DoctorPage />} />
        <Route path='/indicator' element={<IndicatorPage />} />
        <Route path='/generic-indicator' element={<MaeIndicatorPage />} />

        <Route path='/*' element={<Navigate to='/' />}/>
      </Routes>
    </>
  )
}

export default MarketRoutes;
