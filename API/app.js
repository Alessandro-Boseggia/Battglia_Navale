import Fastify from "fastify";
import autoLoad from "fastify-autoload";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import("dotenv").then((dotenv) => {
    dotenv.config();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function app(config = {}) {
    const fastify = Fastify(config);

    fastify.register(autoLoad, {
        dir: join(__dirname, "plugin"),
        forceESM: true,
    });

    fastify.register(autoLoad, {
        dir: join(__dirname, "src/routers"),
        forceESM: true,
    });

    fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
        return (data) => schema.validate(data);
    });

    fastify.post("/test", (response, reply) => {
        if (response.body.password === "bose123") {
            reply.code(200).send();
        }
        reply.code(400).send();
    });

    return fastify;
}
