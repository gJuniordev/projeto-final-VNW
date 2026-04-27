const db = require("../database/db");

// Buscar todos os abrigos
const getAllShelters = async (req, res) => {
  const { search } = req.query;
  try {
    let query = "SELECT * FROM shelters";
    let values = [];
    if (search) {
      query += " WHERE name ILIKE $1 OR city ILIKE $2";
      values = [`%${search}%`, `%${search}%`];
    }
    query += " ORDER BY name ASC";
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar abrigos" });
  }
};

// Criar novo abrigo
const createShelter = async (req, res) => {
  const { name, address, city, capacity, occupied_slots, contact_phone } =
    req.body;
  try {
    const query = `
      INSERT INTO shelters (name, address, city, capacity, occupied_slots, contact_phone)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    const values = [
      name,
      address,
      city,
      capacity,
      occupied_slots || 0,
      contact_phone,
    ];
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar abrigo" });
  }
};

// Excluir abrigo
const deleteShelter = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM shelter_needs WHERE shelter_id = $1", [id]);
    await db.query("DELETE FROM shelter_occupants WHERE shelter_id = $1", [id]);
    const result = await db.query("DELETE FROM shelters WHERE id = $1", [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Não encontrado" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir" });
  }
};

// Realizar Check-in (Atualiza vagas em tempo real)
const checkInOccupant = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await db.query("BEGIN");
    await db.query(
      "INSERT INTO shelter_occupants (shelter_id, name) VALUES ($1, $2)",
      [id, name],
    );
    const updateResult = await db.query(
      "UPDATE shelters SET occupied_slots = occupied_slots + 1 WHERE id = $1 AND occupied_slots < capacity RETURNING *",
      [id],
    );
    if (updateResult.rowCount === 0) {
      await db.query("ROLLBACK");
      return res.status(400).json({ error: "Abrigo lotado!" });
    }
    await db.query("COMMIT");
    res.status(201).json(updateResult.rows[0]); // Retorna o abrigo atualizado
  } catch (err) {
    await db.query("ROLLBACK");
    res.status(500).json({ error: "Erro no check-in" });
  }
};

const getShelterNeeds = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT sn.*, dc.name as category_name FROM shelter_needs sn 
                   JOIN donation_categories dc ON sn.category_id = dc.id WHERE sn.shelter_id = $1`;
    const result = await db.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro" });
  }
};

const addShelterNeed = async (req, res) => {
  const { id } = req.params;
  const { category_id, urgency_level, description } = req.body;
  try {
    const query = `INSERT INTO shelter_needs (shelter_id, category_id, urgency_level, description) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await db.query(query, [
      id,
      category_id,
      urgency_level,
      description,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro" });
  }
};

module.exports = {
  getAllShelters,
  createShelter,
  getShelterNeeds,
  addShelterNeed,
  deleteShelter,
  checkInOccupant,
};
