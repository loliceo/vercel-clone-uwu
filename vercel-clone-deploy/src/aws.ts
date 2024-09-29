import {S3} from "aws-sdk"
import { configDotenv } from "dotenv"
import path from "path";
import fs from "fs"


configDotenv();

const s3 = new S3({
    accessKeyId : process.env.ACCESS_KEY as string,
    secretAccessKey : process.env.SECRET_ACCESS_KEY as string
})

export async function downloadS3folder(prefix : string) {
    const allFiles = await s3.listObjectsV2({
        Bucket : "vercel-clone-dhruv",
        Prefix : prefix
    }).promise();

    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            
            const finalOutputPath = path.join(__dirname,Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if(!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, {recursive: true});
            }
            s3.getObject({
                Bucket : "vercel-clone-dhruv",
                Key
            }).createReadStream().pipe(outputFile)
            .on("finish", () => {
                resolve("");
            })
        })
    }) || []

    console.log("Awaited");
    await Promise.all(allPromises?.filter(x => x !== undefined))
    console.log("finished");
}

export async function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllfiles(folderPath);

    allFiles.forEach( file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    })

    
}


const getAllfiles = (folderPath : string) => {
    let response: string[] = [];

    const allFilesandFolders = fs.readdirSync(folderPath);
    allFilesandFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if(fs.statSync(fullFilePath).isDirectory()){
            response = response.concat(getAllfiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

const uploadFile = async (fileName : string, localFilePath : string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const respone = await s3.upload({
        Body : fileContent,
        Bucket : "vercel-clone-dhruv",
        Key : fileName
    }).promise();

    if(respone !== undefined) console.log("successfully uploaded dist to S3!")
}
