function newGame() {
    const state = {
        L: 1,
        G: [],
        C: [],
        I: [],
    }

    return state
}


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
    else if (["items","i","inventory"].includes(command)) {command = "items";}
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

    //items command
    if (command === "items") {
        state.I.sort((a, b) => (a - b)); //Sort the list of items by ID
        itemsString = state.I.map(n => itemList[n]).join(", ");
        if (itemsString === "") {return "None";}
        else {return itemsString;}
    }

    let rowObjects = findCommands(command, input);

    rowObjects = rowObjects.filter(row => row.Lq === state.L || row.Lq === 0); //Filters out rows with the wrong location
    rowObjects = rowObjects.filter(row => state.G.includes(row.Gq) || row.Gq === 0); //Filters out rows where they don't have the required Global Condition
    rowObjects = rowObjects.filter(row => state.C.includes(row.Cq) || row.Cq === 0); //Filters out rows where they don't have the required Condition
    rowObjects = rowObjects.filter(row => state.I.includes(row.Iq) || row.Iq === 0); //Filters out rows where they don't have the required Item

    rowObjects.sort((a,b) => b.Pq - a.Pq); //Sorts the rows by priority

    if (rowObjects.length !== 0) {
        result = rowObjects[0];

        if (result.L !== 0) { //Possible Location change
            state.L = result.L;
            
            document.body.style.backgroundColor = mapBackgroundColor[state.L];
            document.getElementById("output-log").style.color = mapTextColor[state.L];
            document.getElementById("text-input").style.borderColor = mapTextColor[state.L];
            document.getElementById("text-input").style.color = mapTextColor[state.L];
        } 
        if (result.G > 0 && !(state.G.includes(result.G))) {state.G.push(result.G);} //Possible Global Condition added
        if (result.G < 0 && (state.G.includes(result.G))) {state.G.filter(g => g !== result.G);} //Possible Global Condition removed
        if (result.C > 0 && !(state.C.includes(result.C))) {state.C.push(result.C);} //Possible Condition added
        if (result.C < 0 && (state.C.includes(result.C))) {state.C.filter(c => c !== result.C);} //Possible Condition removed
        if (result.I > 0 && !(state.I.includes(result.I))) {state.I.push(result.I);} //Possible Item added
        if (result.I < 0 && (state.I.includes(result.I))) {state.I.filter(i => i !== result.I);} //Possible Global Condition removed

        return result.Output;
    }

    //No command found
    if (command === "look") {return "You don't see it.";}
    else if (command === "move") {return "You can't go there.";}
    else if (command === "take") {return "You can't take that.";}
    else if (command === "use") {return "You can't do that.";}
    else if (command === "talk") {return "There's no response.";}
    else if (command === "ask") {return "They have no answer.";}


}


const inputForm = document.getElementById("input-form")
inputForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const input = document.getElementById("text-input").value;
    const inputObject = parseInput(input);

    const output = mapFun(inputObject);

    const outputLog = document.getElementById("output-log");

    const pre = document.createElement("pre");
    pre.textContent = `> ${input}\n${output}`;

    outputLog.append(pre);
    outputLog.scrollTop = outputLog.scrollHeight;

    inputForm.reset(); //Clear the text box

    localStorage.setItem("save",JSON.stringify(state));

})

//Resetting the game
const resetForm = document.getElementById("reset-form")
resetForm.addEventListener("submit", function(event) {
    event.preventDefault();

    state = newGame(); //Reset the state

    document.getElementById("output-log").innerHTML = ""; //Clear output log
    document.getElementById("text-input").focus() //Refocus on text box (so they don't have to click it to type)

    
    localStorage.setItem("save",JSON.stringify(state));
})



// Upon page load
const saveData = localStorage.getItem("save");

let state = saveData !== null ? JSON.parse(saveData) : newGame(); //Ternary operation, either converts the string to an object or gets a new game object

document.body.style.backgroundColor = mapBackgroundColor[state.L];
document.getElementById("output-log").style.color = mapTextColor[state.L];
document.getElementById("text-input").style.borderColor = mapTextColor[state.L];
document.getElementById("text-input").style.color = mapTextColor[state.L];

// TEMPORARY
state.G.push(1);
state.G.push(2);
state.G.push(3);