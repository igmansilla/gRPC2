  const express = require("express");
  const router = express.Router();
  const { usuarioClient } = require("../grpcClient");

  // Middleware para comprobar la autenticación
  const checkAuthentication = (req, res, next) => {
    if (!res.locals.isAuthenticated) {
      res.redirect('/index'); // Redirige a la pantalla de login si no está autenticado
    } else {
      next(); // Continúa con el procesamiento de la ruta
    }
  };

  // Ruta para manejar la creación de usuarios
  router.post(
    "/createUsuario",
    express.urlencoded({ extended: true }),
    checkAuthentication, // Asegúrate de que el usuario esté autenticado
    (req, res) => {
      const usuario = {
        id: parseInt(req.body.id),
        nombreUsuario: req.body.nombreUsuario,
        contrasena: req.body.contrasena,
        tienda_id: req.body.tienda_id,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        habilitado: req.body.habilitado === "true",
      };

      usuarioClient.CreateUsuario(usuario, (error, response) => {
        if (error) {
          console.error("Error:", error);
          res.render("index", {
            message: "Error: " + error.message,
            usuario: null,
            producto: null,
            tienda: null,
          });
        } else {
          res.redirect("/home"); // Redirige a la página de inicio después de crear un usuario
        }
      });
    }
  );

  // Ruta para manejar el login
  router.post("/login", express.urlencoded({ extended: true }), (req, res) => {
    const { nombreUsuario, contrasena } = req.body;

    const usuarioRequest = {
      nombreUsuario,
      contrasena,
    };

    usuarioClient.GetUsuario(usuarioRequest, (error, response) => {
      if (error) {
        console.error("Error:", error);
        res.render("index", {
          message: "Error: " + error.message,
        });
      } else if (
        response &&
        response.nombreUsuario === nombreUsuario &&
        response.contrasena === contrasena
      ) {
        console.log("Login exitoso");
        res.locals.isAuthenticated = true; // Establece la autenticación en true
        res.render("home"); // Redirige a la página principal después del login exitoso
      } else {
        console.log("Usuario o contraseña incorrectos");
        res.render("index", {
          message: "Usuario o contraseña incorrectos",
        });
      }
    });
  });

  // Ruta para la página de inicio
  router.get('/home', (req, res) => {
    if (res.locals.isAuthenticated) {
      res.render('home'); // Muestra la vista de inicio si está autenticado
    } else {
      res.redirect('index'); // Redirige al login si no está autenticado
    }
  });


  // Ruta para obtener un usuario por ID
  router.get("/getUsuario/:id", checkAuthentication, (req, res) => {
    const request = { id: parseInt(req.params.id) };

    usuarioClient.GetUsuario(request, (error, response) => {
      if (error) {
        console.error("Error:", error);
        res.render("index", {
          message: "Error: " + error.message,
          usuario: null,
          producto: null,
          tienda: null,
        });
      } else {
        res.render("index", {
          message: "Usuario obtenido",
          usuario: response,
          producto: null,
          tienda: null,
        });
      }
    });
  });

  // Ruta para actualizar un usuario
  router.post("/updateUsuario", express.urlencoded({ extended: true }), checkAuthentication, (req, res) => {
    const usuario = {
      id: parseInt(req.body.id),
      nombreUsuario: req.body.nombreUsuario,
      contrasena: req.body.contrasena,
      tienda_id: req.body.tienda_id,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      habilitado: req.body.habilitado === "true",
    };

    usuarioClient.UpdateUsuario(usuario, (error, response) => {
      if (error) {
        console.error("Error:", error);
        res.render("index", {
          message: "Error: " + error.message,
          usuario: null,
          producto: null,
          tienda: null,
        });
      } else {
        res.render("index", {
          message: "Usuario actualizado: " + response.nombreUsuario,
          usuario: response,
          producto: null,
          tienda: null,
        });
      }
    });
  });

  // Ruta para eliminar un usuario
  router.post("/deleteUsuario", express.urlencoded({ extended: true }), checkAuthentication, (req, res) => {
    const request = { id: parseInt(req.body.id) };

    usuarioClient.DeleteUsuario(request, (error, response) => {
      if (error) {
        console.error("Error:", error);
        res.render("index", {
          message: "Error: " + error.message,
          usuario: null,
          producto: null,
          tienda: null,
        });
      } else {
        res.render("index", {
          message: "Usuario eliminado: " + request.id,
          usuario: null,
          producto: null,
          tienda: null,
        });
      }
    });
  });

  // Ruta para listar todos los usuarios
  router.get("/listUsuarios", checkAuthentication, (req, res) => {
    usuarioClient.ListUsuarios({}, (error, response) => {
      if (error) {
        console.error("Error:", error);
        res.render("index", {
          message: "Error: " + error.message,
          usuarios: null,
          productos: null,
          tiendas: null,
        });
      } else {
        res.render("index", {
          message: "Usuarios obtenidos",
          usuarios: response.usuarios,
          productos: null,
          tiendas: null,
        });
      }
    });
  });

  router.get('/logout', (req, res) => {
    res.locals.isAuthenticated = false; // Desactiva la autenticación
    res.redirect('/index'); // Redirige al login
  });


  module.exports = router;
