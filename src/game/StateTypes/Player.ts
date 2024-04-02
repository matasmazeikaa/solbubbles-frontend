//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.44
//

import { Schema, type, ArraySchema } from "@colyseus/schema";
import { CellState } from "./CellState";
import { Target } from "./Target";

export class Player extends Schema {
  @type("number") public radius!: number;
  @type([CellState]) public cells: ArraySchema<CellState> =
    new ArraySchema<CellState>();
  @type("number") public massTotal!: number;
  @type("string") public id!: string;
  @type("number") public x!: number;
  @type("number") public y!: number;
  @type("number") public w!: number;
  @type("number") public h!: number;
  @type("number") public hue!: number;
  @type("number") public angle!: number;
  @type("string") public type!: string;
  @type("number") public cryptoAmount!: number;
  @type("number") public lastActionTick!: number;
  @type("number") public speed!: number;
  @type("string") public address!: string;
  @type("string") public roomId!: string;
  @type(Target) public target: Target = new Target();
  @type("boolean") public isCashedOut!: boolean;
}
