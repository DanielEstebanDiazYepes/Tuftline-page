
document.addEventListener("DOMContentLoaded", async () => { //CODIGO PARA MOSTRAR LA INFORMACION DEL USUARIO EN EL FORMULARIO
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
  
      if (data.loggedIn) {
        const user = data.user;
        document.getElementById("name").value = user.name || "";
        document.getElementById("address").value = user.address || "xxx";
        document.getElementById("phone").value = user.phone || "xxx";
        document.getElementById("email").value = user.email || "";
      } else {
        Swal.fire({
            title: "INICIE SESION",
            text: "Debes iniciar sesión para ver tu perfil",
            icon: "warning",
            confirmButtonText: "OK"
        }).then((result) => {
            if (result.isConfirmed) {
            window.location.href = "/pages/auth/login.html"; // Cambia por la ruta de tu login
        }
        });
        return;
        }
    } catch (error) {
      console.error("Error al obtener la sesión:", error);
    }
  });
  
document.getElementById("update-information").addEventListener("click", async (e) => {// CODIGO PARA ACTUALIZAR LA INFORMACION DEL USUARIO
    e.preventDefault();
  
    const updatedData = {
      name: document.getElementById("name").value,
      address: document.getElementById("address").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
  
    try {
      const res = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
  
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          text:"Información actualizada correctamente",
          confirmButtonText: "OK"
        });
        return;
      } else {
        Swal.fire({
          icon: "error",
          text: data.message || "Error al actualizar la información",
          confirmButtonText: "OK"
        });
        return;
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text:"Hubo un error",
        confirmButtonText: "OK"
      });
      return;
    }
  });

  document.getElementById("delete-account").addEventListener("click", async (e) => {
    e.preventDefault();
    
    const confirmDelete = await Swal.fire({
        icon: "warning",
        title: "Eliminación de cuenta",
        text: "¿ESTÁS SEGURO DE QUE QUIERES ELIMINAR LA CUENTA? PERDERÁS EL ACCESO A TODAS LAS FACTURAS ASOCIADAS A ELLA",
        confirmButtonText: "Eliminar",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    });
    
    if (confirmDelete.isConfirmed) {
        try {
            const res = await fetch("/api/auth/delete", {
                method: "DELETE",
                credentials: "include"
            });
            
            const data = await res.json();

            if (data.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Cuenta eliminada",
                    text: "Tu cuenta ha sido eliminada correctamente.",
                    confirmButtonText: "Aceptar"
                });
                window.location.href = "/index.html";
            } else {
                throw new Error(data.message || "No se pudo eliminar la cuenta");
            }
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Hubo un error al eliminar la cuenta",
                confirmButtonText: "Aceptar"
            });
        }
    }
});