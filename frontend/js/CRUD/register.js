document.getElementById("registerButton").addEventListener("click", async function (event) {
  event.preventDefault(); // Previene el envío del formulario por defecto

  const userData = {
    name: document.getElementById("name").value.trim(),
    address: document.getElementById("address").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim(),
  };

  if (!userData.name || !userData.address || !userData.phone || !userData.email || !userData.password) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text:"Por favor, rellena todos los campos",
        confirmButtonText: "OK",
        backdrop: "none" // Fondo semitransparente
      });
      return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
      Swal.fire({
        icon: "error",
        title: "Correo electrónico inválido",
        text:"Por favor, introduce un correo electrónico válido",
        confirmButtonText: "OK",
      });
      return;
  }
  // Puedes añadir validación para el teléfono, longitud de contraseña, etc.

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Esto es importante para el manejo de sesiones/cookies con Passport
      body: JSON.stringify(userData),
    });

    const data = await response.json(); // Parsea la respuesta JSON del servidor

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text:" Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para verificar tu cuenta.",
        confirmButtonText: "OK",
      });
      // Opcional: Limpiar el formulario después del registro exitoso
      document.getElementById("name").value = "";
      document.getElementById("address").value = "";
      document.getElementById("phone").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";

      return;

    } else {
      // Si hubo un error en el registro (ej. usuario ya existe), muestra el mensaje del servidor
      Swal.fire({
        icon: "error",
        title: "Error de registro",
        text:" Error: " + (data.message || "No se pudo completar el registro. Por favor, inténtalo de nuevo más tarde."),
        confirmButtonText: "OK",
      });
      return;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text:"Hubo un problema al conectar con el servidor. Por favor, intenta de nuevo más tarde.",
      confirmButtonText: "OK",
    });
    return;
  }
});