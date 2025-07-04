import { useState, useEffect, useCallback } from "react";
import "./App.css";
import LedIndicator from "./components/LedIndicator";
import DiaButton from "./components/DiaButton";

function App() {
  const [isLedOn, setIsLedOn] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [horarios, setHorarios] = useState<any[]>([]);

  const diasDeLaSemana = [
    { nombre: "lunes", label: "lun" },
    { nombre: "martes", label: "mar" },
    { nombre: "miercoles", label: "mie" },
    { nombre: "jueves", label: "jue" },
    { nombre: "viernes", label: "vie" },
    { nombre: "sabado", label: "sab" },
    { nombre: "domingo", label: "dom" },
  ];

  const toggleLed = async (estado: boolean) => {
    try {
      const response = await fetch("/api/light", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: estado }),
      });

      if (response.ok) {
        setIsLedOn(estado);
      }
    } catch (error) {
      console.error("Error toggling LED:", error);
      setIsConnected(!isConnected);
    }
  };

  const actualizarHoraInicio = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const horaInicio = event.target.value;
      if (horaFin && horaInicio >= horaFin) {
        alert("La hora de inicio debe ser menor que la hora de fin.");
        return;
      }
      console.log("Hora inicio actualizada: ", horaInicio);
      setHoraInicio(horaInicio);
    },
    []
  );

  const actualizarHoraFin = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const horaFin = event.target.value;
      if (horaFin <= horaInicio) {
        alert("La hora de fin debe ser mayor que la hora de inicio.");
        return;
      }
      console.log("Hora fin actualizada: ", horaFin);
      setHoraFin(event.target.value);
    },
    []
  );

  useEffect(() => {
    const handleConnectionStatus = (status: boolean) => {
      setIsConnected(status);
    };

    // Simulate connection status change
    const interval = setInterval(() => {
      handleConnectionStatus(Math.random() > 0.1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await fetch("/api/schedule");
        const data = await response.json();
        setHorarios(data);
      } catch (error) {
        console.error("Error fetching horarios:", error);
      }
    };

    fetchHorarios();
  }, []);

  const toggleDia = (dia: string) => {
    console.log("Dia seleccionado: ", dia);
    setDiasSeleccionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const guardarHorario = async () => {
    if (!horaInicio || !horaFin) {
      alert("Por favor, completa las horas de inicio y fin.");
      return;
    }
    if (diasSeleccionados.length === 0) {
      alert("Por favor, selecciona al menos un día.");
      return;
    }
    const horario = {
      horaInicio,
      horaFin,
      dias: diasSeleccionados,
    };
    console.log("Horario a guardar: ", horario);
    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(horario),
      });

      if (response.ok) {
        alert("Horario guardado exitosamente.");
      } else {
        alert("Error al guardar el horario.");
      }
    } catch (error) {
      console.error("Error guardando horario:", error);
      alert("Error al guardar el horario.");
    }
  };

  const limpiarFormulario = () => {
    setHoraInicio("");
    setHoraFin("");
    setDiasSeleccionados([]);
  };

  return (
    <>
      <div className="app">
        <main className="main-content">
          <div className="content-row">
            <div className="control-panel">
              <LedIndicator isOn={isLedOn} />
              <div className="control-buttons">
                <button
                  className="control-button btn-prender"
                  onClick={() => toggleLed(true)}
                >
                  Prender
                </button>
                <button
                  className="control-button btn-apagar"
                  onClick={() => toggleLed(false)}
                >
                  Apagar
                </button>
              </div>
            </div>

            <div className="right-content">
              <header className="header">
                <div></div>
                <div className="connection-status">
                  <div
                    className={`connection-dot ${
                      isConnected ? "connected" : "disconnected"
                    }`}
                  ></div>
                  <p className="status-text">
                    {isConnected ? "Conectado" : "Desconectado"}
                  </p>
                </div>
              </header>
              <div className="title-section">
                <h1 className="main-title">CONTROL DE LUZ LED</h1>
                <p className="subtitle">Controla tu smart light with IoT</p>
              </div>
              <section className="new-schedule-section">
                <h2 className="schedule-title">Nuevo horario</h2>
                <div className="schedule-card" id="nuevoHorarioForm">
                  <div className="form-content">
                    <div className="form-row">
                      <p className="form-label">Repetir:</p>
                      <div className="dias-row">
                        {diasDeLaSemana.map(({ nombre, label }) => (
                          <DiaButton
                            key={nombre}
                            dia={nombre}
                            label={label}
                            isSelected={diasSeleccionados.includes(nombre)}
                            onClick={toggleDia}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="form-horarios">
                      <div className="form-row">
                        <label htmlFor="hora_inicio">Hora inicio:</label>
                        <input
                          type="time"
                          className="hora-input"
                          name="hora_inicio"
                          id="hora_inicio"
                          onChange={actualizarHoraInicio}
                        />
                      </div>
                      <div className="form-row">
                        <label htmlFor="hora_fin">Hora fin:</label>
                        <input
                          type="time"
                          className="hora-input"
                          name="hora_fin"
                          id="hora_fin"
                          onChange={actualizarHoraFin}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-buttons">
                    <button
                      className="control-button btn-apagar"
                      onClick={limpiarFormulario}
                    >
                      Cancelar
                    </button>
                    <button
                      className="control-button btn-prender"
                      onClick={guardarHorario}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section className="schedule-section">
            <h2 className="schedule-title">Próximos horarios</h2>

            {horarios.length > 0 ? (
              horarios.map((horario, index) => (
                <div className="schedule-grid">
                  <div className="schedule-card" key={index}>
                    <p className="schedule-days">{horario.dias.join(", ")}</p>
                    <div className="schedule-times">
                      <div className="time-slot">
                        <div className="time-label">Hora inicio</div>
                        <div className="time-value">{horario.horaInicio}</div>
                      </div>
                      <div className="time-slot">
                        <div className="time-label">Hora fin</div>
                        <div className="time-value">{horario.horaFin}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-schedule">No hay horarios programados.</p>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default App;
