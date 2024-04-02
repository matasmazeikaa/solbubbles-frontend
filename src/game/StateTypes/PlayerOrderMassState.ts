//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.44
//

import { Schema, type } from "@colyseus/schema";

export class PlayerOrderMassState extends Schema {
  @type("number") public mass!: number;
  @type("number") public nCell!: number;
  @type("number") public nDiv!: number;
}
