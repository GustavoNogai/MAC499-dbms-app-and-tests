var editor = ace.edit("editor");

const queryBtn = document.getElementById("queryBtn");
const txt = document.getElementById("txt");

const form = document.getElementById("form");
const fname = document.getElementById("fname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
const patch = document.getElementById("patch");
const deletar = document.getElementById("delete");
const getdb = document.getElementById("getdb");

const baseURL = "http://localhost:3000/";

getdb.addEventListener("click", getDB);
submit.addEventListener("click", postDB);
patch.addEventListener("click", patchDB);
deletar.addEventListener("click", deleteDB);

queryBtn.addEventListener("click", queryDB);
clearBtn.addEventListener("click", clearOut);

editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/mysql");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableAutoIndent: true,
    fontSize: "16px",
    wrap: true,
    autoScrollEditorIntoView: true,
    placeholder: "Escreva seu código para MySQL aqui!",
});


async function queryDB(e) {
    e.preventDefault();
    let query = editor.getValue();
    let command = (query.split(" ")[0]).toUpperCase();
    const res = await fetch(baseURL + "myquerydb", 
        {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                content: query
            })
        }    
    );
    
    const data = await res.json();
    if (res.headers.has("warning")) {
        console.warn("Aviso: " + res.headers.get("warning"));
    } 
    else if (res.ok) {
        console.log(command + " executado com sucesso!");
        //txt.innerText = JSON.stringify(data.data.rows);

        console.log(res);
        console.log(data);

        if(command === "SELECT" || command === "DESCRIBE" || command === "DESC" || command === "EXPLAIN" || command === "SHOW") {
            if(data.data.length === 0) {
                let queryArray = query.split(" ");
                let fromPos = queryArray.findIndex((element) => element.toUpperCase() === "FROM");
                if (fromPos === -1) {
                    console.log("Erro: Comando " + command + " sem FROM");
                    txt.innerHTML = "<span style='color:#C60C30'>Erro: Comando " + command + " sem FROM </span>";
                    return;
                }
                let tableName = queryArray[fromPos + 1];
                //TODO SHOW columns FROM 'descobrir o nome da tabela';
                let queryAux = "SHOW COLUMNS FROM " + tableName + ";";
                let resAux = await fetch(baseURL + "myquerydb", 
                    {
                        method:"POST",
                        headers: {
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify({
                            content: queryAux
                        })
                    }    
                );
                console.log(resAux);
                if (resAux.ok) {
                    let dataAux = await resAux.json();
                    console.log(dataAux);
                    let colNames = dataAux.data;
                    console.log(colNames)
                    let table = document.createElement('table');
                    let header = document.createElement('tr');
                    header.innerHTML += colNames.map(name => `<th>${name.Field}</th>`).join('');
                    table.appendChild(header);
                    txt.innerHTML = command + " executado com sucesso!<br><br><br>";
                    txt.innerHTML += table.outerHTML;
                    return;
                }
                else {
                    console.log("Erro: " + data.error);
                    txt.innerHTML = "<span style='color:#C60C30'>Erro: " + data.error + "</span>";
                }
                return;
            }

            const keys = Object.keys(data.data); // get the names properly
            console.log(keys)
            const colNames = Object.keys(data.data[keys[0]]); // get all column names
            console.log(colNames)
            // Let's form table and header first
            const table = document.createElement('table');
            const header = document.createElement('tr');
            header.innerHTML += colNames.map(name => `<th>${name}</th>`).join('');
            table.appendChild(header);

            // Now lets append all the rows
            const rows = keys.map((key) => {
              const tr = document.createElement('tr');
              tr.innerHTML += colNames.map(val => `<td>${data.data[key][val]}</td>`).join('');
              return tr;
            });

            rows.forEach(row => table.appendChild(row));

            // render
            txt.innerHTML = command + " executado com sucesso!<br><br><br>";
            txt.innerHTML += table.outerHTML;
        }
        else if(command === null) {
            console.log("Query vazia!\n Nenhum comando foi executado!");
            txt.innerHTML = "Query vazia!<br> Nenhum comando foi executado!";
        }
        else {
            console.log(command + " executado com sucesso!");
            txt.innerHTML = command + " executado com sucesso!";
        }
    }
    else {
        console.log("Erro: " + data.error);
        txt.innerHTML = "<span style='color:#C60C30'>Erro: " + data.error + "</span>";
    }
}


