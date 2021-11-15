import fp from "fastify-plugin";
import bcrypt from "bcrypt";
import mysql from "mysql2";

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

    async function getUserByID(id) {}

    async function checkUsernameAndPassword(username, password) {
        const [result] = await pool.execute(
            "SELECT * FROM Utenti WHERE username = ?",
            [username]
        );

        if (result.length < 1) throw fastify.httpErrors.unauthorized();

        const passwd = await bcrypt.compare(password, result[0].Password);

        if (!passwd) throw fastify.httpErrors.unauthorized();

        const idUser = result[0].id;

        return { idUser };
    }

    async function insertUser(username, password) {
        try {
            const salt = await bcrypt.genSalt(13);

            password = await bcrypt.hash(password, salt);

            await pool.execute(
                "INSERT INTO Utenti (username, password) VALUES (?, ?)",
                [username, password]
            );
        } catch (err) {
            console.log(err);
            throw fastify.httpErrors.conflict();
        }
    }

    fastify.decorate("mysql", {
        checkUsernameAndPassword,
        insertUser,
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
