import test from 'node:test';
import assert from 'node:assert';

import { ClassRegistryParser } from '../src/ClassRegistryParser/ClassRegistryParser';
import { ScannedFile } from '../src/Scanner/ScannedFile';
import { InspectedClassMember } from '../src/ClassRegistry/InspectedClassMember';

function file(path: string, content: string): ScannedFile {
  return new ScannedFile(path, content);
}

test.describe('Unit: ClassParser', () => {
  test('extracts class name', () => {
    const registry = new ClassRegistryParser().parse([
      file('Foo.ts', `export class Foo {}`),
    ]);

    assert.strictEqual(registry.items.length, 1);
    assert.strictEqual(registry.items[0].name, 'Foo');
  });

  test('marks abstract class', () => {
    const registry = new ClassRegistryParser().parse([
      file('Foo.ts', `export abstract class Foo {}`),
    ]);

    assert.strictEqual(registry.items[0].abstract, true);
  });

  test('extracts JSDoc description', () => {
    const registry = new ClassRegistryParser().parse([
      file(
        'Foo.ts',
        `
        /**
         * Does something useful
         */
        export class Foo {}
      `,
      ),
    ]);

    assert.strictEqual(registry.items[0].description, 'Does something useful');
  });

  test('extracts parent class', () => {
    const registry = new ClassRegistryParser().parse([
      file('Foo.ts', `export class Foo extends Bar {}`),
    ]);

    assert.strictEqual(registry.items[0].parent, 'Bar');
  });

  test('extracts implemented interfaces', () => {
    const registry = new ClassRegistryParser().parse([
      file('Foo.ts', `export class Foo implements Bar, Baz {}`),
    ]);

    assert.deepStrictEqual(registry.items[0].interfaces, ['Bar', 'Baz']);
  });

  test('derives layer from subdirectory under src/', () => {
    const registry = new ClassRegistryParser().parse([
      file('src/domain/Foo.ts', `export class Foo {}`),
    ]);

    assert.strictEqual(registry.items[0].layer, 'domain');
  });

  test('uses root layer for files directly under src/', () => {
    const registry = new ClassRegistryParser().parse([
      file('src/Foo.ts', `export class Foo {}`),
    ]);

    assert.strictEqual(registry.items[0].layer, 'root');
  });

  test('extracts multiple classes from one file', () => {
    const registry = new ClassRegistryParser().parse([
      file(
        'Foo.ts',
        `
        export class Foo {}
        export class Bar {}
      `,
      ),
    ]);

    assert.strictEqual(registry.items.length, 2);
    assert.deepStrictEqual(
      registry.items.map((c) => c.name),
      ['Foo', 'Bar'],
    );
  });

  test('parses multiple files', () => {
    const registry = new ClassRegistryParser().parse([
      file('Foo.ts', `export class Foo {}`),
      file('Bar.ts', `export class Bar {}`),
    ]);

    assert.strictEqual(registry.items.length, 2);
  });

  test('tracks external imports', () => {
    const registry = new ClassRegistryParser().parse([
      file(
        'Foo.ts',
        `
        import { Injectable } from '@nestjs/common';
        export class Foo {}
      `,
      ),
    ]);

    assert.strictEqual(
      registry.getExternalSource('Injectable'),
      '@nestjs/common',
    );
  });

  test.describe('members', () => {
    test('extracts public field', () => {
      const [cls] = new ClassRegistryParser().parse([
        file(
          'Foo.ts',
          `
          export class Foo {
            public name: string = '';
          }
        `,
        ),
      ]).items;

      assert.deepStrictEqual(cls.members, [
        new InspectedClassMember('name', 'public', false, 'string'),
      ]);
    });

    test('extracts private and protected fields', () => {
      const [cls] = new ClassRegistryParser().parse([
        file(
          'Foo.ts',
          `
          export class Foo {
            private id: string;
            protected count: number;
          }
        `,
        ),
      ]).items;

      assert.deepStrictEqual(cls.members, [
        new InspectedClassMember('id', 'private', false, 'string'),
        new InspectedClassMember('count', 'protected', false, 'number'),
      ]);
    });

    test('extracts public getter', () => {
      const [cls] = new ClassRegistryParser().parse([
        file(
          'Foo.ts',
          `
          export class Foo {
            public get label(): string { return ''; }
          }
        `,
        ),
      ]).items;

      assert.deepStrictEqual(cls.members, [
        new InspectedClassMember('label', 'public', false, 'string'),
      ]);
    });

    test('extracts public and private methods', () => {
      const [cls] = new ClassRegistryParser().parse([
        file(
          'Foo.ts',
          `
          export class Foo {
            public greet(): void {}
            private helper(): string { return ''; }
          }
        `,
        ),
      ]).items;

      assert.deepStrictEqual(cls.members, [
        new InspectedClassMember('greet', 'public', true),
        new InspectedClassMember('helper', 'private', true),
      ]);
    });

    test('excludes constructor from methods', () => {
      const [cls] = new ClassRegistryParser().parse([
        file(
          'Foo.ts',
          `
          export class Foo {
            public constructor() {}
          }
        `,
        ),
      ]).items;

      assert.deepStrictEqual(cls.members, []);
    });

    test('extracts constructor parameter properties (single-line)', () => {
      const [cls] = new ClassRegistryParser().parse([
        file(
          'Foo.ts',
          `export class Foo { constructor(public readonly name: string, private id: number) {} }`,
        ),
      ]).items;

      assert.deepStrictEqual(cls.members, [
        new InspectedClassMember('name', 'public', false, 'string'),
        new InspectedClassMember('id', 'private', false, 'number'),
      ]);
    });

    test('extracts constructor parameter properties (multi-line)', () => {
      const [cls] = new ClassRegistryParser().parse([
        file(
          'Foo.ts',
          `
          export class Foo {
            constructor(
              public readonly name: string,
              private id: number,
            ) {}
          }
        `,
        ),
      ]).items;

      assert.deepStrictEqual(cls.members, [
        new InspectedClassMember('name', 'public', false, 'string'),
        new InspectedClassMember('id', 'private', false, 'number'),
      ]);
    });

    test('handles generic class with extends constraint', () => {
      const [cls] = new ClassRegistryParser().parse([
        file(
          'Foo.ts',
          `
          export abstract class EntityRepository<TEntity extends { id: string }> {
            public abstract getById(id: string): Promise<TEntity | undefined>;
            public abstract save(entity: TEntity): Promise<void>;
          }
        `,
        ),
      ]).items;

      assert.deepStrictEqual(cls.members, [
        new InspectedClassMember('getById', 'public', true),
        new InspectedClassMember('save', 'public', true),
      ]);
    });

    test('handles multi-line generic class with extends constraint', () => {
      const [cls] = new ClassRegistryParser().parse([
        file(
          'Foo.ts',
          `
          export abstract class PrismaRepository<
            TEntity extends { id: string },
            TModel extends { id: string },
          > {
            public async find(): Promise<TEntity[]> { return []; }
          }
        `,
        ),
      ]).items;

      assert.deepStrictEqual(cls.members, [
        new InspectedClassMember('find', 'public', true),
      ]);
    });
  });
});
