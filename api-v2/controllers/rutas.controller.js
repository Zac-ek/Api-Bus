// controllers/rutas.controller.js
import sequelize from "../config/db.js";

export async function listOrigins(req, res) {
  try {
    const [rows] = await sequelize.query(
      "SELECT DISTINCT punto_inicio AS nombre FROM Rutas WHERE activo=1 ORDER BY nombre"
    );
    res.json(rows.map((r) => r.nombre));
  } catch (e) {
    console.error("Error listOrigins:", e);
    res.status(500).json({ message: "Error obteniendo orígenes" });
  }
}

export async function listDestinations(req, res) {
  try {
    const { origen } = req.query;
    if (!origen) return res.status(400).json({ message: "origen requerido" });

    const [rows] = await sequelize.query(
      "SELECT DISTINCT punto_final AS nombre FROM Rutas WHERE activo=1 AND punto_inicio = ? ORDER BY nombre",
      { replacements: [origen] }
    );
    res.json(rows.map((r) => r.nombre));
  } catch (e) {
    console.error("Error listDestinations:", e);
    res.status(500).json({ message: "Error obteniendo destinos" });
  }
}
