const dependenciasCombinadas = {
    "fisica": { "aprobadas": [], "exoneradas": [] },
    "economia": { "aprobadas": [], "exoneradas": [] },
    "calculoDiv": { "aprobadas": [], "exoneradas": [] },
    "gal1": { "aprobadas": [], "exoneradas": [] },
    "matDiscreta1": { "aprobadas": [], "exoneradas": [] },
    "prog1": { "aprobadas": [], "exoneradas": [] },
    "calculoDivv": { "aprobadas": ["calculoDiv"], "exoneradas": [] },
    "gal2": { "aprobadas": ["gal1"], "exoneradas": [] },
    "matDiscreta2": { "aprobadas": ["matDiscreta1", "gal1"], "exoneradas": [] },
    "pye": { "aprobadas": ["calculoDivv"], "exoneradas": ["calculoDiv", "gal1"] },
    "prog2": { "aprobadas": ["prog1"], "exoneradas": [] },
    "arquitectura": { "aprobadas": ["prog2", "logica", "matDiscreta1"], "exoneradas": ["calculoDiv", "prog1"] },
    "prog3": { "aprobadas": ["prog2"], "exoneradas": ["prog1", "matDiscreta1"] },
    "sisop": { "aprobadas": ["arquitectura"], "exoneradas": ["gal1", "matDiscreta1", "prog2", "calculoDiv"] },
    "teoleng": { "aprobadas": ["prog3"], "exoneradas": ["logica", "matDiscreta1", "gal1", "calculoDiv"] },
    "redes": { "aprobadas": ["arquitectura", "sisop"], "exoneradas": ["prog3", "calculoDiv"] },
    "bd": { "aprobadas": [], "exoneradas": ["prog3", "matDiscreta2", "logica"] },
    "metNum": { "aprobadas": [], "exoneradas": ["calculoDivv", "calculoDiv", "gal1", "gal2", "prog1"] },
    "iio": { "aprobadas": [], "exoneradas": ["calculoDivv", "gal2", "gal1", "calculoDiv", "pye"] },
    "prog4": { "aprobadas": [], "exoneradas": ["prog1", "prog2", "matDiscreta1", "calculoDiv"] },
    "tallerProg": { "aprobadas": ["prog3"], "exoneradas": ["prog4"] },
    "logica": { "aprobadas": ["matDiscreta1"], "exoneradas": [] },
    "progLogica": { "aprobadas": [], "exoneradas": ["prog3", "teoleng", "logica", "matDiscreta2"] },
    "ingSoft": { "aprobadas": ["bd", "prog4", "tallerProg"], "exoneradas": [] },
    "intProgFuncional": { "aprobadas": [], "exoneradas": ["prog2","matDiscreta1","logica","teoleng"] },
    "P.I.S": { "aprobadas": ["ingSoft"], "exoneradas": ["prog4"] },
    "adminGI":{ "aprobadas": [], "exoneradas": [] },
    "practicaAdminGI":{ "aprobadas": ["adminGI"], "exoneradas": [] },
    "polCient":{ "aprobadas": [], "exoneradas": [] },
    "cts":{ "aprobadas": [], "exoneradas": [] },
    "intlnat":{ "aprobadas": [], "exoneradas": [] }
};

// Variable global para el contador manual
let creditosTalleres = 0;

// Función para botones + y -
function cambiarCreditosTaller(delta) {
    const nuevoValor = creditosTalleres + delta;
    if (nuevoValor >= 0 && nuevoValor <= 18) {
        creditosTalleres = nuevoValor;
        actualizarDisplayTaller();
        actualizarCreditos();
        guardarProgreso();
    }
}

function actualizarDisplayTaller() {
    const display = document.getElementById("displayTaller");
    if(display) display.textContent = creditosTalleres;
    
    
    // Cambiar color si llega al máximo
    if(display) display.style.color = creditosTalleres === 18 ? "#16a34a" : "var(--text-primary)";
}

const actualizarCreditos = () => {
    let totalCreditos = 0;

    // Mapeo para acumular créditos por área
    const creditosPorArea = {
        mate: 0, ciencias: 0, prog: 0, arqsisr: 0, bdatos: 0,
        calcnum: 0, invstop: 0, ingsoft: 0, actint: 0,
        gestion: 0, sociales: 0, ia: 0
    };

    // 1. Sumar créditos de botones (Materias estándar)
    document.querySelectorAll('.btn').forEach((btn) => {
        const estado = btn.getAttribute("estado");
        const creditos = parseInt(btn.getAttribute("creditos"));
        const area = btn.getAttribute("area");

        if (estado === "exonerada") {
            totalCreditos += creditos;

            if (area && creditosPorArea.hasOwnProperty(area)) {
                creditosPorArea[area] += creditos;
            }
        }
    });

    // 2. Sumar créditos del contador manual de Talleres
    totalCreditos += creditosTalleres;
    
    // [CAMBIO REALIZADO] Ahora sumamos los créditos del contador al área 'actint' (Talleres y Proy.)
    creditosPorArea['actint'] += creditosTalleres;

    // Actualizar el total de créditos general
    document.getElementById("creditos").innerHTML = `Créditos totales: ${totalCreditos}`;

    // Actualizar cada contador por área en el resumen
    for (const area in creditosPorArea) {
        const elemento = document.getElementById(area);
        if (elemento) {
            elemento.textContent = creditosPorArea[area];
        }
    }
};

