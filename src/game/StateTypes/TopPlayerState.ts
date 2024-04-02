//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.44
//

import { Schema, type } from "@colyseus/schema";

export class TopPlayerState extends Schema {
  @type("string") public id!: string;
  @type("string") public address!: string;
  @type("number") public massTotal!: number;
  @type("number") public cryptoAmount!: number;
}
