const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
console.log(MONGO_URI);
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const submitApplication = async (req, res) => {
  //do a check if email address has already been used
  const client = await MongoClient(MONGO_URI, options);
  const newApplication = req.body;
  //   console.log(req.body);
  const email = req.body.contact.email;
  console.log(email);
  try {
    await client.connect();
    const db = client.db("personal_project");
    let existingUser = false;
    const result = await db
      .collection("applications")
      .findOne({ "contact.email": email });
    console.log("result", result);
    console.log("existingUser", existingUser);

    if (result) {
      return res
        .status(201)
        .json({
          status: 201,
          applicationExists: true,
          message:
            "an application has already been submitted for this email address!",
        });
    }

    await db.collection("applications").insertOne(newApplication);
    res.status(201).json({
      status: 201,
      data: newApplication,
      message: "success! new application submitted",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      data: newApplication,
      message: "sorry! this didn't work.",
    });
  }
  client.close();
};

module.exports = { submitApplication };
