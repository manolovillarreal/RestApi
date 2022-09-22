const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { request } = require("express");

const usuariosPost = async (req, res) => {
  const { username, password } = req.body;

  //#region Validaciones
  //Verifica que el request contenga el usuario
  if (!username) {
    return res.status(400).json({
      msg: "Debe enviar el usuario",
    });
  }
  //Verifica que el request contenga la contraseña
  if (!password) {
    return res.status(400).json({
      msg: "Debe enviar el password",
    });
  }
  //Verifica si ya existe usuario con ese username
  const usuarioDB = await Usuario.findOne({ username });
  if (usuarioDB) {
    return res.status(400).json({
      msg: "Ya existe usuario con ese username",
    });
  }
  //#endregion

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  const hash = bcryptjs.hashSync(password, salt);

  //preparo la data para guardar
  const dataUsuario = {
    username,
    password: hash,
    estado: true,
    score: 0,
  };

  //Guardamos el usuario y extraemos la contraseña
  const { password: pass, ...usuario } = await Usuario.save(dataUsuario);

  res.json({
    usuario,
  });
};

const usuariosPatch = async (req, res) => {
  const { username, score } = req.body;

  //#region Validaciones
  //Verifica que el request contenga el usuario
  if (!username) {
    return res.status(400).json({
      msg: "Debe enviar el usuario",
      field: "username",
    });
  }
  //Verifica que el request contenga la contraseña
  if (!score) {
    return res.status(400).json({
      msg: "Debe enviar el score",
      field: "score",
    });
  }
  //Verifica si ya existe usuario con ese username
  const usuarioDB = await Usuario.findOne({ username });
  if (!usuarioDB) {
    return res.status(400).json({
      msg: "No existe usuario con username " + username,
    });
  }
  //#endregion
  //   if (req.usuario._id != usuarioDB._id) {
  //     return res.status(401).json({
  //       msg: "No tienes permiso para realizar esta acción",
  //     });
  //   }
  usuarioDB.score = score;

  //Guardamos el usuario y extraemos la contraseña
  const { password: pass, ...usuario } = await Usuario.save(usuarioDB);

  res.json({
    usuario,
  });
};
const usuariosGetByUsername = async (req = request, res) => {
  // const token = req.headers['x-token'];

  // if (!token) {
  //     return res.status(401).json({
  //         msg: 'No hay token en la peticion'
  //     });
  // }

  const { username } = req.params;
  //preparo la data para guardar
  //Guardamos el usuario y extraemos la contraseña
  let usuario = await Usuario.findOne({ username });

  res.json({
    usuario,
  });
};

const usuariosGetAll = async (req = request, res) => {
  let { limit = 100, skip = 0, sort = false } = req.query;
  let usuarios = await Usuario.find();

  console.log(sort);
  if (sort) usuarios.sort((u1, u2) => u2.score - u1.score);

  limit = Number(limit);
  skip = Number(skip);

  if (isNaN(limit)) {
    res.status(400).json({
      msg: "El campo limit debe ser numerico",
      field: "limit",
    });
  }
  if (isNaN(skip)) {
    res.status(400).json({
      msg: "El campo skip debe ser numerico",
      field: "skip",
    });
  }

  usuarios = usuarios.slice(skip, skip + limit);

  res.json({
    usuarios,
  });
};
module.exports = {
  usuariosPost,
  usuariosPatch,
  usuariosGetByUsername,
  usuariosGetAll,
};
