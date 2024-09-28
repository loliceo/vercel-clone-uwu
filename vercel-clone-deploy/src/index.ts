import { createClient, commandOptions } from "redis";
import { copyFinalDist, downloadS3folder } from "./aws";
import { buildProject } from "./helper";
const subscriber = createClient();
const publisher = createClient();

subscriber.connect();
publisher.connect();

async function main() {
    while(1) {
        const response = await subscriber.brPop(
            commandOptions( { isolated : true }),
            'build-queue',
            0
        );
        
        const id = response?.element;

        if (id) {
            await downloadS3folder(`output/${id}`);
            await buildProject(id);
            await copyFinalDist(id);
            
            publisher.hSet("status", id, "Deployed");
        } else {
            console.error('Received undefined id from build-queue');
        }
    }
}
main();