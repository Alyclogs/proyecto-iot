import { toZonedTime, format } from "date-fns-tz";

export default async function handler(req: any, res: any) {
    try {
        const limaTimezone = "America/Lima";

        // ✅ Convertir a hora local correctamente
        const ahoraUTC = new Date();
        const ahora = toZonedTime(ahoraUTC, limaTimezone); // <-- Clave

        const ahoraStr = format(ahora, "HH:mm", { timeZone: limaTimezone });
        const [horas, minutos] = ahoraStr.split(":").map(Number);
        const minutosActuales = horas * 60 + minutos;

        const diaActual = format(ahora, "EEEE", { timeZone: limaTimezone })
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        // 🔄 Obtener los horarios desde el backend
        const response = await fetch(`${process.env.BASE_URL}/api/schedule`);
        const horarios = await response.json();

        console.log("🕒 Hora actual (Lima):", ahoraStr);
        console.log("📅 Día actual:", diaActual);
        console.log("🗓️ Horarios cargados:", horarios);

        const horaStrToMin = (hora: string) => {
            const [h, m] = hora.split(":").map(Number);
            return h * 60 + m;
        };

        const debeEncender = horarios.some((horario: any) => {
            const inicioMin = horaStrToMin(horario.horaInicio);
            const finMin = horaStrToMin(horario.horaFin);
            const activo =
                horario.dias.includes(diaActual) &&
                minutosActuales >= inicioMin &&
                minutosActuales < finMin;

            console.log(`⏱️ Verificando: ${horario.horaInicio} - ${horario.horaFin} (${horario.dias.join(", ")})`);
            console.log("👉 ¿Corresponde encender?", activo);

            return activo;
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