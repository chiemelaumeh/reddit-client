import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Comment from "./models/Comments.js";
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://reddit-app-nw97.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const secret = process.env.SECRET_KEY;
const connectionString = process.env.DATABASE_URL;

const getUserFromToken = async (token) => {
  const userInfo = await jwt.verify(token, secret);
  return await User.findById(userInfo.id);
};

mongoose.set("strictQuery", false);
await mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.log);

app.get("/", async (req, res) => {
  const comment = await Comment.find({});
  res.json(comment);
});

app.post("/register", async (req, res) => {
  const { email, username } = req.body;
  const password = bcrypt.hashSync(req.body.password, 10);
  // const password = bcrypt.genSalt(10, function(err, salt) {
  //   bcrypt.hash(req.body.password, salt, function(err, hash) {
  //             // Store hash in database here
  //    });
  // });

  const createUser = async () => {
    const user = new User({
      email,
      username,
      password,
    });
    try {
      const info = await user.save();
      res.status(201);

      jwt.sign({ id: user._id }, secret, (err, token) => {
        if (err) {
          console.log(err);
          res.status(500);
        } else {
          // console.log(token);
          res.status(201).cookie("token", token).send();
        }
      });
    } catch (error) {
      console.error(error.message);
      res.status(500);
    }
  };

  createUser();
});

// }
app.get("/user", (req, res) => {
  const getUser = async () => {
    const token = req.cookies.token;
    try {
      const user = await getUserFromToken(token);
      // res.clearCookie("token", "").send();
       
      res.json({ username: user.username });
    } catch (err) {
      // console.log("error45")
      console.error(err.message);
      res.status(500);
    }
  };

  getUser();
});

app.get("/logout", (req, res) => {
  const token = req.cookies.token;
  // console.log(token)
  // try {
  //   const userInfo =  jwt.verify(token, secret);
  //   const user =  User.findById(userInfo.id);
  //   // res.clearCookie("token", "").send();

  //   res.json({ username: user.username });
  // } catch (err) {
  //   // console.log("error45")
  //   console.error(err.message);
  //   res.status(500);
  // }
  res.clearCookie("token", "").send();
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // const findUser = async () => {
  //   try {
  //     const user = await User.findOne({ username });
  //     // console.log(user)
  //     if (user.username === username ) {
        
  //       // res.status(201).send(user);
        
  //       }
  //       // if (user && user.username == username) {
  //         const passOk = bcrypt.compareSync(password, user.password);
  //         // console.log(passOk);
  //       if (passOk) {
  //         jwt.sign({ id: user._id }, secret, (err, token) => {
  //           res.cookie("token", token).send();
  //           console.log(token)
  //         });

  //       }
  //       //  else {
  //       //   res.status(422).json("Invalid password");
  //       // }
  //     // } 
  //     // else {
  //     //   res.status(422).json("Invalid username");
  //     // }
  //   } catch (error) {
  //     console.log(error.message);
  //     // console.log("nice")
  //   }
  // };
  // findUser();
  const findUser = async () => {
    try {
      const user = await User.findOne({ username });
      if (user.username === username && user.password === password) {
        console.log(user);
      }
      if (user && user.username == username) {
        const passOk = bcrypt.compareSync(password, user.password);
        // res.json(passOk);
        if (passOk) {
          jwt.sign({ id: user._id }, secret, (err, token) => {
            res.cookie("token", token).send();
            console.log(token)
          });
        } else {
          res.status(422).json("Invalid password");
        }
      } else {
        res.status(422).json("Invalid username");
      }
    } catch (error) {
      console.log(error.message);
      // console.log("nice")
    }
  };
  findUser();
});

app.post("/comments", (req, res) => {
  const createCommment = async () => {
    try {
      const userInfo = await getUserFromToken(req.cookies.token);
      const { title, body } = req.body;

      const comment = new Comment({
        title,
        body,
        author: userInfo.username,
        postedAt: Date.now(),
      });
      const newComment = await comment.save();

      res.status(201).json(newComment);
    } catch (error) {
      console.error(error.message);
    }
  };
  createCommment();
});

app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.json(comments);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.json(comment);
  } catch (error) {}
});

const removeUsers = async () => {
  //  const user = await User.findOne({username: "jn"});
  await User.deleteMany({});
  //  console.log(user)
};
//  removeUsers()
app.listen(4000, () => {
  console.log("Listening on Port 4000");
});
