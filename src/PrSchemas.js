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
  Submission: new Schema({
    username: String,
    questionId: Schema.Types.ObjectId,
    gitlink: String,
    viewLink: String,
    submittedAt : Date,
  }),
  AssigningPool : new Schema({
    questionId : Schema.Types.ObjectId,
    username:String,
    submissionId: Schema.Types.ObjectId,
    remaining:Number,
  }),
  ReviewPool : new Schema({
    questionId:Schema.Types.ObjectId,
    submissionId:Schema.Types.ObjectId,
    // reviewerUsername:String,
    username:String,
    remaining:Number,
  }),
  Review: new Schema({
    username: String,
    questionId: Schema.Types.ObjectId,
    submissionId: Schema.Types.ObjectId,
    r_username: String,
    reviewGoals: [String],
    reviewFeedback: [String],
    status: String,
  }),
};
exports.PrSchemas = PrSchemas;