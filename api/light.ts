// pages/api/light.ts
import { publicarEstadoLuz } from "./lib/mqttClient";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { state } = req.body;

    try {
      await publicarEstadoLuz(state);
      return res.status(200).json({ message: `Luz ${state ? "encendida" : "apagada"}` });
    } catch (error) {
      return res.status(500).json({ error: "Error al publicar en MQTT" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
