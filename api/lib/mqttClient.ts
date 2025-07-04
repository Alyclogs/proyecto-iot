// lib/mqttClient.ts
import mqtt from "mqtt";

const mqttClient = mqtt.connect("mqtt://35.193.76.83:1883");

mqttClient.on("connect", () => {
    console.log("Conectado al broker MQTT");
});

mqttClient.on("error", (err: any) => {
    console.error("Error de conexión al broker MQTT:", err);
});

export const publicarEstadoLuz = (state: boolean): Promise<void> => {
    const topic = "iot/karen/luz";
    const message = state ? "on" : "off";

    return new Promise((resolve, reject) => {
        mqttClient.publish(topic, message, (error?: Error) => {
            if (error) {
                console.error("Error publicando en MQTT:", error);
                reject(error);
            } else {
                console.log(`Publicado en ${topic}: ${message}`);
                resolve();
            }
        });
    });
};

export default mqttClient;
