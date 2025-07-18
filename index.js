const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server}=require("socket.io");
const mainRouter= require('./Routes/main.router');

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers"); //

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pullRepo } = require("./controllers/pull");
const { pushRepo } = require("./controllers/push");
const { revertRepo } = require("./controllers/revert");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Starts a new server", {}, startServer)
  .command("init", "Initialise a new repository", {}, initRepo)
  .command(
    "add <file>", //file details
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        //"file" extracts the file details from add <file>
        describe: "file to be added to the staging area",
        type: "string",
      });
    },
    (argv) => {
      // file details extracted from argument
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged file",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "Pull commits to S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need atleast one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

 
  app.use(express.json());

  const mongoURI = process.env.MONGO_URI;

  mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.error("unable to connect:", err));


    app.use(cors({origin:"*"}));

    app.use("/", mainRouter);

    let user="test";
   const httpServer = http.createServer(app);
   const io= new Server(httpServer, {
    cors: {
   origin:"*",
   methods:["GET", "POST"],

    }
   },
  

  )
   
   io.on("connection", (socket)=>{
    socket.on("joinRoom", (userID)=>{
      user=userID;
      console.log("=====");
      console.log(user);
      console.log("====");
      socket.join(userID);
    });
   });
 

   const db = mongoose.connection;
   db.once("open", async()=>{
    console.log("CRUD operations called");
    //crud operations
   });

   httpServer.listen(port, ()=>{
    console.log(`Server is running on PORT ${port}`);
   })
}




