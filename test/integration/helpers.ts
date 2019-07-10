import supertest from 'supertest';
import { expect, assert } from 'chai';
import { httpServer } from '../../src';
import { logger } from '../../src/logger';

logger.pause();

const request = supertest(httpServer.getApp());

export { expect, assert, request };
