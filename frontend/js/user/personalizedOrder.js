async function submitCustomOrder() {
    const form = document.getElementById('customOrderForm');
    const submitBtn = document.querySelector('#customOrderForm .submit-btn');
    const formData = new FormData(form);
    
    // Validación básica
    if (!formData.get('orderName') || !formData.get('width') || !formData.get('height') || !formData.get('price')) {
        Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';

    try {
        const response = await fetch('/api/custom-order/create', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al procesar el pedido');
        }

        // Mostrar confirmación
        Swal.fire({
            icon: 'success',
            title: 'Pedido realizado con éxito',
            html: `
                <p>Hemos recibido tu pedido personalizado "${formData.get('orderName')}".</p>
                <p>Nos comunicaremos contigo pronto para confirmar los detalles.</p>
                <p>N° de pedido: <strong>${data.orderId}</strong></p>
            `,
            confirmButtonText: 'Entendido'
        }).then(() => {
            window.location.href = '/index.html'; // Redirigir a la página de pedidos
        });

    } catch (err) {
        console.error('Error al enviar el pedido:', err);
        Swal.fire('Error', err.message || 'Ocurrió un error al procesar tu pedido', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Pedido';
    }
}

// Configurar el evento del formulario
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('customOrderForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitCustomOrder();
    });

    // Cargar datos del usuario si está autenticado
    loadUserData();
});

async function loadUserData() {
    try {
        const response = await fetch('/api/protected/user', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const user = await response.json();
            document.getElementById('customerName').value = user.name || '';
            document.getElementById('customerEmail').value = user.email || '';
            document.getElementById('shippingAddress').value = user.address || '';
            document.getElementById('phone').value = user.phone || '';
        }
    } catch (err) {
        console.error('Error al cargar datos del usuario:', err);
    }
}