document.addEventListener("DOMContentLoaded", async () => {
  // --- DESPLEGABLE DEL USUARIO ---
  const select = document.querySelector(".user-select");
  if (select) {
    select.addEventListener("click", (e) => {
      e.stopPropagation();
      select.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      select.classList.remove("open");
    });
  }

  // --- BOTONES DE PERFIL Y CERRAR SESIÓN ---
  const profileBtn = document.getElementById("profile-btn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = "/pages/user/profile.html";
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (data.success) {
          window.location.href = "/index.html";
        } else {
          alert("No se pudo cerrar sesión.");
        }
      } catch (err) {
        console.error("Error al cerrar sesión:", err);
      }
    });
  }

  // --- VERIFICAR SESIÓN DEL USUARIO Y MOSTRAR NOMBRE ---
  try {
    const sessionRes = await fetch("/api/auth/me", {
      credentials: "include",
    });
    const data = await sessionRes.json();
    console.log("✅ Datos de sesión:", data);

    const userInfoDiv = document.querySelector(".user-info");
    const hideDiv = document.getElementById("container-btn-log-reg-text");

    if (data.loggedIn) {
      userInfoDiv.textContent = `Hola, ${data.user.name}`;

      if (hideDiv) {
        hideDiv.style.display = "none";
      }
    } else {
      userInfoDiv.textContent = "No has iniciado sesión.";
    }
  } catch (err) {
    console.error("Error al cargar datos de sesión:", err);
  }


});



