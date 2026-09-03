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

  function half(flip) {
    const s = new THREE.Group();
    // blade outline: tapering to a point
    const blade = h.extrude(
      [[0,-0.10],[3.1,-0.02],[3.35,0.03],[3.1,0.10],[0,0.26]],
      mat.chrome, {depth: 0.11, bevel: 0.022}
    );
    blade.position.set(1.55, 0.05, 0);
    s.add(blade);

    // shank running back from the pivot
    const shank = h.extrude(
      [[0,-0.09],[-1.5,-0.16],[-1.9,-0.10],[-1.9,0.10],[-1.5,0.17],[0,0.11]],
      mat.chrome, {depth: 0.10, bevel: 0.018}
    );
    shank.position.set(-0.95, 0, 0);
    s.add(shank);

    // bow handle — a lathed torus reads as a forged ring
    const bow = h.tor(0.46, 0.085, mat.chrome, 48);
    bow.position.set(-2.45, flip ? -0.28 : 0.28, 0);
    bow.rotation.set(Math.PI / 2, 0, flip ? -0.22 : 0.22);
    bow.scale.set(1, 1.25, 1);
    s.add(bow);

    if (flip) { s.rotation.z = -0.13; s.position.y = -0.06; }
    else { s.rotation.z = 0.13; s.position.y = 0.06; }
    return s;
  }

  const a = half(false), b = half(true);
  b.position.z = -0.14;
  g.add(a, b);

  // pivot screw
  const pivot = h.cyl(0.15, 0.15, 0.42, mat.brass, 28);
  pivot.rotation.x = Math.PI / 2;
  g.add(pivot);

  g.userData.blades = [a, b];
  return g;
}

/* ---------------------------------------------------------------- PIPE WRENCH
   M & S Plumbing. Serrated jaws + a knurled adjusting nut; the tooth strip is
   what makes it a *pipe* wrench rather than a generic spanner. */
