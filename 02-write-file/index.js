const fs = require("fs");
const { stdin,stdout } = process;
const output = fs.createWriteStream(__dirname+"\\output.txt");

console.log('Enter text:');

stdin.on("data", (data) => {
  if ((data.toString().length == 6) && (data.toString().substring(0,4) == "exit")) {
    process.exit();
  } else {
    output.write(data);
  }

});

process.on("SIGINT", () => {
  process.exit();
});

process.on("exit", () => stdout.write("Goodbye!\n"));

