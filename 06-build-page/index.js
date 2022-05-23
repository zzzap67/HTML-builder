const fs = require("fs");
const path = require("path");

let newFile = [];


async function copyDirectory(sourceDir, destDir) {
  fs.promises.mkdir(destDir).then((data) => {
    fs.promises.readdir(sourceDir, { withFileTypes: true }).then((data) => {
      data.map((file) => {
        if (file.isDirectory()) {
          copyDirectory(
            path.join(sourceDir, file.name),
            path.join(destDir, file.name)
          );
        } else {
          fs.promises.copyFile(
            path.join(sourceDir, file.name),
            path.join(destDir, file.name)
          );
        }
      });
    });
  });
}



try {
  (async () => {
    fs.promises
      .rm(path.join(__dirname, "./project-dist"), {
        recursive: true,
        force: true,
      })
      .then(() => {


        fs.promises.mkdir(path.join(__dirname, "./project-dist")).then((data) => {
          copyDirectory(
          path.join(__dirname, "./assets"),
          path.join(__dirname, "./project-dist/assets")
        );
      }).then((data) => {

        fs.promises.readdir(path.join(__dirname, "./styles")).then((data) => {
          const output = fs.createWriteStream(
            path.join(__dirname, "./project-dist/style.css")
          );
          data.map((file) => {
            if (path.extname(file) == ".css") {
              const readableStream = fs.createReadStream(
                path.join(__dirname, "./styles/", file)
              );

              let data = "";

              readableStream.on("data", (chunk) => (data += chunk));
              readableStream.on("end", () => {
                output.write(data);
              });
            }
          });
        }).then((data) => {

          fs.readFile(path.join(__dirname, "template.html"), async (err, data) => {
            const tempArr = data.toString().split("\n");
             for (const line of tempArr) {

              if (line.indexOf("{{") >= 0 && line.indexOf("}}") >= 0) {
                    const start = line.slice(0, line.indexOf("{{"));
                    const finish = line.slice(line.indexOf("}}") + 2);

                    const tagNameFull = line.slice(
                      line.indexOf("{{"),
                      line.indexOf("}}") + 2
                    );
                    const tagName = tagNameFull.slice(2, -2);

                    let newData =  await fs.promises.readFile(
                        path.join(__dirname, "components", tagName + ".html")
                    );

                    const tempArrComp = newData.toString().split("\n");

                    tempArrComp.forEach((item) => {
                      newFile.push(start + item);
                    })

              } else {
                newFile.push(line);
              }


            }


            fs.promises.writeFile(
              path.join(__dirname, "project-dist", "index.html"),
              newFile.join("\n")
            );
          })





        });
      })
    })
    })();
} catch (err) {
  if (err) return console.log(err);
}
