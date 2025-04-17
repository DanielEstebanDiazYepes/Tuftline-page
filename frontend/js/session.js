document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/auth/me"); // No necesitas credentials aquí
    const data = await res.json();

    console.log("✅ Datos de sesión:", data); // Agrega este console.log

    if (data.loggedIn) {
      const userInfo = document.getElementById("user-info");
      userInfo.textContent = `Hola, ${data.user.name}!`;
    }
  } catch (err) {
    console.error("Error al obtener sesión:", err);
  }
});
