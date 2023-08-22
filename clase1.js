class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.hijos = [];
  }
}

const etapas = [
  "reposo",
  "calentamiento",
  "etapa1",
  "etapa2",
  "etapa3",
  "recuperacionInmediata",
  "recuperacion3Minutos",
];

const limitesAptitud = {
  reposo: { minPA: 80, maxPA: 120, minFC: 60, maxFC: 100 },
  calentamiento: { minPA: 100, maxPA: 140, minFC: 70, maxFC: 120 },
  etapa1: { minPA: 110, maxPA: 160, minFC: 80, maxFC: 140 },
  etapa2: { minPA: 120, maxPA: 180, minFC: 90, maxFC: 160 },
  etapa3: { minPA: 130, maxPA: 200, minFC: 100, maxFC: 180 },
  recuperacionInmediata: { minPA: 100, maxPA: 140, minFC: 70, maxFC: 120 },
  recuperacion3Minutos: { minPA: 80, maxPA: 120, minFC: 60, maxFC: 100 },
};

const pacientesEvaluados = [];

let paciente = {
  nombre: "",
  etapaActual: 0,
  presionArterial: 0,
  frecuenciaCardiaca: 0,
  aptitud: "",
  etapasAprobadas: [],
  fecha: "",
};

function evaluarAptitud() {
  const { etapaActual, presionArterial, frecuenciaCardiaca } = paciente;
  const limiteEtapa = limitesAptitud[etapas[etapaActual]];
  
  const presionArterialRedondeada = Math.round(presionArterial);
  const frecuenciaCardiacaRedondeada = Math.round(frecuenciaCardiaca);

  const esApto =
    presionArterialRedondeada >= limiteEtapa.minPA && presionArterialRedondeada <= limiteEtapa.maxPA &&
    frecuenciaCardiacaRedondeada >= limiteEtapa.minFC && frecuenciaCardiacaRedondeada <= limiteEtapa.maxFC;

  return esApto ? "apto" : "no apto";
}


// Función para guardar los pacientes evaluados en el Local Storage
function guardarPacientesEnLocalStorage() {
  localStorage.setItem("pacientesEvaluados", JSON.stringify(pacientesEvaluados));
}

// Función para cargar los pacientes evaluados desde el Local Storage
function cargarPacientesDesdeLocalStorage() {
  const pacientesGuardados = localStorage.getItem("pacientesEvaluados");
  if (pacientesGuardados) {
    pacientesEvaluados.push(...JSON.parse(pacientesGuardados));
  }
}

// Llama a la función de cargar al inicio para cargar los datos existentes
cargarPacientesDesdeLocalStorage();

function evaluarPaciente() {
  var nombre = document.getElementById("nombre").value;
  if (nombre.trim() === "") {
    Swal.fire("Error", "Nombre inválido. Por favor, ingrese un nombre válido.", "error");
    return;
  }
  paciente.nombre = nombre;

  var presionArterial = parseFloat(document.getElementById("presionArterial").value);
  var frecuenciaCardiaca = parseFloat(document.getElementById("frecuenciaCardiaca").value);

  if (isNaN(presionArterial) || isNaN(frecuenciaCardiaca)) {
    Swal.fire("Error", "Valores inválidos. Ingrese valores numéricos.", "error");
    return;
  }

  paciente.presionArterial = presionArterial;
  paciente.frecuenciaCardiaca = frecuenciaCardiaca;
  paciente.aptitud = evaluarAptitud();
  paciente.fecha = obtenerFechaActual();

  alert("Aptitud del paciente en la etapa " + etapas[paciente.etapaActual] + ": " + paciente.aptitud);

  if (paciente.aptitud === "apto") {
    paciente.etapasAprobadas.push(etapas[paciente.etapaActual]);
  }

  paciente.etapaActual++;

  if (paciente.etapaActual >= etapas.length) {
    alert("¡Felicitaciones! Ha pasado todas las etapas.");
    paciente.etapaActual = 0; // Reiniciar etapa para futuros pacientes
    pacientesEvaluados.push({ nombre: paciente.nombre, etapasAprobadas: paciente.etapasAprobadas.slice() });
    paciente.etapasAprobadas = []; // Reiniciar etapas aprobadas para futuros pacientes
  }
  
  actualizarListaPacientes();
  guardarPacientesEnLocalStorage()
  cargarPacientesDesdeLocalStorage();
}

function obtenerFechaActual() {
  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1;
  const anio = fechaActual.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

function actualizarListaPacientes() {
  const listaPacientesElement = document.getElementById("listaPacientes");
  listaPacientesElement.innerHTML = "";

  pacientesEvaluados.forEach((paciente) => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    listItem.textContent = `${paciente.nombre} - Etapas Aprobadas: ${paciente.etapasAprobadas.join(", ")} - Fecha de estudio: ${paciente.fecha}`;
    listaPacientesElement.appendChild(listItem);
  });
}

function verPromedio() {
  if (pacientesEvaluados.length === 0) {
    alert("No hay pacientes evaluados para calcular el promedio.");
    return;
  }

  let totalEtapasAprobadas = 0;
  pacientesEvaluados.forEach((paciente) => {
    totalEtapasAprobadas += paciente.etapasAprobadas.length;
  });

  const promedio = totalEtapasAprobadas / pacientesEvaluados.length;
  alert(`Promedio de etapas aprobadas por paciente: ${promedio.toFixed(2)}`);
}

function resetearDatos() {
  paciente = {
    ...paciente, // Copia todas las propiedades del pacienteInicial
  };
  
  document.getElementById("nombre").value = "";
  document.getElementById("presionArterial").value = "";
  document.getElementById("frecuenciaCardiaca").value = "";

  actualizarListaPacientes();
  cargarPacientesDesdeLocalStorage();
}

function filtrarPorEtapa() {
  const etapaFiltrada = document.getElementById("etapaFiltrada").value;
  if (etapaFiltrada === "todas") {
    actualizarListaPacientes();
    return;
  }

  const listaPacientesElement = document.getElementById("listaPacientes");
  listaPacientesElement.innerHTML = "";

  pacientesEvaluados.forEach((paciente) => {
    if (paciente.etapasAprobadas.includes(etapaFiltrada)) {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.textContent = `${paciente.nombre} - Etapas Aprobadas: ${paciente.etapasAprobadas.join(", ")} - Fecha de estudio: ${paciente.fecha}`;
      listaPacientesElement.appendChild(listItem);
    }
  });
}

 

const inputTexto = document.getElementById("nombre");
inputTexto.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) {
    evaluarPaciente();
  }
});
