const dependenciasCombinadas = {
    "fisica": {
        "aprobadas": [],
        "exoneradas": []
    },
    "economia": {
        "aprobadas": [],
        "exoneradas": []
    },
    "calculoDiv": {
        "aprobadas": [],
        "exoneradas": []
    },
    "gal1": {
        "aprobadas": [],
        "exoneradas": []
    },
    "matDiscreta1": {
        "aprobadas": [],
        "exoneradas": []
    },
    "prog1": {
        "aprobadas": [],
        "exoneradas": []
    },
    "calculoDivv": {
        "aprobadas": ["calculoDiv"],
        "exoneradas": []
    },
    "gal2": {
        "aprobadas": ["gal1"],
        "exoneradas": []
    },
    "matDiscreta2": {
        "aprobadas": ["matDiscreta1", "gal1"],
        "exoneradas": []
    },
    "pye": {
        "aprobadas": ["calculoDivv"],
        "exoneradas": ["calculoDiv", "gal1"]
    },
    "prog2": {
        "aprobadas": ["prog1"],
        "exoneradas": []
    },
    "arquitectura": {
        "aprobadas": ["prog2", "logica", "matDiscreta1"],
        "exoneradas": ["calculoDiv", "prog1"]
    },
    "prog3": {
        "aprobadas": ["prog2"],
        "exoneradas": ["prog1", "matDiscreta1"]
    },
    "sisop": {
        "aprobadas": ["arquitectura"],
        "exoneradas": ["gal1", "matDiscreta1", "prog2", "calculoDiv"]
    },
    "teoleng": {
        "aprobadas": ["prog3"],
        "exoneradas": ["logica", "matDiscreta1", "gal1", "calculoDiv"]
    },
    "redes": {
        "aprobadas": ["arquitectura", "sisop"],
        "exoneradas": ["prog3", "calculoDiv"]
    },
    "bd": {
        "aprobadas": [],
        "exoneradas": ["prog3", "matDiscreta2", "logica"]
    },
    "metNum": {
        "aprobadas": [],
        "exoneradas": ["calculoDivv", "calculoDiv", "gal1", "gal2", "prog1"]
    },
    "iio": {
        "aprobadas": [],
        "exoneradas": ["calculoDivv", "gal2", "gal1", "calculoDiv", "pye"]
    },
    "prog4": {
        "aprobadas": [],
        "exoneradas": ["prog1", "prog2", "matDiscreta1", "calculoDiv"]
    },
    "tallerProg": {
        "aprobadas": ["prog3"],
        "exoneradas": ["prog4"]
    },
    "logica": {
        "aprobadas": ["matDiscreta1"],
        "exoneradas": []
    },
    "progLogica": {
        "aprobadas": [],
        "exoneradas": ["prog3", "teoleng", "logica", "matDiscreta2"]
    },
    "ingSoft": {
        "aprobadas": ["bd", "prog4", "tallerProg"],
        "exoneradas": []
    },
    "intProgFuncional": {
        "aprobadas": [],
        "exoneradas": ["prog2","matDiscreta1","logica","teoleng"]
    },
    "P.I.S": {
        "aprobadas": ["ingSoft"],
        "exoneradas": ["prog4"]
    },
    "adminGI":{
        "aprobadas": [],
        "exoneradas": []
    },
    "practicaAdminGI":{
        "aprobadas": ["adminGI"],
        "exoneradas": []
    },
    "polCient":{
        "aprobadas": [],
        "exoneradas": []
    },
    "cts":{
        "aprobadas": [],
        "exoneradas": []
    },
    "dlogico":{
        "aprobadas": [],
        "exoneradas": []
    },

    "intmicro":{
        "aprobadas": [],
        "exoneradas": []
    }

};

const actualizarCreditos = () => {
    let totalCreditos = 0;

    // Mapeo para acumular créditos por área
    const creditosPorArea = {
        mate: 0,
        ciencias: 0,
        prog: 0,
        arqsisr: 0,
        bdatos: 0,
        calcnum: 0,
        invstop: 0,
        ingsoft: 0,
        actint: 0,
        gestion: 0,
        sociales: 0
    };

    // Recorremos todos los botones
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

    // Actualizar el total de créditos
    document.getElementById("creditos").innerHTML = `Créditos totales: ${totalCreditos}`;

    // Actualizar cada contador por área
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
        const dependencias = dependenciasCombinadas[id];
        let habilitada = true;

        // Verificar dependencias aprobadas
        dependencias.aprobadas.forEach(dep => {
            const depBtn = document.getElementById(dep);
            if (!(depBtn && (depBtn.getAttribute("estado") === "aprobada" || depBtn.getAttribute("estado") === "exonerada"))) {
                habilitada = false;
            }
            });

        // Verificar dependencias exoneradas
        dependencias.exoneradas.forEach(dep => {
            const depBtn = document.getElementById(dep);
            if (!(depBtn && depBtn.getAttribute("estado")  === "exonerada")) {
                habilitada = false;
            }
        });

        // Actualizar el estado del botón
        if (habilitada && btn.disabled) {
            btn.disabled = false;
            btn.setAttribute("estado","sin-cursar");
        } else if (!habilitada && !btn.disabled) {
            btn.disabled = true;
        }
    });
};

// Asignar eventos de click a cada botón
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {

        if (btn.getAttribute("estado") === "sin-cursar" || btn.getAttribute("estado")  == null) {
            btn.setAttribute("estado","aprobada"); 
        } else if (btn.getAttribute("estado") === "aprobada") {
            btn.setAttribute("estado","exonerada"); 
        } else {
            btn.estado = "sin-cursar";
            btn.setAttribute("estado","sin-cursar"); 
        }

        actualizarCreditos();
        recorrerDependencias();
    });
});


recorrerDependencias();

function cargarDatos(){
    const exoneradas = [
        calculoDiv, gal1, matDiscreta1, calculoDivv, gal2, matDiscreta2,
        prog1, logica, pye, prog2, prog3,prog4, tallerProg, economia, teoleng,
        adminGI, progLogica
    ];

    exoneradas.forEach(elemento => {
        actualizarClase(elemento, "exonerada");
    });

    const aprobadas = [
        metNum, iio, arquitectura, cts
    ];

    aprobadas.forEach(elemento => {
        actualizarClase(elemento, "aprobada");
    });

    actualizarCreditos();
        recorrerDependencias();

    
}

function actualizarClase(elemento, agregarClase) {
        elemento.disabled = false;
        elemento.setAttribute("estado",agregarClase);
    
}

