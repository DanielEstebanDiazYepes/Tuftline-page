// frontend/js/index/products.js

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("product-container");
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");

    const renderProducts = (products) => {
        container.innerHTML = "";

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
                <img src="${prod.imageUrl}" alt="${prod.name}" class="image-products" />
                <h3>${prod.name}</h3>
                <strong>$${prod.price}</strong>
            `;

            const menu = createMenuIcon(prod);
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

    // BÚSQUEDA
    document.addEventListener('submit', (event) => {
        if (event.target && event.target.id === 'search-form') {
            event.preventDefault();

            const searchInput = event.target.querySelector('#search-input');
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            handleProductSearch(searchTerm); 
        }
    });

    // BOTÓN DE BÚSQUEDA (ícono)
    document.addEventListener('click', (event) => {
        const searchIcon = event.target.closest('#search-icon');
        if (searchIcon) {
            const searchForm = document.getElementById('search-form');
            if (searchForm) {
                searchForm.dispatchEvent(new Event('submit', { bubbles: true }));
            } else {
                console.warn("products.js: No se encontró el formulario de búsqueda.");
            }
        }
    });

    // BÚSQUEDA POR TEXTO
    function handleProductSearch(searchTerm) {
        console.log(`Buscando productos con: "${searchTerm}"`);
        if (!searchTerm) {
            loadAllProducts();
            return;
        }

        fetch(`/api/products/search/${encodeURIComponent(searchTerm)}`)
            .then(res => res.json())
            .then(products => renderProducts(products))
            .catch(err => {
                console.error("Error al buscar productos:", err);
                container.innerHTML = "<p>Error al buscar productos.</p>";
            });
    }

    // FILTRO POR CATEGORÍA (CLIC EN CATEGORÍA)
    function filterByCategory(category) {
        document.querySelectorAll('.product-card-slider').forEach(card => {
        card.addEventListener('click', (e) => {
        document.querySelectorAll('.product-card-slider').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
            });
        });
        
        fetch(`/api/products/category/${encodeURIComponent(category)}`)
            .then(res => res.json())
            .then(products => renderProducts(products))
            .catch(err => {
                console.error("Error al filtrar productos:", err);
                container.innerHTML = "<p>Error al filtrar productos.</p>";
            });
    }

    // 👉 Hacemos visible esta función al HTML
    window.filterByCategory = filterByCategory;

    // Carga inicial
    loadAllProducts();
});


// MENÚ FLOTANTE (FAV/CART)
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
    
    cartIcon.addEventListener("click", async (e) => {
        e.stopPropagation(); 
        e.preventDefault(); 
        const isDefault = cartIcon.getAttribute("data-state") === "default"; 
        cartIcon.textContent = isDefault ? "shopping_cart_off" : "shopping_cart";
        cartIcon.setAttribute("data-state", isDefault ? "off" : "default");

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

    favIcon.addEventListener("click", async (e) => {
        e.stopPropagation(); 
        e.preventDefault(); 
        const isDefault = favIcon.getAttribute("data-state") === "default";
        favIcon.textContent = isDefault ? "stars" : "star";
        favIcon.setAttribute("data-state", isDefault ? "on" : "default");

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

    return menu;
};
