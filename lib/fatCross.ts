import Tile from '@civ-clone/core-world/Tile';
import Tileset from '@civ-clone/core-world/Tileset';

/**
 * How far from its centre a tile may be and still be worked. Measured with the
 * world's own distance, so it means "radius 2, cut round" on any grid.
 *
 * On the square grid the 5x5 box around a tile has distances of 0, 1, √2, 2,
 * √5 (≈ 2.236) and, at its four corners only, 2√2 (≈ 2.828). 2.5 sits well
 * clear of both of the last two, so the cut drops exactly the corners: the
 * 21-tile "fat cross".
 */
export const fatCrossRadius = 2.5;

/**
 * Every tile closer to `centre` than `radius`, by the topology's `distance`,
 * taken from the topology's `area` of `⌊radius⌋` around it. A city's `Tiles`
 * rule returns this for its own tile.
 */
export const fatCross = (
  centre: Tile,
  radius: number = fatCrossRadius
): Tileset => {
  const world = centre.map(),
    topology = world.topology(),
    x = centre.x(),
    y = centre.y();

  // `area` keeps the order the topology documents (x-major on the square
  // grid) and `filter` keeps it too, so tiles that score the same are
  // offered to the city in the same order as ever.
  return Tileset.from(
    ...topology
      .area(x, y, Math.floor(radius))
      .filter(
        ([areaX, areaY]: [number, number]): boolean =>
          topology.distance(x, y, areaX, areaY) < radius
      )
      .map(([areaX, areaY]: [number, number]) => world.get(areaX, areaY))
  );
};

export default fatCross;
