/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */

async function getUser(request, reply) {
    const User = this.mysql.User;
    const { idUser } = request.JWT;

    const { username } = await User.findById(idUser);
    reply.send({ username });
}

export default { getUser };
