import userController from "../controller/user.controller.js";
/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function userRoute(fastify, opts) {
    fastify.route({
        method: "GET",
        url: "/user",
        preHandler: fastify.authJWTHook,
        schema: { headers: fastify.jwtHeaderSchema },
        handler: userController.getUser,
    });
}

export default userRoute;
