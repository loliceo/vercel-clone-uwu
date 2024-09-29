"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const aws_1 = require("./aws");
const helper_1 = require("./helper");
const subscriber = (0, redis_1.createClient)();
const publisher = (0, redis_1.createClient)();
subscriber.connect();
publisher.connect();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            const response = yield subscriber.brPop((0, redis_1.commandOptions)({ isolated: true }), 'build-queue', 0);
            const id = response === null || response === void 0 ? void 0 : response.element;
            if (id) {
                yield (0, aws_1.downloadS3folder)(`output/${id}`);
                yield (0, helper_1.buildProject)(id);
                yield (0, aws_1.copyFinalDist)(id);
                publisher.hSet("status", id, "Deployed");
            }
            else {
                console.error('Received undefined id from build-queue');
            }
        }
    });
}
main();
