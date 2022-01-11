import gameController from "../controller/game.controller.js";
import gameValidation from "../schema/game.validation.js";
/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function gameRoute(fastify, opts) {
    fastify.route({
        method: "POST",
        url: "/game/createGame",
        preHandler: fastify.authJWTHook,
        schema: { headers: fastify.jwtHeaderSchema },
        handler: gameController.createGame,
    });

    fastify.route({
        method: "GET",
        url: "/game/searchGames",
        schema: null,
        preHandler: fastify.authJWTHook,
        schema: { headers: fastify.jwtHeaderSchema },
        handler: gameController.searchGames,
    });

    fastify.route({
        method: "POST",
        url: "/game/joinGame",
        schema: null,
        preHandler: fastify.authJWTHook,
        schema: {
            headers: fastify.jwtHeaderSchema,
            body: gameValidation.joinGameValidation,
        },
        handler: gameController.joinGame,
    });
}

export default gameRoute;
