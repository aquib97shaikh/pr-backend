const mongoose = require("mongoose");
const {PrSchemas } = require("./PrSchemas");
const pwd = "PKnjBMe1gAZSBs5S";
// const monogoURL = "mongodb://localhost/pr";
const monogoURL = `mongodb+srv://pr-user:${pwd}@peerreview.sjzj9.mongodb.net/prDb?retryWrites=true&w=majority`;


mongoose
  .connect(monogoURL, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Connection established with MongoDB server online");
  })
  .catch((er) => {
    console.log("Error occur while connection ", er);
  });



PrModels = {};
Object.keys(PrSchemas).forEach((key) => {
  PrModels[key] = mongoose.model(key, PrSchemas[key]);
});

exports.PrModels = PrModels;
