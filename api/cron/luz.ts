export default async function handler(req: any, res: any) {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/schedule`);
        const horarios = await response.json();

        const ahora = new Date();
        const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

        const normalizarDia = (dia: string) =>
            dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        const diaActual = normalizarDia(
            ahora.toLocaleDateString("es-ES", { weekday: "long" })
        );

        console.log("🕒 Hora actual:", ahora.toTimeString().slice(0, 5));
        console.log("📅 Día actual:", diaActual);
        console.log("🗓️ Horarios cargados:", horarios);

        const horaStrToMin = (hora: string) => {
            const [h, m] = hora.split(":").map(Number);
            return h * 60 + m;
        };

        const debeEncender = horarios.some((horario: any) => {
            const inicioMin = horaStrToMin(horario.horaInicio);
            const finMin = horaStrToMin(horario.horaFin);
            const resultado =
                horario.dias.includes(diaActual) &&
                minutosActuales >= inicioMin &&
                minutosActuales < finMin;

            console.log(`⏱️ Verificando horario: ${horario.horaInicio} - ${horario.horaFin} (${horario.dias.join(", ")})`);
            console.log("👉 ¿Corresponde encender?", resultado);

            return resultado;
        });

        console.log("🚦 Resultado final, ¿encender LED?:", debeEncender);

        const lightResponse = await fetch(`${process.env.BASE_URL}/api/light`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: debeEncender }),
        });

        console.log("📤 Resultado de envío a /api/light:", lightResponse.status);

        return res.status(200).json({ success: true, estado: debeEncender });
    } catch (err) {
        console.error("❌ Error en verificación automática:", err);
        return res.status(500).json({ error: "Error automático", details: err });
    }
}