function findCommands(command, input) {

    const outputs = map.filter(
        row => row.Command === command && row.Input === input
    );

    return outputs;
}


function parseInput(text) {
    const parts = text.split(" ");
    let command = parts[0];
    let input = parts.slice(1).join(" ");

    command = command.toLowerCase();
    if (["look","l","x","watch","observe","stare","gaze","scan","inspect","study"].includes(command)) {command = "look";}
    else if (["move","m","walk","run","go","climb","jump","enter","step"].includes(command)) {command = "move";}
    else if (["take","t","grab","get"].includes(command)) {command = "take";}
    else if (["use","u","utilize","apply"].includes(command)) {command = "use";}
    else if (["talk"].includes(command)) {command = "talk";}
    else if (["ask","a","question","query"].includes(command)) {command = "ask";}
    //!!! Add check for inventory command, and possibly admin commands
    else {command = "none";}


    input = input.toLowerCase();
    if (input === "") {input = "-"}

    return {
        command: command,
        input: input
    };
}


function mapFun(inputObject) {
    const command = inputObject.command;
    const input = inputObject.input;

    if (command === "none") {return "That is not a valid command.";}

    const rowObjects = findCommands(command, input);

    if (rowObjects.length > 0) {
        return rowObjects[0].Output;
    }

    //No command found
    if (command === "look") {return "You don't see it.";}
    else if (command === "move") {return "You can't go there.";}
    else if (command === "take") {return "You can't take that.";}
    else if (command === "use") {return "You can't do that.";}
    else if (command === "talk") {return "There's no response.";}
    else if (command === "ask") {return "They have no answer.";}


}


const form = document.getElementById("input-form")
form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const input = document.getElementById("text-input").value;
    const inputObject = parseInput(input); //!!! Add input safety checks. Did they submit an actual command? Did they even use a space? Inventory?

    const output = mapFun(inputObject);

    const outputLog = document.getElementById("output-log");

    const pre = document.createElement("pre");
    pre.textContent = `${input}\n${output}`;

    outputLog.append(pre);

    form.reset();

})