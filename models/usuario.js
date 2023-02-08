const { model, Schema } = require('../jsonDB/jsonDB');

const UsuarioSchema = Schema({
    id: Number,
    username: String,
    estado: Boolean,
    data:Object
})


module.exports = model('Usuario', UsuarioSchema);