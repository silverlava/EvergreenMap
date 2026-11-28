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
    else if (["tp"].includes(command)) {command = "tp";}
    else {command = "none";}


    input = input.toLowerCase();
    if (input === "") {input = "-"}

    return {
        command: command,
        input: input
    };
}

function formatOutput(output) {
    const fragment = document.createDocumentFragment();
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;

    let lastIndex = 0;

    for (const match of output.matchAll(regex)) {
        fragment.append(output.slice(lastIndex, match.index));

        const element = document.createElement(
            match[2] !== undefined ? "strong" : "em"
        );

        element.textContent = match[2] ?? match[3];
        fragment.append(element);

        lastIndex = match.index + match[0].length;
    }

    fragment.append(output.slice(lastIndex));

    return fragment;
}

function setBackgroundColor(L) {
    document.body.style.backgroundColor = mapBackgroundColor[L];
    document.getElementById("output-log").style.color = mapTextColor[L];
    document.getElementById("text-input").style.borderColor = mapTextColor[L];
    document.getElementById("text-input").style.color = mapTextColor[L];
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

    //tp command
    if (command === "tp") {
        const n = Number(input);
        if (Number.isInteger(n) && n >= 1 && n <= 63) {
            state.L = n;
            setBackgroundColor(state.L);
            return `Teleported to Location ${n}.`;
        }
        else {return "That is not a valid location."}
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
            setBackgroundColor(state.L);
        }
        if (result.G > 0 && !(state.G.includes(result.G))) {state.G.push(result.G);} //Possible Global Condition added
        if (result.G < 0 && (state.G.includes(-result.G))) {state.G = state.G.filter(g => g !== -result.G);} //Possible Global Condition removed
        if (result.C > 0 && !(state.C.includes(result.C))) {state.C.push(result.C);} //Possible Condition added
        if (result.C < 0 && (state.C.includes(-result.C))) {state.C = state.C.filter(c => c !== -result.C);} //Possible Condition removed
        if (result.I > 0 && !(state.I.includes(result.I))) {state.I.push(result.I);} //Possible Item added
        if (result.I < 0 && (state.I.includes(-result.I))) {state.I = state.I.filter(i => i !== -result.I);} //Possible Item removed

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


const inputForm = document.getElementById("input-form");
inputForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const input = document.getElementById("text-input").value;
    const inputObject = parseInput(input);

    const output = mapFun(inputObject);

    const outputLog = document.getElementById("output-log");

    const pre = document.createElement("pre");
    pre.append(`> ${input}\n`);
    pre.append(formatOutput(output));

    outputLog.append(pre);
    outputLog.scrollTop = outputLog.scrollHeight;

    inputForm.reset(); //Clear the text box
    document.getElementById("text-input").placeholder = ""; //Remove "look" placeholder

    localStorage.setItem("save",JSON.stringify(state));

})

//Resetting the game
const resetForm = document.getElementById("reset-form");
resetForm.addEventListener("submit", function(event) {
    event.preventDefault();

    state = newGame(); //Reset the state

    document.getElementById("output-log").innerHTML = ""; //Clear output log
    document.getElementById("text-input").focus() //Refocus on text box (so they don't have to click it to type)

    setBackgroundColor(state.L);

    document.getElementById("text-input").placeholder = "look"; //Add "look" placeholder

    localStorage.setItem("save",JSON.stringify(state));
})

//Expansion 0 Button
const expansion0Form = document.getElementById("expansion-0-form");
expansion0Form.addEventListener("submit", function(event){
    event.preventDefault();

    state.G = state.G.filter(g => g !== 1);
    state.G = state.G.filter(g => g !== 2);
    state.G = state.G.filter(g => g !== 3);

    const outputLog = document.getElementById("output-log");
    const pre = document.createElement("pre");
    pre.textContent = `Set map to no expansions.`;
    outputLog.append(pre);
    outputLog.scrollTop = outputLog.scrollHeight;

    document.getElementById("text-input").focus() //Refocus on text box
})

//Expansion 1 Button
const expansion1Form = document.getElementById("expansion-1-form");
expansion1Form.addEventListener("submit", function(event){
    event.preventDefault();

    if (!state.G.includes(1)) {state.G.push(1);}
    state.G = state.G.filter(g => g !== 2);
    state.G = state.G.filter(g => g !== 3);

    const outputLog = document.getElementById("output-log");
    const pre = document.createElement("pre");
    pre.textContent = `Set map to expansion 1.`;
    outputLog.append(pre);
    outputLog.scrollTop = outputLog.scrollHeight;

    document.getElementById("text-input").focus() //Refocus on text box
})

//Expansion 2 Button
const expansion2Form = document.getElementById("expansion-2-form");
expansion2Form.addEventListener("submit", function(event){
    event.preventDefault();

    if (!state.G.includes(1)) {state.G.push(1);}
    if (!state.G.includes(2)) {state.G.push(2);}
    state.G = state.G.filter(g => g !== 3);

    const outputLog = document.getElementById("output-log");
    const pre = document.createElement("pre");
    pre.textContent = `Set map to expansion 2.`;
    outputLog.append(pre);
    outputLog.scrollTop = outputLog.scrollHeight;

    document.getElementById("text-input").focus() //Refocus on text box
})

//Expansion 3 Button
const expansion3Form = document.getElementById("expansion-3-form");
expansion3Form.addEventListener("submit", function(event){
    event.preventDefault();

    if (!state.G.includes(1)) {state.G.push(1);}
    if (!state.G.includes(2)) {state.G.push(2);}
    if (!state.G.includes(3)) {state.G.push(3);}

    const outputLog = document.getElementById("output-log");
    const pre = document.createElement("pre");
    pre.textContent = `Set map to expansion 3.`;
    outputLog.append(pre);
    outputLog.scrollTop = outputLog.scrollHeight;

    document.getElementById("text-input").focus() //Refocus on text box
})


// Upon page load
const saveData = localStorage.getItem("save");

let state = saveData !== null ? JSON.parse(saveData) : newGame(); //Ternary operation, either converts the string to an object or gets a new game object

setBackgroundColor(state.L);
