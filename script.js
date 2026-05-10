const e = document.getElementById("game"),
  t = e.getContext("2d"),
  n = document.getElementById("minimap"),
  a = n.getContext("2d"),
  i = document.getElementById("joinScreen"),
  l = document.getElementById("joinForm"),
  r = document.getElementById("nameInput"),
  o = document.getElementById("serverSelect"),
  s = document.getElementById("menuStatus"),
  d = document.getElementById("hud"),
  c = document.getElementById("fpsCounter"),
  h = document.getElementById("energyAmount"),
  u = document.getElementById("energyMax"),
  p = document.getElementById("scoreAmount"),
  m = document.getElementById("leaderboard"),
  y = document.getElementById("leaderboardList"),
  g =
    (document.getElementById("buildBar"),
    [...document.querySelectorAll("#buildBar button")]),
  f = document.getElementById("upgradePanel"),
  v = document.getElementById("clanButton"),
  x = document.getElementById("clanPanel"),
  b = document.getElementById("clanRequestsPopup"),
  w = document.getElementById("notice"),
  S = document.getElementById("chatOverlay"),
  M = document.getElementById("chatInput"),
  k = {
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
    playerInterpolationTicks: 1,
    projectileInterpolationTicks: 1,
    cameraInterpolationTicks: 1,
    enemyAngleInterpolationTicks: 1,
    particleLimit: 420,
    showHitboxes: !1,
    wallOpenOpacity: 0.5,
    friendlyBuildingStroke: "#56F0A2",
    enemyBuildingStroke: "#FF5F6C",
  },
  B = "Are you sure you wanna close the tab?",
  E = new Map([
    ["KeyW", 0],
    ["ArrowUp", 0],
    ["KeyS", 1],
    ["ArrowDown", 1],
    ["KeyA", 2],
    ["ArrowLeft", 2],
    ["KeyD", 3],
    ["ArrowRight", 3],
  ]),
  C = new Map([
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
  I = new Set(["ShiftLeft", "ShiftRight"]),
  A = ["#ffffff", "#67d8ff", "#b86cff", "#ffad58"],
  $ = {
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
      vaults: [],
    },
    previousState: null,
    previousStateAt: 0,
    latestStateAt: 0,
    renderState: null,
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
  L = {},
  P = (e) =>
    e
      ? (L[e] ||
          (L[e] = ((e) => {
            const t = new Image();
            return ((t.src = e), t);
          })(`sprites/${e}.png`)),
        L[e])
      : null,
  D = (e, t, n) => Math.max(t, Math.min(n, e)),
  R = (e, t, n) => e + (t - e) * n,
  j = () => 1e3 / Math.max(1, $.serverConfig?.network?.tickRate || 20),
  N = (e, t) => {
    if (!$.previousState || $.previousStateAt <= 0) return 1;
    const n = $.latestStateAt - $.previousStateAt;
    if (n <= 0) return 1;
    const a = e - ((e) => Math.max(0, Number(e) || 0) * j())(t);
    return D((a - $.previousStateAt) / n, 0, 1);
  },
  T = (e) => ({
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
  W = (e) => ({ id: e[0], name: e[1], score: e[2] || 0, clan: e[3] || "" }),
  H = (e) => ({
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
  O = (e) => ({
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
  K = (e) => ({ level: e[0] || 1, x: e[1] || 0, y: e[2] || 0 }),
  z = (e) =>
    (e || [])
      .map((e) =>
        Array.isArray(e)
          ? { id: Number(e[0]), name: e[1] || `Player ${e[0]}` }
          : { id: Number(e), name: `Player ${e}` },
      )
      .filter((e) => Number.isFinite(e.id)),
  F = (e) => {
    const t = z(e[3]),
      n = z(e[4]);
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
  U = (e) => {
    const t = e?.[1] || [],
      n = e?.[2] || [],
      a = e?.[3] || [],
      i = e?.[4] || [],
      l = e?.[7] || [],
      r = e?.[8] || [],
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
      renderRadius: { width: l[0], height: l[1] },
      walls: { openRangeMultiplier: r[0], openOpacity: r[1] },
      network: { tickRate: o[0] || 0 },
    };
  },
  q = () => {
    const i = window.devicePixelRatio || 1;
    (($.viewport.width = window.innerWidth),
      ($.viewport.height = window.innerHeight),
      (e.width = Math.round($.viewport.width * i)),
      (e.height = Math.round($.viewport.height * i)),
      (e.style.width = `${$.viewport.width}px`),
      (e.style.height = `${$.viewport.height}px`),
      t.setTransform(i, 0, 0, i, 0, 0),
      (n.width = Math.round(k.minimapSize * i)),
      (n.height = Math.round(k.minimapSize * i)),
      (n.style.width = `${k.minimapSize}px`),
      (n.style.height = `${k.minimapSize}px`),
      a.setTransform(i, 0, 0, i, 0, 0));
  },
  X = (e) => {
    $.socket &&
      $.socket.readyState === WebSocket.OPEN &&
      $.socket.send(JSON.stringify(e));
  };
window.showHitboxesToggle = () => (
  (k.showHitboxes = !k.showHitboxes),
  k.showHitboxes
);
const Y = () => {
    const e = $.movementKeys[0] && !$.movementKeys[1],
      t = $.movementKeys[1] && !$.movementKeys[0],
      n = $.movementKeys[2] && !$.movementKeys[3],
      a = $.movementKeys[3] && !$.movementKeys[2];
    return e && n
      ? 5
      : e && a
        ? 6
        : t && n
          ? 7
          : t && a
            ? 8
            : e
              ? 1
              : t
                ? 2
                : n
                  ? 3
                  : a
                    ? 4
                    : 0;
  },
  G = (e, t) => {
    const n = E.get(e);
    if (void 0 === n) return !1;
    const a = Y();
    return (($.movementKeys[n] = t), a !== Y());
  },
  J = (e = !1) => {
    if (!$.joined) return;
    const t = Y();
    (e || t !== $.lastMovementDirection) &&
      (($.lastMovementDirection = t), X([1, t]));
  },
  V = () => {
    (($.movementKeys = [0, 0, 0, 0]), J(!0));
  },
  Q = (e) => {
    const t = new Map();
    return (e.forEach((e) => t.set(e.id, e)), t);
  },
  Z = (e = $.renderState || $.latestState) =>
    e.players.find((e) => e.id === $.id) || null,
  _ = (e = $.renderState || $.latestState) => {
    const t = Z(e);
    return t
      ? {
          x: D(
            t.x - $.viewport.width / 2,
            0,
            Math.max(0, $.map.width - $.viewport.width),
          ),
          y: D(
            t.y - $.viewport.height / 2,
            0,
            Math.max(0, $.map.height - $.viewport.height),
          ),
        }
      : { x: 0, y: 0 };
  },
  ee = (e = $.renderState || $.latestState) =>
    $.camera.ready ? $.camera : _(e),
  te = (e = $.renderState || $.latestState, t = ee(e)) => {
    const n = Z(e);
    if (!n) return;
    const a = $.mouse.x + t.x,
      i = $.mouse.y + t.y;
    $.aim = (180 * Math.atan2(i - n.y, a - n.x)) / Math.PI;
  },
  ne = (e = !1) => {
    if (!$.joined) return;
    te();
    const t = Math.round($.aim);
    (e || t !== $.lastAim) && (($.lastAim = t), X([2, t]));
  },
  ae = () => {
    (($.chatOpen = !1), (S.style.display = "none"), (M.value = ""), M.blur());
  };
function ie() {
  m &&
    b &&
    (b.style.top = `${Math.round(m.getBoundingClientRect().bottom) + 8}px`);
}
const le = (e, t) => e.players.find((e) => e.id === t) || null,
  re = (e, t) => e.clans.find((e) => e.members.includes(t)) || null,
  oe = (e, t, n) =>
    le(e, n)?.name ||
    t.memberNames.get(n) ||
    t.pendingNames.get(n) ||
    `Player ${n}`,
  se = (e, t) => {
    const n = Z(e),
      a = le(e, t);
    return Boolean(
      n && a && (a.friendly || n.id === a.id || (n.clan && n.clan === a.clan)),
    );
  },
  de = (e, t) =>
    ((e, t) => t.friendly || se(e, t.ownerId))(e, t)
      ? k.friendlyBuildingStroke
      : k.enemyBuildingStroke,
  ce = (e) =>
    e.clan
      ? `[${e.clan.slice(0, $.serverConfig?.clans?.tagDisplayLength || e.clan.length)}] ${e.name}`
      : e.name,
  he = (e) => {
    $.particles.length < k.particleLimit && $.particles.push(e);
  },
  ue = (e) => "walk" === e.kind,
  pe = (e, t, n, a = 10) => {
    for (let i = 0; i < a; i += 1) {
      const a = Math.random() * Math.PI * 2,
        i = 45 + 160 * Math.random(),
        l = 0.18 + 0.28 * Math.random();
      he({
        x: e,
        y: t,
        vx: Math.cos(a) * i,
        vy: Math.sin(a) * i,
        life: l,
        maxLife: l,
        size: 1.5 + 2.5 * Math.random(),
        color: n,
        alpha: 1,
      });
    }
  },
  me = (e) =>
    e
      .slice(1, -1)
      .filter((e, t) => t % 2 == 0)
      .map((t, n) => {
        const a = e[n + 2] || t,
          i =
            Math.atan2(a.y - t.y, a.x - t.x) +
            (Math.random() > 0.5 ? 1 : -1) * (0.65 + 0.45 * Math.random()),
          l = 18 + 26 * Math.random();
        return [t, { x: t.x + Math.cos(i) * l, y: t.y + Math.sin(i) * l }];
      }),
  ye = () =>
    g.forEach((e) =>
      e.classList.toggle("selected", e.dataset.build === $.selectedBuild),
    ),
  ge = (e = $.latestState) =>
    g.forEach((t) => {
      const n = be(t.dataset.build),
        a = t.querySelector(".buildLimit");
      n &&
        a &&
        (a.textContent = `Built ${((e, t) => e.buildings.filter((e) => e.ownerId === $.id && e.type === t).length)(e, t.dataset.build)}/${n.limit}`);
    }),
  fe = (e) => {
    (!$.selectedBuild && e && Ae(!1),
      ($.selectedBuild = $.selectedBuild === e ? null : e),
      ye());
  },
  ve = (e) => [$.mouse.x + e.x, $.mouse.y + e.y],
  xe = () => $.serverConfig?.placement?.chunkSize || 1,
  be = (e) => $.serverConfig?.buildings?.[e] || null,
  we = (e, t) => be(e)?.levels?.[t] || null,
  Se = () => $.serverConfig?.player?.radius || 1,
  Me = () => k.playerSpriteSize,
  ke = () => $.serverConfig?.placement?.chunkSize || k.buildingSpriteSize,
  Be = (e) => A[e] || A[1],
  Ee = ["#67d8ff", "#b86cff", "#ffad58"],
  Ce = (e, t) => [Math.floor(e / xe()), Math.floor(t / xe())],
  Ie = (e) => ({
    x: e.x - e.hitboxWidth / 2,
    y: e.y - e.hitboxHeight / 2,
    width: e.hitboxWidth,
    height: e.hitboxHeight,
  }),
  Ae = (e) => {
    (!$.joined && e) ||
      ($.shooting !== e && (($.shooting = e), X([e ? 3 : 10, e ? 1 : 0])));
  },
  $e = (e, n, a, i, l, r) => {
    ((t.globalAlpha = i),
      (t.strokeStyle = a),
      (t.shadowColor = a),
      (t.shadowBlur = r),
      (t.lineWidth = l),
      (t.lineJoin = "round"),
      (t.lineCap = "round"),
      t.beginPath(),
      e.forEach((e, a) => {
        const i = e.x - n.x,
          l = e.y - n.y;
        0 === a ? t.moveTo(i, l) : t.lineTo(i, l);
      }),
      t.stroke());
  },
  Le = (e, n = () => !0) => {
    ($.particles.forEach((a) => {
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
  Pe = (e, t) => {
    const [n, a] = ve(t);
    return (
      e.buildings.find((e) => {
        const t = Ie(e);
        return (
          e.ownerId === $.id &&
          n >= t.x &&
          a >= t.y &&
          n <= t.x + t.width &&
          a <= t.y + t.height
        );
      }) || null
    );
  },
  De = (e) => "core" !== e.type,
  Re = (e, t = () => !0) => {
    const n = $.renderState || $.latestState,
      a = Pe(n, ee(n));
    return !(!a || !t(a) || (X([e, a.id]), 0));
  };
function je() {
  if (!$.clanOpen) return;
  if (
    "clanNameInput" === document.activeElement?.id ||
    performance.now() < $.clanInteractionUntil ||
    performance.now() < $.clanActionUntil
  )
    return;
  const e = $.latestState,
    t = re(e, $.id),
    n = document.getElementById("clanNameInput")?.value || "";
  if (((x.style.display = "block"), !t)) {
    const t =
      e.clans
        .map((t) => {
          const n = oe(e, t, t.leaderId),
            a = t.members.map((n) => oe(e, t, n)).join(", ");
          return `<div class="clanBlock"><div>[${t.name}]</div><div>Leader: ${n}</div><div>Players: ${a || "none"}</div><button data-clan-join="${t.id}" type="button">Request</button></div>`;
        })
        .join("") || '<div class="meta">No clans yet</div>';
    return void (x.innerHTML = `<div class="title">Clans</div><input id="clanNameInput" placeholder="CLAN" value="${n.replace(/"/g, "&quot;")}" /><button data-clan-create type="button">Create Clan</button><div class="clanSection">${t}</div>`);
  }
  const a = oe(e, t, t.leaderId),
    i = t.leaderId === $.id,
    l =
      t.members
        .filter((e) => e !== t.leaderId)
        .map(
          (n) =>
            `<div class="clanRow"><span>${oe(e, t, n)}</span>${i ? `<button data-clan-kick="${n}" type="button">Kick</button>` : ""}</div>`,
        )
        .join("") || '<div class="meta">none</div>';
  x.innerHTML = `<div class="title">[${t.name}]</div><div class="clanSection"><div>Leader: ${a}</div><div>Players</div>${l}</div><button data-clan-leave type="button">Leave Clan</button>`;
}
const Ne = (e) => {
    const n = Math.min((e - $.lastRender) / 1e3, 0.05);
    (($.lastRender = e),
      ($.fpsFrames += 1),
      e - $.fpsTime >= 1e3 &&
        ((c.textContent = `FPS: ${$.fpsFrames} TPS: ${$.serverConfig?.network?.tickRate || 0}`),
        ($.fpsFrames = 0),
        ($.fpsTime = e)),
      "block" === w.style.display &&
        e > $.noticeUntil &&
        (w.style.display = "none"));
    const i = ((e) => {
        const t = $.previousState,
          n = $.latestState,
          a = Q(t?.players || []),
          i = Q(t?.projectiles || []),
          l = N(e, k.playerInterpolationTicks),
          r = N(e, k.projectileInterpolationTicks),
          o = N(e, k.enemyAngleInterpolationTicks);
        return (
          ($.renderState = {
            players: n.players.map((e) =>
              ((e, t, n, a) => {
                return e
                  ? {
                      ...t,
                      x: R(e.x, t.x, n),
                      y: R(e.y, t.y, n),
                      angle:
                        t.id === $.id
                          ? $.aim
                          : ((i = e.angle),
                            (l = t.angle),
                            (r = a),
                            i + (((l - i + 540) % 360) - 180) * r),
                    }
                  : { ...t, angle: t.id === $.id ? $.aim : t.angle };
                var i, l, r;
              })(a.get(e.id), e, l, o),
            ),
            buildings: n.buildings,
            projectiles: n.projectiles.map((e) =>
              ((e, t, n) =>
                e ? { ...t, x: R(e.x, t.x, n), y: R(e.y, t.y, n) } : t)(
                i.get(e.id),
                e,
                r,
              ),
            ),
            clans: n.clans,
            leaderboard: n.leaderboard,
            vaults: n.vaults,
          }),
          $.renderState
        );
      })(e),
      l = ((e, t) => {
        const n = N(t, k.cameraInterpolationTicks),
          a = $.previousState && Z($.previousState) ? $.previousState : e,
          i = Z($.latestState) ? $.latestState : e,
          l = _(a),
          r = _(i);
        return (
          ($.camera.x = R(l.x, r.x, n)),
          ($.camera.y = R(l.y, r.y, n)),
          ($.camera.ready = !0),
          $.camera
        );
      })(i, e);
    te(i, l);
    const r = Z(i);
    (((e) => {
      $.particles = $.particles.filter(
        (t) => (
          (t.life -= e),
          (t.x += t.vx * e),
          (t.y += t.vy * e),
          (t.alpha = D(t.life / t.maxLife, 0, 1)),
          t.life > 0
        ),
      );
    })(n),
      ((e) => {
        $.shieldBeams = $.shieldBeams.filter(
          (t) => ((t.life -= e), t.life > 0),
        );
      })(n),
      ((e, t) => {
        const n = performance.now(),
          a = new Set(e.players.map((e) => e.id));
        (e.players.forEach((a) => {
          const i = $.walkParticles.get(a.id),
            l = (i ? Math.hypot(a.x - i.x, a.y - i.y) : 0) / Math.max(t, 0.016),
            r = !i || n - i.time > 82;
          if (i && l > 28 && r) {
            const t = se(e, a.id)
                ? k.friendlyBuildingStroke
                : k.enemyBuildingStroke,
              n = a.x - i.x,
              l = a.y - i.y,
              r = Math.hypot(n, l) || 1,
              o = -n / r,
              s = -l / r,
              d = Se();
            for (let e = 0; e < 3; e += 1) {
              const e = (Math.random() - 0.5) * d * 0.72,
                n = d * (0.3 + 0.32 * Math.random()),
                i = 0.34 + 0.18 * Math.random();
              he({
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
          $.walkParticles.set(a.id, {
            x: a.x,
            y: a.y,
            time: !i || (l > 28 && r) ? n : i.time,
          });
        }),
          [...$.walkParticles.keys()].forEach((e) => {
            a.has(e) || $.walkParticles.delete(e);
          }));
      })(i, n),
      ((e) => {
        ((t.fillStyle = k.outerMapBackground),
          t.fillRect(0, 0, $.viewport.width, $.viewport.height));
        const n = Math.max(0, -e.x),
          a = Math.max(0, -e.y),
          i = Math.min($.viewport.width, $.map.width - e.x),
          l = Math.min($.viewport.height, $.map.height - e.y);
        ((t.fillStyle = k.mapBackground),
          i > n && l > a && t.fillRect(n, a, i - n, l - a),
          $.serverConfig &&
            ((e, n, a, i) => {
              const l = Math.floor(e.x / n) * n,
                r = Math.floor(e.y / n) * n;
              ((t.strokeStyle = a), (t.lineWidth = i), t.beginPath());
              for (let a = l; a <= e.x + $.viewport.width; a += n)
                (t.moveTo(Math.round(a - e.x) + 0.5, Math.max(0, -e.y)),
                  t.lineTo(
                    Math.round(a - e.x) + 0.5,
                    Math.min($.viewport.height, $.map.height - e.y),
                  ));
              for (let a = r; a <= e.y + $.viewport.height; a += n)
                (t.moveTo(Math.max(0, -e.x), Math.round(a - e.y) + 0.5),
                  t.lineTo(
                    Math.min($.viewport.width, $.map.width - e.x),
                    Math.round(a - e.y) + 0.5,
                  ));
              t.stroke();
            })(e, xe(), k.gridLineColor, k.gridLineWidth));
      })(l),
      i.buildings.forEach((e) =>
        ((e, n, a) => {
          const i = e.x - n.x,
            l = e.y - n.y,
            r = Be(e.level),
            o = P(e.spriteKey || we(e.type, e.level)?.spriteKey),
            s = ke(),
            d =
              "wall" === e.type && e.open
                ? $.serverConfig?.walls?.openOpacity || k.wallOpenOpacity
                : 1;
          (t.save(),
            t.translate(i, l),
            (t.globalAlpha = d),
            o && o.complete
              ? t.drawImage(o, -s / 2, -s / 2, s, s)
              : ((t.fillStyle = r), t.fillRect(-s / 2, -s / 2, s, s)),
            (t.globalAlpha = 1),
            (t.strokeStyle = de(a, e)),
            (t.lineWidth = 4),
            t.strokeRect(
              -e.hitboxWidth / 2,
              -e.hitboxHeight / 2,
              e.hitboxWidth,
              e.hitboxHeight,
            ),
            ((e, n) => {
              if (e.maxDurability <= 0) return;
              const a = D(e.durability / e.maxDurability, 0, 1);
              if (a >= 1) return;
              const i = Math.max(
                  62,
                  Math.min(e.hitboxWidth - 24, 0.78 * e.hitboxWidth),
                ),
                l = Math.max(12, Math.min(16, 0.1 * e.hitboxHeight)),
                r = -i / 2,
                o = e.hitboxHeight / 2 - l - 12;
              ((t.fillStyle = "rgba(11, 22, 32, 0.86)"),
                t.fillRect(r - 4, o - 4, i + 8, l + 8),
                (t.fillStyle = "rgba(45, 58, 67, 0.94)"),
                t.fillRect(r, o, i, l),
                (t.fillStyle = de(n, e)),
                t.fillRect(r, o, i * a, l),
                (t.fillStyle = "rgba(255, 255, 255, 0.24)"),
                t.fillRect(r, o, i * a, 3));
            })(e, a),
            t.restore());
        })(e, l, i),
      ),
      Le(l, ue),
      i.players.forEach((e) =>
        ((e, n, a) => {
          const i = Me(),
            l = se(a, e.id),
            r = P(l ? "allyplayer" : "enemyplayer"),
            o = e.id === $.id ? $.aim : e.angle,
            s = e.x - n.x,
            d = e.y - n.y;
          (t.save(),
            t.translate(s, d),
            t.rotate(((o + 90) * Math.PI) / 180),
            r?.complete && t.drawImage(r, -i / 2, -i / 2, i, i),
            t.restore());
        })(e, l, i),
      ),
      i.projectiles.forEach((e) =>
        ((e, n) => {
          if (2 === e.kind) return;
          const a = e.x - n.x,
            i = e.y - n.y,
            l = Be(e.level),
            r = e.radius + 2;
          ((t.fillStyle = l),
            (t.shadowColor = l),
            (t.shadowBlur = 16),
            (t.globalAlpha = 0.42),
            t.beginPath(),
            t.arc(a, i, e.radius + 6, 0, 2 * Math.PI),
            t.fill(),
            (t.globalAlpha = 1),
            t.beginPath(),
            t.arc(a, i, r, 0, 2 * Math.PI),
            t.fill(),
            (t.shadowBlur = 0),
            ((e) => {
              if (2 === e.kind || Math.random() > 0.35) return;
              const t = e.friendly
                  ? k.friendlyBuildingStroke
                  : k.enemyBuildingStroke,
                n = Math.hypot(e.vx, e.vy) || 1,
                a = e.vx / n,
                i = e.vy / n,
                l = 0.2 + 0.12 * Math.random();
              he({
                x: e.x - 12 * a,
                y: e.y - 12 * i,
                vx: 0.045 * -e.vx + 42 * (Math.random() - 0.5),
                vy: 0.045 * -e.vy + 42 * (Math.random() - 0.5),
                life: l,
                maxLife: l,
                size: 2.2 + 2 * Math.random(),
                color: t,
                alpha: 0.9,
              });
            })(e));
        })(e, l),
      ),
      $.shieldBeams.forEach((e) =>
        ((e, n) => {
          const a = Be(e.level),
            i = D(e.life / e.maxLife, 0, 1),
            l = e.points[e.points.length - 1];
          (t.save(),
            $e(e.points, n, a, 0.28 * i, 14, 22),
            $e(e.points, n, a, 0.72 * i, 4, 14),
            $e(e.points, n, "#ffffff", 0.9 * i, 1.4, 3),
            e.branches.forEach((e) => $e(e, n, a, 0.35 * i, 2, 10)),
            (t.globalAlpha = 0.52 * i),
            (t.fillStyle = a),
            (t.shadowColor = a),
            (t.shadowBlur = 18),
            t.beginPath(),
            t.arc(l.x - n.x, l.y - n.y, 11, 0, 2 * Math.PI),
            t.fill(),
            t.restore());
        })(e, l),
      ),
      Le(l, (e) => !ue(e)),
      i.players.forEach((e) =>
        ((e, n) => {
          if (!e.chatMessage) return;
          const a = e.x - n.x,
            i = e.y - n.y - Me() / 2 + 2,
            l = Math.min(280, Math.max(160, $.viewport.width - 40));
          ((t.font = "850 18px system-ui, sans-serif"), (t.textAlign = "left"));
          const r =
            ((o = e.chatMessage),
            (s = l),
            String(o || "")
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
                      e < i.length &&
                      t.measureText(i.slice(0, e + 1)).width <= n;
                    )
                      e += 1;
                    (a.push(i.slice(0, e)), (i = i.slice(e)));
                  }
                  return (i && a.push(i), a);
                })(e, s),
              )
              .reduce(
                (e, n) => {
                  const a = e[e.length - 1] || "",
                    i = a ? `${a} ${n}` : n;
                  return !a || t.measureText(i).width <= s
                    ? [...e.slice(0, -1), i]
                    : [...e, n];
                },
                [""],
              )
              .filter(Boolean));
          var o, s;
          if (!r.length) return;
          const d = Math.max(...r.map((e) => t.measureText(e).width)) + 20,
            c = 22 * r.length + 14,
            h = a - d / 2,
            u = i - 39 - c;
          ((t.fillStyle = "rgba(27, 37, 45, 0.92)"),
            (t.strokeStyle = "rgba(45, 58, 67, 0.94)"),
            (t.lineWidth = 1),
            t.fillRect(h, u, d, c),
            t.strokeRect(h, u, d, c),
            (t.fillStyle = k.textColor),
            r.forEach((e, n) => t.fillText(e, h + 10, u + 7 + 16 + 22 * n)));
        })(e, l),
      ),
      i.players.forEach((e) =>
        ((e, n) => {
          const a = e.x - n.x,
            i = e.y - n.y - Me() / 2 + 2;
          ((t.font = "950 19px system-ui, sans-serif"), (t.textAlign = "left"));
          const l = [
              [ce(e), k.textColor],
              [" [", k.textColor],
              [`${Math.round(e.energy)}`, k.accentColor],
              ["/", k.textColor],
              [`${Math.round(e.maxEnergy)}`, k.accentColor],
              ["]", k.textColor],
              [" [", k.textColor],
              [`${Math.round(e.score || 0)}`, k.enemyBuildingStroke],
              ["]", k.textColor],
            ],
            r = l.reduce((e, n) => e + t.measureText(n[0]).width, 0),
            o = a - r / 2;
          ((t.fillStyle = "rgba(27, 37, 45, 0.86)"),
            (t.strokeStyle = "rgba(45, 58, 67, 0.86)"),
            (t.lineWidth = 1),
            t.fillRect(o - 8, i - 31, r + 16, 27),
            t.strokeRect(o - 8, i - 31, r + 16, 27),
            l.reduce(
              (e, n) => (
                (t.fillStyle = n[1]),
                t.fillText(n[0], o + e, i - 10),
                e + t.measureText(n[0]).width
              ),
              0,
            ));
        })(e, l),
      ),
      i.buildings.forEach((e) =>
        ((e, n) => {
          if (!((e) => "vault" === e.type)(e)) return;
          const a = `Level ${e.level} Vault`,
            i = e.x - n.x,
            l = e.y - n.y - e.hitboxHeight / 2 - 28;
          (t.save(),
            (t.font = "1000 28px system-ui, sans-serif"),
            (t.textAlign = "center"),
            (t.textBaseline = "middle"));
          const r = t.measureText(a).width + 26;
          ((t.fillStyle = "rgba(27, 37, 45, 0.92)"),
            (t.strokeStyle = k.enemyBuildingStroke),
            (t.lineWidth = 2),
            t.fillRect(i - r / 2, l - 20, r, 40),
            t.strokeRect(i - r / 2, l - 20, r, 40),
            (t.fillStyle = k.textColor),
            t.fillText(a, i, l + 1),
            t.restore());
        })(e, l),
      ),
      ((e, n) => {
        if (!k.showHitboxes) return;
        (t.save(),
          (t.strokeStyle = k.accentColor),
          (t.lineWidth = 1.95),
          e.buildings.forEach((e) => {
            const a = Ie(e);
            if (
              (t.strokeRect(a.x - n.x, a.y - n.y, a.width, a.height),
              "wall" === e.type)
            ) {
              const a =
                Math.max(e.hitboxWidth, e.hitboxHeight) *
                ($.serverConfig?.walls?.openRangeMultiplier || 1.2);
              (t.beginPath(),
                t.arc(e.x - n.x, e.y - n.y, a, 0, 2 * Math.PI),
                t.stroke());
            }
            if ("turret" === e.type || "shield" === e.type) {
              const a = we(e.type, e.level);
              a?.range &&
                (t.beginPath(),
                t.arc(e.x - n.x, e.y - n.y, a.range, 0, 2 * Math.PI),
                t.stroke());
            }
          }),
          e.players.forEach((e) => {
            (t.beginPath(),
              t.arc(e.x - n.x, e.y - n.y, Se(), 0, 2 * Math.PI),
              t.stroke());
          }));
        const a = Z(e);
        (a &&
          $.serverConfig?.player &&
          (t.beginPath(),
          t.arc(
            a.x - n.x,
            a.y - n.y,
            $.serverConfig.player.range,
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
      })(i, l),
      ((e, n) => {
        if (!k.showHitboxes || !$.selectedBuild || !$.serverConfig) return;
        const a = Z(e);
        if (!a) return;
        ((t.strokeStyle = k.accentColor),
          (t.lineWidth = 2.6),
          t.setLineDash([10, 8]));
        const i = Math.floor(a.x / xe()),
          l = Math.floor(a.y / xe());
        for (let e = i - 1; e <= i + 1; e += 1)
          for (let a = l - 1; a <= l + 1; a += 1)
            e >= 0 &&
              a >= 0 &&
              t.strokeRect(e * xe() - n.x, a * xe() - n.y, xe(), xe());
        t.setLineDash([]);
      })(i, l),
      ((e, n) => {
        if (!$.selectedBuild || !$.joined) return;
        const [a, i] = ve(n),
          [l, r] = Ce(a, i),
          [o, s] = ((e, t) => [e * xe() + xe() / 2, t * xe() + xe() / 2])(l, r),
          d = be($.selectedBuild);
        if (!d) return;
        const c = ((e, t, n, a) => {
            const i = be(t),
              l = Z(e),
              r = ((e) =>
                e.buildings.find(
                  (e) => e.ownerId === $.id && "core" === e.type,
                ) || null)(e);
            if (!i || !l || l.energy < i.placeCost) return !1;
            const o = {
              x: n * xe(),
              y: a * xe(),
              width: i.gridWidth * xe(),
              height: i.gridHeight * xe(),
            };
            return !(
              e.buildings.filter((e) => e.ownerId === $.id && e.type === t)
                .length >= i.limit ||
              ("core" === t && r) ||
              ("core" !== t && !r) ||
              !((e, t, n) => {
                const a = be(n);
                return Boolean(
                  a &&
                  Number.isInteger(e) &&
                  Number.isInteger(t) &&
                  e >= 0 &&
                  t >= 0 &&
                  (e + a.gridWidth) * xe() <= $.map.width &&
                  (t + a.gridHeight) * xe() <= $.map.height,
                );
              })(n, a, t) ||
              ((e, t, n, a) => {
                const i = be(a);
                return e.buildings.some((e) => {
                  const a = be(e.type);
                  return (
                    i &&
                    a &&
                    ((l = t),
                    (r = n),
                    (o = i.gridWidth),
                    (s = i.gridHeight),
                    (d = e.gridX),
                    (c = e.gridY),
                    (h = a.gridWidth),
                    (u = a.gridHeight),
                    l < d + h && l + o > d && r < c + u && r + s > c)
                  );
                  var l, r, o, s, d, c, h, u;
                });
              })(e, n, a, t) ||
              !((e, t, n) => {
                const a = Z(e);
                if (!a) return !1;
                const i = Math.floor(a.x / xe()),
                  l = Math.floor(a.y / xe());
                return Math.abs(t - i) <= 1 && Math.abs(n - l) <= 1;
              })(e, n, a) ||
              ($.serverConfig.placement.playerOverlapBlocksPlacement &&
                e.players.some((e) =>
                  ((e, t) => {
                    const n = D(e.x, t.x, t.x + t.width),
                      a = D(e.y, t.y, t.y + t.height);
                    return (e.x - n) ** 2 + (e.y - a) ** 2 <= Se() ** 2;
                  })(e, o),
                ))
            );
          })(e, $.selectedBuild, l, r)
            ? "#56F0A2"
            : "#FF5F6C",
          h = P(we($.selectedBuild, 1)?.spriteKey),
          u = ke();
        (t.save(),
          t.translate(o - n.x, s - n.y),
          (t.globalAlpha = 0.52),
          h && h.complete && t.drawImage(h, -u / 2, -u / 2, u, u),
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
      })(i, l),
      $.joined &&
        ((e) => {
          const t = k.minimapSize;
          if ((a.clearRect(0, 0, t, t), !$.map.width || !$.map.height)) return;
          ((a.fillStyle = k.panelColor),
            a.fillRect(0, 0, t, t),
            (e.vaults || []).forEach((e) => {
              const n = (e.x / $.map.width) * t,
                i = (e.y / $.map.height) * t;
              var l;
              ((a.fillStyle = ((l = e.level), Ee[D(l, 1, 3) - 1])),
                a.fillRect(n - 4, i - 4, 8, 8));
            }));
          const n = Z(e);
          n &&
            e.players.forEach((e) => {
              const i = e.id !== $.id && n.clan && e.clan === n.clan;
              (e.id === $.id || i) &&
                ((a.fillStyle = e.id === $.id ? k.textColor : "#56F0A2"),
                a.beginPath(),
                a.arc(
                  (e.x / $.map.width) * t,
                  (e.y / $.map.height) * t,
                  e.id === $.id ? 4 : 3,
                  0,
                  2 * Math.PI,
                ),
                a.fill());
            });
        })(i),
      ((e, t) => {
        if ($.selectedBuild || !$.joined)
          return ((f.style.display = "none"), void ($.hoveredBuildingId = 0));
        const n = Pe(e, t);
        if (!n)
          return (
            ($.hoveredBuildingId = 0),
            void (f.matches(":hover") || (f.style.display = "none"))
          );
        const a = n.level >= 3,
          i = be(n.type),
          l = we(n.type, n.level),
          r = a || !i ? 0 : i.upgradeCost[n.level];
        if (
          $.hoveredBuildingId !== n.id ||
          $.hoveredDurability !== n.durability
        ) {
          const e = ((e, t) =>
              ({
                core: [`Max energy: ${t?.maxEnergyCapacity || 0}`],
                solar: [`Generation: ${t?.energyGeneration || 0}/s`],
                turret: [
                  `Range: ${t?.range || 0}`,
                  `Damage: ${t?.damage || 0}`,
                ],
                shield: [
                  `Range: ${t?.range || 0}`,
                  `Heal: ${Math.round(100 * (t?.healPercent || 0))}%`,
                  `Interval: ${((t?.fireInterval || 0) / 1e3).toFixed(1)}s`,
                ],
                wall: [],
              })[e] || [])(n.type, l),
            t = e.map((e) => `<div class="meta">${e}</div>`).join(""),
            o = a ? "" : '<div class="meta">Upgrade = Right Click</div>',
            s = a
              ? '<div class="meta">MAX</div>'
              : `<div class="meta">Upgrade Cost: ${r} energy</div>`,
            d = De(n) ? '<div class="meta">Delete Build = Shift</div>' : "";
          ((f.dataset.buildingId = n.id),
            (f.innerHTML = `<div class="title">${i?.displayName || n.type} Level ${n.level}</div>${o}${s}${d}<div class="meta">Durability: ${Math.round(n.durability)} / ${n.maxDurability}</div>${t}`),
            ($.hoveredBuildingId = n.id),
            ($.hoveredDurability = n.durability));
        }
        ((f.style.left = `${$.mouse.x + 14}px`),
          (f.style.top = `${$.mouse.y + 14}px`),
          (f.style.display = "block"));
      })(i, l),
      r &&
        ((h.textContent = Math.round(r.energy)),
        (u.textContent = Math.round(r.maxEnergy)),
        (p.textContent = Math.round(r.score || 0))),
      requestAnimationFrame(Ne));
  },
  Te = (e) => {
    let t = null;
    try {
      t = ((e) => {
        if (!Array.isArray(e)) return null;
        if (0 === e[0]) return { type: e[0], id: e[1], serverConfig: U(e[2]) };
        if (1 === e[0]) {
          const t = (e[1] || []).map(T);
          return {
            type: e[0],
            state: {
              players: t,
              buildings: (e[2] || []).map(H),
              projectiles: (e[3] || []).map(O),
              clans: (e[4] || []).map(F),
              leaderboard: e[5] ? e[5].map(W) : t,
              vaults: (e[6] || []).map(K),
            },
          };
        }
        return 2 === e[0]
          ? { type: e[0], text: e[1] || "" }
          : 3 === e[0]
            ? { type: e[0] }
            : null;
      })(JSON.parse(e.data));
    } catch {
      return;
    }
    if (t) {
      if (0 === t.type)
        return (
          ($.id = t.id),
          ($.serverConfig = t.serverConfig),
          ($.map = {
            width: t.serverConfig.map.width,
            height: t.serverConfig.map.height,
          }),
          g.forEach((e) => {
            const t = be(e.dataset.build);
            if (!t) return;
            const n = e.querySelector(".buildKey, span")?.textContent || "";
            e.replaceChildren();
            const a = document.createElement("img"),
              i = document.createElement("span"),
              l = document.createElement("span"),
              r = document.createElement("strong"),
              o = document.createElement("em");
            ((a.src = `sprites/${we(e.dataset.build, 1)?.spriteKey}.png`),
              (a.alt = ""),
              (a.width = k.inventoryIconSize),
              (a.height = k.inventoryIconSize),
              (i.className = "buildKey"),
              (i.textContent = n),
              (l.className = "buildText"),
              (o.className = "buildLimit"));
            const s = document.createElement("span");
            ((s.className = "buildCost"),
              (s.textContent = t.placeCost),
              r.append(
                `${((e, t) => ("solar" === e ? "Solar" : t.displayName))(e.dataset.build, t)} `,
                s,
              ),
              l.append(r, o),
              e.append(a, i, l));
          }),
          ge(),
          ($.joined = !0),
          ($.renderState = null),
          ($.previousState = null),
          ($.previousStateAt = 0),
          ($.latestStateAt = 0),
          ($.camera.ready = !1),
          (s.textContent = ""),
          V(),
          ne(!0),
          (i.style.display = "none"),
          void (d.style.display = "block")
        );
      var n;
      (1 === t.type &&
        ((e) => {
          const t = performance.now();
          (((e, t) => {
            const n = new Set(e.projectiles.map((e) => e.id)),
              a = new Set(t.projectiles.map((e) => e.id)),
              i = new Set(t.buildings.map((e) => e.id));
            (t.projectiles.forEach((e) => {
              2 !== e.kind ||
                n.has(e.id) ||
                ((e) => {
                  if (
                    2 !== e.kind ||
                    !Number.isFinite(e.targetX) ||
                    !Number.isFinite(e.targetY)
                  )
                    return;
                  const t = ((e, t, n, a, i = 7, l = 24) => {
                    const r = n - e,
                      o = a - t,
                      s = Math.hypot(r, o) || 1,
                      d = -o / s,
                      c = r / s;
                    return Array.from({ length: i + 1 }, (n, a) => {
                      const s = a / i,
                        h = Math.sin(s * Math.PI),
                        u = (Math.random() - 0.5) * l * h;
                      return { x: e + r * s + d * u, y: t + o * s + c * u };
                    });
                  })(e.x, e.y, e.targetX, e.targetY);
                  $.shieldBeams.push({
                    id: e.id,
                    level: e.level,
                    life: 0.28,
                    maxLife: 0.28,
                    points: t,
                    branches: me(t),
                  });
                })(e);
            }),
              e.projectiles.forEach((e) => {
                2 === e.kind || a.has(e.id) || pe(e.x, e.y, Be(e.level), 6);
              }),
              e.buildings.forEach((e) => {
                i.has(e.id) || pe(e.x, e.y, Be(e.level), 20);
              }));
          })($.latestState, e),
            ($.previousState = $.latestState),
            ($.previousStateAt = $.latestStateAt || t - j()),
            ($.latestState = e),
            ($.latestStateAt = t),
            $.renderState || ($.renderState = e),
            ((e) => {
              const t = [...e]
                .sort(
                  (e, t) =>
                    (t.score || 0) - (e.score || 0) ||
                    e.name.localeCompare(t.name),
                )
                .slice(0, 10);
              (y.replaceChildren(
                ...t.map((e, t) => {
                  const n = document.createElement("div"),
                    a = document.createElement("span"),
                    i = document.createElement("span");
                  return (
                    (n.className = `leaderboardRow rank${t + 1}`),
                    (a.textContent = `${t + 1}. ${ce(e)}`),
                    (i.textContent = `${Math.round(e.score || 0)}`),
                    n.append(a, i),
                    n
                  );
                }),
              ),
                ie());
            })(e.leaderboard || e.players),
            ge(e),
            (() => {
              const e = $.latestState,
                t = re(e, $.id);
              if ((ie(), performance.now() < $.clanActionUntil)) return;
              if (!t || t.leaderId !== $.id || 0 === t.pending.length)
                return ((b.style.display = "none"), void b.replaceChildren());
              const n = t.pending[0],
                a = `<div class="clanRequest"><span>${oe(e, t, n)}</span><div class="requestActions"><button data-clan-accept="${n}" type="button" aria-label="Accept">✓</button><button data-clan-decline="${n}" type="button" aria-label="Reject">✕</button></div></div>`;
              ((b.innerHTML = `<div class="title">Clan Request</div>${a}`),
                (b.style.display = "grid"));
            })(),
            t > $.clanInteractionUntil && je());
        })(t.state),
        2 === t.type &&
          ((n = t.text),
          (w.textContent = n),
          (w.style.display = "block"),
          ($.noticeUntil = performance.now() + 2200)),
        3 === t.type && We("You were destroyed"));
    }
  },
  We = (e) => {
    (($.joined = !1),
      ($.id = 0),
      ($.latestState = {
        players: [],
        buildings: [],
        projectiles: [],
        clans: [],
        leaderboard: [],
        vaults: [],
      }),
      ($.previousState = null),
      ($.previousStateAt = 0),
      ($.latestStateAt = 0),
      ($.renderState = null),
      ($.movementKeys = [0, 0, 0, 0]),
      ($.lastMovementDirection = null),
      ($.lastAim = null),
      ($.shooting = !1),
      ($.selectedBuild = null),
      ($.clanOpen = !1),
      ($.camera.ready = !1),
      ($.particles = []),
      ($.shieldBeams = []),
      $.walkParticles.clear(),
      ae(),
      ye(),
      ge(),
      (d.style.display = "none"),
      (x.style.display = "none"),
      (b.style.display = "none"),
      (f.style.display = "none"),
      a.clearRect(0, 0, k.minimapSize, k.minimapSize),
      (i.style.display = "grid"),
      (s.textContent = e || ""));
  },
  He = () => ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
(l.addEventListener("submit", (e) => {
  var t;
  (e.preventDefault(),
    (t = r.value.trim() || "Player"),
    (s.textContent = "Connecting..."),
    $.socket && $.socket.readyState === WebSocket.OPEN
      ? X([0, t])
      : (($.socket = new WebSocket(o?.value || "ws://127.0.0.1:3000")),
        $.socket.addEventListener("open", () => X([0, t])),
        $.socket.addEventListener("message", Te),
        $.socket.addEventListener("close", (e) =>
          We(e.reason || "Disconnected"),
        )));
}),
  g.forEach((e) => e.addEventListener("click", () => fe(e.dataset.build))),
  v.addEventListener("click", () => {
    (($.clanOpen = !$.clanOpen),
      (x.style.display = $.clanOpen ? "block" : "none"),
      je());
  }),
  x.addEventListener("input", () => {
    $.clanInteractionUntil = performance.now() + 1200;
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
      ($.clanActionUntil = performance.now() + 300),
      n)
    )
      return void X([7, Number(n.dataset.clanJoin)]);
    if (a) return (X([9]), ($.clanOpen = !1), void (x.style.display = "none"));
    if (i) return void X([11, Number(i.dataset.clanKick)]);
    const l = document.getElementById("clanNameInput"),
      r = l?.value || "";
    (($.clanInteractionUntil = 0), l?.blur(), X([6, r]));
  }),
  b.addEventListener("pointerdown", (e) => {
    const t = e.target.closest("[data-clan-accept]"),
      n = e.target.closest("[data-clan-decline]");
    (t || n) &&
      (e.preventDefault(),
      e.stopPropagation(),
      ($.clanActionUntil = performance.now() + 300),
      t && X([8, Number(t.dataset.clanAccept), 1]),
      n && X([8, Number(n.dataset.clanDecline), 0]));
  }),
  window.addEventListener("resize", q),
  window.addEventListener("mousemove", (e) => {
    (($.mouse.x = e.clientX), ($.mouse.y = e.clientY));
  }),
  window.addEventListener("mousedown", (e) => {
    var t;
    if (
      !(
        e.repeat ||
        !$.joined ||
        $.chatOpen ||
        ((t = e.target),
        t.closest && t.closest("#hud,#upgradePanel,#clanPanel,#joinScreen"))
      )
    )
      return 2 === e.button
        ? (e.preventDefault(), void Re(5))
        : void (
            0 === e.button &&
            ($.selectedBuild
              ? (() => {
                  if (!$.selectedBuild || !$.joined) return;
                  const e = ee(),
                    [t, n] = ve(e),
                    [a, i] = Ce(t, n);
                  (X([4, $.selectedBuild, a, i]),
                    ($.selectedBuild = null),
                    ye());
                })()
              : Ae(!0))
          );
  }),
  window.addEventListener("contextmenu", (e) => {
    He() || e.preventDefault();
  }),
  window.addEventListener("mouseup", (e) => {
    e.repeat || 0 !== e.button || Ae(!1);
  }),
  window.addEventListener("keydown", (e) => {
    if ("Escape" === e.code)
      return $.chatOpen
        ? (e.preventDefault(), void ae())
        : (($.selectedBuild = null),
          ($.clanOpen = !1),
          (x.style.display = "none"),
          Ae(!1),
          void ye());
    if ("Enter" === e.key) {
      if (e.repeat) return void e.preventDefault();
      if ($.chatOpen)
        return (
          e.preventDefault(),
          void (() => {
            const e = M.value.trim();
            (ae(), e.length > 0 && X([12, e]));
          })()
        );
      if ($.joined && !He())
        return (
          e.preventDefault(),
          void (
            $.joined &&
            (($.chatOpen = !0),
            ($.selectedBuild = null),
            Ae(!1),
            ye(),
            (M.value = ""),
            (S.style.display = "block"),
            M.focus())
          )
        );
    }
    if (!$.chatOpen && !He())
      if (I.has(e.code) || "Shift" === e.key)
        !e.repeat && $.joined && Re(13, De) && e.preventDefault();
      else {
        if (C.has(e.code)) return (e.preventDefault(), void fe(C.get(e.code)));
        (E.has(e.code) && e.preventDefault(), G(e.code, 1) && J());
      }
  }),
  window.addEventListener("keyup", (e) => {
    $.chatOpen ||
      He() ||
      (E.has(e.code) && e.preventDefault(), G(e.code, 0) && J());
  }),
  window.addEventListener("blur", () => {
    (Ae(!1), V());
  }),
  window.addEventListener("beforeunload", (e) => {
    if ($.joined) return (e.preventDefault(), (e.returnValue = B), B);
  }),
  document.addEventListener("visibilitychange", () => {
    document.hidden && (Ae(!1), V());
  }),
  q(),
  ye(),
  setInterval(ne, 50),
  requestAnimationFrame(Ne));
