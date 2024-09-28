import { exec, spawn } from "child_process";
import path from "path";

export function buildProject(id: String){
    return new Promise( (resolve) => {

        console.log("in build of" + id);
        console.log(`${path.join(__dirname, `output\\${id}`)}`);
        const child = exec(`cd ${path.join(__dirname, `output\\${id}`)} && npm install && npm run build`);

        child.stdout?.on('data' , (data) => {
            console.log('stdout ' + data);
        })
        child.stderr?.on('data', (data) => {
            console.log('stderr' + data);
        })

        child.on('close', (code) => {
            resolve("");
        });

    })
}