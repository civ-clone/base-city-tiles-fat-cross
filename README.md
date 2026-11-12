# base-city-tiles-fat-cross

The tiles a city may work, as a library for a ruleset's `Tiles` rule:

- `lib/fatCross`: `fatCross(centre, radius = fatCrossRadius)`, every tile closer to `centre` than `radius` by the
  world topology's own `distance`, in the order of the topology's `area` (x-major on the square grid).
  `fatCrossRadius` is 2.5: on the square grid that is the 5x5 box without its four corners, the 21-tile "fat cross".

A library: it registers no rules. See `civ1-city` for Civilization's `Tiles` rule.
