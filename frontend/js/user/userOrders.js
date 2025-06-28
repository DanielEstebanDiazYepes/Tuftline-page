document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/orders/user", { credentials: "include" });
    const orders = await res.json();

    const container = document.getElementById("orders-container");
    container.innerHTML = "";

    orders.forEach(order => {
      const div = document.createElement("div");
      div.classList.add("order-preview");

      div.innerHTML = `
        <p><strong>ID:</strong> ${order._id}</p>
        <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total:</strong> $${order.total}</p>
        <button onclick="showDetails('${order._id}')">Ver detalles</button>
        <button onclick="printOrder('${order._id}')">Imprimir factura</button>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error al cargar órdenes del usuario:", err);
  }
});

async function showDetails(orderId) {
  try {
    const res = await fetch(`/api/orders/${orderId}`, { credentials: "include" });
    const order = await res.json();

    const panel = document.getElementById("order-details-panel");
    const content = document.getElementById("order-details-content");

    content.innerHTML = `
      <h2>Detalles de la Factura</h2>
      <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Dirección:</strong> ${order.shippingAddress.address}</p>
      <p><strong>Teléfono:</strong> ${order.shippingAddress.phone}</p>
      <ul>
        ${order.products.map(p => `
          <li>
            <p><strong>${p.name}</strong></p>
            <p>Cantidad: ${p.quantity} - Precio: $${p.price}</p>
          </li>
        `).join("")}
      </ul>
      <p><strong>Total:</strong> $${order.total}</p>
      <button onclick="printOrder('${order._id}')">Imprimir</button>
      <button onclick="closeDetails()">Cerrar</button>
    `;

    panel.classList.remove("hidden");
  } catch (err) {
    console.error("Error al cargar detalles de la orden:", err);
  }
}

function closeDetails() {
  document.getElementById("order-details-panel").classList.add("hidden");
}

function printOrder(orderId) {
  window.open(`/pages/orders/print-order.html?id=${orderId}`, "_blank");
}
