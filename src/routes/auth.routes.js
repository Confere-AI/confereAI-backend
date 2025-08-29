const express = require("express");
const router = express.Router();
const validateMiddleware = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");

router.post(
  "/sign-up",
  validateMiddleware.signUpvalidateMiddleware,
  authController.createUser
);
router.post(
  "/sign-in",
  validateMiddleware.signInvalidateMiddleware,
  authController.signIn
);
router.post(
  "/logout",
  authMiddleware.authMiddleware, // para fazer o logout precisa estar autenticado
  authController.logoutUser
);

router.post("/refresh", authController.refreshToken);

module.exports = router;
