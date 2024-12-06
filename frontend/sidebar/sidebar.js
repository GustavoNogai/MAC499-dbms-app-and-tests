const sidebar = document.getElementById("mySidebar");

sidebar.addEventListener("mouseenter", () => {
    //console.log("Opening sidebar");
    sidebar.style.width = "250px";
});

sidebar.addEventListener("mouseleave", () => {
    //console.log("Closing sidebar");
    sidebar.style.width = "85px";
});