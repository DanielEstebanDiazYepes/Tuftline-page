document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/api/user/orders", {
            credentials: "include"
        });
        const orders = await res.json();

        const container = document.getElementById("facturas-container");

        if (orders.length === 0) {
            container.innerHTML = "<p>No tienes facturas registradas.</p>";
            return;
        }

        // Crear la tabla
        const table = document.createElement("table");
        table.classList.add("facturas-table"); // Agrega una clase para estilizarla con CSS

        // Crear el encabezado de la tabla (<thead>)
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        // Definir los títulos de las columnas exactamente como en la imagen
        const headers = ["ID de factura", "Productos", "Total", "Fecha", "Acciones"];

        headers.forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Crear el cuerpo de la tabla (<tbody>)
        const tbody = document.createElement("tbody");

        orders.forEach(order => {
            const row = document.createElement("tr"); // Crear una fila para cada orden

            // Celda ID
            const idCell = document.createElement("td");
            idCell.textContent = order._id;
            row.appendChild(idCell);

            // Celda Usuario (asumiendo que 'order.user' contiene el nombre del usuario)
            // Si 'order.user' no existe o tiene otra estructura, AJUSTA ESTA LÍNEA.
            // Por ejemplo, si es 'order.customerName', cambia 'order.user' a 'order.customerName'.

            // Celda Productos
            const productsCell = document.createElement("td");
            productsCell.textContent = `${order.products.length} productos`;
            row.appendChild(productsCell);

            // Celda Total
            const totalCell = document.createElement("td");
            totalCell.textContent = `$${order.total}`;
            row.appendChild(totalCell);

            // Celda Fecha
            const dateCell = document.createElement("td");
            dateCell.textContent = new Date(order.createdAt).toLocaleDateString();
            row.appendChild(dateCell);

            // Celda Acciones
            const actionsCell = document.createElement("td");

            // Botón "Ver"
            const verButton = document.createElement("button");
            verButton.textContent = "Ver Factura";
            verButton.classList.add("button-ver");

            const badgeHTML = getStatusBadge(order.status);

            verButton.onclick = () => verDetalle(order._id);
            actionsCell.appendChild(verButton);
            actionsCell.appendChild(badgeHTML); // HACEMOS QUE EL BADGE SEA HIJO DE actionsCell CON "appendChild"

function getStatusBadge(status) {
    const statusMap = {
        pending: { text: 'Pendiente', class: 'pending' },
        processing: { text: 'En proceso', class: 'processing' },
        completed: { text: 'Completado', class: 'completed' },
        cancelled: { text: 'Cancelado', class: 'cancelled' }
    };

    const statusInfo = statusMap[status] || { text: status, class: 'unknown' };

    // Create a new span element instead of returning a string
    const badgeSpan = document.createElement('span');
    badgeSpan.classList.add('status-badge', statusInfo.class);
    badgeSpan.textContent = statusInfo.text;

    return badgeSpan;
}


            row.appendChild(actionsCell);
            tbody.appendChild(row); // Agrega la fila al cuerpo de la tabla
        });

        table.appendChild(tbody); // Agrega el cuerpo a la tabla
        container.appendChild(table); // Agrega la tabla completa al contenedor
    } catch (err) {
        console.error("Error cargando facturas:", err);
        const container = document.getElementById("facturas-container");
        container.innerHTML = "<p>Hubo un error al cargar las facturas. Inténtalo de nuevo más tarde.</p>";
    }
});

// Esta función ya estaba definida en tu código original, solo la mantengo.
function verDetalle(orderId) {
    window.location.href = `/pages/user/orders-details.html?id=${orderId}`;
}