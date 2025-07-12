const fs= require('fs'); //we dont require promises we require the entire file
const path= require('path');
const {promisify} = require("util"); //Hey Node, give me just the promisify tool from the util module so I can convert old-school callback functions into modern Promise-based ones
/*so without promisify using normal callbacks, we just got data or error at the end, depending on the outcome
and promisify we get the old callback, but with promise that it'll return an outcome while we patiently wait?*/


const readdir=promisify(fs.readdir);
const copyFile=promisify(fs.copyFile);



async function revertRepo(commitID){
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath= path.join(repoPath, "commits");
 

  try{
     const commitDir= path.join(commitsPath, commitID);
     const files= await readdir(commitDir);

      const parentDir=path.resolve(repoPath,"..");

  for(const file of files){
    await copyFile(path.join(commitDir,file), path.join(parentDir, file));
  }
console.log(`Commit ${commmitID} reverted successfully!`);
  }
  catch(err){
console.error("Unable to revert:",err);
  }
}

module.exports={revertRepo};