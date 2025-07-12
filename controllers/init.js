const fs= require("fs").promises; //imports the fs (File System) module's promise-based API.
const path= require("path"); //build in path module

async function initRepo(){
    const repoPath= path.resolve(process.cwd(),".apnaGit"); 
     // Gets the absolute path to a new folder named '.apnaGit' in the current working directory
    const commitsPath= path.join(repoPath,"commits");
     // Constructs the full path for a 'commits' subfolder inside '.apnaGit'

    try{
   await fs.mkdir(repoPath,{recursive:true});
    // Creates the '.apnaGit' folder if it doesn't exist. 'recursive: true' ensures parent folders are created if needed.
   await fs.mkdir(commitsPath,{recursive:true});
     // Creates the 'commits' subfolder inside '.apnaGit'

   await fs.writeFile(
    path.join(repoPath, "config.json"),
JSON.stringify({bucket:"process.env.S3_BUCKET"}) //process.env.S3_BUCKET reads the value from your system's environment variables.
);
console.log("repository initialised");
    }catch(err){
console.error("error initialising the repository");
    }
}

module.exports={ initRepo };