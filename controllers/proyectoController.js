const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req,res) => {

      //revisamos si hay errores
      const errores = validationResult(req);
    
      if(!errores.isEmpty()){
          return res.status(400).json({errores: errores.array()});
      }
    

    try {
        
        //crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);
        //guardar el creador via jws
        proyecto.creador = req.usuario.id
        //guardamos el proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error)
        res.status(500).send("hubo un error");
    }
}

//Obtiene todos los proyectos del usuario actual

exports.obtenerProyectos = async (req,res) => {
    try {
        const proyectos = await Proyecto.find({
            creador: req.usuario.id
        });

        res.json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(500).send("hubo un error");
    }
}

exports.actualizarProyecto = async (req,res) => {

    //revisamos si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //extraer la info del proyecto

    const {nombre} = req.body;
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        //revisar el id
        let proyecto = await Proyecto.findById(req.params.id);
        //si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //verificar el creador del proyecto
        if(req.usuario.id!==proyecto.creador.toString()){
            return res.status(401).json({msg: 'No autorizado'});
        }
       
        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({
            _id: req.params.id
        },{
            $set: nuevoProyecto
        },{
            new: true
        });

        return res.json({proyecto});


    } catch (error) {
        console.log(error);
        res.status(500).send("hubo un error");
    }
}

exports.eliminarProyecto = async (req,res) => {

    try {
        //revisar el id
        let proyecto = await Proyecto.findById(req.params.id);
        //si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //verificar el creador del proyecto
        if(req.usuario.id!==proyecto.creador.toString()){
            return res.status(401).json({msg: 'No autorizado'});
        }
       
        //actualizar
        proyecto = await Proyecto.findOneAndRemove({_id: req.params.id});

        return res.json({msg: 'Proyecto eliminado'});


    } catch (error) {
        console.log(error);
        res.status(500).send("hubo un error");
    }
}