// Recorrer dependencias y habilitar/deshabilitar botones
const recorrerDependencias = () => {
    document.querySelectorAll('.btn').forEach(btn => {
        const id = btn.id;
        if (!dependenciasCombinadas[id]) return;
        
        const dependencias = dependenciasCombinadas[id];
        let habilitada = true;

        dependencias.aprobadas.forEach(dep => {
            const depBtn = document.getElementById(dep);
            if (!(depBtn && (depBtn.getAttribute("estado") === "aprobada" || depBtn.getAttribute("estado") === "exonerada"))) {
                habilitada = false;
            }
        });

        dependencias.exoneradas.forEach(dep => {
            const depBtn = document.getElementById(dep);
            if (!(depBtn && depBtn.getAttribute("estado")  === "exonerada")) {
                habilitada = false;
            }
        });

        if (habilitada && btn.disabled) {
            btn.disabled = false;
            btn.setAttribute("estado","sin-cursar");
        } else if (!habilitada && !btn.disabled) {
            btn.disabled = true;
        }
    });
};

// Asignar eventos de click a cada botón de materia
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const currentState = btn.getAttribute("estado");
        
        if (currentState === "sin-cursar" || currentState == null) {
            btn.setAttribute("estado","aprobada"); 
        } else if (currentState === "aprobada") {
            btn.setAttribute("estado","exonerada"); 
        } else {
            btn.setAttribute("estado","sin-cursar"); 
        }

        actualizarCreditos();
        recorrerDependencias();
        guardarProgreso(); // Guardar cambios
    });
});

// --- PERSISTENCIA (LocalStorage) ---

function guardarProgreso() {
    // Guardar estados de materias
    const estadoMaterias = {};
    document.querySelectorAll('.btn').forEach(btn => {
        estadoMaterias[btn.id] = btn.getAttribute("estado");
    });
    
    // Guardar todo en un objeto, incluyendo el contador
    const datos = {
        materias: estadoMaterias,
        talleres: creditosTalleres
    };
    
    localStorage.setItem('mallaCurricularData', JSON.stringify(datos));
}

function cargarProgreso() {
    const guardado = localStorage.getItem('mallaCurricularData');
    if (guardado) {
        try {
            const datos = JSON.parse(guardado);
            
            // 1. Restaurar materias
            if (datos.materias) {
                for (const [id, estado] of Object.entries(datos.materias)) {
                    const btn = document.getElementById(id);
                    if (btn && estado) {
                        btn.setAttribute("estado", estado);
                    }
                }
            }
            
            // 2. Restaurar contador de talleres
            if (typeof datos.talleres === 'number') {
                creditosTalleres = datos.talleres;
                actualizarDisplayTaller();
            }
        } catch (e) {
            console.error("Error cargando datos", e);
        }
    }
}

function cargarDatos(){
    // Datos de prueba para materias
    const exoneradas = [
        "calculoDiv", "gal1", "matDiscreta1", "calculoDivv", "gal2", "matDiscreta2",
        "prog1", "logica", "pye", "prog2", "prog3","prog4", "tallerProg", "economia", "teoleng",
        "adminGI", "progLogica", "arquitectura","practicaAdminGI", "intlnat"
    ];

    exoneradas.forEach(id => {
        const el = document.getElementById(id);
        if(el) actualizarClase(el, "exonerada");
    });

    const aprobadas = [
        "metNum", "iio", "cts", "bd"
    ];

    aprobadas.forEach(id => {
        const el = document.getElementById(id);
        if(el) actualizarClase(el, "aprobada");
    });

    // [CORRECCIÓN] Aseguramos que el contador de talleres se cargue, se actualice y se guarde
    creditosTalleres = 4; 
    actualizarDisplayTaller();

    actualizarCreditos();
    recorrerDependencias();
    
    // Guardamos explícitamente para que persista al recargar la página
    guardarProgreso();
}

function actualizarClase(elemento, agregarClase) {
        elemento.disabled = false;
        elemento.setAttribute("estado",agregarClase);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarProgreso();
    recorrerDependencias();
    actualizarCreditos();
});