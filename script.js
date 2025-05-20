class Planificador {
    constructor() {
        this.table = document.getElementById('data-table');
        this.initEventListeners();
        this.setupAutoSave();
        this.loadData();
        this.setupBeforeUnload();
        this.updateButtonText();
    }

    initEventListeners() {
        document.getElementById('save-button').addEventListener('click', () => this.saveData());
        document.getElementById('clear-button').addEventListener('click', () => this.clearData());
        document.getElementById('share-button').addEventListener('click', () => this.exportarImagen());
        
        this.table.addEventListener('input', (e) => {
            if (e.target.tagName === 'TD' && e.target.contentEditable === 'true') {
                e.target.classList.add('modified');
            }
        });
    }

    updateButtonText() {
        // Actualizar el texto del botón
        const shareButton = document.getElementById('share-button');
        shareButton.innerHTML = '🖼️ Guardar Imagen';
        shareButton.setAttribute('aria-label', 'Guardar como Imagen');
    }

    setupAutoSave() {
        setInterval(() => {
            const modifiedCells = document.querySelectorAll('.modified');
            if (modifiedCells.length > 0) {
                this.saveData(false);
                this.showAlert('Cambios guardados automáticamente', 'success');
            }
        }, 120000); // 2 minutos
    }

    setupBeforeUnload() {
        window.addEventListener('beforeunload', (e) => {
            if (document.querySelector('.modified')) {
                e.preventDefault();
                e.returnValue = 'Tienes cambios sin guardar. ¿Seguro que quieres salir?';
            }
        });
    }

    showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;
        document.querySelector('.alerts-container').appendChild(alert);
        
        setTimeout(() => {
            alert.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => alert.remove(), 500);
        }, 3000);
    }

    validateData() {
        const emptyCells = [...this.table.querySelectorAll('td[contenteditable="true"]')]
            .filter(td => td.textContent.trim() === '');
        
        if (emptyCells.length > 0) {
            this.showAlert(`Tienes ${emptyCells.length} celdas vacías`, 'warning');
            return false;
        }
        return true;
    }

    saveData(showAlert = true) {
        try {
            const data = [];
            for (let i = 1; i < this.table.rows.length; i++) {
                const row = [];
                for (let j = 1; j < this.table.rows[i].cells.length; j++) {
                    row.push(this.table.rows[i].cells[j].textContent);
                }
                data.push(row);
            }

            const versionedData = {
                timestamp: new Date().toISOString(),
                data: data
            };

            const history = JSON.parse(localStorage.getItem('planHistory') || '[]');
            history.push(versionedData);
            if (history.length > 5) history.shift();

            localStorage.setItem('planHistory', JSON.stringify(history));
            localStorage.setItem('tableData', JSON.stringify(data));
            
            this.table.querySelectorAll('.modified').forEach(td => td.classList.remove('modified'));
            
            if (showAlert) {
                this.showAlert('Datos guardados correctamente ✅', 'success');
            }

        } catch (error) {
            this.showAlert('Error al guardar los datos ❌', 'error');
            console.error('Error:', error);
        }
    }

    loadData() {
        try {
            const savedData = JSON.parse(localStorage.getItem('tableData'));
            if (!savedData) return;

            for (let i = 1; i < this.table.rows.length; i++) {
                for (let j = 1; j < this.table.rows[i].cells.length; j++) {
                    this.table.rows[i].cells[j].textContent = savedData[i - 1][j - 1] || '';
                }
            }
        } catch (error) {
            this.showAlert('Error al cargar datos ❌', 'error');
        }
    }

    async exportarImagen() {
        try {
            document.querySelector('.loading-spinner').classList.remove('hidden');
            
            // Guardar los datos antes de generar la imagen
            this.saveData(false);
            
            const today = new Date();
            const dateString = today.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Crear un contenedor para la imagen con dimensiones automáticas
            const imageContainer = document.createElement('div');
            imageContainer.style.padding = '20px';
            imageContainer.style.backgroundColor = '#fff';
            imageContainer.style.boxShadow = '0 4px 20px rgba(232, 30, 99, 0.1)';
            imageContainer.style.borderRadius = '12px';
            // Quitamos el ancho fijo para permitir que se ajuste al contenido
            imageContainer.style.display = 'inline-block';
            imageContainer.style.maxWidth = '100%';
            
            // Añadir título
            const title = document.createElement('h1');
            title.textContent = '🥗 Planificador Semanal';
            title.style.textAlign = 'center';
            title.style.color = '#880e4f';
            title.style.marginBottom = '10px';
            title.style.fontFamily = 'Segoe UI, Arial, sans-serif';
            imageContainer.appendChild(title);
            
            // Añadir fecha
            const dateElement = document.createElement('p');
            dateElement.textContent = `Fecha: ${dateString}`;
            dateElement.style.textAlign = 'center';
            dateElement.style.marginBottom = '20px';
            dateElement.style.fontFamily = 'Segoe UI, Arial, sans-serif';
            imageContainer.appendChild(dateElement);
            
            // Crear una nueva tabla para la imagen
            const newTable = document.createElement('table');
            newTable.style.width = '100%';
            newTable.style.borderCollapse = 'collapse';
            newTable.style.margin = '0 auto';
            newTable.style.fontFamily = 'Segoe UI, Arial, sans-serif';
            newTable.style.tableLayout = 'auto'; // Ajustar el ancho de las celdas según el contenido
            
            // Crear encabezado de tabla
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            // Copiar encabezados de la tabla original
            const originalHeaders = this.table.querySelectorAll('thead th');
            originalHeaders.forEach(th => {
                const newTh = document.createElement('th');
                newTh.textContent = th.textContent;
                newTh.style.backgroundColor = '#e91e63';
                newTh.style.color = 'white';
                newTh.style.border = '1px solid #ddd';
                newTh.style.padding = '12px';
                newTh.style.textAlign = 'center';
                headerRow.appendChild(newTh);
            });
            
            thead.appendChild(headerRow);
            newTable.appendChild(thead);
            
            // Crear cuerpo de tabla
            const tbody = document.createElement('tbody');
            
            // Copiar filas de la tabla original
            const originalRows = this.table.querySelectorAll('tbody tr');
            originalRows.forEach(row => {
                const newRow = document.createElement('tr');
                
                // Copiar celdas de cada fila
                const cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    const newCell = document.createElement('td');
                    newCell.textContent = cell.textContent;
                    newCell.style.border = '1px solid #ddd';
                    newCell.style.padding = '10px';
                    newCell.style.textAlign = 'center';
                    newCell.style.wordWrap = 'break-word'; // Permitir el salto de línea dentro de las celdas
                    newCell.style.maxWidth = '200px'; // Limitar el ancho máximo de las celdas
                    
                    // Si es la primera celda (título de la fila)
                    if (cell === cells[0]) {
                        newCell.style.fontWeight = 'bold';
                        newCell.style.backgroundColor = '#fff0f6';
                        newCell.style.whiteSpace = 'nowrap'; // No permitir saltos de línea en los títulos
                    }
                    
                    newRow.appendChild(newCell);
                });
                
                tbody.appendChild(newRow);
            });
            
            newTable.appendChild(tbody);
            imageContainer.appendChild(newTable);
            
            // Añadir notas al final
            const notes = document.createElement('p');
            notes.textContent = 'Planificador generado en ' + new Date().toLocaleString();
            notes.style.textAlign = 'center';
            notes.style.fontSize = '12px';
            notes.style.marginTop = '20px';
            notes.style.color = '#888';
            notes.style.fontFamily = 'Segoe UI, Arial, sans-serif';
            imageContainer.appendChild(notes);
            
            // Añadir el contenedor al body temporalmente pero fuera del flujo normal
            document.body.appendChild(imageContainer);
            imageContainer.style.position = 'absolute';
            imageContainer.style.left = '-9999px';
            imageContainer.style.top = '0';
            
            // Usar html2canvas con opciones mejoradas
            const canvas = await html2canvas(imageContainer, {
                scale: 2, // Aumentar la escala para mejor calidad
                logging: false,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight,
                scrollX: 0,
                scrollY: 0,
                // Asegurarse de capturar todo el contenido
                height: imageContainer.scrollHeight,
                width: imageContainer.scrollWidth,
                // Evitar recorte
                onclone: (clonedDoc, clonedElem) => {
                    clonedElem.style.position = 'static';
                    clonedElem.style.left = '0';
                    clonedElem.style.top = '0';
                }
            });
            
            // Convertir canvas a URL de imagen
            const imageUrl = canvas.toDataURL('image/png');
            
            // Crear un enlace temporal para descargar la imagen
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `Plan_Semanal_${today.toISOString().split('T')[0]}.png`;
            
            // Simular clic en el enlace para descargar
            link.click();
            
            // Limpiar
            document.body.removeChild(imageContainer);
            this.showAlert('Imagen guardada correctamente ✅', 'success');
            
        } catch (error) {
            this.showAlert('Error al generar imagen ❌', 'error');
            console.error('Error al generar imagen:', error);
        } finally {
            document.querySelector('.loading-spinner').classList.add('hidden');
        }
    }

    clearData() {
        if (!confirm('¿Borrar todos los datos?\nEsta acción no se puede deshacer.')) return;
        
        localStorage.removeItem('tableData');
        this.table.querySelectorAll('td[contenteditable="true"]').forEach(td => {
            td.textContent = '';
            td.classList.remove('modified');
        });
        this.showAlert('Datos borrados correctamente 🗑️', 'info');
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => new Planificador());