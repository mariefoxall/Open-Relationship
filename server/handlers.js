const { MongoClient, ObjectID } = require("mongodb");
require("dotenv").config();
const bcrypt = require("bcrypt");

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

const confirmUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const email = req.body.email;
  try {
    const query = { "contact.email": email };
    const update = {
      $set: {
        signUpCode: "",
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
  const contact = req.body.contact;
  const portfolio = req.body.portfolio;
  const longForm = req.body.longForm;
  const reasons = req.body.reasons;
  const username = req.body.username;
  try {
    await client.connect();
    const db = client.db("personal_project");
    const result = await db.collection("users").findOne({ username: username });

    if (result) {
      return res.status(201).json({
        status: 201,
        usernameExists: true,
        message: "this username already exists!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUserDetails = {
      username: username,
      password: hashedPassword,
      contact,
      portfolio,
      longForm,
      reasons,
    };
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
      message: "sorry! this didn't work.",
    });
  }
  client.close();
};

const verifyUserForSignin = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const username = req.body.username;
  try {
    const query = { username: username };
    await client.connect();
    const db = client.db("personal_project");
    const verifiedUser = await db.collection("users").findOne(query);
    console.log("verifiedUser", verifiedUser);
    if (!verifiedUser) {
      return res.status(400).json({
        status: 400,
        userNotFound: true,
        message: "user not found.",
      });
    } else {
      validPassword = await bcrypt.compare(
        req.body.password,
        verifiedUser.password
      );
      console.log("validPassword", validPassword);
      if (!validPassword) {
        return res.status(400).json({
          status: 400,
          invalidPassword: true,
          message: "incorrect password",
        });
      } else {
        return res.status(200).json({
          status: 200,
          data: verifiedUser,
          message: "user signed in",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
  client.close();
};

// const getUserDetails = async (req, res) => {
//   const client = await MongoClient(MONGO_URI, options);
//   console.log("req.body", req.body);
//   const email = req.body.email;
//   try {
//     const query = { "contact.email": email };
//     await client.connect();
//     const db = client.db("personal_project");
//     const thisUser = await db.collection("applications").findOne(query);
//     if (thisUser) {
//       return res
//         .status(200)
//         .json({ status: 200, data: thisUser, message: "user found" });
//     } else {
//       return res
//         .status(200)
//         .json({ status: 200, data: thisUser, message: "user not found" });
//     }
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ status: 500, message: error.message });
//   }
//   client.close();
// };

const getUsers = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("personal_project");
    const users = await db.collection("users").find().toArray();
    res.status(200).json({ status: 200, users: users });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
  client.close();
};

const getUserProfile = async (req, res) => {
  const username = req.params.username;
  const client = await MongoClient(MONGO_URI, options);
  try {
    const query = { username: username };
    await client.connect();
    const db = client.db("personal_project");
    const thisUser = await db.collection("users").findOne(query);
    if (thisUser) {
      const thisUserProfile = await db
        .collection("applications")
        .findOne({ "contact.email": thisUser.email });
      return res.status(200).json({ status: 200, data: thisUserProfile });
    } else {
      return res.status(200).json({ status: 200, userNotFound: true });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
  client.close();
};

const makeConnection = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const newConnection = req.body;
  const requestingUser = req.body.requestingUser;
  const receivingUser = req.body.receivingUser;
  try {
    await client.connect();
    const query = {
      requestingUser: requestingUser,
      receivingUser: receivingUser,
    };
    const reverseQuery = {
      requestingUser: receivingUser,
      receivingUser: requestingUser,
    };
    const db = client.db("personal_project");
    const youAlreadyAskedThem = await db
      .collection("connections")
      .findOne(query);
    const theyAlreadyAskedYou = await db
      .collection("connections")
      .findOne(reverseQuery);
    if (youAlreadyAskedThem) {
      return res.status(201).json({
        status: 201,
        youAlreadyAskedThem: true,
        message: "you have already requested to connect with this user.",
      });
    } else if (theyAlreadyAskedYou) {
      return res.status(201).json({
        status: 201,
        theyAlreadyAskedYou: true,
        message:
          "this user has already requested to connect with you! Check your inbox.",
      });
    }
    await db.collection("connections").insertOne(newConnection);
    res.status(201).json({
      status: 201,
      data: newConnection,
      message: "success! new connection requested.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      data: newConnection,
      message: error.message,
    });
  }
  client.close();
};

const updateProfilePic = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  console.log("req.body", req.body);
  const username = req.body.username;
  console.log("username inside updateProfilePic", username);
  const profilePicURL = req.body.profilePicURL;
  console.log("profilePicURL", profilePicURL);
  try {
    const query = { username: username };
    const setProfilePic = { $set: { profilePicURL: profilePicURL } };
    await client.connect();
    const db = client.db("personal_project");
    const r = await db.collection("users").updateOne(query, setProfilePic);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    res
      .status(200)
      .json({ status: 200, data: profilePicURL, message: "pic updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
  client.close();
};

// const checkConnection = async(req.res)=>{
// const client = await MongoClient(MONGO_URI, options);
// const userA = req.body.
// }

module.exports = {
  submitApplication,
  viewApplications,
  approveApplication,
  denyApplication,
  checkApplicationForSignup,
  confirmUser,
  createNewUser,
  verifyUserForSignin,
  // getUserDetails,
  getUsers,
  getUserProfile,
  makeConnection,
  updateProfilePic,
};
