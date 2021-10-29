import { Router } from "express";
import {showItems, removeItem, addItem} from "../Controllers/crud.controllers.js";
import { newUser, userLogin, verifyToken } from "../Controllers/user.controllers.js";


const routes = Router();


//Rotas Inventario
routes.get('/show', verifyToken, showItems);
routes.post('/remove', verifyToken, removeItem);
routes.post('/additem', verifyToken, addItem);



//Rotas de Usuarios
routes.post('/login', userLogin);
routes.post('/newuser', verifyToken, newUser);

export default routes;