import * as PIXI from "pixi.js";
import { Group, Layer, Stage } from "@pixi/layers";
import { Viewport } from "pixi-viewport";
import { Room, Client } from "colyseus.js";
import { FOOD_CONFIG, PLAYER_CONFIG } from "@/constants";
import { hslToHex } from "@/utils/hslToHex";
import { Graphics } from "pixi.js";
import type { GameState } from "@/game/StateTypes/index";
import type { Player as PlayerState } from "@/game/StateTypes/Player";
import type { CellState } from "@/game/StateTypes/CellState";
import { getJWT } from "@/utils/tokens";
import { useToast } from "vue-toast-notification";
import { useGameStore } from "@/stores/game";
import { ref } from "vue";
import type { MassFoodState } from "./StateTypes/MassFoodState";
import type { TopPlayerState } from "./StateTypes/TopPlayerState";
import { useGame } from "@/hooks/useGame";
import { useBalanceStore } from "@/stores/balanceStore";
import { useWalletStore } from "@/stores/walletStore";

const WORLD_SIZE = 5000;

const MAX_FPS_MS = 1000 / 60;

const lerp = function (value1: number, value2: number, amount: number) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
};

const GAME_ZINDEXES = {
  FOOD: 1,
  PLAYER: 2,
  VIRUS: 3,
} as const;

const { lastActionTick, roomSplTokenEntryFee } = useGame();

export class Application {
  players: { [id: string]: PlayerState } = {};
  playerCellsGraphics: { [id: string]: PIXI.Graphics } = {};
  playerCells: { [id: string]: CellState } = {};
  food: { [id: string]: PIXI.Graphics } = {};
  virus: { [id: string]: PIXI.Graphics } = {};
  massFood: { [id: string]: PIXI.Graphics } = {};
  isPlayerJoined = false;
  reenviar = true;
  stage: PIXI.Container;
  renderer: PIXI.IRenderer;

  // Draw layers
  virusLayer: Layer;
  foodLayer: Layer;
  playerLayer: Layer;

  //Groups
  virusGroup: Group;
  playerGroup: Group;
  foodGroup: Group;

  currentX: number;
  currentY: number;

  client = new Client(import.meta.env.VITE_WS_API_URL);
  room: Room<GameState>;
  roomName: string;

  viewport: Viewport;

  elapsedTime = 0;
  lastTime = 0;
  splTokens = ref(0);
  lastActionTick = ref(0);
  ping = ref(0);
  lastPing = 0;
  lastPong = 0;

  handleKeyDownListener: any;
  handleTouchListener: any;
  handleKeyUpListener: any;
  handleResizeListener: any;
  handleAnimationFrame: any;

  leaderboard = ref<TopPlayerState[]>([]);

