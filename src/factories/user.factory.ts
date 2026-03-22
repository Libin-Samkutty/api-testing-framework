import { faker } from '@faker-js/faker';
import {
  ReqResLoginPayload,
  ReqResRegisterPayload,
  ReqResCreateUserPayload,
} from '../types/reqres.types';
import { RWRegisterPayload, RWLoginPayload } from '../types/realworld.types';
import { REQRES_CREDENTIALS } from '../config/environment';

export class UserFactory {
  // ── ReqRes ──

  static reqresValidLogin(): ReqResLoginPayload {
    return {
      email: REQRES_CREDENTIALS.VALID_EMAIL,
      password: REQRES_CREDENTIALS.VALID_PASSWORD,
    };
  }

  static reqresLoginMissingPassword(): ReqResLoginPayload {
    return { email: REQRES_CREDENTIALS.VALID_EMAIL };
  }

  static reqresValidRegister(): ReqResRegisterPayload {
    return {
      email: REQRES_CREDENTIALS.REGISTER_EMAIL,
      password: REQRES_CREDENTIALS.REGISTER_PASSWORD,
    };
  }

  static reqresRegisterMissingPassword(): ReqResRegisterPayload {
    return { email: REQRES_CREDENTIALS.REGISTER_EMAIL };
  }

  static reqresCreateUser(overrides?: Partial<ReqResCreateUserPayload>): ReqResCreateUserPayload {
    return {
      name: faker.person.fullName(),
      job: faker.person.jobTitle(),
      ...overrides,
    };
  }

  // ── RealWorld ──

  static realworldRegister(overrides?: Partial<RWRegisterPayload['user']>): RWRegisterPayload {
    const suffix = faker.string.alphanumeric(8);
    return {
      user: {
        username: `testuser_${suffix}`,
        email: `testuser_${suffix}@test.local`,
        password: 'Password123!',
        ...overrides,
      },
    };
  }

  static realworldLogin(email: string, password: string): RWLoginPayload {
    return { user: { email, password } };
  }

  static realworldLoginInvalid(): RWLoginPayload {
    return { user: { email: 'nonexistent@test.local', password: 'wrongpassword' } };
  }
}