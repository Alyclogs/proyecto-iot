import express from 'express';
import cors from 'cors';
import mqtt from 'mqtt';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const mqttClient = mqtt.connect('mqtt://35.193.76.83:1883');

mqttClient.on('connect', () => {
    console.log('Conectado al broker MQTT');
});

mqttClient.on('error', (err) => {
    console.error('Error de conexión al broker MQTT:', err);
});

app.get('/', (req, res) => {
    res.send('¡Servidor con TypeScript funcionando!');
});

// Ruta para encender o apagar la luz
app.post('/api/light', (req, res) => {
    const { state } = req.body;
    const topic = 'iot/karen/luz';
    const message = state ? 'on' : 'off';
    console.log(`Estado de la luz: ${state ? 'Encendida' : 'Apagada'}`);
    console.log(`Publicando en ${topic}: ${message}`);

    mqttClient.publish(topic, message, (err) => {
        if (err) {
            console.error('Error publicando en MQTT:', err);
            return res.status(500).send('Error en MQTT');
        }
        console.log(`Publicado en ${topic}: ${message}`);
        res.sendStatus(200);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
