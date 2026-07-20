/* --- DATOS Y DEPENDENCIAS --- */
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
    "intlnat":{ "aprobadas": [], "exoneradas": [] },
    "teti":{"aprobadas": [], "exoneradas": [] },
    "intDatos":{"aprobadas": [], "exoneradas": [] },
    "recInfo":{"aprobadas": [], "exoneradas": [] },
    "bdNRel":{"aprobadas": [], "exoneradas": [] },
    "modEst":{"aprobadas": [], "exoneradas": [] },
};

// Variable global para el contador manual
let creditosTalleres = 0;

/* --- FUNCIONES DE TALLERES --- */
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
    if(display) {
        display.textContent = creditosTalleres;
        display.style.color = creditosTalleres === 18 ? "#16a34a" : "var(--text-primary)";
    }
}

/* --- LÓGICA PRINCIPAL DE CRÉDITOS --- */
const actualizarCreditos = () => {
    let totalCreditos = 0;

    // 1. Inicializar contadores por área
    const creditosPorArea = {
        mate: 0, ciencias: 0, prog: 0, arqsisr: 0, bdatos: 0,
        calcnum: 0, invstop: 0, ingsoft: 0, actint: 0,
        gestion: 0, sociales: 0, ia: 0
    };

    // 2. Sumar créditos de materias (Solo si están "exonerada")
    document.querySelectorAll('.btn').forEach((btn) => {
        const estado = btn.getAttribute("estado");
        const creditos = parseInt(btn.getAttribute("creditos")) || 0;
        const area = btn.getAttribute("area");

        if (estado === "exonerada") {
            totalCreditos += creditos;

            if (area && creditosPorArea.hasOwnProperty(area)) {
                creditosPorArea[area] += creditos;
            }
        }
    });

    // 3. Sumar créditos manuales de Talleres al área correspondiente (actint)
    totalCreditos += creditosTalleres;
    creditosPorArea['actint'] += creditosTalleres;

    // 4. Actualizar visualización del Total Global en el Header
    const credDisplay = document.getElementById("creditos");
    if(credDisplay) {
        credDisplay.innerHTML = `Créditos totales: ${totalCreditos} / 450`;
    }

    // 5. Calcular y Actualizar los 3 Grupos Principales (Plan 97)

    // GRUPO 1: BÁSICAS (Mínimo 80)
    const totalBasicas = creditosPorArea.mate + creditosPorArea.ciencias;
    actualizarIndicadorGrupo("total-basicas", totalBasicas, 80);

    // GRUPO 2: TECNOLÓGICAS (Mínimo 220)
    const totalTecnicas = creditosPorArea.prog + creditosPorArea.arqsisr +
                          creditosPorArea.ia + creditosPorArea.bdatos +
                          creditosPorArea.calcnum + creditosPorArea.invstop +
                          creditosPorArea.ingsoft + creditosPorArea.actint +
                          creditosPorArea.gestion;
    actualizarIndicadorGrupo("total-tecnicas", totalTecnicas, 220);

    // GRUPO 3: COMPLEMENTARIAS (Mínimo 10)
    const totalCompl = creditosPorArea.sociales;
    actualizarIndicadorGrupo("total-complementarias", totalCompl, 10);

    // 6. Actualizar contadores individuales
    for (const area in creditosPorArea) {
        const elemento = document.getElementById(area);
        if (elemento) {
            elemento.textContent = creditosPorArea[area];
        }
    }

    // 7. Calcular progreso de Títulos
    calcularTitulos(totalCreditos, creditosPorArea);
};

/* --- FUNCIONES AUXILIARES DE ACTUALIZACIÓN --- */

// Helper para actualizar texto y color de los grupos
function actualizarIndicadorGrupo(elementId, valorActual, minimo) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.textContent = valorActual;
        elemento.style.color = valorActual >= minimo ? "#16a34a" : "var(--text-primary)";
        elemento.style.fontWeight = "800";
    }
}