  constructor() {
    this.renderer = PIXI.autoDetectRenderer({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x202230,
    });

    this.viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: WORLD_SIZE,
      worldHeight: WORLD_SIZE,
    });

    const boundaries = new PIXI.Graphics();
    boundaries.beginFill(0x202230);
    boundaries.lineStyle(1, 0x313449);
    boundaries.drawRoundedRect(0, 0, WORLD_SIZE, WORLD_SIZE, 30);

    this.stage = new Stage();
    this.stage.addChild(this.viewport);

    this.viewport.addChild(boundaries);

    this.virusGroup = new Group(GAME_ZINDEXES.VIRUS, true);
    this.playerGroup = new Group(GAME_ZINDEXES.PLAYER, true);
    this.foodGroup = new Group(GAME_ZINDEXES.FOOD, true);

    this.foodLayer = this.viewport.addChild(new Layer(this.foodGroup));
    this.playerLayer = this.viewport.addChild(new Layer(this.playerGroup));
    this.virusLayer = this.viewport.addChild(new Layer(this.virusGroup));

    this.playerGroup.on("sort", (sprite) => {
      sprite.zOrder = sprite.width;
    });

    this.viewport.on("mousemove", (mouse) => {
      if (this.isPlayerJoined) {
        this.currentX = mouse.clientX - window.innerWidth / 2;
        this.currentY = mouse.clientY - window.innerHeight / 2;

        this.room.send("mouse", { x: this.currentX, y: this.currentY });
      }
    });

    this.viewport.on("touchstart", (mouse) => {
      if (this.isPlayerJoined) {
        this.currentX = mouse.clientX - window.innerWidth / 2;
        this.currentY = mouse.clientY - window.innerHeight / 2;

        this.room.send("mouse", { x: this.currentX, y: this.currentY });
      }
    });

    this.viewport.on("touchmove", (mouse) => {
      if (this.isPlayerJoined) {
        this.currentX = mouse.clientX - window.innerWidth / 2;
        this.currentY = mouse.clientY - window.innerHeight / 2;

        this.room.send("mouse", { x: this.currentX, y: this.currentY });
      }
    });

    this.handleKeyDownListener = this.handleKeyDown.bind(this);
    this.handleKeyUpListener = this.setReenviarTrue.bind(this);
    this.handleResizeListener = this.onResize.bind(this);

    window.addEventListener("keydown", this.handleKeyDownListener, false);
    window.addEventListener("keyup", this.handleKeyUpListener, false);
    window.addEventListener("resize", this.handleResizeListener, false);
  }

  render() {
    this.renderer.render(this.stage as any);
  }

  get view() {
    return this.renderer.view;
  }

  get screen() {
    return this.renderer.screen;
  }

  onResize() {
    this.renderer.resize(window.innerWidth, window.innerHeight);
    this.viewport.resize(
      window.innerWidth,
      window.innerHeight,
      WORLD_SIZE,
      WORLD_SIZE
    );

    this.viewport.update(0);
  }

  drawBurst(target, x, y, sides, innerRadius, outerRadius, angle = 0) {
    const step = (Math.PI * 2) / sides;
    const halfStep = step / 2;
    const qtrStep = step / 4;
    const start = (angle / 180) * Math.PI;
    let n, dx, dy, cx, cy;

    target.moveTo(
      x + Math.cos(start) * outerRadius,
      y - Math.sin(start) * outerRadius
    );

    for (n = 1; n <= sides; ++n) {
      cx =
        x +
        Math.cos(start + step * n - qtrStep * 3) *
          (innerRadius / Math.cos(qtrStep));
      cy =
        y -
        Math.sin(start + step * n - qtrStep * 3) *
          (innerRadius / Math.cos(qtrStep));
      dx = x + Math.cos(start + step * n - halfStep) * innerRadius;
      dy = y - Math.sin(start + step * n - halfStep) * innerRadius;
      target.quadraticCurveTo(cx, cy, dx, dy);
      cx =
        x +
        Math.cos(start + step * n - qtrStep) *
          (innerRadius / Math.cos(qtrStep));
      cy =
        y -
        Math.sin(start + step * n - qtrStep) *
          (innerRadius / Math.cos(qtrStep));
      dx = x + Math.cos(start + step * n) * outerRadius;
      dy = y - Math.sin(start + step * n) * outerRadius;
      target.quadraticCurveTo(cx, cy, dx, dy);
    }
  }

  async drawCell(graphics: PIXI.Graphics, cell: CellState, hue: number) {
    const fontSize = Math.max(cell.radius / 3, 24);

    const textNumber = cell.splTokens;

    // const beeSvg =
    //   "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/bee.svg";
    // const beeTexture = await PIXI.Texture.fromURL(beeSvg);
    // const bee = new PIXI.Sprite(beeTexture);

    // graphics.addChild(bee);

    const splLamportsText = new PIXI.Text(`${textNumber}¢`, {
      fontFamily: "Arial",
      fontSize,
      fill: "white",
      align: "center",
      strokeThickness: 8,
    });

    const realGraphics = graphics || new Graphics();

    this.drawCircle(realGraphics, hue, cell.radius, PLAYER_CONFIG.BORDER);

    console.log(realGraphics.width);
    console.log(cell.radius);

    splLamportsText.anchor.set(0.5, 0.5);

    realGraphics.zOrder = 100;

    // bee.anchor.set(0.5, 0.5);
    // realGraphics.addChild(bee);
    realGraphics.addChild(splLamportsText);

    return realGraphics;
  }

  drawCircle(
    graphics: PIXI.Graphics,
    hue: number,
    radius: number,
    lineWidth: number
  ) {
    if (!graphics) return;

    graphics?.clear();
    graphics.children.forEach((child) => child.destroy());
    graphics.lineStyle(lineWidth, hslToHex(hue, 100, 45));
    graphics.beginFill(hslToHex(hue, 100, 50));
    graphics.drawCircle(0, 0, radius);

    graphics.endFill();
  }

  drawVirus(graphics: PIXI.Graphics, virus: any) {
    graphics?.clear();

    graphics.lineStyle(virus.strokeWidth, virus.stroke);
    graphics.beginFill(virus.fill);
    // graphics.drawCircle(0, 0, virus.radius);

    console.log(virus.rotation, "rotation");

    this.drawBurst(
      graphics,
      0,
      0,
      5,
      virus.radius,
      virus.radius * 0.8,
      virus.rotation
    );

    graphics.hello = "world";

    graphics.endFill();
  }

  setReenviarTrue() {
    this.reenviar = true;
  }

  cleanUp() {
    this.isPlayerJoined = false;

    Object.values(this.playerCellsGraphics).forEach((graphics) => {
      graphics.destroy(true);
    });

    Object.values(this.food).forEach((graphics) => {
      graphics.destroy(true);
    });

    Object.values(this.virus).forEach((graphics) => {
      graphics.destroy(true);
    });

    Object.values(this.massFood).forEach((graphics) => {
      graphics.destroy(true);
    });

    this.players = {};
    this.playerCellsGraphics = {};
    this.playerCells = {};
    this.food = {};
    this.virus = {};
    this.massFood = {};

    this.viewport.destroy();

    localStorage.removeItem("roomId");
    localStorage.removeItem("sessionId");

    window.removeEventListener("keydown", this.handleKeyDownListener, false);
    window.removeEventListener("keyup", this.handleKeyUpListener, false);
    window.removeEventListener("resize", this.handleResizeListener, false);
    window.cancelAnimationFrame(this.handleAnimationFrame);
  }

  rejoin() {
    this.room.send("rejoin");
    useGameStore().gameSettings.isCashedOut = false;
    useGameStore().gameSettings.isDead = false;
  }

  handleKeyDown(event: KeyboardEvent) {
    const key = event.key;

    if (key === "w" && this.reenviar) {
      this.room.send("fire-food");
      this.reenviar = false;
    }

    if (key === " " && this.reenviar) {
      this.room.send("split");
      this.reenviar = false;
    }

    if ((key === "q" || key === "Q") && this.reenviar) {
      this.cashOut();
      this.reenviar = false;
    }
  }

  cashOut() {
    this.room.send("cash-out");
  }

  startPing() {
    this.lastPing = Date.now();
    this.room.send("ping");
  }

  async connect(roomName: string, sessionId?: string) {
    try {
      this.room =
        roomName && sessionId
          ? await this.client.reconnect(roomName, sessionId)
          : await this.client.joinOrCreate<GameState>(roomName, {
              jwt: getJWT(),
              publicKey: useWalletStore().publicKey,
            });

      this.handleAnimationFrame = window.requestAnimationFrame(this.tickGame);

      localStorage.setItem("roomId", this.room.id);
      localStorage.setItem("sessionId", this.room.sessionId);

      this.startPing();

      this.room.state.players.onAdd = (player, sessionId: string) => {
        if (player.id === this.room.sessionId) {
          this.isPlayerJoined = true;
          this.viewport.moveCenter(player.x, player.y);
        }

        this.players[sessionId] = player;

        player.cells.onAdd = (cell) => {
          this.players[sessionId] = player;

          console.log(cell.uiCryptoAmount);

          cell.onChange = () => {
            this.players[sessionId] = player;

            if (this.playerCellsGraphics[cell.id]) {
              this.drawCell(
                this.playerCellsGraphics[cell.id],
                cell,
                player.hue
              );
              return;
            }

            const graphics = new PIXI.Graphics();

            this.drawCell(graphics, cell, player.hue);

            graphics.x = cell.x;
            graphics.y = cell.y;

            this.playerLayer.addChild(graphics);
            this.playerCellsGraphics[cell.id] = graphics;

            this.playerCells[cell.id] = cell;
          };
        };

        player.cells.onRemove = (cell) => {
          if (this.playerCellsGraphics[cell.id]) {
            this.viewport.removeChild(this.playerCellsGraphics[cell.id]);
            this.playerCellsGraphics[cell.id].destroy();
            delete this.playerCellsGraphics[cell.id];
            delete this.playerCells[cell.id];
          }
        };

        player.onChange = () => {
          if (player.id === this.room.sessionId) {
            lastActionTick.value = player.lastActionTick;

            const cellCount = player.cells.length;

            const maxCellMultiplier = Math.min(
              Math.max(parseInt(String(cellCount)), 1),
              4
            );

            const playerZoomOutWidth = player.massTotal * 2;

            const widthToScale =
              playerZoomOutWidth > 1000
                ? 1000
                : lerp(playerZoomOutWidth * 2, this.viewport.width, 0.1);

            this.viewport.fitWidth(
              window.innerWidth + widthToScale,
              true,
              true,
              false
            );
          }
        };
      };

      this.room.state.virus.onAdd = (virus) => {
        const graphics = new PIXI.Graphics();

        this.drawVirus(graphics, virus);

        graphics.x = virus.x;
        graphics.y = virus.y;

        this.virusLayer.addChild(graphics);

        this.virus[virus.id] = graphics;
      };

      this.room.state.food.onAdd = (food) => {
        const graphics = new PIXI.Graphics();

        this.drawCircle(graphics, food.hue, food.radius, FOOD_CONFIG.BORDER);

        graphics.x = food.x;
        graphics.y = food.y;

        graphics.zOrder = -1;

        this.foodLayer.addChild(graphics);

        this.food[food.id] = graphics;
      };

      this.room.state.massFood.onAdd = (massFood) => {
        const graphics = new PIXI.Graphics();

        this.drawCircle(
          graphics,
          massFood.hue,
          massFood.radius,
          PLAYER_CONFIG.BORDER
        );

        graphics.x = massFood.x;
        graphics.y = massFood.y;

        graphics.zOrder = -1;

        this.foodLayer.addChild(graphics);

        this.massFood[massFood.id] = graphics;
      };

      this.room.onStateChange((state) => {
        this.leaderboard.value = state.leaderboard as TopPlayerState[];
      });

      this.room.state.leaderboard.onRemove = (leaderboardPlayer) => {
        delete useGameStore().leaderboard[leaderboardPlayer.id];
      };

      this.room.state.virus.onRemove = (virus) => {
        this.viewport.removeChild(this.virus[virus.id]);
        this.virus[virus.id].destroy();
        delete this.virus[virus.id];
      };

      this.room.state.food.onRemove = (food) => {
        this.viewport.removeChild(this.food[food.id]);
        this.food[food.id].destroy();
        delete this.food[food.id];
      };

      this.room.state.massFood.onRemove = (massFood) => {
        this.viewport.removeChild(this.massFood[massFood.id]);
        this.massFood[massFood.id].destroy();
        delete this.massFood[massFood.id];
      };

      this.room.state.players.onRemove = (player, sessionId: string) => {
        if (player.id === this.room.sessionId) {
          this.isPlayerJoined = false;
        }

        for (const cell of player.cells) {
          if (this.playerCellsGraphics[cell.id]) {
            this.viewport.removeChild(this.playerCellsGraphics[cell.id]);
            this.playerCellsGraphics[cell.id].destroy();
            delete this.playerCellsGraphics[cell.id];
            delete this.playerCells[cell.id];
          }
        }

        delete this.players[sessionId];
      };

      this.room.onMessage(
        "cash-out-success",
        (data: { amountWon: number; newDepositedBalance: number }) => {
          useGameStore().gameSettings.isCashedOut = true;

          useBalanceStore().updateAllBalances();
          useGameStore().player.splTokens = data.amountWon;
        }
      );

      this.room.onMessage("death", (data) => {
        useGameStore().gameSettings.isDead = true;
        useGameStore().player.splTokens = data.splTokens;
      });

      this.room.onMessage("room-info", (data) => {
        console.log(data);
        roomSplTokenEntryFee.value = data.roomSplTokenEntryFee;
      });

      this.room.onMessage("pong", () => {
        this.lastPong = Date.now();

        this.ping.value = this.lastPong - this.lastPing;

        setTimeout(() => {
          this.startPing();
        }, 1000);
      });

      this.room.onLeave(() => {
        this.isPlayerJoined = false;
        useGameStore().gameSettings.isCashedOut = false;
        localStorage.removeItem("roomId");
        localStorage.removeItem("sessionId");
      });
    } catch (error: any) {
      const toast = useToast();
      const walletStore = useWalletStore();

      localStorage.removeItem("roomId");
      localStorage.removeItem("sessionId");

      if (error.code === 4212) {
        toast.error(
          "30s have passed you have been kicked out. Your entry fee will be returned."
        );
      }

      if (error.code === 400) {
        walletStore.disconnect();
        toast.error(error.message);
      }

      toast.error(error.message);

      throw Error(error);
    }
  }

  private tickGame = (now: number) => {
    if (!this.room?.state) {
      return;
    }

    this.elapsedTime = now - this.lastTime;

    if (this.elapsedTime >= MAX_FPS_MS) {
      this.fixedTick();
      this.lastTime = now;
    }

    this.renderer.render(this.stage as any);

    this.handleAnimationFrame = requestAnimationFrame(this.tickGame);
  };

  private fixedTick() {
    let playerCenterX = 0;
    let playerCenterY = 0;

    let currPlayerCellCount = 0;

    Object.values(this.players).forEach((player) => {
      player.cells.forEach((cell) => {
        if (!this.playerCellsGraphics[cell.id]) {
          return;
        }

        this.playerCellsGraphics[cell.id].x = lerp(
          this.playerCellsGraphics[cell.id].x,
          cell.x,
          0.4
        );
        this.playerCellsGraphics[cell.id].y = lerp(
          this.playerCellsGraphics[cell.id].y,
          cell.y,
          0.4
        );

        if (player.id === this.room.sessionId) {
          playerCenterX += this.playerCellsGraphics[cell.id].x;
          playerCenterY += this.playerCellsGraphics[cell.id].y;
          currPlayerCellCount++;
        }
      });

      if (player.id === this.room.sessionId) {
        const newCenterX = playerCenterX / currPlayerCellCount;
        const newCenterY = playerCenterY / currPlayerCellCount;

        this.viewport.moveCenter(newCenterX, newCenterY);
      }
    });

    this.room.state.massFood
      .filter((mass) => mass.speed > 0)
      .forEach((massFood: MassFoodState) => {
        if (!this.massFood[massFood.id]) {
          return;
        }

        this.massFood[massFood.id].x = lerp(
          this.massFood[massFood.id].x,
          massFood.x,
          0.4
        );
        this.massFood[massFood.id].y = lerp(
          this.massFood[massFood.id].y,
          massFood.y,
          0.4
        );
      });

    this.room.state.virus.forEach((virus) => {
      if (!this.virus[virus.id]) {
        return;
      }

      this.virus[virus.id].x = lerp(this.virus[virus.id].x, virus.x, 0.4);
      this.virus[virus.id].y = lerp(this.virus[virus.id].y, virus.y, 0.4);

      // add spinning animation to virus
      this.virus[virus.id].rotation =
        (this.virus[virus.id].rotation + 0.03) % 360;

      this.drawVirus(this.virus[virus.id], {
        ...virus,
        radius: lerp(this.virus[virus.id].width / 2, virus.radius, 0.4),
        rotation: this.virus[virus.id].rotation,
      });
    });
  }
}
