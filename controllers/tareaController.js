const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearTarea = async (req,res) => {

    //revisamos si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    try {
        
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto){
            return res.status(404).json({msg: "proyecto no encontrado"});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(req.usuario.id!==existeProyecto.creador.toString()){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //crear un nuevo tarea
        const tarea = new Tarea(req.body);
        //guardamos el tarea
        tarea.save();
        res.json(tarea);
    
    } catch (error) {
        console.log(error)
        res.status(500).send("hubo un error");
    }
}

//Obtiene todos los tareas del usuario actual

exports.obtenerTareas = async (req,res) => {

    //revisamos si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }
    
    try {
        
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto){
            return res.status(404).json({msg: "proyecto no encontrado"});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(req.usuario.id!==existeProyecto.creador.toString()){
            return res.status(401).json({msg: 'No autorizado'});
        }

        const tareas = await Tarea.find({
            proyecto
        });

        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send("hubo un error");
    }
}

exports.actualizarTarea = async (req,res) => {

    try {

        //Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;
        
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({msg: "tarea no encontrada"});
        }

        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto){
            return res.status(404).json({msg: "proyecto no encontrado"});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(req.usuario.id!==existeProyecto.creador.toString()){
            return res.status(401).json({msg: 'No autorizado'});
        }
 
        //crear un objeto con la nueva informacion
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
    
       
        //actualizar
        tarea = await Tarea.findByIdAndUpdate({
            _id: req.params.id
        },{
            $set: nuevaTarea
        },{
            new: true
        });

        return res.json({tarea});


    } catch (error) {
        console.log(error);
        res.status(500).send("hubo un error");
    }
}

exports.eliminarTarea = async (req,res) => {
   try {

       //Extraer el proyecto y comprobar si existe
       const { proyecto } = req.query;
       
       let tarea = await Tarea.findById(req.params.id);
       if(!tarea){
           return res.status(404).json({msg: "tarea no encontrada"});
       }

       const existeProyecto = await Proyecto.findById(proyecto);

       if(!existeProyecto){
           return res.status(404).json({msg: "proyecto no encontrado"});
       }

       //Revisar si el proyecto actual pertenece al usuario autenticado
       if(req.usuario.id!==existeProyecto.creador.toString()){
           return res.status(401).json({msg: 'No autorizado'});
       }

       //eliminar 
       await Tarea.findByIdAndRemove({_id: req.params.id})

       return res.json({msg: "Tarea eliminada"});


   } catch (error) {
       console.log(error);
       res.status(500).send("hubo un error");
   }
}