//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.44
//

import { Schema, type } from "@colyseus/schema";
import { Target } from "./Target";

export class VirusState extends Schema {
  @type("string") public id!: string;
  @type("number") public x!: number;
  @type("number") public y!: number;
  @type("number") public radius!: number;
  @type("number") public mass!: number;
  @type("number") public fill!: number;
  @type("number") public stroke!: number;
  @type("number") public strokeWidth!: number;
  @type("number") public speed!: number;
  @type(Target) public target: Target = new Target();
}
