//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.44
//

import { Schema, type } from "@colyseus/schema";

export class CellState extends Schema {
  @type("string") public id!: string;
  @type("string") public createdPlayerId!: string;
  @type("number") public mass!: number;
  @type("number") public x!: number;
  @type("number") public y!: number;
  @type("number") public radius!: number;
  @type("number") public speed!: number;
  @type("number") public cryptoAmount!: number;
}
