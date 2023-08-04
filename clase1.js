const limitesAptitud = [
  { minPA: 80, maxPA: 120, minFC: 60, maxFC: 100 }, // reposo
  { minPA: 100, maxPA: 140, minFC: 70, maxFC: 120 }, // calentamiento
  { minPA: 110, maxPA: 160, minFC: 80, maxFC: 140 }, // etapa1
  { minPA: 120, maxPA: 180, minFC: 90, maxFC: 160 }, // etapa2
  { minPA: 130, maxPA: 200, minFC: 100, maxFC: 180 }, // etapa3
  { minPA: 100, maxPA: 140, minFC: 70, maxFC: 120 }, // recuperacionInmediata
  { minPA: 80, maxPA: 120, minFC: 60, maxFC: 100 }, // recuperacion3Minutos
];

let etapaActual = 0;

function evaluarPaciente() {
  var presionArterial = parseFloat(document.getElementById("presionArterial").value);
  var frecuenciaCardiaca = parseFloat(document.getElementById("frecuenciaCardiaca").value);

  if (isNaN(presionArterial) || isNaN(frecuenciaCardiaca)) {
    alert("Valores inválidos. Ingrese valores numéricos.");
    return;
  }

  const limiteEtapa = limitesAptitud[etapaActual];
  if (
    presionArterial >= limiteEtapa.minPA &&
    presionArterial <= limiteEtapa.maxPA &&
    frecuenciaCardiaca >= limiteEtapa.minFC &&
    frecuenciaCardiaca <= limiteEtapa.maxFC
  ) {
    alert("Aprobado en la etapa " + (etapaActual + 1));
    etapaActual++;
    if (etapaActual >= limitesAptitud.length) {
      alert("¡Felicitaciones! Ha pasado todas las etapas.");
      etapaActual = 0; // Reiniciar etapa para futuros pacientes
    }
  } else {
    alert("No aprobado en la etapa " + (etapaActual + 1));
  }
}