import { v4 as uuid } from "uuid";

/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */

async function createGame(request, reply) {
    const Game = this.mysql.Game;
    const { idUser } = request.JWT;
    const dulicatedGame = await Game.findDuplicatedGames(idUser);

    if (dulicatedGame.length > 0)
        return reply.send({ roomId: dulicatedGame[0].roomId });

    const roomId = uuid();

    await Game.insertGame(roomId, idUser);

    reply.send({ roomId });
}

/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
async function searchGames(request, reply) {
    const Game = this.mysql.Game;
    const { idUser } = request.JWT;

    const foundedGame = await Game.searchGamesWhitoutSameId(idUser);

    if (!foundedGame?.roomId) throw reply.notFound();

    reply.send({ roomId: foundedGame?.roomId });
}

/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
async function joinGame(request, reply) {
    const Game = this.mysql.Game;
    const { roomId } = request.body;
    const { idUser } = request.JWT;

    Game.updateMatchWhitPlayer2(roomId, idUser);
    const game = await Game.searchGamesWhitRommId(roomId);

    if (game.length <= 0) return reply.notFound();

    const { giocatore1 } = game[0];
    this.socketSendToUser(
        giocatore1,
        "game_found",
        { g2: idUser },
        "/matchmaking"
    );

    reply.send({ idPlayer1: giocatore1 });
}

export default { createGame, searchGames, joinGame };
