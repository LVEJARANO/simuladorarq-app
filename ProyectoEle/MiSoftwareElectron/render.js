document.addEventListener('DOMContentLoaded', () => {
    // Funcionalidad CALIDAD---------------------------------------------------
    const inputs = document.querySelectorAll('.evaluacion');
    const resultado = document.getElementById('resultado');
    const multiplicacion3 = document.getElementById('multiplicacion-3');
    const multiplicacion2 = document.getElementById('multiplicacion-2');
    const multiplicacion1 = document.getElementById('multiplicacion-1');
    const resultadoResta = document.getElementById('resultado-resta');
    const resultadoDivision = document.getElementById('resultado-division');
    const rango1 = document.getElementById('resultado-rango1');
    const rango2 = document.getElementById('resultado-rango2');
    const rango3 = document.getElementById('resultado-rango3');
    const rango4 = document.getElementById('resultado-rango4');
    const rango5 = document.getElementById('resultado-rango5');
    const rango6 = document.getElementById('resultado-rango6');
    const indicador = document.getElementById('c-indicador');

    inputs.forEach(input => {
        input.addEventListener('input', calcularSuma);
    });

    function calcularSuma() {
        let suma = 0;

        inputs.forEach(input => {
            suma += Number(input.value);
        });

        resultado.textContent = suma;  // Muestra solo la suma total

        // Contar los tipos de mobiliario ingresados
        let total = 0;

        inputs.forEach(i => {
            if (Number(i.value) > 0) {
                total++;
            }
        });

        totalMobiliario2.textContent = total;  // Actualiza el total de tipos de mobiliario

        // Actualiza las multiplicaciones
        const mult3 = total * 3;
        multiplicacion3.textContent = mult3;
        multiplicacion2.textContent = total * 2;
        multiplicacion1.textContent = total * 1;

        // Calcula la resta y suma 1
        const resta = Math.max(0, mult3 - total + 1);
        resultadoResta.textContent = resta;

        // Calcula la división
        const division = resta > 0 ? Math.round(resta / 3) : 0;
        resultadoDivision.textContent = division; // Muestra el resultado entero

        // Rango1
        const condicion1 = (total === 1) ? 0 : total;
        rango1.textContent = condicion1;

        // Rango2 
        let condicion2;
        switch (resta) {
            case 3: condicion2 = 1; break;
            case 5: condicion2 = 3; break;
            case 7: condicion2 = 5; break;
            case 9: condicion2 = 6; break;
            case 11: condicion2 = 8; break;
            case 13: condicion2 = 10; break;
            case 15: condicion2 = 11; break;
            case 17: condicion2 = 13; break;
            case 19: condicion2 = 15; break;
            case 21: condicion2 = 16; break;
            case 23: condicion2 = 18; break;
            case 25: condicion2 = 20; break;
            default: condicion2 = 0; // Valor predeterminado
        }
        rango2.textContent = condicion2;

        // Rango3
        const condicion3 = (resta === 1 || condicion2 === 1) ? 0 : condicion2 + 1;
        rango3.textContent = condicion3;

        // Rango4
        let condicion4;
        switch (resta) {
            case 3: condicion4 = 2; break;
            case 5: condicion4 = 5; break;
            case 7: condicion4 = 7; break;
            case 9: condicion4 = 9; break;
            case 11: condicion4 = 12; break;
            case 13: condicion4 = 14; break;
            case 15: condicion4 = 16; break;
            case 17: condicion4 = 19; break;
            case 19: condicion4 = 21; break;
            case 21: condicion4 = 23; break;
            case 23: condicion4 = 25; break;
            case 25: condicion4 = 28; break;
            default: condicion4 = 0; // Valor predeterminado
        }
        rango4.textContent = condicion4;

        // Rango5
        const condicion5 = (resta === 1 || resta === 3) ? 0 : condicion4 + 1;
        rango5.textContent = condicion5;

        // Rango6
        const condicion6 = mult3;
        rango6.textContent = condicion6;

        let cindicador;
        if (suma === 0) {
            cindicador = '-';
            indicador.classList.remove('optimo', 'regular', 'critico');
        } else if (suma <= condicion2) {
            cindicador = 'CRÍTICO';
            indicador.classList.remove('optimo', 'regular');
            indicador.classList.add('critico');
        } else if (suma <= condicion4) {
            cindicador = 'REGULAR';
            indicador.classList.remove('optimo', 'critico');
            indicador.classList.add('regular');
        } else if (suma <= condicion6) {
            cindicador = 'ÓPTIMO';
            indicador.classList.remove('regular', 'critico');
            indicador.classList.add('optimo');
        } else {
            cindicador = '-';
            indicador.classList.remove('optimo', 'regular', 'critico');
        }
        
        indicador.textContent = cindicador;

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

    let areaSeleccionada = 0;

    // Función para evaluar la condición de un mobiliario
    function evaluateCondition() {
        let totalSeleccionados = [...mobiliarios].filter(m => m.checked).length;
        if (checkboxOtro.checked && inputOtroMobiliario.value.trim() !== "") {
            totalSeleccionados += 1; // Contar el mobiliario "Otro"
        }

        totalMobiliarios.textContent = totalSeleccionados;
        calcularValoracionCuantitativa(totalSeleccionados);
        calcularSuma(); // Actualiza la suma total de evaluaciones
    }

    // Función para calcular la valoración cuantitativa y la calificación del indicador
    function calcularValoracionCuantitativa(totalSeleccionados) {
        let valoracion = 'FALSO';
        valoracionCuantitativa.classList.remove('optimo', 'regular', 'critico');
        valoracionCuantitativa.classList.add('false-value');

        let calificacion = 0;

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
    checkboxOtro.addEventListener('change', function () {
        inputOtroMobiliario.disabled = !this.checked;
        if (!this.checked) {
            inputOtroMobiliario.value = ''; // Limpiar el campo de texto
        }
        evaluateCondition(); // Re-evaluar cuando se cambia "Otro"
    });

    // Escuchar cambios en el campo de texto "Otro" para evaluar de nuevo
    inputOtroMobiliario.addEventListener('input', () => {
        evaluateCondition(); // Re-evaluar cuando el nombre de "Otro" cambia
    });


});

