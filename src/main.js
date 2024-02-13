//Variables
let opcionActual = 0;

//DOM
const resultsContainer = document.getElementById('results-container');
const allEmployees = document.getElementById('all');
const activeEmployees = document.getElementById('active');
const inactiveEmployees = document.getElementById('inactive');
const search = document.getElementById('search');
const inputSearch = document.getElementById('input-search');
const modalAdd = document.getElementById('addModal');
const addButton = document.getElementById('add-button');
const cancelAddModalBtn = document.getElementById('cancel-add-modal-button');
const addModalBtn = document.getElementById('add-modal-button');
const inputName = document.getElementById('input-name');
const inputCode = document.getElementById('input-code');
const inputSalary = document.getElementById('input-salary');
const addForm = document.getElementById('add-form');

//EventListeners
allEmployees.addEventListener('click', (event) => {
    pedirDatos("");

    
    allEmployees.classList.add('active');
    if(opcionActual == 1)
        activeEmployees.classList.remove('active');
    if(opcionActual == 2)
        inactiveEmployees.classList.remove('active');
    opcionActual = 0;
});

activeEmployees.addEventListener('click', (event) => {
    pedirDatos("-activos");

    activeEmployees.classList.add('active');
    if(opcionActual == 0)
        allEmployees.classList.remove('active');
    if(opcionActual == 2)
        inactiveEmployees.classList.remove('active');
    opcionActual = 1;
});

inactiveEmployees.addEventListener('click', (event) => {
    pedirDatos("-inactivos");

    inactiveEmployees.classList.add('active');

    if(opcionActual == 0)
        allEmployees.classList.remove('active');
    if(opcionActual == 1)
        activeEmployees.classList.remove('active');
    opcionActual = 2;
});

search.addEventListener('click', (event) => {
    if(inputSearch.value == "") {
        pedirDatos("");
    } else {
        buscarPorNombre(inputSearch.value);
    }
});

inputSearch.addEventListener('keyup', (event) => {
    if(event.key == "Enter") {
        if(inputSearch.value == "") {
            pedirDatos("");
        } else {
            buscarPorNombre(inputSearch.value);
        }
    }
});

addButton.addEventListener('click', (event) => {
    modalAdd.style.display = "block";
}); 

cancelAddModalBtn.addEventListener('click', (event) => {
    modalAdd.style.display = "none";
});

addModalBtn.addEventListener('click', (event) => {
    modalAdd.style.display = "none";
    anadirEmpleado();
    consultarCambios();
});

addForm.addEventListener('input', (event) => {
    if(inputName.value != "" && inputCode.value != "" && inputSalary.value != "") {
        addModalBtn.disabled = false;
    } else {
        addModalBtn.disabled = true;
    }
});

//Funciones
const pedirDatos = (estado) => {
    reiniciarDatos();
    fetch(`/all-empleados${estado}`, {method: 'GET', headers: {'Content-Type': 'application/json'}}).then(response => response.json())
    .then(data => {
        if(data.length != 0) {
            let fragment = document.createDocumentFragment();
            let cont = 0;
            data.forEach(element => {
                let result = construirResult(element, cont);
                cont++;
                fragment.appendChild(result);
            });

            resultsContainer.appendChild(fragment);
        }
    })
    .catch(error => console.error('Hubo un error al hacer la solicitud:', error));
}

const buscarPorNombre = (cadena) => {
    reiniciarDatos();
    fetch(`/empleados/${cadena}`, {method: 'GET', headers: {'Content-Type': 'application/json'}}).then(response => response.json())
    .then(data => {
        if(data.length != 0) {
            let fragment = document.createDocumentFragment();
            let cont = 0;
            data.forEach(element => {
                let result = construirResult(element, cont);
                cont++;
                fragment.appendChild(result);
            });

            resultsContainer.appendChild(fragment);
        }
    })
    .catch(error => console.error('Hubo un error al hacer la solicitud:', error));
}

const eliminarEmpleado = (id) => {
    fetch(`/empleado/${id}`, {method: 'DELETE', headers: {'Content-Type': 'application/json'}}).then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

const activarDesactivarEmpleado = (id, estado) => {
    let body = JSON.stringify({
        estado: estado
    });
    fetch(`/empleado-estado/${id}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: body}).then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

const anadirEmpleado = () => {
    let body = JSON.stringify({
        nombre: inputName.value,
        codigo: inputCode.value,
        estado: true,
        salario: inputSalary.value
    });
    fetch('/empleado', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: body}).then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

const construirResult = (empleado, cont) => {
    let botonDesactivar = generarBotonDesactivar(empleado.id, empleado.estado);
    
    let deleteIcon = generarBotonDelete(empleado.id);

    let actions = document.createElement('div');
    actions.classList.add('actions');
    actions.appendChild(botonDesactivar);
    actions.appendChild(deleteIcon);

    let data = document.createElement('div');
    data.classList.add('data');

    let icon = document.createElement('span');
    icon.classList.add('material-symbols-outlined', 'icon');
    icon.textContent = 'person';
    data.appendChild(icon);

    let nombre = generarAtributo(empleado.nombre, 'name');
    data.appendChild(nombre);

    let codigo = generarAtributo(empleado.codigo, 'code');
    data.appendChild(codigo);

    let salario = generarAtributo(empleado.salario, 'salary');
    data.appendChild(salario);

    let estado = generarAtributo(empleado.estado, 'status');
    data.appendChild(estado);
    
    let result = document.createElement('div');
    result.appendChild(data);
    result.appendChild(actions);

    let color;
    if(cont % 2 == 0)
        color = 'white';
    else
        color = 'blue'
    result.classList.add('result', color);

    return result;
}

const generarAtributo = (dato, clase) => {
    let attribute = document.createElement('span');
    attribute.classList.add('attribute', clase);
    if(clase == 'status') {
        if(dato)
            dato = 'Activo';
        else {
            dato = 'Inactivo'
        }
    }
    attribute.textContent = dato;
    return attribute;
}

const generarBotonDesactivar = (id, estado) => {
    let botonDesactivar = document.createElement('button');
    botonDesactivar.classList.add('disable-button');
    botonDesactivar.textContent = 'Desactivar';
    if(!estado)
        botonDesactivar.textContent = 'Activar'

    botonDesactivar.addEventListener('click', (event) => {
        let status = true;
        if(estado) {
            status = false;
        }
        if(confirm("¿Seguro que desees cambiar el estado del empleado?") == true) {
            activarDesactivarEmpleado(id, status);
            consultarCambios();
        }
    });

    return botonDesactivar;
}

const generarBotonDelete = (id) => {
    let deleteIcon = document.createElement('span');
    deleteIcon.classList.add('material-symbols-outlined', 'icon');
    deleteIcon.textContent = 'delete';

    deleteIcon.addEventListener('click', (event) => {
        if(confirm("¿Seguro que desees eliminar al empleado?") == true) {
            eliminarEmpleado(id)
            consultarCambios();
        }
    });

    return deleteIcon;
}

const reiniciarDatos = () => {
    const resultsHeader  = resultsContainer.firstElementChild.cloneNode(true);
    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(resultsHeader);
}

const consultarCambios = () => {
    switch (opcionActual) {
        case 0:
            pedirDatos("");
            break;

        case 1:
            pedirDatos("-activos");
            break;

        case 2:
            pedirDatos("-inactivos");
            break;
        
        default:
            break;
    }
}

//Ejecucion
pedirDatos("");
