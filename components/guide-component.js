document.addEventListener('DOMContentLoaded', function () {
    const modalContainer = document.getElementById('modal-container');
    // Cargar el modal en la página
    modalContainer.innerHTML = `
        <div id="modalOverlay" class="modal-overlay"></div>
        <div id="guideModal" class="modal">
            <div class="modal-header">
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div id="guideContent">Cargando contenido...</div>
            </div>
        </div>
    `;
    const modal = document.getElementById('guideModal');
    const overlay = document.getElementById('modalOverlay');
    const guideContent = document.getElementById('guideContent');
    const closeBtn = document.querySelector('.close');
    
    // Función para cerrar el modal
    function closeModal() {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
    
    // Función para abrir el modal
    function openModal() {
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }
    
    // Función para cargar contenido dinámicamente en el modal
    function loadHTML(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                // Extraer el título del contenido cargado
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const titleElement = doc.querySelector('header.title-modal h1');
                const title = titleElement ? titleElement.textContent : 'Contenido';
                
                // Limpiar el contenido (remover el header)
                const bodyContent = doc.body.innerHTML;
                const cleanContent = bodyContent.replace(/<header[^>]*>[\s\S]*?<\/header>/, '');
                
                guideContent.innerHTML = cleanContent;
                
                // Establecer el título en el modal-header
                const modalHeaderTitle = document.querySelector('.modal-header');
                modalHeaderTitle.innerHTML = `<h2>${title}</h2><span class="close">×</span>`;
                
                // Re-asignar evento al nuevo botón close
                const newCloseBtn = document.querySelector('.close');
                newCloseBtn.addEventListener('click', function (event) {
                    event.stopPropagation();
                    closeModal();
                });
                
                openModal();
                // Asegurar que el scroll comience en la parte superior
                document.querySelector('.modal-body').scrollTop = 0;
            })
            .catch(error => {
                guideContent.innerHTML = '<p>Error al cargar el contenido.</p>';
                console.error('Error al cargar el archivo:', error);
            });
    }
    
    // Abre el modal con contenido específico al hacer clic en los enlaces
    document.getElementById('guia-text').addEventListener('click', function (event) {
        event.preventDefault();
        loadHTML('../pages/guia.html');
    });
    document.getElementById('regla-text').addEventListener('click', function (event) {
        event.preventDefault();
        loadHTML('../pages/reglas.html');
    });
    document.getElementById('sitios-text').addEventListener('click', function (event) {
        event.preventDefault();
        loadHTML('../pages/sitios.html');
    });
    
    // Cerrar al hacer clic en el botón X
    closeBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        closeModal();
    });
    
    // Cerrar al hacer clic en el overlay (fondo)
    overlay.addEventListener('click', function () {
        closeModal();
    });
    
    // Prevenir que clicks dentro del modal cierren el modal
    modal.addEventListener('click', function (event) {
        event.stopPropagation();
    });
});
