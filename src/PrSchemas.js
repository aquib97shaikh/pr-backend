const {Schema} = require("mongoose");
PrSchemas = {
  Student: new Schema({
    username: String,
    fname: String,
    lname: String,
    email: String,
    pwd: String,
    dob: Date,
    gender: String,
    city: String,
    country: String,
    education: [],
    gitlink: String,
  }),
  Question: new Schema({
    title: String,
    difficulty: String,
    gitCloneLink: String,
    author: String,
    description: String,
    goals: [String],
  }),
  Answer: new Schema({
    username: String,
    questionId: Schema.Types.ObjectId,
    gitlink: String,
    viewLink: String,
  }),
  Review: new Schema({
    username: String,
    questionId: Schema.Types.ObjectId,
    answerId: Schema.Types.ObjectId,
    r_username: String,
    reviewGoals: [String],
    reviewFeedback: [String],
    status: String,
  }),
};
exports.PrSchemas = PrSchemas;