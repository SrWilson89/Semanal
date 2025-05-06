class Planificador {
    constructor() {
        this.table = document.getElementById('data-table');
        this.initEventListeners();
        this.setupAutoSave();
        this.loadData();
        this.setupBeforeUnload();
    }

    initEventListeners() {
        document.getElementById('save-button').addEventListener('click', () => this.saveData());
        document.getElementById('clear-button').addEventListener('click', () => this.clearData());
        document.getElementById('share-button').addEventListener('click', () => this.shareData());
        
        this.table.addEventListener('input', (e) => {
            if (e.target.tagName === 'TD' && e.target.contentEditable === 'true') {
                e.target.classList.add('modified');
            }
        });
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

            const history = JSON.parse(localStorage.getItem('planHistory') || '[]';
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

    async shareData() {
        try {
            document.querySelector('.loading-spinner').classList.remove('hidden');
            
            const element = document.getElementById('table-container');
            const today = new Date();
            const dateString = today.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const options = {
                filename: `Plan_Semanal_${dateString.replace(/ /g, '_')}.pdf`,
                html2canvas: { 
                    scale: 2,
                    letterRendering: true,
                    useCORS: true
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'landscape' 
                },
                pagebreak: { mode: 'avoid-all' }
            };

            await html2pdf().from(element).set(options).save();
            
            setTimeout(() => {
                if (confirm('¿Quieres compartir el plan por WhatsApp?')) {
                    const message = `📋 Mi plan semanal (${dateString}):`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                }
            }, 500);
            
        } catch (error) {
            this.showAlert('Error al generar PDF ❌', 'error');
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