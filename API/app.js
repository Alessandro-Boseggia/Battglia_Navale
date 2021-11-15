import Fastify from "fastify";
import autoLoad from "fastify-autoload";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import("dotenv").then((dotenv) => {
    dotenv.config();
});

const fastify = Fastify();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

fastify.listen(3000, async (err, address) => {
    if (err) return console.error(err);
    console.log(`Server start on ${address}`);
});
