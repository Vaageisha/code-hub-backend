

const fs= require('fs').promises;
const path= require('path');
const {s3, S3_BUCKET}=require('../config/aws-config');


async function pushRepo(){
   const repoPath= path.resolve (process.cwd(),".apnagit");
   const commitsPath=path.join(repoPath,"commits");


   try{
  const commitDirs= await fs.readdir(commitsPath);
  for(const commitDir of commitDirs){  //this loop is made at a folder loop to scan all folders one by one
   const commitPath = path.join(commitsPath, commitDir);
   const files= await fs.readdir(commitPath); //from here we will read one file at a time 

   for(const file of files) //each file inside the folder
   {
    const filePath= path.join(commitPath, file);
    const fileContent= await fs.readFile(filePath);
    const params={
        Bucket: S3_BUCKET, //bucket where file needs to be pushed
        Key:`commits/${commitDir}/${file}`, //commit directory; key is like a file path/ location of file inside bucket
        Body:fileContent,
    };
    await s3.upload(params).promise();
   }
  }

  console.log("All commits pushed to S3");
   }

   catch(err){
    console.error(" Error pushing to S3:", err);
   }
}

module.exports={pushRepo};