import { faker } from '@faker-js/faker';
import {
  RWCreateArticlePayload,
  RWUpdateArticlePayload,
  RWCreateCommentPayload,
} from '../types/realworld.types';

export class ArticleFactory {
  static create(overrides?: Partial<RWCreateArticlePayload['article']>): RWCreateArticlePayload {
    return {
      article: {
        title: `Test Article ${faker.string.alphanumeric(8)}`,
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(2),
        tagList: [faker.word.noun(), faker.word.noun()],
        ...overrides,
      },
    };
  }

  static update(overrides?: Partial<RWUpdateArticlePayload['article']>): RWUpdateArticlePayload {
    return {
      article: {
        title: `Updated Article ${faker.string.alphanumeric(8)}`,
        ...overrides,
      },
    };
  }

  static comment(overrides?: Partial<RWCreateCommentPayload['comment']>): RWCreateCommentPayload {
    return {
      comment: {
        body: faker.lorem.sentence(),
        ...overrides,
      },
    };
  }
}