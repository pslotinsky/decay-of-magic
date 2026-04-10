import test from 'node:test';
import assert from 'node:assert';

import { InspectedClass } from '../src/ClassRegistry/InspectedClass';
import { InspectedClassMember } from '../src/ClassRegistry/InspectedClassMember';
import { InspectedClassRelation } from '../src/ClassRegistry/InspectedClassRelation';

function cls(name: string, members?: InspectedClassMember[]): InspectedClass {
  return new InspectedClass({
    name,
    file: 'Foo.ts',
    layer: 'root',
    body: '',
    abstract: false,
    members,
  });
}

test.describe('Unit: InspectedClassMember', () => {
  test('public method', () => {
    assert.strictEqual(
      new InspectedClassMember('greet', 'public', true).toString(),
      '+greet()',
    );
  });

  test('protected method', () => {
    assert.strictEqual(
      new InspectedClassMember('render', 'protected', true).toString(),
      '#render()',
    );
  });

  test('private method', () => {
    assert.strictEqual(
      new InspectedClassMember('helper', 'private', true).toString(),
      '-helper()',
    );
  });

  test('public field with type', () => {
    assert.strictEqual(
      new InspectedClassMember('name', 'public', false, 'string').toString(),
      '+string name',
    );
  });

  test('private field with type', () => {
    assert.strictEqual(
      new InspectedClassMember('id', 'private', false, 'number').toString(),
      '-number id',
    );
  });

  test('field without type', () => {
    assert.strictEqual(
      new InspectedClassMember('value', 'public', false).toString(),
      '+value',
    );
  });
});

test.describe('Unit: InspectedClassRelation', () => {
  test('inheritance', () => {
    assert.strictEqual(
      new InspectedClassRelation('Dog', 'Animal', '--|>').toString(),
      'Dog --|> Animal',
    );
  });

  test('interface implementation', () => {
    assert.strictEqual(
      new InspectedClassRelation('Foo', 'IFoo', '..|>').toString(),
      'Foo ..|> IFoo',
    );
  });

  test('composition', () => {
    assert.strictEqual(
      new InspectedClassRelation('Foo', 'Bar', '*--').toString(),
      'Foo *-- Bar',
    );
  });

  test('usage', () => {
    assert.strictEqual(
      new InspectedClassRelation('Foo', 'Bar', '-->').toString(),
      'Foo --> Bar',
    );
  });
});

test.describe('Unit: InspectedClass', () => {
  test('class without members', () => {
    assert.strictEqual(cls('Foo').toString(), 'class Foo');
  });

  test('class with empty members array', () => {
    assert.strictEqual(cls('Foo', []).toString(), 'class Foo');
  });

  test('class with one method', () => {
    assert.strictEqual(
      cls('Foo', [
        new InspectedClassMember('greet', 'public', true),
      ]).toString(),
      'class Foo {\n  +greet()\n}',
    );
  });

  test('class with mixed members', () => {
    assert.strictEqual(
      cls('Foo', [
        new InspectedClassMember('name', 'public', false, 'string'),
        new InspectedClassMember('id', 'private', false, 'number'),
        new InspectedClassMember('greet', 'public', true),
      ]).toString(),
      'class Foo {\n  +string name\n  -number id\n  +greet()\n}',
    );
  });
});
