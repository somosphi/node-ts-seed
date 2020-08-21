import { sinon, assert, expect } from './helpers';
import * as errors from '../src/errors';

describe('CodedError', () => {
  class TestCodedError extends errors.CodedError {}

  it('should set property code and call toJSON on use JSON.stringify', () => {
    const error = new TestCodedError('TEST', 'Error test', 400);
    const fakeToJSON = sinon.fake.returns(error.toJSON());
    error.toJSON = fakeToJSON;
    JSON.stringify(error);
    expect(error.code).to.be.eql('TEST');
    expect(error.message).to.be.eql('Error test');
    expect(error.statusCode).to.be.eql(400);
    assert(fakeToJSON.calledOnce);
  });
});

describe('DetailedCodedError', () => {
  class TestDetailedCodedError extends errors.CodedError {}

  it('should set property code and call toJSON on use JSON.stringify', () => {
    const error = new TestDetailedCodedError('TEST', 'Error test', 400, {
      message: 'Ola mundo',
    });
    const fakeToJSON = sinon.fake.returns(error.toJSON());
    error.toJSON = fakeToJSON;
    JSON.stringify(error);
    expect(error.code).to.be.eql('TEST');
    expect(error.message).to.be.eql('Error test');
    expect(error.details).to.be.eql({ message: 'Ola mundo' });
    expect(error.statusCode).to.be.eql(400);
    assert(fakeToJSON.calledOnce);
  });
});
