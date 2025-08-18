import sequelize from "../config/db.js";

function diaSemanaEs(fechaStr) {
  const d = new Date(fechaStr + "T00:00:00");
  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return dias[d.getDay()];
}

function parseDias(str) {
  // intenta JSON parse, si no, limpia y separa
  try {
    const arr = JSON.parse(str);
    return Array.isArray(arr) ? arr.map((x) => String(x)) : [];
  } catch {
    return String(str)
      .replace(/[\[\]"]/g, "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

export async function buscarViajes(req, res) {
  try {
    let { origen, destino, fecha } = req.query;
    if (!origen || !destino || !fecha) {
      return res
        .status(400)
        .json({ message: "origen, destino y fecha son requeridos" });
    }
    origen = String(origen).trim();
    destino = String(destino).trim();
    fecha = String(fecha).slice(0, 10); // YYYY-MM-DD

    const dia = diaSemanaEs(fecha); // p.ej. "Viernes"
    console.log("➡️ /api/viajes", { origen, destino, fecha, dia });

    const [rows] = await sequelize.query(
      `
      SELECT
        r.id               AS rutaId,
        r.punto_inicio     AS origen,
        r.punto_final      AS destino,
        r.nombre           AS empresa,
        r.distancia_km,
        r.tiempo_estimado_seg,
        h.id               AS horarioId,
        h.hora_salida,
        h.hora_llegada,
        h.capacidad_disponible,
        h.dias_disponibles
      FROM rutas r
      JOIN horarios h ON h.ruta_id = r.id
      WHERE r.activo = 1
        AND r.punto_inicio = ?
        AND r.punto_final  = ?
      ORDER BY h.hora_salida ASC
      `,
      { replacements: [origen, destino] }
    );

    const trips = rows
      .filter((r) => parseDias(r.dias_disponibles).includes(dia))
      .map((r) => {
        const salida = new Date(`${fecha}T${r.hora_salida}`); // "YYYY-MM-DDTHH:mm:ss"
        let llegada = r.hora_llegada
          ? new Date(`${fecha}T${r.hora_llegada}`)
          : null;
        if (llegada && llegada < salida) {
          // si la llegada es pasada la medianoche, agrega 1 día
          llegada = new Date(llegada.getTime() + 24 * 3600 * 1000);
        }
        // si no tenemos hora_llegada, calcula con tiempo_estimado_seg
        if (!llegada && r.tiempo_estimado_seg != null) {
          llegada = new Date(
            salida.getTime() + Number(r.tiempo_estimado_seg) * 1000
          );
        }

        // precio ejemplo: basado en distancia (ajusta a tu regla real)
        const baseKm = Number(r.distancia_km ?? 200);
        const price = Math.round(baseKm * 0.9); // p.ej. $0.90 por km

        return {
          id: `${r.rutaId}-${r.horarioId}`,
          rutaId: r.rutaId,
          origen: r.origen,
          destino: r.destino,
          salida,
          llegada,
          precio: price,
          empresa: r.empresa || "ByteBuss",
          clase: "Económica", // si luego agregas columna "clase", úsala
          asientosDisponibles: Number(r.capacidad_disponible ?? 0),
        };
      });

    res.json(trips);
  } catch (err) {
    console.error("❌ /api/viajes error:", err);
    res.status(500).json({ message: "Error buscando viajes" });
  }
}

export async function obtenerAsientos(req, res) {
  try {
    const raw = String(req.params.id || "");
    const m = raw.match(/^(\d+)-(\d+)$/);
    if (!m) {
      return res.status(400).json({
        message:
          "Formato de id inválido. Usa: /api/viajes/{rutaId}-{horarioId}/asientos",
        id: raw,
      });
    }
    const rutaId = parseInt(m[1], 10);
    const horarioId = parseInt(m[2], 10);

    // capacidad disponible de ese horario
    const [rows] = await sequelize.query(
      "SELECT capacidad_disponible FROM horarios WHERE id = ? AND ruta_id = ?",
      { replacements: [horarioId, rutaId] }
    );
    const capacidad = Number(rows?.[0]?.capacidad_disponible ?? 40);

    // --- genera el mapa ---
    const rowsCount = 12; // ajusta a tu bus real
    const cols = 4;
    const totalSeats = rowsCount * cols;
    const vendidos = Math.min(Math.max(0, totalSeats - capacidad), totalSeats);

    const seats = [];
    let num = 1;
    for (let r = 1; r <= rowsCount; r++) {
      for (let c = 1; c <= cols; c++) {
        seats.push({ num: num++, row: r, col: c, status: "free" });
      }
    }

    // --- marcar ocupados sin colisiones (shuffle determinístico) ---
    let seed = horarioId * 9301 + rutaId * 49297;
    const rand = () => {
      // LCG clásico
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x80000000;
    };

    const idxs = seats.map((_, i) => i);
    for (let i = idxs.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
    }
    idxs.slice(0, vendidos).forEach((i) => (seats[i].status = "taken"));

    // preferentes (fila 1)
    seats
      .filter((s) => s.row === 1 && s.status === "free")
      .forEach((s) => (s.status = "pref"));

    console.log("[asientos]", {
      rutaId,
      horarioId,
      capacidad,
      vendidos,
      totalSeats,
    });

    res.json({
      tripId: raw,
      busType: "2+2",
      rows: rowsCount,
      cols,
      aisleAfter: 2,
      seats,
    });
  } catch (e) {
    console.error("asientos error", e);
    res.status(500).json({ message: "Error obteniendo asientos" });
  }
}
