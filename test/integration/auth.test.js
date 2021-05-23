const request = require('supertest');
const { Genre } = require('../../api/models/genre');
const { User } = require('../../api/models/user');

describe('Auth middleware', () => {
  beforeEach(() => {
    server = require('../../server');
  });
  afterEach(async () => {
    await Genre.deleteMany({});
    server.close();
  });

  let token;
  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'newGenre' });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it('Should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('Should return 400 if the token is invalid', async () => {
    token = null;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('Should return 200 if token is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
