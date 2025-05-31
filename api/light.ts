import mqtt from 'mqtt';
import { VercelRequest, VercelResponse } from '@vercel/node';

const mqttClient = mqtt.connect('mqtt://35.193.76.83:1883');

mqttClient.on('connect', () => {
  console.log('Conectado al broker MQTT');
});

mqttClient.on('error', (err) => {
  console.error('Error de conexión al broker MQTT:', err);
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { state } = req.body;
    console.log(`Luz: ${state ? 'Encendida' : 'Apagada'}`);
    // Aquí publicarías al broker MQTT si quisieras
    return res.status(200).json({ message: `Luz ${state ? 'on' : 'off'}` });
  }

  res.status(405).json({ error: 'Método no permitido' });
}
