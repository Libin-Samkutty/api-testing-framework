import { MockHandler, MockServer } from '../mock-server';

// -- Static data matching the real ReqRes API responses --

const USER_LIST_PAGE_1 = {
  page: 1,
  per_page: 6,
  total: 12,
  total_pages: 2,
  data: [
    { id: 1, email: 'george.bluth@reqres.in', first_name: 'George', last_name: 'Bluth', avatar: 'https://reqres.in/img/faces/1-image.jpg' },
    { id: 2, email: 'janet.weaver@reqres.in', first_name: 'Janet', last_name: 'Weaver', avatar: 'https://reqres.in/img/faces/2-image.jpg' },
    { id: 3, email: 'emma.wong@reqres.in', first_name: 'Emma', last_name: 'Wong', avatar: 'https://reqres.in/img/faces/3-image.jpg' },
    { id: 4, email: 'eve.holt@reqres.in', first_name: 'Eve', last_name: 'Holt', avatar: 'https://reqres.in/img/faces/4-image.jpg' },
    { id: 5, email: 'charles.morris@reqres.in', first_name: 'Charles', last_name: 'Morris', avatar: 'https://reqres.in/img/faces/5-image.jpg' },
    { id: 6, email: 'tracey.ramos@reqres.in', first_name: 'Tracey', last_name: 'Ramos', avatar: 'https://reqres.in/img/faces/6-image.jpg' },
  ],
  support: {
    url: 'https://reqres.in/#support-heading',
    text: 'To keep ReqRes free, contributions towards server costs are appreciated!',
  },
};

const USER_2 = {
  data: {
    id: 2,
    email: 'janet.weaver@reqres.in',
    first_name: 'Janet',
    last_name: 'Weaver',
    avatar: 'https://reqres.in/img/faces/2-image.jpg',
  },
  support: {
    url: 'https://reqres.in/#support-heading',
    text: 'To keep ReqRes free, contributions towards server costs are appreciated!',
  },
};

// -- Auth handlers --

export const loginHandler: MockHandler = (_req, body) => {
  const data = JSON.parse(body || '{}') as Record<string, unknown>;
  if (!data.email) {
    return { status: 400, body: { error: 'Missing email or username' } };
  }
  if (!data.password) {
    return { status: 400, body: { error: 'Missing password' } };
  }
  return { status: 200, body: { token: 'QpwL5tpe83ilfN2' } };
};

export const registerHandler: MockHandler = (_req, body) => {
  const data = JSON.parse(body || '{}') as Record<string, unknown>;
  if (!data.email) {
    return { status: 400, body: { error: 'Missing email or username' } };
  }
  if (!data.password) {
    return { status: 400, body: { error: 'Missing password' } };
  }
  return { status: 200, body: { id: 4, token: 'QpwL5tpe83ilfN2' } };
};

// -- User handlers --

export const listUsersHandler: MockHandler = () => ({
  status: 200,
  body: USER_LIST_PAGE_1,
});

export const getSingleUserHandler: MockHandler = () => ({
  status: 200,
  body: USER_2,
});

export const getUserNotFoundHandler: MockHandler = () => ({
  status: 404,
  body: {},
});

export const createUserHandler: MockHandler = (_req, body) => {
  const data = JSON.parse(body || '{}') as Record<string, unknown>;
  return {
    status: 201,
    body: {
      name: data.name,
      job: data.job,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    },
  };
};

export const updateUserHandler: MockHandler = (_req, body) => {
  const data = JSON.parse(body || '{}') as Record<string, unknown>;
  return {
    status: 200,
    body: {
      name: data.name,
      job: data.job,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const deleteUserHandler: MockHandler = () => ({
  status: 204,
  body: null,
});

// -- Registration helper --

export function registerReqResMockHandlers(server: MockServer): void {
  server.register('POST', '/api/login', loginHandler);
  server.register('POST', '/api/register', registerHandler);
  server.register('GET', '/api/users', listUsersHandler);
  server.register('GET', '/api/users/2', getSingleUserHandler);
  server.register('GET', '/api/users/9999', getUserNotFoundHandler);
  server.register('POST', '/api/users', createUserHandler);
  server.register('PUT', '/api/users/2', updateUserHandler);
  server.register('DELETE', '/api/users/2', deleteUserHandler);
}
