const { Router } = require("express");
const {
  usuariosPost,
  usuariosPatch,
  usuariosGetByUsername,
  usuariosGetAll,
} = require("../controllers/usuarios");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post("/", usuariosPost);
router.patch("/", [validarJWT], usuariosPatch);
router.get("/:username", [validarJWT], usuariosGetByUsername);
router.get("/", [validarJWT], usuariosGetAll);

module.exports = router;
