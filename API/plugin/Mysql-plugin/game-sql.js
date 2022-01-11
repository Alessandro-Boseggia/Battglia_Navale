import APIError from "../../src/utils/APIError.js";

export class Game {
    constructor(mysql, fastify) {
        this.mysql = mysql;
        this.fastify = fastify;
    }

    async insertGame(roomId, idUser) {
        await this.mysql.execute(
            "INSERT INTO Partite (roomId, giocatore1) VALUES (?, ?)",
            [roomId, idUser]
        );
    }

    async searchGamesWhitoutSameId(idUser) {
        const [result] = await this.mysql.execute(
            "SElECT * FROM Partite WHERE giocatore1 != ? AND giocatore2 IS NULL",
            [idUser]
        );

        return result[0];
    }

    async searchGamesWhitRommId(roomId, userId) {
        const [result] = await this.mysql.execute(
            "SElECT * FROM Partite WHERE roomId = ?",
            [roomId]
        );

        return result;
    }

    async findDuplicatedGames(player1) {
        const [result] = await this.mysql.execute(
            "SElECT * FROM Partite WHERE giocatore1 = ? AND giocatore2 IS NULL",
            [player1]
        );

        return result;
    }

    async updateMatchWhitPlayer2(roomId, player2) {
        await this.mysql.execute(
            "UPDATE Partite SET giocatore2 = ? WHERE roomId = ?",
            [player2, roomId]
        );
    }
}
