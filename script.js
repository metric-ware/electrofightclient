const e = document.getElementById("game"),
  t = e.getContext("2d"),
  n = document.getElementById("minimap"),
  a = n.getContext("2d"),
  i = document.getElementById("joinScreen"),
  r = document.getElementById("joinForm"),
  l = document.getElementById("nameInput"),
  o = document.getElementById("serverSelect"),
  s = document.getElementById("menuStatus"),
  d = document.getElementById("hud"),
  c = document.getElementById("fpsCounter"),
  h = document.getElementById("energyCounter"),
  p = document.getElementById("leaderboard"),
  m = document.getElementById("leaderboardList"),
  u =
    (document.getElementById("buildBar"),
    [...document.querySelectorAll("#buildBar button")]),
  y = document.getElementById("upgradePanel"),
  g = document.getElementById("clanButton"),
  f = document.getElementById("clanPanel"),
  v = document.getElementById("clanRequestsPopup"),
  x = document.getElementById("notice"),
  b = document.getElementById("chatOverlay"),
  w = document.getElementById("chatInput"),
  M = {
    mapBackground: "#0B1620",
    outerMapBackground: "#0B1620",
    gridLineColor: "rgba(126,178,197,0.2)",
    gridLineWidth: 4,
    accentColor: "#D6A23A",
    panelColor: "#1B252D",
    panelBorderColor: "#2D3A43",
    textColor: "#E6EDF2",
    playerSpriteSize: 195,
    buildingSpriteSize: 154,
    inventoryIconSize: 51,
    minimapSize: 196,
    interpolationDelay: 55,
    positionLerp: 64,
    projectileLerp: 36,
    cameraLerp: 18,
    particleLimit: 420,
    showHitboxes: !1,
    wallOpenOpacity: 0.5,
    friendlyBuildingStroke: "#56F0A2",
    enemyBuildingStroke: "#FF5F6C",
  },
  S = 0,
  k = 1,
  B = 2,
  E = 3,
  C = 4,
  I = 5,
  $ = 6,
  L = 7,
  P = 8,
  D = 9,
  j = 10,
  A = 11,
  R = 12,
  N = 13,
  W = 0,
  H = 1,
  T = 2,
  O = 3,
  K = 0,
  z = 1,
  F = 2,
  U = 3,
  q = 4,
  X = 5,
  Y = 6,
  G = 7,
  J = 8,
  V = new Map([
    ["KeyW", 0],
    ["ArrowUp", 0],
    ["KeyS", 1],
    ["ArrowDown", 1],
    ["KeyA", 2],
    ["ArrowLeft", 2],
    ["KeyD", 3],
    ["ArrowRight", 3],
  ]),
  Q = new Map([
    ["Digit1", "core"],
    ["Numpad1", "core"],
    ["Digit2", "wall"],
    ["Numpad2", "wall"],
    ["Digit3", "solar"],
    ["Numpad3", "solar"],
    ["Digit4", "turret"],
    ["Numpad4", "turret"],
    ["Digit5", "shield"],
    ["Numpad5", "shield"],
  ]),
  Z = new Set(["ShiftLeft", "ShiftRight"]),
  _ = ["#ffffff", "#67d8ff", "#b86cff", "#ffad58"],
  ee = "allyplayer",
  te = "enemyplayer",
  ne = {
    socket: null,
    joined: !1,
    id: 0,
    map: { width: 0, height: 0 },
    serverConfig: null,
    latestState: {
      players: [],
      buildings: [],
      projectiles: [],
      clans: [],
      leaderboard: [],
    },
    renderState: null,
    snapshots: [],
    movementKeys: [0, 0, 0, 0],
    aim: 0,
    lastMovementDirection: null,
    lastAim: null,
    shooting: !1,
    selectedBuild: null,
    mouse: { x: 0, y: 0 },
    camera: { x: 0, y: 0, ready: !1 },
    particles: [],
    shieldBeams: [],
    walkParticles: new Map(),
    fpsFrames: 0,
    fpsTime: performance.now(),
    lastRender: performance.now(),
    viewport: { width: window.innerWidth, height: window.innerHeight },
    noticeUntil: 0,
    hoveredBuildingId: 0,
    hoveredDurability: 0,
    clanOpen: !1,
    clanInteractionUntil: 0,
    clanActionUntil: 0,
    chatOpen: !1,
  },
  ae = {},
  ie = (e) =>
    e
      ? (ae[e] ||
          (ae[e] = ((e) => {
            const t = new Image();
            return ((t.src = e), t);
          })(`sprites/${e}.png`)),
        ae[e])
      : null,
  re = (e, t, n) => Math.max(t, Math.min(n, e)),
  le = (e, t, n) => e + (t - e) * n,
  oe = (e, t, n) => e + (((t - e + 540) % 360) - 180) * n,
  se = (e, t) => 1 - Math.exp(-e * t),
  de = (e) => ({
    id: e[0],
    name: e[1],
    x: e[2],
    y: e[3],
    energy: e[4],
    maxEnergy: e[5],
    angle: e[6] || 0,
    clan: e[7] || "",
    friendly: Boolean(e[8]),
    chatMessage: "string" == typeof e[9] && e[9].length ? e[9] : null,
  }),
  ce = (e) => ({ id: e[0], name: e[1], energy: e[2], clan: e[3] || "" }),
  he = (e) => ({
    id: e[0],
    ownerId: e[1],
    type: e[2],
    level: e[3],
    x: e[4],
    y: e[5],
    hitboxWidth: e[6],
    hitboxHeight: e[7],
    size: Math.max(e[6], e[7]),
    durability: e[8],
    maxDurability: e[9],
    gridX: e[10],
    gridY: e[11],
    spriteKey: e[12] || "",
    open: Boolean(e[13]),
    friendly: Boolean(e[14]),
  }),
  pe = (e) => ({
    id: e[0],
    x: e[1],
    y: e[2],
    vx: e[3],
    vy: e[4],
    radius: e[5],
    kind: e[6],
    level: e[7],
    friendly: Boolean(e[8]),
    targetX: e[9],
    targetY: e[10],
  }),
  me = (e) =>
    (e || [])
      .map((e) =>
        Array.isArray(e)
          ? { id: Number(e[0]), name: e[1] || `Player ${e[0]}` }
          : { id: Number(e), name: `Player ${e}` },
      )
      .filter((e) => Number.isFinite(e.id)),
  ue = (e) => {
    const t = me(e[3]),
      n = me(e[4]);
    return {
      id: e[0],
      name: e[1],
      leaderId: e[2],
      members: t.map((e) => e.id),
      pending: n.map((e) => e.id),
      memberNames: new Map(t.map((e) => [e.id, e.name])),
      pendingNames: new Map(n.map((e) => [e.id, e.name])),
    };
  },
  ye = (e) => {
    const t = e?.[1] || [],
      n = e?.[2] || [],
      a = e?.[3] || [],
      i = e?.[4] || [],
      r = e?.[7] || [],
      l = e?.[8] || [],
      o = e?.[9] || [],
      s = {};
    (e?.[5] || []).forEach((e) => {
      const t = {};
      ((e[13] || []).forEach((e) => {
        t[e[0]] = {
          level: e[0],
          spriteKey: e[1],
          hitboxWidth: e[2],
          hitboxHeight: e[3],
          durability: e[4],
          regen: e[5],
          maxEnergyCapacity: e[6],
          energyGeneration: e[7],
          range: e[8],
          damage: e[9],
          fireInterval: e[10],
          healPercent: e[11],
        };
      }),
        (s[e[0]] = {
          type: e[0],
          displayName: e[1],
          spriteKey: e[2],
          gridWidth: e[3],
          gridHeight: e[4],
          hitboxWidth: e[5],
          hitboxHeight: e[6],
          limit: e[7],
          placeCost: e[8],
          upgradeCost: e[9] || [],
          blocksPlayers: Boolean(e[10]),
          blocksProjectiles: Boolean(e[11]),
          targetRules: e[12],
          levels: t,
        }));
    });
    const d = e?.[6] || [];
    return {
      configVersion: e?.[0] || "",
      map: { width: t[0], height: t[1] },
      placement: {
        chunkSize: n[0],
        mustSnapToGrid: Boolean(n[1]),
        occupiedCellRule: n[2],
        playerOverlapBlocksPlacement: Boolean(n[3]),
      },
      player: {
        radius: a[0],
        speed: a[1],
        baseMaxEnergy: a[2],
        fireInterval: a[3],
        projectileSpeed: a[4],
        projectileLife: a[5],
        projectileDamage: a[6],
        projectileEnergyCost: a[7],
        baseRegen: a[8],
        maxNameLength: a[9],
        muzzleOffset: a[10],
        weaponDamageByCoreLevel: a[11] || [],
        weaponEnergyCostByCoreLevel: a[12] || [],
        range: a[13] || a[4] * a[5],
        playerShootingMovementSpeed: a[14] || 0.7 * a[1],
      },
      projectile: { radius: i[0], turretSpeed: i[1] },
      buildings: s,
      clans: {
        maxNameLength: d[0],
        tagDisplayLength: d[1],
        turretsIgnoreClanMembers: Boolean(d[2]),
      },
      renderRadius: { width: r[0], height: r[1] },
      walls: { openRangeMultiplier: l[0], openOpacity: l[1] },
      network: { tickRate: o[0] || 0 },
    };
  },
  ge = () => {
    const i = window.devicePixelRatio || 1;
    ((ne.viewport.width = window.innerWidth),
      (ne.viewport.height = window.innerHeight),
      (e.width = Math.round(ne.viewport.width * i)),
      (e.height = Math.round(ne.viewport.height * i)),
      (e.style.width = `${ne.viewport.width}px`),
      (e.style.height = `${ne.viewport.height}px`),
      t.setTransform(i, 0, 0, i, 0, 0),
      (n.width = Math.round(M.minimapSize * i)),
      (n.height = Math.round(M.minimapSize * i)),
      (n.style.width = `${M.minimapSize}px`),
      (n.style.height = `${M.minimapSize}px`),
      a.setTransform(i, 0, 0, i, 0, 0));
  },
  fe = (e) => {
    ne.socket &&
      ne.socket.readyState === WebSocket.OPEN &&
      ne.socket.send(JSON.stringify(e));
  };
