import { connection } from "./crud.controllers.js";
import secretKey from "../secretkey.js";
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';


function verifyToken(req, res, next){
    var {authorization} = req.headers;

    try{
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, secretKey, {});
        req.headers.decoded = decoded;
        next();
    }catch(error){
        return res.status(500).json({
            Error: "Jwt Invalid"
        })
    }
}


function userLogin(req, res){
    const {login, senha} = req.body;
    try {
        connection.query(`SELECT * FROM users WHERE login = ?`,login, function(error, results){
            if(error){
                return res.status(500).json({
                    "Error": "Server Internal Error"
                })
            }
            if(results.length >= 1){
                bcrypt.compare(senha, results[0].senha).then(function(result) {
                    if(result === true){
                        var token = jwt.sign({  
                            login: results[0].login,
                            id: results[0].ID
                        }, secretKey, {expiresIn: '1h'});
                        return res.status(200).json({
                            Login: true,
                            Token: token
                        })
                    }else{
                        return res.status(400).json({
                            Login: false,
                            Error: "Usuario ou senha incorreto."
                        })
                    }
                });
            }else{
                return res.status(404).json({
                    "Error": "User not found"
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            "Error": "Server Internal Error"
        })
    }
}

function newUser(req, res) {
    const {login, senha, email} = req.body;
    var id = uuidv4();
    if(login === undefined || senha === undefined || email === undefined){
        return res.status(500).json({
            "Error": "Bad Request"
        })
    }else{
        connection.query(`SELECT * FROM users WHERE login = ?`,login, function(error, results) {
            bcrypt.hash(senha, 10, function(err, hash) {
                const object = {
                    "id": id,
                    "login": login,
                    "senha": hash,
                    "email": email
                }
                if(results.length < 1){
                    connection.query(`INSERT INTO users SET ?`, object, function(error, results) {
                        if(error){
                            return res.status(400).json({
                                "CREATED": false,
                                "error": error
                            })
                        }
                        return res.status(200).json({
                            "CREATED": true
                        })
                    })
                }else{
                    return res.status(400).json({
                        "Error": 'Usuario já cadastrado.'
                    })
                }
            });
        })
    }
}

export {userLogin, newUser, verifyToken};