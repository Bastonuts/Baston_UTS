// login.js
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Redirigir a la ruta protegida "/dashboard" (no /dashboard.html)
      window.location.href = '/dashboard';
    } else {
      document.getElementById('errorMsg').innerText = 'Nombre o contraseña incorrectos';
    }
  });

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
        // Redirigir a login.html tras cerrar sesión
        window.location.href = '/login.html';
      } else {
        console.error('Error al cerrar sesión:', result.message);
      }
    } catch (error) {
      console.error('Error en la solicitud de cierre de sesión:', error);
    }
  });
  
  
  