// Lógica de Títulos (Analista e Ingeniero)
function calcularTitulos(totalCreditos, creditosPorArea) {
    
    // --- TÍTULO ANALISTA ---
    const reqAnalista = [
        { area: 'prog', min: 60, label: 'Prog' },
        { area: 'arqsisr', min: 30, label: 'Arq/SO' },
        { area: 'gestion', min: 10, label: 'Gestión' },
        { area: 'bdatos', min: 10, label: 'BD' },
        { area: 'actint', min: 15, label: 'Talleres' }
    ];

    let analistaEsPosible = true;
    let htmlRequisitos = '';

    reqAnalista.forEach(req => {
        const actuales = creditosPorArea[req.area] || 0;
        const cumple = actuales >= req.min;
        if (!cumple) analistaEsPosible = false;
        
        htmlRequisitos += `<li class="req-item ${cumple ? 'ok' : ''}">
            ${req.label}: ${actuales}/${req.min}
        </li>`;
    });

    const cumpleTotalAnalista = totalCreditos >= 270;
    const porcentajeAnalista = Math.min((totalCreditos / 270) * 100, 100);

    const barraAnalista = document.getElementById('bar-analista');
    if(barraAnalista) barraAnalista.style.width = `${porcentajeAnalista}%`;

    const txtAnalista = document.getElementById('creditos-analista');
    if(txtAnalista) txtAnalista.textContent = totalCreditos;

    const listaReq = document.getElementById('requisitos-analista');
    if(listaReq) listaReq.innerHTML = htmlRequisitos;

    const badgeAnalista = document.getElementById('estado-analista');
    if (badgeAnalista) {
        if (cumpleTotalAnalista && analistaEsPosible) {
            badgeAnalista.textContent = "¡COMPLETADO!";
            badgeAnalista.className = "badge-status completado";
        } else {
            badgeAnalista.textContent = "En curso";
            badgeAnalista.className = "badge-status";
        }
    }

    // --- TÍTULO INGENIERO ---
    const porcentajeIng = Math.min((totalCreditos / 450) * 100, 100);
    
    const barraIng = document.getElementById('bar-ingeniero');
    if(barraIng) barraIng.style.width = `${porcentajeIng}%`;
    
    const txtIng = document.getElementById('creditos-ingeniero');
    if(txtIng) txtIng.textContent = totalCreditos;

    const badgeIng = document.getElementById('estado-ingeniero');
    if(badgeIng) {
        if (totalCreditos >= 450) {
            badgeIng.textContent = "¡CRÉDITOS COMPLETOS!";
            badgeIng.className = "badge-status completado";
        } else {
            badgeIng.textContent = "En curso";
            badgeIng.className = "badge-status";
        }
    }
}

/* --- DEPENDENCIAS Y EVENTOS --- */
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

        // LÓGICA CORREGIDA PARA NO SOBRESCRIBIR ESTADOS
        if (habilitada) {
            if (btn.disabled) {
                btn.disabled = false;
                const estadoActual = btn.getAttribute("estado");
                if (estadoActual !== "aprobada" && estadoActual !== "exonerada") {
                    btn.setAttribute("estado", "sin-cursar");
                }
            }
        } else {
            if (!btn.disabled) {
                btn.disabled = true;
            }
        }
    });
};

// Event Listeners
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
        guardarProgreso(); 
    });
});

/* --- PERSISTENCIA --- */
function guardarProgreso() {
    const estadoMaterias = {};
    document.querySelectorAll('.btn').forEach(btn => {
        estadoMaterias[btn.id] = btn.getAttribute("estado");
    });
    
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
            
            if (datos.materias) {
                for (const [id, estado] of Object.entries(datos.materias)) {
                    const btn = document.getElementById(id);
                    if (btn && estado) {
                        btn.setAttribute("estado", estado);
                    }
                }
            }
            
            if (typeof datos.talleres === 'number') {
                creditosTalleres = datos.talleres;
                actualizarDisplayTaller();
            }
        } catch (e) {
            console.error("Error cargando datos", e);
        }
    }
}

/* --- DATOS DE PRUEBA --- */
function cargarDatos(){
    const exoneradas = [
        "calculoDiv", "gal1", "matDiscreta1", "calculoDivv", "gal2", "matDiscreta2",
        "prog1", "logica", "pye", "prog2", "prog3","prog4", "tallerProg", "economia", "teoleng",
        "adminGI", "progLogica", "arquitectura","practicaAdminGI", "intlnat", "bd", "metNum", "intProgFuncional", "cts", "polCient","iio","ingSoft","teti"
    ];

    exoneradas.forEach(id => {
        const el = document.getElementById(id);
        if(el) actualizarClase(el, "exonerada");
    });

    const aprobadas = [ "sisop" ];
    aprobadas.forEach(id => {
        const el = document.getElementById(id);
        if(el) actualizarClase(el, "aprobada");
    });

    creditosTalleres = 14; 
    actualizarDisplayTaller();

    actualizarCreditos();
    recorrerDependencias();
    guardarProgreso();
}

function actualizarClase(elemento, agregarClase) {
    elemento.disabled = false;
    elemento.setAttribute("estado", agregarClase);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarProgreso();
    recorrerDependencias();
    actualizarCreditos();
});