
export default async function handler(req: any, res: any) {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/schedule`);
        const horarios = await response.json();

        const ahora = new Date();
        const horaActual = ahora.toTimeString().slice(0, 5);
        const diaActual = ahora.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();

        const debeEncender = horarios.some((horario: any) => {
            return (
                horario.dias.includes(diaActual) &&
                horaActual >= horario.horaInicio &&
                horaActual < horario.horaFin
            );
        });

        await fetch(`${process.env.BASE_URL}/api/light`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: debeEncender }),
        });

        return res.status(200).json({ success: true, estado: debeEncender });
    } catch (err) {
        return res.status(500).json({ error: "Error automático", details: err });
    }
}