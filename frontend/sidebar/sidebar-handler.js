const sidebar = document.getElementById("sidebar");
const columnRight = document.getElementsByClassName("column right")[0];


sidebar.addEventListener("mouseenter", () => {
    //console.log("Object: opening sidebar");
    sidebar.style.width = "250px";
    columnRight.style.marginLeft = "250px";
    columnRight.style.width = "calc(100% - 250px)";
});

sidebar.addEventListener("mouseleave", () => {
    //console.log("Object: closing sidebar");
    sidebar.style.width = "85px";
    columnRight.style.marginLeft = "85px";
    columnRight.style.width = "calc(100% - 85px)";
});