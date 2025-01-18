import express from "express";
import path from "path";
import { fileURLToPath } from "url";

//var { pool } = require("./database.js");
import { pgGetUser, pgInsertUser, pgPatchUser, pgDeleteUser, pgQuery, myGetUser, myInsertUser, myPatchUser, myDeleteUser, myQuery } from "./database.js";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + '/../frontend'));
app.use(express.json());
app.set("json spaces", 2);


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get("/pggetdb", async (req, res) => {
    try {
        let rows = await pgGetUser();
        res.status(200).json({
            status: "recieved",
            data: rows
        });
        console.log("Server:\n  Postgres: Sucesso no getdb!" + "\n");
    } catch (err) {
        console.log("Server:\n  Postgres: Erro no getdb!\n    Erro: " + err.message + "\n");
        res.status(400).json({ error: err.message });
    }
});

app.post("/pgpostdb", async function (req, res) {
    const { content } = req.body;
    console.log("Server:\n  Postgres: Email: " + content.email + "\n");
    try {
        let id = await pgInsertUser(content);
        console.log("Server:\n  Postgres: Sucesso no postdb!\n    Id da linha inserida: " + id + "\n");
        res.status(200).json({ status: "posted" });
    } catch (err) {
        if (err.name === "InputError") {
            console.warn("Server:\n  Postgres: Aviso:\n    " + err.message + "\n");
            res.header("warning", err.message);
            res.status(200).json({ "warning": err.message });
        }
        else {
            console.error("Server:\n  Postgres: Erro no postdb!\n    Erro: " + err.message + "\n");
            res.status(400).json({ "error": err.message });
        }
    }
});

app.patch("/pgpatchdb", async function (req, res) {
    const { content } = req.body;
    console.log("Server:\n  Postgres: Email: " + content.email + "\n");
    try {
        let changes = await pgPatchUser(content);
        console.log("Server:\n  Postgres: Sucesso no patchdb!\n    Número de linha(s) alterada(s): " + changes + "\n");
        res.status(200).json({ status: "patched" });
    } catch (err) {
        if (err.name === "InputError") {
            console.warn("Server:\n  Postgres: Aviso:\n    " + err.message + "\n");
            res.header("warning", err.message);
            res.status(200).json({ "warning": err.message });
        }
        else {
            console.error("Server:\n  Postgres: Erro no patchdb!\n    Erro: " + err.message + "\n");
            res.status(400).json({ "error": err.message });
        }
    }
});

app.delete("/pgdeletedb", async function (req, res) {
    const { content } = req.body;
    console.log("Server:\n  Postgres: Email: " + content.email + "\n");
    try {
        let changes = await pgDeleteUser(content);
        console.log("Server:\n  Postgres: Sucesso no deletedb!\n    Número de linha(s) deletada(s): " + changes + "\n");
        res.status(200).json({ status: "deleted" });
    } catch (err) {
        if (err.name === "InputError") {
            console.warn("Server:\n  Postgres: Aviso:\n    " + err.message + "\n");
            res.header("warning", err.message);
            res.status(200).json({ "warning": err.message });
        }
        else {
            console.error("Server:\n  Postgres: Erro no deletedb!\n    Erro: " + err.message + "\n");
            res.status(400).json({ "error": err.message });
        }
    }
});

