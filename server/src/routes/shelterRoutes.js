const express = require('express');
const router = express.Router();
const shelterController = require('../controllers/shelterController');

router.get('/', shelterController.getAllShelters);
router.post('/', shelterController.createShelter);
// Buscar necessidades de um abrigo específico
router.get('/:id/needs', shelterController.getShelterNeeds);
// Adicionar uma nova necessidade a um abrigo
router.post('/:id/needs', shelterController.addShelterNeed);
router.post('/:id/needs', shelterController.addShelterNeed);
// Delete
router.delete('/:id', shelterController.deleteShelter);
router.post('/:id/checkin', shelterController.checkInOccupant);

module.exports = router;