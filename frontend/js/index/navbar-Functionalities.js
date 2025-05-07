document.addEventListener("DOMContentLoaded", () => { //CODIGO PARA LISTA DESPLEGABLE DE USUARIO (PERFIL Y CERRAR SESIÓN)

    const select = document.querySelector(".user-select");
  
    select.addEventListener("click", (e) => {
      e.stopPropagation();                      // Evita que se cierre instantáneamente
      select.classList.toggle("open");
    });
  
    document.addEventListener("click", () => {  // Cierra el menú al hacer clic fuera
      select.classList.remove("open");
    });
    
    document.getElementById("profile-btn").addEventListener("click", () => {
      window.location.href = "/pages/user/profile.html"; // ir a la página de perfil
    });
  
    document.getElementById("logout-btn").addEventListener("click", async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "GET",
          credentials: "include",
        });
    
        const data = await res.json();
        if (data.success) {
          window.location.href = ""; // <-- REDIRECCIÓN
        } else {
          alert("No se pudo cerrar sesión.");
        }
      } catch (err) {
        console.error("Error al cerrar sesión:", err);
      }
    });
    
  });

  
  fetch("/api/auth/me", {
    credentials: "include"
  })
    .then((res) => res.json())// Codigo para mostrar el nombre del usuario (SU SESION) en la parte superior derecha de la pagina
    .then((data) => {
      console.log("✅ Datos de sesión:", data);
      const userInfoDiv = document.querySelector(".user-info");
      const hideDiv = document.getElementById("container-btn-log-reg-text");

      if (data.loggedIn) {
        userInfoDiv.textContent = `Hola, ${data.user.name}`;
        
        if (hideDiv) { // Oculta el div si el usuario está logueado
          hideDiv.style.display = "none"; 
        }

      } else {
        userInfoDiv.textContent = "No has iniciado sesión.";
      }
    });