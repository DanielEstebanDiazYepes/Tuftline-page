document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("product-container");
  
    try {
      const response = await fetch("/api/products");
      const productos = await response.json();
  
      productos.forEach(prod => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
          <img src="${prod.imageUrl}" alt="${prod.name}" />
          <h3>${prod.name}</h3>
          <p>${prod.description}</p>
          <strong>$${prod.price}</strong>
        `;
        container.appendChild(div);
      });
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  });
  