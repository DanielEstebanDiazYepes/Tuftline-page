// frontend/js/index/products.js

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("product-container");
    const form = document.getElementById("search-form"); // Usa el ID del formulario
    const input = document.getElementById("search-input"); // Usa el ID del input
    // const iconSearch = document.querySelector(".icon-search"); // Ya no es necesario si usas el ID en el botón

    // Ya no es necesario `iconSearch.addEventListener("click", () => { form.requestSubmit(); });`
    // porque la delegación de eventos y el evento 'submit' en el form ya lo manejan.

    // FUNCIONES AUXILIARES (mantienen tu lógica)
    const renderProducts = (products) => {
        container.innerHTML = ""; // Limpiar contenedor

        if (products.length === 0) {
            container.innerHTML = "<p>No se encontraron productos.</p>";
            return;
        }

        products.forEach(prod => {
            const link_card = document.createElement("a");
            link_card.href = `/products/${prod._id}`;
            link_card.className = "product-link-card";

            const div = document.createElement("div");
            div.className = "product-card";
            div.innerHTML = `
                <img src="${prod.imageUrl}" alt="${prod.name}" />
                <h3>${prod.name}</h3>
                <strong>$${prod.price}</strong>
            `;

            const menu = createMenuIcon(prod); // Asumiendo que createMenuIcon sigue existiendo
            menu.style.display = "none";
            div.appendChild(menu);

            div.addEventListener("mouseenter", () => {
                menu.style.display = "flex";
            });
            div.addEventListener("mouseleave", () => {
                menu.style.display = "none";
            });

            link_card.appendChild(div);
            container.appendChild(link_card);
        });
    };

    const loadAllProducts = async () => {
        try {
            const response = await fetch("/api/products");
            const productos = await response.json();
            renderProducts(productos);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    };

    // --- DELEGACIÓN DE EVENTOS PARA LA BARRA DE BÚSQUEDA DEL NAVBAR DE INDEX ---
    // Esto es para el formulario con ID 'search-form'
    document.addEventListener('submit', (event) => {
        if (event.target && event.target.id === 'search-form') {
            event.preventDefault(); // Evitar el envío tradicional del formulario

            const searchInput = event.target.querySelector('#search-input');
            const searchTerm = searchInput ? searchInput.value.trim() : '';

            // Llama a tu función de búsqueda existente
            handleProductSearch(searchTerm); 
        }
    });

    // Esto es para el clic en el botón con ID 'search-icon'
    document.addEventListener('click', (event) => {
        const searchIcon = event.target.closest('#search-icon'); // Busca el botón de búsqueda por su ID
        if (searchIcon) {
            const searchForm = document.getElementById('search-form');
            if (searchForm) {
                // Si el ícono de búsqueda es clickeado, dispara el submit del formulario.
                searchForm.dispatchEvent(new Event('submit', { bubbles: true }));
            } else {
                console.warn("products.js: Formulario de búsqueda '#search-form' no encontrado al hacer clic en el ícono.");
            }
        }
    });

    // Función para manejar la lógica de búsqueda de productos
    function handleProductSearch(searchTerm) {
        console.log(`products.js: Buscando productos con término: "${searchTerm}" en index.html`);
        // Aquí puedes reutilizar la lógica que ya tienes para la búsqueda
        // Por ejemplo, la parte que estaba dentro del `form.addEventListener("submit", ...)`
        // y que llama a `/api/products/search/${encodeURIComponent(query)}`
        if (!searchTerm) {
            loadAllProducts(); // Carga todos si el término está vacío
            return;
        }

        try {
            fetch(`/api/products/search/${encodeURIComponent(searchTerm)}`)
                .then(res => res.json())
                .then(products => renderProducts(products))
                .catch(err => {
                    console.error("Error al buscar productos:", err);
                    container.innerHTML = "<p>Error al buscar productos.</p>";
                });
        } catch (err) {
            console.error("Error al iniciar búsqueda de productos:", err);
            container.innerHTML = "<p>Error al buscar productos.</p>";
        }
    }


    // Cargar todos los productos inicialmente al cargar la página
    loadAllProducts();
});


// Asumiendo que createMenuIcon está definido en products.js o en otro script cargado antes
// Si no, deberías añadirlo aquí o en un archivo compartido si lo usas en otros sitios
const createMenuIcon = (prod) => {
    const menu = document.createElement("div");
    menu.className = "menu-icon";
    menu.innerHTML = `
        <div class="icon-cart">
            <span class="material-symbols-outlined" data-state="default">shopping_cart</span>
        </div>
        <div class="icon-favorite">
            <span class="material-symbols-outlined" data-state="default">star</span>
        </div>
    `;

    const cartIcon = menu.querySelector(".icon-cart span");
    const favIcon = menu.querySelector(".icon-favorite span");
    
    cartIcon.addEventListener("click", (e) => {
        e.stopPropagation(); 
        e.preventDefault(); 
        const isDefault = cartIcon.getAttribute("data-state") === "default"; 
        cartIcon.textContent = isDefault ? "shopping_cart_off" : "shopping_cart";
        cartIcon.setAttribute("data-state", isDefault ? "off" : "default");
    });

    favIcon.addEventListener("click", (e) => {
        e.stopPropagation(); 
        e.preventDefault(); 
        const isDefault = favIcon.getAttribute("data-state") === "default";
        favIcon.textContent = isDefault ? "stars" : "star";
        favIcon.setAttribute("data-state", isDefault ? "on" : "default");
    });

    favIcon.addEventListener("click", async () => { 
        try {
            console.log("Agregando favorito con ID:", prod._id);
            await fetch("/api/favorites/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: prod._id }) 
            });
            console.log("Producto agregado a favoritos");
        } catch (err) {
            console.error("Error al agregar a favoritos:", err);
        }
    });

    cartIcon.addEventListener("click", async () => { 
        try {
            console.log("Agregando al carrito con ID:", prod._id);
            await fetch("/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: prod._id }) 
            });
            console.log("Producto agregado al carrito");
        } catch (err) {
            console.error("Error al agregar al carrito:", err);
        }
    });

    return menu;
};