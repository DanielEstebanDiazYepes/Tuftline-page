// frontend/js/components/dynamic-navbar-loader.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("dynamic-navbar-loader.js: DOMContentLoaded - Iniciando carga del navbar dinámico.");
    const navbarContainer = document.getElementById('navbar-container'); // Este ID DEBE estar en tus HTML que lo usen

    if (navbarContainer) {
        fetch('/components/dynamic-navbar.html') // Ruta ABSOLUTA a tu archivo HTML del navbar
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                navbarContainer.innerHTML = html;
                console.log("dynamic-navbar-loader.js: Navbar HTML dinámico inyectado. Llamando a window.initDynamicNavbar().");
                // Llama a la función de inicialización de funcionalidades del navbar dinámico
                if (window.initDynamicNavbar) {
                    window.initDynamicNavbar();
                } else {
                    console.warn("dynamic-navbar-loader.js: window.initDynamicNavbar NO está definido. Funcionalidades dinámicas del navbar podrían no funcionar.");
                }
            })
            .catch(error => {
                console.error('dynamic-navbar-loader.js: Error cargando navbar dinámico:', error);
            });
    } else {
        console.warn("dynamic-navbar-loader.js: Elemento '#navbar-container' no encontrado. Asegúrate de tenerlo en el HTML donde quieras el navbar dinámico.");
    }
});