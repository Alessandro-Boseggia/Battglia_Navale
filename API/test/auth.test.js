beforeAll(async () => {
    await fastify.mysql.User.deleteUserByUsername("Ale041");
});

afterAll(() => {
    fastify.mysql.closeAllConnection();
});

test("Insert user", async () => {
    const response = await fastify.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
            username: "Ale041",
            password: "bose123",
        },
    });
    expect(response.statusCode).toBe(200);
});

test("Insert duplicated user", async () => {
    const response = await fastify.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
            username: "Ale041",
            password: "bose123",
        },
    });

    expect(response.statusCode).toBe(409);
});

test("Login user", async () => {
    const response = await fastify.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
            username: "Ale041",
            password: "bose123",
        },
    });

    expect(response.statusCode).toBe(200);
});

test("Login with invalid user", async () => {
    const response = await fastify.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
            username: "Pino",
            password: "bose123",
        },
    });

    expect(response.statusCode).toBe(401);
});

test("Login with invalid password", async () => {
    const response = await fastify.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
            username: "Ale041",
            password: "bosy123",
        },
    });

    expect(response.statusCode).toBe(401);
});
