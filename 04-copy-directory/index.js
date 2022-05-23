const fs = require("fs");
const path = require("path");

async function copyDirectory(sourceDir, destDir) {

      fs.promises.mkdir(destDir).then((data) => {
        fs.promises.readdir(sourceDir, { withFileTypes: true }).then((data) => {
          data.map((file) => {

            if (file.isDirectory()) {
              copyDirectory(path.join(sourceDir, file.name), path.join(destDir, file.name));
            } else {
              fs.promises.copyFile(
                path.join(sourceDir, file.name),
                path.join(destDir, file.name)
            );
            }

          });
        });
      });
};



try {


  (async () => {
    fs.promises
      .rm(path.join(__dirname, "./files-copy"), {
        recursive: true,
        force: true,
      })
      .then(() => {
          copyDirectory(
            path.join(__dirname, "./files"),
            path.join(__dirname, "./files-copy")
          );
      });
  })();
} catch (err) {
  if (err) return console.log(err);
}