function clearOut(e) {
    e.preventDefault();
    txt.innerHTML = "";
}


async function getDB(e){
    e.preventDefault();
    const res = await fetch(baseURL + "mygetdb", 
        {
            method:"GET"
        }    
    );
    const data = await res.json();
    console.log(data)
    if (res.ok) {
        const keys = Object.keys(data.data); // get the names properly
        console.log(keys)
        const colNames = Object.keys(data.data[keys[0]]); // get all column names
        console.log(colNames)
        // Let's form table and header first
        const table = document.createElement('table');
        const header = document.createElement('tr');
        header.innerHTML += colNames.map(name => `<th>${name}</th>`).join('');
        table.appendChild(header);

        // Now lets append all the rows
        const rows = keys.map((key) => {
          const tr = document.createElement('tr');
          tr.innerHTML += colNames.map(val => `<td>${data.data[key][val]}</td>`).join('');
          return tr;
        });

        rows.forEach(row => table.appendChild(row));

        // render
        txt.innerHTML = `GetDB do Banco de Dados "user" executado com sucesso!<br><br><br>`;
        txt.innerHTML += table.outerHTML;
    }
    else {
        const data = await res.json();
        console.log("Erro: " + data.error);
        txt.innerHTML = "<span style='color:#C60C30'>Erro: " + data.error + "</span>";
    }
}

async function postDB(e){
    e.preventDefault();
    if ((email.value).replace(/\s+/g,'').length === 0){
        console.log("O campo do email está vazio ou houve algum erro!");
        form.reset();
        email.placeholder = "Este campo é obrigatório!";
        return -1;
    }
    const res = await fetch(baseURL + "mypostdb", 
        {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                content: {
                    nome: fname.value,
                    email: email.value,
                    senha: password.value
                }
            })
        }    
    )
    if (res.headers.has("warning")) {
        //let data = await res.json();
        console.warn("Aviso: " + res.headers.get("warning"));
    } 
    else if (res.ok) {
        console.log("Inserido com sucesso!");
        txt.innerHTML = "Inserido com sucesso!";
    }
    else {
        let data = await res.json();
        console.error("Erro: " + data.error);
        txt.innerHTML = "<span style='color:#C60C30'>Erro: " + data.error + "</span>";
    }
    form.reset();
}

async function patchDB(e){
    e.preventDefault();
    if ((email.value).replace(/\s+/g,'').length === 0){
        console.log("O campo do email está vazio ou houve algum erro!");
        form.reset();
        email.placeholder = "Este campo é obrigatório!";
        return -1;
    }
    const res = await fetch(baseURL + "mypatchdb", 
        {
            method:"PATCH",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                content: {
                    nome: fname.value,
                    email: email.value,
                    senha: password.value
                }
            })
        }    
    )
    if (res.headers.has("warning")) {
        //let data = await res.json();
        console.warn("Aviso: " + res.headers.get("warning"));
    } 
    else if (res.ok) {
        console.log("Atualizado com sucesso!");
        txt.innerHTML = "Atualizado com sucesso!";
    }
    else {
        let data = await res.json();
        console.error("Erro: " + data.error);
        txt.innerHTML = "<span style='color:#C60C30'>Erro: " + data.error + "</span>";
    }
    form.reset();
}

async function deleteDB(e){
    e.preventDefault();
    if ((email.value).replace(/\s+/g,'').length === 0){
        console.log("O campo do email está vazio ou houve algum erro!");
        form.reset();
        email.placeholder = "Este campo é obrigatório!";
        return -1;
    }
    const res = await fetch(baseURL + "mydeletedb", 
        {
            method:"DELETE",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                content: {
                    email: email.value
                }
            })
        }    
    )
    if (res.headers.has("warning")) {
        //let data = await res.json();
        console.warn("Aviso: " + res.headers.get("warning"));
    } 
    else if (res.ok) {
        console.log("Deletado com sucesso!");
        txt.innerHTML = "Deletado com sucesso!";
    }
    else {
        let data = await res.json();
        console.error("Erro: " + data.error);
        txt.innerHTML = "<span style='color:#C60C30'>Erro: " + data.error + "</span>";
    }
    form.reset();
}