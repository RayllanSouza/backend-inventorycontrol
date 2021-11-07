import { connection } from "./crud.controllers.js";

function createDB(){
    connection.query("CREATE DATABASE IF NOT EXISTS `controledeestoque`", function (err, result) {  
        if (err) throw err;  
        console.log("Base de dados Controleestoque verificada");
        connection.query("USE `controledeestoque`",function (err, result) {  
            connection.query("CREATE TABLE IF NOT EXISTS `items`(`id` int(11) NOT NULL, `nome` varchar(255) NOT NULL, `modelo` varchar(255) NOT NULL, `garantia` tinyint(1) NOT NULL, `qtde` int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", function (err, result) {  
                if (err) throw err;  
                console.log("Database ITEM verificada");  
            }); 
            connection.query("CREATE TABLE IF NOT EXISTS `logs_added`(`id` int(11) NOT NULL, `Acao` varchar(255) NOT NULL, `Agente` varchar(255) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", function (err, result) {  
                if (err) throw err;  
                console.log("Database logs_added verificada");  
            });
            connection.query("CREATE TABLE IF NOT EXISTS `logs_removed` (`id` int(11) NOT NULL, `Acao` varchar(255) NOT NULL, `Agente` varchar(255) NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", function (err, result) {  
                if (err) throw err;  
                console.log("Database logs_removed verificada");  
            });
            connection.query("CREATE TABLE IF NOT EXISTS `users` (`ID` varchar(255) NOT NULL, `login` varchar(255) NOT NULL, `senha` varchar(255) NOT NULL, `email` varchar(255) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", function (err, result) {  
                if (err) throw err;  
                console.log("Database users verificada");  
            }); 
        })
    }); 
}

export default createDB;