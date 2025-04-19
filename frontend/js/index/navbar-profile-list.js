document.addEventListener("DOMContentLoaded", () => {

    const select = document.querySelector(".user-select");
  
    select.addEventListener("click", (e) => {
      e.stopPropagation();                      // Evita que se cierre instantáneamente
      select.classList.toggle("open");
    });
  
    document.addEventListener("click", () => {  // Cierra el menú al hacer clic fuera
      select.classList.remove("open");
    });
    
    document.getElementById("profile-btn").addEventListener("click", () => {
      window.location.href = "/pages/CRUD/profile.html"; // ir a la página de perfil
    });
  
    document.getElementById("logout-btn").addEventListener("click", async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "GET",
          credentials: "include",
        });
    
        const data = await res.json();
        if (data.success) {
          window.location.href = "/pages/CRUD/login.html"; // <-- REDIRECCIÓN
        } else {
          alert("No se pudo cerrar sesión.");
        }
      } catch (err) {
        console.error("Error al cerrar sesión:", err);
      }
    });
    
  });
