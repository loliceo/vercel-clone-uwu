import fs from "fs";
import path from "path";

export const getAllfiles = (folderPath : string) => {
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