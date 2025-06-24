document.getElementById("button_crear_cuenta").addEventListener("click", async function (event) { 
    event.preventDefault();
  
const userData = {
    email: document.getElementById("loginEmail").value.trim(),
    password: document.getElementById("loginPassword").value.trim(),
}
try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
        alert("Usuario logueado correctamente!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role); // User el "data.user.role" para poder acceder al rol del usuario logueado y redirigirlo a la pagina correspondiente
        if (data.user.role === "admin") {
            window.location.href = "/pages/admin/dashboard.html"; // Página de administración
        } else {
            window.location.href = "/index.html"; // Página de usuario normal
        }
    } else {
        alert(data.message || "Error al loguear el usuario.");
        }
    } catch (error) {
        alert("Error al loguear el usuario.");
    }
    });
