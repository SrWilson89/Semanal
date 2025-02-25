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
    const table = document.getElementById('data-table');

    // Recorre las filas de la tabla y borra el contenido de las celdas
    for (let i = 1; i < table.rows.length; i++) {
        for (let j = 1; j < table.rows[i].cells.length; j++) {
            table.rows[i].cells[j].innerText = '';
        }
    }

    // Elimina los datos almacenados en localStorage
    localStorage.removeItem('tableData');
    alert('Datos borrados');
}

// Añadir evento al botón de borrar
document.getElementById('clear-button').addEventListener('click', clearData);


// Añadir evento al botón de guardar
document.getElementById('save-button').addEventListener('click', saveData);

// Cargar los datos al cargar la página
window.onload = loadData;
save-button
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
    // Mostrar un mensaje de confirmación
    const confirmar = confirm("¿Estás seguro de que quieres borrar todos los datos de la semana? Esta acción no se puede deshacer.");

    // Si el usuario hace clic en "Aceptar", borrar los datos
    if (confirmar) {
        const table = document.getElementById('data-table');

        // Recorre las filas de la tabla y borra el contenido de las celdas
        for (let i = 1; i < table.rows.length; i++) {
            for (let j = 1; j < table.rows[i].cells.length; j++) {
                table.rows[i].cells[j].innerText = '';
            }
        }

        // Elimina los datos almacenados en localStorage
        localStorage.removeItem('tableData');
        alert('Datos borrados');
    }
    // Si el usuario hace clic en "Cancelar", no hacer nada
}

// Añadir evento al botón de borrar
document.getElementById('clear-button').addEventListener('click', clearData);

// Añadir evento al botón de guardar
document.getElementById('save-button').addEventListener('click', saveData);

// Cargar los datos al cargar la página
window.onload = loadData;