window.showHitboxesToggle = () => (
  (M.showHitboxes = !M.showHitboxes),
  M.showHitboxes
);
const ve = () => {
    const e = ne.movementKeys[0] && !ne.movementKeys[1],
      t = ne.movementKeys[1] && !ne.movementKeys[0],
      n = ne.movementKeys[2] && !ne.movementKeys[3],
      a = ne.movementKeys[3] && !ne.movementKeys[2];
    return e && n
      ? X
      : e && a
        ? Y
        : t && n
          ? G
          : t && a
            ? J
            : e
              ? z
              : t
                ? F
                : n
                  ? U
                  : a
                    ? q
                    : K;
  },
  xe = (e, t) => {
    const n = V.get(e);
    if (void 0 === n) return !1;
    const a = ve();
    return ((ne.movementKeys[n] = t), a !== ve());
  },
  be = (e = !1) => {
    if (!ne.joined) return;
    const t = ve();
    (e || t !== ne.lastMovementDirection) &&
      ((ne.lastMovementDirection = t), fe([k, t]));
  },
  we = () => {
    ((ne.movementKeys = [0, 0, 0, 0]), be(!0));
  },
  Me = (e) => {
    const t = new Map();
    return (e.forEach((e) => t.set(e.id, e)), t);
  },
  Se = (e = ne.renderState || ne.latestState) =>
    e.players.find((e) => e.id === ne.id) || null,
  ke = (e = ne.renderState || ne.latestState) => {
    const t = Se(e);
    return t
      ? {
          x: re(
            t.x - ne.viewport.width / 2,
            0,
            Math.max(0, ne.map.width - ne.viewport.width),
          ),
          y: re(
            t.y - ne.viewport.height / 2,
            0,
            Math.max(0, ne.map.height - ne.viewport.height),
          ),
        }
      : { x: 0, y: 0 };
  },
  Be = (e = ne.renderState || ne.latestState) =>
    ne.camera.ready ? ne.camera : ke(e),
  Ee = (e = ne.renderState || ne.latestState, t = Be(e)) => {
    const n = Se(e);
    if (!n) return;
    const a = ne.mouse.x + t.x,
      i = ne.mouse.y + t.y;
    ne.aim = (180 * Math.atan2(i - n.y, a - n.x)) / Math.PI;
  },
  Ce = (e = !1) => {
    if (!ne.joined) return;
    Ee();
    const t = Math.round(ne.aim);
    (e || t !== ne.lastAim) && ((ne.lastAim = t), fe([B, t]));
  },
  Ie = () => {
    ((ne.chatOpen = !1), (b.style.display = "none"), (w.value = ""), w.blur());
  };
