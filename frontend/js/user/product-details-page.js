async function fetchProductDetails() {
    console.log("fetchProductDetails se está ejecutando");
    const productId = window.location.pathname.split('/').pop();
    console.log("Product ID:", productId);
    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();
        console.log("Datos del producto recibidos:", product); // <---- INSPECCIONA ESTE OBJETO

        if (product) {
            const productImage = document.getElementById("product-image");
            const productName = document.getElementById("product-name");
            const productDescription = document.getElementById("product-description");
            const productPrice = document.getElementById("product-price");

            if (productImage) productImage.src = product.imageUrl;
            if (productName) productName.textContent = product.name;
            if (productDescription) productDescription.textContent = product.description;
            if (productPrice && product.price !== undefined) productPrice.textContent = `$${product.price}`;

        } else {
            document.querySelector(".product-details-container").innerHTML = "<p>Producto no encontrado.</p>";
        }
    } catch (error) {
        console.error("Error al cargar los detalles del producto:", error);
        document.querySelector(".product-details-container").innerHTML = "<p>Error al cargar los detalles del producto.</p>";
    }
}

document.addEventListener("DOMContentLoaded", fetchProductDetails);