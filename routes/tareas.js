//rutas para tareas
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

//crea un usuario
//api/proyecto
router.post('/',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatoria').not().isEmpty(),
        check('proyecto', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

//Obtener todas las tareas segun id
router.get('/',
    auth,
    [
        check('proyecto', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.obtenerTareas
);

//Actualizar tarea via ID
router.put('/:id',
    auth,
    [
        check('proyecto', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.actualizarTarea
);

//Eliminar tarea via ID
router.delete('/:id',
    auth,
    [
        check('proyecto', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.eliminarTarea
);

module.exports = router;