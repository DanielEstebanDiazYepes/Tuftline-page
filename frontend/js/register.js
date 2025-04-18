document.getElementById("registerButton").addEventListener("click", async function (event) { //creamos un funcion y encerramos todo el codigo dentro de ella
    event.preventDefault();
  
    const userData = {
      name: document.getElementById("name").value.trim(),
      address: document.getElementById("address").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", { //con el fetch mandamos los datos a este direccion "backend"
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Con esto mandamos una solicitud POST para crear un usuario usando la estructura JSON
        body: JSON.stringify(userData), 
      });
  
      const data = await response.json(); // Recibir respuesta del servidor
  
      if (response.ok) {
        alert("Cuenta creada exitosamente!");
        window.location.href = "/index.html";
      } else {
        alert(data.message || "Error al registrar el usuario.");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un error al registrar el usuario.");
    }
  });
  