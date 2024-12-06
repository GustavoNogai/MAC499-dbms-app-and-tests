const input = document.getElementById("input");
const get = document.getElementById("get");
const post = document.getElementById("post");

const getdb = document.getElementById("getdb");
const txt = document.getElementById("txt");

const form = document.getElementById("form");
const fname = document.getElementById("fname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
const patch = document.getElementById("patch");
const deletar = document.getElementById("delete");

const baseURL = "http://localhost:3000/";

get.addEventListener("click", getInfo);
post.addEventListener("click", postInfo);

getdb.addEventListener("click", getDB);
submit.addEventListener("click", postDB);
patch.addEventListener("click", patchDB);
deletar.addEventListener("click", deleteDB);

async function getDB(e){
    e.preventDefault();
    const res = await fetch(baseURL + "pggetdb", 
        {
            method:"GET"
        }    
    );
    const data = await res.json();
    if (res.ok) {
        console.log("Obtido com sucesso!");
        txt.innerText = "";
        console.log(data.data.rows);
        (data.data.rows).forEach(element => {
            let id = element.id;
            if (id < 10) id = "0" + id;
            txt.innerText += id + ": " + (element.email) + "\n";
        });
    }
    else {
        const data = await res.json();
        console.log("Erro: " + data.error);
    }
}

async function postDB(e){
    e.preventDefault();
    if ((fname.value).replace(/\s+/g,'').length === 0){
        console.log("O campo do nome está vazio ou houve algum erro!");
        form.reset();
        return -1;
    }
    else if ((email.value).replace(/\s+/g,'').length === 0){
        console.log("O campo do email está vazio ou houve algum erro!");
        form.reset();
        return -1;
    }
    else if ((password.value).replace(/\s+/g,'').length === 0){
        console.log("O campo da senha está vazio ou houve algum erro!");
        form.reset();
        return -1;
    }
    const res = await fetch(baseURL + "pgpostdb", 
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
    else if (res.ok) console.log("Inserido com sucesso!");
    else {
        let data = await res.json();
        console.error("Erro: " + data.error);
    }
    form.reset();
}

async function patchDB(e){
    e.preventDefault();
    if ((fname.value).replace(/\s+/g,'').length === 0){
        console.log("O campo do nome está vazio ou houve algum erro!");
        form.reset();
        return -1;
    }
    else if ((email.value).replace(/\s+/g,'').length === 0){
        console.log("O campo do email está vazio ou houve algum erro!");
        form.reset();
        return -1;
    }
    else if ((password.value).replace(/\s+/g,'').length === 0){
        console.log("O campo da senha está vazio ou houve algum erro!");
        form.reset();
        return -1;
    }
    const res = await fetch(baseURL + "pgpatchdb", 
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
    else if (res.ok) console.log("Atualizado com sucesso!");
    else {
        let data = await res.json();
        console.error("Erro: " + data.error);
    }
    form.reset();
}

async function deleteDB(e){
    e.preventDefault();
    if ((email.value).replace(/\s+/g,'').length === 0){
        console.log("O campo do email está vazio ou houve algum erro!");
        form.reset();
        return -1;
    }
    const res = await fetch(baseURL + "pgdeletedb", 
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
    else if (res.ok) console.log("Deletado com sucesso!");
    else {
        let data = await res.json();
        console.error("Erro: " + data.error);
    }
    form.reset();
}

async function postInfo(e){
    e.preventDefault();
    const res = await fetch(baseURL + "post", 
        {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                content: input.value
            })
        }    
    );
    console.log(res);
}

async function getInfo(e){
    e.preventDefault();
    const res = await fetch(baseURL + "get", 
        {
            method:"GET"
        }    
    );
    console.log(res);
    const data = await res.json();
    console.log(data.info);
    input.value = data.info;
}