import {S3} from "aws-sdk"
import 'dotenv/config'
import fs from "fs"


const s3 = new S3({
    accessKeyId: process.env.ACCESS_KEY as string,
    secretAccessKey : process.env.SECRET_ACCESS_KEY as string
})



export const uploadFile = async (fileName : string, localFilePath : string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const respone = await s3.upload({
        Body : fileContent,
        Bucket : "vercel-clone-dhruv",
        Key : fileName
    }).promise();

    console.log(respone)
}
