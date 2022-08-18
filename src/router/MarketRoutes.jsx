import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from '../components/Sidebar/Sidebar';
import HomePage from '../pages/Home/Home';
import AppointmentPage from '../pages/Appointment/Appointment';
import AssignAppointment from '../pages/AssignAppointment/AssignAppointment';

function MarketRoutes() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/appointment' element={<AppointmentPage />} />
        <Route path='/assign-appointment' element={<AssignAppointment />} />

        <Route path='/*' element={<Navigate to='/' />}/>
      </Routes>
    </>
  )
}

export default MarketRoutes;
