import authController from "../controller/auth.controller.js";
import authSchema from "../schema/auth.schema.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function authRoute(fastify, opts) {
    fastify.route({
        method: "POST",
        url: "/auth/login",
        schema: { body: authSchema.loginSchema },
        handler: authController.login,
    });

    fastify.route({
        method: "POST",
        url: "/auth/register",
        schema: { body: authSchema.registerSchema },
        handler: authController.register,
    });

    fastify.route({
        method: "GET",
        url: "/auth/refresh",
        handler: authController.refresh,
    });
}

export default authRoute;
