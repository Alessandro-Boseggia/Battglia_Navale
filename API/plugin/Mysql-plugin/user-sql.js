import bcrypt from "bcrypt";
import APIError from "../../src/utils/APIError.js";

export class User {
    constructor(mysql) {
        this.mysql = mysql;
    }

    async deleteUserByUsername(username) {
        await this.mysql.execute("DELETE FROM Utenti WHERE username = ?", [
            username,
        ]);
    }

    async checkDuplicateUsername(username) {
        const [result] = await this.mysql.execute(
            "SELECT * FROM Utenti WHERE username = ?",
            [username]
        );

        if (result.length >= 1) return true;

        return false;
    }

    async checkUsernameAndPassword(username, password) {
        const [result] = await this.mysql.execute(
            "SELECT * FROM Utenti WHERE username = ?",
            [username]
        );

        if (result.length < 1) throw new APIError(401);
        const passwd = await bcrypt.compare(password, result[0].password);

        if (!passwd) throw new APIError(401);

        const idUser = result[0].id;
        return { idUser };
    }

    async insertUser(username, password) {
        if (await this.checkDuplicateUsername(username))
            throw new APIError(409);

        const salt = await bcrypt.genSalt(13);

        password = await bcrypt.hash(password, salt);

        await this.mysql.execute(
            "INSERT INTO Utenti (username, password) VALUES (?, ?)",
            [username, password]
        );
    }
}
