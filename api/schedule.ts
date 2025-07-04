// api/schedule.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from './lib/connection';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const client = await clientPromise;
    const db = client.db('tuDB');
    const collection = db.collection('horarios');

    if (req.method === 'GET') {
        const horarios = await collection.find({}).toArray();
        return res.status(200).json(horarios);
    }

    if (req.method === 'POST') {
        const { horaInicio, horaFin, dias } = req.body;
        if (!horaInicio || !horaFin || !dias?.length) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        await collection.insertOne({ horaInicio, horaFin, dias });
        return res.status(201).json({ message: 'Horario guardado correctamente' });
    }

    return res.status(405).json({ error: 'Método no permitido' });
}
