// api/index.js
import { Redis } from "@upstash/redis";

const NUMEROS = [
  "541151586342",
  "541170645273",
  "541136145475",
  "541164623715",
  "541131219157",
  "541173725783",
  "541164603724",
  "541164607166",
  "541164603721",
  "541164607169",
  "541140226152"
];

const MENSAJE = encodeURIComponent(
  "👋🔹 Hola DIAMOND RINGS 🌟\nTengo ganas de jugar 🎮 ¿Por dónde empiezo? 🧩"
);

// Upstash Redis client (lee credenciales de variables de entorno)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req, res) {
  try {
    // INCR atomico en Redis (Upstash)
    const contador = await redis.incr("diamondrings:counter");
    // redis.incr devuelve el nuevo valor; queremos el índice 0-based:
    const indice = (contador - 1) % NUMEROS.length;
    const numero = NUMEROS[indice];

    // Opcional: guardamos el ultimo número (para auditoría)
    await redis.set("diamondrings:last", numero);

    const link = `https://wa.me/${numero}?text=${MENSAJE}`;
    res.writeHead(302, { Location: link });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error interno. Intenta más tarde.");
  }
}
