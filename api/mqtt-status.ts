// api/mqtt-status.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import mqttClient from "./lib/mqttClient";

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (mqttClient.connected) {
        return res.status(200).json({ connected: true });
    } else {
        return res.status(503).json({ connected: false });
    }
}