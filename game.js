function findCommands(command, input) {

    const outputs = map.filter(
        row => row.Command === command && row.Input === input
    );

    return outputs;
}

function parseInput(text) {
    const parts = text.split(" ");
    const command = parts[0];
    const input = parts.slice(1).join(" ");
    command.toLowerCase();
    input.toLowerCase();

    return {
        command: command,
        input: input
    };
}

const parsed = parseInput("move waterfall");
const matches = findCommands(parsed.command, parsed.input);

console.log(matches);