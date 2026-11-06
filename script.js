
const API_URL = "https://casa-arias-ia.onrender.com/chat";

const formulario = document.getElementById("formulario");
const input = document.getElementById("pregunta");
const chat = document.getElementById("chat");

function agregarMensaje(texto, tipo) {
    const mensaje = document.createElement("div");

    mensaje.classList.add("mensaje", tipo);
    mensaje.textContent = texto;

    chat.appendChild(mensaje);
    chat.scrollTop = chat.scrollHeight;
}

async function preguntar(texto) {
    if (!texto || !texto.trim()) return;

    agregarMensaje(texto, "usuario");

    input.value = "";
    input.disabled = true;

    const cargando = document.createElement("div");
    cargando.classList.add("mensaje", "ia");
    cargando.textContent = "CasaAriasIA está escribiendo...";
    chat.appendChild(cargando);
    chat.scrollTop = chat.scrollHeight;

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mensaje: texto.trim()
            })
        });

        const datos = await respuesta.json();

        cargando.remove();

        if (!respuesta.ok) {
            throw new Error(datos.respuesta || "Error del servidor.");
        }

        agregarMensaje(
            datos.respuesta || "No recibí una respuesta.",
            "ia"
        );

    } catch (error) {
        cargando.remove();

        console.error("Error:", error);

        agregarMensaje(
            "No pude conectarme con CasaAriasIA. Intentá nuevamente en unos minutos.",
            "ia"
        );

    } finally {
        input.disabled = false;
        input.focus();
    }
}

formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    preguntar(input.value);
});
