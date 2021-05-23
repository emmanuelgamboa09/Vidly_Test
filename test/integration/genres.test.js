const request = require('supertest');
const { Genre } = require('../../api/models/genre');
const { User } = require('../../api/models/user');
let server;

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../server');
  });
  afterEach(async () => {
    await Genre.deleteMany({});
    server.close();
  });

  describe('GET /', () => {
    it('Should return all genres', async () => {
      await Genre.collection.insertMany([{ name: 'genre1' }, { name: 'genre2' }]);

      const res = await request(server).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some((g) => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('Should return a genre if a valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' });
      const result = await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });

    it('Should return 404 error if genre doesnt exit', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    // Define the happy path, and then in each test, we change
    // one parameter that clearly aglins with the name of the
    // test

    let token;
    let name;

    const exec = async () => {
      return await request(server).post('/api/genres').set('x-auth-token', token).send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'newGenre';
    });

    it('Should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('Should return 400 if genre is less than 5 characters', async () => {
      name = '1234';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('Should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('Should save genre if it is valid', async () => {
      await exec();

      const genre = await Genre.find({ name: 'newGenre' });

      expect(genre).not.toBeNull();
    });

    it('Should return the genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'newGenre');
      expect(res.status).toBe(200);
    });
  });
});
