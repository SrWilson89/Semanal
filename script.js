// Función para cargar los datos desde localStorage al cargar la página
function loadData() {
    const table = document.getElementById('data-table');
    const savedData = JSON.parse(localStorage.getItem('tableData'));

    if (savedData) {
        for (let i = 1; i < table.rows.length; i++) {
            for (let j = 1; j < table.rows[i].cells.length; j++) {
                table.rows[i].cells[j].innerText = savedData[i - 1][j - 1];
            }
        }
    }
}

// Función para guardar los datos en localStorage
function saveData() {
    const table = document.getElementById('data-table');
    const data = [];

    for (let i = 1; i < table.rows.length; i++) {
        const row = [];
        for (let j = 1; j < table.rows[i].cells.length; j++) {
            row.push(table.rows[i].cells[j].innerText);
        }
        data.push(row);
    }

    localStorage.setItem('tableData', JSON.stringify(data));
    alert('Datos guardados');
}

// Función para borrar los datos de la tabla y de localStorage
function clearData() {
    const confirmar = confirm("¿Estás seguro de que quieres borrar todos los datos de la semana? Esta acción no se puede deshacer.");

    if (confirmar) {
        const table = document.getElementById('data-table');

        for (let i = 1; i < table.rows.length; i++) {
            for (let j = 1; j < table.rows[i].cells.length; j++) {
                table.rows[i].cells[j].innerText = '';
            }
        }

        localStorage.removeItem('tableData');
        alert('Datos borrados');
    }
}

// Función para generar y compartir PDF
function shareData() {
    // Título del plan semanal con fecha actual
    const today = new Date();
    const dateString = today.toLocaleDateString('es-ES');
    const title = `Plan Semanal - ${dateString}`;
    
    // Crear un elemento temporal para el título
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = `<h2 style="text-align: center;">${title}</h2>`;
    
    // Elemento que queremos convertir a PDF
    const element = document.getElementById('table-container');
    
    // Crear un contenedor temporal
    const container = document.createElement('div');
    container.appendChild(titleDiv.cloneNode(true));
    container.appendChild(element.cloneNode(true));
    
    // Opciones para el PDF
    const opt = {
        margin: 10,
        filename: 'plan_semanal.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // Generar PDF
    html2pdf().from(element).set(opt).save().then(function() {
        // Después de guardar el PDF, preguntar si desea compartirlo por WhatsApp
        setTimeout(() => {
            if (confirm('¿Deseas compartir este plan semanal por WhatsApp?')) {
                // Mensaje para WhatsApp
                const message = "Aquí está mi plan semanal:";
                
                // Crear enlace de WhatsApp solo con texto
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                
                // Abrir WhatsApp en una nueva pestaña
                window.open(whatsappUrl, '_blank');
                
                // Mostrar instrucciones
                alert('1. Se abrirá WhatsApp Web\n2. Envía el mensaje\n3. Luego usa el clip (📎) para adjuntar el PDF que acabas de descargar');
            }
        }, 1000);
    });
}

// Event listeners
document.getElementById('clear-button').addEventListener('click', clearData);
document.getElementById('save-button').addEventListener('click', saveData);
document.getElementById('share-button').addEventListener('click', shareData);

// Cargar los datos al cargar la página
window.onload = loadData;