function $e() {
  p &&
    v &&
    (v.style.top = `${Math.round(p.getBoundingClientRect().bottom) + 8}px`);
}
const Le = (e, t) => e.players.find((e) => e.id === t) || null,
  Pe = (e, t) => e.clans.find((e) => e.members.includes(t)) || null,
  De = (e, t, n) =>
    Le(e, n)?.name ||
    t.memberNames.get(n) ||
    t.pendingNames.get(n) ||
    `Player ${n}`,
  je = (e, t) => {
    const n = Se(e),
      a = Le(e, t);
    return Boolean(
      n && a && (a.friendly || n.id === a.id || (n.clan && n.clan === a.clan)),
    );
  },
  Ae = (e, t) =>
    ((e, t) => t.friendly || je(e, t.ownerId))(e, t)
      ? M.friendlyBuildingStroke
      : M.enemyBuildingStroke,
  Re = (e) =>
    e.clan
      ? `[${e.clan.slice(0, ne.serverConfig?.clans?.tagDisplayLength || e.clan.length)}] ${e.name}`
      : e.name,
  Ne = (e) => {
    ne.particles.length < M.particleLimit && ne.particles.push(e);
  },
  We = (e) => "walk" === e.kind,
  He = (e, t, n, a = 10) => {
    for (let i = 0; i < a; i += 1) {
      const a = Math.random() * Math.PI * 2,
        i = 45 + 160 * Math.random(),
        r = 0.18 + 0.28 * Math.random();
      Ne({
        x: e,
        y: t,
        vx: Math.cos(a) * i,
        vy: Math.sin(a) * i,
        life: r,
        maxLife: r,
        size: 1.5 + 2.5 * Math.random(),
        color: n,
        alpha: 1,
      });
    }
  },
  Te = (e) =>
    e
      .slice(1, -1)
      .filter((e, t) => t % 2 == 0)
      .map((t, n) => {
        const a = e[n + 2] || t,
          i =
            Math.atan2(a.y - t.y, a.x - t.x) +
            (Math.random() > 0.5 ? 1 : -1) * (0.65 + 0.45 * Math.random()),
          r = 18 + 26 * Math.random();
        return [t, { x: t.x + Math.cos(i) * r, y: t.y + Math.sin(i) * r }];
      }),
  Oe = (e) => {
    if (
      2 !== e.kind ||
      !Number.isFinite(e.targetX) ||
      !Number.isFinite(e.targetY)
    )
      return;
    const t = ((e, t, n, a, i = 7, r = 24) => {
      const l = n - e,
        o = a - t,
        s = Math.hypot(l, o) || 1,
        d = -o / s,
        c = l / s;
      return Array.from({ length: i + 1 }, (n, a) => {
        const s = a / i,
          h = Math.sin(s * Math.PI),
          p = (Math.random() - 0.5) * r * h;
        return { x: e + l * s + d * p, y: t + o * s + c * p };
      });
    })(e.x, e.y, e.targetX, e.targetY);
    ne.shieldBeams.push({
      id: e.id,
      level: e.level,
      life: 0.28,
      maxLife: 0.28,
      points: t,
      branches: Te(t),
    });
  },
  Ke = (e) => {
    for (
      ((e, t) => {
        const n = new Set(e.projectiles.map((e) => e.id)),
          a = new Set(t.projectiles.map((e) => e.id)),
          i = new Set(t.buildings.map((e) => e.id));
        (t.projectiles.forEach((e) => {
          2 !== e.kind || n.has(e.id) || Oe(e);
        }),
          e.projectiles.forEach((e) => {
            2 === e.kind || a.has(e.id) || He(e.x, e.y, et(e.level), 6);
          }),
          e.buildings.forEach((e) => {
            i.has(e.id) || He(e.x, e.y, et(e.level), 20);
          }));
      })(ne.latestState, e),
        ne.latestState = e,
        ne.snapshots.push({ time: performance.now(), state: e });
      ne.snapshots.length > 2;
    )
      ne.snapshots.shift();
    (ne.renderState || (ne.renderState = e),
      ((e) => {
        const t = [...e]
          .sort((e, t) => t.energy - e.energy || e.name.localeCompare(t.name))
          .slice(0, 10);
        (m.replaceChildren(
          ...t.map((e, t) => {
            const n = document.createElement("div"),
              a = document.createElement("span"),
              i = document.createElement("span");
            return (
              (n.className = `leaderboardRow rank${t + 1}`),
              (a.textContent = `${t + 1}. ${Re(e)}`),
              (i.textContent = `${Math.round(e.energy)}`),
              n.append(a, i),
              n
            );
          }),
        ),
          $e());
      })(e.leaderboard || e.players),
      qe(e),
      gt(),
      performance.now() > ne.clanInteractionUntil && ft());
  },
  ze = (e, t, n) => {
    const a = Me(e.players),
      i = Me(e.projectiles);
    return {
      players: t.players.map((e) => {
        const t = a.get(e.id) || e,
          i = e.id === ne.id ? ne.aim : oe(t.angle, e.angle, n);
        return { ...e, x: le(t.x, e.x, n), y: le(t.y, e.y, n), angle: i };
      }),
      buildings: t.buildings,
      projectiles: t.projectiles.map((e) => {
        const t = i.get(e.id) || e;
        return { ...e, x: le(t.x, e.x, n), y: le(t.y, e.y, n) };
      }),
      clans: t.clans,
      leaderboard: t.leaderboard,
    };
  },
  Fe = (e, t) => {
    const n = ((e) => {
      const t = ne.snapshots,
        n = e - M.interpolationDelay;
      if (!t.length) return ne.latestState;
      if (n <= t[0].time) return t[0].state;
      for (let e = 0; e < t.length - 1; e += 1) {
        const a = t[e],
          i = t[e + 1];
        if (n >= a.time && n <= i.time)
          return ze(
            a.state,
            i.state,
            re((n - a.time) / Math.max(1, i.time - a.time), 0, 1),
          );
      }
      return t[t.length - 1].state;
    })(e);
    if (!ne.renderState) return ((ne.renderState = n), n);
    const a = Me(ne.renderState.players),
      i = Me(ne.renderState.projectiles),
      r = se(M.positionLerp, t),
      l = se(M.projectileLerp, t);
    return (
      (ne.renderState = {
        players: n.players.map((e) => {
          const t = a.get(e.id) || e,
            n = e.id === ne.id ? ne.aim : oe(t.angle, e.angle, r);
          return { ...e, x: le(t.x, e.x, r), y: le(t.y, e.y, r), angle: n };
        }),
        buildings: n.buildings,
        projectiles: n.projectiles.map((e) => {
          const t = i.get(e.id) || e;
          return { ...e, x: le(t.x, e.x, l), y: le(t.y, e.y, l) };
        }),
        clans: n.clans,
        leaderboard: n.leaderboard,
      }),
      ne.renderState
    );
  },
  Ue = () =>
    u.forEach((e) =>
      e.classList.toggle("selected", e.dataset.build === ne.selectedBuild),
    ),
  qe = (e = ne.latestState) =>
    u.forEach((t) => {
      const n = Je(t.dataset.build),
        a = t.querySelector(".buildLimit");
      n &&
        a &&
        (a.textContent = `Built ${((e, t) => e.buildings.filter((e) => e.ownerId === ne.id && e.type === t).length)(e, t.dataset.build)}/${n.limit}`);
    }),
  Xe = (e) => {
    (!ne.selectedBuild && e && it(!1),
      (ne.selectedBuild = ne.selectedBuild === e ? null : e),
      Ue());
  },
  Ye = (e) => [ne.mouse.x + e.x, ne.mouse.y + e.y],
  Ge = () => ne.serverConfig?.placement?.chunkSize || 1,
  Je = (e) => ne.serverConfig?.buildings?.[e] || null,
  Ve = (e, t) => Je(e)?.levels?.[t] || null,
  Qe = () => ne.serverConfig?.player?.radius || 1,
  Ze = () => M.playerSpriteSize,
  _e = () => ne.serverConfig?.placement?.chunkSize || M.buildingSpriteSize,
  et = (e) => _[e] || _[1],
  tt = (e, t) => [Math.floor(e / Ge()), Math.floor(t / Ge())],
  nt = (e) => ({
    x: e.x - e.hitboxWidth / 2,
    y: e.y - e.hitboxHeight / 2,
    width: e.hitboxWidth,
    height: e.hitboxHeight,
  }),
  at = (e, t, n, a) => {
    const i = Je(t),
      r = Se(e),
      l = ((e) =>
        e.buildings.find((e) => e.ownerId === ne.id && "core" === e.type) ||
        null)(e);
    if (!i || !r || r.energy < i.placeCost) return !1;
    const o = {
      x: n * Ge(),
      y: a * Ge(),
      width: i.gridWidth * Ge(),
      height: i.gridHeight * Ge(),
    };
    return (
      !(
        e.buildings.filter((e) => e.ownerId === ne.id && e.type === t).length >=
        i.limit
      ) &&
      ("core" !== t || !l) &&
      !("core" !== t && !l) &&
      !!((e, t, n) => {
        const a = Je(n);
        return Boolean(
          a &&
          Number.isInteger(e) &&
          Number.isInteger(t) &&
          e >= 0 &&
          t >= 0 &&
          (e + a.gridWidth) * Ge() <= ne.map.width &&
          (t + a.gridHeight) * Ge() <= ne.map.height,
        );
      })(n, a, t) &&
      !((e, t, n, a) => {
        const i = Je(a);
        return e.buildings.some((e) => {
          const a = Je(e.type);
          return (
            i &&
            a &&
            ((r = t),
            (l = n),
            (o = i.gridWidth),
            (s = i.gridHeight),
            (d = e.gridX),
            (c = e.gridY),
            (h = a.gridWidth),
            (p = a.gridHeight),
            r < d + h && r + o > d && l < c + p && l + s > c)
          );
          var r, l, o, s, d, c, h, p;
        });
      })(e, n, a, t) &&
      !!((e, t, n) => {
        const a = Se(e);
        if (!a) return !1;
        const i = Math.floor(a.x / Ge()),
          r = Math.floor(a.y / Ge());
        return Math.abs(t - i) <= 1 && Math.abs(n - r) <= 1;
      })(e, n, a) &&
      (!ne.serverConfig.placement.playerOverlapBlocksPlacement ||
        !e.players.some((e) =>
          ((e, t) => {
            const n = re(e.x, t.x, t.x + t.width),
              a = re(e.y, t.y, t.y + t.height);
            return (e.x - n) ** 2 + (e.y - a) ** 2 <= Qe() ** 2;
          })(e, o),
        ))
    );
  },
  it = (e) => {
    (!ne.joined && e) ||
      (ne.shooting !== e && ((ne.shooting = e), fe([e ? E : j, e ? 1 : 0])));
  },
  rt = (e) => {
    ((t.fillStyle = M.outerMapBackground),
      t.fillRect(0, 0, ne.viewport.width, ne.viewport.height));
    const n = Math.max(0, -e.x),
      a = Math.max(0, -e.y),
      i = Math.min(ne.viewport.width, ne.map.width - e.x),
      r = Math.min(ne.viewport.height, ne.map.height - e.y);
    ((t.fillStyle = M.mapBackground),
      i > n && r > a && t.fillRect(n, a, i - n, r - a),
      ne.serverConfig &&
        ((e, n, a, i) => {
          const r = Math.floor(e.x / n) * n,
            l = Math.floor(e.y / n) * n;
          ((t.strokeStyle = a), (t.lineWidth = i), t.beginPath());
          for (let a = r; a <= e.x + ne.viewport.width; a += n)
            (t.moveTo(Math.round(a - e.x) + 0.5, Math.max(0, -e.y)),
              t.lineTo(
                Math.round(a - e.x) + 0.5,
                Math.min(ne.viewport.height, ne.map.height - e.y),
              ));
          for (let a = l; a <= e.y + ne.viewport.height; a += n)
            (t.moveTo(Math.max(0, -e.x), Math.round(a - e.y) + 0.5),
              t.lineTo(
                Math.min(ne.viewport.width, ne.map.width - e.x),
                Math.round(a - e.y) + 0.5,
              ));
          t.stroke();
        })(e, Ge(), M.gridLineColor, M.gridLineWidth));
  },
  lt = (e, n, a) => {
    const i = e.x - n.x,
      r = e.y - n.y,
      l = et(e.level),
      o = ie(e.spriteKey || Ve(e.type, e.level)?.spriteKey),
      s = _e(),
      d =
        "wall" === e.type && e.open
          ? ne.serverConfig?.walls?.openOpacity || M.wallOpenOpacity
          : 1;
    (t.save(),
      t.translate(i, r),
      (t.globalAlpha = d),
      o && o.complete
        ? t.drawImage(o, -s / 2, -s / 2, s, s)
        : ((t.fillStyle = l), t.fillRect(-s / 2, -s / 2, s, s)),
      (t.globalAlpha = 1),
      (t.strokeStyle = Ae(a, e)),
      (t.lineWidth = 4),
      t.strokeRect(
        -e.hitboxWidth / 2,
        -e.hitboxHeight / 2,
        e.hitboxWidth,
        e.hitboxHeight,
      ),
      ((e, n) => {
        if (e.maxDurability <= 0) return;
        const a = re(e.durability / e.maxDurability, 0, 1),
          i = Math.max(62, Math.min(e.hitboxWidth - 24, 0.78 * e.hitboxWidth)),
          r = Math.max(12, Math.min(16, 0.1 * e.hitboxHeight)),
          l = -i / 2,
          o = e.hitboxHeight / 2 - r - 12;
        ((t.fillStyle = "rgba(11, 22, 32, 0.86)"),
          t.fillRect(l - 4, o - 4, i + 8, r + 8),
          (t.fillStyle = "rgba(45, 58, 67, 0.94)"),
          t.fillRect(l, o, i, r),
          (t.fillStyle = Ae(n, e)),
          t.fillRect(l, o, i * a, r),
          (t.fillStyle = "rgba(255, 255, 255, 0.24)"),
          t.fillRect(l, o, i * a, 3));
      })(e, a),
      t.restore());
  },
  ot = (e, n) => {
    if (2 === e.kind) return;
    const a = e.x - n.x,
      i = e.y - n.y,
      r = et(e.level),
      l = e.radius + 2;
    ((t.fillStyle = r),
      (t.shadowColor = r),
      (t.shadowBlur = 16),
      (t.globalAlpha = 0.42),
      t.beginPath(),
      t.arc(a, i, e.radius + 6, 0, 2 * Math.PI),
      t.fill(),
      (t.globalAlpha = 1),
      t.beginPath(),
      t.arc(a, i, l, 0, 2 * Math.PI),
      t.fill(),
      (t.shadowBlur = 0),
      ((e) => {
        if (2 === e.kind || Math.random() > 0.35) return;
        const t = e.friendly ? M.friendlyBuildingStroke : M.enemyBuildingStroke,
          n = Math.hypot(e.vx, e.vy) || 1,
          a = e.vx / n,
          i = e.vy / n,
          r = 0.2 + 0.12 * Math.random();
        Ne({
          x: e.x - 12 * a,
          y: e.y - 12 * i,
          vx: 0.045 * -e.vx + 42 * (Math.random() - 0.5),
          vy: 0.045 * -e.vy + 42 * (Math.random() - 0.5),
          life: r,
          maxLife: r,
          size: 2.2 + 2 * Math.random(),
          color: t,
          alpha: 0.9,
        });
      })(e));
  },
  st = (e, n, a, i, r, l) => {
    ((t.globalAlpha = i),
      (t.strokeStyle = a),
      (t.shadowColor = a),
      (t.shadowBlur = l),
      (t.lineWidth = r),
      (t.lineJoin = "round"),
      (t.lineCap = "round"),
      t.beginPath(),
      e.forEach((e, a) => {
        const i = e.x - n.x,
          r = e.y - n.y;
        0 === a ? t.moveTo(i, r) : t.lineTo(i, r);
      }),
      t.stroke());
  },
  dt = (e, n) => {
    const a = String(e || "")
      .split(/\s+/)
      .filter(Boolean)
      .flatMap((e) =>
        ((e, n) => {
          const a = [];
          let i = e;
          for (; t.measureText(i).width > n && i.length > 1; ) {
            let e = 1;
            for (
              ;
              e < i.length && t.measureText(i.slice(0, e + 1)).width <= n;
            )
              e += 1;
            (a.push(i.slice(0, e)), (i = i.slice(e)));
          }
          return (i && a.push(i), a);
        })(e, n),
      );
    return a
      .reduce(
        (e, a) => {
          const i = e[e.length - 1] || "",
            r = i ? `${i} ${a}` : a;
          return !i || t.measureText(r).width <= n
            ? [...e.slice(0, -1), r]
            : [...e, a];
        },
        [""],
      )
      .filter(Boolean);
  },
  ct = (e, n = () => !0) => {
    (ne.particles.forEach((a) => {
      n(a) &&
        ((t.globalAlpha = a.alpha),
        (t.fillStyle = a.color),
        (t.shadowColor = a.color),
        (t.shadowBlur = 10),
        t.beginPath(),
        t.arc(a.x - e.x, a.y - e.y, a.size, 0, 2 * Math.PI),
        t.fill());
    }),
      (t.globalAlpha = 1),
      (t.shadowBlur = 0));
  },
  ht = (e, n) => {
    if (!ne.selectedBuild || !ne.joined) return;
    const [a, i] = Ye(n),
      [r, l] = tt(a, i),
      [o, s] = ((e, t) => [e * Ge() + Ge() / 2, t * Ge() + Ge() / 2])(r, l),
      d = Je(ne.selectedBuild);
    if (!d) return;
    const c = at(e, ne.selectedBuild, r, l) ? "#56F0A2" : "#FF5F6C",
      h = ie(Ve(ne.selectedBuild, 1)?.spriteKey),
      p = _e();
    (t.save(),
      t.translate(o - n.x, s - n.y),
      (t.globalAlpha = 0.52),
      h && h.complete && t.drawImage(h, -p / 2, -p / 2, p, p),
      (t.globalAlpha = 1),
      (t.strokeStyle = c),
      (t.lineWidth = 2),
      t.setLineDash([6, 5]),
      t.strokeRect(
        -d.hitboxWidth / 2,
        -d.hitboxHeight / 2,
        d.hitboxWidth,
        d.hitboxHeight,
      ),
      t.setLineDash([]),
      t.restore());
  },
  pt = (e, t) => {
    const [n, a] = Ye(t);
    return (
      e.buildings.find((e) => {
        const t = nt(e);
        return (
          e.ownerId === ne.id &&
          n >= t.x &&
          a >= t.y &&
          n <= t.x + t.width &&
          a <= t.y + t.height
        );
      }) || null
    );
  },
  mt = (e) => "core" !== e.type,
  ut = (e, t = () => !0) => {
    const n = ne.renderState || ne.latestState,
      a = pt(n, Be(n));
    return !(!a || !t(a)) && (fe([e, a.id]), !0);
  },
  yt = (e, t) => {
    if (ne.selectedBuild || !ne.joined)
      return ((y.style.display = "none"), void (ne.hoveredBuildingId = 0));
    const n = pt(e, t);
    if (!n)
      return (
        (ne.hoveredBuildingId = 0),
        void (y.matches(":hover") || (y.style.display = "none"))
      );
    const a = n.level >= 3,
      i = Je(n.type),
      r = Ve(n.type, n.level),
      l = a || !i ? 0 : i.upgradeCost[n.level];
    if (
      ne.hoveredBuildingId !== n.id ||
      ne.hoveredDurability !== n.durability
    ) {
      const e = ((e, t) =>
          ({
            core: [`Max energy: ${t?.maxEnergyCapacity || 0}`],
            solar: [`Generation: ${t?.energyGeneration || 0}/s`],
            turret: [`Range: ${t?.range || 0}`, `Damage: ${t?.damage || 0}`],
            shield: [
              `Range: ${t?.range || 0}`,
              `Heal: ${Math.round(100 * (t?.healPercent || 0))}%`,
              `Interval: ${((t?.fireInterval || 0) / 1e3).toFixed(1)}s`,
            ],
            wall: [],
          })[e] || [])(n.type, r),
        t = e.map((e) => `<div class="meta">${e}</div>`).join(""),
        o = a ? "" : '<div class="meta">Upgrade = Right Click</div>',
        s = a
          ? '<div class="meta">MAX</div>'
          : `<div class="meta">Upgrade Cost: ${l} energy</div>`,
        d = mt(n) ? '<div class="meta">Delete Build = Shift</div>' : "";
      ((y.dataset.buildingId = n.id),
        (y.innerHTML = `<div class="title">${i?.displayName || n.type} Level ${n.level}</div>${o}${s}${d}<div class="meta">Durability: ${Math.round(n.durability)} / ${n.maxDurability}</div>${t}`),
        (ne.hoveredBuildingId = n.id),
        (ne.hoveredDurability = n.durability));
    }
    ((y.style.left = `${re(ne.mouse.x + 14, 8, ne.viewport.width - 190)}px`),
      (y.style.top = `${re(ne.mouse.y + 14, 8, ne.viewport.height - 140)}px`),
      (y.style.display = "block"));
  },
  gt = () => {
    const e = ne.latestState,
      t = Pe(e, ne.id);
    if (($e(), performance.now() < ne.clanActionUntil)) return;
    if (!t || t.leaderId !== ne.id || 0 === t.pending.length)
      return ((v.style.display = "none"), void v.replaceChildren());
    const n = t.pending[0],
      a = `<div class="clanRequest"><span>${De(e, t, n)}</span><div class="requestActions"><button data-clan-accept="${n}" type="button" aria-label="Accept">✓</button><button data-clan-decline="${n}" type="button" aria-label="Reject">✕</button></div></div>`;
    ((v.innerHTML = `<div class="title">Clan Request</div>${a}`),
      (v.style.display = "grid"));
  };
