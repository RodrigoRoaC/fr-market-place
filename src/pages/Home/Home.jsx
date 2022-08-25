import React, { useEffect, useState } from 'react'
import { AppointmentService } from '../../services/AppointmentService';

function Home() {
  const [, setResponse] = useState(null);

  useEffect(() => {
    async function healtCheck() {
      const as = new AppointmentService();
      setResponse(await as.healthCheck());
    }

    healtCheck();
  }, []);

  return (
    <div className="home-container"></div>
  )
}

export default Home;