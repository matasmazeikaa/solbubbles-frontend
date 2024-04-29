import * as PIXI from "pixi.js";
import { Group, Layer, Stage } from "@pixi/layers";
import { Viewport } from "pixi-viewport";
import { Room, Client } from "colyseus.js";
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
import { useServersStore } from "@/stores/serversStore";

const WORLD_SIZE = 5000;

const lerp = function (start: number, end: number, t: number) {
  return start * (1 - t) + end * t;
};

const GAME_ZINDEXES = {
  FOOD: 1,
  PLAYER: 2,
  VIRUS: 3,
} as const;

const { lastActionTick, roomSplTokenEntryFee } = useGame();

export class Application {
  players: { [id: string]: PlayerState } = {};
  playerCellsGraphics: { [id: string]: PIXI.Sprite } = {};
  playerTextGraphics: { [id: string]: PIXI.Text } = {};
  playerCells: { [id: string]: CellState } = {};
  food: { [id: string]: PIXI.Sprite } = {};
  virus: { [id: string]: PIXI.Sprite } = {};
  massFood: { [id: string]: PIXI.Sprite } = {};
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

  client = new Client(useServersStore().currentServerConfig.ws);
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

  lastPlayerPosition = { x: 0, y: 0 };

  handleKeyDownListener: any;
  handleTouchListener: any;
  handleKeyUpListener: any;
  handleResizeListener: any;
  handleAnimationFrame: any;

  renderTexture: PIXI.RenderTexture;
  // foodRenderTexture: PIXI.RenderTexture;
  // virusRenderTexture: PIXI.RenderTexture;

  text = new PIXI.Text("", {
    fontFamily: "Arial",
    fontSize: 24,
    fill: "white",
    align: "center",
    strokeThickness: 8,
  });

  templateShape = new PIXI.Graphics()
    .beginFill(0xffffff)
    .drawCircle(0, 0, 50)
    .endFill();

  leaderboard = ref<TopPlayerState[]>([]);

