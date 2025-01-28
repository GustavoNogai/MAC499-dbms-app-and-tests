const sidebar = document.getElementById("mySidebar");

// Aumenta a barra lateral ao passar o mouse para dentro
sidebar.addEventListener("mouseenter", () => {
    //console.log("Opening sidebar");
    sidebar.style.width = "250px";
});

// Diminui a barra lateral ao passar o mouse para fora
sidebar.addEventListener("mouseleave", () => {
    //console.log("Closing sidebar");
    sidebar.style.width = "85px";
});