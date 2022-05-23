// fs/promises has the same fs functions but the return a Promise
// instead of getting a callback
const fs = require("fs/promises");
const path = require("path");
const { stat } = require("fs");



(async () => {

  const files = await fs.readdir(__dirname + "/secret-folder", {
    withFileTypes: true,
  });



  await Promise.all(

    files.map(async (file) => {



      const isFile = (await file.isFile());
      if (isFile) {

        console.log(
          path.parse(file.name).name,
          " - ",
          path.extname(file.name).slice(1),
          " - ",
          (
            (await fs.stat(__dirname + "/secret-folder/" + file.name)).size /
            1024.0
          ).toFixed(2) + "Kb"
        );

      }



      return null;
    })
  );


})();