  constructor() {
    this.renderer = PIXI.autoDetectRenderer({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x202230,
      antialias: true,
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

    this.renderTexture = PIXI.RenderTexture.create({
      width: this.templateShape.width,
      height: this.templateShape.height,
      multisample: PIXI.MSAA_QUALITY.HIGH,
      resolution: window.devicePixelRatio,
    });

    this.renderer.render(this.templateShape, {
      renderTexture: this.renderTexture,
      transform: new PIXI.Matrix(
        1,
        0,
        0,
        1,
        this.templateShape.width / 2,
        this.templateShape.height / 2
      ),
    });

    (this.renderer as PIXI.Renderer).framebuffer.blit();

    this.stage = new Stage();
    this.stage.addChild(this.viewport);

    this.viewport.addChild(boundaries);

    this.virusGroup = new Group(GAME_ZINDEXES.VIRUS, true);
    this.playerGroup = new Group(GAME_ZINDEXES.PLAYER, true);
    this.foodGroup = new Group(GAME_ZINDEXES.FOOD, true);

    this.foodLayer = this.viewport.addChild(new Layer(this.foodGroup));
    this.virusLayer = this.viewport.addChild(new Layer(this.virusGroup));
    this.playerLayer = this.viewport.addChild(new Layer(this.playerGroup));

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

  drawVirus(graphics: PIXI.Graphics, virus: any) {
    graphics?.clear();

    graphics.lineStyle(virus.strokeWidth, virus.stroke);
    graphics.beginFill(virus.fill);

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
      graphics.destroy();
    });

    Object.values(this.food).forEach((graphics) => {
      graphics.destroy();
    });

    Object.values(this.virus).forEach((graphics) => {
      graphics.destroy();
    });

    Object.values(this.massFood).forEach((graphics) => {
      graphics.destroy();
    });

    this.players = {};
    this.playerCellsGraphics = {};
    this.playerCells = {};
    this.food = {};
    this.virus = {};
    this.massFood = {};

    this.viewport.destroy();

    localStorage.removeItem("roomId");
    localStorage.removeItem("reconnectionToken");

    window.removeEventListener("keydown", this.handleKeyDownListener, false);
    window.removeEventListener("keyup", this.handleKeyUpListener, false);
    window.removeEventListener("resize", this.handleResizeListener, false);
    window.cancelAnimationFrame(this.handleAnimationFrame);
  }

  rejoin() {
    this.room.send("rejoin", {
      jwt: getJWT(),
    });
    // this.connect(this.roomName);
    useGameStore().gameSettings.isCashedOut = false;
    useGameStore().gameSettings.isDead = false;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (
      useGameStore().gameSettings.isDead ||
      useGameStore().gameSettings.isCashedOut
    ) {
      return;
    }

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

  async connect({
    roomName,
    sessionId,
  }: {
    roomName?: string;
    sessionId?: string;
  }) {
    try {
      if (sessionId) {
        this.room = await this.client.reconnect(sessionId);
      } else {
        this.room = await this.client.joinOrCreate<GameState>(roomName, {
          jwt: getJWT(),
          publicKey: useWalletStore().publicKey,
        });
      }

      this.roomName = roomName;
      this.handleAnimationFrame = requestAnimationFrame(this.tickGame);

      localStorage.setItem("roomId", this.room.id);
      localStorage.setItem("reconnectionToken", this.room.reconnectionToken);

      this.startPing();

      const onPlayerAdd = (player: PlayerState, sessionId: string) => {
        if (player.id === this.room.sessionId) {
          this.isPlayerJoined = true;
          this.viewport.moveCenter(player.x, player.y);
        }

        this.players[sessionId] = player;

        player.cells.onAdd((cell) => {
          this.players[sessionId] = player;

          cell.onChange(() => {
            this.players[sessionId] = player;

            if (this.playerCellsGraphics[cell.id]) {
              return;
            }

            const graphics = new PIXI.Sprite(this.renderTexture);

            const fontSize = Math.max(cell.radius / 2, 16);

            const textNumber = cell.splTokens;

            const cellContainer = new PIXI.Container();

            cellContainer.addChild(graphics);

            const splLamportsText = new PIXI.Text(`${textNumber}B ${cell.id}`, {
              fontFamily: "Manrope",
              fontSize,
              fill: "white",
              align: "center",
              strokeThickness: 5,
            });

            splLamportsText.anchor.set(0.5);
            graphics.anchor.set(0.5);

            graphics.x = cell.x;
            graphics.y = cell.y;
            graphics.width = cell.radius * 2;
            graphics.height = cell.radius * 2;
            graphics.tint = parseInt(
              Math.floor(player.hue * 16777215).toString(16),
              16
            );
            splLamportsText.x = cell.x;
            splLamportsText.y = cell.y;
            splLamportsText.zIndex = 1000000;

            cellContainer.addChild(graphics, splLamportsText);

            this.playerLayer.addChild(cellContainer);

            this.playerCellsGraphics[cell.id] = graphics;
            this.playerTextGraphics[cell.id] = splLamportsText;

            this.playerCells[cell.id] = cell;
          });
        });

        player.cells.onRemove((cell) => {
          if (this.playerCellsGraphics[cell.id]) {
            this.viewport.removeChild(this.playerCellsGraphics[cell.id]);
            this.playerLayer.removeChild(this.playerCellsGraphics[cell.id]);

            this.playerCellsGraphics[cell.id].destroy();
            this.playerTextGraphics[cell.id].destroy();

            delete this.playerCellsGraphics[cell.id];
            delete this.playerTextGraphics[cell.id];
            delete this.playerCells[cell.id];
          }
        });

        player.onChange(() => {
          if (player.id === this.room.sessionId && !player.isCashedOut) {
            const newWidth = lerp(
              window.innerWidth,
              (window.innerWidth + player.massTotal) * 0.7,
              0.9
            );

            const width = Math.min(newWidth, 5000);

            this.viewport.fitWidth(width, true, true, false);
          }
        });
      };

      this.room.state.players.onAdd((player, sessionId: string) => {
        onPlayerAdd(player, sessionId);
      });

      this.room.state.virus.onAdd((virus) => {
        const graphics = new PIXI.Graphics();

        this.drawVirus(graphics, virus);

        graphics.x = virus.x;
        graphics.y = virus.y;

        this.virusLayer.addChild(graphics);
        this.virus[virus.id] = graphics;
      });

      this.room.state.food.onAdd((food) => {
        const foodSprite = new PIXI.Sprite(this.renderTexture);

        foodSprite.anchor.set(0.5);
        foodSprite.x = food.x;
        foodSprite.y = food.y;
        foodSprite.width = food.radius * 2;
        foodSprite.height = food.radius * 2;

        foodSprite.tint = parseInt(
          Math.floor(Math.random() * 16777215).toString(16),
          16
        );

        foodSprite.zOrder = -1;

        this.foodLayer.addChild(foodSprite);

        this.food[food.id] = foodSprite;
      });

      this.room.state.massFood.onAdd((massFood) => {
        const massFoodSprite = new PIXI.Sprite(this.renderTexture);

        massFoodSprite.anchor.set(0.5);
        massFoodSprite.x = massFood.x;
        massFoodSprite.y = massFood.y;
        massFoodSprite.width = massFood.radius * 2;
        massFoodSprite.height = massFood.radius * 2;
        massFoodSprite.tint = parseInt(
          Math.floor(massFood.hue * 16777215).toString(16),
          16
        );

        massFoodSprite.zOrder = -1;

        this.foodLayer.addChild(massFoodSprite);

        this.massFood[massFood.id] = massFoodSprite;
      });

      this.room.onStateChange((state) => {
        this.leaderboard.value = state.leaderboard as TopPlayerState[];
      });

      this.room.state.leaderboard.onRemove((leaderboardPlayer) => {
        delete useGameStore().leaderboard[leaderboardPlayer.id];
      });

      this.room.state.virus.onRemove((virus) => {
        this.viewport.removeChild(this.virus[virus.id]);
        this.virusLayer.removeChild(this.virus[virus.id]);
        this.virus[virus.id].destroy();
        delete this.virus[virus.id];
      });

      this.room.state.food.onRemove((food) => {
        this.viewport.removeChild(this.food[food.id]);
        this.foodLayer.removeChild(this.food[food.id]);

        this.food[food.id].destroy();
        delete this.food[food.id];
      });

      this.room.state.massFood.onRemove((massFood) => {
        this.viewport.removeChild(this.massFood[massFood.id]);

        this.massFood[massFood.id].destroy();

        delete this.massFood[massFood.id];
      });

      this.room.state.players.onRemove((player, sessionId: string) => {
        if (player.id === this.room.sessionId) {
          this.isPlayerJoined = false;
        }

        player.cells.forEach((cell) => {
          if (this.playerCellsGraphics[cell.id]) {
            this.viewport.removeChild(this.playerCellsGraphics[cell.id]);
            this.playerLayer.removeChild(this.playerCellsGraphics[cell.id]);
            this.playerCellsGraphics[cell.id].destroy();
            this.playerTextGraphics[cell.id].destroy();

            delete this.playerCellsGraphics[cell.id];
            delete this.playerTextGraphics[cell.id];
            delete this.playerCells[cell.id];
          }
        });

        delete this.players[sessionId];
      });

      this.room.onMessage(
        "cash-out-success",
        async (data: { amountWon: number; newBalance: number }) => {
          await useBalanceStore().updateAllBalances();

          useGameStore().gameSettings.isCashOutLoading = false;
          useGameStore().player.splTokens = data.amountWon;
        }
      );

      this.room.onMessage("cash-out-initiated", () => {
        useGameStore().gameSettings.isCashedOut = true;
        useGameStore().gameSettings.isCashOutLoading = true;
      });

      this.room.onMessage("death-initiate", async () => {
        useGameStore().gameSettings.isDead = true;
        useGameStore().gameSettings.isDeadLoading = true;
        // useGameStore().player.splTokens = amountLost;
        // useGameStore().player.balanceSplTokens = newBalance;
      });

      this.room.onMessage(
        "death-confirm",
        async ({ amountLost, newBalance }) => {
          await useBalanceStore().updateAllBalances();

          useGameStore().gameSettings.isDeadLoading = false;
          useGameStore().player.splTokens = amountLost;
        }
      );

      this.room.onMessage("room-info", (data) => {
        roomSplTokenEntryFee.value = data.roomSplTokenEntryFee;
      });

      this.room.onMessage("pong", (cashoutSecondsDiff) => {
        lastActionTick.value = cashoutSecondsDiff;

        this.lastPong = Date.now();

        this.ping.value = this.lastPong - this.lastPing;

        setTimeout(() => {
          this.startPing();
        }, 1000);
      });

      this.room.onError(() => {
        const { goToLobby } = useGame();
        const toast = useToast();

        localStorage.removeItem("roomId");
        localStorage.removeItem("reconnectionToken");
        toast.error("An error occurred. Please try again later.");

        goToLobby();
      });

      this.room.onLeave(() => {
        this.isPlayerJoined = false;
        useGameStore().gameSettings.isCashedOut = false;
        localStorage.removeItem("roomId");
        localStorage.removeItem("reconnectionToken");
      });
    } catch (error: any) {
      const toast = useToast();
      const walletStore = useWalletStore();

      localStorage.removeItem("roomId");
      localStorage.removeItem("reconnectionToken");

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

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = now;

    this.fixedTick(deltaTime);

    this.renderer.render(this.stage as any);

    this.handleAnimationFrame = requestAnimationFrame(this.tickGame);
  };

  increaseRadius(graphics: PIXI.Graphics, amount: number) {
    graphics.scale.x += amount;
    graphics.scale.y += amount;
  }

  private fixedTick(deltaTime: number) {
    let playerCenterX = 0;
    let playerCenterY = 0;

    let currPlayerCellCount = 0;

    const timeStart = performance.now();

    Object.values(this.players).forEach((player) => {
      player.cells.forEach((cell, index) => {
        const currentCell = this.playerCellsGraphics[cell.id];

        if (!currentCell) {
          return;
        }

        currentCell.x = lerp(currentCell.x, cell.x, 11 * deltaTime);
        currentCell.y = lerp(currentCell.y, cell.y, 11 * deltaTime);

        currentCell.width = lerp(
          currentCell.width,
          cell.radius * 2,
          7 * deltaTime
        );
        currentCell.height = lerp(
          currentCell.height,
          cell.radius * 2,
          7 * deltaTime
        );

        const fontSize = lerp(
          this.playerTextGraphics[cell.id].style.fontSize,
          Math.max(cell.radius / 2, 16),
          7 * deltaTime
        );

        this.playerTextGraphics[cell.id].x = currentCell.x;
        this.playerTextGraphics[cell.id].y = currentCell.y;
        this.playerTextGraphics[cell.id].style.fontSize = fontSize;
        this.playerTextGraphics[cell.id].text = `${cell.splTokens}B`;

        currentCell.zOrder = cell.radius * 2;

        if (player.id === this.room.sessionId) {
          playerCenterX += currentCell.x;
          playerCenterY += currentCell.y;
          currPlayerCellCount++;
        }
      });
    });

    const newCenterX = playerCenterX / currPlayerCellCount;
    const newCenterY = playerCenterY / currPlayerCellCount;

    this.lastPlayerPosition = {
      x: newCenterX,
      y: newCenterY,
    };

    if (
      !useGameStore().gameSettings.isDead &&
      !useGameStore().gameSettings.isCashedOut
    ) {
      this.viewport.moveCenter(newCenterX, newCenterY);
    }

    this.room.state.massFood.forEach((massFood: MassFoodState) => {
      if (massFood.speed === 0) {
        return;
      }

      if (!this.massFood[massFood.id]) {
        return;
      }

      this.massFood[massFood.id].x = lerp(
        this.massFood[massFood.id].x,
        massFood.x,
        10 * deltaTime
      );
      this.massFood[massFood.id].y = lerp(
        this.massFood[massFood.id].y,
        massFood.y,
        10 * deltaTime
      );
    });

    this.room.state.virus.forEach((virus) => {
      if (!this.virus[virus.id]) {
        return;
      }

      this.virus[virus.id].x = lerp(
        this.virus[virus.id].x,
        virus.x,
        10 * deltaTime
      );
      this.virus[virus.id].y = lerp(
        this.virus[virus.id].y,
        virus.y,
        10 * deltaTime
      );

      // add spinning animation to virus
      this.virus[virus.id].rotation =
        (this.virus[virus.id].rotation + 0.007) % 360;
    });

    this.room.state.food.forEach((food) => {
      if (!this.food[food.id]) {
        return;
      }

      if (food.speed === 0) {
        return;
      }

      this.food[food.id].x = lerp(this.food[food.id].x, food.x, 10 * deltaTime);
      this.food[food.id].y = lerp(this.food[food.id].y, food.y, 10 * deltaTime);
    });
  }
}
