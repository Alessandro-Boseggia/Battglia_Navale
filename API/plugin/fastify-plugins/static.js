import staticFiles from "fastify-static";
import fp from "fastify-plugin";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default fp(async function (fastify, opts) {
    fastify.register(staticFiles, {
        root: "/home/pjserver/BattagliaNavale/WebApp",
    });
});
