import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import db from '../models/index.js';

describe('Pets API', function () {
  this.timeout(10000);

  let petTypeId;

  function preparePetData(changes = {}) {
    return {
      name: 'Murka',
      owner: 'Anna Kovalenko',
      ownerContacts: '+380671112233',
      description: 'Grey cat with a red collar',
      city: 'Kyiv',
      lostDate: '2020-01-01',
      petTypeId,
      isFound: false,
      ...changes,
    };
  }

  function createTestPet(changes = {}) {
    return db.Pet.create(preparePetData(changes));
  }

  before(async () => {
    expect(process.env.NODE_ENV).to.equal('test');
    expect(db.sequelize.getDatabaseName()).to.equal('animals_test');

    await db.sequelize.authenticate();

    const [petType] = await db.PetTypes.findOrCreate({
      where: { type: 'Cat' },
    });

    petTypeId = petType.id;
  });

  beforeEach(async () => {
    await db.Pet.destroy({ where: {} });
  });

  after(async () => {
    await db.sequelize.close();
  });

  describe('POST /api/pets', () => {
    it('creates a pet with valid data', async () => {
      const petData = preparePetData();

      const response = await request(app)
        .post('/api/pets')
        .send(petData)
        .expect(201);

      expect(response.body.data).to.include(petData);
      expect(response.body.data.id).to.be.a('number');

      const savedPet = await db.Pet.findByPk(response.body.data.id);

      expect(savedPet).not.to.equal(null);
      expect(savedPet.get()).to.include(petData);
    });

    it('rejects a pet without a required name', async () => {
      const petData = preparePetData();
      delete petData.name;

      const response = await request(app).post('/api/pets').send(petData);

      expect(response.status, JSON.stringify(response.body)).to.be.oneOf([
        400, 422,
      ]);

      expect(await db.Pet.count()).to.equal(0);
    });

    it('rejects an incorrect contact format', async () => {
      const response = await request(app)
        .post('/api/pets')
        .send(preparePetData({ ownerContacts: 'invalid' }));

      expect(response.status, JSON.stringify(response.body)).to.be.oneOf([
        400, 422,
      ]);

      expect(await db.Pet.count()).to.equal(0);
    });
  });

  describe('GET /api/pets', () => {
    it('returns stored pets', async () => {
      const pet = await createTestPet();

      const response = await request(app).get('/api/pets').expect(200);

      expect(response.body.data).to.be.an('array').with.lengthOf(1);

      expect(response.body.data[0]).to.include({
        id: pet.id,
        name: pet.name,
      });
    });

    it('filters pets by found status', async () => {
      const foundPet = await createTestPet({ isFound: true });
      await createTestPet({ isFound: false });

      const response = await request(app)
        .get('/api/pets')
        .query({ isFound: 'true' })
        .expect(200);

      expect(response.body.data.map((pet) => pet.id)).to.deep.equal([
        foundPet.id,
      ]);

      expect(response.body.data[0].isFound).to.equal(true);
    });

    it('returns 400 for an incorrect found filter', async () => {
      await request(app)
        .get('/api/pets')
        .query({ isFound: 'maybe' })
        .expect(400);
    });
  });

  describe('GET /api/pets/:id', () => {
    it('returns an existing pet', async () => {
      const pet = await createTestPet();

      const response = await request(app)
        .get(`/api/pets/${pet.id}`)
        .expect(200);

      expect(response.body.data).to.include({
        id: pet.id,
        name: pet.name,
        petTypeId,
        isFound: false,
      });
    });

    it('returns 404 when the pet does not exist', async () => {
      await request(app).get('/api/pets/1').expect(404);
    });

    it('returns 400 for an incorrect ID', async () => {
      await request(app).get('/api/pets/abc').expect(400);
    });
  });

  describe('PATCH /api/pets/:id', () => {
    it('updates the pet status', async () => {
      const pet = await createTestPet();

      const response = await request(app)
        .patch(`/api/pets/${pet.id}`)
        .send({ isFound: true })
        .expect(200);

      expect(response.body.data).to.include({
        id: pet.id,
        isFound: true,
      });

      const updatedPet = await db.Pet.findByPk(pet.id);

      expect(updatedPet).not.to.equal(null);
      expect(updatedPet.isFound).to.equal(true);
    });

    it('returns 400 when isFound is not a boolean', async () => {
      const pet = await createTestPet();

      await request(app)
        .patch(`/api/pets/${pet.id}`)
        .send({ isFound: 'true' })
        .expect(400);

      const unchangedPet = await db.Pet.findByPk(pet.id);

      expect(unchangedPet).not.to.equal(null);
      expect(unchangedPet.isFound).to.equal(false);
    });

    it('returns 404 when the pet does not exist', async () => {
      await request(app)
        .patch('/api/pets/1')
        .send({ isFound: true })
        .expect(404);
    });
  });

  describe('DELETE /api/pets/:id', () => {
    it('deletes an existing pet', async () => {
      const pet = await createTestPet();

      const response = await request(app)
        .delete(`/api/pets/${pet.id}`)
        .expect(204);

      expect(response.text).to.equal('');
      expect(await db.Pet.findByPk(pet.id)).to.equal(null);
    });

    it('returns 404 when the pet does not exist', async () => {
      await request(app).delete('/api/pets/1').expect(404);
    });

    it('returns 400 for an incorrect ID', async () => {
      const pet = await createTestPet();

      await request(app).delete('/api/pets/abc').expect(400);

      expect(await db.Pet.findByPk(pet.id)).not.to.equal(null);
    });
  });
});
