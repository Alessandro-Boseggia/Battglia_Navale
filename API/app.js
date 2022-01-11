import Fastify from "fastify";
import autoLoad from "fastify-autoload";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function app(config = {}) {
    const fastify = Fastify(config);

    fastify.register(autoLoad, {
        dir: join(__dirname, "plugin"),
        ignorePattern: /.*-.*sql.js/,
        forceESM: true,
    });

    fastify.register(autoLoad, {
        dir: join(__dirname, "src/routers"),
        forceESM: true,
        options: {
            prefix: "/api",
        },
    });

    fastify.register(autoLoad, {
        dir: join(__dirname, "src/game"),
        forceESM: true,
    });

    fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
        return (data) => schema.validate(data);
    });

    return fastify;
}
