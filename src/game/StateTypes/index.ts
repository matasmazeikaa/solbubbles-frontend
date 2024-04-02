//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.44
//

import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import { Player } from "./Player";
import { FoodState } from "./FoodState";
import { VirusState } from "./VirusState";
import { PlayerOrderMassState } from "./PlayerOrderMassState";
import { MassFoodState } from "./MassFoodState";
import { TopPlayerState } from "./TopPlayerState";

export class GameState extends Schema {
  @type({ map: Player }) public players: MapSchema<Player> =
    new MapSchema<Player>();
  @type([FoodState]) public food: ArraySchema<FoodState> =
    new ArraySchema<FoodState>();
  @type([VirusState]) public virus: ArraySchema<VirusState> =
    new ArraySchema<VirusState>();
  @type([PlayerOrderMassState])
  public playerOrderMass: ArraySchema<PlayerOrderMassState> = new ArraySchema<PlayerOrderMassState>();
  @type([MassFoodState]) public massFood: ArraySchema<MassFoodState> =
    new ArraySchema<MassFoodState>();
  @type([TopPlayerState]) public leaderboard: ArraySchema<TopPlayerState> =
    new ArraySchema<TopPlayerState>();
}
