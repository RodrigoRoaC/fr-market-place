import './App.css';
import {
  Navigate,
  Routes,
  Route,
} from "react-router-dom";

import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { UserContext } from './context/UserContext';
import { useContext } from 'react';
import MarketRoutes from './router/MarketRoutes';
import AuthRoutes from './router/AuthRoutes';
import { addLocale, locale } from 'primereact/api';

function App() {
  const { user } = useContext(UserContext);

  addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
  });

  locale('es');

  return (
    <Routes>
      {
        !!user 
          ?  <Route path='/*' element={<MarketRoutes />}/>
          :  <Route path='/auth/*' element={<AuthRoutes />}/>
      }

      <Route path='/*' element={<Navigate to='/auth/login' />}/>
    </Routes>
  );
}

export default App;
