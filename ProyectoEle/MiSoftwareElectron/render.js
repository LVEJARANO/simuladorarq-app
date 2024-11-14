document.addEventListener('DOMContentLoaded', () => {

    // Función para cerrar la aplicación
    function cerrarAplicacion() {
        ipcRenderer.send('cerrar-aplicacion'); // Envía el evento de cierre al proceso principal
    }
    // Cargar el contenido de sidebar.html en el elemento con id="sidebar"
    function cargarSidebar() {
        fetch('sidebar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar sidebar.html');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('sidebar').innerHTML = data;
                marcarMenuActivo();

                // Agregar evento de clic para el botón de "Salir"
                const salirButton = document.querySelector('.salir-button');
                if (salirButton) {
                    salirButton.addEventListener('click', cerrarAplicacion);
                }
            })

            .catch(error => {
                console.error('Error al cargar la barra lateral:', error);
                document.getElementById('sidebar').innerHTML = '<p>Error al cargar la barra lateral.</p>';
            });
    }

    // Función para resaltar el enlace activo en el menú
    function marcarMenuActivo() {
        const enlaces = document.querySelectorAll('.menu-button');
        const rutaActual = window.location.pathname.split('/').pop();

        enlaces.forEach(enlace => {
            const href = enlace.getAttribute('href');
            if (href === rutaActual) {
                enlace.classList.add('active');
            }
        });
    }

    // Ejecutar la función para cargar el sidebar
    cargarSidebar();

    const mobiliarios = document.querySelectorAll('.mobiliario');
    const areaRadios = document.getElementsByName('area-epe');
    const tipoEPE = document.getElementById('tipo-epe');
    const valoracionCuantitativa = document.getElementById('valoracion-cuantitativa');
    const totalMobiliarios = document.getElementById('total-mobiliarios');
    const calificacionIndicador = document.getElementById('calificacion-indicador');
    const checkboxOtro = document.getElementById('checkbox-otro');
    const inputOtroMobiliario = document.getElementById('otro-mobiliario');
    const totalMobiliario2 = document.getElementById('total-mobiliario2');

    // Checkbox y entradas de "Otros"
    const checkboxesOtro = [
        document.getElementById('checkbox-otro'),
        document.getElementById('checkbox-otro-1'),
        document.getElementById('checkbox-otro-2'),
        document.getElementById('checkbox-otro-3')
    ];

    const inputsOtro = [
        document.getElementById('otro-mobiliario'),
        document.getElementById('otro-mobiliario-1'),
        document.getElementById('otro-mobiliario-2'),
        document.getElementById('otro-mobiliario-3')
    ];

    // Función para evaluar la condición de un mobiliario
    //Contar el mobiliario Otro

    function evaluateCondition() {
        let totalSeleccionados = [...mobiliarios].filter(m => m.checked).length;
        // Contar el mobiliario "Otro"
        checkboxesOtro.forEach((checkbox, index) => {
            if (checkbox.checked && inputsOtro[index].value.trim() !== "") {
                totalSeleccionados += 1; // Contar el mobiliario "Otro"
            }
        });

        totalMobiliarios.textContent = totalSeleccionados;
        calcularValoracionCuantitativa(totalSeleccionados);
        calcularSuma(); // Actualiza la suma total de evaluaciones
    }

    let areaSeleccionada = 0;

    // Función para calcular la valoración cuantitativa y la calificación del indicador
    function calcularValoracionCuantitativa(totalSeleccionados) {
        let valoracion = 'FALSO';
        valoracionCuantitativa.classList.remove('optimo', 'regular', 'critico');
        valoracionCuantitativa.classList.add('false-value');

        let calificacion = 0;
        if (totalSeleccionados > 0) {
            if (areaSeleccionada === 1000) {
                if (totalSeleccionados === 1) {
                    valoracion = 'CRÍTICO';
                    calificacion = 1;
                } else if (totalSeleccionados === 2) {
                    valoracion = 'REGULAR';
                    calificacion = 2;
                } else if (totalSeleccionados >= 3) {
                    valoracion = 'ÓPTIMO';
                    calificacion = 3;
                }
            } else if (areaSeleccionada === 4000) {
                if (totalSeleccionados <= 2) {
                    valoracion = 'CRÍTICO';
                    calificacion = 1;
                } else if (totalSeleccionados === 3) {
                    valoracion = 'REGULAR';
                    calificacion = 2;
                } else if (totalSeleccionados >= 4) {
                    valoracion = 'ÓPTIMO';
                    calificacion = 3;
                }
            } else if (areaSeleccionada === 10000) {
                if (totalSeleccionados <= 3) {
                    valoracion = 'CRÍTICO';
                    calificacion = 1;
                } else if (totalSeleccionados === 4) {
                    valoracion = 'REGULAR';
                    calificacion = 2;
                } else if (totalSeleccionados >= 5) {
                    valoracion = 'ÓPTIMO';
                    calificacion = 3;
                }
            }
        }

        // Aplicar clases de estilo según el valor de la valoración
        if (valoracion === 'ÓPTIMO') {
            valoracionCuantitativa.classList.add('optimo');
        } else if (valoracion === 'REGULAR') {
            valoracionCuantitativa.classList.add('regular');
        } else if (valoracion === 'CRÍTICO') {
            valoracionCuantitativa.classList.add('critico');
        } else {
            valoracionCuantitativa.classList.add('false-value'); // Para FALSO
        }

        // Asigna clases de estilo según la valoración obtenida
        valoracionCuantitativa.classList.add(valoracion.toLowerCase());
        valoracionCuantitativa.textContent = valoracion;
        calificacionIndicador.textContent = calificacion;

        // Llama a la función para resaltar la celda correspondiente en la tabla
        resaltarTexto(valoracion, totalSeleccionados);

    }

    // Función para resaltar solo una celda específica con borde
    function resaltarTexto(valoracion, totalSeleccionados) {
        const filasTexto = document.querySelectorAll('.small-table tbody tr');

        // Eliminar cualquier borde previo en las celdas
        filasTexto.forEach(fila => {
            fila.querySelectorAll('td').forEach(celda => {
                celda.style.border = ''; // Reiniciar el borde de cada celda
                celda.style.boxShadow = '';
                
            });
        });

        // Obtener todas las filas de la tabla
        let filas = document.querySelectorAll('tr');

        // Determinar el número total de filas en la tabla
        let totalFilas = filas.length;
        let filaObjetivo, celdaObjetivo;

        // --------Lógica para aplicar el borde basado en el área seleccionada y la valoración-------------------

        // Lógica para el área 1000 m²
        if (areaSeleccionada === 1000) {
            filaObjetivo = filas[totalFilas - 6];
            if (valoracion === 'CRÍTICO') {
                celdaObjetivo = filaObjetivo.querySelectorAll('td')[0]; 
            } else if (valoracion === 'REGULAR') {
                filaObjetivo = filas[totalFilas - 12]; 
                celdaObjetivo = filaObjetivo.querySelectorAll('td')[0];
            } else if (valoracion === 'ÓPTIMO') {
                filaObjetivo = filas[totalFilas - 18];
                celdaObjetivo = filaObjetivo.querySelectorAll('td')[0];
            }
        }
        // Lógica para el área 4000 m²
        else if (areaSeleccionada === 4000) {
            filaObjetivo = filas[totalFilas - 6]; 
            if (valoracion === 'CRÍTICO') {
                celdaObjetivo = filaObjetivo.querySelectorAll('td')[1]; 
            } else if (valoracion === 'REGULAR') {
                filaObjetivo = filas[totalFilas - 12];
                celdaObjetivo = filaObjetivo.querySelectorAll('td')[1]; 
            } else if (valoracion === 'ÓPTIMO') {
                filaObjetivo = filas[totalFilas - 18];
                celdaObjetivo = filaObjetivo.querySelectorAll('td')[1]; 
            }
        }
        // Lógica para el área 10000 m²
        else if (areaSeleccionada === 10000) {
            filaObjetivo = filas[totalFilas - 6]; 
            if (valoracion === 'CRÍTICO') {
                celdaObjetivo = filaObjetivo.querySelectorAll('td')[2]; 
            } else if (valoracion === 'REGULAR') {
                filaObjetivo = filas[totalFilas - 12];
                celdaObjetivo = filaObjetivo.querySelectorAll('td')[2]; 
            } else if (valoracion === 'ÓPTIMO') {
                filaObjetivo = filas[totalFilas - 18];
                celdaObjetivo = filaObjetivo.querySelectorAll('td')[2]; 
            }
        }

        // Borde e iluminación si la celda objetivo es válida
        if (celdaObjetivo) {
            const color = getColorForValoracion(valoracion); // Función para obtener el color de borde según la valoración
            celdaObjetivo.style.border = `2px solid ${color}`;
            celdaObjetivo.style.boxShadow = `0 0 15px ${color}`;
        }
    }    

    // Función auxiliar para obtener el color correspondiente según la valoración
    function getColorForValoracion(valoracion) {
        switch (valoracion) {
            case 'ÓPTIMO':
                return 'green';
            case 'REGULAR':
                return 'yellow';
            case 'CRÍTICO':
                return 'red';
            default:
                return 'black';
        }
    }

    // Actualizar el área seleccionada y el tipo de EPE
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
            tipoEPE.textContent = '-'; // Si no hay selección
        }
    }

    // Escuchar cambios en los checkboxes de mobiliario
    mobiliarios.forEach(mobiliario => {
        mobiliario.addEventListener('change', () => {
            evaluateCondition();
        });
    });

    // Manejar el checkbox y el campo de texto "Otro"
    checkboxesOtro.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function () {
            inputsOtro[index].disabled = !this.checked;
            if (!this.checked) {
                inputsOtro[index].value = ''; // Limpiar el campo de texto
            }
            evaluateCondition(); // Re-evaluar cuando se cambia "Otro"
        });

        // Escuchar cambios en el campo de texto "Otro" para evaluar de nuevo
        inputsOtro[index].addEventListener('input', () => {
            evaluateCondition(); // Re-evaluar cuando el nombre de "Otro" cambia
        });
    });

    // Escuchar cambios en el campo de texto "Otro" para evaluar de nuevo
    inputOtroMobiliario.addEventListener('input', () => {
        evaluateCondition(); // Re-evaluar cuando el nombre de "Otro" cambia
    });




});