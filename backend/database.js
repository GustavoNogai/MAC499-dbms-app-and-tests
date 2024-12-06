import pg from "pg";
import mysql from "mysql2";

const { Pool, Client } = pg;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var pgClient = new Client({
    host: "localhost",
    user: "postgres",
    password: "postgres"
});

var pgPool = new Pool({
    database: "teste_postgres", // Banco de dados que será criado pelo pgClient
    host: "localhost",
    user: "postgres",
    password: "postgres",
    keepAlive: true,
    idleTimeoutMillis: 100000
});


var myClient = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
});

var myPool = mysql.createPool({
    database: "teste_mysql", // Banco de dados que será criado pelo myClient
    host: "localhost",
    user: "root",
    password: "root",
    enableKeepAlive: true,
    idleTimeout: 100000
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


await pgClient.connect()
    .then(() => {
        console.log("PostgreSQL: Conexão inicial estabelecida!\n");
    })
    .catch((err) => {
        return console.error("PostgreSQL: Erro na conexão inicial: " + err.message + "\n");
    })

let pgDropDB = "DROP DATABASE IF EXISTS teste_postgres";
await pgClient.query(pgDropDB)
    .then(() => {
        console.log("PostgreSQL: Banco de dados excluído ou inexistente!\n");
    })
    .catch((err) => {
        return console.error("PostgreSQL: Erro ao excluir o banco de dados: " + err.message + "\n");
    })

let pgCreateDB = "CREATE DATABASE teste_postgres";
await pgClient.query(pgCreateDB)
    .then(() => {
        console.log("PostgreSQL: Banco de dados criado!\n");
    })
    .catch((err) => {
        return console.error("PostgreSQL: Erro ao criar o banco de dados: " + err.message + "\n");
    })

await pgClient.end()


pgPool.connect(async (err, client) => {
    if (err) {
        return console.error("PostgreSQL: Erro ao conectar: " + err.message + "\n");
    }
    console.log("PostgreSQL: Conexão estabelecida!\n");

    let createTable = `CREATE TABLE IF NOT EXISTS test (
                          id serial PRIMARY KEY,
                          name TEXT, 
                          email VARCHAR(255) UNIQUE, 
                          password TEXT
                          )`;
    let insert = "INSERT INTO test (name, email, password) VALUES ($1, $2, $3)";
    
    try {
        await client.query(createTable);
        console.log("PostgreSQL: Tabela criada!\n");

        await client.query(insert, ["admin", "admin3@example.com", "admin123456"]);
        console.log("PostgreSQL: Primeiros dados inseridos!\n");

        await client.query(insert, ["user", "user3@example.com", "user123456"]);
        console.log("PostgreSQL: Segundos dados inseridos!\n");

    } catch (err) {
        console.error("PostgreSQL: Erro ao criar a tabela ou ao inserir dados: " + err.message + "\n");
    }

    client.release();
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


myClient.connect((err) => {
    if (err) {
        return console.error("MySQL: Erro na conexão inicial: " + err.message + "\n");
    }
    console.log("MySQL: Conexão inicial estabelecida!\n");
});

let myDropDB = "DROP DATABASE IF EXISTS teste_mysql";
myClient.query(myDropDB, (err) => {
    if (err) {
        return console.error("MySQL: Erro ao excluir o banco de dados: " + err.message + "\n");
    }
    console.log("MySQL: Banco de dados excluído ou inexistente!\n");
});

let myCreateDB = "CREATE DATABASE teste_mysql";
myClient.query(myCreateDB, (err) => {
    if (err) {
        return console.error("MySQL: Erro ao criar o banco de dados: " + err.message + "\n");
    }
    else {
        console.log("MySQL: Banco de dados criado!\n");
        myPool.getConnection(function(err, connection) {
            if (err) {
                return console.error("MySQL: Erro ao conectar: " + err.message + "\n");
            }
            console.log("MySQL: Conexão estabelecida!\n");
        
            let createTable = `CREATE TABLE IF NOT EXISTS user (
                                  id INTEGER AUTO_INCREMENT,
                                  name text, 
                                  email VARCHAR(255) UNIQUE, 
                                  password text, 
                                  PRIMARY KEY (id),
                                  CONSTRAINT email_unique UNIQUE (email)
                                  )`;
            let insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
            connection.query(createTable, (err) => {
                        if (err) {
                            return console.error("MySQL: Erro ao criar a tabela: " + err.message + "\n");
                        }
                        else {
                            try {
                                connection.query(insert, ["admin","admin3@example.com", "admin123456"]);
                                connection.query(insert, ["user","user3@example.com", "user123456"]);
                                console.log("MySQL: Dados inseridos!\n");
                                
                            } catch (err) {
                                return console.error("MySQL: Erro ao inserir dados: " + err.message + "\n");
                            }
                        }
                    }
            );
            connection.release();
        });
    }
});

myClient.end();


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export let pgGetUser = () => {
    console.log("Postgres Database:");
    let get = "SELECT * FROM test";
    var params = [];
    return new Promise((resolve, reject) => {
        pgPool.query(get, params, function (err, rows){
            if (err) {
                console.error("  Postgres: Erro ao fornecer o bd: " + err.message + "\n");
                reject(err);
            }
            else {
                console.log("  Postgres: Fornecido com sucesso!\n");
                resolve(rows);
            }
        });
    });
};

export let pgInsertUser = (dados) => {
    console.log("Postgres Database:");
    let insert = "INSERT INTO test (name, email, password) VALUES ($1, $2, $3) RETURNING *";
    return new Promise((resolve, reject) => {
        pgPool.query(insert, [dados.nome, dados.email, dados.senha], function (err, result){
            if (err){
                console.error("  Postgres: Erro ao inserir no bd: " + err.message + "\n");
                reject(err);
            }
            else if (result.rowCount === 0){
                console.warn("  Postgres: Aviso:\n    Tentativa de inserir no bd resultou em 0 alterações!\n");
                let myError = new Error("Postgres: Nenhuma linha foi inserida, favor checar o email fornecido!");
                myError.name = "InputError";
                reject(myError);
            }
            else {
                console.log("  Postgres: Inserido com sucesso!\n    " + `Id da linha inserida: ${result.rows[0].id}\n`);
                resolve(result.rows[0].id);
            }
        });
    });
};

export let pgPatchUser = (dados) => {
    console.log("Postgres Database:");
    let patch = "UPDATE test SET name = $1, password = $2 WHERE email = $3 RETURNING *";
    return new Promise((resolve, reject) => {
        pgPool.query(patch, [dados.nome, dados.senha, dados.email], function (err, result){
            if (err){
                console.error("  Postgres: Erro ao atualizar o bd: " + err.message + "\n");
                reject(err);
            }
            else if (result.rowCount === 0){
                console.warn("  Postgres: Aviso:\n    Tentativa de atualizar bd resultou em 0 alterações!\n");
                const myError = new Error("Postgres: Nenhuma linha foi atualizada, favor checar o email fornecido!");
                myError.name = "InputError";
                reject(myError);
            }
            else {
                console.log("  Postgres: Atualizada com sucesso!\n    " + `Linha(s) atualizadas: ${result.rowCount}\n`);
                resolve(result.rowCount);
            }
        });
    });
};

export let pgDeleteUser = (dados) => {
    console.log("Postgres Database:");
    let deletar = "DELETE FROM test WHERE email = $1 RETURNING *";
    return new Promise((resolve, reject) => {
        pgPool.query(deletar, [dados.email], function (err, result){
            if (err){
                console.error("  Postgres: Erro ao deletar linha no bd: " + err.message + "\n");
                reject(err);
            }
            else if (result.rowCount === 0){
                console.warn("  Postgres: Aviso:\n    Tentativa de deletar no bd resultou em 0 alterações!\n");
                const myError = new Error("Postgres: Nenhuma linha foi deletada, favor checar o email fornecido!");
                myError.name = "InputError";
                reject(myError);
            }
            else {
                console.log("  Postgres: Deletado com sucesso!\n    " + `Linha(s) deletada(s): ${result.rowCount}\n`);
                resolve(result.rowCount);
            }
        });
    });
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export let myGetUser = () => {
    console.log("MySQL Database:");
    let get = "SELECT * FROM user";
    var params = [];
    return new Promise((resolve, reject) => {
        myPool.query(get, params, function (err, rows){
            if (err) {
                console.error("  MySQL: Erro ao fornecer o bd: " + err.message + "\n");
                reject(err);
            }
            else {
                console.log("  MySQL: Fornecido com sucesso!\n");
                resolve(rows);
            }
        });
    });
};

export let myInsertUser = (dados) => {
    console.log("MySQL Database:");
    let insert = "INSERT INTO user (name, email, password) VALUES (?,?,?)";
    return new Promise((resolve, reject) => {
        myPool.query(insert, [dados.nome, dados.email, dados.senha], function (err, result){
            if (err){
                console.error("  MySQL: Erro ao inserir no bd: " + err.message + "\n");
                reject(err);
            }
            else if (result.affectedRows === 0){
                console.warn("  MySQL: Aviso:\n    Tentativa de inserir no bd resultou em 0 alterações!\n");
                let myError = new Error("MySQL: Nenhuma linha foi inserida, favor checar o email fornecido!");
                myError.name = "InputError";
                reject(myError);
            }
            else {
                console.log("  MySQL: Inserido com sucesso!\n    " + `Id da linha inserida: ${result.insertId}\n`);
                resolve(result.insertId);
            }
        });
    });
};

export let myPatchUser = (dados) => {
    console.log("MySQL Database:");
    let patch = "UPDATE user SET name = ?, password = ? WHERE email = ?";
    return new Promise((resolve, reject) => {
        myPool.query(patch, [dados.nome, dados.senha, dados.email], function (err, result){
            if (err){
                console.error("  MySQL: Erro ao atualizar o bd: " + err.message + "\n");
                reject(err);
            }
            else if (result.affectedRows === 0){
                console.warn("  MySQL: Aviso:\n    Tentativa de atualizar bd resultou em 0 alterações!\n");
                const myError = new Error("MySQL: Nenhuma linha foi atualizada, favor checar o email fornecido!");
                myError.name = "InputError";
                reject(myError);
            }
            else {
                console.log("  MySQL: Atualizada com sucesso!\n    " + `Linha(s) atualizadas: ${result.affectedRows}\n`);
                resolve(result.affectedRows);
            }
        });
    });
};

export let myDeleteUser = (dados) => {
    console.log("MySQL Database:");
    let deletar = "DELETE FROM user WHERE email = ?";
    return new Promise((resolve, reject) => {
        myPool.query(deletar, [dados.email], function (err, result){
            if (err){
                console.error("  MySQL: Erro ao deletar linha no bd: " + err.message + "\n");
                reject(err);
            }
            else if (result.affectedRows === 0){
                console.warn("  MySQL: Aviso:\n    Tentativa de deletar no bd resultou em 0 alterações!\n");
                const myError = new Error("MySQL: Nenhuma linha foi deletada, favor checar o email fornecido!");
                myError.name = "InputError";
                reject(myError);
            }
            else {
                console.log("  MySQL: Deletado com sucesso!\n    " + `Linha(s) deletada(s): ${result.affectedRows}\n`);
                resolve(result.affectedRows);
            }
        });
    });
};


/*let db = new sqlite3.Database(DBSOURCE, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message);
      throw err;
    }
    else {
        console.log('Connected to the SQlite database.')
        myPool.query(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,(err) => {
                if (err) {
                    return console.log(err.message);
                }else{
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
                    myPool.query(insert, ["admin","admin@example.com","admin123456"])
                    myPool.query(insert, ["user","user@example.com","user123456"])
                }
            }
        );
        db.close();
    }
})*/


/*
module.exports = {
    pgPool,
    myPool,
    getUser,
    insertUser,
    patchUser,
    deleteUser
}

module.exports.pgPool = pgPool;

module.exports.myPool = myPool;

module.exports.getUser = getUser;

module.exports.insertUser = insertUser;

module.exports.patchUser = patchUser;

module.exports.deleteUser = deleteUser;*/
