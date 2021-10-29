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
    const {id} = req.body;
    connection.query(`DELETE FROM items WHERE id=${id}`,function (error, result){
        if(result.affectedRows === 0){
            return res.status(500).json({
                "Error": "Server Internal Error"
            })
        }else{
            return res.status(200).json({
                "Status": "Sucess"
            })
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
                        "Error": "Server Internal Error"
                    })
                }else{
                    return res.status(200).json({
                        "Status": "Sucess"
                    })
                }
            })    
        }else{
            const qtdeBd = result[0].qtde;
            const qtdeUpdate = parseInt(qtdeBd) + parseInt(req.body.qtde);
            connection.query(`UPDATE items SET qtde = '${qtdeUpdate}' WHERE id = '${result[0].id}'`, function(error, result){
                if(result.affectedRows === 0){
                    return res.status(500).json({
                        "Error": "Server Internal Error"
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