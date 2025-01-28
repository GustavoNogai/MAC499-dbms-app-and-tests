const sidebar = document.getElementById("sidebar");
const columnRight = document.getElementsByClassName("column right")[0];

// Aumenta a barra lateral e diminui a tela principal ao passar o mouse para dentro
sidebar.addEventListener("mouseenter", () => {
    //console.log("Object: opening sidebar");
    sidebar.style.width = "250px";
    columnRight.style.marginLeft = "250px";
    columnRight.style.width = "calc(100% - 250px)";
});

// Diminui a barra lateral e aumenta a tela principal ao passar o mouse para fora
sidebar.addEventListener("mouseleave", () => {
    //console.log("Object: closing sidebar");
    sidebar.style.width = "85px";
    columnRight.style.marginLeft = "85px";
    columnRight.style.width = "calc(100% - 85px)";
});