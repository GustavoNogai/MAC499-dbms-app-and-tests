var editor = ace.edit("editor");

const log = document.getElementById("log");

editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/pgsql");
//editor.session.setMode("ace/mode/mysql");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableAutoIndent: true,
    fontSize: "14px",
    wrap: true,
    autoScrollEditorIntoView: true,
    placeholder: "Insira o código aqui...",
});

log.addEventListener("click", () => {
    console.log(editor.getValue());
});