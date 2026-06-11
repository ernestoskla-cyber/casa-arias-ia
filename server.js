import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

const precios = {
    "lapicera": "entre $400 y $1.200",
    "lapiz": "entre $300 y $1.000",
    "lápiz": "entre $300 y $1.000",
    "goma": "entre $300 y $1.500",
    "sacapuntas": "entre $500 y $2.000",
    "regla": "entre $500 y $2.500",
    "escuadra": "entre $1.000 y $4.000",
    "transportador": "entre $1.000 y $4.000",
    "compas": "entre $2.000 y $12.000",
    "compás": "entre $2.000 y $12.000",
    "plasticola": "entre $500 y $3.000",
    "tijera": "entre $1.000 y $5.000",
    "tempera": "entre $3.000 y $12.000",
    "témpera": "entre $3.000 y $12.000",
    "acuarelas": "entre $4.000 y $15.000",
    "pinceles": "entre $1.000 y $10.000",
    "marcadores": "entre $5.000 y $15.000",
    "crayones": "entre $2.000 y $8.000",
    "cuaderno": "entre $2.000 y $18.000",
    "carpeta": "entre $4.000 y $12.000",
    "bibliorato": "entre $3.000 y $8.000",
    "folios": "entre $3.000 y $10.000",
    "resma": "entre $7.000 y $15.000",
    "calculadora": "entre $4.000 y $60.000",
    "agenda": "entre $5.000 y $30.000",
    "cartuchera": "entre $4.000 y $60.000",
    "mochila": "entre $25.000 y $45.000",
    "rompecabezas": "entre $5.000 y $40.000",
    "juego de mesa": "entre $10.000 y $100.000",
    "muñeca": "entre $10.000 y $120.000",
    "auto": "entre $5.000 y $80.000",
    "pelota": "entre $5.000 y $30.000",
    "taza": "entre $4.000 y $20.000",
    "guirnalda": "entre $3.000 y $30.000",
    "luces": "entre $10.000 y $80.000",
    "arbol navideño": "entre $30.000 y $200.000",
    "árbol navideño": "entre $30.000 y $200.000"
};

const informacionCasaArias = `
Casa Arias es una librería, juguetería, bazar, regalería y tienda de artículos navideños de Cruz del Eje.

Sucursales:
- Centro: San Martín 331.
- Sur: Zona Sur de Cruz del Eje.

Contacto:
- WhatsApp: +54 9 3543 651557
- Tel: (03549) 42-3697
- Tel: (03549) 46-1612
- Email: info@casa-arias.com

Horarios:
Lunes a sábado:
9:00 a 13:00
17:00 a 21:00

Domingo cerrado.

Realizan delivery local.

IMPORTANTE:
Si la consulta no está relacionada con Casa Arias responder:

"Lo siento, solo puedo responder consultas relacionadas con Casa Arias."

Hoy es 4 de junio de 2026.
`;

app.post("/chat", async (req, res) => {

    const mensaje = req.body.mensaje.toLowerCase();

    for (const producto in precios) {

        if (mensaje.includes(producto)) {

            return res.json({
                respuesta:
                    `El precio estimado de ${producto} se encuentra ${precios[producto]}.\n\n` +
                    `Los valores pueden variar según la marca, calidad, promociones y disponibilidad.\n\n` +
                    `Para confirmar stock y precio actualizado recomendamos consultar por WhatsApp al +54 9 3543 651557.`
            });
        }
    }

    try {

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            messages: [
                {
                    role: "system",
                    content: `
${informacionCasaArias}

Eres TuquitoIA.

Responde únicamente sobre Casa Arias.

No inventes información.

Si el usuario pregunta algo ajeno a Casa Arias responde:

"Lo siento, solo puedo responder consultas relacionadas con Casa Arias."
`
                },
                {
                    role: "user",
                    content: mensaje
                }
            ]
        });

        res.json({
            respuesta: completion.choices[0].message.content
        });

    } catch (error) {

        console.log(error);

        res.json({
            respuesta: "Error al conectar con TuquitoIA."
        });
    }
});

app.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
});