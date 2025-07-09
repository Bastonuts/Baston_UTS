document.addEventListener('DOMContentLoaded', async () => {
  const MAX_DATOS = 10; // Número máximo de datos a mostrar

  // Función para obtener usuarios
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const users = await response.json();

      const usersTableBody = document.querySelector('#usersTable tbody');
      usersTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
        `;
        usersTableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Función para obtener los datos del bastón inteligente
  const fetchDatosBaston = async () => {
    try {
      const response = await fetch('/api/datos_baston');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let datosBaston = await response.json();

      // Limitar los datos a los más recientes
      const datosLimitados = datosBaston.slice(0, MAX_DATOS); // Limitar a los últimos 3 datos

      // Datos GPS
      const gpsContainer = document.querySelector('#gpsData');
      gpsContainer.innerHTML = ''; // Limpiar contenido anterior
      datosLimitados.forEach(dato => {
        const googleMapsLink = `https://www.google.com/maps?q=${dato.longitud},${dato.latitud}`;
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${dato.id}</td>
          <td>${dato.latitud}</td>
          <td>${dato.longitud}</td>
          <td>${dato.fecha}</td>
          <td><a href="${googleMapsLink}" target="_blank">Ver en Google Maps</a></td>
        `;
        gpsContainer.appendChild(row);
      });
      // Datos de Alertas
      const alertasContainer = document.querySelector('#alertaslData');
      alertasContainer.innerHTML = ''; // Limpiar contenido anterior
      datosLimitados.forEach(dato => {
        let mensajeAlerta = dato.posicion === "Bastón Caído" ? "⚠️ ¡Alerta! Posible caída detectada" : "✅ Todo en orden";
      const row = document.createElement('tr');
      row.innerHTML = `
         <td>${mensajeAlerta}</td>
         <td>${dato.fecha}</td>
        `;
      alertasContainer.appendChild(row);
     });

      // Datos Giroscopio
      const giroscopioContainer = document.querySelector('#giroscopioData');
      giroscopioContainer.innerHTML = ''; // Limpiar contenido anterior
      datosLimitados.forEach(dato => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${dato.id}</td>
          <td>${dato.posicion}</td>
          <td>${dato.fecha}</td>
        `;
        giroscopioContainer.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching datos_baston:', error);
    }
  };

  // Función para formatear la fecha
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

  // Obtener datos al cargar la página
  await fetchUsers();
  await fetchDatosBaston();

  // Actualizar cada 10 segundos
  setInterval(fetchUsers, 10000);
  setInterval(fetchDatosBaston, 10000);
});

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.success) {
      // Redirigir a la página de login tras cerrar sesión
      window.location.href = '/';
    } else {
      console.error('Error al cerrar sesión:', result.message);
    }
  } catch (error) {
    console.error('Error en la solicitud de cierre de sesión:', error);
  }
});