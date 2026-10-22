declare module "clipper-lib" {
  const ClipperLib: {
    ClipperOffset: new (miterLimit?: number, arcTolerance?: number) => {
      AddPath(path: { X: number; Y: number }[], joinType: number, endType: number): void;
      Execute(solution: unknown, delta: number): void;
    };
    JoinType: { jtMiter: number; jtRound: number; jtSquare: number };
    EndType: { etClosedPolygon: number; etOpenButt: number; etOpenRound: number };
    Paths: new () => { X: number; Y: number }[][];
  };
  export default ClipperLib;
}
