import mqtt from 'mqtt';

const mqttClient = mqtt.connect('mqtt://35.193.76.83:1883');

mqttClient.on('connect', () => {
  console.log('Conectado al broker MQTT');
});

mqttClient.on('error', (err: any) => {
  console.error('Error de conexión al broker MQTT:', err);
});

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { state } = req.body;
    const topic = 'iot/karen/luz';
    const message = state ? 'on' : 'off';

    console.log(`Luz: ${state ? 'Encendida' : 'Apagada'}`);

    mqttClient.publish(topic, message, (error?: Error) => {
      if (error) {
        console.error('Error publicando en MQTT:', error);
        return res.status(500).json({ error: 'Error al publicar en MQTT' });
      }

      console.log(`Publicado en ${topic}: ${message}`);
      return res.status(200).json({ message: `Luz ${message}` });
    });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
