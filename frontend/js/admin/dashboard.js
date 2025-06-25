document.addEventListener("DOMContentLoaded", async () => {
    // Verificar si el usuario es admin
    const checkAdmin = async () => {
        try {
            const res = await fetch("/api/auth/me", { credentials: "include" });
            const data = await res.json();
            
            if (!res.ok || data.user.role !== "admin") {
                window.location.href = "/index.html";
            }
        } catch (err) {
            window.location.href = "/index.html";
        }
    };

    await checkAdmin();

    // Elementos del DOM
    const productsTab = document.getElementById("products-tab");
    const ordersTab = document.getElementById("orders-tab");
    const usersTab = document.getElementById("users-tab");
    const tabLinks = document.querySelectorAll(".sidebar li");
    const logoutBtn = document.getElementById("logout-btn");
    const addProductBtn = document.getElementById("add-product-btn");
    const productModal = document.getElementById("product-modal");
    const closeModal = document.querySelector(".close-modal");
    const productForm = document.getElementById("product-form");

    // Cargar datos iniciales
    const loadProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const products = await res.json();
            renderProducts(products);
        } catch (err) {
            console.error("Error al cargar productos:", err);
            showAlert("Error al cargar productos", "error");
        }
    };

    const loadOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders"); // Cambiado a /api/admin/orders
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            
            const orders = await res.json();
            renderOrders(orders.data || orders); // Compatible con ambas estructuras de respuesta
        } catch (err) {
            console.error("Error al cargar órdenes:", err);
            showAlert(`Error al cargar órdenes: ${err.message}`, "error");
        }
    };

    // Renderizar productos en la tabla
    const renderProducts = (products) => {
        const tbody = document.getElementById("products-list");
        tbody.innerHTML = "";

        products.forEach((product) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${product._id}</td>
                <td>${product.name}</td>
                <td>${product.type || '-'}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td><img src="${product.imageUrl}" alt="${product.name}" width="50"></td>
                <td>
                    <button class="btn-primary edit-product" data-id="${product._id}">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="btn-danger delete-product" data-id="${product._id}">
                        <i class="material-icons">delete</i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Agregar eventos a los botones
        document.querySelectorAll(".edit-product").forEach(btn => {
            btn.addEventListener("click", (e) => openEditModal(e.target.closest("button").dataset.id));
        });

        document.querySelectorAll(".delete-product").forEach(btn => {
            btn.addEventListener("click", (e) => deleteProduct(e.target.closest("button").dataset.id));
        });
    };

    // Renderizar órdenes en la tabla
    const renderOrders = (orders) => {
        const tbody = document.getElementById("orders-list");
        tbody.innerHTML = "";

        if (!orders || orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-orders">No hay órdenes registradas</td>
                </tr>
            `;
            return;
        }

        orders.forEach((order) => {
            const tr = document.createElement("tr");
            tr.classList.add("order-row");
            tr.setAttribute("data-id", order._id);
            
            tr.innerHTML = `
                <td>${order._id}</td>
                <td>${order.userName || order.user?.name || 'Cliente no disponible'}</td>
                <td>${order.products?.length || 0} productos</td>
                <td>$${(order.total || 0).toFixed(2)}</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn-primary view-order" data-id="${order._id}">
                        <i class="material-icons">visibility</i> Ver
                    </button>
                    ${getStatusBadge(order.status)}
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Agregar eventos para ver detalles de la orden
        document.querySelectorAll(".view-order").forEach(btn => {
            btn.addEventListener("click", (e) => {
                viewOrderDetails(e.target.closest("button").dataset.id);
            });
        });
    };

    // Función para ver detalles de la orden
    const viewOrderDetails = async (orderId) => {
        try {
            showLoader();
            
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${await res.text()}`);
            }

            const order = await res.json();

            // Crear HTML para los productos
            const productsHTML = (order.products || []).map(product => `
                <div class="order-product">
                    <img src="${product.imageUrl || '/images/default-product.png'}" 
                         alt="${product.name}" width="80">
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <p><strong>Cantidad:</strong> ${product.quantity || 1}</p>
                        <p><strong>Precio unitario:</strong> $${(product.price || 0).toFixed(2)}</p>
                        <p><strong>Subtotal:</strong> $${((product.price || 0) * (product.quantity || 1)).toFixed(2)}</p>
                    </div>
                </div>
            `).join("");

            // Mostrar modal con los detalles
            const modalHTML = `
                <div class="order-details-modal">
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <h2>Factura #${order._id}</h2>
                        <p class="order-date">${new Date(order.createdAt).toLocaleString()}</p>
                        
                        <div class="order-section">
                            <h3>Información del Cliente</h3>
                            <p><strong>Nombre:</strong> ${order.userName || 'No disponible'}</p>
                            <p><strong>Email:</strong> ${order.userEmail || 'No disponible'}</p>
                        </div>
                        
                        <div class="order-section">
                            <h3>Productos</h3>
                            <div class="products-list">
                                ${productsHTML}
                            </div>
                            <div class="order-summary">
                                <p><strong>Total:</strong> $${(order.total || 0).toFixed(2)}</p>
                            </div>
                        </div>
                        
                        <div class="order-section">
                            <h3>Datos de Envío</h3>
                            <p><strong>Dirección:</strong> ${order.shippingAddress?.address || 'No disponible'}</p>
                            <p><strong>Teléfono:</strong> ${order.shippingAddress?.phone || 'No disponible'}</p>
                        </div>
                        
                        ${order.message ? `
                        <div class="order-section">
                            <h3>Mensaje Adicional</h3>
                            <p>${order.message}</p>
                        </div>
                        ` : ''}
                        
                        <div class="order-section">
                            <h3>Estado</h3>
                            ${getStatusBadge(order.status)}
                        </div>
                        
                        <button class="btn-primary print-btn" onclick="window.print()">
                            <i class="material-icons">print</i> Imprimir Factura
                        </button>
                    </div>
                </div>
            `;

            // Insertar el modal en el DOM
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Configurar evento para cerrar el modal
            document.querySelector('.order-details-modal .close-modal').addEventListener('click', () => {
                document.querySelector('.order-details-modal').remove();
            });
            
        } catch (err) {
            console.error("Error al cargar detalles de la orden:", err);
            showAlert(`Error al cargar la factura: ${err.message}`, "error");
        } finally {
            hideLoader();
        }
    };

    // Función auxiliar para mostrar el estado
    function getStatusBadge(status) {
        const statusMap = {
            pending: { text: 'Pendiente', class: 'pending' },
            processing: { text: 'En proceso', class: 'processing' },
            completed: { text: 'Completado', class: 'completed' },
            cancelled: { text: 'Cancelado', class: 'cancelled' }
        };
        
        const statusInfo = statusMap[status] || { text: status, class: 'unknown' };
        
        return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
    }

    // Mostrar loader
    function showLoader() {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.id = 'global-loader';
        document.body.appendChild(loader);
    }

    // Ocultar loader
    function hideLoader() {
        const loader = document.getElementById('global-loader');
        if (loader) loader.remove();
    }

    // Mostrar alerta
    function showAlert(message, type = 'success') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    // Abrir modal para editar/agregar producto
    const openEditModal = async (productId = null) => {
        const modalTitle = document.getElementById("modal-title");
        const form = document.getElementById("product-form");

        if (productId) {
            modalTitle.textContent = "Editar Producto";
            // Cargar datos del producto
            try {
                const res = await fetch(`/api/products/${productId}`);
                const product = await res.json();
                
                document.getElementById("product-id").value = product._id;
                document.getElementById("product-name").value = product.name;
                document.getElementById("product-type").value = product.type || "";
                document.getElementById("product-price").value = product.price;
                document.getElementById("product-description").value = product.description || "";
                document.getElementById("product-image").value = product.imageUrl;
            } catch (err) {
                console.error("Error al cargar producto:", err);
                showAlert("Error al cargar producto", "error");
            }
        } else {
            modalTitle.textContent = "Agregar Producto";
            form.reset();
        }

        productModal.style.display = "flex";
    };

    // Eliminar producto
    const deleteProduct = async (productId) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (res.ok) {
                loadProducts();
                showAlert("Producto eliminado correctamente", "success");
            } else {
                throw new Error("Error al eliminar producto");
            }
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            showAlert(err.message, "error");
        }
    };

    // Enviar formulario de producto
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const productId = document.getElementById("product-id").value;
        const isEdit = !!productId;

        const productData = {
            name: document.getElementById("product-name").value,
            type: document.getElementById("product-type").value || "",
            price: parseFloat(document.getElementById("product-price").value),
            description: document.getElementById("product-description").value,
            imageUrl: document.getElementById("product-image").value
        };

        try {
            const url = isEdit ? `/api/admin/products/${productId}` : "/api/products";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(productData)
            });

            if (res.ok) {
                productModal.style.display = "none";
                loadProducts();
                showAlert(`Producto ${isEdit ? 'actualizado' : 'creado'} correctamente`, "success");
            } else {
                throw new Error(`Error al ${isEdit ? 'actualizar' : 'crear'} producto`);
            }
        } catch (err) {
            console.error("Error al guardar producto:", err);
            showAlert(err.message, "error");
        }
    });

    // Cambiar entre pestañas
    tabLinks.forEach(link => {
        link.addEventListener("click", () => {
            tabLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            document.querySelectorAll(".tab-content").forEach(tab => {
                tab.classList.remove("active");
            });

            const tabId = link.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");

            // Cargar datos de la pestaña seleccionada
            if (tabId === "products-tab") loadProducts();
            if (tabId === "orders-tab") loadOrders();
        });
    });

    // Cerrar sesión
    logoutBtn.addEventListener("click", async () => {
        try {
            await fetch("/api/auth/logout", { credentials: "include" });
            window.location.href = "/index.html";
        } catch (err) {
            console.error("Error al cerrar sesión:", err);
            showAlert("Error al cerrar sesión", "error");
        }
    });

    // Abrir modal para agregar producto
    addProductBtn.addEventListener("click", () => openEditModal());

    // Cerrar modal
    closeModal.addEventListener("click", () => {
        productModal.style.display = "none";
    });

    // Cargar datos iniciales
    loadProducts();
    loadOrders();
});