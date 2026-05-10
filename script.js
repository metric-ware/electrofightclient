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
  h = document.getElementById("energyAmount"),
  m = document.getElementById("energyMax"),
  p = document.getElementById("scoreAmount"),
  u = document.getElementById("leaderboard"),
  y = document.getElementById("leaderboardList"),
  g =
    (document.getElementById("buildBar"),
    [...document.querySelectorAll("#buildBar button")]),
  f = document.getElementById("upgradePanel"),
  v = document.getElementById("clanButton"),
  x = document.getElementById("clanPanel"),
  b = document.getElementById("clanRequestsPopup"),
  w = document.getElementById("notice"),
  M = document.getElementById("chatOverlay"),
  S = document.getElementById("chatInput"),
  B = {
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
    positionLerp: 80,
    projectileLerp: 36,
    cameraLerp: 40,
    particleLimit: 420,
    showHitboxes: !1,
    wallOpenOpacity: 0.5,
    friendlyBuildingStroke: "#56F0A2",
    enemyBuildingStroke: "#FF5F6C",
  },
  k = "Are you sure you wanna close the tab?",
  E = 0,
  C = 1,
  I = 2,
  L = 3,
  $ = 4,
  P = 5,
  D = 6,
  A = 7,
  j = 8,
  R = 9,
  N = 10,
  W = 11,
  H = 12,
  O = 13,
  T = 0,
  K = 1,
  z = 2,
  F = 3,
  U = 0,
  q = 1,
  X = 2,
  Y = 3,
  G = 4,
  J = 5,
  V = 6,
  Q = 7,
  Z = 8,
  _ = new Map([
    ["KeyW", 0],
    ["ArrowUp", 0],
    ["KeyS", 1],
    ["ArrowDown", 1],
    ["KeyA", 2],
    ["ArrowLeft", 2],
    ["KeyD", 3],
    ["ArrowRight", 3],
  ]),
  ee = new Map([
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
  te = new Set(["ShiftLeft", "ShiftRight"]),
  ne = ["#ffffff", "#67d8ff", "#b86cff", "#ffad58"],
  ae = "allyplayer",
  ie = "enemyplayer",
  re = {
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
  le = {},
  oe = (e) =>
    e
      ? (le[e] ||
          (le[e] = ((e) => {
            const t = new Image();
            return ((t.src = e), t);
          })(`sprites/${e}.png`)),
        le[e])
      : null,
  se = (e, t, n) => Math.max(t, Math.min(n, e)),
  de = (e, t, n) => e + (t - e) * n,
  ce = (e, t, n) => e + (((t - e + 540) % 360) - 180) * n,
  he = (e, t) => 1 - Math.exp(-e * t),
  me = (e) => ({
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
    score: e[10] || 0,
  }),
  pe = (e) => ({ id: e[0], name: e[1], score: e[2] || 0, clan: e[3] || "" }),
  ue = (e) => ({
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
  ye = (e) => ({
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
  ge = (e) =>
    (e || [])
      .map((e) =>
        Array.isArray(e)
          ? { id: Number(e[0]), name: e[1] || `Player ${e[0]}` }
          : { id: Number(e), name: `Player ${e}` },
      )
      .filter((e) => Number.isFinite(e.id)),
  fe = (e) => {
    const t = ge(e[3]),
      n = ge(e[4]);
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
  ve = (e) => {
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
  xe = () => {
    const i = window.devicePixelRatio || 1;
    ((re.viewport.width = window.innerWidth),
      (re.viewport.height = window.innerHeight),
      (e.width = Math.round(re.viewport.width * i)),
      (e.height = Math.round(re.viewport.height * i)),
      (e.style.width = `${re.viewport.width}px`),
      (e.style.height = `${re.viewport.height}px`),
      t.setTransform(i, 0, 0, i, 0, 0),
      (n.width = Math.round(B.minimapSize * i)),
      (n.height = Math.round(B.minimapSize * i)),
      (n.style.width = `${B.minimapSize}px`),
      (n.style.height = `${B.minimapSize}px`),
      a.setTransform(i, 0, 0, i, 0, 0));
  },
  be = (e) => {
    re.socket &&
      re.socket.readyState === WebSocket.OPEN &&
      re.socket.send(JSON.stringify(e));
  };
window.showHitboxesToggle = () => (
  (B.showHitboxes = !B.showHitboxes),
  B.showHitboxes
);
const we = () => {
    const e = re.movementKeys[0] && !re.movementKeys[1],
      t = re.movementKeys[1] && !re.movementKeys[0],
      n = re.movementKeys[2] && !re.movementKeys[3],
      a = re.movementKeys[3] && !re.movementKeys[2];
    return e && n
      ? J
      : e && a
        ? V
        : t && n
          ? Q
          : t && a
            ? Z
            : e
              ? q
              : t
                ? X
                : n
                  ? Y
                  : a
                    ? G
                    : U;
  },
  Me = (e, t) => {
    const n = _.get(e);
    if (void 0 === n) return !1;
    const a = we();
    return ((re.movementKeys[n] = t), a !== we());
  },
  Se = (e = !1) => {
    if (!re.joined) return;
    const t = we();
    (e || t !== re.lastMovementDirection) &&
      ((re.lastMovementDirection = t), be([C, t]));
  },
  Be = () => {
    ((re.movementKeys = [0, 0, 0, 0]), Se(!0));
  },
  ke = (e) => {
    const t = new Map();
    return (e.forEach((e) => t.set(e.id, e)), t);
  },
  Ee = (e = re.renderState || re.latestState) =>
    e.players.find((e) => e.id === re.id) || null,
  Ce = (e = re.renderState || re.latestState) => {
    const t = Ee(e);
    return t
      ? {
          x: se(
            t.x - re.viewport.width / 2,
            0,
            Math.max(0, re.map.width - re.viewport.width),
          ),
          y: se(
            t.y - re.viewport.height / 2,
            0,
            Math.max(0, re.map.height - re.viewport.height),
          ),
        }
      : { x: 0, y: 0 };
  },
  Ie = (e = re.renderState || re.latestState) =>
    re.camera.ready ? re.camera : Ce(e),
  Le = (e = re.renderState || re.latestState, t = Ie(e)) => {
    const n = Ee(e);
    if (!n) return;
    const a = re.mouse.x + t.x,
      i = re.mouse.y + t.y;
    re.aim = (180 * Math.atan2(i - n.y, a - n.x)) / Math.PI;
  },
  $e = (e = !1) => {
    if (!re.joined) return;
    Le();
    const t = Math.round(re.aim);
    (e || t !== re.lastAim) && ((re.lastAim = t), be([I, t]));
  },
  Pe = () => {
    ((re.chatOpen = !1), (M.style.display = "none"), (S.value = ""), S.blur());
  };
function De() {
  u &&
    b &&
    (b.style.top = `${Math.round(u.getBoundingClientRect().bottom) + 8}px`);
}
const Ae = (e, t) => e.players.find((e) => e.id === t) || null,
  je = (e, t) => e.clans.find((e) => e.members.includes(t)) || null,
  Re = (e, t, n) =>
    Ae(e, n)?.name ||
    t.memberNames.get(n) ||
    t.pendingNames.get(n) ||
    `Player ${n}`,
  Ne = (e, t) => {
    const n = Ee(e),
      a = Ae(e, t);
    return Boolean(
      n && a && (a.friendly || n.id === a.id || (n.clan && n.clan === a.clan)),
    );
  },
  We = (e, t) =>
    ((e, t) => t.friendly || Ne(e, t.ownerId))(e, t)
      ? B.friendlyBuildingStroke
      : B.enemyBuildingStroke,
  He = (e) =>
    e.clan
      ? `[${e.clan.slice(0, re.serverConfig?.clans?.tagDisplayLength || e.clan.length)}] ${e.name}`
      : e.name,
  Oe = (e) => {
    re.particles.length < B.particleLimit && re.particles.push(e);
  },
  Te = (e) => "walk" === e.kind,
  Ke = (e, t, n, a = 10) => {
    for (let i = 0; i < a; i += 1) {
      const a = Math.random() * Math.PI * 2,
        i = 45 + 160 * Math.random(),
        r = 0.18 + 0.28 * Math.random();
      Oe({
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
  ze = (e) =>
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
  Fe = (e) => {
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
          m = (Math.random() - 0.5) * r * h;
        return { x: e + l * s + d * m, y: t + o * s + c * m };
      });
    })(e.x, e.y, e.targetX, e.targetY);
    re.shieldBeams.push({
      id: e.id,
      level: e.level,
      life: 0.28,
      maxLife: 0.28,
      points: t,
      branches: ze(t),
    });
  },
  Ue = (e) => {
    for (
      ((e, t) => {
        const n = new Set(e.projectiles.map((e) => e.id)),
          a = new Set(t.projectiles.map((e) => e.id)),
          i = new Set(t.buildings.map((e) => e.id));
        (t.projectiles.forEach((e) => {
          2 !== e.kind || n.has(e.id) || Fe(e);
        }),
          e.projectiles.forEach((e) => {
            2 === e.kind || a.has(e.id) || Ke(e.x, e.y, at(e.level), 6);
          }),
          e.buildings.forEach((e) => {
            i.has(e.id) || Ke(e.x, e.y, at(e.level), 20);
          }));
      })(re.latestState, e),
        re.latestState = e,
        re.snapshots.push({ time: performance.now(), state: e });
      re.snapshots.length > 2;
    )
      re.snapshots.shift();
    (re.renderState || (re.renderState = e),
      ((e) => {
        const t = [...e]
          .sort(
            (e, t) =>
              (t.score || 0) - (e.score || 0) || e.name.localeCompare(t.name),
          )
          .slice(0, 10);
        (y.replaceChildren(
          ...t.map((e, t) => {
            const n = document.createElement("div"),
              a = document.createElement("span"),
              i = document.createElement("span");
            return (
              (n.className = `leaderboardRow rank${t + 1}`),
              (a.textContent = `${t + 1}. ${He(e)}`),
              (i.textContent = `${Math.round(e.score || 0)}`),
              n.append(a, i),
              n
            );
          }),
        ),
          De());
      })(e.leaderboard || e.players),
      Ge(e),
      xt(),
      performance.now() > re.clanInteractionUntil && bt());
  },
  qe = (e, t, n) => {
    const a = ke(e.players),
      i = ke(e.projectiles);
    return {
      players: t.players.map((e) => {
        const t = a.get(e.id) || e,
          i = e.id === re.id ? re.aim : ce(t.angle, e.angle, n);
        return { ...e, x: de(t.x, e.x, n), y: de(t.y, e.y, n), angle: i };
      }),
      buildings: t.buildings,
      projectiles: t.projectiles.map((e) => {
        const t = i.get(e.id) || e;
        return { ...e, x: de(t.x, e.x, n), y: de(t.y, e.y, n) };
      }),
      clans: t.clans,
      leaderboard: t.leaderboard,
    };
  },
  Xe = (e, t) => {
    const n = ((e) => {
      const t = re.snapshots,
        n = e - B.interpolationDelay;
      if (!t.length) return re.latestState;
      if (n <= t[0].time) return t[0].state;
      for (let e = 0; e < t.length - 1; e += 1) {
        const a = t[e],
          i = t[e + 1];
        if (n >= a.time && n <= i.time)
          return qe(
            a.state,
            i.state,
            se((n - a.time) / Math.max(1, i.time - a.time), 0, 1),
          );
      }
      return t[t.length - 1].state;
    })(e);
    if (!re.renderState) return ((re.renderState = n), n);
    const a = ke(re.renderState.players),
      i = ke(re.renderState.projectiles),
      r = he(B.positionLerp, t),
      l = he(B.projectileLerp, t);
    return (
      (re.renderState = {
        players: n.players.map((e) => {
          const t = a.get(e.id) || e,
            n = e.id === re.id ? re.aim : ce(t.angle, e.angle, r);
          return { ...e, x: de(t.x, e.x, r), y: de(t.y, e.y, r), angle: n };
        }),
        buildings: n.buildings,
        projectiles: n.projectiles.map((e) => {
          const t = i.get(e.id) || e;
          return { ...e, x: de(t.x, e.x, l), y: de(t.y, e.y, l) };
        }),
        clans: n.clans,
        leaderboard: n.leaderboard,
      }),
      re.renderState
    );
  },
  Ye = () =>
    g.forEach((e) =>
      e.classList.toggle("selected", e.dataset.build === re.selectedBuild),
    ),
  Ge = (e = re.latestState) =>
    g.forEach((t) => {
      const n = Ze(t.dataset.build),
        a = t.querySelector(".buildLimit");
      n &&
        a &&
        (a.textContent = `Built ${((e, t) => e.buildings.filter((e) => e.ownerId === re.id && e.type === t).length)(e, t.dataset.build)}/${n.limit}`);
    }),
  Je = (e) => {
    (!re.selectedBuild && e && ot(!1),
      (re.selectedBuild = re.selectedBuild === e ? null : e),
      Ye());
  },
  Ve = (e) => [re.mouse.x + e.x, re.mouse.y + e.y],
  Qe = () => re.serverConfig?.placement?.chunkSize || 1,
  Ze = (e) => re.serverConfig?.buildings?.[e] || null,
  _e = (e, t) => Ze(e)?.levels?.[t] || null,
  et = () => re.serverConfig?.player?.radius || 1,
  tt = () => B.playerSpriteSize,
  nt = () => re.serverConfig?.placement?.chunkSize || B.buildingSpriteSize,
  at = (e) => ne[e] || ne[1],
  it = (e, t) => [Math.floor(e / Qe()), Math.floor(t / Qe())],
  rt = (e) => ({
    x: e.x - e.hitboxWidth / 2,
    y: e.y - e.hitboxHeight / 2,
    width: e.hitboxWidth,
    height: e.hitboxHeight,
  }),
  lt = (e, t, n, a) => {
    const i = Ze(t),
      r = Ee(e),
      l = ((e) =>
        e.buildings.find((e) => e.ownerId === re.id && "core" === e.type) ||
        null)(e);
    if (!i || !r || r.energy < i.placeCost) return !1;
    const o = {
      x: n * Qe(),
      y: a * Qe(),
      width: i.gridWidth * Qe(),
      height: i.gridHeight * Qe(),
    };
    return (
      !(
        e.buildings.filter((e) => e.ownerId === re.id && e.type === t).length >=
        i.limit
      ) &&
      ("core" !== t || !l) &&
      !("core" !== t && !l) &&
      !!((e, t, n) => {
        const a = Ze(n);
        return Boolean(
          a &&
          Number.isInteger(e) &&
          Number.isInteger(t) &&
          e >= 0 &&
          t >= 0 &&
          (e + a.gridWidth) * Qe() <= re.map.width &&
          (t + a.gridHeight) * Qe() <= re.map.height,
        );
      })(n, a, t) &&
      !((e, t, n, a) => {
        const i = Ze(a);
        return e.buildings.some((e) => {
          const a = Ze(e.type);
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
            (m = a.gridHeight),
            r < d + h && r + o > d && l < c + m && l + s > c)
          );
          var r, l, o, s, d, c, h, m;
        });
      })(e, n, a, t) &&
      !!((e, t, n) => {
        const a = Ee(e);
        if (!a) return !1;
        const i = Math.floor(a.x / Qe()),
          r = Math.floor(a.y / Qe());
        return Math.abs(t - i) <= 1 && Math.abs(n - r) <= 1;
      })(e, n, a) &&
      (!re.serverConfig.placement.playerOverlapBlocksPlacement ||
        !e.players.some((e) =>
          ((e, t) => {
            const n = se(e.x, t.x, t.x + t.width),
              a = se(e.y, t.y, t.y + t.height);
            return (e.x - n) ** 2 + (e.y - a) ** 2 <= et() ** 2;
          })(e, o),
        ))
    );
  },
  ot = (e) => {
    (!re.joined && e) ||
      (re.shooting !== e && ((re.shooting = e), be([e ? L : N, e ? 1 : 0])));
  },
  st = (e) => {
    ((t.fillStyle = B.outerMapBackground),
      t.fillRect(0, 0, re.viewport.width, re.viewport.height));
    const n = Math.max(0, -e.x),
      a = Math.max(0, -e.y),
      i = Math.min(re.viewport.width, re.map.width - e.x),
      r = Math.min(re.viewport.height, re.map.height - e.y);
    ((t.fillStyle = B.mapBackground),
      i > n && r > a && t.fillRect(n, a, i - n, r - a),
      re.serverConfig &&
        ((e, n, a, i) => {
          const r = Math.floor(e.x / n) * n,
            l = Math.floor(e.y / n) * n;
          ((t.strokeStyle = a), (t.lineWidth = i), t.beginPath());
          for (let a = r; a <= e.x + re.viewport.width; a += n)
            (t.moveTo(Math.round(a - e.x) + 0.5, Math.max(0, -e.y)),
              t.lineTo(
                Math.round(a - e.x) + 0.5,
                Math.min(re.viewport.height, re.map.height - e.y),
              ));
          for (let a = l; a <= e.y + re.viewport.height; a += n)
            (t.moveTo(Math.max(0, -e.x), Math.round(a - e.y) + 0.5),
              t.lineTo(
                Math.min(re.viewport.width, re.map.width - e.x),
                Math.round(a - e.y) + 0.5,
              ));
          t.stroke();
        })(e, Qe(), B.gridLineColor, B.gridLineWidth));
  },
  dt = (e, n, a) => {
    const i = e.x - n.x,
      r = e.y - n.y,
      l = at(e.level),
      o = oe(e.spriteKey || _e(e.type, e.level)?.spriteKey),
      s = nt(),
      d =
        "wall" === e.type && e.open
          ? re.serverConfig?.walls?.openOpacity || B.wallOpenOpacity
          : 1;
    (t.save(),
      t.translate(i, r),
      (t.globalAlpha = d),
      o && o.complete
        ? t.drawImage(o, -s / 2, -s / 2, s, s)
        : ((t.fillStyle = l), t.fillRect(-s / 2, -s / 2, s, s)),
      (t.globalAlpha = 1),
      (t.strokeStyle = We(a, e)),
      (t.lineWidth = 4),
      t.strokeRect(
        -e.hitboxWidth / 2,
        -e.hitboxHeight / 2,
        e.hitboxWidth,
        e.hitboxHeight,
      ),
      ((e, n) => {
        if (e.maxDurability <= 0) return;
        const a = se(e.durability / e.maxDurability, 0, 1);
        if (a >= 1) return;
        const i = Math.max(
            62,
            Math.min(e.hitboxWidth - 24, 0.78 * e.hitboxWidth),
          ),
          r = Math.max(12, Math.min(16, 0.1 * e.hitboxHeight)),
          l = -i / 2,
          o = e.hitboxHeight / 2 - r - 12;
        ((t.fillStyle = "rgba(11, 22, 32, 0.86)"),
          t.fillRect(l - 4, o - 4, i + 8, r + 8),
          (t.fillStyle = "rgba(45, 58, 67, 0.94)"),
          t.fillRect(l, o, i, r),
          (t.fillStyle = We(n, e)),
          t.fillRect(l, o, i * a, r),
          (t.fillStyle = "rgba(255, 255, 255, 0.24)"),
          t.fillRect(l, o, i * a, 3));
      })(e, a),
      t.restore());
  },
  ct = (e, n) => {
    if (2 === e.kind) return;
    const a = e.x - n.x,
      i = e.y - n.y,
      r = at(e.level),
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
        const t = e.friendly ? B.friendlyBuildingStroke : B.enemyBuildingStroke,
          n = Math.hypot(e.vx, e.vy) || 1,
          a = e.vx / n,
          i = e.vy / n,
          r = 0.2 + 0.12 * Math.random();
        Oe({
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
  ht = (e, n, a, i, r, l) => {
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
  mt = (e, n) => {
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
  pt = (e, n = () => !0) => {
    (re.particles.forEach((a) => {
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
  ut = (e, n) => {
    if (!re.selectedBuild || !re.joined) return;
    const [a, i] = Ve(n),
      [r, l] = it(a, i),
      [o, s] = ((e, t) => [e * Qe() + Qe() / 2, t * Qe() + Qe() / 2])(r, l),
      d = Ze(re.selectedBuild);
    if (!d) return;
    const c = lt(e, re.selectedBuild, r, l) ? "#56F0A2" : "#FF5F6C",
      h = oe(_e(re.selectedBuild, 1)?.spriteKey),
      m = nt();
    (t.save(),
      t.translate(o - n.x, s - n.y),
      (t.globalAlpha = 0.52),
      h && h.complete && t.drawImage(h, -m / 2, -m / 2, m, m),
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
  yt = (e, t) => {
    const [n, a] = Ve(t);
    return (
      e.buildings.find((e) => {
        const t = rt(e);
        return (
          e.ownerId === re.id &&
          n >= t.x &&
          a >= t.y &&
          n <= t.x + t.width &&
          a <= t.y + t.height
        );
      }) || null
    );
  },
  gt = (e) => "core" !== e.type,
  ft = (e, t = () => !0) => {
    const n = re.renderState || re.latestState,
      a = yt(n, Ie(n));
    return !(!a || !t(a)) && (be([e, a.id]), !0);
  },
  vt = (e, t) => {
    if (re.selectedBuild || !re.joined)
      return ((f.style.display = "none"), void (re.hoveredBuildingId = 0));
    const n = yt(e, t);
    if (!n)
      return (
        (re.hoveredBuildingId = 0),
        void (f.matches(":hover") || (f.style.display = "none"))
      );
    const a = n.level >= 3,
      i = Ze(n.type),
      r = _e(n.type, n.level),
      l = a || !i ? 0 : i.upgradeCost[n.level];
    if (
      re.hoveredBuildingId !== n.id ||
      re.hoveredDurability !== n.durability
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
        d = gt(n) ? '<div class="meta">Delete Build = Shift</div>' : "";
      ((f.dataset.buildingId = n.id),
        (f.innerHTML = `<div class="title">${i?.displayName || n.type} Level ${n.level}</div>${o}${s}${d}<div class="meta">Durability: ${Math.round(n.durability)} / ${n.maxDurability}</div>${t}`),
        (re.hoveredBuildingId = n.id),
        (re.hoveredDurability = n.durability));
    }
    ((f.style.left = `${re.mouse.x + 14}px`),
      (f.style.top = `${re.mouse.y + 14}px`),
      (f.style.display = "block"));
  },
  xt = () => {
    const e = re.latestState,
      t = je(e, re.id);
    if ((De(), performance.now() < re.clanActionUntil)) return;
    if (!t || t.leaderId !== re.id || 0 === t.pending.length)
      return ((b.style.display = "none"), void b.replaceChildren());
    const n = t.pending[0],
      a = `<div class="clanRequest"><span>${Re(e, t, n)}</span><div class="requestActions"><button data-clan-accept="${n}" type="button" aria-label="Accept">✓</button><button data-clan-decline="${n}" type="button" aria-label="Reject">✕</button></div></div>`;
    ((b.innerHTML = `<div class="title">Clan Request</div>${a}`),
      (b.style.display = "grid"));
  };
function bt() {
  if (!re.clanOpen) return;
  if (
    "clanNameInput" === document.activeElement?.id ||
    performance.now() < re.clanInteractionUntil ||
    performance.now() < re.clanActionUntil
  )
    return;
  const e = re.latestState,
    t = je(e, re.id),
    n = document.getElementById("clanNameInput")?.value || "";
  if (((x.style.display = "block"), !t)) {
    const t =
      e.clans
        .map((t) => {
          const n = Re(e, t, t.leaderId),
            a = t.members.map((n) => Re(e, t, n)).join(", ");
          return `<div class="clanBlock"><div>[${t.name}]</div><div>Leader: ${n}</div><div>Players: ${a || "none"}</div><button data-clan-join="${t.id}" type="button">Request</button></div>`;
        })
        .join("") || '<div class="meta">No clans yet</div>';
    return void (x.innerHTML = `<div class="title">Clans</div><input id="clanNameInput" placeholder="CLAN" value="${n.replace(/"/g, "&quot;")}" /><button data-clan-create type="button">Create Clan</button><div class="clanSection">${t}</div>`);
  }
  const a = Re(e, t, t.leaderId),
    i = t.leaderId === re.id,
    r =
      t.members
        .filter((e) => e !== t.leaderId)
        .map(
          (n) =>
            `<div class="clanRow"><span>${Re(e, t, n)}</span>${i ? `<button data-clan-kick="${n}" type="button">Kick</button>` : ""}</div>`,
        )
        .join("") || '<div class="meta">none</div>';
  x.innerHTML = `<div class="title">[${t.name}]</div><div class="clanSection"><div>Leader: ${a}</div><div>Players</div>${r}</div><button data-clan-leave type="button">Leave Clan</button>`;
}
const wt = (e) => {
    const n = Math.min((e - re.lastRender) / 1e3, 0.05);
    ((re.lastRender = e),
      (re.fpsFrames += 1),
      e - re.fpsTime >= 1e3 &&
        ((c.textContent = `FPS: ${re.fpsFrames} TPS: ${re.serverConfig?.network?.tickRate || 0}`),
        (re.fpsFrames = 0),
        (re.fpsTime = e)),
      "block" === w.style.display &&
        e > re.noticeUntil &&
        (w.style.display = "none"));
    const i = Xe(e, n),
      r = ((e, t = 0) => {
        const n = Ce(e);
        if (!re.camera.ready)
          return (
            (re.camera.x = n.x),
            (re.camera.y = n.y),
            (re.camera.ready = !0),
            re.camera
          );
        const a = he(B.cameraLerp, t);
        return (
          (re.camera.x = de(re.camera.x, n.x, a)),
          (re.camera.y = de(re.camera.y, n.y, a)),
          re.camera
        );
      })(i, n);
    Le(i, r);
    const l = Ee(i);
    (((e) => {
      re.particles = re.particles.filter(
        (t) => (
          (t.life -= e),
          (t.x += t.vx * e),
          (t.y += t.vy * e),
          (t.alpha = se(t.life / t.maxLife, 0, 1)),
          t.life > 0
        ),
      );
    })(n),
      ((e) => {
        re.shieldBeams = re.shieldBeams.filter(
          (t) => ((t.life -= e), t.life > 0),
        );
      })(n),
      ((e, t) => {
        const n = performance.now(),
          a = new Set(e.players.map((e) => e.id));
        (e.players.forEach((a) => {
          const i = re.walkParticles.get(a.id),
            r = (i ? Math.hypot(a.x - i.x, a.y - i.y) : 0) / Math.max(t, 0.016),
            l = !i || n - i.time > 82;
          if (i && r > 28 && l) {
            const t = Ne(e, a.id)
                ? B.friendlyBuildingStroke
                : B.enemyBuildingStroke,
              n = a.x - i.x,
              r = a.y - i.y,
              l = Math.hypot(n, r) || 1,
              o = -n / l,
              s = -r / l,
              d = et();
            for (let e = 0; e < 3; e += 1) {
              const e = (Math.random() - 0.5) * d * 0.72,
                n = d * (0.3 + 0.32 * Math.random()),
                i = 0.34 + 0.18 * Math.random();
              Oe({
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
          re.walkParticles.set(a.id, {
            x: a.x,
            y: a.y,
            time: !i || (r > 28 && l) ? n : i.time,
          });
        }),
          [...re.walkParticles.keys()].forEach((e) => {
            a.has(e) || re.walkParticles.delete(e);
          }));
      })(i, n),
      st(r),
      i.buildings.forEach((e) => dt(e, r, i)),
      pt(r, Te),
      i.players.forEach((e) =>
        ((e, n, a) => {
          const i = tt(),
            r = Ne(a, e.id),
            l = oe(r ? ae : ie),
            o = e.id === re.id ? re.aim : e.angle,
            s = e.x - n.x,
            d = e.y - n.y;
          (t.save(),
            t.translate(s, d),
            t.rotate(((o + 90) * Math.PI) / 180),
            l?.complete && t.drawImage(l, -i / 2, -i / 2, i, i),
            t.restore());
        })(e, r, i),
      ),
      i.projectiles.forEach((e) => ct(e, r)),
      re.shieldBeams.forEach((e) =>
        ((e, n) => {
          const a = at(e.level),
            i = se(e.life / e.maxLife, 0, 1),
            r = e.points[e.points.length - 1];
          (t.save(),
            ht(e.points, n, a, 0.28 * i, 14, 22),
            ht(e.points, n, a, 0.72 * i, 4, 14),
            ht(e.points, n, "#ffffff", 0.9 * i, 1.4, 3),
            e.branches.forEach((e) => ht(e, n, a, 0.35 * i, 2, 10)),
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
      pt(r, (e) => !Te(e)),
      i.players.forEach((e) =>
        ((e, n) => {
          if (!e.chatMessage) return;
          const a = e.x - n.x,
            i = e.y - n.y - tt() / 2 + 2,
            r = Math.min(280, Math.max(160, re.viewport.width - 40));
          ((t.font = "850 18px system-ui, sans-serif"), (t.textAlign = "left"));
          const l = mt(e.chatMessage, r);
          if (!l.length) return;
          const o = Math.max(...l.map((e) => t.measureText(e).width)) + 20,
            s = 22 * l.length + 14,
            d = a - o / 2,
            c = i - 39 - s;
          ((t.fillStyle = "rgba(27, 37, 45, 0.92)"),
            (t.strokeStyle = "rgba(45, 58, 67, 0.94)"),
            (t.lineWidth = 1),
            t.fillRect(d, c, o, s),
            t.strokeRect(d, c, o, s),
            (t.fillStyle = B.textColor),
            l.forEach((e, n) => t.fillText(e, d + 10, c + 7 + 16 + 22 * n)));
        })(e, r),
      ),
      i.players.forEach((e) =>
        ((e, n) => {
          const a = e.x - n.x,
            i = e.y - n.y - tt() / 2 + 2;
          ((t.font = "950 19px system-ui, sans-serif"), (t.textAlign = "left"));
          const r = [
              [He(e), B.textColor],
              [" [", B.textColor],
              [`${Math.round(e.energy)}`, B.accentColor],
              ["/", B.textColor],
              [`${Math.round(e.maxEnergy)}`, B.accentColor],
              ["]", B.textColor],
              [" [", B.textColor],
              [`${Math.round(e.score || 0)}`, B.enemyBuildingStroke],
              ["]", B.textColor],
            ],
            l = r.reduce((e, n) => e + t.measureText(n[0]).width, 0),
            o = a - l / 2;
          ((t.fillStyle = "rgba(27, 37, 45, 0.86)"),
            (t.strokeStyle = "rgba(45, 58, 67, 0.86)"),
            (t.lineWidth = 1),
            t.fillRect(o - 8, i - 31, l + 16, 27),
            t.strokeRect(o - 8, i - 31, l + 16, 27),
            r.reduce(
              (e, n) => (
                (t.fillStyle = n[1]),
                t.fillText(n[0], o + e, i - 10),
                e + t.measureText(n[0]).width
              ),
              0,
            ));
        })(e, r),
      ),
      ((e, n) => {
        if (!B.showHitboxes) return;
        (t.save(),
          (t.strokeStyle = B.accentColor),
          (t.lineWidth = 1.95),
          e.buildings.forEach((e) => {
            const a = rt(e);
            if (
              (t.strokeRect(a.x - n.x, a.y - n.y, a.width, a.height),
              "wall" === e.type)
            ) {
              const a =
                Math.max(e.hitboxWidth, e.hitboxHeight) *
                (re.serverConfig?.walls?.openRangeMultiplier || 1.2);
              (t.beginPath(),
                t.arc(e.x - n.x, e.y - n.y, a, 0, 2 * Math.PI),
                t.stroke());
            }
            if ("turret" === e.type || "shield" === e.type) {
              const a = _e(e.type, e.level);
              a?.range &&
                (t.beginPath(),
                t.arc(e.x - n.x, e.y - n.y, a.range, 0, 2 * Math.PI),
                t.stroke());
            }
          }),
          e.players.forEach((e) => {
            (t.beginPath(),
              t.arc(e.x - n.x, e.y - n.y, et(), 0, 2 * Math.PI),
              t.stroke());
          }));
        const a = Ee(e);
        (a &&
          re.serverConfig?.player &&
          (t.beginPath(),
          t.arc(
            a.x - n.x,
            a.y - n.y,
            re.serverConfig.player.range,
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
        if (!B.showHitboxes || !re.selectedBuild || !re.serverConfig) return;
        const a = Ee(e);
        if (!a) return;
        ((t.strokeStyle = B.accentColor),
          (t.lineWidth = 2.6),
          t.setLineDash([10, 8]));
        const i = Math.floor(a.x / Qe()),
          r = Math.floor(a.y / Qe());
        for (let e = i - 1; e <= i + 1; e += 1)
          for (let a = r - 1; a <= r + 1; a += 1)
            e >= 0 &&
              a >= 0 &&
              t.strokeRect(e * Qe() - n.x, a * Qe() - n.y, Qe(), Qe());
        t.setLineDash([]);
      })(i, r),
      ut(i, r),
      re.joined &&
        ((e) => {
          const t = B.minimapSize;
          if ((a.clearRect(0, 0, t, t), !re.map.width || !re.map.height))
            return;
          ((a.fillStyle = B.panelColor), a.fillRect(0, 0, t, t));
          const n = Ee(e);
          n &&
            e.players.forEach((e) => {
              const i = e.id !== re.id && n.clan && e.clan === n.clan;
              (e.id === re.id || i) &&
                ((a.fillStyle = e.id === re.id ? B.textColor : "#56F0A2"),
                a.beginPath(),
                a.arc(
                  (e.x / re.map.width) * t,
                  (e.y / re.map.height) * t,
                  e.id === re.id ? 4 : 3,
                  0,
                  2 * Math.PI,
                ),
                a.fill());
            });
        })(i),
      vt(i, r),
      l &&
        ((h.textContent = Math.round(l.energy)),
        (m.textContent = Math.round(l.maxEnergy)),
        (p.textContent = Math.round(l.score || 0))),
      requestAnimationFrame(wt));
  },
  Mt = (e) => {
    let t = null;
    try {
      t = ((e) => {
        if (!Array.isArray(e)) return null;
        if (e[0] === T) return { type: e[0], id: e[1], serverConfig: ve(e[2]) };
        if (e[0] === K) {
          const t = (e[1] || []).map(me);
          return {
            type: e[0],
            state: {
              players: t,
              buildings: (e[2] || []).map(ue),
              projectiles: (e[3] || []).map(ye),
              clans: (e[4] || []).map(fe),
              leaderboard: e[5] ? e[5].map(pe) : t,
            },
          };
        }
        return e[0] === z
          ? { type: e[0], text: e[1] || "" }
          : e[0] === F
            ? { type: e[0] }
            : null;
      })(JSON.parse(e.data));
    } catch {
      return;
    }
    if (t) {
      if (t.type === T)
        return (
          (re.id = t.id),
          (re.serverConfig = t.serverConfig),
          (re.map = {
            width: t.serverConfig.map.width,
            height: t.serverConfig.map.height,
          }),
          g.forEach((e) => {
            const t = Ze(e.dataset.build);
            if (!t) return;
            const n = e.querySelector(".buildKey, span")?.textContent || "";
            e.replaceChildren();
            const a = document.createElement("img"),
              i = document.createElement("span"),
              r = document.createElement("span"),
              l = document.createElement("strong"),
              o = document.createElement("em");
            ((a.src = `sprites/${_e(e.dataset.build, 1)?.spriteKey}.png`),
              (a.alt = ""),
              (a.width = B.inventoryIconSize),
              (a.height = B.inventoryIconSize),
              (i.className = "buildKey"),
              (i.textContent = n),
              (r.className = "buildText"),
              (o.className = "buildLimit"));
            const s = document.createElement("span");
            ((s.className = "buildCost"),
              (s.textContent = t.placeCost),
              l.append(
                `${((e, t) => ("solar" === e ? "Solar" : t.displayName))(e.dataset.build, t)} `,
                s,
              ),
              r.append(l, o),
              e.append(a, i, r));
          }),
          Ge(),
          (re.joined = !0),
          (re.renderState = null),
          (re.camera.ready = !1),
          (s.textContent = ""),
          Be(),
          $e(!0),
          (i.style.display = "none"),
          void (d.style.display = "block")
        );
      var n;
      (t.type === K && Ue(t.state),
        t.type === z &&
          ((n = t.text),
          (w.textContent = n),
          (w.style.display = "block"),
          (re.noticeUntil = performance.now() + 2200)),
        t.type === F && St("You were destroyed"));
    }
  },
  St = (e) => {
    ((re.joined = !1),
      (re.id = 0),
      (re.latestState = {
        players: [],
        buildings: [],
        projectiles: [],
        clans: [],
        leaderboard: [],
      }),
      (re.renderState = null),
      (re.movementKeys = [0, 0, 0, 0]),
      (re.lastMovementDirection = null),
      (re.lastAim = null),
      (re.shooting = !1),
      (re.selectedBuild = null),
      (re.clanOpen = !1),
      (re.camera.ready = !1),
      (re.particles = []),
      (re.shieldBeams = []),
      re.walkParticles.clear(),
      (re.snapshots = []),
      Pe(),
      Ye(),
      Ge(),
      (d.style.display = "none"),
      (x.style.display = "none"),
      (b.style.display = "none"),
      (f.style.display = "none"),
      a.clearRect(0, 0, B.minimapSize, B.minimapSize),
      (i.style.display = "grid"),
      (s.textContent = e || ""));
  },
  Bt = (e) => {
    ((s.textContent = "Connecting..."),
      re.socket && re.socket.readyState === WebSocket.OPEN
        ? be([E, e])
        : ((re.socket = new WebSocket(o?.value || "ws://127.0.0.1:3000")),
          re.socket.addEventListener("open", () => be([E, e])),
          re.socket.addEventListener("message", Mt),
          re.socket.addEventListener("close", (e) =>
            St(e.reason || "Disconnected"),
          )));
  },
  kt = () => ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
(r.addEventListener("submit", (e) => {
  (e.preventDefault(), Bt(l.value.trim() || "Player"));
}),
  g.forEach((e) => e.addEventListener("click", () => Je(e.dataset.build))),
  v.addEventListener("click", () => {
    ((re.clanOpen = !re.clanOpen),
      (x.style.display = re.clanOpen ? "block" : "none"),
      bt());
  }),
  x.addEventListener("input", () => {
    re.clanInteractionUntil = performance.now() + 1200;
  }),
  x.addEventListener("pointerdown", (e) => {
    const t = e.target.closest("[data-clan-create]"),
      n = e.target.closest("[data-clan-join]"),
      a = e.target.closest("[data-clan-leave]"),
      i = e.target.closest("[data-clan-kick]");
    if (!(t || n || a || i)) return;
    if (
      (e.preventDefault(),
      e.stopPropagation(),
      (re.clanActionUntil = performance.now() + 300),
      n)
    )
      return void be([A, Number(n.dataset.clanJoin)]);
    if (a)
      return (be([R]), (re.clanOpen = !1), void (x.style.display = "none"));
    if (i) return void be([W, Number(i.dataset.clanKick)]);
    const r = document.getElementById("clanNameInput"),
      l = r?.value || "";
    ((re.clanInteractionUntil = 0), r?.blur(), be([D, l]));
  }),
  b.addEventListener("pointerdown", (e) => {
    const t = e.target.closest("[data-clan-accept]"),
      n = e.target.closest("[data-clan-decline]");
    (t || n) &&
      (e.preventDefault(),
      e.stopPropagation(),
      (re.clanActionUntil = performance.now() + 300),
      t && be([j, Number(t.dataset.clanAccept), 1]),
      n && be([j, Number(n.dataset.clanDecline), 0]));
  }),
  window.addEventListener("resize", xe),
  window.addEventListener("mousemove", (e) => {
    ((re.mouse.x = e.clientX), (re.mouse.y = e.clientY));
  }),
  window.addEventListener("mousedown", (e) => {
    var t;
    if (
      !(
        e.repeat ||
        !re.joined ||
        re.chatOpen ||
        ((t = e.target),
        t.closest && t.closest("#hud,#upgradePanel,#clanPanel,#joinScreen"))
      )
    )
      return 2 === e.button
        ? (e.preventDefault(), void ft(P))
        : void (
            0 === e.button &&
            (re.selectedBuild
              ? (() => {
                  if (!re.selectedBuild || !re.joined) return;
                  const e = Ie(),
                    [t, n] = Ve(e),
                    [a, i] = it(t, n);
                  (be([$, re.selectedBuild, a, i]),
                    (re.selectedBuild = null),
                    Ye());
                })()
              : ot(!0))
          );
  }),
  window.addEventListener("contextmenu", (e) => {
    kt() || e.preventDefault();
  }),
  window.addEventListener("mouseup", (e) => {
    e.repeat || 0 !== e.button || ot(!1);
  }),
  window.addEventListener("keydown", (e) => {
    if ("Escape" === e.code)
      return re.chatOpen
        ? (e.preventDefault(), void Pe())
        : ((re.selectedBuild = null),
          (re.clanOpen = !1),
          (x.style.display = "none"),
          ot(!1),
          void Ye());
    if ("Enter" === e.key) {
      if (e.repeat) return void e.preventDefault();
      if (re.chatOpen)
        return (
          e.preventDefault(),
          void (() => {
            const e = S.value.trim();
            (Pe(), e.length > 0 && be([H, e]));
          })()
        );
      if (re.joined && !kt())
        return (
          e.preventDefault(),
          void (
            re.joined &&
            ((re.chatOpen = !0),
            (re.selectedBuild = null),
            ot(!1),
            Ye(),
            (S.value = ""),
            (M.style.display = "block"),
            S.focus())
          )
        );
    }
    if (!re.chatOpen && !kt())
      if (te.has(e.code) || "Shift" === e.key)
        !e.repeat && re.joined && ft(O, gt) && e.preventDefault();
      else {
        if (ee.has(e.code))
          return (e.preventDefault(), void Je(ee.get(e.code)));
        (_.has(e.code) && e.preventDefault(), Me(e.code, 1) && Se());
      }
  }),
  window.addEventListener("keyup", (e) => {
    re.chatOpen ||
      kt() ||
      (_.has(e.code) && e.preventDefault(), Me(e.code, 0) && Se());
  }),
  window.addEventListener("blur", () => {
    (ot(!1), Be());
  }),
  window.addEventListener("beforeunload", (e) => {
    if (re.joined) return (e.preventDefault(), (e.returnValue = k), k);
  }),
  document.addEventListener("visibilitychange", () => {
    document.hidden && (ot(!1), Be());
  }),
  xe(),
  Ye(),
  setInterval($e, 100),
  requestAnimationFrame(wt));
