document.addEventListener('DOMContentLoaded', () => {
  const mobiliarios = document.querySelectorAll('.mobiliario');
  const areaRadios = document.getElementsByName('area-epe');
  const tipoEPE = document.getElementById('tipo-epe');
  const valoracionCuantitativa = document.getElementById('valoracion-cuantitativa');
  const totalMobiliarios = document.getElementById('total-mobiliarios');
  const calificacionIndicador = document.getElementById('calificacion-indicador');

  // Agregar variables para el checkbox y el input "Otro"
  const checkboxOtro = document.getElementById('checkbox-otro');
  const inputOtroMobiliario = document.getElementById('otro-mobiliario');

  let areaSeleccionada = 0;

  // Función para evaluar la condición de un mobiliario
  function evaluateCondition() {
      let totalSeleccionados = [...mobiliarios].filter(m => m.checked).length;
      if (checkboxOtro.checked && inputOtroMobiliario.value.trim() !== "") {
          totalSeleccionados += 1; // Contar el mobiliario "Otro" si está seleccionado y tiene nombre
      }

      totalMobiliarios.textContent = totalSeleccionados;

      if (areaSeleccionada === 1000) {
          valoracionCuantitativa.className = '';
          if (totalSeleccionados === 1) {
              valoracionCuantitativa.textContent = "CRÍTICO";
              valoracionCuantitativa.classList.add('critico');
              calificacionIndicador.textContent = 1;
          } else if (totalSeleccionados === 2) {
              valoracionCuantitativa.textContent = "REGULAR";
              valoracionCuantitativa.classList.add('regular');
              calificacionIndicador.textContent = 2;
          } else if (totalSeleccionados >= 3){
              valoracionCuantitativa.textContent = "ÓPTIMO";
              valoracionCuantitativa.classList.add('optimo');
              calificacionIndicador.textContent = 3;
          }
      } else if (areaSeleccionada === 4000) {
          valoracionCuantitativa.className = '';
          if (totalSeleccionados <= 2) {
              valoracionCuantitativa.textContent = "CRÍTICO";
              valoracionCuantitativa.classList.add('critico');
              calificacionIndicador.textContent = 1;
          } else if (totalSeleccionados === 3) {
              valoracionCuantitativa.textContent = "REGULAR";
              valoracionCuantitativa.classList.add('regular');
              calificacionIndicador.textContent = 2;
          } else if (totalSeleccionados >= 4){
              valoracionCuantitativa.textContent = "ÓPTIMO";
              valoracionCuantitativa.classList.add('optimo');
              calificacionIndicador.textContent = 3;
          }
      } else if (areaSeleccionada === 10000) {
          valoracionCuantitativa.className = '';
          if (totalSeleccionados <= 3) {
              valoracionCuantitativa.textContent = "CRÍTICO";
              valoracionCuantitativa.classList.add('critico');
              calificacionIndicador.textContent = 1;
          } else if (totalSeleccionados === 4){
              valoracionCuantitativa.textContent = "REGULAR";
              valoracionCuantitativa.classList.add('regular');
              calificacionIndicador.textContent = 2;
          } else if (totalSeleccionados >= 5){
              valoracionCuantitativa.textContent = "ÓPTIMO";
              valoracionCuantitativa.classList.add('optimo');
              calificacionIndicador.textContent = 3;
          }
      } else {
          valoracionCuantitativa.textContent = "FALSO";
          valoracionCuantitativa.className = 'false-value'; // Clase para mostrar que no se ha seleccionado área
          calificacionIndicador.textContent = 0; // Resetear calificación
      }
  }

  // Función para actualizar el área seleccionada
  areaRadios.forEach(area => {
      area.addEventListener('change', () => {
          areaSeleccionada = parseInt(area.value);
          actualizarTipoEPE();
          evaluateCondition(); // Evaluar condición al cambiar el área
      });
  });

  // Función para actualizar el Tipo de EPE basado en la selección
  function actualizarTipoEPE() {
      if (areaSeleccionada === 1000) {
          tipoEPE.textContent = 'Menor a 1000 m²';
      } else if (areaSeleccionada === 4000) {
          tipoEPE.textContent = '1001 - 4000 m²';
      } else if (areaSeleccionada === 10000) {
          tipoEPE.textContent = '4001 - 10,000 m²';
      } else {
          tipoEPE.textContent = '-';
      }
  }

  // Escuchar cambios en los checkboxes de mobiliario
  mobiliarios.forEach(mobiliario => {
      mobiliario.addEventListener('change', () => {
          evaluateCondition();
      });
  });

  // Manejar el checkbox y el campo de texto "Otro"
  checkboxOtro.addEventListener('change', function() {
      if (this.checked) {
          inputOtroMobiliario.disabled = false;
          inputOtroMobiliario.focus();  // Poner el foco en el campo de texto
      } else {
          inputOtroMobiliario.disabled = true;
          inputOtroMobiliario.value = '';  // Limpiar el campo de texto si se desmarca el checkbox
      }
      evaluateCondition();  // Re-evaluar cuando se cambia "Otro"
  });

  // Escuchar cambios en el campo de texto "Otro" para evaluar de nuevo
  inputOtroMobiliario.addEventListener('input', () => {
      evaluateCondition();  // Re-evaluar cuando el nombre de "Otro" cambia
  });
});
