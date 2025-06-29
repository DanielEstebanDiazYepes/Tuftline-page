  document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    try {
      const res = await fetch(`/api/user/orders`);
      const orders = await res.json();


      const order = orders.find(o => o._id === id);
      if (!order) return alert("Factura no encontrada.");

      const cont = document.getElementById("detalle-container");

      //CREAMOS EL DIV DE LOS PRODUCTOS Y LO ALMACENAMOS EN UNA VARIABLE
      const productsHTML = (order.products || []).map(product => ` 
          <div class="order-product">
            <img src="${product.imageUrl || '/images/default-product.png'}" 
              alt="${product.name}" width="80">
                <div class="product-info">
                  <h4>${product.name}</h4>
                    <p><strong>Cantidad:</strong> ${product.quantity || 1}</p>
                    <p><strong>Precio unitario:</strong> $${(product.price || 0).toFixed(2)}</p>
                </div>
                </div>
            `).join("");

//AQUI CARGAMOS LA FACTRA 
      cont.innerHTML = `
        <div class="order-header">
        <p>${new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Cliente: ${order.userName}</p>
        <p>Email: ${order.userEmail}</p>
        <p>Dirección: ${order.shippingAddress.address}</p>
        <p>Teléfono: ${order.shippingAddress.phone}</p>
        <hr/>
        </div>
        <div class="aditional-message">
          <h3>Mensaje Adicional</h3>
          <p>${order.message}</p>
        </div>
        <div class="section-order-products">
        <h3>Productos:</h3>
          ${productsHTML}
        </div>
        <p>Total: $${order.total}</p>
      `;
    } catch (err) {
      console.error("Error:", err);
    }


  });