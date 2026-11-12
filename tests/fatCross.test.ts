import {
  generateGenerator,
  generateWorld,
} from '@civ-clone/core-world/tests/lib/buildWorld';
import { fatCross, fatCrossRadius } from '../lib/fatCross';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';

class Flat extends Terrain {}

describe('fatCross', (): void => {
  // `generateGenerator` takes the height first.
  const buildWorld = (width: number, height: number): Promise<World> =>
      generateWorld(generateGenerator(height, width, Flat), new RuleRegistry()),
    coordinates = (tiles: Tile[]): [number, number][] =>
      tiles.map((tile: Tile): [number, number] => [tile.x(), tile.y()]),
    sortedKeys = (tiles: Tile[]): string[] =>
      tiles.map((tile: Tile): string => `${tile.x()},${tile.y()}`).sort(),
    // The 5x5 box from `getSurroundingArea(2)`, which is x-major, without
    // positions 0, 4, 20 and 24, its four corners.
    indexedFatCross = (tile: Tile): Tile[] =>
      tile
        .getSurroundingArea(2)
        .filter(
          (tile: Tile, i: number): boolean => ![0, 4, 20, 24].includes(i)
        );

  it('has a radius of 2.5', (): void => {
    expect(fatCrossRadius).equal(2.5);
  });

  it('is the 5x5 box without its corners, in x-major order', async (): Promise<void> => {
    const world = await buildWorld(40, 25),
      cross: [number, number][] = [];

    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
          continue;
        }

        cross.push([10 + dx, 10 + dy]);
      }
    }

    expect(coordinates(fatCross(world.get(10, 10)).entries())).eql(cross);
  });

  it('is the same tiles, in the same order, as the indexed box for every tile, across the seams', async (): Promise<void> => {
    const world = await buildWorld(9, 11);

    world.forEach((tile: Tile): void => {
      const actual = fatCross(tile).entries(),
        expected = indexedFatCross(tile);

      expect(actual.length).equal(21);
      expect(
        actual.every(
          (actualTile: Tile, i: number): boolean => actualTile === expected[i]
        ),
        `at ${tile.x()}, ${tile.y()}`
      ).true;
    });
  });

  it('is every tile within reach, once each, on a world smaller than 5x5', async (): Promise<void> => {
    const world = await buildWorld(3, 4);

    world.forEach((tile: Tile): void => {
      const actual = fatCross(tile).entries();

      expect(new Set(actual).size).equal(actual.length);
      expect(sortedKeys(actual)).eql(
        sortedKeys(
          world.filter(
            (other: Tile): boolean => tile.distanceFrom(other) < fatCrossRadius
          )
        )
      );
    });
  });

  it('takes another radius', async (): Promise<void> => {
    const world = await buildWorld(20, 20),
      centre = world.get(10, 10);

    expect(fatCross(centre, 1.5).entries().length).equal(9);
    expect(fatCross(centre, 1).entries()).eql([centre]);
    expect(fatCross(centre, 3.5).entries().length).equal(37);
  });
});