function ft() {
  if (!ne.clanOpen) return;
  if (
    "clanNameInput" === document.activeElement?.id ||
    performance.now() < ne.clanInteractionUntil ||
    performance.now() < ne.clanActionUntil
  )
    return;
  const e = ne.latestState,
    t = Pe(e, ne.id),
    n = document.getElementById("clanNameInput")?.value || "";
  if (((f.style.display = "block"), !t)) {
    const t =
      e.clans
        .map((t) => {
          const n = De(e, t, t.leaderId),
            a = t.members.map((n) => De(e, t, n)).join(", ");
          return `<div class="clanBlock"><div>[${t.name}]</div><div>Leader: ${n}</div><div>Players: ${a || "none"}</div><button data-clan-join="${t.id}" type="button">Request</button></div>`;
        })
        .join("") || '<div class="meta">No clans yet</div>';
    return void (f.innerHTML = `<div class="title">Clans</div><input id="clanNameInput" placeholder="CLAN" value="${n.replace(/"/g, "&quot;")}" /><button data-clan-create type="button">Create Clan</button><div class="clanSection">${t}</div>`);
  }
  const a = De(e, t, t.leaderId),
    i = t.leaderId === ne.id,
    r =
      t.members
        .filter((e) => e !== t.leaderId)
        .map(
          (n) =>
            `<div class="clanRow"><span>${De(e, t, n)}</span>${i ? `<button data-clan-kick="${n}" type="button">Kick</button>` : ""}</div>`,
        )
        .join("") || '<div class="meta">none</div>';
  f.innerHTML = `<div class="title">[${t.name}]</div><div class="clanSection"><div>Leader: ${a}</div><div>Players</div>${r}</div><button data-clan-leave type="button">Leave Clan</button>`;
}
const vt = (e) => {
    const n = Math.min((e - ne.lastRender) / 1e3, 0.05);
    ((ne.lastRender = e),
      (ne.fpsFrames += 1),
      e - ne.fpsTime >= 1e3 &&
        ((c.textContent = `FPS: ${ne.fpsFrames} TPS: ${ne.serverConfig?.network?.tickRate || 0}`),
        (ne.fpsFrames = 0),
        (ne.fpsTime = e)),
      "block" === x.style.display &&
        e > ne.noticeUntil &&
        (x.style.display = "none"));
    const i = Fe(e, n),
      r = ((e, t = 0) => {
        const n = ke(e);
        if (!ne.camera.ready)
          return (
            (ne.camera.x = n.x),
            (ne.camera.y = n.y),
            (ne.camera.ready = !0),
            ne.camera
          );
        const a = se(M.cameraLerp, t);
        return (
          (ne.camera.x = le(ne.camera.x, n.x, a)),
          (ne.camera.y = le(ne.camera.y, n.y, a)),
          ne.camera
        );
      })(i, n);
    Ee(i, r);
    const l = Se(i);
    (((e) => {
      ne.particles = ne.particles.filter(
        (t) => (
          (t.life -= e),
          (t.x += t.vx * e),
          (t.y += t.vy * e),
          (t.alpha = re(t.life / t.maxLife, 0, 1)),
          t.life > 0
        ),
      );
    })(n),
      ((e) => {
        ne.shieldBeams = ne.shieldBeams.filter(
          (t) => ((t.life -= e), t.life > 0),
        );
      })(n),
      ((e, t) => {
        const n = performance.now(),
          a = new Set(e.players.map((e) => e.id));
        (e.players.forEach((a) => {
          const i = ne.walkParticles.get(a.id),
            r = (i ? Math.hypot(a.x - i.x, a.y - i.y) : 0) / Math.max(t, 0.016),
            l = !i || n - i.time > 82;
          if (i && r > 28 && l) {
            const t = je(e, a.id)
                ? M.friendlyBuildingStroke
                : M.enemyBuildingStroke,
              n = a.x - i.x,
              r = a.y - i.y,
              l = Math.hypot(n, r) || 1,
              o = -n / l,
              s = -r / l,
              d = Qe();
            for (let e = 0; e < 3; e += 1) {
              const e = (Math.random() - 0.5) * d * 0.72,
                n = d * (0.3 + 0.32 * Math.random()),
                i = 0.34 + 0.18 * Math.random();
              Ne({
                kind: "walk",
                x: a.x + o * n - s * e,
                y: a.y + s * n + o * e,
                vx: o * (24 + 42 * Math.random()) + 28 * (Math.random() - 0.5),
                vy: s * (24 + 42 * Math.random()) + 28 * (Math.random() - 0.5),
                life: i,
                maxLife: i,
                size: 2.4 + 2.4 * Math.random(),
                color: t,
                alpha: 0.95,
              });
            }
          }
          ne.walkParticles.set(a.id, {
            x: a.x,
            y: a.y,
            time: !i || (r > 28 && l) ? n : i.time,
          });
        }),
          [...ne.walkParticles.keys()].forEach((e) => {
            a.has(e) || ne.walkParticles.delete(e);
          }));
      })(i, n),
      rt(r),
      i.buildings.forEach((e) => lt(e, r, i)),
      ct(r, We),
      i.players.forEach((e) =>
        ((e, n, a) => {
          const i = Ze(),
            r = je(a, e.id),
            l = ie(r ? ee : te),
            o = e.id === ne.id ? ne.aim : e.angle,
            s = e.x - n.x,
            d = e.y - n.y;
          (t.save(),
            t.translate(s, d),
            t.rotate(((o + 90) * Math.PI) / 180),
            l?.complete && t.drawImage(l, -i / 2, -i / 2, i, i),
            t.restore());
        })(e, r, i),
      ),
      i.projectiles.forEach((e) => ot(e, r)),
      ne.shieldBeams.forEach((e) =>
        ((e, n) => {
          const a = et(e.level),
            i = re(e.life / e.maxLife, 0, 1),
            r = e.points[e.points.length - 1];
          (t.save(),
            st(e.points, n, a, 0.28 * i, 14, 22),
            st(e.points, n, a, 0.72 * i, 4, 14),
            st(e.points, n, "#ffffff", 0.9 * i, 1.4, 3),
            e.branches.forEach((e) => st(e, n, a, 0.35 * i, 2, 10)),
            (t.globalAlpha = 0.52 * i),
            (t.fillStyle = a),
            (t.shadowColor = a),
            (t.shadowBlur = 18),
            t.beginPath(),
            t.arc(r.x - n.x, r.y - n.y, 11, 0, 2 * Math.PI),
            t.fill(),
            t.restore());
        })(e, r),
      ),
      ct(r, (e) => !We(e)),
      i.players.forEach((e) =>
        ((e, n) => {
          if (!e.chatMessage) return;
          const a = e.x - n.x,
            i = e.y - n.y - Ze() / 2 + 2,
            r = Math.min(280, Math.max(160, ne.viewport.width - 40));
          ((t.font = "850 18px system-ui, sans-serif"), (t.textAlign = "left"));
          const l = dt(e.chatMessage, r);
          if (!l.length) return;
          const o = Math.max(...l.map((e) => t.measureText(e).width)) + 20,
            s = 22 * l.length + 14,
            d = re(a - o / 2, 8, ne.viewport.width - o - 8),
            c = Math.max(8, i - 39 - s);
          ((t.fillStyle = "rgba(27, 37, 45, 0.92)"),
            (t.strokeStyle = "rgba(45, 58, 67, 0.94)"),
            (t.lineWidth = 1),
            t.fillRect(d, c, o, s),
            t.strokeRect(d, c, o, s),
            (t.fillStyle = M.textColor),
            l.forEach((e, n) => t.fillText(e, d + 10, c + 7 + 16 + 22 * n)));
        })(e, r),
      ),
      i.players.forEach((e) =>
        ((e, n) => {
          const a = e.x - n.x,
            i = e.y - n.y - Ze() / 2 + 2,
            r = Re(e),
            l = ` [${Math.round(e.energy)}/${Math.round(e.maxEnergy)}]`;
          ((t.font = "950 19px system-ui, sans-serif"), (t.textAlign = "left"));
          const o = t.measureText(r).width,
            s = o + t.measureText(l).width,
            d = a - s / 2;
          ((t.fillStyle = "rgba(27, 37, 45, 0.86)"),
            (t.strokeStyle = "rgba(45, 58, 67, 0.86)"),
            (t.lineWidth = 1),
            t.fillRect(d - 8, i - 31, s + 16, 27),
            t.strokeRect(d - 8, i - 31, s + 16, 27),
            (t.fillStyle = M.textColor),
            t.fillText(r, d, i - 10),
            (t.fillStyle = M.accentColor),
            t.fillText(l, d + o, i - 10));
        })(e, r),
      ),
      ((e, n) => {
        if (!M.showHitboxes) return;
        (t.save(),
          (t.strokeStyle = M.accentColor),
          (t.lineWidth = 1.95),
          e.buildings.forEach((e) => {
            const a = nt(e);
            if (
              (t.strokeRect(a.x - n.x, a.y - n.y, a.width, a.height),
              "wall" === e.type)
            ) {
              const a =
                Math.max(e.hitboxWidth, e.hitboxHeight) *
                (ne.serverConfig?.walls?.openRangeMultiplier || 1.2);
              (t.beginPath(),
                t.arc(e.x - n.x, e.y - n.y, a, 0, 2 * Math.PI),
                t.stroke());
            }
            if ("turret" === e.type || "shield" === e.type) {
              const a = Ve(e.type, e.level);
              a?.range &&
                (t.beginPath(),
                t.arc(e.x - n.x, e.y - n.y, a.range, 0, 2 * Math.PI),
                t.stroke());
            }
          }),
          e.players.forEach((e) => {
            (t.beginPath(),
              t.arc(e.x - n.x, e.y - n.y, Qe(), 0, 2 * Math.PI),
              t.stroke());
          }));
        const a = Se(e);
        (a &&
          ne.serverConfig?.player &&
          (t.beginPath(),
          t.arc(
            a.x - n.x,
            a.y - n.y,
            ne.serverConfig.player.range,
            0,
            2 * Math.PI,
          ),
          t.stroke()),
          e.projectiles.forEach((e) => {
            2 !== e.kind &&
              (t.beginPath(),
              t.arc(e.x - n.x, e.y - n.y, e.radius, 0, 2 * Math.PI),
              t.stroke());
          }),
          t.restore());
      })(i, r),
      ((e, n) => {
        if (!M.showHitboxes || !ne.selectedBuild || !ne.serverConfig) return;
        const a = Se(e);
        if (!a) return;
        ((t.strokeStyle = M.accentColor),
          (t.lineWidth = 2.6),
          t.setLineDash([10, 8]));
        const i = Math.floor(a.x / Ge()),
          r = Math.floor(a.y / Ge());
        for (let e = i - 1; e <= i + 1; e += 1)
          for (let a = r - 1; a <= r + 1; a += 1)
            e >= 0 &&
              a >= 0 &&
              t.strokeRect(e * Ge() - n.x, a * Ge() - n.y, Ge(), Ge());
        t.setLineDash([]);
      })(i, r),
      ht(i, r),
      ne.joined &&
        ((e) => {
          const t = M.minimapSize;
          if ((a.clearRect(0, 0, t, t), !ne.map.width || !ne.map.height))
            return;
          ((a.fillStyle = M.panelColor), a.fillRect(0, 0, t, t));
          const n = Se(e);
          n &&
            e.players.forEach((e) => {
              const i = e.id !== ne.id && n.clan && e.clan === n.clan;
              (e.id === ne.id || i) &&
                ((a.fillStyle = e.id === ne.id ? M.textColor : "#56F0A2"),
                a.beginPath(),
                a.arc(
                  (e.x / ne.map.width) * t,
                  (e.y / ne.map.height) * t,
                  e.id === ne.id ? 4 : 3,
                  0,
                  2 * Math.PI,
                ),
                a.fill());
            });
        })(i),
      yt(i, r),
      l &&
        (h.textContent = `Energy ${Math.round(l.energy)} / ${Math.round(l.maxEnergy)}`),
      requestAnimationFrame(vt));
  },
  xt = (e) => {
    let t = null;
    try {
      t = ((e) => {
        if (!Array.isArray(e)) return null;
        if (e[0] === W) return { type: e[0], id: e[1], serverConfig: ye(e[2]) };
        if (e[0] === H) {
          const t = (e[1] || []).map(de);
          return {
            type: e[0],
            state: {
              players: t,
              buildings: (e[2] || []).map(he),
              projectiles: (e[3] || []).map(pe),
              clans: (e[4] || []).map(ue),
              leaderboard: e[5] ? e[5].map(ce) : t,
            },
          };
        }
        return e[0] === T
          ? { type: e[0], text: e[1] || "" }
          : e[0] === O
            ? { type: e[0] }
            : null;
      })(JSON.parse(e.data));
    } catch {
      return;
    }
    if (t) {
      if (t.type === W)
        return (
          (ne.id = t.id),
          (ne.serverConfig = t.serverConfig),
          (ne.map = {
            width: t.serverConfig.map.width,
            height: t.serverConfig.map.height,
          }),
          u.forEach((e) => {
            const t = Je(e.dataset.build);
            if (!t) return;
            const n = e.querySelector(".buildKey, span")?.textContent || "";
            e.replaceChildren();
            const a = document.createElement("img"),
              i = document.createElement("span"),
              r = document.createElement("span"),
              l = document.createElement("strong"),
              o = document.createElement("em");
            ((a.src = `sprites/${Ve(e.dataset.build, 1)?.spriteKey}.png`),
              (a.alt = ""),
              (a.width = M.inventoryIconSize),
              (a.height = M.inventoryIconSize),
              (i.className = "buildKey"),
              (i.textContent = n),
              (r.className = "buildText"),
              (o.className = "buildLimit"),
              (l.textContent = `${((e, t) => ("solar" === e ? "Solar" : t.displayName))(e.dataset.build, t)} ${t.placeCost}`),
              r.append(l, o),
              e.append(a, i, r));
          }),
          qe(),
          (ne.joined = !0),
          (ne.renderState = null),
          (ne.camera.ready = !1),
          (s.textContent = ""),
          we(),
          Ce(!0),
          (i.style.display = "none"),
          void (d.style.display = "block")
        );
      var n;
      (t.type === H && Ke(t.state),
        t.type === T &&
          ((n = t.text),
          (x.textContent = n),
          (x.style.display = "block"),
          (ne.noticeUntil = performance.now() + 2200)),
        t.type === O && bt("You were destroyed"));
    }
  },
  bt = (e) => {
    ((ne.joined = !1),
      (ne.id = 0),
      (ne.latestState = {
        players: [],
        buildings: [],
        projectiles: [],
        clans: [],
        leaderboard: [],
      }),
      (ne.renderState = null),
      (ne.movementKeys = [0, 0, 0, 0]),
      (ne.lastMovementDirection = null),
      (ne.lastAim = null),
      (ne.shooting = !1),
      (ne.selectedBuild = null),
      (ne.clanOpen = !1),
      (ne.camera.ready = !1),
      (ne.particles = []),
      (ne.shieldBeams = []),
      ne.walkParticles.clear(),
      (ne.snapshots = []),
      Ie(),
      Ue(),
      qe(),
      (d.style.display = "none"),
      (f.style.display = "none"),
      (v.style.display = "none"),
      (y.style.display = "none"),
      a.clearRect(0, 0, M.minimapSize, M.minimapSize),
      (i.style.display = "grid"),
      (s.textContent = e || ""));
  },
  wt = (e) => {
    ((s.textContent = "Connecting..."),
      ne.socket && ne.socket.readyState === WebSocket.OPEN
        ? fe([S, e])
        : ((ne.socket = new WebSocket(o?.value || "ws://127.0.0.1:3000")),
          ne.socket.addEventListener("open", () => fe([S, e])),
          ne.socket.addEventListener("message", xt),
          ne.socket.addEventListener("close", (e) =>
            bt(e.reason || "Disconnected"),
          )));
  },
  Mt = () => ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
