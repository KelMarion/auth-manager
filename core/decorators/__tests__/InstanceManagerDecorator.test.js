jest.mock('../InstanceManagerDecorator');
import InstanceManagerDecorator from '../InstanceManagerDecorator';
// const InstanceManagerDecorator = require('../InstanceManagerDecorator');

function sum(a, b) {
  return a + b;
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});