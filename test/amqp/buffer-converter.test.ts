import { BufferConverter } from '../../src/amqp/buffer-converter';
import { expect } from '../helpers';

describe('BufferConverter', () => {
  it('should convert object', () => {
    const message = { prop: 123 };
    const buffer = BufferConverter.converter(message);
    expect(buffer.toString()).to.be.equals('{"prop":123}');
  });
  it('should convert string', () => {
    const message = '{ string message test }';
    const buffer = BufferConverter.converter(message);
    expect(buffer.toString()).to.be.equals(message);
  });
  it('should return empty when enter a number', () => {
    const message = 123;
    const buffer = BufferConverter.converter(message);
    expect(buffer.toString()).to.be.equals('');
  });
  it('should return empty when enter a function', () => {
    const message = () => {};
    const buffer = BufferConverter.converter(message);
    expect(buffer.toString()).to.be.equals('');
  });
});
