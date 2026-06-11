async function enviarPregunta() {

    let input = document.getElementById("pregunta");

    let texto = input.value.trim();

    if (texto === "") return;

    agregarMensaje(texto, "usuario");

    input.value = "";

    try {

        let respuesta = await fetch("https://casa-arias-ia.onrender.com/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                mensaje: texto
            })

        });

        let data = await respuesta.json();

        agregarMensaje(data.respuesta, "ia");

    } catch (error) {

        agregarMensaje(
            "Error conectando con TuquitoIA.",
            "ia"
        );
    }
}

function preguntaRapida(texto) {

    document.getElementById("pregunta").value = texto;

    enviarPregunta();
}

function agregarMensaje(texto, tipo) {

    let chat = document.getElementById("chat");

    let div = document.createElement("div");

    div.classList.add("mensaje");
    div.classList.add(tipo);

    div.innerHTML = texto;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}

window.onload = () => {

    agregarMensaje(
        "¡Hola! Soy La inteligencia artificial de Casa Arias.<br><br>Puedo ayudarte con consultas sobre la librería.",
        "ia"
    );

};

document.getElementById("pregunta").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        enviarPregunta();
    }

});