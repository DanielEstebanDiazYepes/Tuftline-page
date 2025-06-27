document.addEventListener("DOMContentLoaded", async () => {
  const adminBtn = document.getElementById("admin-float-btn");

  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include"
    });

    const data = await res.json();

    if (data.loggedIn && data.user.role === "admin") {
      adminBtn.style.display = "block";
    } else {
      adminBtn.remove(); // Elimina el botón si no es admin o no ha iniciado sesión
    }
  } catch (err) {
    console.error("Error al obtener info del usuario:", err);
    adminBtn.remove(); // Seguridad: oculta el botón si hay error
  }
});
