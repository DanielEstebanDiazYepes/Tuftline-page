
// --- Lógica para mostrar mensaje de verificación al cargar la página ---
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isVerified = urlParams.get('verified'); // Obtiene el parámetro 'verified' de la URL

    if (isVerified === 'true') {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            width: 400,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }   
        });
        Toast.fire({
            icon: "success",
            title: "Correo verificado correctamente",
        });
        return; // Sale de la función si el correo fue verificado
    }
});

// --- Lógica para el inicio de sesión cuando se hace clic en el botón ---
document.getElementById("button_crear_cuenta").addEventListener("click", async function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

    const userData = {
        email: document.getElementById("loginEmail").value.trim(),
        password: document.getElementById("loginPassword").value.trim(),
    };

    // Validación básica del lado del cliente antes de enviar la solicitud
    if (!userData.email || !userData.password) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Por favor, ingresa tu correo y contraseña.",
            confirmButtonText: "OK",
        });
        return; // Detiene la ejecución si los campos están vacíos
    }

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Importante para manejar las cookies de sesión
            body: JSON.stringify(userData),
        });

        const data = await response.json(); // Parsea la respuesta del servidor

        if (response.ok) {
            localStorage.setItem("token", data.token); // Si usas JWT
            localStorage.setItem("role", data.user.role); // Guarda el rol del usuario

            // Redirige según el rol del usuario
            if (data.user.role === "admin") {
                window.location.href = "/pages/admin/dashboard.html"; // Página de administración
            } else {
                window.location.href = "/index.html"; // Página de usuario normal
            }
        } else {
            Swal.fire({
                icon:"error",
                title: "Error de inicio de sesión",
                text: data.message || "Por favor, verifica tu correo o contraseña e inténtalo de nuevo.",
                confirmButtonText: "OK",
            });
            return; 
        }
    } catch (error) {
        Swal.fire("Hubo un error al iniciar sesión. Inténtalo de nuevo más tarde."); // Mensaje genérico para el usuario
    }
});