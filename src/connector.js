const mongoose = require("mongoose");

const monogoURL = "mongodb://localhost/pr";
const monogoURL = "mongodb+srv://pr-user:<password>@peerreview.sjzj9.mongodb.net/<dbname>?retryWrites=true&w=majority";


mongoose
  .connect(monogoURL, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Connection established with MongoDB server online");
  })
  .catch((er) => {
    console.log("Error occur while connection ", er);
  });

