import app from "./app.js";

async function server() {
    const fastify = await app();

    fastify.listen(3000, async (err, address) => {
        if (err) return console.error(err);
        console.log(`Server start on ${address}`);
    });
}

server();
