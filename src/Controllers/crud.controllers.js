import mysql from 'mysql';
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ControleDeEstoque'
})

connection.connect();

function showItems(req, res) {
    connection.query('SELECT * FROM items', function(error, results){
        if(error){
            throw error;
        }
        res.status(200).json(results);
    })
}

function removeItem(req, res) {
    const {id, qtde, user} = req.body;    
    connection.query(`SELECT * FROM items WHERE id=${id}`, function (error, result){
        if(result.length <= 0){
            return res.status(500).json({
                "Error": "Item nao encontrado!"
            })
        }else{
            const nomeItem = result[0].nome;
            const qtdeBD = result[0].qtde;
            const qtdeRemove = parseInt(qtdeBD) - parseInt(qtde);
            if(qtdeRemove < 0){
                return res.status(400).json({
                    "Error": "Voce nao pode retirar essa quantidade, pois nao há no estoque."
                })
            }else if(qtdeRemove === 0){
                connection.query(`DELETE FROM items WHERE id=${id}`,function (error, result){
                    if(result.affectedRows === 0){
                        return res.status(500).json({
                            "Error": "Server Internal Error"
                        })
                    }else{
                        const log = {
                            Acao: `Removeu ${qtde} de ${nomeItem}`,
                            Agente: user
                        }
                        connection.query(`INSERT INTO logs SET ?`, log ,function (error, result){
                            return res.status(200).json({
                                "Status": "Item Removido"
                            })
                        })
                    }
                })    
            }else{
                connection.query(`UPDATE items SET qtde = '${qtdeRemove}' WHERE id = '${result[0].id}'`,function (error, result){
                    if(result.affectedRows === 0){
                        return res.status(500).json({
                            "Error": "Não foi possivel atualizar item!"
                        })
                    }else{
                        const log = {
                            Acao: `Removeu ${qtde} de ${nomeItem}`,
                            Agente: user
                        }
                        connection.query(`INSERT INTO logs SET ?`, log ,function (error, result){
                            return res.status(200).json({
                                "Status": "Qtde Atualizada!",
                                "newQtde": qtdeRemove
                            })
                        })
                    }
                })    
            }
        }
    })

}

function addItem(req, res){
    const item = req.body;
    connection.query(`SELECT * FROM items WHERE nome = '${req.body.nome}' AND modelo = '${req.body.modelo}'`, function (error, result) {
        if(result.length < 1){
            connection.query(`INSERT INTO items SET ?`, item ,function (error, result){
                if(result.affectedRows === 0){
                    return res.status(500).json({
                        "Error": "Não foi possivel adicionar item!"
                    })
                }else{
                    return res.status(200).json({
                        "Status": "Item Adicionado!"
                    })
                }
            })    
        }else{
            const qtdeBd = result[0].qtde;
            const qtdeUpdate = parseInt(qtdeBd) + parseInt(req.body.qtde);
            connection.query(`UPDATE items SET qtde = '${qtdeUpdate}' WHERE id = '${result[0].id}'`, function(error, result){
                if(result.affectedRows === 0){
                    return res.status(500).json({
                        "Error": "Não foi possivel atualizar item"
                    })
                }else{
                    return res.status(200).json({
                        "Status": "Item Atualizado"
                    })
                }
            })
        }
    })
    
}

export {removeItem, showItems, addItem, connection};