app.post("/pgquerydb", async function (req, res) {
    const { content } = req.body;
    console.log("Server:\n  Postgres: Query: " + content + "\n");
    try {
        let rows = await pgQuery(content);
        res.status(200).json({
            status: "recieved",
            data: rows
        });
        console.log("Server:\n  Postgres: Sucesso no querydb!" + "\n");
    } catch (err) {
        console.log("Server:\n  Postgres: Erro no querydb!\n    Erro: " + err.message + "\n");
        res.status(400).json({ error: err.message });
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get("/mygetdb", async (req, res) => {
    try {
        let rows = await myGetUser();
        res.status(200).json({
            status: "recieved",
            data: rows
        });
        console.log("Server:\n  MySQL: Sucesso no getdb!" + "\n");
    } catch (err) {
        console.log("Server:\n  MySQL: Erro no getdb!\n    Erro: " + err.message + "\n");
        res.status(400).json({ error: err.message });
    }
});

app.post("/mypostdb", async function (req, res) {
    const { content } = req.body;
    console.log("Server:\n  MySQL: Email: " + content.email + "\n");
    try {
        let id = await myInsertUser(content);
        console.log("Server:\n  MySQL: Sucesso no postdb!\n    Id da linha inserida: " + id + "\n");
        res.status(200).json({ status: "posted" });
    } catch (err) {
        if (err.name === "InputError") {
            console.warn("Server:\n  MySQL: Aviso:\n    " + err.message + "\n");
            res.header("warning", err.message);
            res.status(200).json({ "warning": err.message });
        }
        else {
            console.error("Server:\n  MySQL: Erro no postdb!\n    Erro: " + err.message + "\n");
            res.status(400).json({ "error": err.message });
        }
    }
});

app.patch("/mypatchdb", async function (req, res) {
    const { content } = req.body;
    console.log("Server:\n  MySQL: Email: " + content.email + "\n");
    try {
        let changes = await myPatchUser(content);
        console.log("Server:\n  MySQL: Sucesso no patchdb!\n    Número de linha(s) alterada(s): " + changes + "\n");
        res.status(200).json({ status: "patched" });
    } catch (err) {
        if (err.name === "InputError") {
            console.warn("Server:\n  MySQL: Aviso:\n    " + err.message + "\n");
            res.header("warning", err.message);
            res.status(200).json({ "warning": err.message });
        }
        else {
            console.error("Server:\n  MySQL: Erro no patchdb!\n    Erro: " + err.message + "\n");
            res.status(400).json({ "error": err.message });
        }
    }
});

app.delete("/mydeletedb", async function (req, res) {
    const { content } = req.body;
    console.log("Server:\n  MySQL: Email: " + content.email + "\n");
    try {
        let changes = await myDeleteUser(content);
        console.log("Server:\n  MySQL: Sucesso no deletedb!\n    Número de linha(s) deletada(s): " + changes + "\n");
        res.status(200).json({ status: "deleted" });
    } catch (err) {
        if (err.name === "InputError") {
            console.warn("Server:\n  MySQL: Aviso:\n    " + err.message + "\n");
            res.header("warning", err.message);
            res.status(200).json({ "warning": err.message });
        }
        else {
            console.error("Server:\n  MySQL: Erro no deletedb!\n    Erro: " + err.message + "\n");
            res.status(400).json({ "error": err.message });
        }
    }
});

app.post("/myquerydb", async function (req, res) {
    const { content } = req.body;
    console.log("Server:\n  MySQL: Query: " + content + "\n");
    try {
        let rows = await myQuery(content);
        res.status(200).json({
            status: "recieved",
            data: rows
        });
        console.log("Server:\n  MySQL: Sucesso no querydb!" + "\n");
    } catch (err) {
        console.log("Server:\n  MySQL: Erro no querydb!\n    Erro: " + err.message + "\n");
        res.status(400).json({ error: err.message });
    }
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get("/get", function (req, res) {
    res.status(200).json({ info: "Teste GET!" });
});

app.post("/post", function (req, res) {
    const { content } = req.body;
    console.log(content);
    res.status(200).json({ status: "recieved" });
});

app.get("/", function (req, res) {
    console.log(path.join(__dirname, '../frontend/index/index.html' + "\n"));
    res.sendFile(path.join(__dirname, '../frontend/index/index.html'));
});

var server = app.listen(port, function () {
    console.log(`Listening on port ${port}!` + "\n");
});

process.on("SIGINT", function () {
    console.log("\nServer:\n  Encerrando o servidor...\n");
    server.close(function () {
        console.log("Server:\n  Servidor encerrado!\n");
        process.exit(0);
    });
});

process.on("SIGQUIT", function () {
    console.log("\nServer:\n  Encerrando o servidor...\n");
    server.close(function () {
        console.log("Server:\n  Servidor encerrado!\n");
        process.exit(0);
    });
});

process.on("SIGTERM", function () {
    console.log("\nServer:\n  Encerrando o servidor...\n");
    server.close(function () {
        console.log("Server:\n  Servidor encerrado!\n");
        process.exit(0);
    });
});