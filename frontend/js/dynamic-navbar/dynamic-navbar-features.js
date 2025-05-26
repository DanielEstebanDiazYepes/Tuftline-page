// frontend/js/dynamic-navbar/dynamic-navbar-features.js

function initializeDynamicNavbarFeatures() {
    console.log("dynamic-navbar-features.js: initializeDynamicNavbarFeatures ejecutada para navbar dinámico.");

    // Lógica para user-info (mostrar el nombre del usuario logueado en el navbar inyectado)
    // Esto se ejecutará DESPUÉS de que el navbar se haya inyectado.
    fetch("/api/auth/me", {
        credentials: "include"
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("✅ Datos de sesión (navbar dinámico):", data);
        const userInfoDiv = document.querySelector("#navbar-container #user-info");
        // Asegúrate que tu dynamic-navbar.html tiene #user-info
        if (userInfoDiv) {
            if (data.loggedIn) {
                userInfoDiv.textContent = `Hola, ${data.user.name}`;
            } else {
                userInfoDiv.textContent = "No has iniciado sesión.";
                // Opcional: podrías cambiar el HTML para mostrar botones de login/registro si no hay sesión
                // const userInfoContainer = document.querySelector("#navbar-container #user-info-container");
                // if (userInfoContainer) {
                //     userInfoContainer.innerHTML = `<a href="/frontend/pages/auth/login.html" class="button">Inicia Sesión</a>`;
                // }
            }
        }
    })
    .catch(err => console.error("Error al obtener datos de sesión para navbar dinámico:", err));


    // Lógica para el dropdown de perfil en el navbar inyectado
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
          window.location.href = "/index.html"; // <-- REDIRECCIÓN
        } else {
          alert("No se pudo cerrar sesión.");
        }
      } catch (err) {
        console.error("Error al cerrar sesión:", err);
      }
    });
}

// Expone la función globalmente para que el cargador de navbar la llame.
window.initDynamicNavbar = initializeDynamicNavbarFeatures;