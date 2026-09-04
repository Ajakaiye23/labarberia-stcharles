/* objects.js — the procedural hero objects, one per client site.
 *
 * Each builder takes (THREE, ctx) from hero3d.mountHero and returns a Group.
 * ctx gives {mat, h, tex, paint} — see hero3d.js.
 *
 * Modelling notes that matter for realism:
 *  - Anything turned on a lathe in reality is built with LatheGeometry from a
 *    hand-authored profile. Straight cylinders read as toys; a profile with a
 *    shoulder, a taper and a fillet reads as machined.
 *  - Flat forged parts (scissor blades, clipper blades, wrench jaws) use
 *    ExtrudeGeometry with a bevel so the edges catch a highlight.
 *  - Patterns (barber stripes, coil windings, tyre tread) are canvas textures
 *    rather than geometry — far cheaper and more convincing at this scale.
 */

/* ---------------------------------------------------------------- BARBER POLE
   Humble Barbershop. Glass sleeve over a helical stripe, chrome end caps
   lathed from a real turned profile, wall bracket. */

/* Extracted for this site only — the full library of 11 hero objects
   lives in _shared/objects.js. Regenerate with tools/build_site.py. */

export function scissors(THREE, ctx) {
  const {mat, h} = ctx;
  const g = new THREE.Group();

  /* Barber shears. Both halves are near-identical forgings crossed at the
     pivot, exactly as the real thing: authored along +X with the pivot at the
     origin, then splayed by rotating each half about that pivot. The bow rings
     therefore separate because the halves are open, not because they were
     nudged apart.

     The rings are TorusGeometry left in its native XY plane, which is the same
     plane the blades are extruded in — rotating them onto XZ turns the pair
     into a stack of coils seen edge-on instead of two finger holes. */

  const OPEN = 0.22;          // half-angle of the opening, radians
  const RING_X = -3.05;       // bow centre, back along the shank
  const RING_R = 0.56;

  function half(flip) {
    const s = new THREE.Group();

    // Blade: straight cutting edge on top, ground spine below, tapering to a
    // point. Authored in pivot space, so center:false to keep that origin.
    const blade = h.extrude([
      [-0.40, -0.30], [0.65, -0.25], [1.75, -0.175], [2.55, -0.085],
      [3.02, 0.005],
      [2.55, 0.06], [1.5, 0.115], [0.5, 0.16], [-0.40, 0.20]
    ], mat.chrome, {depth: 0.10, bevel: 0.016, center: false});
    blade.position.z = -0.05;
    s.add(blade);

    // Shank: narrows from the pivot boss and sweeps back to meet the bow.
    const shank = h.extrude([
      [-0.30, -0.26], [-1.30, -0.235], [-2.25, -0.20], [-2.95, -0.17],
      [-2.95, 0.17], [-2.25, 0.175], [-1.30, 0.15], [-0.30, 0.18]
    ], mat.chrome, {depth: 0.095, bevel: 0.015, center: false});
    shank.position.z = -0.0475;
    s.add(shank);

    // Bow: an oval ring in the blade's own plane, so you look through it.
    const bow = h.tor(RING_R, 0.105, mat.chrome, 56);
    bow.position.set(RING_X, 0, 0);
    bow.scale.set(1, 1.16, 1);
    s.add(bow);

    // Finger tang — the little hooked rest under the lower bow. Only one half
    // carries it on a real pair of shears, and its absence on the other is
    // what tells you which hand they were forged for.
    if (flip) {
      const tang = h.cyl(0.065, 0.055, 0.62, mat.chrome, 20);
      tang.position.set(RING_X + 0.30, -0.72, 0);
      tang.rotation.z = -0.75;
      s.add(tang);
      const ball = h.sph(0.085, mat.chrome, 20);
      ball.position.set(RING_X + 0.58, -0.98, 0);
      s.add(ball);
    }

    s.rotation.z = flip ? -OPEN : OPEN;
    return s;
  }

  const a = half(false), b = half(true);
  a.position.z = 0.075;       // the two forgings sit face to face at the joint
  b.position.z = -0.075;
  g.add(a, b);

  // Pivot: a brass screw with a raised boss, long enough to pass through both.
  const boss = h.cyl(0.26, 0.26, 0.30, mat.brass, 32);
  boss.rotation.x = Math.PI / 2;
  g.add(boss);
  const screw = h.cyl(0.145, 0.145, 0.44, mat.brass, 24);
  screw.rotation.x = Math.PI / 2;
  g.add(screw);
  const head = h.cyl(0.20, 0.20, 0.05, mat.brass, 24);
  head.rotation.x = Math.PI / 2;
  head.position.z = 0.235;
  g.add(head);

  g.userData.blades = [a, b];
  return g;
}
