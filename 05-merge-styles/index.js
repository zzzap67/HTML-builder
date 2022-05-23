const fs = require("fs");
const path = require("path");
const output = fs.createWriteStream(path.join(__dirname, "./project-dist/bundle.css"));


fs.promises.readdir(path.join(__dirname, "./styles")).then((data) => {

  data.map((file) => {

    if (path.extname(file) == ".css") {

      const readableStream = fs.createReadStream(path.join(__dirname, "./styles/", file));

      let data = "";

      readableStream.on("data", (chunk) => (data += chunk));
      readableStream.on("end", () => {
        output.write(data);
      });

    }
  });
});
