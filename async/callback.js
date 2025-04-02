const fs = require("fs");

const fileName = "message.txt";
const fileContent = "Ciao, questo è un esempio";

fs.writeFile(fileName, fileContent, "utf8", (err) => {
  if (err) {
    console.error("Errore nella scrittura: ", err);
    return;
  }
  console.log("File creato con successo");
});
