// api/schedule.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
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

    if (req.method === 'PUT') {
        const { id } = req.query;
        const { horaInicio, horaFin, dias } = req.body;

        if (!id || !horaInicio || !horaFin || !dias?.length) {
            return res.status(400).json({ error: 'Datos incompletos para actualizar' });
        }

        try {
            const result = await collection.updateOne(
                { _id: new ObjectId(id as string) },
                { $set: { horaInicio, horaFin, dias } }
            );
            return res.status(200).json({ message: 'Horario actualizado', result });
        } catch (err) {
            return res.status(500).json({ error: 'Error al actualizar horario' });
        }
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID no proporcionado' });
        }

        try {
            const result = await collection.deleteOne({ _id: new ObjectId(id as string) });
            return res.status(200).json({ message: 'Horario eliminado', result });
        } catch (err) {
            return res.status(500).json({ error: 'Error al eliminar horario' });
        }
    }

    return res.status(405).json({ error: 'Método no permitido' });
}
