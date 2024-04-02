export enum GameConfig {
  port = 3000,
  foodMass = 1,
  fireFood = 20,
  limitSplit = 16,
  startingSpeed = 6.25,
  defaultPlayerMass = 10,
  gameWidth = 5000,
  gameHeight = 5000,
  adminPass = "DEFAULT",
  gameMass = 20000,
  maxFood = 1000,
  slowBase = 4.5,
  logChat = 0,
  networkUpdateFactor = 40,
  maxHeartbeatInterval = 20000,
  newPlayerInitialPosition = "farthest",
  massLossRate = 1,
  minMassLoss = 50,
  mergeTimer = 20,
  cashoutCooldown = 0,
  maxRoomUserAmount = 100,
}

export enum VirusConfig {
  maxVirus = 50,
  fill = 0x33ff33,
  stroke = 0x19d119,
  strokeWidth = 10,
  defaultMassFrom = 100,
  defaultMassTo = 150,
  splitMass = 180,
}
