import React, { useEffect, useState } from 'react'
import { RequestAppointmentService } from '../../services/RequestAppointmentService';

function Home() {
  const [, setResponse] = useState(null);

  useEffect(() => {
    async function healtCheck() {
      const as = new RequestAppointmentService();
      setResponse(await as.healthCheck());
    }

    healtCheck();
  }, []);

  return (
    <div className="home-container"></div>
  )
}

export default Home;