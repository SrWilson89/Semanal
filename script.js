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

// Añadir evento al botón de guardar
document.getElementById('save-button').addEventListener('click', saveData);

// Cargar los datos al cargar la página
window.onload = loadData;
