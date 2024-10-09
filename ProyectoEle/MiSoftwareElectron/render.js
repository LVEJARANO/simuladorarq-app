document.addEventListener('DOMContentLoaded', () => {
    const mobiliarios = document.querySelectorAll('.mobiliario');
    const areaRadios = document.getElementsByName('area-epe');
    const tipoEPE = document.getElementById('tipo-epe');
    const valoracionCuantitativa = document.getElementById('valoracion-cuantitativa');
    const totalMobiliarios = document.getElementById('total-mobiliarios');
    const calificacionIndicador = document.getElementById('calificacion-indicador');
  
    let totalSeleccionados = 0;
    let areaSeleccionada = 0;
  
    // Función para actualizar el total de mobiliarios seleccionados
    mobiliarios.forEach(mobiliario => {
      mobiliario.addEventListener('change', () => {
        totalSeleccionados = [...mobiliarios].filter(m => m.checked).length;
        totalMobiliarios.textContent = totalSeleccionados;
        calcularValoracionCuantitativa();
      });
    });
  
    // Función para actualizar el área seleccionada
    areaRadios.forEach(area => {
      area.addEventListener('change', () => {
        areaSeleccionada = parseInt(area.value);
        actualizarTipoEPE();
        calcularValoracionCuantitativa();
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
        tipoEPE.textContent = '-'; // Si no hay selección
      }
    }
  
    // Función para calcular la valoración cuantitativa y la calificación del indicador
    function calcularValoracionCuantitativa() {
      let valoracion = 'FALSO';
      valoracionCuantitativa.classList.remove('optimo', 'regular', 'critico');
      valoracionCuantitativa.classList.add('false-value');
  
      let calificacion = 0;
  
      if (areaSeleccionada === 1000) { // Área menor a 1000
        if (totalSeleccionados >= 3) {
          valoracion = 'ÓPTIMO';
          calificacion = 3;
        } else if (totalSeleccionados === 2) {
          valoracion = 'REGULAR';
          calificacion = 2;
        } else {
          valoracion = 'CRÍTICO';
          calificacion = 1;
        }
      } else if (areaSeleccionada === 4000) { // Área entre 1001 y 4000
        if (totalSeleccionados >= 2) {
          valoracion = 'ÓPTIMO';
          calificacion = 3;
        } else if (totalSeleccionados === 1) {
          valoracion = 'REGULAR';
          calificacion = 2;
        } else {
          valoracion = 'CRÍTICO';
          calificacion = 1;
        }
      } else if (areaSeleccionada === 10000) { // Área entre 4001 y 10,000
        if (totalSeleccionados >= 1) {
          valoracion = 'ÓPTIMO';
          calificacion = 3;
        } else {
          valoracion = 'CRÍTICO';
          calificacion = 1;
        }
      }
  
      // Aplicar clases de estilo según el valor de la valoración
      if (valoracion === 'ÓPTIMO') {
        valoracionCuantitativa.classList.add('optimo');
      } else if (valoracion === 'REGULAR') {
        valoracionCuantitativa.classList.add('regular');
      } else if (valoracion === 'CRÍTICO') {
        valoracionCuantitativa.classList.add('critico');
      }
  
      valoracionCuantitativa.textContent = valoracion;
      calificacionIndicador.textContent = calificacion;
    }
  });
  