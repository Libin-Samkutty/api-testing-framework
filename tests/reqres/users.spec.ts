import { test, expect } from '../fixtures/api.fixture';
import { UserFactory } from '../../src/factories/user.factory';

test.describe('ReqRes - Users CRUD', () => {
  test('List users - page 1', async ({ reqresUsers }) => {
    const res = await reqresUsers.listUsers(1);

    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.data.length).toBeGreaterThan(0);

    const firstUser = res.body.data[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('first_name');
    expect(firstUser).toHaveProperty('last_name');
    expect(firstUser).toHaveProperty('avatar');
  });

  test('Get single user', async ({ reqresUsers }) => {
    const res = await reqresUsers.getUser(2);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(2);
    expect(res.body.data.email).toBeTruthy();
  });

  test('Get non-existent user → 404', async ({ reqresUsers }) => {
    const res = await reqresUsers.getUserNotFound(9999);

    expect(res.status).toBe(404);
  });

  test('Create user → returns name, job, id, createdAt', async ({ reqresUsers }) => {
    const payload = UserFactory.reqresCreateUser({ name: 'Jane Doe', job: 'QA Engineer' });
    const res = await reqresUsers.createUser(payload);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe(payload.name);
    expect(res.body.job).toBe(payload.job);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('createdAt');
  });

  test('Update user → returns updated fields', async ({ reqresUsers }) => {
    const res = await reqresUsers.updateUser(2, { name: 'Updated Name', job: 'Senior QA' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
    expect(res.body.job).toBe('Senior QA');
  });

  test('Delete user → 204 No Content', async ({ reqresUsers }) => {
    const res = await reqresUsers.deleteUser(2);

    expect(res.status).toBe(204);
  });
});