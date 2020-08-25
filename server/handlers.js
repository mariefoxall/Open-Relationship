const { MongoClient, ObjectID } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
console.log(MONGO_URI);
const assert = require("assert");
const { v4: uuidv4 } = require("uuid");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const submitApplication = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const newApplication = req.body;
  //   console.log(req.body);
  const email = req.body.contact.email;
  console.log(email);
  try {
    await client.connect();
    const db = client.db("personal_project");
    // let existingUser = false;
    const result = await db
      .collection("applications")
      .findOne({ "contact.email": email });
    // console.log("result", result);
    // console.log("existingUser", existingUser);

    if (result) {
      return res.status(201).json({
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

const viewApplications = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("personal_project");
    const applicationsToReview = await db
      .collection("applications")
      .find({ applicationApproved: false, applicationDenied: false })
      .toArray();
    console.log(applicationsToReview);
    res.status(200).json({ status: 200, data: applicationsToReview });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
  client.close();
};

const approveApplication = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const _id = req.body._id;
  try {
    const query = { _id: ObjectID(_id) };
    const approve = {
      $set: { applicationApproved: true, signUpCode: uuidv4() },
    };
    await client.connect();
    const db = client.db("personal_project");
    const r = await db.collection("applications").updateOne(query, approve);
    // console.log(r);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    res
      .status(200)
      .json({ status: 200, data: _id, message: "application approved!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 500, data: _id, message: error.message });
  }
  client.close();
};

const denyApplication = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const _id = req.body._id;
  try {
    const query = { _id: ObjectID(_id) };
    const deny = { $set: { applicationDenied: true } };
    await client.connect();
    const db = client.db("personal_project");
    const r = await db.collection("applications").updateOne(query, deny);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    res
      .status(200)
      .json({ status: 200, data: _id, message: "application denied." });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 500, data: _id, message: error.message });
  }
  client.close();
};

const checkApplicationForSignup = async (req, res) => {
  console.log("in check application handler");
  const client = await MongoClient(MONGO_URI, options);
  const signUpCode = req.params.signUpCode;
  console.log(signUpCode);
  try {
    const query = { signUpCode: signUpCode };
    await client.connect();
    const db = client.db("personal_project");
    const thisApplication = await db.collection("applications").findOne(query);
    console.log("thisApplication", thisApplication);
    if (thisApplication) {
      return res.status(200).json({
        status: 200,
        data: thisApplication,
        message: "Application found!",
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: thisApplication,
        message: "Application not found.",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
  client.close();
};

const confirmUserDetails = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const contact = req.body.contact;
  const portfolio = req.body.portfolio;
  const longForm = req.body.longForm;
  const reasons = req.body.reasons;
  const email = contact.email;
  try {
    const query = { "contact.email": email };
    const update = {
      $set: {
        contact: contact,
        portfolio: portfolio,
        longForm: longForm,
        reasons: reasons,
        editNumber: req.body.editNumber,
      },
    };
    await client.connect();
    const db = client.db("personal_project");
    const r = await db.collection("applications").updateOne(query, update);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    res
      .status(200)
      .json({ status: 200, data: req.body, message: "user info updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
  client.close();
};

const createNewUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const newUserDetails = req.body;
  const email = req.body.email;
  try {
    await client.connect();
    const db = client.db("personal_project");
    const result = await db.collection("users").findOne({ email: email });

    if (result) {
      return res.status(201).json({
        status: 201,
        userExists: true,
        message: "this user already exists!",
      });
    }
    await db.collection("users").insertOne(newUserDetails);
    res.status(201).json({
      status: 201,
      data: newUserDetails,
      message: "success! new user created",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      data: newUserDetails,
      message: "sorry! this didn't work.",
    });
  }
  client.close();
};

module.exports = {
  submitApplication,
  viewApplications,
  approveApplication,
  denyApplication,
  checkApplicationForSignup,
  confirmUserDetails,
  createNewUser,
};
