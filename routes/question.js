const { Router } = require('express');
const { login } = require('../controllers/auth');

const router = Router();

router.post('/', (req,res)=>{
    return res.status(400).json({
        msg: 'Se debe agregar el id del estudiante al final de la ruta como parametro',
    });
})
router.post('/:id', (req,res)=>{

    const { id } = req.params;
    const upbId = req.headers['upb-id'];
    const { id:idBody } = req.body;

    if (!upbId){
        return res.status(400).json({
            msg: 'La peticion debe contener un encabezado "ubp-id" que contenga su id upb',
            header: 'upb-id'
        });
    }

    if (!idBody){
        return res.status(400).json({
            msg: 'En el body de la petición debe enviar un campo id que contenga su id de la upb',
            field: 'id'
        });
    }

    if(id != upbId || id != idBody){
        return res.status(400).json({
            msg: 'las información enviada con coincide, los ids son diferentes ',
            param:id,
            header:upbId,
            body:idBody
        });
    }

    const secret = ` ${getIdentifier()} identificado con el numero ${id}, La clave secreta es: ${generateSecretCode(id)}`;
    res.header('secret',secret)
    res.status(202).json({
        msg: 'El secreto esta en un encabezado...... encuentralo',
    });

})

function getIdentifier() {
    
    const names = ['PERSONA','ESTUDIANTE','INDIVIDUO','HUMANO','USUARIO','PARTICIPANTE'];

    return names[Math.floor(Math.random() * names.length)];

}

function generateSecretCode(id) {
    
    let numberIdentifier ="";
    numberIdentifier += Math.floor(Math.random() * 10);
    numberIdentifier += Math.floor(Math.random() * 10);
    numberIdentifier += Math.floor(Math.random() * 10);
    numberIdentifier += Math.floor(Math.random() * 10);

    const L = id.split('').pop();
    const F = id.split('').shift();
    return F+ generateRandomLetter()+numberIdentifier+'-'+L;

}

function generateRandomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz"  
    
    return alphabet[Math.floor(Math.random() * alphabet.length)].toUpperCase();
  }


module.exports = router;