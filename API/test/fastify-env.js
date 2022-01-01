import NodeEnvironment from "jest-environment-node";
import app from "../app.js";

export default class FastifyEnvironment extends NodeEnvironment {
    async setup() {
        await super.setup();
        const fastify = await app({});
        this.global.fastify = fastify;
    }
}