(r.addEventListener("submit", (e) => {
  (e.preventDefault(), wt(l.value.trim() || "Player"));
}),
  u.forEach((e) => e.addEventListener("click", () => Xe(e.dataset.build))),
  g.addEventListener("click", () => {
    ((ne.clanOpen = !ne.clanOpen),
      (f.style.display = ne.clanOpen ? "block" : "none"),
      ft());
  }),
  f.addEventListener("input", () => {
    ne.clanInteractionUntil = performance.now() + 1200;
  }),
  f.addEventListener("pointerdown", (e) => {
    const t = e.target.closest("[data-clan-create]"),
      n = e.target.closest("[data-clan-join]"),
      a = e.target.closest("[data-clan-leave]"),
      i = e.target.closest("[data-clan-kick]");
    if (!(t || n || a || i)) return;
    if (
      (e.preventDefault(),
      e.stopPropagation(),
      (ne.clanActionUntil = performance.now() + 300),
      n)
    )
      return void fe([L, Number(n.dataset.clanJoin)]);
    if (a)
      return (fe([D]), (ne.clanOpen = !1), void (f.style.display = "none"));
    if (i) return void fe([A, Number(i.dataset.clanKick)]);
    const r = document.getElementById("clanNameInput"),
      l = r?.value || "";
    ((ne.clanInteractionUntil = 0), r?.blur(), fe([$, l]));
  }),
  v.addEventListener("pointerdown", (e) => {
    const t = e.target.closest("[data-clan-accept]"),
      n = e.target.closest("[data-clan-decline]");
    (t || n) &&
      (e.preventDefault(),
      e.stopPropagation(),
      (ne.clanActionUntil = performance.now() + 300),
      t && fe([P, Number(t.dataset.clanAccept), 1]),
      n && fe([P, Number(n.dataset.clanDecline), 0]));
  }),
  window.addEventListener("resize", ge),
  window.addEventListener("mousemove", (e) => {
    ((ne.mouse.x = e.clientX), (ne.mouse.y = e.clientY));
  }),
  window.addEventListener("mousedown", (e) => {
    var t;
    if (
      !(
        e.repeat ||
        !ne.joined ||
        ne.chatOpen ||
        ((t = e.target),
        t.closest && t.closest("#hud,#upgradePanel,#clanPanel,#joinScreen"))
      )
    )
      return 2 === e.button
        ? (e.preventDefault(), void ut(I))
        : void (
            0 === e.button &&
            (ne.selectedBuild
              ? (() => {
                  if (!ne.selectedBuild || !ne.joined) return;
                  const e = Be(),
                    [t, n] = Ye(e),
                    [a, i] = tt(t, n);
                  (fe([C, ne.selectedBuild, a, i]),
                    (ne.selectedBuild = null),
                    Ue());
                })()
              : it(!0))
          );
  }),
  window.addEventListener("contextmenu", (e) => {
    Mt() || e.preventDefault();
  }),
  window.addEventListener("mouseup", (e) => {
    e.repeat || 0 !== e.button || it(!1);
  }),
  window.addEventListener("keydown", (e) => {
    if ("Escape" === e.code)
      return ne.chatOpen
        ? (e.preventDefault(), void Ie())
        : ((ne.selectedBuild = null),
          (ne.clanOpen = !1),
          (f.style.display = "none"),
          it(!1),
          void Ue());
    if ("Enter" === e.key) {
      if (e.repeat) return void e.preventDefault();
      if (ne.chatOpen)
        return (
          e.preventDefault(),
          void (() => {
            const e = w.value.trim();
            (Ie(), e.length > 0 && fe([R, e]));
          })()
        );
      if (ne.joined && !Mt())
        return (
          e.preventDefault(),
          void (
            ne.joined &&
            ((ne.chatOpen = !0),
            (ne.selectedBuild = null),
            it(!1),
            Ue(),
            (w.value = ""),
            (b.style.display = "block"),
            w.focus())
          )
        );
    }
    if (!ne.chatOpen && !Mt())
      if (Z.has(e.code) || "Shift" === e.key)
        !e.repeat && ne.joined && ut(N, mt) && e.preventDefault();
      else {
        if (Q.has(e.code)) return (e.preventDefault(), void Xe(Q.get(e.code)));
        (V.has(e.code) && e.preventDefault(), xe(e.code, 1) && be());
      }
  }),
  window.addEventListener("keyup", (e) => {
    ne.chatOpen ||
      Mt() ||
      (V.has(e.code) && e.preventDefault(), xe(e.code, 0) && be());
  }),
  window.addEventListener("blur", () => {
    (it(!1), we());
  }),
  document.addEventListener("visibilitychange", () => {
    document.hidden && (it(!1), we());
  }),
  ge(),
  Ue(),
  setInterval(Ce, 100),
  requestAnimationFrame(vt));
