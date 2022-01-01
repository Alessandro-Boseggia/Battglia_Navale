import fp from "fastify-plugin";
import mysql from "mysql2";
import { User } from "./user-sql.js";
import { Game } from "./game-sql.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Object} opts
 */
async function mysql_plugin(fastify, opts) {
    const pool = mysql
        .createPool({
            connectionLimit: 10,
            host: opts.host,
            user: opts.user,
            password: opts.password,
            database: opts.database,
        })
        .promise();

    function closeAllConnection() {
        pool.end();
    }

    fastify.decorate("mysql", {
        User: new User(pool),
        Game: new Game(pool),
        closeAllConnection,
    });
}

export default fp(
    async function (fastify, opts) {
        fastify.register(fp(mysql_plugin), {
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DATABASE,
        });
    },
    { name: "mysql-plugin " }
);
