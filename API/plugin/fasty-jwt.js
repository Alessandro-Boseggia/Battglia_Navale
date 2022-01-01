import fp from "fastify-plugin";
import JWT from "jsonwebtoken";
import Joi from "joi";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function fastyJwt(fastify, opts) {
    const secret = opts.secret ?? "secret";
    let JWTValue;

    /**
     *
     * @param {import("fastify").FastifyRequest} request
     * @param {import("fastify").FastifyReply} replay
     */
    async function authJWTHook(request, reply) {
        try {
            const jwt = request.headers.jwt;

            const validJWT = await JWT.verify(jwt, secret);

            if (validJWT.hasOwnProperty("isRefresh")) reply.unauthorized();
            request.JWT = validJWT;
        } catch (err) {
            reply.unauthorized();
        }
    }

    async function authJWT(jwt) {
        const validJWT = await JWT.verify(jwt, secret);

        if (validJWT.hasOwnProperty("isRefresh"))
            throw fastify.httpErrors.unauthorized();

        return validJWT;
    }

    /**
     *
     * @param {Object} payload
     * @param {import("fastify").FastifyReply} reply
     */
    async function newJWT(payload) {
        return new Promise(async function (resolve, reject) {
            try {
                const refreshPeyload = JSON.parse(JSON.stringify(payload));
                Object.assign(refreshPeyload, { isRefresh: true });

                const promiseResult = await Promise.all([
                    JWT.sign(payload, secret, { expiresIn: 400 }),
                    JWT.sign(refreshPeyload, secret),
                ]);

                const jwt = promiseResult[0];
                const refreshToken = promiseResult[1];

                resolve({ jwt, refreshToken });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     *
     * @param {import("fastify").FastifyRequest}
     */
    async function refresh(refreshToken) {
        return new Promise(async function (resolve, reject) {
            try {
                let newJwt = await JWT.verify(refreshToken, secret);

                delete newJwt.isRefresh;
                delete newJwt.iat;

                newJwt = await JWT.sign(newJwt, secret, { expiresIn: 400 });
                resolve(newJwt);
            } catch (error) {
                reject(error);
            }
        });
    }

    const jwtHeaderSchema = Joi.custom((value, helpers) => {
        const regex = RegExp(
            /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
        );
        if (typeof value.jwt != "string" || !regex.test(value.jwt)) {
            return helpers.message("Invalid JWT");
        }

        return value;
    }, "jwt validator");

    fastify.decorate("authJWTHook", authJWTHook);
    fastify.decorate("authJWT", authJWT);
    fastify.decorate("newJWT", newJWT);
    fastify.decorate("refresh", refresh);
    fastify.decorate("jwtHeaderSchema", jwtHeaderSchema);
    fastify.decorateRequest("JWT", JWTValue);
}
export default fp(fastyJwt, { name: "fasty-jwt" });
