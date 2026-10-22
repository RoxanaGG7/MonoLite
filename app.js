"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/clipper-lib/clipper.js
  var require_clipper = __commonJS({
    "node_modules/clipper-lib/clipper.js"(exports, module) {
      (function() {
        "use strict";
        var ClipperLib2 = {};
        ClipperLib2.version = "6.4.2.2";
        ClipperLib2.use_lines = true;
        ClipperLib2.use_xyz = false;
        var isNode = false;
        if (typeof module !== "undefined" && module.exports) {
          module.exports = ClipperLib2;
          isNode = true;
        } else {
          if (typeof define === "function" && define.amd) {
            define(ClipperLib2);
          }
          if (typeof document !== "undefined") window.ClipperLib = ClipperLib2;
          else self["ClipperLib"] = ClipperLib2;
        }
        var navigator_appName;
        if (!isNode) {
          var nav = navigator.userAgent.toString().toLowerCase();
          navigator_appName = navigator.appName;
        } else {
          var nav = "chrome";
          navigator_appName = "Netscape";
        }
        var browser = {};
        if (nav.indexOf("chrome") != -1 && nav.indexOf("chromium") == -1) browser.chrome = 1;
        else browser.chrome = 0;
        if (nav.indexOf("chromium") != -1) browser.chromium = 1;
        else browser.chromium = 0;
        if (nav.indexOf("safari") != -1 && nav.indexOf("chrome") == -1 && nav.indexOf("chromium") == -1) browser.safari = 1;
        else browser.safari = 0;
        if (nav.indexOf("firefox") != -1) browser.firefox = 1;
        else browser.firefox = 0;
        if (nav.indexOf("firefox/17") != -1) browser.firefox17 = 1;
        else browser.firefox17 = 0;
        if (nav.indexOf("firefox/15") != -1) browser.firefox15 = 1;
        else browser.firefox15 = 0;
        if (nav.indexOf("firefox/3") != -1) browser.firefox3 = 1;
        else browser.firefox3 = 0;
        if (nav.indexOf("opera") != -1) browser.opera = 1;
        else browser.opera = 0;
        if (nav.indexOf("msie 10") != -1) browser.msie10 = 1;
        else browser.msie10 = 0;
        if (nav.indexOf("msie 9") != -1) browser.msie9 = 1;
        else browser.msie9 = 0;
        if (nav.indexOf("msie 8") != -1) browser.msie8 = 1;
        else browser.msie8 = 0;
        if (nav.indexOf("msie 7") != -1) browser.msie7 = 1;
        else browser.msie7 = 0;
        if (nav.indexOf("msie ") != -1) browser.msie = 1;
        else browser.msie = 0;
        ClipperLib2.biginteger_used = null;
        var dbits;
        var canary = 244837814094590;
        var j_lm = (canary & 16777215) == 15715070;
        function BigInteger(a, b, c) {
          ClipperLib2.biginteger_used = 1;
          if (a != null)
            if ("number" == typeof a && "undefined" == typeof b) this.fromInt(a);
            else if ("number" == typeof a) this.fromNumber(a, b, c);
            else if (b == null && "string" != typeof a) this.fromString(a, 256);
            else this.fromString(a, b);
        }
        function nbi() {
          return new BigInteger(null, void 0, void 0);
        }
        function am1(i, x, w, j, c, n) {
          while (--n >= 0) {
            var v = x * this[i++] + w[j] + c;
            c = Math.floor(v / 67108864);
            w[j++] = v & 67108863;
          }
          return c;
        }
        function am2(i, x, w, j, c, n) {
          var xl = x & 32767, xh = x >> 15;
          while (--n >= 0) {
            var l = this[i] & 32767;
            var h = this[i++] >> 15;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 32767) << 15) + w[j] + (c & 1073741823);
            c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
            w[j++] = l & 1073741823;
          }
          return c;
        }
        function am3(i, x, w, j, c, n) {
          var xl = x & 16383, xh = x >> 14;
          while (--n >= 0) {
            var l = this[i] & 16383;
            var h = this[i++] >> 14;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 16383) << 14) + w[j] + c;
            c = (l >> 28) + (m >> 14) + xh * h;
            w[j++] = l & 268435455;
          }
          return c;
        }
        if (j_lm && navigator_appName == "Microsoft Internet Explorer") {
          BigInteger.prototype.am = am2;
          dbits = 30;
        } else if (j_lm && navigator_appName != "Netscape") {
          BigInteger.prototype.am = am1;
          dbits = 26;
        } else {
          BigInteger.prototype.am = am3;
          dbits = 28;
        }
        BigInteger.prototype.DB = dbits;
        BigInteger.prototype.DM = (1 << dbits) - 1;
        BigInteger.prototype.DV = 1 << dbits;
        var BI_FP = 52;
        BigInteger.prototype.FV = Math.pow(2, BI_FP);
        BigInteger.prototype.F1 = BI_FP - dbits;
        BigInteger.prototype.F2 = 2 * dbits - BI_FP;
        var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
        var BI_RC = new Array();
        var rr, vv;
        rr = "0".charCodeAt(0);
        for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
        rr = "a".charCodeAt(0);
        for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
        rr = "A".charCodeAt(0);
        for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
        function int2char(n) {
          return BI_RM.charAt(n);
        }
        function intAt(s, i) {
          var c = BI_RC[s.charCodeAt(i)];
          return c == null ? -1 : c;
        }
        function bnpCopyTo(r) {
          for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
          r.t = this.t;
          r.s = this.s;
        }
        function bnpFromInt(x) {
          this.t = 1;
          this.s = x < 0 ? -1 : 0;
          if (x > 0) this[0] = x;
          else if (x < -1) this[0] = x + this.DV;
          else this.t = 0;
        }
        function nbv(i) {
          var r = nbi();
          r.fromInt(i);
          return r;
        }
        function bnpFromString(s, b) {
          var k;
          if (b == 16) k = 4;
          else if (b == 8) k = 3;
          else if (b == 256) k = 8;
          else if (b == 2) k = 1;
          else if (b == 32) k = 5;
          else if (b == 4) k = 2;
          else {
            this.fromRadix(s, b);
            return;
          }
          this.t = 0;
          this.s = 0;
          var i = s.length, mi = false, sh = 0;
          while (--i >= 0) {
            var x = k == 8 ? s[i] & 255 : intAt(s, i);
            if (x < 0) {
              if (s.charAt(i) == "-") mi = true;
              continue;
            }
            mi = false;
            if (sh == 0)
              this[this.t++] = x;
            else if (sh + k > this.DB) {
              this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
              this[this.t++] = x >> this.DB - sh;
            } else
              this[this.t - 1] |= x << sh;
            sh += k;
            if (sh >= this.DB) sh -= this.DB;
          }
          if (k == 8 && (s[0] & 128) != 0) {
            this.s = -1;
            if (sh > 0) this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
          }
          this.clamp();
          if (mi) BigInteger.ZERO.subTo(this, this);
        }
        function bnpClamp() {
          var c = this.s & this.DM;
          while (this.t > 0 && this[this.t - 1] == c) --this.t;
        }
        function bnToString(b) {
          if (this.s < 0) return "-" + this.negate().toString(b);
          var k;
          if (b == 16) k = 4;
          else if (b == 8) k = 3;
          else if (b == 2) k = 1;
          else if (b == 32) k = 5;
          else if (b == 4) k = 2;
          else return this.toRadix(b);
          var km = (1 << k) - 1, d, m = false, r = "", i = this.t;
          var p = this.DB - i * this.DB % k;
          if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) > 0) {
              m = true;
              r = int2char(d);
            }
            while (i >= 0) {
              if (p < k) {
                d = (this[i] & (1 << p) - 1) << k - p;
                d |= this[--i] >> (p += this.DB - k);
              } else {
                d = this[i] >> (p -= k) & km;
                if (p <= 0) {
                  p += this.DB;
                  --i;
                }
              }
              if (d > 0) m = true;
              if (m) r += int2char(d);
            }
          }
          return m ? r : "0";
        }
        function bnNegate() {
          var r = nbi();
          BigInteger.ZERO.subTo(this, r);
          return r;
        }
        function bnAbs() {
          return this.s < 0 ? this.negate() : this;
        }
        function bnCompareTo(a) {
          var r = this.s - a.s;
          if (r != 0) return r;
          var i = this.t;
          r = i - a.t;
          if (r != 0) return this.s < 0 ? -r : r;
          while (--i >= 0)
            if ((r = this[i] - a[i]) != 0) return r;
          return 0;
        }
        function nbits(x) {
          var r = 1, t2;
          if ((t2 = x >>> 16) != 0) {
            x = t2;
            r += 16;
          }
          if ((t2 = x >> 8) != 0) {
            x = t2;
            r += 8;
          }
          if ((t2 = x >> 4) != 0) {
            x = t2;
            r += 4;
          }
          if ((t2 = x >> 2) != 0) {
            x = t2;
            r += 2;
          }
          if ((t2 = x >> 1) != 0) {
            x = t2;
            r += 1;
          }
          return r;
        }
        function bnBitLength() {
          if (this.t <= 0) return 0;
          return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
        }
        function bnpDLShiftTo(n, r) {
          var i;
          for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
          for (i = n - 1; i >= 0; --i) r[i] = 0;
          r.t = this.t + n;
          r.s = this.s;
        }
        function bnpDRShiftTo(n, r) {
          for (var i = n; i < this.t; ++i) r[i - n] = this[i];
          r.t = Math.max(this.t - n, 0);
          r.s = this.s;
        }
        function bnpLShiftTo(n, r) {
          var bs = n % this.DB;
          var cbs = this.DB - bs;
          var bm = (1 << cbs) - 1;
          var ds = Math.floor(n / this.DB), c = this.s << bs & this.DM, i;
          for (i = this.t - 1; i >= 0; --i) {
            r[i + ds + 1] = this[i] >> cbs | c;
            c = (this[i] & bm) << bs;
          }
          for (i = ds - 1; i >= 0; --i) r[i] = 0;
          r[ds] = c;
          r.t = this.t + ds + 1;
          r.s = this.s;
          r.clamp();
        }
        function bnpRShiftTo(n, r) {
          r.s = this.s;
          var ds = Math.floor(n / this.DB);
          if (ds >= this.t) {
            r.t = 0;
            return;
          }
          var bs = n % this.DB;
          var cbs = this.DB - bs;
          var bm = (1 << bs) - 1;
          r[0] = this[ds] >> bs;
          for (var i = ds + 1; i < this.t; ++i) {
            r[i - ds - 1] |= (this[i] & bm) << cbs;
            r[i - ds] = this[i] >> bs;
          }
          if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
          r.t = this.t - ds;
          r.clamp();
        }
        function bnpSubTo(a, r) {
          var i = 0, c = 0, m = Math.min(a.t, this.t);
          while (i < m) {
            c += this[i] - a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
          }
          if (a.t < this.t) {
            c -= a.s;
            while (i < this.t) {
              c += this[i];
              r[i++] = c & this.DM;
              c >>= this.DB;
            }
            c += this.s;
          } else {
            c += this.s;
            while (i < a.t) {
              c -= a[i];
              r[i++] = c & this.DM;
              c >>= this.DB;
            }
            c -= a.s;
          }
          r.s = c < 0 ? -1 : 0;
          if (c < -1) r[i++] = this.DV + c;
          else if (c > 0) r[i++] = c;
          r.t = i;
          r.clamp();
        }
        function bnpMultiplyTo(a, r) {
          var x = this.abs(), y = a.abs();
          var i = x.t;
          r.t = i + y.t;
          while (--i >= 0) r[i] = 0;
          for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
          r.s = 0;
          r.clamp();
          if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
        }
        function bnpSquareTo(r) {
          var x = this.abs();
          var i = r.t = 2 * x.t;
          while (--i >= 0) r[i] = 0;
          for (i = 0; i < x.t - 1; ++i) {
            var c = x.am(i, x[i], r, 2 * i, 0, 1);
            if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
              r[i + x.t] -= x.DV;
              r[i + x.t + 1] = 1;
            }
          }
          if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
          r.s = 0;
          r.clamp();
        }
        function bnpDivRemTo(m, q, r) {
          var pm = m.abs();
          if (pm.t <= 0) return;
          var pt = this.abs();
          if (pt.t < pm.t) {
            if (q != null) q.fromInt(0);
            if (r != null) this.copyTo(r);
            return;
          }
          if (r == null) r = nbi();
          var y = nbi(), ts = this.s, ms = m.s;
          var nsh = this.DB - nbits(pm[pm.t - 1]);
          if (nsh > 0) {
            pm.lShiftTo(nsh, y);
            pt.lShiftTo(nsh, r);
          } else {
            pm.copyTo(y);
            pt.copyTo(r);
          }
          var ys = y.t;
          var y0 = y[ys - 1];
          if (y0 == 0) return;
          var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
          var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
          var i = r.t, j = i - ys, t2 = q == null ? nbi() : q;
          y.dlShiftTo(j, t2);
          if (r.compareTo(t2) >= 0) {
            r[r.t++] = 1;
            r.subTo(t2, r);
          }
          BigInteger.ONE.dlShiftTo(ys, t2);
          t2.subTo(y, y);
          while (y.t < ys) y[y.t++] = 0;
          while (--j >= 0) {
            var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
              y.dlShiftTo(j, t2);
              r.subTo(t2, r);
              while (r[i] < --qd) r.subTo(t2, r);
            }
          }
          if (q != null) {
            r.drShiftTo(ys, q);
            if (ts != ms) BigInteger.ZERO.subTo(q, q);
          }
          r.t = ys;
          r.clamp();
          if (nsh > 0) r.rShiftTo(nsh, r);
          if (ts < 0) BigInteger.ZERO.subTo(r, r);
        }
        function bnMod(a) {
          var r = nbi();
          this.abs().divRemTo(a, null, r);
          if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
          return r;
        }
        function Classic(m) {
          this.m = m;
        }
        function cConvert(x) {
          if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
          else return x;
        }
        function cRevert(x) {
          return x;
        }
        function cReduce(x) {
          x.divRemTo(this.m, null, x);
        }
        function cMulTo(x, y, r) {
          x.multiplyTo(y, r);
          this.reduce(r);
        }
        function cSqrTo(x, r) {
          x.squareTo(r);
          this.reduce(r);
        }
        Classic.prototype.convert = cConvert;
        Classic.prototype.revert = cRevert;
        Classic.prototype.reduce = cReduce;
        Classic.prototype.mulTo = cMulTo;
        Classic.prototype.sqrTo = cSqrTo;
        function bnpInvDigit() {
          if (this.t < 1) return 0;
          var x = this[0];
          if ((x & 1) == 0) return 0;
          var y = x & 3;
          y = y * (2 - (x & 15) * y) & 15;
          y = y * (2 - (x & 255) * y) & 255;
          y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
          y = y * (2 - x * y % this.DV) % this.DV;
          return y > 0 ? this.DV - y : -y;
        }
        function Montgomery(m) {
          this.m = m;
          this.mp = m.invDigit();
          this.mpl = this.mp & 32767;
          this.mph = this.mp >> 15;
          this.um = (1 << m.DB - 15) - 1;
          this.mt2 = 2 * m.t;
        }
        function montConvert(x) {
          var r = nbi();
          x.abs().dlShiftTo(this.m.t, r);
          r.divRemTo(this.m, null, r);
          if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
          return r;
        }
        function montRevert(x) {
          var r = nbi();
          x.copyTo(r);
          this.reduce(r);
          return r;
        }
        function montReduce(x) {
          while (x.t <= this.mt2)
            x[x.t++] = 0;
          for (var i = 0; i < this.m.t; ++i) {
            var j = x[i] & 32767;
            var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
            j = i + this.m.t;
            x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
            while (x[j] >= x.DV) {
              x[j] -= x.DV;
              x[++j]++;
            }
          }
          x.clamp();
          x.drShiftTo(this.m.t, x);
          if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
        }
        function montSqrTo(x, r) {
          x.squareTo(r);
          this.reduce(r);
        }
        function montMulTo(x, y, r) {
          x.multiplyTo(y, r);
          this.reduce(r);
        }
        Montgomery.prototype.convert = montConvert;
        Montgomery.prototype.revert = montRevert;
        Montgomery.prototype.reduce = montReduce;
        Montgomery.prototype.mulTo = montMulTo;
        Montgomery.prototype.sqrTo = montSqrTo;
        function bnpIsEven() {
          return (this.t > 0 ? this[0] & 1 : this.s) == 0;
        }
        function bnpExp(e, z) {
          if (e > 4294967295 || e < 1) return BigInteger.ONE;
          var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e) - 1;
          g.copyTo(r);
          while (--i >= 0) {
            z.sqrTo(r, r2);
            if ((e & 1 << i) > 0) z.mulTo(r2, g, r);
            else {
              var t2 = r;
              r = r2;
              r2 = t2;
            }
          }
          return z.revert(r);
        }
        function bnModPowInt(e, m) {
          var z;
          if (e < 256 || m.isEven()) z = new Classic(m);
          else z = new Montgomery(m);
          return this.exp(e, z);
        }
        BigInteger.prototype.copyTo = bnpCopyTo;
        BigInteger.prototype.fromInt = bnpFromInt;
        BigInteger.prototype.fromString = bnpFromString;
        BigInteger.prototype.clamp = bnpClamp;
        BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
        BigInteger.prototype.drShiftTo = bnpDRShiftTo;
        BigInteger.prototype.lShiftTo = bnpLShiftTo;
        BigInteger.prototype.rShiftTo = bnpRShiftTo;
        BigInteger.prototype.subTo = bnpSubTo;
        BigInteger.prototype.multiplyTo = bnpMultiplyTo;
        BigInteger.prototype.squareTo = bnpSquareTo;
        BigInteger.prototype.divRemTo = bnpDivRemTo;
        BigInteger.prototype.invDigit = bnpInvDigit;
        BigInteger.prototype.isEven = bnpIsEven;
        BigInteger.prototype.exp = bnpExp;
        BigInteger.prototype.toString = bnToString;
        BigInteger.prototype.negate = bnNegate;
        BigInteger.prototype.abs = bnAbs;
        BigInteger.prototype.compareTo = bnCompareTo;
        BigInteger.prototype.bitLength = bnBitLength;
        BigInteger.prototype.mod = bnMod;
        BigInteger.prototype.modPowInt = bnModPowInt;
        BigInteger.ZERO = nbv(0);
        BigInteger.ONE = nbv(1);
        function bnClone() {
          var r = nbi();
          this.copyTo(r);
          return r;
        }
        function bnIntValue() {
          if (this.s < 0) {
            if (this.t == 1) return this[0] - this.DV;
            else if (this.t == 0) return -1;
          } else if (this.t == 1) return this[0];
          else if (this.t == 0) return 0;
          return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
        }
        function bnByteValue() {
          return this.t == 0 ? this.s : this[0] << 24 >> 24;
        }
        function bnShortValue() {
          return this.t == 0 ? this.s : this[0] << 16 >> 16;
        }
        function bnpChunkSize(r) {
          return Math.floor(Math.LN2 * this.DB / Math.log(r));
        }
        function bnSigNum() {
          if (this.s < 0) return -1;
          else if (this.t <= 0 || this.t == 1 && this[0] <= 0) return 0;
          else return 1;
        }
        function bnpToRadix(b) {
          if (b == null) b = 10;
          if (this.signum() == 0 || b < 2 || b > 36) return "0";
          var cs = this.chunkSize(b);
          var a = Math.pow(b, cs);
          var d = nbv(a), y = nbi(), z = nbi(), r = "";
          this.divRemTo(d, y, z);
          while (y.signum() > 0) {
            r = (a + z.intValue()).toString(b).substr(1) + r;
            y.divRemTo(d, y, z);
          }
          return z.intValue().toString(b) + r;
        }
        function bnpFromRadix(s, b) {
          this.fromInt(0);
          if (b == null) b = 10;
          var cs = this.chunkSize(b);
          var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
          for (var i = 0; i < s.length; ++i) {
            var x = intAt(s, i);
            if (x < 0) {
              if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
              continue;
            }
            w = b * w + x;
            if (++j >= cs) {
              this.dMultiply(d);
              this.dAddOffset(w, 0);
              j = 0;
              w = 0;
            }
          }
          if (j > 0) {
            this.dMultiply(Math.pow(b, j));
            this.dAddOffset(w, 0);
          }
          if (mi) BigInteger.ZERO.subTo(this, this);
        }
        function bnpFromNumber(a, b, c) {
          if ("number" == typeof b) {
            if (a < 2) this.fromInt(1);
            else {
              this.fromNumber(a, c);
              if (!this.testBit(a - 1))
                this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
              if (this.isEven()) this.dAddOffset(1, 0);
              while (!this.isProbablePrime(b)) {
                this.dAddOffset(2, 0);
                if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
              }
            }
          } else {
            var x = new Array(), t2 = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t2 > 0) x[0] &= (1 << t2) - 1;
            else x[0] = 0;
            this.fromString(x, 256);
          }
        }
        function bnToByteArray() {
          var i = this.t, r = new Array();
          r[0] = this.s;
          var p = this.DB - i * this.DB % 8, d, k = 0;
          if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p)
              r[k++] = d | this.s << this.DB - p;
            while (i >= 0) {
              if (p < 8) {
                d = (this[i] & (1 << p) - 1) << 8 - p;
                d |= this[--i] >> (p += this.DB - 8);
              } else {
                d = this[i] >> (p -= 8) & 255;
                if (p <= 0) {
                  p += this.DB;
                  --i;
                }
              }
              if ((d & 128) != 0) d |= -256;
              if (k == 0 && (this.s & 128) != (d & 128)) ++k;
              if (k > 0 || d != this.s) r[k++] = d;
            }
          }
          return r;
        }
        function bnEquals(a) {
          return this.compareTo(a) == 0;
        }
        function bnMin(a) {
          return this.compareTo(a) < 0 ? this : a;
        }
        function bnMax(a) {
          return this.compareTo(a) > 0 ? this : a;
        }
        function bnpBitwiseTo(a, op, r) {
          var i, f, m = Math.min(a.t, this.t);
          for (i = 0; i < m; ++i) r[i] = op(this[i], a[i]);
          if (a.t < this.t) {
            f = a.s & this.DM;
            for (i = m; i < this.t; ++i) r[i] = op(this[i], f);
            r.t = this.t;
          } else {
            f = this.s & this.DM;
            for (i = m; i < a.t; ++i) r[i] = op(f, a[i]);
            r.t = a.t;
          }
          r.s = op(this.s, a.s);
          r.clamp();
        }
        function op_and(x, y) {
          return x & y;
        }
        function bnAnd(a) {
          var r = nbi();
          this.bitwiseTo(a, op_and, r);
          return r;
        }
        function op_or(x, y) {
          return x | y;
        }
        function bnOr(a) {
          var r = nbi();
          this.bitwiseTo(a, op_or, r);
          return r;
        }
        function op_xor(x, y) {
          return x ^ y;
        }
        function bnXor(a) {
          var r = nbi();
          this.bitwiseTo(a, op_xor, r);
          return r;
        }
        function op_andnot(x, y) {
          return x & ~y;
        }
        function bnAndNot(a) {
          var r = nbi();
          this.bitwiseTo(a, op_andnot, r);
          return r;
        }
        function bnNot() {
          var r = nbi();
          for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i];
          r.t = this.t;
          r.s = ~this.s;
          return r;
        }
        function bnShiftLeft(n) {
          var r = nbi();
          if (n < 0) this.rShiftTo(-n, r);
          else this.lShiftTo(n, r);
          return r;
        }
        function bnShiftRight(n) {
          var r = nbi();
          if (n < 0) this.lShiftTo(-n, r);
          else this.rShiftTo(n, r);
          return r;
        }
        function lbit(x) {
          if (x == 0) return -1;
          var r = 0;
          if ((x & 65535) == 0) {
            x >>= 16;
            r += 16;
          }
          if ((x & 255) == 0) {
            x >>= 8;
            r += 8;
          }
          if ((x & 15) == 0) {
            x >>= 4;
            r += 4;
          }
          if ((x & 3) == 0) {
            x >>= 2;
            r += 2;
          }
          if ((x & 1) == 0) ++r;
          return r;
        }
        function bnGetLowestSetBit() {
          for (var i = 0; i < this.t; ++i)
            if (this[i] != 0) return i * this.DB + lbit(this[i]);
          if (this.s < 0) return this.t * this.DB;
          return -1;
        }
        function cbit(x) {
          var r = 0;
          while (x != 0) {
            x &= x - 1;
            ++r;
          }
          return r;
        }
        function bnBitCount() {
          var r = 0, x = this.s & this.DM;
          for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x);
          return r;
        }
        function bnTestBit(n) {
          var j = Math.floor(n / this.DB);
          if (j >= this.t) return this.s != 0;
          return (this[j] & 1 << n % this.DB) != 0;
        }
        function bnpChangeBit(n, op) {
          var r = BigInteger.ONE.shiftLeft(n);
          this.bitwiseTo(r, op, r);
          return r;
        }
        function bnSetBit(n) {
          return this.changeBit(n, op_or);
        }
        function bnClearBit(n) {
          return this.changeBit(n, op_andnot);
        }
        function bnFlipBit(n) {
          return this.changeBit(n, op_xor);
        }
        function bnpAddTo(a, r) {
          var i = 0, c = 0, m = Math.min(a.t, this.t);
          while (i < m) {
            c += this[i] + a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
          }
          if (a.t < this.t) {
            c += a.s;
            while (i < this.t) {
              c += this[i];
              r[i++] = c & this.DM;
              c >>= this.DB;
            }
            c += this.s;
          } else {
            c += this.s;
            while (i < a.t) {
              c += a[i];
              r[i++] = c & this.DM;
              c >>= this.DB;
            }
            c += a.s;
          }
          r.s = c < 0 ? -1 : 0;
          if (c > 0) r[i++] = c;
          else if (c < -1) r[i++] = this.DV + c;
          r.t = i;
          r.clamp();
        }
        function bnAdd(a) {
          var r = nbi();
          this.addTo(a, r);
          return r;
        }
        function bnSubtract(a) {
          var r = nbi();
          this.subTo(a, r);
          return r;
        }
        function bnMultiply(a) {
          var r = nbi();
          this.multiplyTo(a, r);
          return r;
        }
        function bnSquare() {
          var r = nbi();
          this.squareTo(r);
          return r;
        }
        function bnDivide(a) {
          var r = nbi();
          this.divRemTo(a, r, null);
          return r;
        }
        function bnRemainder(a) {
          var r = nbi();
          this.divRemTo(a, null, r);
          return r;
        }
        function bnDivideAndRemainder(a) {
          var q = nbi(), r = nbi();
          this.divRemTo(a, q, r);
          return new Array(q, r);
        }
        function bnpDMultiply(n) {
          this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
          ++this.t;
          this.clamp();
        }
        function bnpDAddOffset(n, w) {
          if (n == 0) return;
          while (this.t <= w) this[this.t++] = 0;
          this[w] += n;
          while (this[w] >= this.DV) {
            this[w] -= this.DV;
            if (++w >= this.t) this[this.t++] = 0;
            ++this[w];
          }
        }
        function NullExp() {
        }
        function nNop(x) {
          return x;
        }
        function nMulTo(x, y, r) {
          x.multiplyTo(y, r);
        }
        function nSqrTo(x, r) {
          x.squareTo(r);
        }
        NullExp.prototype.convert = nNop;
        NullExp.prototype.revert = nNop;
        NullExp.prototype.mulTo = nMulTo;
        NullExp.prototype.sqrTo = nSqrTo;
        function bnPow(e) {
          return this.exp(e, new NullExp());
        }
        function bnpMultiplyLowerTo(a, n, r) {
          var i = Math.min(this.t + a.t, n);
          r.s = 0;
          r.t = i;
          while (i > 0) r[--i] = 0;
          var j;
          for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
          for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i);
          r.clamp();
        }
        function bnpMultiplyUpperTo(a, n, r) {
          --n;
          var i = r.t = this.t + a.t - n;
          r.s = 0;
          while (--i >= 0) r[i] = 0;
          for (i = Math.max(n - this.t, 0); i < a.t; ++i)
            r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
          r.clamp();
          r.drShiftTo(1, r);
        }
        function Barrett(m) {
          this.r2 = nbi();
          this.q3 = nbi();
          BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
          this.mu = this.r2.divide(m);
          this.m = m;
        }
        function barrettConvert(x) {
          if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);
          else if (x.compareTo(this.m) < 0) return x;
          else {
            var r = nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
          }
        }
        function barrettRevert(x) {
          return x;
        }
        function barrettReduce(x) {
          x.drShiftTo(this.m.t - 1, this.r2);
          if (x.t > this.m.t + 1) {
            x.t = this.m.t + 1;
            x.clamp();
          }
          this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
          this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
          while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);
          x.subTo(this.r2, x);
          while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
        }
        function barrettSqrTo(x, r) {
          x.squareTo(r);
          this.reduce(r);
        }
        function barrettMulTo(x, y, r) {
          x.multiplyTo(y, r);
          this.reduce(r);
        }
        Barrett.prototype.convert = barrettConvert;
        Barrett.prototype.revert = barrettRevert;
        Barrett.prototype.reduce = barrettReduce;
        Barrett.prototype.mulTo = barrettMulTo;
        Barrett.prototype.sqrTo = barrettSqrTo;
        function bnModPow(e, m) {
          var i = e.bitLength(), k, r = nbv(1), z;
          if (i <= 0) return r;
          else if (i < 18) k = 1;
          else if (i < 48) k = 3;
          else if (i < 144) k = 4;
          else if (i < 768) k = 5;
          else k = 6;
          if (i < 8)
            z = new Classic(m);
          else if (m.isEven())
            z = new Barrett(m);
          else
            z = new Montgomery(m);
          var g = new Array(), n = 3, k1 = k - 1, km = (1 << k) - 1;
          g[1] = z.convert(this);
          if (k > 1) {
            var g2 = nbi();
            z.sqrTo(g[1], g2);
            while (n <= km) {
              g[n] = nbi();
              z.mulTo(g2, g[n - 2], g[n]);
              n += 2;
            }
          }
          var j = e.t - 1, w, is1 = true, r2 = nbi(), t2;
          i = nbits(e[j]) - 1;
          while (j >= 0) {
            if (i >= k1) w = e[j] >> i - k1 & km;
            else {
              w = (e[j] & (1 << i + 1) - 1) << k1 - i;
              if (j > 0) w |= e[j - 1] >> this.DB + i - k1;
            }
            n = k;
            while ((w & 1) == 0) {
              w >>= 1;
              --n;
            }
            if ((i -= n) < 0) {
              i += this.DB;
              --j;
            }
            if (is1) {
              g[w].copyTo(r);
              is1 = false;
            } else {
              while (n > 1) {
                z.sqrTo(r, r2);
                z.sqrTo(r2, r);
                n -= 2;
              }
              if (n > 0) z.sqrTo(r, r2);
              else {
                t2 = r;
                r = r2;
                r2 = t2;
              }
              z.mulTo(r2, g[w], r);
            }
            while (j >= 0 && (e[j] & 1 << i) == 0) {
              z.sqrTo(r, r2);
              t2 = r;
              r = r2;
              r2 = t2;
              if (--i < 0) {
                i = this.DB - 1;
                --j;
              }
            }
          }
          return z.revert(r);
        }
        function bnGCD(a) {
          var x = this.s < 0 ? this.negate() : this.clone();
          var y = a.s < 0 ? a.negate() : a.clone();
          if (x.compareTo(y) < 0) {
            var t2 = x;
            x = y;
            y = t2;
          }
          var i = x.getLowestSetBit(), g = y.getLowestSetBit();
          if (g < 0) return x;
          if (i < g) g = i;
          if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
          }
          while (x.signum() > 0) {
            if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
            if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
            if (x.compareTo(y) >= 0) {
              x.subTo(y, x);
              x.rShiftTo(1, x);
            } else {
              y.subTo(x, y);
              y.rShiftTo(1, y);
            }
          }
          if (g > 0) y.lShiftTo(g, y);
          return y;
        }
        function bnpModInt(n) {
          if (n <= 0) return 0;
          var d = this.DV % n, r = this.s < 0 ? n - 1 : 0;
          if (this.t > 0)
            if (d == 0) r = this[0] % n;
            else
              for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n;
          return r;
        }
        function bnModInverse(m) {
          var ac = m.isEven();
          if (this.isEven() && ac || m.signum() == 0) return BigInteger.ZERO;
          var u = m.clone(), v = this.clone();
          var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
          while (u.signum() != 0) {
            while (u.isEven()) {
              u.rShiftTo(1, u);
              if (ac) {
                if (!a.isEven() || !b.isEven()) {
                  a.addTo(this, a);
                  b.subTo(m, b);
                }
                a.rShiftTo(1, a);
              } else if (!b.isEven()) b.subTo(m, b);
              b.rShiftTo(1, b);
            }
            while (v.isEven()) {
              v.rShiftTo(1, v);
              if (ac) {
                if (!c.isEven() || !d.isEven()) {
                  c.addTo(this, c);
                  d.subTo(m, d);
                }
                c.rShiftTo(1, c);
              } else if (!d.isEven()) d.subTo(m, d);
              d.rShiftTo(1, d);
            }
            if (u.compareTo(v) >= 0) {
              u.subTo(v, u);
              if (ac) a.subTo(c, a);
              b.subTo(d, b);
            } else {
              v.subTo(u, v);
              if (ac) c.subTo(a, c);
              d.subTo(b, d);
            }
          }
          if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
          if (d.compareTo(m) >= 0) return d.subtract(m);
          if (d.signum() < 0) d.addTo(m, d);
          else return d;
          if (d.signum() < 0) return d.add(m);
          else return d;
        }
        var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
        var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
        function bnIsProbablePrime(t2) {
          var i, x = this.abs();
          if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
            for (i = 0; i < lowprimes.length; ++i)
              if (x[0] == lowprimes[i]) return true;
            return false;
          }
          if (x.isEven()) return false;
          i = 1;
          while (i < lowprimes.length) {
            var m = lowprimes[i], j = i + 1;
            while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
            m = x.modInt(m);
            while (i < j)
              if (m % lowprimes[i++] == 0) return false;
          }
          return x.millerRabin(t2);
        }
        function bnpMillerRabin(t2) {
          var n1 = this.subtract(BigInteger.ONE);
          var k = n1.getLowestSetBit();
          if (k <= 0) return false;
          var r = n1.shiftRight(k);
          t2 = t2 + 1 >> 1;
          if (t2 > lowprimes.length) t2 = lowprimes.length;
          var a = nbi();
          for (var i = 0; i < t2; ++i) {
            a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
            var y = a.modPow(r, this);
            if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
              var j = 1;
              while (j++ < k && y.compareTo(n1) != 0) {
                y = y.modPowInt(2, this);
                if (y.compareTo(BigInteger.ONE) == 0) return false;
              }
              if (y.compareTo(n1) != 0) return false;
            }
          }
          return true;
        }
        BigInteger.prototype.chunkSize = bnpChunkSize;
        BigInteger.prototype.toRadix = bnpToRadix;
        BigInteger.prototype.fromRadix = bnpFromRadix;
        BigInteger.prototype.fromNumber = bnpFromNumber;
        BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
        BigInteger.prototype.changeBit = bnpChangeBit;
        BigInteger.prototype.addTo = bnpAddTo;
        BigInteger.prototype.dMultiply = bnpDMultiply;
        BigInteger.prototype.dAddOffset = bnpDAddOffset;
        BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
        BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
        BigInteger.prototype.modInt = bnpModInt;
        BigInteger.prototype.millerRabin = bnpMillerRabin;
        BigInteger.prototype.clone = bnClone;
        BigInteger.prototype.intValue = bnIntValue;
        BigInteger.prototype.byteValue = bnByteValue;
        BigInteger.prototype.shortValue = bnShortValue;
        BigInteger.prototype.signum = bnSigNum;
        BigInteger.prototype.toByteArray = bnToByteArray;
        BigInteger.prototype.equals = bnEquals;
        BigInteger.prototype.min = bnMin;
        BigInteger.prototype.max = bnMax;
        BigInteger.prototype.and = bnAnd;
        BigInteger.prototype.or = bnOr;
        BigInteger.prototype.xor = bnXor;
        BigInteger.prototype.andNot = bnAndNot;
        BigInteger.prototype.not = bnNot;
        BigInteger.prototype.shiftLeft = bnShiftLeft;
        BigInteger.prototype.shiftRight = bnShiftRight;
        BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
        BigInteger.prototype.bitCount = bnBitCount;
        BigInteger.prototype.testBit = bnTestBit;
        BigInteger.prototype.setBit = bnSetBit;
        BigInteger.prototype.clearBit = bnClearBit;
        BigInteger.prototype.flipBit = bnFlipBit;
        BigInteger.prototype.add = bnAdd;
        BigInteger.prototype.subtract = bnSubtract;
        BigInteger.prototype.multiply = bnMultiply;
        BigInteger.prototype.divide = bnDivide;
        BigInteger.prototype.remainder = bnRemainder;
        BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
        BigInteger.prototype.modPow = bnModPow;
        BigInteger.prototype.modInverse = bnModInverse;
        BigInteger.prototype.pow = bnPow;
        BigInteger.prototype.gcd = bnGCD;
        BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
        BigInteger.prototype.square = bnSquare;
        var Int128 = BigInteger;
        Int128.prototype.IsNegative = function() {
          if (this.compareTo(Int128.ZERO) == -1) return true;
          else return false;
        };
        Int128.op_Equality = function(val1, val2) {
          if (val1.compareTo(val2) == 0) return true;
          else return false;
        };
        Int128.op_Inequality = function(val1, val2) {
          if (val1.compareTo(val2) != 0) return true;
          else return false;
        };
        Int128.op_GreaterThan = function(val1, val2) {
          if (val1.compareTo(val2) > 0) return true;
          else return false;
        };
        Int128.op_LessThan = function(val1, val2) {
          if (val1.compareTo(val2) < 0) return true;
          else return false;
        };
        Int128.op_Addition = function(lhs, rhs) {
          return new Int128(lhs, void 0, void 0).add(new Int128(rhs, void 0, void 0));
        };
        Int128.op_Subtraction = function(lhs, rhs) {
          return new Int128(lhs, void 0, void 0).subtract(new Int128(rhs, void 0, void 0));
        };
        Int128.Int128Mul = function(lhs, rhs) {
          return new Int128(lhs, void 0, void 0).multiply(new Int128(rhs, void 0, void 0));
        };
        Int128.op_Division = function(lhs, rhs) {
          return lhs.divide(rhs);
        };
        Int128.prototype.ToDouble = function() {
          return parseFloat(this.toString());
        };
        var Inherit = function(ce, ce2) {
          var p;
          if (typeof Object.getOwnPropertyNames === "undefined") {
            for (p in ce2.prototype)
              if (typeof ce.prototype[p] === "undefined" || ce.prototype[p] === Object.prototype[p]) ce.prototype[p] = ce2.prototype[p];
            for (p in ce2)
              if (typeof ce[p] === "undefined") ce[p] = ce2[p];
            ce.$baseCtor = ce2;
          } else {
            var props = Object.getOwnPropertyNames(ce2.prototype);
            for (var i = 0; i < props.length; i++)
              if (typeof Object.getOwnPropertyDescriptor(ce.prototype, props[i]) === "undefined") Object.defineProperty(ce.prototype, props[i], Object.getOwnPropertyDescriptor(ce2.prototype, props[i]));
            for (p in ce2)
              if (typeof ce[p] === "undefined") ce[p] = ce2[p];
            ce.$baseCtor = ce2;
          }
        };
        ClipperLib2.Path = function() {
          return [];
        };
        ClipperLib2.Path.prototype.push = Array.prototype.push;
        ClipperLib2.Paths = function() {
          return [];
        };
        ClipperLib2.Paths.prototype.push = Array.prototype.push;
        ClipperLib2.DoublePoint = function() {
          var a = arguments;
          this.X = 0;
          this.Y = 0;
          if (a.length === 1) {
            this.X = a[0].X;
            this.Y = a[0].Y;
          } else if (a.length === 2) {
            this.X = a[0];
            this.Y = a[1];
          }
        };
        ClipperLib2.DoublePoint0 = function() {
          this.X = 0;
          this.Y = 0;
        };
        ClipperLib2.DoublePoint0.prototype = ClipperLib2.DoublePoint.prototype;
        ClipperLib2.DoublePoint1 = function(dp) {
          this.X = dp.X;
          this.Y = dp.Y;
        };
        ClipperLib2.DoublePoint1.prototype = ClipperLib2.DoublePoint.prototype;
        ClipperLib2.DoublePoint2 = function(x, y) {
          this.X = x;
          this.Y = y;
        };
        ClipperLib2.DoublePoint2.prototype = ClipperLib2.DoublePoint.prototype;
        ClipperLib2.PolyNode = function() {
          this.m_Parent = null;
          this.m_polygon = new ClipperLib2.Path();
          this.m_Index = 0;
          this.m_jointype = 0;
          this.m_endtype = 0;
          this.m_Childs = [];
          this.IsOpen = false;
        };
        ClipperLib2.PolyNode.prototype.IsHoleNode = function() {
          var result = true;
          var node = this.m_Parent;
          while (node !== null) {
            result = !result;
            node = node.m_Parent;
          }
          return result;
        };
        ClipperLib2.PolyNode.prototype.ChildCount = function() {
          return this.m_Childs.length;
        };
        ClipperLib2.PolyNode.prototype.Contour = function() {
          return this.m_polygon;
        };
        ClipperLib2.PolyNode.prototype.AddChild = function(Child) {
          var cnt = this.m_Childs.length;
          this.m_Childs.push(Child);
          Child.m_Parent = this;
          Child.m_Index = cnt;
        };
        ClipperLib2.PolyNode.prototype.GetNext = function() {
          if (this.m_Childs.length > 0)
            return this.m_Childs[0];
          else
            return this.GetNextSiblingUp();
        };
        ClipperLib2.PolyNode.prototype.GetNextSiblingUp = function() {
          if (this.m_Parent === null)
            return null;
          else if (this.m_Index === this.m_Parent.m_Childs.length - 1)
            return this.m_Parent.GetNextSiblingUp();
          else
            return this.m_Parent.m_Childs[this.m_Index + 1];
        };
        ClipperLib2.PolyNode.prototype.Childs = function() {
          return this.m_Childs;
        };
        ClipperLib2.PolyNode.prototype.Parent = function() {
          return this.m_Parent;
        };
        ClipperLib2.PolyNode.prototype.IsHole = function() {
          return this.IsHoleNode();
        };
        ClipperLib2.PolyTree = function() {
          this.m_AllPolys = [];
          ClipperLib2.PolyNode.call(this);
        };
        ClipperLib2.PolyTree.prototype.Clear = function() {
          for (var i = 0, ilen = this.m_AllPolys.length; i < ilen; i++)
            this.m_AllPolys[i] = null;
          this.m_AllPolys.length = 0;
          this.m_Childs.length = 0;
        };
        ClipperLib2.PolyTree.prototype.GetFirst = function() {
          if (this.m_Childs.length > 0)
            return this.m_Childs[0];
          else
            return null;
        };
        ClipperLib2.PolyTree.prototype.Total = function() {
          var result = this.m_AllPolys.length;
          if (result > 0 && this.m_Childs[0] !== this.m_AllPolys[0]) result--;
          return result;
        };
        Inherit(ClipperLib2.PolyTree, ClipperLib2.PolyNode);
        ClipperLib2.Math_Abs_Int64 = ClipperLib2.Math_Abs_Int32 = ClipperLib2.Math_Abs_Double = function(a) {
          return Math.abs(a);
        };
        ClipperLib2.Math_Max_Int32_Int32 = function(a, b) {
          return Math.max(a, b);
        };
        if (browser.msie || browser.opera || browser.safari) ClipperLib2.Cast_Int32 = function(a) {
          return a | 0;
        };
        else ClipperLib2.Cast_Int32 = function(a) {
          return ~~a;
        };
        if (typeof Number.toInteger === "undefined")
          Number.toInteger = null;
        if (browser.chrome) ClipperLib2.Cast_Int64 = function(a) {
          if (a < -2147483648 || a > 2147483647)
            return a < 0 ? Math.ceil(a) : Math.floor(a);
          else return ~~a;
        };
        else if (browser.firefox && typeof Number.toInteger === "function") ClipperLib2.Cast_Int64 = function(a) {
          return Number.toInteger(a);
        };
        else if (browser.msie7 || browser.msie8) ClipperLib2.Cast_Int64 = function(a) {
          return parseInt(a, 10);
        };
        else if (browser.msie) ClipperLib2.Cast_Int64 = function(a) {
          if (a < -2147483648 || a > 2147483647)
            return a < 0 ? Math.ceil(a) : Math.floor(a);
          return a | 0;
        };
        else ClipperLib2.Cast_Int64 = function(a) {
          return a < 0 ? Math.ceil(a) : Math.floor(a);
        };
        ClipperLib2.Clear = function(a) {
          a.length = 0;
        };
        ClipperLib2.PI = 3.141592653589793;
        ClipperLib2.PI2 = 2 * 3.141592653589793;
        ClipperLib2.IntPoint = function() {
          var a = arguments, alen = a.length;
          this.X = 0;
          this.Y = 0;
          if (ClipperLib2.use_xyz) {
            this.Z = 0;
            if (alen === 3) {
              this.X = a[0];
              this.Y = a[1];
              this.Z = a[2];
            } else if (alen === 2) {
              this.X = a[0];
              this.Y = a[1];
              this.Z = 0;
            } else if (alen === 1) {
              if (a[0] instanceof ClipperLib2.DoublePoint) {
                var dp = a[0];
                this.X = ClipperLib2.Clipper.Round(dp.X);
                this.Y = ClipperLib2.Clipper.Round(dp.Y);
                this.Z = 0;
              } else {
                var pt = a[0];
                if (typeof pt.Z === "undefined") pt.Z = 0;
                this.X = pt.X;
                this.Y = pt.Y;
                this.Z = pt.Z;
              }
            } else {
              this.X = 0;
              this.Y = 0;
              this.Z = 0;
            }
          } else {
            if (alen === 2) {
              this.X = a[0];
              this.Y = a[1];
            } else if (alen === 1) {
              if (a[0] instanceof ClipperLib2.DoublePoint) {
                var dp = a[0];
                this.X = ClipperLib2.Clipper.Round(dp.X);
                this.Y = ClipperLib2.Clipper.Round(dp.Y);
              } else {
                var pt = a[0];
                this.X = pt.X;
                this.Y = pt.Y;
              }
            } else {
              this.X = 0;
              this.Y = 0;
            }
          }
        };
        ClipperLib2.IntPoint.op_Equality = function(a, b) {
          return a.X === b.X && a.Y === b.Y;
        };
        ClipperLib2.IntPoint.op_Inequality = function(a, b) {
          return a.X !== b.X || a.Y !== b.Y;
        };
        ClipperLib2.IntPoint0 = function() {
          this.X = 0;
          this.Y = 0;
          if (ClipperLib2.use_xyz)
            this.Z = 0;
        };
        ClipperLib2.IntPoint0.prototype = ClipperLib2.IntPoint.prototype;
        ClipperLib2.IntPoint1 = function(pt) {
          this.X = pt.X;
          this.Y = pt.Y;
          if (ClipperLib2.use_xyz) {
            if (typeof pt.Z === "undefined") this.Z = 0;
            else this.Z = pt.Z;
          }
        };
        ClipperLib2.IntPoint1.prototype = ClipperLib2.IntPoint.prototype;
        ClipperLib2.IntPoint1dp = function(dp) {
          this.X = ClipperLib2.Clipper.Round(dp.X);
          this.Y = ClipperLib2.Clipper.Round(dp.Y);
          if (ClipperLib2.use_xyz)
            this.Z = 0;
        };
        ClipperLib2.IntPoint1dp.prototype = ClipperLib2.IntPoint.prototype;
        ClipperLib2.IntPoint2 = function(x, y, z) {
          this.X = x;
          this.Y = y;
          if (ClipperLib2.use_xyz) {
            if (typeof z === "undefined") this.Z = 0;
            else this.Z = z;
          }
        };
        ClipperLib2.IntPoint2.prototype = ClipperLib2.IntPoint.prototype;
        ClipperLib2.IntRect = function() {
          var a = arguments, alen = a.length;
          if (alen === 4) {
            this.left = a[0];
            this.top = a[1];
            this.right = a[2];
            this.bottom = a[3];
          } else if (alen === 1) {
            var ir = a[0];
            this.left = ir.left;
            this.top = ir.top;
            this.right = ir.right;
            this.bottom = ir.bottom;
          } else {
            this.left = 0;
            this.top = 0;
            this.right = 0;
            this.bottom = 0;
          }
        };
        ClipperLib2.IntRect0 = function() {
          this.left = 0;
          this.top = 0;
          this.right = 0;
          this.bottom = 0;
        };
        ClipperLib2.IntRect0.prototype = ClipperLib2.IntRect.prototype;
        ClipperLib2.IntRect1 = function(ir) {
          this.left = ir.left;
          this.top = ir.top;
          this.right = ir.right;
          this.bottom = ir.bottom;
        };
        ClipperLib2.IntRect1.prototype = ClipperLib2.IntRect.prototype;
        ClipperLib2.IntRect4 = function(l, t2, r, b) {
          this.left = l;
          this.top = t2;
          this.right = r;
          this.bottom = b;
        };
        ClipperLib2.IntRect4.prototype = ClipperLib2.IntRect.prototype;
        ClipperLib2.ClipType = {
          ctIntersection: 0,
          ctUnion: 1,
          ctDifference: 2,
          ctXor: 3
        };
        ClipperLib2.PolyType = {
          ptSubject: 0,
          ptClip: 1
        };
        ClipperLib2.PolyFillType = {
          pftEvenOdd: 0,
          pftNonZero: 1,
          pftPositive: 2,
          pftNegative: 3
        };
        ClipperLib2.JoinType = {
          jtSquare: 0,
          jtRound: 1,
          jtMiter: 2
        };
        ClipperLib2.EndType = {
          etOpenSquare: 0,
          etOpenRound: 1,
          etOpenButt: 2,
          etClosedLine: 3,
          etClosedPolygon: 4
        };
        ClipperLib2.EdgeSide = {
          esLeft: 0,
          esRight: 1
        };
        ClipperLib2.Direction = {
          dRightToLeft: 0,
          dLeftToRight: 1
        };
        ClipperLib2.TEdge = function() {
          this.Bot = new ClipperLib2.IntPoint0();
          this.Curr = new ClipperLib2.IntPoint0();
          this.Top = new ClipperLib2.IntPoint0();
          this.Delta = new ClipperLib2.IntPoint0();
          this.Dx = 0;
          this.PolyTyp = ClipperLib2.PolyType.ptSubject;
          this.Side = ClipperLib2.EdgeSide.esLeft;
          this.WindDelta = 0;
          this.WindCnt = 0;
          this.WindCnt2 = 0;
          this.OutIdx = 0;
          this.Next = null;
          this.Prev = null;
          this.NextInLML = null;
          this.NextInAEL = null;
          this.PrevInAEL = null;
          this.NextInSEL = null;
          this.PrevInSEL = null;
        };
        ClipperLib2.IntersectNode = function() {
          this.Edge1 = null;
          this.Edge2 = null;
          this.Pt = new ClipperLib2.IntPoint0();
        };
        ClipperLib2.MyIntersectNodeSort = function() {
        };
        ClipperLib2.MyIntersectNodeSort.Compare = function(node1, node2) {
          var i = node2.Pt.Y - node1.Pt.Y;
          if (i > 0) return 1;
          else if (i < 0) return -1;
          else return 0;
        };
        ClipperLib2.LocalMinima = function() {
          this.Y = 0;
          this.LeftBound = null;
          this.RightBound = null;
          this.Next = null;
        };
        ClipperLib2.Scanbeam = function() {
          this.Y = 0;
          this.Next = null;
        };
        ClipperLib2.Maxima = function() {
          this.X = 0;
          this.Next = null;
          this.Prev = null;
        };
        ClipperLib2.OutRec = function() {
          this.Idx = 0;
          this.IsHole = false;
          this.IsOpen = false;
          this.FirstLeft = null;
          this.Pts = null;
          this.BottomPt = null;
          this.PolyNode = null;
        };
        ClipperLib2.OutPt = function() {
          this.Idx = 0;
          this.Pt = new ClipperLib2.IntPoint0();
          this.Next = null;
          this.Prev = null;
        };
        ClipperLib2.Join = function() {
          this.OutPt1 = null;
          this.OutPt2 = null;
          this.OffPt = new ClipperLib2.IntPoint0();
        };
        ClipperLib2.ClipperBase = function() {
          this.m_MinimaList = null;
          this.m_CurrentLM = null;
          this.m_edges = new Array();
          this.m_UseFullRange = false;
          this.m_HasOpenPaths = false;
          this.PreserveCollinear = false;
          this.m_Scanbeam = null;
          this.m_PolyOuts = null;
          this.m_ActiveEdges = null;
        };
        ClipperLib2.ClipperBase.horizontal = -9007199254740992;
        ClipperLib2.ClipperBase.Skip = -2;
        ClipperLib2.ClipperBase.Unassigned = -1;
        ClipperLib2.ClipperBase.tolerance = 1e-20;
        ClipperLib2.ClipperBase.loRange = 47453132;
        ClipperLib2.ClipperBase.hiRange = 4503599627370495;
        ClipperLib2.ClipperBase.near_zero = function(val) {
          return val > -ClipperLib2.ClipperBase.tolerance && val < ClipperLib2.ClipperBase.tolerance;
        };
        ClipperLib2.ClipperBase.IsHorizontal = function(e) {
          return e.Delta.Y === 0;
        };
        ClipperLib2.ClipperBase.prototype.PointIsVertex = function(pt, pp) {
          var pp2 = pp;
          do {
            if (ClipperLib2.IntPoint.op_Equality(pp2.Pt, pt))
              return true;
            pp2 = pp2.Next;
          } while (pp2 !== pp);
          return false;
        };
        ClipperLib2.ClipperBase.prototype.PointOnLineSegment = function(pt, linePt1, linePt2, UseFullRange) {
          if (UseFullRange)
            return pt.X === linePt1.X && pt.Y === linePt1.Y || pt.X === linePt2.X && pt.Y === linePt2.Y || pt.X > linePt1.X === pt.X < linePt2.X && pt.Y > linePt1.Y === pt.Y < linePt2.Y && Int128.op_Equality(
              Int128.Int128Mul(pt.X - linePt1.X, linePt2.Y - linePt1.Y),
              Int128.Int128Mul(linePt2.X - linePt1.X, pt.Y - linePt1.Y)
            );
          else
            return pt.X === linePt1.X && pt.Y === linePt1.Y || pt.X === linePt2.X && pt.Y === linePt2.Y || pt.X > linePt1.X === pt.X < linePt2.X && pt.Y > linePt1.Y === pt.Y < linePt2.Y && (pt.X - linePt1.X) * (linePt2.Y - linePt1.Y) === (linePt2.X - linePt1.X) * (pt.Y - linePt1.Y);
        };
        ClipperLib2.ClipperBase.prototype.PointOnPolygon = function(pt, pp, UseFullRange) {
          var pp2 = pp;
          while (true) {
            if (this.PointOnLineSegment(pt, pp2.Pt, pp2.Next.Pt, UseFullRange))
              return true;
            pp2 = pp2.Next;
            if (pp2 === pp)
              break;
          }
          return false;
        };
        ClipperLib2.ClipperBase.prototype.SlopesEqual = ClipperLib2.ClipperBase.SlopesEqual = function() {
          var a = arguments, alen = a.length;
          var e1, e2, pt1, pt2, pt3, pt4, UseFullRange;
          if (alen === 3) {
            e1 = a[0];
            e2 = a[1];
            UseFullRange = a[2];
            if (UseFullRange)
              return Int128.op_Equality(Int128.Int128Mul(e1.Delta.Y, e2.Delta.X), Int128.Int128Mul(e1.Delta.X, e2.Delta.Y));
            else
              return ClipperLib2.Cast_Int64(e1.Delta.Y * e2.Delta.X) === ClipperLib2.Cast_Int64(e1.Delta.X * e2.Delta.Y);
          } else if (alen === 4) {
            pt1 = a[0];
            pt2 = a[1];
            pt3 = a[2];
            UseFullRange = a[3];
            if (UseFullRange)
              return Int128.op_Equality(Int128.Int128Mul(pt1.Y - pt2.Y, pt2.X - pt3.X), Int128.Int128Mul(pt1.X - pt2.X, pt2.Y - pt3.Y));
            else
              return ClipperLib2.Cast_Int64((pt1.Y - pt2.Y) * (pt2.X - pt3.X)) - ClipperLib2.Cast_Int64((pt1.X - pt2.X) * (pt2.Y - pt3.Y)) === 0;
          } else {
            pt1 = a[0];
            pt2 = a[1];
            pt3 = a[2];
            pt4 = a[3];
            UseFullRange = a[4];
            if (UseFullRange)
              return Int128.op_Equality(Int128.Int128Mul(pt1.Y - pt2.Y, pt3.X - pt4.X), Int128.Int128Mul(pt1.X - pt2.X, pt3.Y - pt4.Y));
            else
              return ClipperLib2.Cast_Int64((pt1.Y - pt2.Y) * (pt3.X - pt4.X)) - ClipperLib2.Cast_Int64((pt1.X - pt2.X) * (pt3.Y - pt4.Y)) === 0;
          }
        };
        ClipperLib2.ClipperBase.SlopesEqual3 = function(e1, e2, UseFullRange) {
          if (UseFullRange)
            return Int128.op_Equality(Int128.Int128Mul(e1.Delta.Y, e2.Delta.X), Int128.Int128Mul(e1.Delta.X, e2.Delta.Y));
          else
            return ClipperLib2.Cast_Int64(e1.Delta.Y * e2.Delta.X) === ClipperLib2.Cast_Int64(e1.Delta.X * e2.Delta.Y);
        };
        ClipperLib2.ClipperBase.SlopesEqual4 = function(pt1, pt2, pt3, UseFullRange) {
          if (UseFullRange)
            return Int128.op_Equality(Int128.Int128Mul(pt1.Y - pt2.Y, pt2.X - pt3.X), Int128.Int128Mul(pt1.X - pt2.X, pt2.Y - pt3.Y));
          else
            return ClipperLib2.Cast_Int64((pt1.Y - pt2.Y) * (pt2.X - pt3.X)) - ClipperLib2.Cast_Int64((pt1.X - pt2.X) * (pt2.Y - pt3.Y)) === 0;
        };
        ClipperLib2.ClipperBase.SlopesEqual5 = function(pt1, pt2, pt3, pt4, UseFullRange) {
          if (UseFullRange)
            return Int128.op_Equality(Int128.Int128Mul(pt1.Y - pt2.Y, pt3.X - pt4.X), Int128.Int128Mul(pt1.X - pt2.X, pt3.Y - pt4.Y));
          else
            return ClipperLib2.Cast_Int64((pt1.Y - pt2.Y) * (pt3.X - pt4.X)) - ClipperLib2.Cast_Int64((pt1.X - pt2.X) * (pt3.Y - pt4.Y)) === 0;
        };
        ClipperLib2.ClipperBase.prototype.Clear = function() {
          this.DisposeLocalMinimaList();
          for (var i = 0, ilen = this.m_edges.length; i < ilen; ++i) {
            for (var j = 0, jlen = this.m_edges[i].length; j < jlen; ++j)
              this.m_edges[i][j] = null;
            ClipperLib2.Clear(this.m_edges[i]);
          }
          ClipperLib2.Clear(this.m_edges);
          this.m_UseFullRange = false;
          this.m_HasOpenPaths = false;
        };
        ClipperLib2.ClipperBase.prototype.DisposeLocalMinimaList = function() {
          while (this.m_MinimaList !== null) {
            var tmpLm = this.m_MinimaList.Next;
            this.m_MinimaList = null;
            this.m_MinimaList = tmpLm;
          }
          this.m_CurrentLM = null;
        };
        ClipperLib2.ClipperBase.prototype.RangeTest = function(Pt, useFullRange) {
          if (useFullRange.Value) {
            if (Pt.X > ClipperLib2.ClipperBase.hiRange || Pt.Y > ClipperLib2.ClipperBase.hiRange || -Pt.X > ClipperLib2.ClipperBase.hiRange || -Pt.Y > ClipperLib2.ClipperBase.hiRange)
              ClipperLib2.Error("Coordinate outside allowed range in RangeTest().");
          } else if (Pt.X > ClipperLib2.ClipperBase.loRange || Pt.Y > ClipperLib2.ClipperBase.loRange || -Pt.X > ClipperLib2.ClipperBase.loRange || -Pt.Y > ClipperLib2.ClipperBase.loRange) {
            useFullRange.Value = true;
            this.RangeTest(Pt, useFullRange);
          }
        };
        ClipperLib2.ClipperBase.prototype.InitEdge = function(e, eNext, ePrev, pt) {
          e.Next = eNext;
          e.Prev = ePrev;
          e.Curr.X = pt.X;
          e.Curr.Y = pt.Y;
          if (ClipperLib2.use_xyz) e.Curr.Z = pt.Z;
          e.OutIdx = -1;
        };
        ClipperLib2.ClipperBase.prototype.InitEdge2 = function(e, polyType) {
          if (e.Curr.Y >= e.Next.Curr.Y) {
            e.Bot.X = e.Curr.X;
            e.Bot.Y = e.Curr.Y;
            if (ClipperLib2.use_xyz) e.Bot.Z = e.Curr.Z;
            e.Top.X = e.Next.Curr.X;
            e.Top.Y = e.Next.Curr.Y;
            if (ClipperLib2.use_xyz) e.Top.Z = e.Next.Curr.Z;
          } else {
            e.Top.X = e.Curr.X;
            e.Top.Y = e.Curr.Y;
            if (ClipperLib2.use_xyz) e.Top.Z = e.Curr.Z;
            e.Bot.X = e.Next.Curr.X;
            e.Bot.Y = e.Next.Curr.Y;
            if (ClipperLib2.use_xyz) e.Bot.Z = e.Next.Curr.Z;
          }
          this.SetDx(e);
          e.PolyTyp = polyType;
        };
        ClipperLib2.ClipperBase.prototype.FindNextLocMin = function(E) {
          var E2;
          for (; ; ) {
            while (ClipperLib2.IntPoint.op_Inequality(E.Bot, E.Prev.Bot) || ClipperLib2.IntPoint.op_Equality(E.Curr, E.Top))
              E = E.Next;
            if (E.Dx !== ClipperLib2.ClipperBase.horizontal && E.Prev.Dx !== ClipperLib2.ClipperBase.horizontal)
              break;
            while (E.Prev.Dx === ClipperLib2.ClipperBase.horizontal)
              E = E.Prev;
            E2 = E;
            while (E.Dx === ClipperLib2.ClipperBase.horizontal)
              E = E.Next;
            if (E.Top.Y === E.Prev.Bot.Y)
              continue;
            if (E2.Prev.Bot.X < E.Bot.X)
              E = E2;
            break;
          }
          return E;
        };
        ClipperLib2.ClipperBase.prototype.ProcessBound = function(E, LeftBoundIsForward) {
          var EStart;
          var Result = E;
          var Horz;
          if (Result.OutIdx === ClipperLib2.ClipperBase.Skip) {
            E = Result;
            if (LeftBoundIsForward) {
              while (E.Top.Y === E.Next.Bot.Y) E = E.Next;
              while (E !== Result && E.Dx === ClipperLib2.ClipperBase.horizontal) E = E.Prev;
            } else {
              while (E.Top.Y === E.Prev.Bot.Y) E = E.Prev;
              while (E !== Result && E.Dx === ClipperLib2.ClipperBase.horizontal) E = E.Next;
            }
            if (E === Result) {
              if (LeftBoundIsForward) Result = E.Next;
              else Result = E.Prev;
            } else {
              if (LeftBoundIsForward)
                E = Result.Next;
              else
                E = Result.Prev;
              var locMin = new ClipperLib2.LocalMinima();
              locMin.Next = null;
              locMin.Y = E.Bot.Y;
              locMin.LeftBound = null;
              locMin.RightBound = E;
              E.WindDelta = 0;
              Result = this.ProcessBound(E, LeftBoundIsForward);
              this.InsertLocalMinima(locMin);
            }
            return Result;
          }
          if (E.Dx === ClipperLib2.ClipperBase.horizontal) {
            if (LeftBoundIsForward) EStart = E.Prev;
            else EStart = E.Next;
            if (EStart.Dx === ClipperLib2.ClipperBase.horizontal) {
              if (EStart.Bot.X !== E.Bot.X && EStart.Top.X !== E.Bot.X)
                this.ReverseHorizontal(E);
            } else if (EStart.Bot.X !== E.Bot.X)
              this.ReverseHorizontal(E);
          }
          EStart = E;
          if (LeftBoundIsForward) {
            while (Result.Top.Y === Result.Next.Bot.Y && Result.Next.OutIdx !== ClipperLib2.ClipperBase.Skip)
              Result = Result.Next;
            if (Result.Dx === ClipperLib2.ClipperBase.horizontal && Result.Next.OutIdx !== ClipperLib2.ClipperBase.Skip) {
              Horz = Result;
              while (Horz.Prev.Dx === ClipperLib2.ClipperBase.horizontal)
                Horz = Horz.Prev;
              if (Horz.Prev.Top.X > Result.Next.Top.X)
                Result = Horz.Prev;
            }
            while (E !== Result) {
              E.NextInLML = E.Next;
              if (E.Dx === ClipperLib2.ClipperBase.horizontal && E !== EStart && E.Bot.X !== E.Prev.Top.X)
                this.ReverseHorizontal(E);
              E = E.Next;
            }
            if (E.Dx === ClipperLib2.ClipperBase.horizontal && E !== EStart && E.Bot.X !== E.Prev.Top.X)
              this.ReverseHorizontal(E);
            Result = Result.Next;
          } else {
            while (Result.Top.Y === Result.Prev.Bot.Y && Result.Prev.OutIdx !== ClipperLib2.ClipperBase.Skip)
              Result = Result.Prev;
            if (Result.Dx === ClipperLib2.ClipperBase.horizontal && Result.Prev.OutIdx !== ClipperLib2.ClipperBase.Skip) {
              Horz = Result;
              while (Horz.Next.Dx === ClipperLib2.ClipperBase.horizontal)
                Horz = Horz.Next;
              if (Horz.Next.Top.X === Result.Prev.Top.X || Horz.Next.Top.X > Result.Prev.Top.X) {
                Result = Horz.Next;
              }
            }
            while (E !== Result) {
              E.NextInLML = E.Prev;
              if (E.Dx === ClipperLib2.ClipperBase.horizontal && E !== EStart && E.Bot.X !== E.Next.Top.X)
                this.ReverseHorizontal(E);
              E = E.Prev;
            }
            if (E.Dx === ClipperLib2.ClipperBase.horizontal && E !== EStart && E.Bot.X !== E.Next.Top.X)
              this.ReverseHorizontal(E);
            Result = Result.Prev;
          }
          return Result;
        };
        ClipperLib2.ClipperBase.prototype.AddPath = function(pg, polyType, Closed) {
          if (ClipperLib2.use_lines) {
            if (!Closed && polyType === ClipperLib2.PolyType.ptClip)
              ClipperLib2.Error("AddPath: Open paths must be subject.");
          } else {
            if (!Closed)
              ClipperLib2.Error("AddPath: Open paths have been disabled.");
          }
          var highI = pg.length - 1;
          if (Closed)
            while (highI > 0 && ClipperLib2.IntPoint.op_Equality(pg[highI], pg[0]))
              --highI;
          while (highI > 0 && ClipperLib2.IntPoint.op_Equality(pg[highI], pg[highI - 1]))
            --highI;
          if (Closed && highI < 2 || !Closed && highI < 1)
            return false;
          var edges = new Array();
          for (var i = 0; i <= highI; i++)
            edges.push(new ClipperLib2.TEdge());
          var IsFlat = true;
          edges[1].Curr.X = pg[1].X;
          edges[1].Curr.Y = pg[1].Y;
          if (ClipperLib2.use_xyz) edges[1].Curr.Z = pg[1].Z;
          var $1 = {
            Value: this.m_UseFullRange
          };
          this.RangeTest(pg[0], $1);
          this.m_UseFullRange = $1.Value;
          $1.Value = this.m_UseFullRange;
          this.RangeTest(pg[highI], $1);
          this.m_UseFullRange = $1.Value;
          this.InitEdge(edges[0], edges[1], edges[highI], pg[0]);
          this.InitEdge(edges[highI], edges[0], edges[highI - 1], pg[highI]);
          for (var i = highI - 1; i >= 1; --i) {
            $1.Value = this.m_UseFullRange;
            this.RangeTest(pg[i], $1);
            this.m_UseFullRange = $1.Value;
            this.InitEdge(edges[i], edges[i + 1], edges[i - 1], pg[i]);
          }
          var eStart = edges[0];
          var E = eStart, eLoopStop = eStart;
          for (; ; ) {
            if (E.Curr === E.Next.Curr && (Closed || E.Next !== eStart)) {
              if (E === E.Next)
                break;
              if (E === eStart)
                eStart = E.Next;
              E = this.RemoveEdge(E);
              eLoopStop = E;
              continue;
            }
            if (E.Prev === E.Next)
              break;
            else if (Closed && ClipperLib2.ClipperBase.SlopesEqual4(E.Prev.Curr, E.Curr, E.Next.Curr, this.m_UseFullRange) && (!this.PreserveCollinear || !this.Pt2IsBetweenPt1AndPt3(E.Prev.Curr, E.Curr, E.Next.Curr))) {
              if (E === eStart)
                eStart = E.Next;
              E = this.RemoveEdge(E);
              E = E.Prev;
              eLoopStop = E;
              continue;
            }
            E = E.Next;
            if (E === eLoopStop || !Closed && E.Next === eStart) break;
          }
          if (!Closed && E === E.Next || Closed && E.Prev === E.Next)
            return false;
          if (!Closed) {
            this.m_HasOpenPaths = true;
            eStart.Prev.OutIdx = ClipperLib2.ClipperBase.Skip;
          }
          E = eStart;
          do {
            this.InitEdge2(E, polyType);
            E = E.Next;
            if (IsFlat && E.Curr.Y !== eStart.Curr.Y)
              IsFlat = false;
          } while (E !== eStart);
          if (IsFlat) {
            if (Closed)
              return false;
            E.Prev.OutIdx = ClipperLib2.ClipperBase.Skip;
            var locMin = new ClipperLib2.LocalMinima();
            locMin.Next = null;
            locMin.Y = E.Bot.Y;
            locMin.LeftBound = null;
            locMin.RightBound = E;
            locMin.RightBound.Side = ClipperLib2.EdgeSide.esRight;
            locMin.RightBound.WindDelta = 0;
            for (; ; ) {
              if (E.Bot.X !== E.Prev.Top.X) this.ReverseHorizontal(E);
              if (E.Next.OutIdx === ClipperLib2.ClipperBase.Skip) break;
              E.NextInLML = E.Next;
              E = E.Next;
            }
            this.InsertLocalMinima(locMin);
            this.m_edges.push(edges);
            return true;
          }
          this.m_edges.push(edges);
          var leftBoundIsForward;
          var EMin = null;
          if (ClipperLib2.IntPoint.op_Equality(E.Prev.Bot, E.Prev.Top))
            E = E.Next;
          for (; ; ) {
            E = this.FindNextLocMin(E);
            if (E === EMin)
              break;
            else if (EMin === null)
              EMin = E;
            var locMin = new ClipperLib2.LocalMinima();
            locMin.Next = null;
            locMin.Y = E.Bot.Y;
            if (E.Dx < E.Prev.Dx) {
              locMin.LeftBound = E.Prev;
              locMin.RightBound = E;
              leftBoundIsForward = false;
            } else {
              locMin.LeftBound = E;
              locMin.RightBound = E.Prev;
              leftBoundIsForward = true;
            }
            locMin.LeftBound.Side = ClipperLib2.EdgeSide.esLeft;
            locMin.RightBound.Side = ClipperLib2.EdgeSide.esRight;
            if (!Closed)
              locMin.LeftBound.WindDelta = 0;
            else if (locMin.LeftBound.Next === locMin.RightBound)
              locMin.LeftBound.WindDelta = -1;
            else
              locMin.LeftBound.WindDelta = 1;
            locMin.RightBound.WindDelta = -locMin.LeftBound.WindDelta;
            E = this.ProcessBound(locMin.LeftBound, leftBoundIsForward);
            if (E.OutIdx === ClipperLib2.ClipperBase.Skip)
              E = this.ProcessBound(E, leftBoundIsForward);
            var E2 = this.ProcessBound(locMin.RightBound, !leftBoundIsForward);
            if (E2.OutIdx === ClipperLib2.ClipperBase.Skip) E2 = this.ProcessBound(E2, !leftBoundIsForward);
            if (locMin.LeftBound.OutIdx === ClipperLib2.ClipperBase.Skip)
              locMin.LeftBound = null;
            else if (locMin.RightBound.OutIdx === ClipperLib2.ClipperBase.Skip)
              locMin.RightBound = null;
            this.InsertLocalMinima(locMin);
            if (!leftBoundIsForward)
              E = E2;
          }
          return true;
        };
        ClipperLib2.ClipperBase.prototype.AddPaths = function(ppg, polyType, closed) {
          var result = false;
          for (var i = 0, ilen = ppg.length; i < ilen; ++i)
            if (this.AddPath(ppg[i], polyType, closed))
              result = true;
          return result;
        };
        ClipperLib2.ClipperBase.prototype.Pt2IsBetweenPt1AndPt3 = function(pt1, pt2, pt3) {
          if (ClipperLib2.IntPoint.op_Equality(pt1, pt3) || ClipperLib2.IntPoint.op_Equality(pt1, pt2) || ClipperLib2.IntPoint.op_Equality(pt3, pt2))
            return false;
          else if (pt1.X !== pt3.X)
            return pt2.X > pt1.X === pt2.X < pt3.X;
          else
            return pt2.Y > pt1.Y === pt2.Y < pt3.Y;
        };
        ClipperLib2.ClipperBase.prototype.RemoveEdge = function(e) {
          e.Prev.Next = e.Next;
          e.Next.Prev = e.Prev;
          var result = e.Next;
          e.Prev = null;
          return result;
        };
        ClipperLib2.ClipperBase.prototype.SetDx = function(e) {
          e.Delta.X = e.Top.X - e.Bot.X;
          e.Delta.Y = e.Top.Y - e.Bot.Y;
          if (e.Delta.Y === 0) e.Dx = ClipperLib2.ClipperBase.horizontal;
          else e.Dx = e.Delta.X / e.Delta.Y;
        };
        ClipperLib2.ClipperBase.prototype.InsertLocalMinima = function(newLm) {
          if (this.m_MinimaList === null) {
            this.m_MinimaList = newLm;
          } else if (newLm.Y >= this.m_MinimaList.Y) {
            newLm.Next = this.m_MinimaList;
            this.m_MinimaList = newLm;
          } else {
            var tmpLm = this.m_MinimaList;
            while (tmpLm.Next !== null && newLm.Y < tmpLm.Next.Y)
              tmpLm = tmpLm.Next;
            newLm.Next = tmpLm.Next;
            tmpLm.Next = newLm;
          }
        };
        ClipperLib2.ClipperBase.prototype.PopLocalMinima = function(Y, current) {
          current.v = this.m_CurrentLM;
          if (this.m_CurrentLM !== null && this.m_CurrentLM.Y === Y) {
            this.m_CurrentLM = this.m_CurrentLM.Next;
            return true;
          }
          return false;
        };
        ClipperLib2.ClipperBase.prototype.ReverseHorizontal = function(e) {
          var tmp = e.Top.X;
          e.Top.X = e.Bot.X;
          e.Bot.X = tmp;
          if (ClipperLib2.use_xyz) {
            tmp = e.Top.Z;
            e.Top.Z = e.Bot.Z;
            e.Bot.Z = tmp;
          }
        };
        ClipperLib2.ClipperBase.prototype.Reset = function() {
          this.m_CurrentLM = this.m_MinimaList;
          if (this.m_CurrentLM === null)
            return;
          this.m_Scanbeam = null;
          var lm = this.m_MinimaList;
          while (lm !== null) {
            this.InsertScanbeam(lm.Y);
            var e = lm.LeftBound;
            if (e !== null) {
              e.Curr.X = e.Bot.X;
              e.Curr.Y = e.Bot.Y;
              if (ClipperLib2.use_xyz) e.Curr.Z = e.Bot.Z;
              e.OutIdx = ClipperLib2.ClipperBase.Unassigned;
            }
            e = lm.RightBound;
            if (e !== null) {
              e.Curr.X = e.Bot.X;
              e.Curr.Y = e.Bot.Y;
              if (ClipperLib2.use_xyz) e.Curr.Z = e.Bot.Z;
              e.OutIdx = ClipperLib2.ClipperBase.Unassigned;
            }
            lm = lm.Next;
          }
          this.m_ActiveEdges = null;
        };
        ClipperLib2.ClipperBase.prototype.InsertScanbeam = function(Y) {
          if (this.m_Scanbeam === null) {
            this.m_Scanbeam = new ClipperLib2.Scanbeam();
            this.m_Scanbeam.Next = null;
            this.m_Scanbeam.Y = Y;
          } else if (Y > this.m_Scanbeam.Y) {
            var newSb = new ClipperLib2.Scanbeam();
            newSb.Y = Y;
            newSb.Next = this.m_Scanbeam;
            this.m_Scanbeam = newSb;
          } else {
            var sb2 = this.m_Scanbeam;
            while (sb2.Next !== null && Y <= sb2.Next.Y) {
              sb2 = sb2.Next;
            }
            if (Y === sb2.Y) {
              return;
            }
            var newSb1 = new ClipperLib2.Scanbeam();
            newSb1.Y = Y;
            newSb1.Next = sb2.Next;
            sb2.Next = newSb1;
          }
        };
        ClipperLib2.ClipperBase.prototype.PopScanbeam = function(Y) {
          if (this.m_Scanbeam === null) {
            Y.v = 0;
            return false;
          }
          Y.v = this.m_Scanbeam.Y;
          this.m_Scanbeam = this.m_Scanbeam.Next;
          return true;
        };
        ClipperLib2.ClipperBase.prototype.LocalMinimaPending = function() {
          return this.m_CurrentLM !== null;
        };
        ClipperLib2.ClipperBase.prototype.CreateOutRec = function() {
          var result = new ClipperLib2.OutRec();
          result.Idx = ClipperLib2.ClipperBase.Unassigned;
          result.IsHole = false;
          result.IsOpen = false;
          result.FirstLeft = null;
          result.Pts = null;
          result.BottomPt = null;
          result.PolyNode = null;
          this.m_PolyOuts.push(result);
          result.Idx = this.m_PolyOuts.length - 1;
          return result;
        };
        ClipperLib2.ClipperBase.prototype.DisposeOutRec = function(index) {
          var outRec = this.m_PolyOuts[index];
          outRec.Pts = null;
          outRec = null;
          this.m_PolyOuts[index] = null;
        };
        ClipperLib2.ClipperBase.prototype.UpdateEdgeIntoAEL = function(e) {
          if (e.NextInLML === null) {
            ClipperLib2.Error("UpdateEdgeIntoAEL: invalid call");
          }
          var AelPrev = e.PrevInAEL;
          var AelNext = e.NextInAEL;
          e.NextInLML.OutIdx = e.OutIdx;
          if (AelPrev !== null) {
            AelPrev.NextInAEL = e.NextInLML;
          } else {
            this.m_ActiveEdges = e.NextInLML;
          }
          if (AelNext !== null) {
            AelNext.PrevInAEL = e.NextInLML;
          }
          e.NextInLML.Side = e.Side;
          e.NextInLML.WindDelta = e.WindDelta;
          e.NextInLML.WindCnt = e.WindCnt;
          e.NextInLML.WindCnt2 = e.WindCnt2;
          e = e.NextInLML;
          e.Curr.X = e.Bot.X;
          e.Curr.Y = e.Bot.Y;
          e.PrevInAEL = AelPrev;
          e.NextInAEL = AelNext;
          if (!ClipperLib2.ClipperBase.IsHorizontal(e)) {
            this.InsertScanbeam(e.Top.Y);
          }
          return e;
        };
        ClipperLib2.ClipperBase.prototype.SwapPositionsInAEL = function(edge1, edge2) {
          if (edge1.NextInAEL === edge1.PrevInAEL || edge2.NextInAEL === edge2.PrevInAEL) {
            return;
          }
          if (edge1.NextInAEL === edge2) {
            var next = edge2.NextInAEL;
            if (next !== null) {
              next.PrevInAEL = edge1;
            }
            var prev = edge1.PrevInAEL;
            if (prev !== null) {
              prev.NextInAEL = edge2;
            }
            edge2.PrevInAEL = prev;
            edge2.NextInAEL = edge1;
            edge1.PrevInAEL = edge2;
            edge1.NextInAEL = next;
          } else if (edge2.NextInAEL === edge1) {
            var next1 = edge1.NextInAEL;
            if (next1 !== null) {
              next1.PrevInAEL = edge2;
            }
            var prev1 = edge2.PrevInAEL;
            if (prev1 !== null) {
              prev1.NextInAEL = edge1;
            }
            edge1.PrevInAEL = prev1;
            edge1.NextInAEL = edge2;
            edge2.PrevInAEL = edge1;
            edge2.NextInAEL = next1;
          } else {
            var next2 = edge1.NextInAEL;
            var prev2 = edge1.PrevInAEL;
            edge1.NextInAEL = edge2.NextInAEL;
            if (edge1.NextInAEL !== null) {
              edge1.NextInAEL.PrevInAEL = edge1;
            }
            edge1.PrevInAEL = edge2.PrevInAEL;
            if (edge1.PrevInAEL !== null) {
              edge1.PrevInAEL.NextInAEL = edge1;
            }
            edge2.NextInAEL = next2;
            if (edge2.NextInAEL !== null) {
              edge2.NextInAEL.PrevInAEL = edge2;
            }
            edge2.PrevInAEL = prev2;
            if (edge2.PrevInAEL !== null) {
              edge2.PrevInAEL.NextInAEL = edge2;
            }
          }
          if (edge1.PrevInAEL === null) {
            this.m_ActiveEdges = edge1;
          } else {
            if (edge2.PrevInAEL === null) {
              this.m_ActiveEdges = edge2;
            }
          }
        };
        ClipperLib2.ClipperBase.prototype.DeleteFromAEL = function(e) {
          var AelPrev = e.PrevInAEL;
          var AelNext = e.NextInAEL;
          if (AelPrev === null && AelNext === null && e !== this.m_ActiveEdges) {
            return;
          }
          if (AelPrev !== null) {
            AelPrev.NextInAEL = AelNext;
          } else {
            this.m_ActiveEdges = AelNext;
          }
          if (AelNext !== null) {
            AelNext.PrevInAEL = AelPrev;
          }
          e.NextInAEL = null;
          e.PrevInAEL = null;
        };
        ClipperLib2.Clipper = function(InitOptions) {
          if (typeof InitOptions === "undefined") InitOptions = 0;
          this.m_PolyOuts = null;
          this.m_ClipType = ClipperLib2.ClipType.ctIntersection;
          this.m_Scanbeam = null;
          this.m_Maxima = null;
          this.m_ActiveEdges = null;
          this.m_SortedEdges = null;
          this.m_IntersectList = null;
          this.m_IntersectNodeComparer = null;
          this.m_ExecuteLocked = false;
          this.m_ClipFillType = ClipperLib2.PolyFillType.pftEvenOdd;
          this.m_SubjFillType = ClipperLib2.PolyFillType.pftEvenOdd;
          this.m_Joins = null;
          this.m_GhostJoins = null;
          this.m_UsingPolyTree = false;
          this.ReverseSolution = false;
          this.StrictlySimple = false;
          ClipperLib2.ClipperBase.call(this);
          this.m_Scanbeam = null;
          this.m_Maxima = null;
          this.m_ActiveEdges = null;
          this.m_SortedEdges = null;
          this.m_IntersectList = new Array();
          this.m_IntersectNodeComparer = ClipperLib2.MyIntersectNodeSort.Compare;
          this.m_ExecuteLocked = false;
          this.m_UsingPolyTree = false;
          this.m_PolyOuts = new Array();
          this.m_Joins = new Array();
          this.m_GhostJoins = new Array();
          this.ReverseSolution = (1 & InitOptions) !== 0;
          this.StrictlySimple = (2 & InitOptions) !== 0;
          this.PreserveCollinear = (4 & InitOptions) !== 0;
          if (ClipperLib2.use_xyz) {
            this.ZFillFunction = null;
          }
        };
        ClipperLib2.Clipper.ioReverseSolution = 1;
        ClipperLib2.Clipper.ioStrictlySimple = 2;
        ClipperLib2.Clipper.ioPreserveCollinear = 4;
        ClipperLib2.Clipper.prototype.Clear = function() {
          if (this.m_edges.length === 0)
            return;
          this.DisposeAllPolyPts();
          ClipperLib2.ClipperBase.prototype.Clear.call(this);
        };
        ClipperLib2.Clipper.prototype.InsertMaxima = function(X) {
          var newMax = new ClipperLib2.Maxima();
          newMax.X = X;
          if (this.m_Maxima === null) {
            this.m_Maxima = newMax;
            this.m_Maxima.Next = null;
            this.m_Maxima.Prev = null;
          } else if (X < this.m_Maxima.X) {
            newMax.Next = this.m_Maxima;
            newMax.Prev = null;
            this.m_Maxima = newMax;
          } else {
            var m = this.m_Maxima;
            while (m.Next !== null && X >= m.Next.X) {
              m = m.Next;
            }
            if (X === m.X) {
              return;
            }
            newMax.Next = m.Next;
            newMax.Prev = m;
            if (m.Next !== null) {
              m.Next.Prev = newMax;
            }
            m.Next = newMax;
          }
        };
        ClipperLib2.Clipper.prototype.Execute = function() {
          var a = arguments, alen = a.length, ispolytree = a[1] instanceof ClipperLib2.PolyTree;
          if (alen === 4 && !ispolytree) {
            var clipType = a[0], solution = a[1], subjFillType = a[2], clipFillType = a[3];
            if (this.m_ExecuteLocked)
              return false;
            if (this.m_HasOpenPaths)
              ClipperLib2.Error("Error: PolyTree struct is needed for open path clipping.");
            this.m_ExecuteLocked = true;
            ClipperLib2.Clear(solution);
            this.m_SubjFillType = subjFillType;
            this.m_ClipFillType = clipFillType;
            this.m_ClipType = clipType;
            this.m_UsingPolyTree = false;
            try {
              var succeeded = this.ExecuteInternal();
              if (succeeded) this.BuildResult(solution);
            } finally {
              this.DisposeAllPolyPts();
              this.m_ExecuteLocked = false;
            }
            return succeeded;
          } else if (alen === 4 && ispolytree) {
            var clipType = a[0], polytree = a[1], subjFillType = a[2], clipFillType = a[3];
            if (this.m_ExecuteLocked)
              return false;
            this.m_ExecuteLocked = true;
            this.m_SubjFillType = subjFillType;
            this.m_ClipFillType = clipFillType;
            this.m_ClipType = clipType;
            this.m_UsingPolyTree = true;
            try {
              var succeeded = this.ExecuteInternal();
              if (succeeded) this.BuildResult2(polytree);
            } finally {
              this.DisposeAllPolyPts();
              this.m_ExecuteLocked = false;
            }
            return succeeded;
          } else if (alen === 2 && !ispolytree) {
            var clipType = a[0], solution = a[1];
            return this.Execute(clipType, solution, ClipperLib2.PolyFillType.pftEvenOdd, ClipperLib2.PolyFillType.pftEvenOdd);
          } else if (alen === 2 && ispolytree) {
            var clipType = a[0], polytree = a[1];
            return this.Execute(clipType, polytree, ClipperLib2.PolyFillType.pftEvenOdd, ClipperLib2.PolyFillType.pftEvenOdd);
          }
        };
        ClipperLib2.Clipper.prototype.FixHoleLinkage = function(outRec) {
          if (outRec.FirstLeft === null || outRec.IsHole !== outRec.FirstLeft.IsHole && outRec.FirstLeft.Pts !== null)
            return;
          var orfl = outRec.FirstLeft;
          while (orfl !== null && (orfl.IsHole === outRec.IsHole || orfl.Pts === null))
            orfl = orfl.FirstLeft;
          outRec.FirstLeft = orfl;
        };
        ClipperLib2.Clipper.prototype.ExecuteInternal = function() {
          try {
            this.Reset();
            this.m_SortedEdges = null;
            this.m_Maxima = null;
            var botY = {}, topY = {};
            if (!this.PopScanbeam(botY)) {
              return false;
            }
            this.InsertLocalMinimaIntoAEL(botY.v);
            while (this.PopScanbeam(topY) || this.LocalMinimaPending()) {
              this.ProcessHorizontals();
              this.m_GhostJoins.length = 0;
              if (!this.ProcessIntersections(topY.v)) {
                return false;
              }
              this.ProcessEdgesAtTopOfScanbeam(topY.v);
              botY.v = topY.v;
              this.InsertLocalMinimaIntoAEL(botY.v);
            }
            var outRec, i, ilen;
            for (i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++) {
              outRec = this.m_PolyOuts[i];
              if (outRec.Pts === null || outRec.IsOpen) continue;
              if ((outRec.IsHole ^ this.ReverseSolution) == this.Area$1(outRec) > 0)
                this.ReversePolyPtLinks(outRec.Pts);
            }
            this.JoinCommonEdges();
            for (i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++) {
              outRec = this.m_PolyOuts[i];
              if (outRec.Pts === null)
                continue;
              else if (outRec.IsOpen)
                this.FixupOutPolyline(outRec);
              else
                this.FixupOutPolygon(outRec);
            }
            if (this.StrictlySimple) this.DoSimplePolygons();
            return true;
          } finally {
            this.m_Joins.length = 0;
            this.m_GhostJoins.length = 0;
          }
        };
        ClipperLib2.Clipper.prototype.DisposeAllPolyPts = function() {
          for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; ++i)
            this.DisposeOutRec(i);
          ClipperLib2.Clear(this.m_PolyOuts);
        };
        ClipperLib2.Clipper.prototype.AddJoin = function(Op1, Op2, OffPt) {
          var j = new ClipperLib2.Join();
          j.OutPt1 = Op1;
          j.OutPt2 = Op2;
          j.OffPt.X = OffPt.X;
          j.OffPt.Y = OffPt.Y;
          if (ClipperLib2.use_xyz) j.OffPt.Z = OffPt.Z;
          this.m_Joins.push(j);
        };
        ClipperLib2.Clipper.prototype.AddGhostJoin = function(Op, OffPt) {
          var j = new ClipperLib2.Join();
          j.OutPt1 = Op;
          j.OffPt.X = OffPt.X;
          j.OffPt.Y = OffPt.Y;
          if (ClipperLib2.use_xyz) j.OffPt.Z = OffPt.Z;
          this.m_GhostJoins.push(j);
        };
        ClipperLib2.Clipper.prototype.SetZ = function(pt, e1, e2) {
          if (this.ZFillFunction !== null) {
            if (pt.Z !== 0 || this.ZFillFunction === null) return;
            else if (ClipperLib2.IntPoint.op_Equality(pt, e1.Bot)) pt.Z = e1.Bot.Z;
            else if (ClipperLib2.IntPoint.op_Equality(pt, e1.Top)) pt.Z = e1.Top.Z;
            else if (ClipperLib2.IntPoint.op_Equality(pt, e2.Bot)) pt.Z = e2.Bot.Z;
            else if (ClipperLib2.IntPoint.op_Equality(pt, e2.Top)) pt.Z = e2.Top.Z;
            else this.ZFillFunction(e1.Bot, e1.Top, e2.Bot, e2.Top, pt);
          }
        };
        ClipperLib2.Clipper.prototype.InsertLocalMinimaIntoAEL = function(botY) {
          var lm = {};
          var lb;
          var rb;
          while (this.PopLocalMinima(botY, lm)) {
            lb = lm.v.LeftBound;
            rb = lm.v.RightBound;
            var Op1 = null;
            if (lb === null) {
              this.InsertEdgeIntoAEL(rb, null);
              this.SetWindingCount(rb);
              if (this.IsContributing(rb))
                Op1 = this.AddOutPt(rb, rb.Bot);
            } else if (rb === null) {
              this.InsertEdgeIntoAEL(lb, null);
              this.SetWindingCount(lb);
              if (this.IsContributing(lb))
                Op1 = this.AddOutPt(lb, lb.Bot);
              this.InsertScanbeam(lb.Top.Y);
            } else {
              this.InsertEdgeIntoAEL(lb, null);
              this.InsertEdgeIntoAEL(rb, lb);
              this.SetWindingCount(lb);
              rb.WindCnt = lb.WindCnt;
              rb.WindCnt2 = lb.WindCnt2;
              if (this.IsContributing(lb))
                Op1 = this.AddLocalMinPoly(lb, rb, lb.Bot);
              this.InsertScanbeam(lb.Top.Y);
            }
            if (rb !== null) {
              if (ClipperLib2.ClipperBase.IsHorizontal(rb)) {
                if (rb.NextInLML !== null) {
                  this.InsertScanbeam(rb.NextInLML.Top.Y);
                }
                this.AddEdgeToSEL(rb);
              } else {
                this.InsertScanbeam(rb.Top.Y);
              }
            }
            if (lb === null || rb === null) continue;
            if (Op1 !== null && ClipperLib2.ClipperBase.IsHorizontal(rb) && this.m_GhostJoins.length > 0 && rb.WindDelta !== 0) {
              for (var i = 0, ilen = this.m_GhostJoins.length; i < ilen; i++) {
                var j = this.m_GhostJoins[i];
                if (this.HorzSegmentsOverlap(j.OutPt1.Pt.X, j.OffPt.X, rb.Bot.X, rb.Top.X))
                  this.AddJoin(j.OutPt1, Op1, j.OffPt);
              }
            }
            if (lb.OutIdx >= 0 && lb.PrevInAEL !== null && lb.PrevInAEL.Curr.X === lb.Bot.X && lb.PrevInAEL.OutIdx >= 0 && ClipperLib2.ClipperBase.SlopesEqual5(lb.PrevInAEL.Curr, lb.PrevInAEL.Top, lb.Curr, lb.Top, this.m_UseFullRange) && lb.WindDelta !== 0 && lb.PrevInAEL.WindDelta !== 0) {
              var Op2 = this.AddOutPt(lb.PrevInAEL, lb.Bot);
              this.AddJoin(Op1, Op2, lb.Top);
            }
            if (lb.NextInAEL !== rb) {
              if (rb.OutIdx >= 0 && rb.PrevInAEL.OutIdx >= 0 && ClipperLib2.ClipperBase.SlopesEqual5(rb.PrevInAEL.Curr, rb.PrevInAEL.Top, rb.Curr, rb.Top, this.m_UseFullRange) && rb.WindDelta !== 0 && rb.PrevInAEL.WindDelta !== 0) {
                var Op2 = this.AddOutPt(rb.PrevInAEL, rb.Bot);
                this.AddJoin(Op1, Op2, rb.Top);
              }
              var e = lb.NextInAEL;
              if (e !== null)
                while (e !== rb) {
                  this.IntersectEdges(rb, e, lb.Curr);
                  e = e.NextInAEL;
                }
            }
          }
        };
        ClipperLib2.Clipper.prototype.InsertEdgeIntoAEL = function(edge, startEdge) {
          if (this.m_ActiveEdges === null) {
            edge.PrevInAEL = null;
            edge.NextInAEL = null;
            this.m_ActiveEdges = edge;
          } else if (startEdge === null && this.E2InsertsBeforeE1(this.m_ActiveEdges, edge)) {
            edge.PrevInAEL = null;
            edge.NextInAEL = this.m_ActiveEdges;
            this.m_ActiveEdges.PrevInAEL = edge;
            this.m_ActiveEdges = edge;
          } else {
            if (startEdge === null)
              startEdge = this.m_ActiveEdges;
            while (startEdge.NextInAEL !== null && !this.E2InsertsBeforeE1(startEdge.NextInAEL, edge))
              startEdge = startEdge.NextInAEL;
            edge.NextInAEL = startEdge.NextInAEL;
            if (startEdge.NextInAEL !== null)
              startEdge.NextInAEL.PrevInAEL = edge;
            edge.PrevInAEL = startEdge;
            startEdge.NextInAEL = edge;
          }
        };
        ClipperLib2.Clipper.prototype.E2InsertsBeforeE1 = function(e1, e2) {
          if (e2.Curr.X === e1.Curr.X) {
            if (e2.Top.Y > e1.Top.Y)
              return e2.Top.X < ClipperLib2.Clipper.TopX(e1, e2.Top.Y);
            else
              return e1.Top.X > ClipperLib2.Clipper.TopX(e2, e1.Top.Y);
          } else
            return e2.Curr.X < e1.Curr.X;
        };
        ClipperLib2.Clipper.prototype.IsEvenOddFillType = function(edge) {
          if (edge.PolyTyp === ClipperLib2.PolyType.ptSubject)
            return this.m_SubjFillType === ClipperLib2.PolyFillType.pftEvenOdd;
          else
            return this.m_ClipFillType === ClipperLib2.PolyFillType.pftEvenOdd;
        };
        ClipperLib2.Clipper.prototype.IsEvenOddAltFillType = function(edge) {
          if (edge.PolyTyp === ClipperLib2.PolyType.ptSubject)
            return this.m_ClipFillType === ClipperLib2.PolyFillType.pftEvenOdd;
          else
            return this.m_SubjFillType === ClipperLib2.PolyFillType.pftEvenOdd;
        };
        ClipperLib2.Clipper.prototype.IsContributing = function(edge) {
          var pft, pft2;
          if (edge.PolyTyp === ClipperLib2.PolyType.ptSubject) {
            pft = this.m_SubjFillType;
            pft2 = this.m_ClipFillType;
          } else {
            pft = this.m_ClipFillType;
            pft2 = this.m_SubjFillType;
          }
          switch (pft) {
            case ClipperLib2.PolyFillType.pftEvenOdd:
              if (edge.WindDelta === 0 && edge.WindCnt !== 1)
                return false;
              break;
            case ClipperLib2.PolyFillType.pftNonZero:
              if (Math.abs(edge.WindCnt) !== 1)
                return false;
              break;
            case ClipperLib2.PolyFillType.pftPositive:
              if (edge.WindCnt !== 1)
                return false;
              break;
            default:
              if (edge.WindCnt !== -1)
                return false;
              break;
          }
          switch (this.m_ClipType) {
            case ClipperLib2.ClipType.ctIntersection:
              switch (pft2) {
                case ClipperLib2.PolyFillType.pftEvenOdd:
                case ClipperLib2.PolyFillType.pftNonZero:
                  return edge.WindCnt2 !== 0;
                case ClipperLib2.PolyFillType.pftPositive:
                  return edge.WindCnt2 > 0;
                default:
                  return edge.WindCnt2 < 0;
              }
            case ClipperLib2.ClipType.ctUnion:
              switch (pft2) {
                case ClipperLib2.PolyFillType.pftEvenOdd:
                case ClipperLib2.PolyFillType.pftNonZero:
                  return edge.WindCnt2 === 0;
                case ClipperLib2.PolyFillType.pftPositive:
                  return edge.WindCnt2 <= 0;
                default:
                  return edge.WindCnt2 >= 0;
              }
            case ClipperLib2.ClipType.ctDifference:
              if (edge.PolyTyp === ClipperLib2.PolyType.ptSubject)
                switch (pft2) {
                  case ClipperLib2.PolyFillType.pftEvenOdd:
                  case ClipperLib2.PolyFillType.pftNonZero:
                    return edge.WindCnt2 === 0;
                  case ClipperLib2.PolyFillType.pftPositive:
                    return edge.WindCnt2 <= 0;
                  default:
                    return edge.WindCnt2 >= 0;
                }
              else
                switch (pft2) {
                  case ClipperLib2.PolyFillType.pftEvenOdd:
                  case ClipperLib2.PolyFillType.pftNonZero:
                    return edge.WindCnt2 !== 0;
                  case ClipperLib2.PolyFillType.pftPositive:
                    return edge.WindCnt2 > 0;
                  default:
                    return edge.WindCnt2 < 0;
                }
            case ClipperLib2.ClipType.ctXor:
              if (edge.WindDelta === 0)
                switch (pft2) {
                  case ClipperLib2.PolyFillType.pftEvenOdd:
                  case ClipperLib2.PolyFillType.pftNonZero:
                    return edge.WindCnt2 === 0;
                  case ClipperLib2.PolyFillType.pftPositive:
                    return edge.WindCnt2 <= 0;
                  default:
                    return edge.WindCnt2 >= 0;
                }
              else
                return true;
          }
          return true;
        };
        ClipperLib2.Clipper.prototype.SetWindingCount = function(edge) {
          var e = edge.PrevInAEL;
          while (e !== null && (e.PolyTyp !== edge.PolyTyp || e.WindDelta === 0))
            e = e.PrevInAEL;
          if (e === null) {
            var pft = edge.PolyTyp === ClipperLib2.PolyType.ptSubject ? this.m_SubjFillType : this.m_ClipFillType;
            if (edge.WindDelta === 0) {
              edge.WindCnt = pft === ClipperLib2.PolyFillType.pftNegative ? -1 : 1;
            } else {
              edge.WindCnt = edge.WindDelta;
            }
            edge.WindCnt2 = 0;
            e = this.m_ActiveEdges;
          } else if (edge.WindDelta === 0 && this.m_ClipType !== ClipperLib2.ClipType.ctUnion) {
            edge.WindCnt = 1;
            edge.WindCnt2 = e.WindCnt2;
            e = e.NextInAEL;
          } else if (this.IsEvenOddFillType(edge)) {
            if (edge.WindDelta === 0) {
              var Inside = true;
              var e2 = e.PrevInAEL;
              while (e2 !== null) {
                if (e2.PolyTyp === e.PolyTyp && e2.WindDelta !== 0)
                  Inside = !Inside;
                e2 = e2.PrevInAEL;
              }
              edge.WindCnt = Inside ? 0 : 1;
            } else {
              edge.WindCnt = edge.WindDelta;
            }
            edge.WindCnt2 = e.WindCnt2;
            e = e.NextInAEL;
          } else {
            if (e.WindCnt * e.WindDelta < 0) {
              if (Math.abs(e.WindCnt) > 1) {
                if (e.WindDelta * edge.WindDelta < 0)
                  edge.WindCnt = e.WindCnt;
                else
                  edge.WindCnt = e.WindCnt + edge.WindDelta;
              } else
                edge.WindCnt = edge.WindDelta === 0 ? 1 : edge.WindDelta;
            } else {
              if (edge.WindDelta === 0)
                edge.WindCnt = e.WindCnt < 0 ? e.WindCnt - 1 : e.WindCnt + 1;
              else if (e.WindDelta * edge.WindDelta < 0)
                edge.WindCnt = e.WindCnt;
              else
                edge.WindCnt = e.WindCnt + edge.WindDelta;
            }
            edge.WindCnt2 = e.WindCnt2;
            e = e.NextInAEL;
          }
          if (this.IsEvenOddAltFillType(edge)) {
            while (e !== edge) {
              if (e.WindDelta !== 0)
                edge.WindCnt2 = edge.WindCnt2 === 0 ? 1 : 0;
              e = e.NextInAEL;
            }
          } else {
            while (e !== edge) {
              edge.WindCnt2 += e.WindDelta;
              e = e.NextInAEL;
            }
          }
        };
        ClipperLib2.Clipper.prototype.AddEdgeToSEL = function(edge) {
          if (this.m_SortedEdges === null) {
            this.m_SortedEdges = edge;
            edge.PrevInSEL = null;
            edge.NextInSEL = null;
          } else {
            edge.NextInSEL = this.m_SortedEdges;
            edge.PrevInSEL = null;
            this.m_SortedEdges.PrevInSEL = edge;
            this.m_SortedEdges = edge;
          }
        };
        ClipperLib2.Clipper.prototype.PopEdgeFromSEL = function(e) {
          e.v = this.m_SortedEdges;
          if (e.v === null) {
            return false;
          }
          var oldE = e.v;
          this.m_SortedEdges = e.v.NextInSEL;
          if (this.m_SortedEdges !== null) {
            this.m_SortedEdges.PrevInSEL = null;
          }
          oldE.NextInSEL = null;
          oldE.PrevInSEL = null;
          return true;
        };
        ClipperLib2.Clipper.prototype.CopyAELToSEL = function() {
          var e = this.m_ActiveEdges;
          this.m_SortedEdges = e;
          while (e !== null) {
            e.PrevInSEL = e.PrevInAEL;
            e.NextInSEL = e.NextInAEL;
            e = e.NextInAEL;
          }
        };
        ClipperLib2.Clipper.prototype.SwapPositionsInSEL = function(edge1, edge2) {
          if (edge1.NextInSEL === null && edge1.PrevInSEL === null)
            return;
          if (edge2.NextInSEL === null && edge2.PrevInSEL === null)
            return;
          if (edge1.NextInSEL === edge2) {
            var next = edge2.NextInSEL;
            if (next !== null)
              next.PrevInSEL = edge1;
            var prev = edge1.PrevInSEL;
            if (prev !== null)
              prev.NextInSEL = edge2;
            edge2.PrevInSEL = prev;
            edge2.NextInSEL = edge1;
            edge1.PrevInSEL = edge2;
            edge1.NextInSEL = next;
          } else if (edge2.NextInSEL === edge1) {
            var next = edge1.NextInSEL;
            if (next !== null)
              next.PrevInSEL = edge2;
            var prev = edge2.PrevInSEL;
            if (prev !== null)
              prev.NextInSEL = edge1;
            edge1.PrevInSEL = prev;
            edge1.NextInSEL = edge2;
            edge2.PrevInSEL = edge1;
            edge2.NextInSEL = next;
          } else {
            var next = edge1.NextInSEL;
            var prev = edge1.PrevInSEL;
            edge1.NextInSEL = edge2.NextInSEL;
            if (edge1.NextInSEL !== null)
              edge1.NextInSEL.PrevInSEL = edge1;
            edge1.PrevInSEL = edge2.PrevInSEL;
            if (edge1.PrevInSEL !== null)
              edge1.PrevInSEL.NextInSEL = edge1;
            edge2.NextInSEL = next;
            if (edge2.NextInSEL !== null)
              edge2.NextInSEL.PrevInSEL = edge2;
            edge2.PrevInSEL = prev;
            if (edge2.PrevInSEL !== null)
              edge2.PrevInSEL.NextInSEL = edge2;
          }
          if (edge1.PrevInSEL === null)
            this.m_SortedEdges = edge1;
          else if (edge2.PrevInSEL === null)
            this.m_SortedEdges = edge2;
        };
        ClipperLib2.Clipper.prototype.AddLocalMaxPoly = function(e1, e2, pt) {
          this.AddOutPt(e1, pt);
          if (e2.WindDelta === 0) this.AddOutPt(e2, pt);
          if (e1.OutIdx === e2.OutIdx) {
            e1.OutIdx = -1;
            e2.OutIdx = -1;
          } else if (e1.OutIdx < e2.OutIdx)
            this.AppendPolygon(e1, e2);
          else
            this.AppendPolygon(e2, e1);
        };
        ClipperLib2.Clipper.prototype.AddLocalMinPoly = function(e1, e2, pt) {
          var result;
          var e, prevE;
          if (ClipperLib2.ClipperBase.IsHorizontal(e2) || e1.Dx > e2.Dx) {
            result = this.AddOutPt(e1, pt);
            e2.OutIdx = e1.OutIdx;
            e1.Side = ClipperLib2.EdgeSide.esLeft;
            e2.Side = ClipperLib2.EdgeSide.esRight;
            e = e1;
            if (e.PrevInAEL === e2)
              prevE = e2.PrevInAEL;
            else
              prevE = e.PrevInAEL;
          } else {
            result = this.AddOutPt(e2, pt);
            e1.OutIdx = e2.OutIdx;
            e1.Side = ClipperLib2.EdgeSide.esRight;
            e2.Side = ClipperLib2.EdgeSide.esLeft;
            e = e2;
            if (e.PrevInAEL === e1)
              prevE = e1.PrevInAEL;
            else
              prevE = e.PrevInAEL;
          }
          if (prevE !== null && prevE.OutIdx >= 0 && prevE.Top.Y < pt.Y && e.Top.Y < pt.Y) {
            var xPrev = ClipperLib2.Clipper.TopX(prevE, pt.Y);
            var xE = ClipperLib2.Clipper.TopX(e, pt.Y);
            if (xPrev === xE && e.WindDelta !== 0 && prevE.WindDelta !== 0 && ClipperLib2.ClipperBase.SlopesEqual5(new ClipperLib2.IntPoint2(xPrev, pt.Y), prevE.Top, new ClipperLib2.IntPoint2(xE, pt.Y), e.Top, this.m_UseFullRange)) {
              var outPt = this.AddOutPt(prevE, pt);
              this.AddJoin(result, outPt, e.Top);
            }
          }
          return result;
        };
        ClipperLib2.Clipper.prototype.AddOutPt = function(e, pt) {
          if (e.OutIdx < 0) {
            var outRec = this.CreateOutRec();
            outRec.IsOpen = e.WindDelta === 0;
            var newOp = new ClipperLib2.OutPt();
            outRec.Pts = newOp;
            newOp.Idx = outRec.Idx;
            newOp.Pt.X = pt.X;
            newOp.Pt.Y = pt.Y;
            if (ClipperLib2.use_xyz) newOp.Pt.Z = pt.Z;
            newOp.Next = newOp;
            newOp.Prev = newOp;
            if (!outRec.IsOpen)
              this.SetHoleState(e, outRec);
            e.OutIdx = outRec.Idx;
            return newOp;
          } else {
            var outRec = this.m_PolyOuts[e.OutIdx];
            var op = outRec.Pts;
            var ToFront = e.Side === ClipperLib2.EdgeSide.esLeft;
            if (ToFront && ClipperLib2.IntPoint.op_Equality(pt, op.Pt))
              return op;
            else if (!ToFront && ClipperLib2.IntPoint.op_Equality(pt, op.Prev.Pt))
              return op.Prev;
            var newOp = new ClipperLib2.OutPt();
            newOp.Idx = outRec.Idx;
            newOp.Pt.X = pt.X;
            newOp.Pt.Y = pt.Y;
            if (ClipperLib2.use_xyz) newOp.Pt.Z = pt.Z;
            newOp.Next = op;
            newOp.Prev = op.Prev;
            newOp.Prev.Next = newOp;
            op.Prev = newOp;
            if (ToFront)
              outRec.Pts = newOp;
            return newOp;
          }
        };
        ClipperLib2.Clipper.prototype.GetLastOutPt = function(e) {
          var outRec = this.m_PolyOuts[e.OutIdx];
          if (e.Side === ClipperLib2.EdgeSide.esLeft) {
            return outRec.Pts;
          } else {
            return outRec.Pts.Prev;
          }
        };
        ClipperLib2.Clipper.prototype.SwapPoints = function(pt1, pt2) {
          var tmp = new ClipperLib2.IntPoint1(pt1.Value);
          pt1.Value.X = pt2.Value.X;
          pt1.Value.Y = pt2.Value.Y;
          if (ClipperLib2.use_xyz) pt1.Value.Z = pt2.Value.Z;
          pt2.Value.X = tmp.X;
          pt2.Value.Y = tmp.Y;
          if (ClipperLib2.use_xyz) pt2.Value.Z = tmp.Z;
        };
        ClipperLib2.Clipper.prototype.HorzSegmentsOverlap = function(seg1a, seg1b, seg2a, seg2b) {
          var tmp;
          if (seg1a > seg1b) {
            tmp = seg1a;
            seg1a = seg1b;
            seg1b = tmp;
          }
          if (seg2a > seg2b) {
            tmp = seg2a;
            seg2a = seg2b;
            seg2b = tmp;
          }
          return seg1a < seg2b && seg2a < seg1b;
        };
        ClipperLib2.Clipper.prototype.SetHoleState = function(e, outRec) {
          var e2 = e.PrevInAEL;
          var eTmp = null;
          while (e2 !== null) {
            if (e2.OutIdx >= 0 && e2.WindDelta !== 0) {
              if (eTmp === null)
                eTmp = e2;
              else if (eTmp.OutIdx === e2.OutIdx)
                eTmp = null;
            }
            e2 = e2.PrevInAEL;
          }
          if (eTmp === null) {
            outRec.FirstLeft = null;
            outRec.IsHole = false;
          } else {
            outRec.FirstLeft = this.m_PolyOuts[eTmp.OutIdx];
            outRec.IsHole = !outRec.FirstLeft.IsHole;
          }
        };
        ClipperLib2.Clipper.prototype.GetDx = function(pt1, pt2) {
          if (pt1.Y === pt2.Y)
            return ClipperLib2.ClipperBase.horizontal;
          else
            return (pt2.X - pt1.X) / (pt2.Y - pt1.Y);
        };
        ClipperLib2.Clipper.prototype.FirstIsBottomPt = function(btmPt1, btmPt2) {
          var p = btmPt1.Prev;
          while (ClipperLib2.IntPoint.op_Equality(p.Pt, btmPt1.Pt) && p !== btmPt1)
            p = p.Prev;
          var dx1p = Math.abs(this.GetDx(btmPt1.Pt, p.Pt));
          p = btmPt1.Next;
          while (ClipperLib2.IntPoint.op_Equality(p.Pt, btmPt1.Pt) && p !== btmPt1)
            p = p.Next;
          var dx1n = Math.abs(this.GetDx(btmPt1.Pt, p.Pt));
          p = btmPt2.Prev;
          while (ClipperLib2.IntPoint.op_Equality(p.Pt, btmPt2.Pt) && p !== btmPt2)
            p = p.Prev;
          var dx2p = Math.abs(this.GetDx(btmPt2.Pt, p.Pt));
          p = btmPt2.Next;
          while (ClipperLib2.IntPoint.op_Equality(p.Pt, btmPt2.Pt) && p !== btmPt2)
            p = p.Next;
          var dx2n = Math.abs(this.GetDx(btmPt2.Pt, p.Pt));
          if (Math.max(dx1p, dx1n) === Math.max(dx2p, dx2n) && Math.min(dx1p, dx1n) === Math.min(dx2p, dx2n)) {
            return this.Area(btmPt1) > 0;
          } else {
            return dx1p >= dx2p && dx1p >= dx2n || dx1n >= dx2p && dx1n >= dx2n;
          }
        };
        ClipperLib2.Clipper.prototype.GetBottomPt = function(pp) {
          var dups = null;
          var p = pp.Next;
          while (p !== pp) {
            if (p.Pt.Y > pp.Pt.Y) {
              pp = p;
              dups = null;
            } else if (p.Pt.Y === pp.Pt.Y && p.Pt.X <= pp.Pt.X) {
              if (p.Pt.X < pp.Pt.X) {
                dups = null;
                pp = p;
              } else {
                if (p.Next !== pp && p.Prev !== pp)
                  dups = p;
              }
            }
            p = p.Next;
          }
          if (dups !== null) {
            while (dups !== p) {
              if (!this.FirstIsBottomPt(p, dups))
                pp = dups;
              dups = dups.Next;
              while (ClipperLib2.IntPoint.op_Inequality(dups.Pt, pp.Pt))
                dups = dups.Next;
            }
          }
          return pp;
        };
        ClipperLib2.Clipper.prototype.GetLowermostRec = function(outRec1, outRec2) {
          if (outRec1.BottomPt === null)
            outRec1.BottomPt = this.GetBottomPt(outRec1.Pts);
          if (outRec2.BottomPt === null)
            outRec2.BottomPt = this.GetBottomPt(outRec2.Pts);
          var bPt1 = outRec1.BottomPt;
          var bPt2 = outRec2.BottomPt;
          if (bPt1.Pt.Y > bPt2.Pt.Y)
            return outRec1;
          else if (bPt1.Pt.Y < bPt2.Pt.Y)
            return outRec2;
          else if (bPt1.Pt.X < bPt2.Pt.X)
            return outRec1;
          else if (bPt1.Pt.X > bPt2.Pt.X)
            return outRec2;
          else if (bPt1.Next === bPt1)
            return outRec2;
          else if (bPt2.Next === bPt2)
            return outRec1;
          else if (this.FirstIsBottomPt(bPt1, bPt2))
            return outRec1;
          else
            return outRec2;
        };
        ClipperLib2.Clipper.prototype.OutRec1RightOfOutRec2 = function(outRec1, outRec2) {
          do {
            outRec1 = outRec1.FirstLeft;
            if (outRec1 === outRec2)
              return true;
          } while (outRec1 !== null);
          return false;
        };
        ClipperLib2.Clipper.prototype.GetOutRec = function(idx) {
          var outrec = this.m_PolyOuts[idx];
          while (outrec !== this.m_PolyOuts[outrec.Idx])
            outrec = this.m_PolyOuts[outrec.Idx];
          return outrec;
        };
        ClipperLib2.Clipper.prototype.AppendPolygon = function(e1, e2) {
          var outRec1 = this.m_PolyOuts[e1.OutIdx];
          var outRec2 = this.m_PolyOuts[e2.OutIdx];
          var holeStateRec;
          if (this.OutRec1RightOfOutRec2(outRec1, outRec2))
            holeStateRec = outRec2;
          else if (this.OutRec1RightOfOutRec2(outRec2, outRec1))
            holeStateRec = outRec1;
          else
            holeStateRec = this.GetLowermostRec(outRec1, outRec2);
          var p1_lft = outRec1.Pts;
          var p1_rt = p1_lft.Prev;
          var p2_lft = outRec2.Pts;
          var p2_rt = p2_lft.Prev;
          if (e1.Side === ClipperLib2.EdgeSide.esLeft) {
            if (e2.Side === ClipperLib2.EdgeSide.esLeft) {
              this.ReversePolyPtLinks(p2_lft);
              p2_lft.Next = p1_lft;
              p1_lft.Prev = p2_lft;
              p1_rt.Next = p2_rt;
              p2_rt.Prev = p1_rt;
              outRec1.Pts = p2_rt;
            } else {
              p2_rt.Next = p1_lft;
              p1_lft.Prev = p2_rt;
              p2_lft.Prev = p1_rt;
              p1_rt.Next = p2_lft;
              outRec1.Pts = p2_lft;
            }
          } else {
            if (e2.Side === ClipperLib2.EdgeSide.esRight) {
              this.ReversePolyPtLinks(p2_lft);
              p1_rt.Next = p2_rt;
              p2_rt.Prev = p1_rt;
              p2_lft.Next = p1_lft;
              p1_lft.Prev = p2_lft;
            } else {
              p1_rt.Next = p2_lft;
              p2_lft.Prev = p1_rt;
              p1_lft.Prev = p2_rt;
              p2_rt.Next = p1_lft;
            }
          }
          outRec1.BottomPt = null;
          if (holeStateRec === outRec2) {
            if (outRec2.FirstLeft !== outRec1)
              outRec1.FirstLeft = outRec2.FirstLeft;
            outRec1.IsHole = outRec2.IsHole;
          }
          outRec2.Pts = null;
          outRec2.BottomPt = null;
          outRec2.FirstLeft = outRec1;
          var OKIdx = e1.OutIdx;
          var ObsoleteIdx = e2.OutIdx;
          e1.OutIdx = -1;
          e2.OutIdx = -1;
          var e = this.m_ActiveEdges;
          while (e !== null) {
            if (e.OutIdx === ObsoleteIdx) {
              e.OutIdx = OKIdx;
              e.Side = e1.Side;
              break;
            }
            e = e.NextInAEL;
          }
          outRec2.Idx = outRec1.Idx;
        };
        ClipperLib2.Clipper.prototype.ReversePolyPtLinks = function(pp) {
          if (pp === null)
            return;
          var pp1;
          var pp2;
          pp1 = pp;
          do {
            pp2 = pp1.Next;
            pp1.Next = pp1.Prev;
            pp1.Prev = pp2;
            pp1 = pp2;
          } while (pp1 !== pp);
        };
        ClipperLib2.Clipper.SwapSides = function(edge1, edge2) {
          var side = edge1.Side;
          edge1.Side = edge2.Side;
          edge2.Side = side;
        };
        ClipperLib2.Clipper.SwapPolyIndexes = function(edge1, edge2) {
          var outIdx = edge1.OutIdx;
          edge1.OutIdx = edge2.OutIdx;
          edge2.OutIdx = outIdx;
        };
        ClipperLib2.Clipper.prototype.IntersectEdges = function(e1, e2, pt) {
          var e1Contributing = e1.OutIdx >= 0;
          var e2Contributing = e2.OutIdx >= 0;
          if (ClipperLib2.use_xyz)
            this.SetZ(pt, e1, e2);
          if (ClipperLib2.use_lines) {
            if (e1.WindDelta === 0 || e2.WindDelta === 0) {
              if (e1.WindDelta === 0 && e2.WindDelta === 0) return;
              else if (e1.PolyTyp === e2.PolyTyp && e1.WindDelta !== e2.WindDelta && this.m_ClipType === ClipperLib2.ClipType.ctUnion) {
                if (e1.WindDelta === 0) {
                  if (e2Contributing) {
                    this.AddOutPt(e1, pt);
                    if (e1Contributing)
                      e1.OutIdx = -1;
                  }
                } else {
                  if (e1Contributing) {
                    this.AddOutPt(e2, pt);
                    if (e2Contributing)
                      e2.OutIdx = -1;
                  }
                }
              } else if (e1.PolyTyp !== e2.PolyTyp) {
                if (e1.WindDelta === 0 && Math.abs(e2.WindCnt) === 1 && (this.m_ClipType !== ClipperLib2.ClipType.ctUnion || e2.WindCnt2 === 0)) {
                  this.AddOutPt(e1, pt);
                  if (e1Contributing)
                    e1.OutIdx = -1;
                } else if (e2.WindDelta === 0 && Math.abs(e1.WindCnt) === 1 && (this.m_ClipType !== ClipperLib2.ClipType.ctUnion || e1.WindCnt2 === 0)) {
                  this.AddOutPt(e2, pt);
                  if (e2Contributing)
                    e2.OutIdx = -1;
                }
              }
              return;
            }
          }
          if (e1.PolyTyp === e2.PolyTyp) {
            if (this.IsEvenOddFillType(e1)) {
              var oldE1WindCnt = e1.WindCnt;
              e1.WindCnt = e2.WindCnt;
              e2.WindCnt = oldE1WindCnt;
            } else {
              if (e1.WindCnt + e2.WindDelta === 0)
                e1.WindCnt = -e1.WindCnt;
              else
                e1.WindCnt += e2.WindDelta;
              if (e2.WindCnt - e1.WindDelta === 0)
                e2.WindCnt = -e2.WindCnt;
              else
                e2.WindCnt -= e1.WindDelta;
            }
          } else {
            if (!this.IsEvenOddFillType(e2))
              e1.WindCnt2 += e2.WindDelta;
            else
              e1.WindCnt2 = e1.WindCnt2 === 0 ? 1 : 0;
            if (!this.IsEvenOddFillType(e1))
              e2.WindCnt2 -= e1.WindDelta;
            else
              e2.WindCnt2 = e2.WindCnt2 === 0 ? 1 : 0;
          }
          var e1FillType, e2FillType, e1FillType2, e2FillType2;
          if (e1.PolyTyp === ClipperLib2.PolyType.ptSubject) {
            e1FillType = this.m_SubjFillType;
            e1FillType2 = this.m_ClipFillType;
          } else {
            e1FillType = this.m_ClipFillType;
            e1FillType2 = this.m_SubjFillType;
          }
          if (e2.PolyTyp === ClipperLib2.PolyType.ptSubject) {
            e2FillType = this.m_SubjFillType;
            e2FillType2 = this.m_ClipFillType;
          } else {
            e2FillType = this.m_ClipFillType;
            e2FillType2 = this.m_SubjFillType;
          }
          var e1Wc, e2Wc;
          switch (e1FillType) {
            case ClipperLib2.PolyFillType.pftPositive:
              e1Wc = e1.WindCnt;
              break;
            case ClipperLib2.PolyFillType.pftNegative:
              e1Wc = -e1.WindCnt;
              break;
            default:
              e1Wc = Math.abs(e1.WindCnt);
              break;
          }
          switch (e2FillType) {
            case ClipperLib2.PolyFillType.pftPositive:
              e2Wc = e2.WindCnt;
              break;
            case ClipperLib2.PolyFillType.pftNegative:
              e2Wc = -e2.WindCnt;
              break;
            default:
              e2Wc = Math.abs(e2.WindCnt);
              break;
          }
          if (e1Contributing && e2Contributing) {
            if (e1Wc !== 0 && e1Wc !== 1 || e2Wc !== 0 && e2Wc !== 1 || e1.PolyTyp !== e2.PolyTyp && this.m_ClipType !== ClipperLib2.ClipType.ctXor) {
              this.AddLocalMaxPoly(e1, e2, pt);
            } else {
              this.AddOutPt(e1, pt);
              this.AddOutPt(e2, pt);
              ClipperLib2.Clipper.SwapSides(e1, e2);
              ClipperLib2.Clipper.SwapPolyIndexes(e1, e2);
            }
          } else if (e1Contributing) {
            if (e2Wc === 0 || e2Wc === 1) {
              this.AddOutPt(e1, pt);
              ClipperLib2.Clipper.SwapSides(e1, e2);
              ClipperLib2.Clipper.SwapPolyIndexes(e1, e2);
            }
          } else if (e2Contributing) {
            if (e1Wc === 0 || e1Wc === 1) {
              this.AddOutPt(e2, pt);
              ClipperLib2.Clipper.SwapSides(e1, e2);
              ClipperLib2.Clipper.SwapPolyIndexes(e1, e2);
            }
          } else if ((e1Wc === 0 || e1Wc === 1) && (e2Wc === 0 || e2Wc === 1)) {
            var e1Wc2, e2Wc2;
            switch (e1FillType2) {
              case ClipperLib2.PolyFillType.pftPositive:
                e1Wc2 = e1.WindCnt2;
                break;
              case ClipperLib2.PolyFillType.pftNegative:
                e1Wc2 = -e1.WindCnt2;
                break;
              default:
                e1Wc2 = Math.abs(e1.WindCnt2);
                break;
            }
            switch (e2FillType2) {
              case ClipperLib2.PolyFillType.pftPositive:
                e2Wc2 = e2.WindCnt2;
                break;
              case ClipperLib2.PolyFillType.pftNegative:
                e2Wc2 = -e2.WindCnt2;
                break;
              default:
                e2Wc2 = Math.abs(e2.WindCnt2);
                break;
            }
            if (e1.PolyTyp !== e2.PolyTyp) {
              this.AddLocalMinPoly(e1, e2, pt);
            } else if (e1Wc === 1 && e2Wc === 1)
              switch (this.m_ClipType) {
                case ClipperLib2.ClipType.ctIntersection:
                  if (e1Wc2 > 0 && e2Wc2 > 0)
                    this.AddLocalMinPoly(e1, e2, pt);
                  break;
                case ClipperLib2.ClipType.ctUnion:
                  if (e1Wc2 <= 0 && e2Wc2 <= 0)
                    this.AddLocalMinPoly(e1, e2, pt);
                  break;
                case ClipperLib2.ClipType.ctDifference:
                  if (e1.PolyTyp === ClipperLib2.PolyType.ptClip && e1Wc2 > 0 && e2Wc2 > 0 || e1.PolyTyp === ClipperLib2.PolyType.ptSubject && e1Wc2 <= 0 && e2Wc2 <= 0)
                    this.AddLocalMinPoly(e1, e2, pt);
                  break;
                case ClipperLib2.ClipType.ctXor:
                  this.AddLocalMinPoly(e1, e2, pt);
                  break;
              }
            else
              ClipperLib2.Clipper.SwapSides(e1, e2);
          }
        };
        ClipperLib2.Clipper.prototype.DeleteFromSEL = function(e) {
          var SelPrev = e.PrevInSEL;
          var SelNext = e.NextInSEL;
          if (SelPrev === null && SelNext === null && e !== this.m_SortedEdges)
            return;
          if (SelPrev !== null)
            SelPrev.NextInSEL = SelNext;
          else
            this.m_SortedEdges = SelNext;
          if (SelNext !== null)
            SelNext.PrevInSEL = SelPrev;
          e.NextInSEL = null;
          e.PrevInSEL = null;
        };
        ClipperLib2.Clipper.prototype.ProcessHorizontals = function() {
          var horzEdge = {};
          while (this.PopEdgeFromSEL(horzEdge)) {
            this.ProcessHorizontal(horzEdge.v);
          }
        };
        ClipperLib2.Clipper.prototype.GetHorzDirection = function(HorzEdge, $var) {
          if (HorzEdge.Bot.X < HorzEdge.Top.X) {
            $var.Left = HorzEdge.Bot.X;
            $var.Right = HorzEdge.Top.X;
            $var.Dir = ClipperLib2.Direction.dLeftToRight;
          } else {
            $var.Left = HorzEdge.Top.X;
            $var.Right = HorzEdge.Bot.X;
            $var.Dir = ClipperLib2.Direction.dRightToLeft;
          }
        };
        ClipperLib2.Clipper.prototype.ProcessHorizontal = function(horzEdge) {
          var $var = {
            Dir: null,
            Left: null,
            Right: null
          };
          this.GetHorzDirection(horzEdge, $var);
          var dir = $var.Dir;
          var horzLeft = $var.Left;
          var horzRight = $var.Right;
          var IsOpen = horzEdge.WindDelta === 0;
          var eLastHorz = horzEdge, eMaxPair = null;
          while (eLastHorz.NextInLML !== null && ClipperLib2.ClipperBase.IsHorizontal(eLastHorz.NextInLML))
            eLastHorz = eLastHorz.NextInLML;
          if (eLastHorz.NextInLML === null)
            eMaxPair = this.GetMaximaPair(eLastHorz);
          var currMax = this.m_Maxima;
          if (currMax !== null) {
            if (dir === ClipperLib2.Direction.dLeftToRight) {
              while (currMax !== null && currMax.X <= horzEdge.Bot.X) {
                currMax = currMax.Next;
              }
              if (currMax !== null && currMax.X >= eLastHorz.Top.X) {
                currMax = null;
              }
            } else {
              while (currMax.Next !== null && currMax.Next.X < horzEdge.Bot.X) {
                currMax = currMax.Next;
              }
              if (currMax.X <= eLastHorz.Top.X) {
                currMax = null;
              }
            }
          }
          var op1 = null;
          for (; ; ) {
            var IsLastHorz = horzEdge === eLastHorz;
            var e = this.GetNextInAEL(horzEdge, dir);
            while (e !== null) {
              if (currMax !== null) {
                if (dir === ClipperLib2.Direction.dLeftToRight) {
                  while (currMax !== null && currMax.X < e.Curr.X) {
                    if (horzEdge.OutIdx >= 0 && !IsOpen) {
                      this.AddOutPt(horzEdge, new ClipperLib2.IntPoint2(currMax.X, horzEdge.Bot.Y));
                    }
                    currMax = currMax.Next;
                  }
                } else {
                  while (currMax !== null && currMax.X > e.Curr.X) {
                    if (horzEdge.OutIdx >= 0 && !IsOpen) {
                      this.AddOutPt(horzEdge, new ClipperLib2.IntPoint2(currMax.X, horzEdge.Bot.Y));
                    }
                    currMax = currMax.Prev;
                  }
                }
              }
              if (dir === ClipperLib2.Direction.dLeftToRight && e.Curr.X > horzRight || dir === ClipperLib2.Direction.dRightToLeft && e.Curr.X < horzLeft) {
                break;
              }
              if (e.Curr.X === horzEdge.Top.X && horzEdge.NextInLML !== null && e.Dx < horzEdge.NextInLML.Dx)
                break;
              if (horzEdge.OutIdx >= 0 && !IsOpen) {
                if (ClipperLib2.use_xyz) {
                  if (dir === ClipperLib2.Direction.dLeftToRight)
                    this.SetZ(e.Curr, horzEdge, e);
                  else this.SetZ(e.Curr, e, horzEdge);
                }
                op1 = this.AddOutPt(horzEdge, e.Curr);
                var eNextHorz = this.m_SortedEdges;
                while (eNextHorz !== null) {
                  if (eNextHorz.OutIdx >= 0 && this.HorzSegmentsOverlap(horzEdge.Bot.X, horzEdge.Top.X, eNextHorz.Bot.X, eNextHorz.Top.X)) {
                    var op2 = this.GetLastOutPt(eNextHorz);
                    this.AddJoin(op2, op1, eNextHorz.Top);
                  }
                  eNextHorz = eNextHorz.NextInSEL;
                }
                this.AddGhostJoin(op1, horzEdge.Bot);
              }
              if (e === eMaxPair && IsLastHorz) {
                if (horzEdge.OutIdx >= 0) {
                  this.AddLocalMaxPoly(horzEdge, eMaxPair, horzEdge.Top);
                }
                this.DeleteFromAEL(horzEdge);
                this.DeleteFromAEL(eMaxPair);
                return;
              }
              if (dir === ClipperLib2.Direction.dLeftToRight) {
                var Pt = new ClipperLib2.IntPoint2(e.Curr.X, horzEdge.Curr.Y);
                this.IntersectEdges(horzEdge, e, Pt);
              } else {
                var Pt = new ClipperLib2.IntPoint2(e.Curr.X, horzEdge.Curr.Y);
                this.IntersectEdges(e, horzEdge, Pt);
              }
              var eNext = this.GetNextInAEL(e, dir);
              this.SwapPositionsInAEL(horzEdge, e);
              e = eNext;
            }
            if (horzEdge.NextInLML === null || !ClipperLib2.ClipperBase.IsHorizontal(horzEdge.NextInLML)) {
              break;
            }
            horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
            if (horzEdge.OutIdx >= 0) {
              this.AddOutPt(horzEdge, horzEdge.Bot);
            }
            $var = {
              Dir: dir,
              Left: horzLeft,
              Right: horzRight
            };
            this.GetHorzDirection(horzEdge, $var);
            dir = $var.Dir;
            horzLeft = $var.Left;
            horzRight = $var.Right;
          }
          if (horzEdge.OutIdx >= 0 && op1 === null) {
            op1 = this.GetLastOutPt(horzEdge);
            var eNextHorz = this.m_SortedEdges;
            while (eNextHorz !== null) {
              if (eNextHorz.OutIdx >= 0 && this.HorzSegmentsOverlap(horzEdge.Bot.X, horzEdge.Top.X, eNextHorz.Bot.X, eNextHorz.Top.X)) {
                var op2 = this.GetLastOutPt(eNextHorz);
                this.AddJoin(op2, op1, eNextHorz.Top);
              }
              eNextHorz = eNextHorz.NextInSEL;
            }
            this.AddGhostJoin(op1, horzEdge.Top);
          }
          if (horzEdge.NextInLML !== null) {
            if (horzEdge.OutIdx >= 0) {
              op1 = this.AddOutPt(horzEdge, horzEdge.Top);
              horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
              if (horzEdge.WindDelta === 0) {
                return;
              }
              var ePrev = horzEdge.PrevInAEL;
              var eNext = horzEdge.NextInAEL;
              if (ePrev !== null && ePrev.Curr.X === horzEdge.Bot.X && ePrev.Curr.Y === horzEdge.Bot.Y && ePrev.WindDelta === 0 && (ePrev.OutIdx >= 0 && ePrev.Curr.Y > ePrev.Top.Y && ClipperLib2.ClipperBase.SlopesEqual3(horzEdge, ePrev, this.m_UseFullRange))) {
                var op2 = this.AddOutPt(ePrev, horzEdge.Bot);
                this.AddJoin(op1, op2, horzEdge.Top);
              } else if (eNext !== null && eNext.Curr.X === horzEdge.Bot.X && eNext.Curr.Y === horzEdge.Bot.Y && eNext.WindDelta !== 0 && eNext.OutIdx >= 0 && eNext.Curr.Y > eNext.Top.Y && ClipperLib2.ClipperBase.SlopesEqual3(horzEdge, eNext, this.m_UseFullRange)) {
                var op2 = this.AddOutPt(eNext, horzEdge.Bot);
                this.AddJoin(op1, op2, horzEdge.Top);
              }
            } else {
              horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
            }
          } else {
            if (horzEdge.OutIdx >= 0) {
              this.AddOutPt(horzEdge, horzEdge.Top);
            }
            this.DeleteFromAEL(horzEdge);
          }
        };
        ClipperLib2.Clipper.prototype.GetNextInAEL = function(e, Direction) {
          return Direction === ClipperLib2.Direction.dLeftToRight ? e.NextInAEL : e.PrevInAEL;
        };
        ClipperLib2.Clipper.prototype.IsMinima = function(e) {
          return e !== null && e.Prev.NextInLML !== e && e.Next.NextInLML !== e;
        };
        ClipperLib2.Clipper.prototype.IsMaxima = function(e, Y) {
          return e !== null && e.Top.Y === Y && e.NextInLML === null;
        };
        ClipperLib2.Clipper.prototype.IsIntermediate = function(e, Y) {
          return e.Top.Y === Y && e.NextInLML !== null;
        };
        ClipperLib2.Clipper.prototype.GetMaximaPair = function(e) {
          if (ClipperLib2.IntPoint.op_Equality(e.Next.Top, e.Top) && e.Next.NextInLML === null) {
            return e.Next;
          } else {
            if (ClipperLib2.IntPoint.op_Equality(e.Prev.Top, e.Top) && e.Prev.NextInLML === null) {
              return e.Prev;
            } else {
              return null;
            }
          }
        };
        ClipperLib2.Clipper.prototype.GetMaximaPairEx = function(e) {
          var result = this.GetMaximaPair(e);
          if (result === null || result.OutIdx === ClipperLib2.ClipperBase.Skip || result.NextInAEL === result.PrevInAEL && !ClipperLib2.ClipperBase.IsHorizontal(result)) {
            return null;
          }
          return result;
        };
        ClipperLib2.Clipper.prototype.ProcessIntersections = function(topY) {
          if (this.m_ActiveEdges === null)
            return true;
          try {
            this.BuildIntersectList(topY);
            if (this.m_IntersectList.length === 0)
              return true;
            if (this.m_IntersectList.length === 1 || this.FixupIntersectionOrder())
              this.ProcessIntersectList();
            else
              return false;
          } catch ($$e2) {
            this.m_SortedEdges = null;
            this.m_IntersectList.length = 0;
            ClipperLib2.Error("ProcessIntersections error");
          }
          this.m_SortedEdges = null;
          return true;
        };
        ClipperLib2.Clipper.prototype.BuildIntersectList = function(topY) {
          if (this.m_ActiveEdges === null)
            return;
          var e = this.m_ActiveEdges;
          this.m_SortedEdges = e;
          while (e !== null) {
            e.PrevInSEL = e.PrevInAEL;
            e.NextInSEL = e.NextInAEL;
            e.Curr.X = ClipperLib2.Clipper.TopX(e, topY);
            e = e.NextInAEL;
          }
          var isModified = true;
          while (isModified && this.m_SortedEdges !== null) {
            isModified = false;
            e = this.m_SortedEdges;
            while (e.NextInSEL !== null) {
              var eNext = e.NextInSEL;
              var pt = new ClipperLib2.IntPoint0();
              if (e.Curr.X > eNext.Curr.X) {
                this.IntersectPoint(e, eNext, pt);
                if (pt.Y < topY) {
                  pt = new ClipperLib2.IntPoint2(ClipperLib2.Clipper.TopX(e, topY), topY);
                }
                var newNode = new ClipperLib2.IntersectNode();
                newNode.Edge1 = e;
                newNode.Edge2 = eNext;
                newNode.Pt.X = pt.X;
                newNode.Pt.Y = pt.Y;
                if (ClipperLib2.use_xyz) newNode.Pt.Z = pt.Z;
                this.m_IntersectList.push(newNode);
                this.SwapPositionsInSEL(e, eNext);
                isModified = true;
              } else
                e = eNext;
            }
            if (e.PrevInSEL !== null)
              e.PrevInSEL.NextInSEL = null;
            else
              break;
          }
          this.m_SortedEdges = null;
        };
        ClipperLib2.Clipper.prototype.EdgesAdjacent = function(inode) {
          return inode.Edge1.NextInSEL === inode.Edge2 || inode.Edge1.PrevInSEL === inode.Edge2;
        };
        ClipperLib2.Clipper.IntersectNodeSort = function(node1, node2) {
          return node2.Pt.Y - node1.Pt.Y;
        };
        ClipperLib2.Clipper.prototype.FixupIntersectionOrder = function() {
          this.m_IntersectList.sort(this.m_IntersectNodeComparer);
          this.CopyAELToSEL();
          var cnt = this.m_IntersectList.length;
          for (var i = 0; i < cnt; i++) {
            if (!this.EdgesAdjacent(this.m_IntersectList[i])) {
              var j = i + 1;
              while (j < cnt && !this.EdgesAdjacent(this.m_IntersectList[j]))
                j++;
              if (j === cnt)
                return false;
              var tmp = this.m_IntersectList[i];
              this.m_IntersectList[i] = this.m_IntersectList[j];
              this.m_IntersectList[j] = tmp;
            }
            this.SwapPositionsInSEL(this.m_IntersectList[i].Edge1, this.m_IntersectList[i].Edge2);
          }
          return true;
        };
        ClipperLib2.Clipper.prototype.ProcessIntersectList = function() {
          for (var i = 0, ilen = this.m_IntersectList.length; i < ilen; i++) {
            var iNode = this.m_IntersectList[i];
            this.IntersectEdges(iNode.Edge1, iNode.Edge2, iNode.Pt);
            this.SwapPositionsInAEL(iNode.Edge1, iNode.Edge2);
          }
          this.m_IntersectList.length = 0;
        };
        var R1 = function(a) {
          return a < 0 ? Math.ceil(a - 0.5) : Math.round(a);
        };
        var R2 = function(a) {
          return a < 0 ? Math.ceil(a - 0.5) : Math.floor(a + 0.5);
        };
        var R3 = function(a) {
          return a < 0 ? -Math.round(Math.abs(a)) : Math.round(a);
        };
        var R4 = function(a) {
          if (a < 0) {
            a -= 0.5;
            return a < -2147483648 ? Math.ceil(a) : a | 0;
          } else {
            a += 0.5;
            return a > 2147483647 ? Math.floor(a) : a | 0;
          }
        };
        if (browser.msie) ClipperLib2.Clipper.Round = R1;
        else if (browser.chromium) ClipperLib2.Clipper.Round = R3;
        else if (browser.safari) ClipperLib2.Clipper.Round = R4;
        else ClipperLib2.Clipper.Round = R2;
        ClipperLib2.Clipper.TopX = function(edge, currentY) {
          if (currentY === edge.Top.Y)
            return edge.Top.X;
          return edge.Bot.X + ClipperLib2.Clipper.Round(edge.Dx * (currentY - edge.Bot.Y));
        };
        ClipperLib2.Clipper.prototype.IntersectPoint = function(edge1, edge2, ip) {
          ip.X = 0;
          ip.Y = 0;
          var b1, b2;
          if (edge1.Dx === edge2.Dx) {
            ip.Y = edge1.Curr.Y;
            ip.X = ClipperLib2.Clipper.TopX(edge1, ip.Y);
            return;
          }
          if (edge1.Delta.X === 0) {
            ip.X = edge1.Bot.X;
            if (ClipperLib2.ClipperBase.IsHorizontal(edge2)) {
              ip.Y = edge2.Bot.Y;
            } else {
              b2 = edge2.Bot.Y - edge2.Bot.X / edge2.Dx;
              ip.Y = ClipperLib2.Clipper.Round(ip.X / edge2.Dx + b2);
            }
          } else if (edge2.Delta.X === 0) {
            ip.X = edge2.Bot.X;
            if (ClipperLib2.ClipperBase.IsHorizontal(edge1)) {
              ip.Y = edge1.Bot.Y;
            } else {
              b1 = edge1.Bot.Y - edge1.Bot.X / edge1.Dx;
              ip.Y = ClipperLib2.Clipper.Round(ip.X / edge1.Dx + b1);
            }
          } else {
            b1 = edge1.Bot.X - edge1.Bot.Y * edge1.Dx;
            b2 = edge2.Bot.X - edge2.Bot.Y * edge2.Dx;
            var q = (b2 - b1) / (edge1.Dx - edge2.Dx);
            ip.Y = ClipperLib2.Clipper.Round(q);
            if (Math.abs(edge1.Dx) < Math.abs(edge2.Dx))
              ip.X = ClipperLib2.Clipper.Round(edge1.Dx * q + b1);
            else
              ip.X = ClipperLib2.Clipper.Round(edge2.Dx * q + b2);
          }
          if (ip.Y < edge1.Top.Y || ip.Y < edge2.Top.Y) {
            if (edge1.Top.Y > edge2.Top.Y) {
              ip.Y = edge1.Top.Y;
              ip.X = ClipperLib2.Clipper.TopX(edge2, edge1.Top.Y);
              return ip.X < edge1.Top.X;
            } else
              ip.Y = edge2.Top.Y;
            if (Math.abs(edge1.Dx) < Math.abs(edge2.Dx))
              ip.X = ClipperLib2.Clipper.TopX(edge1, ip.Y);
            else
              ip.X = ClipperLib2.Clipper.TopX(edge2, ip.Y);
          }
          if (ip.Y > edge1.Curr.Y) {
            ip.Y = edge1.Curr.Y;
            if (Math.abs(edge1.Dx) > Math.abs(edge2.Dx))
              ip.X = ClipperLib2.Clipper.TopX(edge2, ip.Y);
            else
              ip.X = ClipperLib2.Clipper.TopX(edge1, ip.Y);
          }
        };
        ClipperLib2.Clipper.prototype.ProcessEdgesAtTopOfScanbeam = function(topY) {
          var e = this.m_ActiveEdges;
          while (e !== null) {
            var IsMaximaEdge = this.IsMaxima(e, topY);
            if (IsMaximaEdge) {
              var eMaxPair = this.GetMaximaPairEx(e);
              IsMaximaEdge = eMaxPair === null || !ClipperLib2.ClipperBase.IsHorizontal(eMaxPair);
            }
            if (IsMaximaEdge) {
              if (this.StrictlySimple) {
                this.InsertMaxima(e.Top.X);
              }
              var ePrev = e.PrevInAEL;
              this.DoMaxima(e);
              if (ePrev === null)
                e = this.m_ActiveEdges;
              else
                e = ePrev.NextInAEL;
            } else {
              if (this.IsIntermediate(e, topY) && ClipperLib2.ClipperBase.IsHorizontal(e.NextInLML)) {
                e = this.UpdateEdgeIntoAEL(e);
                if (e.OutIdx >= 0)
                  this.AddOutPt(e, e.Bot);
                this.AddEdgeToSEL(e);
              } else {
                e.Curr.X = ClipperLib2.Clipper.TopX(e, topY);
                e.Curr.Y = topY;
              }
              if (ClipperLib2.use_xyz) {
                if (e.Top.Y === topY) e.Curr.Z = e.Top.Z;
                else if (e.Bot.Y === topY) e.Curr.Z = e.Bot.Z;
                else e.Curr.Z = 0;
              }
              if (this.StrictlySimple) {
                var ePrev = e.PrevInAEL;
                if (e.OutIdx >= 0 && e.WindDelta !== 0 && ePrev !== null && ePrev.OutIdx >= 0 && ePrev.Curr.X === e.Curr.X && ePrev.WindDelta !== 0) {
                  var ip = new ClipperLib2.IntPoint1(e.Curr);
                  if (ClipperLib2.use_xyz) {
                    this.SetZ(ip, ePrev, e);
                  }
                  var op = this.AddOutPt(ePrev, ip);
                  var op2 = this.AddOutPt(e, ip);
                  this.AddJoin(op, op2, ip);
                }
              }
              e = e.NextInAEL;
            }
          }
          this.ProcessHorizontals();
          this.m_Maxima = null;
          e = this.m_ActiveEdges;
          while (e !== null) {
            if (this.IsIntermediate(e, topY)) {
              var op = null;
              if (e.OutIdx >= 0)
                op = this.AddOutPt(e, e.Top);
              e = this.UpdateEdgeIntoAEL(e);
              var ePrev = e.PrevInAEL;
              var eNext = e.NextInAEL;
              if (ePrev !== null && ePrev.Curr.X === e.Bot.X && ePrev.Curr.Y === e.Bot.Y && op !== null && ePrev.OutIdx >= 0 && ePrev.Curr.Y === ePrev.Top.Y && ClipperLib2.ClipperBase.SlopesEqual5(e.Curr, e.Top, ePrev.Curr, ePrev.Top, this.m_UseFullRange) && e.WindDelta !== 0 && ePrev.WindDelta !== 0) {
                var op2 = this.AddOutPt(ePrev2, e.Bot);
                this.AddJoin(op, op2, e.Top);
              } else if (eNext !== null && eNext.Curr.X === e.Bot.X && eNext.Curr.Y === e.Bot.Y && op !== null && eNext.OutIdx >= 0 && eNext.Curr.Y === eNext.Top.Y && ClipperLib2.ClipperBase.SlopesEqual5(e.Curr, e.Top, eNext.Curr, eNext.Top, this.m_UseFullRange) && e.WindDelta !== 0 && eNext.WindDelta !== 0) {
                var op2 = this.AddOutPt(eNext, e.Bot);
                this.AddJoin(op, op2, e.Top);
              }
            }
            e = e.NextInAEL;
          }
        };
        ClipperLib2.Clipper.prototype.DoMaxima = function(e) {
          var eMaxPair = this.GetMaximaPairEx(e);
          if (eMaxPair === null) {
            if (e.OutIdx >= 0)
              this.AddOutPt(e, e.Top);
            this.DeleteFromAEL(e);
            return;
          }
          var eNext = e.NextInAEL;
          while (eNext !== null && eNext !== eMaxPair) {
            this.IntersectEdges(e, eNext, e.Top);
            this.SwapPositionsInAEL(e, eNext);
            eNext = e.NextInAEL;
          }
          if (e.OutIdx === -1 && eMaxPair.OutIdx === -1) {
            this.DeleteFromAEL(e);
            this.DeleteFromAEL(eMaxPair);
          } else if (e.OutIdx >= 0 && eMaxPair.OutIdx >= 0) {
            if (e.OutIdx >= 0) this.AddLocalMaxPoly(e, eMaxPair, e.Top);
            this.DeleteFromAEL(e);
            this.DeleteFromAEL(eMaxPair);
          } else if (ClipperLib2.use_lines && e.WindDelta === 0) {
            if (e.OutIdx >= 0) {
              this.AddOutPt(e, e.Top);
              e.OutIdx = ClipperLib2.ClipperBase.Unassigned;
            }
            this.DeleteFromAEL(e);
            if (eMaxPair.OutIdx >= 0) {
              this.AddOutPt(eMaxPair, e.Top);
              eMaxPair.OutIdx = ClipperLib2.ClipperBase.Unassigned;
            }
            this.DeleteFromAEL(eMaxPair);
          } else
            ClipperLib2.Error("DoMaxima error");
        };
        ClipperLib2.Clipper.ReversePaths = function(polys) {
          for (var i = 0, len = polys.length; i < len; i++)
            polys[i].reverse();
        };
        ClipperLib2.Clipper.Orientation = function(poly) {
          return ClipperLib2.Clipper.Area(poly) >= 0;
        };
        ClipperLib2.Clipper.prototype.PointCount = function(pts) {
          if (pts === null)
            return 0;
          var result = 0;
          var p = pts;
          do {
            result++;
            p = p.Next;
          } while (p !== pts);
          return result;
        };
        ClipperLib2.Clipper.prototype.BuildResult = function(polyg) {
          ClipperLib2.Clear(polyg);
          for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++) {
            var outRec = this.m_PolyOuts[i];
            if (outRec.Pts === null)
              continue;
            var p = outRec.Pts.Prev;
            var cnt = this.PointCount(p);
            if (cnt < 2)
              continue;
            var pg = new Array(cnt);
            for (var j = 0; j < cnt; j++) {
              pg[j] = p.Pt;
              p = p.Prev;
            }
            polyg.push(pg);
          }
        };
        ClipperLib2.Clipper.prototype.BuildResult2 = function(polytree) {
          polytree.Clear();
          for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++) {
            var outRec = this.m_PolyOuts[i];
            var cnt = this.PointCount(outRec.Pts);
            if (outRec.IsOpen && cnt < 2 || !outRec.IsOpen && cnt < 3)
              continue;
            this.FixHoleLinkage(outRec);
            var pn = new ClipperLib2.PolyNode();
            polytree.m_AllPolys.push(pn);
            outRec.PolyNode = pn;
            pn.m_polygon.length = cnt;
            var op = outRec.Pts.Prev;
            for (var j = 0; j < cnt; j++) {
              pn.m_polygon[j] = op.Pt;
              op = op.Prev;
            }
          }
          for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++) {
            var outRec = this.m_PolyOuts[i];
            if (outRec.PolyNode === null)
              continue;
            else if (outRec.IsOpen) {
              outRec.PolyNode.IsOpen = true;
              polytree.AddChild(outRec.PolyNode);
            } else if (outRec.FirstLeft !== null && outRec.FirstLeft.PolyNode !== null)
              outRec.FirstLeft.PolyNode.AddChild(outRec.PolyNode);
            else
              polytree.AddChild(outRec.PolyNode);
          }
        };
        ClipperLib2.Clipper.prototype.FixupOutPolyline = function(outRec) {
          var pp = outRec.Pts;
          var lastPP = pp.Prev;
          while (pp !== lastPP) {
            pp = pp.Next;
            if (ClipperLib2.IntPoint.op_Equality(pp.Pt, pp.Prev.Pt)) {
              if (pp === lastPP) {
                lastPP = pp.Prev;
              }
              var tmpPP = pp.Prev;
              tmpPP.Next = pp.Next;
              pp.Next.Prev = tmpPP;
              pp = tmpPP;
            }
          }
          if (pp === pp.Prev) {
            outRec.Pts = null;
          }
        };
        ClipperLib2.Clipper.prototype.FixupOutPolygon = function(outRec) {
          var lastOK = null;
          outRec.BottomPt = null;
          var pp = outRec.Pts;
          var preserveCol = this.PreserveCollinear || this.StrictlySimple;
          for (; ; ) {
            if (pp.Prev === pp || pp.Prev === pp.Next) {
              outRec.Pts = null;
              return;
            }
            if (ClipperLib2.IntPoint.op_Equality(pp.Pt, pp.Next.Pt) || ClipperLib2.IntPoint.op_Equality(pp.Pt, pp.Prev.Pt) || ClipperLib2.ClipperBase.SlopesEqual4(pp.Prev.Pt, pp.Pt, pp.Next.Pt, this.m_UseFullRange) && (!preserveCol || !this.Pt2IsBetweenPt1AndPt3(pp.Prev.Pt, pp.Pt, pp.Next.Pt))) {
              lastOK = null;
              pp.Prev.Next = pp.Next;
              pp.Next.Prev = pp.Prev;
              pp = pp.Prev;
            } else if (pp === lastOK)
              break;
            else {
              if (lastOK === null)
                lastOK = pp;
              pp = pp.Next;
            }
          }
          outRec.Pts = pp;
        };
        ClipperLib2.Clipper.prototype.DupOutPt = function(outPt, InsertAfter) {
          var result = new ClipperLib2.OutPt();
          result.Pt.X = outPt.Pt.X;
          result.Pt.Y = outPt.Pt.Y;
          if (ClipperLib2.use_xyz) result.Pt.Z = outPt.Pt.Z;
          result.Idx = outPt.Idx;
          if (InsertAfter) {
            result.Next = outPt.Next;
            result.Prev = outPt;
            outPt.Next.Prev = result;
            outPt.Next = result;
          } else {
            result.Prev = outPt.Prev;
            result.Next = outPt;
            outPt.Prev.Next = result;
            outPt.Prev = result;
          }
          return result;
        };
        ClipperLib2.Clipper.prototype.GetOverlap = function(a1, a2, b1, b2, $val) {
          if (a1 < a2) {
            if (b1 < b2) {
              $val.Left = Math.max(a1, b1);
              $val.Right = Math.min(a2, b2);
            } else {
              $val.Left = Math.max(a1, b2);
              $val.Right = Math.min(a2, b1);
            }
          } else {
            if (b1 < b2) {
              $val.Left = Math.max(a2, b1);
              $val.Right = Math.min(a1, b2);
            } else {
              $val.Left = Math.max(a2, b2);
              $val.Right = Math.min(a1, b1);
            }
          }
          return $val.Left < $val.Right;
        };
        ClipperLib2.Clipper.prototype.JoinHorz = function(op1, op1b, op2, op2b, Pt, DiscardLeft) {
          var Dir1 = op1.Pt.X > op1b.Pt.X ? ClipperLib2.Direction.dRightToLeft : ClipperLib2.Direction.dLeftToRight;
          var Dir2 = op2.Pt.X > op2b.Pt.X ? ClipperLib2.Direction.dRightToLeft : ClipperLib2.Direction.dLeftToRight;
          if (Dir1 === Dir2)
            return false;
          if (Dir1 === ClipperLib2.Direction.dLeftToRight) {
            while (op1.Next.Pt.X <= Pt.X && op1.Next.Pt.X >= op1.Pt.X && op1.Next.Pt.Y === Pt.Y)
              op1 = op1.Next;
            if (DiscardLeft && op1.Pt.X !== Pt.X)
              op1 = op1.Next;
            op1b = this.DupOutPt(op1, !DiscardLeft);
            if (ClipperLib2.IntPoint.op_Inequality(op1b.Pt, Pt)) {
              op1 = op1b;
              op1.Pt.X = Pt.X;
              op1.Pt.Y = Pt.Y;
              if (ClipperLib2.use_xyz) op1.Pt.Z = Pt.Z;
              op1b = this.DupOutPt(op1, !DiscardLeft);
            }
          } else {
            while (op1.Next.Pt.X >= Pt.X && op1.Next.Pt.X <= op1.Pt.X && op1.Next.Pt.Y === Pt.Y)
              op1 = op1.Next;
            if (!DiscardLeft && op1.Pt.X !== Pt.X)
              op1 = op1.Next;
            op1b = this.DupOutPt(op1, DiscardLeft);
            if (ClipperLib2.IntPoint.op_Inequality(op1b.Pt, Pt)) {
              op1 = op1b;
              op1.Pt.X = Pt.X;
              op1.Pt.Y = Pt.Y;
              if (ClipperLib2.use_xyz) op1.Pt.Z = Pt.Z;
              op1b = this.DupOutPt(op1, DiscardLeft);
            }
          }
          if (Dir2 === ClipperLib2.Direction.dLeftToRight) {
            while (op2.Next.Pt.X <= Pt.X && op2.Next.Pt.X >= op2.Pt.X && op2.Next.Pt.Y === Pt.Y)
              op2 = op2.Next;
            if (DiscardLeft && op2.Pt.X !== Pt.X)
              op2 = op2.Next;
            op2b = this.DupOutPt(op2, !DiscardLeft);
            if (ClipperLib2.IntPoint.op_Inequality(op2b.Pt, Pt)) {
              op2 = op2b;
              op2.Pt.X = Pt.X;
              op2.Pt.Y = Pt.Y;
              if (ClipperLib2.use_xyz) op2.Pt.Z = Pt.Z;
              op2b = this.DupOutPt(op2, !DiscardLeft);
            }
          } else {
            while (op2.Next.Pt.X >= Pt.X && op2.Next.Pt.X <= op2.Pt.X && op2.Next.Pt.Y === Pt.Y)
              op2 = op2.Next;
            if (!DiscardLeft && op2.Pt.X !== Pt.X)
              op2 = op2.Next;
            op2b = this.DupOutPt(op2, DiscardLeft);
            if (ClipperLib2.IntPoint.op_Inequality(op2b.Pt, Pt)) {
              op2 = op2b;
              op2.Pt.X = Pt.X;
              op2.Pt.Y = Pt.Y;
              if (ClipperLib2.use_xyz) op2.Pt.Z = Pt.Z;
              op2b = this.DupOutPt(op2, DiscardLeft);
            }
          }
          if (Dir1 === ClipperLib2.Direction.dLeftToRight === DiscardLeft) {
            op1.Prev = op2;
            op2.Next = op1;
            op1b.Next = op2b;
            op2b.Prev = op1b;
          } else {
            op1.Next = op2;
            op2.Prev = op1;
            op1b.Prev = op2b;
            op2b.Next = op1b;
          }
          return true;
        };
        ClipperLib2.Clipper.prototype.JoinPoints = function(j, outRec1, outRec2) {
          var op1 = j.OutPt1, op1b = new ClipperLib2.OutPt();
          var op2 = j.OutPt2, op2b = new ClipperLib2.OutPt();
          var isHorizontal = j.OutPt1.Pt.Y === j.OffPt.Y;
          if (isHorizontal && ClipperLib2.IntPoint.op_Equality(j.OffPt, j.OutPt1.Pt) && ClipperLib2.IntPoint.op_Equality(j.OffPt, j.OutPt2.Pt)) {
            if (outRec1 !== outRec2) return false;
            op1b = j.OutPt1.Next;
            while (op1b !== op1 && ClipperLib2.IntPoint.op_Equality(op1b.Pt, j.OffPt))
              op1b = op1b.Next;
            var reverse1 = op1b.Pt.Y > j.OffPt.Y;
            op2b = j.OutPt2.Next;
            while (op2b !== op2 && ClipperLib2.IntPoint.op_Equality(op2b.Pt, j.OffPt))
              op2b = op2b.Next;
            var reverse2 = op2b.Pt.Y > j.OffPt.Y;
            if (reverse1 === reverse2)
              return false;
            if (reverse1) {
              op1b = this.DupOutPt(op1, false);
              op2b = this.DupOutPt(op2, true);
              op1.Prev = op2;
              op2.Next = op1;
              op1b.Next = op2b;
              op2b.Prev = op1b;
              j.OutPt1 = op1;
              j.OutPt2 = op1b;
              return true;
            } else {
              op1b = this.DupOutPt(op1, true);
              op2b = this.DupOutPt(op2, false);
              op1.Next = op2;
              op2.Prev = op1;
              op1b.Prev = op2b;
              op2b.Next = op1b;
              j.OutPt1 = op1;
              j.OutPt2 = op1b;
              return true;
            }
          } else if (isHorizontal) {
            op1b = op1;
            while (op1.Prev.Pt.Y === op1.Pt.Y && op1.Prev !== op1b && op1.Prev !== op2)
              op1 = op1.Prev;
            while (op1b.Next.Pt.Y === op1b.Pt.Y && op1b.Next !== op1 && op1b.Next !== op2)
              op1b = op1b.Next;
            if (op1b.Next === op1 || op1b.Next === op2)
              return false;
            op2b = op2;
            while (op2.Prev.Pt.Y === op2.Pt.Y && op2.Prev !== op2b && op2.Prev !== op1b)
              op2 = op2.Prev;
            while (op2b.Next.Pt.Y === op2b.Pt.Y && op2b.Next !== op2 && op2b.Next !== op1)
              op2b = op2b.Next;
            if (op2b.Next === op2 || op2b.Next === op1)
              return false;
            var $val = {
              Left: null,
              Right: null
            };
            if (!this.GetOverlap(op1.Pt.X, op1b.Pt.X, op2.Pt.X, op2b.Pt.X, $val))
              return false;
            var Left = $val.Left;
            var Right = $val.Right;
            var Pt = new ClipperLib2.IntPoint0();
            var DiscardLeftSide;
            if (op1.Pt.X >= Left && op1.Pt.X <= Right) {
              Pt.X = op1.Pt.X;
              Pt.Y = op1.Pt.Y;
              if (ClipperLib2.use_xyz) Pt.Z = op1.Pt.Z;
              DiscardLeftSide = op1.Pt.X > op1b.Pt.X;
            } else if (op2.Pt.X >= Left && op2.Pt.X <= Right) {
              Pt.X = op2.Pt.X;
              Pt.Y = op2.Pt.Y;
              if (ClipperLib2.use_xyz) Pt.Z = op2.Pt.Z;
              DiscardLeftSide = op2.Pt.X > op2b.Pt.X;
            } else if (op1b.Pt.X >= Left && op1b.Pt.X <= Right) {
              Pt.X = op1b.Pt.X;
              Pt.Y = op1b.Pt.Y;
              if (ClipperLib2.use_xyz) Pt.Z = op1b.Pt.Z;
              DiscardLeftSide = op1b.Pt.X > op1.Pt.X;
            } else {
              Pt.X = op2b.Pt.X;
              Pt.Y = op2b.Pt.Y;
              if (ClipperLib2.use_xyz) Pt.Z = op2b.Pt.Z;
              DiscardLeftSide = op2b.Pt.X > op2.Pt.X;
            }
            j.OutPt1 = op1;
            j.OutPt2 = op2;
            return this.JoinHorz(op1, op1b, op2, op2b, Pt, DiscardLeftSide);
          } else {
            op1b = op1.Next;
            while (ClipperLib2.IntPoint.op_Equality(op1b.Pt, op1.Pt) && op1b !== op1)
              op1b = op1b.Next;
            var Reverse1 = op1b.Pt.Y > op1.Pt.Y || !ClipperLib2.ClipperBase.SlopesEqual4(op1.Pt, op1b.Pt, j.OffPt, this.m_UseFullRange);
            if (Reverse1) {
              op1b = op1.Prev;
              while (ClipperLib2.IntPoint.op_Equality(op1b.Pt, op1.Pt) && op1b !== op1)
                op1b = op1b.Prev;
              if (op1b.Pt.Y > op1.Pt.Y || !ClipperLib2.ClipperBase.SlopesEqual4(op1.Pt, op1b.Pt, j.OffPt, this.m_UseFullRange))
                return false;
            }
            op2b = op2.Next;
            while (ClipperLib2.IntPoint.op_Equality(op2b.Pt, op2.Pt) && op2b !== op2)
              op2b = op2b.Next;
            var Reverse2 = op2b.Pt.Y > op2.Pt.Y || !ClipperLib2.ClipperBase.SlopesEqual4(op2.Pt, op2b.Pt, j.OffPt, this.m_UseFullRange);
            if (Reverse2) {
              op2b = op2.Prev;
              while (ClipperLib2.IntPoint.op_Equality(op2b.Pt, op2.Pt) && op2b !== op2)
                op2b = op2b.Prev;
              if (op2b.Pt.Y > op2.Pt.Y || !ClipperLib2.ClipperBase.SlopesEqual4(op2.Pt, op2b.Pt, j.OffPt, this.m_UseFullRange))
                return false;
            }
            if (op1b === op1 || op2b === op2 || op1b === op2b || outRec1 === outRec2 && Reverse1 === Reverse2)
              return false;
            if (Reverse1) {
              op1b = this.DupOutPt(op1, false);
              op2b = this.DupOutPt(op2, true);
              op1.Prev = op2;
              op2.Next = op1;
              op1b.Next = op2b;
              op2b.Prev = op1b;
              j.OutPt1 = op1;
              j.OutPt2 = op1b;
              return true;
            } else {
              op1b = this.DupOutPt(op1, true);
              op2b = this.DupOutPt(op2, false);
              op1.Next = op2;
              op2.Prev = op1;
              op1b.Prev = op2b;
              op2b.Next = op1b;
              j.OutPt1 = op1;
              j.OutPt2 = op1b;
              return true;
            }
          }
        };
        ClipperLib2.Clipper.GetBounds = function(paths) {
          var i = 0, cnt = paths.length;
          while (i < cnt && paths[i].length === 0) i++;
          if (i === cnt) return new ClipperLib2.IntRect(0, 0, 0, 0);
          var result = new ClipperLib2.IntRect();
          result.left = paths[i][0].X;
          result.right = result.left;
          result.top = paths[i][0].Y;
          result.bottom = result.top;
          for (; i < cnt; i++)
            for (var j = 0, jlen = paths[i].length; j < jlen; j++) {
              if (paths[i][j].X < result.left) result.left = paths[i][j].X;
              else if (paths[i][j].X > result.right) result.right = paths[i][j].X;
              if (paths[i][j].Y < result.top) result.top = paths[i][j].Y;
              else if (paths[i][j].Y > result.bottom) result.bottom = paths[i][j].Y;
            }
          return result;
        };
        ClipperLib2.Clipper.prototype.GetBounds2 = function(ops) {
          var opStart = ops;
          var result = new ClipperLib2.IntRect();
          result.left = ops.Pt.X;
          result.right = ops.Pt.X;
          result.top = ops.Pt.Y;
          result.bottom = ops.Pt.Y;
          ops = ops.Next;
          while (ops !== opStart) {
            if (ops.Pt.X < result.left)
              result.left = ops.Pt.X;
            if (ops.Pt.X > result.right)
              result.right = ops.Pt.X;
            if (ops.Pt.Y < result.top)
              result.top = ops.Pt.Y;
            if (ops.Pt.Y > result.bottom)
              result.bottom = ops.Pt.Y;
            ops = ops.Next;
          }
          return result;
        };
        ClipperLib2.Clipper.PointInPolygon = function(pt, path) {
          var result = 0, cnt = path.length;
          if (cnt < 3)
            return 0;
          var ip = path[0];
          for (var i = 1; i <= cnt; ++i) {
            var ipNext = i === cnt ? path[0] : path[i];
            if (ipNext.Y === pt.Y) {
              if (ipNext.X === pt.X || ip.Y === pt.Y && ipNext.X > pt.X === ip.X < pt.X)
                return -1;
            }
            if (ip.Y < pt.Y !== ipNext.Y < pt.Y) {
              if (ip.X >= pt.X) {
                if (ipNext.X > pt.X)
                  result = 1 - result;
                else {
                  var d = (ip.X - pt.X) * (ipNext.Y - pt.Y) - (ipNext.X - pt.X) * (ip.Y - pt.Y);
                  if (d === 0)
                    return -1;
                  else if (d > 0 === ipNext.Y > ip.Y)
                    result = 1 - result;
                }
              } else {
                if (ipNext.X > pt.X) {
                  var d = (ip.X - pt.X) * (ipNext.Y - pt.Y) - (ipNext.X - pt.X) * (ip.Y - pt.Y);
                  if (d === 0)
                    return -1;
                  else if (d > 0 === ipNext.Y > ip.Y)
                    result = 1 - result;
                }
              }
            }
            ip = ipNext;
          }
          return result;
        };
        ClipperLib2.Clipper.prototype.PointInPolygon = function(pt, op) {
          var result = 0;
          var startOp = op;
          var ptx = pt.X, pty = pt.Y;
          var poly0x = op.Pt.X, poly0y = op.Pt.Y;
          do {
            op = op.Next;
            var poly1x = op.Pt.X, poly1y = op.Pt.Y;
            if (poly1y === pty) {
              if (poly1x === ptx || poly0y === pty && poly1x > ptx === poly0x < ptx)
                return -1;
            }
            if (poly0y < pty !== poly1y < pty) {
              if (poly0x >= ptx) {
                if (poly1x > ptx)
                  result = 1 - result;
                else {
                  var d = (poly0x - ptx) * (poly1y - pty) - (poly1x - ptx) * (poly0y - pty);
                  if (d === 0)
                    return -1;
                  if (d > 0 === poly1y > poly0y)
                    result = 1 - result;
                }
              } else {
                if (poly1x > ptx) {
                  var d = (poly0x - ptx) * (poly1y - pty) - (poly1x - ptx) * (poly0y - pty);
                  if (d === 0)
                    return -1;
                  if (d > 0 === poly1y > poly0y)
                    result = 1 - result;
                }
              }
            }
            poly0x = poly1x;
            poly0y = poly1y;
          } while (startOp !== op);
          return result;
        };
        ClipperLib2.Clipper.prototype.Poly2ContainsPoly1 = function(outPt1, outPt2) {
          var op = outPt1;
          do {
            var res = this.PointInPolygon(op.Pt, outPt2);
            if (res >= 0)
              return res > 0;
            op = op.Next;
          } while (op !== outPt1);
          return true;
        };
        ClipperLib2.Clipper.prototype.FixupFirstLefts1 = function(OldOutRec, NewOutRec) {
          var outRec, firstLeft;
          for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++) {
            outRec = this.m_PolyOuts[i];
            firstLeft = ClipperLib2.Clipper.ParseFirstLeft(outRec.FirstLeft);
            if (outRec.Pts !== null && firstLeft === OldOutRec) {
              if (this.Poly2ContainsPoly1(outRec.Pts, NewOutRec.Pts))
                outRec.FirstLeft = NewOutRec;
            }
          }
        };
        ClipperLib2.Clipper.prototype.FixupFirstLefts2 = function(innerOutRec, outerOutRec) {
          var orfl = outerOutRec.FirstLeft;
          var outRec, firstLeft;
          for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++) {
            outRec = this.m_PolyOuts[i];
            if (outRec.Pts === null || outRec === outerOutRec || outRec === innerOutRec)
              continue;
            firstLeft = ClipperLib2.Clipper.ParseFirstLeft(outRec.FirstLeft);
            if (firstLeft !== orfl && firstLeft !== innerOutRec && firstLeft !== outerOutRec)
              continue;
            if (this.Poly2ContainsPoly1(outRec.Pts, innerOutRec.Pts))
              outRec.FirstLeft = innerOutRec;
            else if (this.Poly2ContainsPoly1(outRec.Pts, outerOutRec.Pts))
              outRec.FirstLeft = outerOutRec;
            else if (outRec.FirstLeft === innerOutRec || outRec.FirstLeft === outerOutRec)
              outRec.FirstLeft = orfl;
          }
        };
        ClipperLib2.Clipper.prototype.FixupFirstLefts3 = function(OldOutRec, NewOutRec) {
          var outRec;
          var firstLeft;
          for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++) {
            outRec = this.m_PolyOuts[i];
            firstLeft = ClipperLib2.Clipper.ParseFirstLeft(outRec.FirstLeft);
            if (outRec.Pts !== null && firstLeft === OldOutRec)
              outRec.FirstLeft = NewOutRec;
          }
        };
        ClipperLib2.Clipper.ParseFirstLeft = function(FirstLeft) {
          while (FirstLeft !== null && FirstLeft.Pts === null)
            FirstLeft = FirstLeft.FirstLeft;
          return FirstLeft;
        };
        ClipperLib2.Clipper.prototype.JoinCommonEdges = function() {
          for (var i = 0, ilen = this.m_Joins.length; i < ilen; i++) {
            var join = this.m_Joins[i];
            var outRec1 = this.GetOutRec(join.OutPt1.Idx);
            var outRec2 = this.GetOutRec(join.OutPt2.Idx);
            if (outRec1.Pts === null || outRec2.Pts === null)
              continue;
            if (outRec1.IsOpen || outRec2.IsOpen) {
              continue;
            }
            var holeStateRec;
            if (outRec1 === outRec2)
              holeStateRec = outRec1;
            else if (this.OutRec1RightOfOutRec2(outRec1, outRec2))
              holeStateRec = outRec2;
            else if (this.OutRec1RightOfOutRec2(outRec2, outRec1))
              holeStateRec = outRec1;
            else
              holeStateRec = this.GetLowermostRec(outRec1, outRec2);
            if (!this.JoinPoints(join, outRec1, outRec2)) continue;
            if (outRec1 === outRec2) {
              outRec1.Pts = join.OutPt1;
              outRec1.BottomPt = null;
              outRec2 = this.CreateOutRec();
              outRec2.Pts = join.OutPt2;
              this.UpdateOutPtIdxs(outRec2);
              if (this.Poly2ContainsPoly1(outRec2.Pts, outRec1.Pts)) {
                outRec2.IsHole = !outRec1.IsHole;
                outRec2.FirstLeft = outRec1;
                if (this.m_UsingPolyTree)
                  this.FixupFirstLefts2(outRec2, outRec1);
                if ((outRec2.IsHole ^ this.ReverseSolution) == this.Area$1(outRec2) > 0)
                  this.ReversePolyPtLinks(outRec2.Pts);
              } else if (this.Poly2ContainsPoly1(outRec1.Pts, outRec2.Pts)) {
                outRec2.IsHole = outRec1.IsHole;
                outRec1.IsHole = !outRec2.IsHole;
                outRec2.FirstLeft = outRec1.FirstLeft;
                outRec1.FirstLeft = outRec2;
                if (this.m_UsingPolyTree)
                  this.FixupFirstLefts2(outRec1, outRec2);
                if ((outRec1.IsHole ^ this.ReverseSolution) == this.Area$1(outRec1) > 0)
                  this.ReversePolyPtLinks(outRec1.Pts);
              } else {
                outRec2.IsHole = outRec1.IsHole;
                outRec2.FirstLeft = outRec1.FirstLeft;
                if (this.m_UsingPolyTree)
                  this.FixupFirstLefts1(outRec1, outRec2);
              }
            } else {
              outRec2.Pts = null;
              outRec2.BottomPt = null;
              outRec2.Idx = outRec1.Idx;
              outRec1.IsHole = holeStateRec.IsHole;
              if (holeStateRec === outRec2)
                outRec1.FirstLeft = outRec2.FirstLeft;
              outRec2.FirstLeft = outRec1;
              if (this.m_UsingPolyTree)
                this.FixupFirstLefts3(outRec2, outRec1);
            }
          }
        };
        ClipperLib2.Clipper.prototype.UpdateOutPtIdxs = function(outrec) {
          var op = outrec.Pts;
          do {
            op.Idx = outrec.Idx;
            op = op.Prev;
          } while (op !== outrec.Pts);
        };
        ClipperLib2.Clipper.prototype.DoSimplePolygons = function() {
          var i = 0;
          while (i < this.m_PolyOuts.length) {
            var outrec = this.m_PolyOuts[i++];
            var op = outrec.Pts;
            if (op === null || outrec.IsOpen)
              continue;
            do {
              var op2 = op.Next;
              while (op2 !== outrec.Pts) {
                if (ClipperLib2.IntPoint.op_Equality(op.Pt, op2.Pt) && op2.Next !== op && op2.Prev !== op) {
                  var op3 = op.Prev;
                  var op4 = op2.Prev;
                  op.Prev = op4;
                  op4.Next = op;
                  op2.Prev = op3;
                  op3.Next = op2;
                  outrec.Pts = op;
                  var outrec2 = this.CreateOutRec();
                  outrec2.Pts = op2;
                  this.UpdateOutPtIdxs(outrec2);
                  if (this.Poly2ContainsPoly1(outrec2.Pts, outrec.Pts)) {
                    outrec2.IsHole = !outrec.IsHole;
                    outrec2.FirstLeft = outrec;
                    if (this.m_UsingPolyTree) this.FixupFirstLefts2(outrec2, outrec);
                  } else if (this.Poly2ContainsPoly1(outrec.Pts, outrec2.Pts)) {
                    outrec2.IsHole = outrec.IsHole;
                    outrec.IsHole = !outrec2.IsHole;
                    outrec2.FirstLeft = outrec.FirstLeft;
                    outrec.FirstLeft = outrec2;
                    if (this.m_UsingPolyTree) this.FixupFirstLefts2(outrec, outrec2);
                  } else {
                    outrec2.IsHole = outrec.IsHole;
                    outrec2.FirstLeft = outrec.FirstLeft;
                    if (this.m_UsingPolyTree) this.FixupFirstLefts1(outrec, outrec2);
                  }
                  op2 = op;
                }
                op2 = op2.Next;
              }
              op = op.Next;
            } while (op !== outrec.Pts);
          }
        };
        ClipperLib2.Clipper.Area = function(poly) {
          if (!Array.isArray(poly))
            return 0;
          var cnt = poly.length;
          if (cnt < 3)
            return 0;
          var a = 0;
          for (var i = 0, j = cnt - 1; i < cnt; ++i) {
            a += (poly[j].X + poly[i].X) * (poly[j].Y - poly[i].Y);
            j = i;
          }
          return -a * 0.5;
        };
        ClipperLib2.Clipper.prototype.Area = function(op) {
          var opFirst = op;
          if (op === null) return 0;
          var a = 0;
          do {
            a = a + (op.Prev.Pt.X + op.Pt.X) * (op.Prev.Pt.Y - op.Pt.Y);
            op = op.Next;
          } while (op !== opFirst);
          return a * 0.5;
        };
        ClipperLib2.Clipper.prototype.Area$1 = function(outRec) {
          return this.Area(outRec.Pts);
        };
        ClipperLib2.Clipper.SimplifyPolygon = function(poly, fillType) {
          var result = new Array();
          var c = new ClipperLib2.Clipper(0);
          c.StrictlySimple = true;
          c.AddPath(poly, ClipperLib2.PolyType.ptSubject, true);
          c.Execute(ClipperLib2.ClipType.ctUnion, result, fillType, fillType);
          return result;
        };
        ClipperLib2.Clipper.SimplifyPolygons = function(polys, fillType) {
          if (typeof fillType === "undefined") fillType = ClipperLib2.PolyFillType.pftEvenOdd;
          var result = new Array();
          var c = new ClipperLib2.Clipper(0);
          c.StrictlySimple = true;
          c.AddPaths(polys, ClipperLib2.PolyType.ptSubject, true);
          c.Execute(ClipperLib2.ClipType.ctUnion, result, fillType, fillType);
          return result;
        };
        ClipperLib2.Clipper.DistanceSqrd = function(pt1, pt2) {
          var dx = pt1.X - pt2.X;
          var dy = pt1.Y - pt2.Y;
          return dx * dx + dy * dy;
        };
        ClipperLib2.Clipper.DistanceFromLineSqrd = function(pt, ln1, ln2) {
          var A = ln1.Y - ln2.Y;
          var B = ln2.X - ln1.X;
          var C = A * ln1.X + B * ln1.Y;
          C = A * pt.X + B * pt.Y - C;
          return C * C / (A * A + B * B);
        };
        ClipperLib2.Clipper.SlopesNearCollinear = function(pt1, pt2, pt3, distSqrd) {
          if (Math.abs(pt1.X - pt2.X) > Math.abs(pt1.Y - pt2.Y)) {
            if (pt1.X > pt2.X === pt1.X < pt3.X)
              return ClipperLib2.Clipper.DistanceFromLineSqrd(pt1, pt2, pt3) < distSqrd;
            else if (pt2.X > pt1.X === pt2.X < pt3.X)
              return ClipperLib2.Clipper.DistanceFromLineSqrd(pt2, pt1, pt3) < distSqrd;
            else
              return ClipperLib2.Clipper.DistanceFromLineSqrd(pt3, pt1, pt2) < distSqrd;
          } else {
            if (pt1.Y > pt2.Y === pt1.Y < pt3.Y)
              return ClipperLib2.Clipper.DistanceFromLineSqrd(pt1, pt2, pt3) < distSqrd;
            else if (pt2.Y > pt1.Y === pt2.Y < pt3.Y)
              return ClipperLib2.Clipper.DistanceFromLineSqrd(pt2, pt1, pt3) < distSqrd;
            else
              return ClipperLib2.Clipper.DistanceFromLineSqrd(pt3, pt1, pt2) < distSqrd;
          }
        };
        ClipperLib2.Clipper.PointsAreClose = function(pt1, pt2, distSqrd) {
          var dx = pt1.X - pt2.X;
          var dy = pt1.Y - pt2.Y;
          return dx * dx + dy * dy <= distSqrd;
        };
        ClipperLib2.Clipper.ExcludeOp = function(op) {
          var result = op.Prev;
          result.Next = op.Next;
          op.Next.Prev = result;
          result.Idx = 0;
          return result;
        };
        ClipperLib2.Clipper.CleanPolygon = function(path, distance) {
          if (typeof distance === "undefined") distance = 1.415;
          var cnt = path.length;
          if (cnt === 0)
            return new Array();
          var outPts = new Array(cnt);
          for (var i = 0; i < cnt; ++i)
            outPts[i] = new ClipperLib2.OutPt();
          for (var i = 0; i < cnt; ++i) {
            outPts[i].Pt = path[i];
            outPts[i].Next = outPts[(i + 1) % cnt];
            outPts[i].Next.Prev = outPts[i];
            outPts[i].Idx = 0;
          }
          var distSqrd = distance * distance;
          var op = outPts[0];
          while (op.Idx === 0 && op.Next !== op.Prev) {
            if (ClipperLib2.Clipper.PointsAreClose(op.Pt, op.Prev.Pt, distSqrd)) {
              op = ClipperLib2.Clipper.ExcludeOp(op);
              cnt--;
            } else if (ClipperLib2.Clipper.PointsAreClose(op.Prev.Pt, op.Next.Pt, distSqrd)) {
              ClipperLib2.Clipper.ExcludeOp(op.Next);
              op = ClipperLib2.Clipper.ExcludeOp(op);
              cnt -= 2;
            } else if (ClipperLib2.Clipper.SlopesNearCollinear(op.Prev.Pt, op.Pt, op.Next.Pt, distSqrd)) {
              op = ClipperLib2.Clipper.ExcludeOp(op);
              cnt--;
            } else {
              op.Idx = 1;
              op = op.Next;
            }
          }
          if (cnt < 3)
            cnt = 0;
          var result = new Array(cnt);
          for (var i = 0; i < cnt; ++i) {
            result[i] = new ClipperLib2.IntPoint1(op.Pt);
            op = op.Next;
          }
          outPts = null;
          return result;
        };
        ClipperLib2.Clipper.CleanPolygons = function(polys, distance) {
          var result = new Array(polys.length);
          for (var i = 0, ilen = polys.length; i < ilen; i++)
            result[i] = ClipperLib2.Clipper.CleanPolygon(polys[i], distance);
          return result;
        };
        ClipperLib2.Clipper.Minkowski = function(pattern, path, IsSum, IsClosed) {
          var delta = IsClosed ? 1 : 0;
          var polyCnt = pattern.length;
          var pathCnt = path.length;
          var result = new Array();
          if (IsSum)
            for (var i = 0; i < pathCnt; i++) {
              var p = new Array(polyCnt);
              for (var j = 0, jlen = pattern.length, ip = pattern[j]; j < jlen; j++, ip = pattern[j])
                p[j] = new ClipperLib2.IntPoint2(path[i].X + ip.X, path[i].Y + ip.Y);
              result.push(p);
            }
          else
            for (var i = 0; i < pathCnt; i++) {
              var p = new Array(polyCnt);
              for (var j = 0, jlen = pattern.length, ip = pattern[j]; j < jlen; j++, ip = pattern[j])
                p[j] = new ClipperLib2.IntPoint2(path[i].X - ip.X, path[i].Y - ip.Y);
              result.push(p);
            }
          var quads = new Array();
          for (var i = 0; i < pathCnt - 1 + delta; i++)
            for (var j = 0; j < polyCnt; j++) {
              var quad = new Array();
              quad.push(result[i % pathCnt][j % polyCnt]);
              quad.push(result[(i + 1) % pathCnt][j % polyCnt]);
              quad.push(result[(i + 1) % pathCnt][(j + 1) % polyCnt]);
              quad.push(result[i % pathCnt][(j + 1) % polyCnt]);
              if (!ClipperLib2.Clipper.Orientation(quad))
                quad.reverse();
              quads.push(quad);
            }
          return quads;
        };
        ClipperLib2.Clipper.MinkowskiSum = function(pattern, path_or_paths, pathIsClosed) {
          if (!(path_or_paths[0] instanceof Array)) {
            var path = path_or_paths;
            var paths = ClipperLib2.Clipper.Minkowski(pattern, path, true, pathIsClosed);
            var c = new ClipperLib2.Clipper();
            c.AddPaths(paths, ClipperLib2.PolyType.ptSubject, true);
            c.Execute(ClipperLib2.ClipType.ctUnion, paths, ClipperLib2.PolyFillType.pftNonZero, ClipperLib2.PolyFillType.pftNonZero);
            return paths;
          } else {
            var paths = path_or_paths;
            var solution = new ClipperLib2.Paths();
            var c = new ClipperLib2.Clipper();
            for (var i = 0; i < paths.length; ++i) {
              var tmp = ClipperLib2.Clipper.Minkowski(pattern, paths[i], true, pathIsClosed);
              c.AddPaths(tmp, ClipperLib2.PolyType.ptSubject, true);
              if (pathIsClosed) {
                var path = ClipperLib2.Clipper.TranslatePath(paths[i], pattern[0]);
                c.AddPath(path, ClipperLib2.PolyType.ptClip, true);
              }
            }
            c.Execute(
              ClipperLib2.ClipType.ctUnion,
              solution,
              ClipperLib2.PolyFillType.pftNonZero,
              ClipperLib2.PolyFillType.pftNonZero
            );
            return solution;
          }
        };
        ClipperLib2.Clipper.TranslatePath = function(path, delta) {
          var outPath = new ClipperLib2.Path();
          for (var i = 0; i < path.length; i++)
            outPath.push(new ClipperLib2.IntPoint2(path[i].X + delta.X, path[i].Y + delta.Y));
          return outPath;
        };
        ClipperLib2.Clipper.MinkowskiDiff = function(poly1, poly2) {
          var paths = ClipperLib2.Clipper.Minkowski(poly1, poly2, false, true);
          var c = new ClipperLib2.Clipper();
          c.AddPaths(paths, ClipperLib2.PolyType.ptSubject, true);
          c.Execute(ClipperLib2.ClipType.ctUnion, paths, ClipperLib2.PolyFillType.pftNonZero, ClipperLib2.PolyFillType.pftNonZero);
          return paths;
        };
        ClipperLib2.Clipper.PolyTreeToPaths = function(polytree) {
          var result = new Array();
          ClipperLib2.Clipper.AddPolyNodeToPaths(polytree, ClipperLib2.Clipper.NodeType.ntAny, result);
          return result;
        };
        ClipperLib2.Clipper.AddPolyNodeToPaths = function(polynode, nt, paths) {
          var match = true;
          switch (nt) {
            case ClipperLib2.Clipper.NodeType.ntOpen:
              return;
            case ClipperLib2.Clipper.NodeType.ntClosed:
              match = !polynode.IsOpen;
              break;
            default:
              break;
          }
          if (polynode.m_polygon.length > 0 && match)
            paths.push(polynode.m_polygon);
          for (var $i3 = 0, $t3 = polynode.Childs(), $l3 = $t3.length, pn = $t3[$i3]; $i3 < $l3; $i3++, pn = $t3[$i3])
            ClipperLib2.Clipper.AddPolyNodeToPaths(pn, nt, paths);
        };
        ClipperLib2.Clipper.OpenPathsFromPolyTree = function(polytree) {
          var result = new ClipperLib2.Paths();
          for (var i = 0, ilen = polytree.ChildCount(); i < ilen; i++)
            if (polytree.Childs()[i].IsOpen)
              result.push(polytree.Childs()[i].m_polygon);
          return result;
        };
        ClipperLib2.Clipper.ClosedPathsFromPolyTree = function(polytree) {
          var result = new ClipperLib2.Paths();
          ClipperLib2.Clipper.AddPolyNodeToPaths(polytree, ClipperLib2.Clipper.NodeType.ntClosed, result);
          return result;
        };
        Inherit(ClipperLib2.Clipper, ClipperLib2.ClipperBase);
        ClipperLib2.Clipper.NodeType = {
          ntAny: 0,
          ntOpen: 1,
          ntClosed: 2
        };
        ClipperLib2.ClipperOffset = function(miterLimit, arcTolerance) {
          if (typeof miterLimit === "undefined") miterLimit = 2;
          if (typeof arcTolerance === "undefined") arcTolerance = ClipperLib2.ClipperOffset.def_arc_tolerance;
          this.m_destPolys = new ClipperLib2.Paths();
          this.m_srcPoly = new ClipperLib2.Path();
          this.m_destPoly = new ClipperLib2.Path();
          this.m_normals = new Array();
          this.m_delta = 0;
          this.m_sinA = 0;
          this.m_sin = 0;
          this.m_cos = 0;
          this.m_miterLim = 0;
          this.m_StepsPerRad = 0;
          this.m_lowest = new ClipperLib2.IntPoint0();
          this.m_polyNodes = new ClipperLib2.PolyNode();
          this.MiterLimit = miterLimit;
          this.ArcTolerance = arcTolerance;
          this.m_lowest.X = -1;
        };
        ClipperLib2.ClipperOffset.two_pi = 6.28318530717959;
        ClipperLib2.ClipperOffset.def_arc_tolerance = 0.25;
        ClipperLib2.ClipperOffset.prototype.Clear = function() {
          ClipperLib2.Clear(this.m_polyNodes.Childs());
          this.m_lowest.X = -1;
        };
        ClipperLib2.ClipperOffset.Round = ClipperLib2.Clipper.Round;
        ClipperLib2.ClipperOffset.prototype.AddPath = function(path, joinType, endType) {
          var highI = path.length - 1;
          if (highI < 0)
            return;
          var newNode = new ClipperLib2.PolyNode();
          newNode.m_jointype = joinType;
          newNode.m_endtype = endType;
          if (endType === ClipperLib2.EndType.etClosedLine || endType === ClipperLib2.EndType.etClosedPolygon)
            while (highI > 0 && ClipperLib2.IntPoint.op_Equality(path[0], path[highI]))
              highI--;
          newNode.m_polygon.push(path[0]);
          var j = 0, k = 0;
          for (var i = 1; i <= highI; i++)
            if (ClipperLib2.IntPoint.op_Inequality(newNode.m_polygon[j], path[i])) {
              j++;
              newNode.m_polygon.push(path[i]);
              if (path[i].Y > newNode.m_polygon[k].Y || path[i].Y === newNode.m_polygon[k].Y && path[i].X < newNode.m_polygon[k].X)
                k = j;
            }
          if (endType === ClipperLib2.EndType.etClosedPolygon && j < 2) return;
          this.m_polyNodes.AddChild(newNode);
          if (endType !== ClipperLib2.EndType.etClosedPolygon)
            return;
          if (this.m_lowest.X < 0)
            this.m_lowest = new ClipperLib2.IntPoint2(this.m_polyNodes.ChildCount() - 1, k);
          else {
            var ip = this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon[this.m_lowest.Y];
            if (newNode.m_polygon[k].Y > ip.Y || newNode.m_polygon[k].Y === ip.Y && newNode.m_polygon[k].X < ip.X)
              this.m_lowest = new ClipperLib2.IntPoint2(this.m_polyNodes.ChildCount() - 1, k);
          }
        };
        ClipperLib2.ClipperOffset.prototype.AddPaths = function(paths, joinType, endType) {
          for (var i = 0, ilen = paths.length; i < ilen; i++)
            this.AddPath(paths[i], joinType, endType);
        };
        ClipperLib2.ClipperOffset.prototype.FixOrientations = function() {
          if (this.m_lowest.X >= 0 && !ClipperLib2.Clipper.Orientation(this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon)) {
            for (var i = 0; i < this.m_polyNodes.ChildCount(); i++) {
              var node = this.m_polyNodes.Childs()[i];
              if (node.m_endtype === ClipperLib2.EndType.etClosedPolygon || node.m_endtype === ClipperLib2.EndType.etClosedLine && ClipperLib2.Clipper.Orientation(node.m_polygon))
                node.m_polygon.reverse();
            }
          } else {
            for (var i = 0; i < this.m_polyNodes.ChildCount(); i++) {
              var node = this.m_polyNodes.Childs()[i];
              if (node.m_endtype === ClipperLib2.EndType.etClosedLine && !ClipperLib2.Clipper.Orientation(node.m_polygon))
                node.m_polygon.reverse();
            }
          }
        };
        ClipperLib2.ClipperOffset.GetUnitNormal = function(pt1, pt2) {
          var dx = pt2.X - pt1.X;
          var dy = pt2.Y - pt1.Y;
          if (dx === 0 && dy === 0)
            return new ClipperLib2.DoublePoint2(0, 0);
          var f = 1 / Math.sqrt(dx * dx + dy * dy);
          dx *= f;
          dy *= f;
          return new ClipperLib2.DoublePoint2(dy, -dx);
        };
        ClipperLib2.ClipperOffset.prototype.DoOffset = function(delta) {
          this.m_destPolys = new Array();
          this.m_delta = delta;
          if (ClipperLib2.ClipperBase.near_zero(delta)) {
            for (var i = 0; i < this.m_polyNodes.ChildCount(); i++) {
              var node = this.m_polyNodes.Childs()[i];
              if (node.m_endtype === ClipperLib2.EndType.etClosedPolygon)
                this.m_destPolys.push(node.m_polygon);
            }
            return;
          }
          if (this.MiterLimit > 2)
            this.m_miterLim = 2 / (this.MiterLimit * this.MiterLimit);
          else
            this.m_miterLim = 0.5;
          var y;
          if (this.ArcTolerance <= 0)
            y = ClipperLib2.ClipperOffset.def_arc_tolerance;
          else if (this.ArcTolerance > Math.abs(delta) * ClipperLib2.ClipperOffset.def_arc_tolerance)
            y = Math.abs(delta) * ClipperLib2.ClipperOffset.def_arc_tolerance;
          else
            y = this.ArcTolerance;
          var steps = 3.14159265358979 / Math.acos(1 - y / Math.abs(delta));
          this.m_sin = Math.sin(ClipperLib2.ClipperOffset.two_pi / steps);
          this.m_cos = Math.cos(ClipperLib2.ClipperOffset.two_pi / steps);
          this.m_StepsPerRad = steps / ClipperLib2.ClipperOffset.two_pi;
          if (delta < 0)
            this.m_sin = -this.m_sin;
          for (var i = 0; i < this.m_polyNodes.ChildCount(); i++) {
            var node = this.m_polyNodes.Childs()[i];
            this.m_srcPoly = node.m_polygon;
            var len = this.m_srcPoly.length;
            if (len === 0 || delta <= 0 && (len < 3 || node.m_endtype !== ClipperLib2.EndType.etClosedPolygon))
              continue;
            this.m_destPoly = new Array();
            if (len === 1) {
              if (node.m_jointype === ClipperLib2.JoinType.jtRound) {
                var X = 1, Y = 0;
                for (var j = 1; j <= steps; j++) {
                  this.m_destPoly.push(new ClipperLib2.IntPoint2(ClipperLib2.ClipperOffset.Round(this.m_srcPoly[0].X + X * delta), ClipperLib2.ClipperOffset.Round(this.m_srcPoly[0].Y + Y * delta)));
                  var X2 = X;
                  X = X * this.m_cos - this.m_sin * Y;
                  Y = X2 * this.m_sin + Y * this.m_cos;
                }
              } else {
                var X = -1, Y = -1;
                for (var j = 0; j < 4; ++j) {
                  this.m_destPoly.push(new ClipperLib2.IntPoint2(ClipperLib2.ClipperOffset.Round(this.m_srcPoly[0].X + X * delta), ClipperLib2.ClipperOffset.Round(this.m_srcPoly[0].Y + Y * delta)));
                  if (X < 0)
                    X = 1;
                  else if (Y < 0)
                    Y = 1;
                  else
                    X = -1;
                }
              }
              this.m_destPolys.push(this.m_destPoly);
              continue;
            }
            this.m_normals.length = 0;
            for (var j = 0; j < len - 1; j++)
              this.m_normals.push(ClipperLib2.ClipperOffset.GetUnitNormal(this.m_srcPoly[j], this.m_srcPoly[j + 1]));
            if (node.m_endtype === ClipperLib2.EndType.etClosedLine || node.m_endtype === ClipperLib2.EndType.etClosedPolygon)
              this.m_normals.push(ClipperLib2.ClipperOffset.GetUnitNormal(this.m_srcPoly[len - 1], this.m_srcPoly[0]));
            else
              this.m_normals.push(new ClipperLib2.DoublePoint1(this.m_normals[len - 2]));
            if (node.m_endtype === ClipperLib2.EndType.etClosedPolygon) {
              var k = len - 1;
              for (var j = 0; j < len; j++)
                k = this.OffsetPoint(j, k, node.m_jointype);
              this.m_destPolys.push(this.m_destPoly);
            } else if (node.m_endtype === ClipperLib2.EndType.etClosedLine) {
              var k = len - 1;
              for (var j = 0; j < len; j++)
                k = this.OffsetPoint(j, k, node.m_jointype);
              this.m_destPolys.push(this.m_destPoly);
              this.m_destPoly = new Array();
              var n = this.m_normals[len - 1];
              for (var j = len - 1; j > 0; j--)
                this.m_normals[j] = new ClipperLib2.DoublePoint2(-this.m_normals[j - 1].X, -this.m_normals[j - 1].Y);
              this.m_normals[0] = new ClipperLib2.DoublePoint2(-n.X, -n.Y);
              k = 0;
              for (var j = len - 1; j >= 0; j--)
                k = this.OffsetPoint(j, k, node.m_jointype);
              this.m_destPolys.push(this.m_destPoly);
            } else {
              var k = 0;
              for (var j = 1; j < len - 1; ++j)
                k = this.OffsetPoint(j, k, node.m_jointype);
              var pt1;
              if (node.m_endtype === ClipperLib2.EndType.etOpenButt) {
                var j = len - 1;
                pt1 = new ClipperLib2.IntPoint2(ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[j].X * delta), ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[j].Y * delta));
                this.m_destPoly.push(pt1);
                pt1 = new ClipperLib2.IntPoint2(ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].X - this.m_normals[j].X * delta), ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].Y - this.m_normals[j].Y * delta));
                this.m_destPoly.push(pt1);
              } else {
                var j = len - 1;
                k = len - 2;
                this.m_sinA = 0;
                this.m_normals[j] = new ClipperLib2.DoublePoint2(-this.m_normals[j].X, -this.m_normals[j].Y);
                if (node.m_endtype === ClipperLib2.EndType.etOpenSquare)
                  this.DoSquare(j, k);
                else
                  this.DoRound(j, k);
              }
              for (var j = len - 1; j > 0; j--)
                this.m_normals[j] = new ClipperLib2.DoublePoint2(-this.m_normals[j - 1].X, -this.m_normals[j - 1].Y);
              this.m_normals[0] = new ClipperLib2.DoublePoint2(-this.m_normals[1].X, -this.m_normals[1].Y);
              k = len - 1;
              for (var j = k - 1; j > 0; --j)
                k = this.OffsetPoint(j, k, node.m_jointype);
              if (node.m_endtype === ClipperLib2.EndType.etOpenButt) {
                pt1 = new ClipperLib2.IntPoint2(ClipperLib2.ClipperOffset.Round(this.m_srcPoly[0].X - this.m_normals[0].X * delta), ClipperLib2.ClipperOffset.Round(this.m_srcPoly[0].Y - this.m_normals[0].Y * delta));
                this.m_destPoly.push(pt1);
                pt1 = new ClipperLib2.IntPoint2(ClipperLib2.ClipperOffset.Round(this.m_srcPoly[0].X + this.m_normals[0].X * delta), ClipperLib2.ClipperOffset.Round(this.m_srcPoly[0].Y + this.m_normals[0].Y * delta));
                this.m_destPoly.push(pt1);
              } else {
                k = 1;
                this.m_sinA = 0;
                if (node.m_endtype === ClipperLib2.EndType.etOpenSquare)
                  this.DoSquare(0, 1);
                else
                  this.DoRound(0, 1);
              }
              this.m_destPolys.push(this.m_destPoly);
            }
          }
        };
        ClipperLib2.ClipperOffset.prototype.Execute = function() {
          var a = arguments, ispolytree = a[0] instanceof ClipperLib2.PolyTree;
          if (!ispolytree) {
            var solution = a[0], delta = a[1];
            ClipperLib2.Clear(solution);
            this.FixOrientations();
            this.DoOffset(delta);
            var clpr = new ClipperLib2.Clipper(0);
            clpr.AddPaths(this.m_destPolys, ClipperLib2.PolyType.ptSubject, true);
            if (delta > 0) {
              clpr.Execute(ClipperLib2.ClipType.ctUnion, solution, ClipperLib2.PolyFillType.pftPositive, ClipperLib2.PolyFillType.pftPositive);
            } else {
              var r = ClipperLib2.Clipper.GetBounds(this.m_destPolys);
              var outer = new ClipperLib2.Path();
              outer.push(new ClipperLib2.IntPoint2(r.left - 10, r.bottom + 10));
              outer.push(new ClipperLib2.IntPoint2(r.right + 10, r.bottom + 10));
              outer.push(new ClipperLib2.IntPoint2(r.right + 10, r.top - 10));
              outer.push(new ClipperLib2.IntPoint2(r.left - 10, r.top - 10));
              clpr.AddPath(outer, ClipperLib2.PolyType.ptSubject, true);
              clpr.ReverseSolution = true;
              clpr.Execute(ClipperLib2.ClipType.ctUnion, solution, ClipperLib2.PolyFillType.pftNegative, ClipperLib2.PolyFillType.pftNegative);
              if (solution.length > 0)
                solution.splice(0, 1);
            }
          } else {
            var solution = a[0], delta = a[1];
            solution.Clear();
            this.FixOrientations();
            this.DoOffset(delta);
            var clpr = new ClipperLib2.Clipper(0);
            clpr.AddPaths(this.m_destPolys, ClipperLib2.PolyType.ptSubject, true);
            if (delta > 0) {
              clpr.Execute(ClipperLib2.ClipType.ctUnion, solution, ClipperLib2.PolyFillType.pftPositive, ClipperLib2.PolyFillType.pftPositive);
            } else {
              var r = ClipperLib2.Clipper.GetBounds(this.m_destPolys);
              var outer = new ClipperLib2.Path();
              outer.push(new ClipperLib2.IntPoint2(r.left - 10, r.bottom + 10));
              outer.push(new ClipperLib2.IntPoint2(r.right + 10, r.bottom + 10));
              outer.push(new ClipperLib2.IntPoint2(r.right + 10, r.top - 10));
              outer.push(new ClipperLib2.IntPoint2(r.left - 10, r.top - 10));
              clpr.AddPath(outer, ClipperLib2.PolyType.ptSubject, true);
              clpr.ReverseSolution = true;
              clpr.Execute(ClipperLib2.ClipType.ctUnion, solution, ClipperLib2.PolyFillType.pftNegative, ClipperLib2.PolyFillType.pftNegative);
              if (solution.ChildCount() === 1 && solution.Childs()[0].ChildCount() > 0) {
                var outerNode = solution.Childs()[0];
                solution.Childs()[0] = outerNode.Childs()[0];
                solution.Childs()[0].m_Parent = solution;
                for (var i = 1; i < outerNode.ChildCount(); i++)
                  solution.AddChild(outerNode.Childs()[i]);
              } else
                solution.Clear();
            }
          }
        };
        ClipperLib2.ClipperOffset.prototype.OffsetPoint = function(j, k, jointype) {
          this.m_sinA = this.m_normals[k].X * this.m_normals[j].Y - this.m_normals[j].X * this.m_normals[k].Y;
          if (Math.abs(this.m_sinA * this.m_delta) < 1) {
            var cosA = this.m_normals[k].X * this.m_normals[j].X + this.m_normals[j].Y * this.m_normals[k].Y;
            if (cosA > 0) {
              this.m_destPoly.push(new ClipperLib2.IntPoint2(
                ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[k].X * this.m_delta),
                ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[k].Y * this.m_delta)
              ));
              return k;
            }
          } else if (this.m_sinA > 1)
            this.m_sinA = 1;
          else if (this.m_sinA < -1)
            this.m_sinA = -1;
          if (this.m_sinA * this.m_delta < 0) {
            this.m_destPoly.push(new ClipperLib2.IntPoint2(
              ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[k].X * this.m_delta),
              ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[k].Y * this.m_delta)
            ));
            this.m_destPoly.push(new ClipperLib2.IntPoint1(this.m_srcPoly[j]));
            this.m_destPoly.push(new ClipperLib2.IntPoint2(
              ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[j].X * this.m_delta),
              ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[j].Y * this.m_delta)
            ));
          } else
            switch (jointype) {
              case ClipperLib2.JoinType.jtMiter: {
                var r = 1 + (this.m_normals[j].X * this.m_normals[k].X + this.m_normals[j].Y * this.m_normals[k].Y);
                if (r >= this.m_miterLim)
                  this.DoMiter(j, k, r);
                else
                  this.DoSquare(j, k);
                break;
              }
              case ClipperLib2.JoinType.jtSquare:
                this.DoSquare(j, k);
                break;
              case ClipperLib2.JoinType.jtRound:
                this.DoRound(j, k);
                break;
            }
          k = j;
          return k;
        };
        ClipperLib2.ClipperOffset.prototype.DoSquare = function(j, k) {
          var dx = Math.tan(Math.atan2(
            this.m_sinA,
            this.m_normals[k].X * this.m_normals[j].X + this.m_normals[k].Y * this.m_normals[j].Y
          ) / 4);
          this.m_destPoly.push(new ClipperLib2.IntPoint2(
            ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_delta * (this.m_normals[k].X - this.m_normals[k].Y * dx)),
            ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_delta * (this.m_normals[k].Y + this.m_normals[k].X * dx))
          ));
          this.m_destPoly.push(new ClipperLib2.IntPoint2(
            ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_delta * (this.m_normals[j].X + this.m_normals[j].Y * dx)),
            ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_delta * (this.m_normals[j].Y - this.m_normals[j].X * dx))
          ));
        };
        ClipperLib2.ClipperOffset.prototype.DoMiter = function(j, k, r) {
          var q = this.m_delta / r;
          this.m_destPoly.push(new ClipperLib2.IntPoint2(
            ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].X + (this.m_normals[k].X + this.m_normals[j].X) * q),
            ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].Y + (this.m_normals[k].Y + this.m_normals[j].Y) * q)
          ));
        };
        ClipperLib2.ClipperOffset.prototype.DoRound = function(j, k) {
          var a = Math.atan2(
            this.m_sinA,
            this.m_normals[k].X * this.m_normals[j].X + this.m_normals[k].Y * this.m_normals[j].Y
          );
          var steps = Math.max(ClipperLib2.Cast_Int32(ClipperLib2.ClipperOffset.Round(this.m_StepsPerRad * Math.abs(a))), 1);
          var X = this.m_normals[k].X, Y = this.m_normals[k].Y, X2;
          for (var i = 0; i < steps; ++i) {
            this.m_destPoly.push(new ClipperLib2.IntPoint2(
              ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].X + X * this.m_delta),
              ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].Y + Y * this.m_delta)
            ));
            X2 = X;
            X = X * this.m_cos - this.m_sin * Y;
            Y = X2 * this.m_sin + Y * this.m_cos;
          }
          this.m_destPoly.push(new ClipperLib2.IntPoint2(
            ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[j].X * this.m_delta),
            ClipperLib2.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[j].Y * this.m_delta)
          ));
        };
        ClipperLib2.Error = function(message) {
          try {
            throw new Error(message);
          } catch (err) {
            alert(err.message);
          }
        };
        ClipperLib2.JS = {};
        ClipperLib2.JS.AreaOfPolygon = function(poly, scale) {
          if (!scale) scale = 1;
          return ClipperLib2.Clipper.Area(poly) / (scale * scale);
        };
        ClipperLib2.JS.AreaOfPolygons = function(poly, scale) {
          if (!scale) scale = 1;
          var area = 0;
          for (var i = 0; i < poly.length; i++) {
            area += ClipperLib2.Clipper.Area(poly[i]);
          }
          return area / (scale * scale);
        };
        ClipperLib2.JS.BoundsOfPath = function(path, scale) {
          return ClipperLib2.JS.BoundsOfPaths([path], scale);
        };
        ClipperLib2.JS.BoundsOfPaths = function(paths, scale) {
          if (!scale) scale = 1;
          var bounds = ClipperLib2.Clipper.GetBounds(paths);
          bounds.left /= scale;
          bounds.bottom /= scale;
          bounds.right /= scale;
          bounds.top /= scale;
          return bounds;
        };
        ClipperLib2.JS.Clean = function(polygon, delta) {
          if (!(polygon instanceof Array)) return [];
          var isPolygons = polygon[0] instanceof Array;
          var polygon = ClipperLib2.JS.Clone(polygon);
          if (typeof delta !== "number" || delta === null) {
            ClipperLib2.Error("Delta is not a number in Clean().");
            return polygon;
          }
          if (polygon.length === 0 || polygon.length === 1 && polygon[0].length === 0 || delta < 0) return polygon;
          if (!isPolygons) polygon = [polygon];
          var k_length = polygon.length;
          var len, poly, result, d, p, j, i;
          var results = [];
          for (var k = 0; k < k_length; k++) {
            poly = polygon[k];
            len = poly.length;
            if (len === 0) continue;
            else if (len < 3) {
              result = poly;
              results.push(result);
              continue;
            }
            result = poly;
            d = delta * delta;
            p = poly[0];
            j = 1;
            for (i = 1; i < len; i++) {
              if ((poly[i].X - p.X) * (poly[i].X - p.X) + (poly[i].Y - p.Y) * (poly[i].Y - p.Y) <= d)
                continue;
              result[j] = poly[i];
              p = poly[i];
              j++;
            }
            p = poly[j - 1];
            if ((poly[0].X - p.X) * (poly[0].X - p.X) + (poly[0].Y - p.Y) * (poly[0].Y - p.Y) <= d)
              j--;
            if (j < len)
              result.splice(j, len - j);
            if (result.length) results.push(result);
          }
          if (!isPolygons && results.length) results = results[0];
          else if (!isPolygons && results.length === 0) results = [];
          else if (isPolygons && results.length === 0) results = [
            []
          ];
          return results;
        };
        ClipperLib2.JS.Clone = function(polygon) {
          if (!(polygon instanceof Array)) return [];
          if (polygon.length === 0) return [];
          else if (polygon.length === 1 && polygon[0].length === 0) return [
            []
          ];
          var isPolygons = polygon[0] instanceof Array;
          if (!isPolygons) polygon = [polygon];
          var len = polygon.length, plen, i, j, result;
          var results = new Array(len);
          for (i = 0; i < len; i++) {
            plen = polygon[i].length;
            result = new Array(plen);
            for (j = 0; j < plen; j++) {
              result[j] = {
                X: polygon[i][j].X,
                Y: polygon[i][j].Y
              };
            }
            results[i] = result;
          }
          if (!isPolygons) results = results[0];
          return results;
        };
        ClipperLib2.JS.Lighten = function(polygon, tolerance) {
          if (!(polygon instanceof Array)) return [];
          if (typeof tolerance !== "number" || tolerance === null) {
            ClipperLib2.Error("Tolerance is not a number in Lighten().");
            return ClipperLib2.JS.Clone(polygon);
          }
          if (polygon.length === 0 || polygon.length === 1 && polygon[0].length === 0 || tolerance < 0) {
            return ClipperLib2.JS.Clone(polygon);
          }
          var isPolygons = polygon[0] instanceof Array;
          if (!isPolygons) polygon = [polygon];
          var i, j, poly, k, poly2, plen, A, B, P, d, rem, addlast;
          var bxax, byay, l, ax, ay;
          var len = polygon.length;
          var toleranceSq = tolerance * tolerance;
          var results = [];
          for (i = 0; i < len; i++) {
            poly = polygon[i];
            plen = poly.length;
            if (plen === 0) continue;
            for (k = 0; k < 1e6; k++) {
              poly2 = [];
              plen = poly.length;
              if (poly[plen - 1].X !== poly[0].X || poly[plen - 1].Y !== poly[0].Y) {
                addlast = 1;
                poly.push(
                  {
                    X: poly[0].X,
                    Y: poly[0].Y
                  }
                );
                plen = poly.length;
              } else addlast = 0;
              rem = [];
              for (j = 0; j < plen - 2; j++) {
                A = poly[j];
                P = poly[j + 1];
                B = poly[j + 2];
                ax = A.X;
                ay = A.Y;
                bxax = B.X - ax;
                byay = B.Y - ay;
                if (bxax !== 0 || byay !== 0) {
                  l = ((P.X - ax) * bxax + (P.Y - ay) * byay) / (bxax * bxax + byay * byay);
                  if (l > 1) {
                    ax = B.X;
                    ay = B.Y;
                  } else if (l > 0) {
                    ax += bxax * l;
                    ay += byay * l;
                  }
                }
                bxax = P.X - ax;
                byay = P.Y - ay;
                d = bxax * bxax + byay * byay;
                if (d <= toleranceSq) {
                  rem[j + 1] = 1;
                  j++;
                }
              }
              poly2.push(
                {
                  X: poly[0].X,
                  Y: poly[0].Y
                }
              );
              for (j = 1; j < plen - 1; j++)
                if (!rem[j]) poly2.push(
                  {
                    X: poly[j].X,
                    Y: poly[j].Y
                  }
                );
              poly2.push(
                {
                  X: poly[plen - 1].X,
                  Y: poly[plen - 1].Y
                }
              );
              if (addlast) poly.pop();
              if (!rem.length) break;
              else poly = poly2;
            }
            plen = poly2.length;
            if (poly2[plen - 1].X === poly2[0].X && poly2[plen - 1].Y === poly2[0].Y) {
              poly2.pop();
            }
            if (poly2.length > 2)
              results.push(poly2);
          }
          if (!isPolygons) {
            results = results[0];
          }
          if (typeof results === "undefined") {
            results = [];
          }
          return results;
        };
        ClipperLib2.JS.PerimeterOfPath = function(path, closed, scale) {
          if (typeof path === "undefined") return 0;
          var sqrt = Math.sqrt;
          var perimeter = 0;
          var p1, p2, p1x = 0, p1y = 0, p2x = 0, p2y = 0;
          var j = path.length;
          if (j < 2) return 0;
          if (closed) {
            path[j] = path[0];
            j++;
          }
          while (--j) {
            p1 = path[j];
            p1x = p1.X;
            p1y = p1.Y;
            p2 = path[j - 1];
            p2x = p2.X;
            p2y = p2.Y;
            perimeter += sqrt((p1x - p2x) * (p1x - p2x) + (p1y - p2y) * (p1y - p2y));
          }
          if (closed) path.pop();
          return perimeter / scale;
        };
        ClipperLib2.JS.PerimeterOfPaths = function(paths, closed, scale) {
          if (!scale) scale = 1;
          var perimeter = 0;
          for (var i = 0; i < paths.length; i++) {
            perimeter += ClipperLib2.JS.PerimeterOfPath(paths[i], closed, scale);
          }
          return perimeter;
        };
        ClipperLib2.JS.ScaleDownPath = function(path, scale) {
          var i, p;
          if (!scale) scale = 1;
          i = path.length;
          while (i--) {
            p = path[i];
            p.X = p.X / scale;
            p.Y = p.Y / scale;
          }
        };
        ClipperLib2.JS.ScaleDownPaths = function(paths, scale) {
          var i, j, p;
          if (!scale) scale = 1;
          i = paths.length;
          while (i--) {
            j = paths[i].length;
            while (j--) {
              p = paths[i][j];
              p.X = p.X / scale;
              p.Y = p.Y / scale;
            }
          }
        };
        ClipperLib2.JS.ScaleUpPath = function(path, scale) {
          var i, p, round = Math.round;
          if (!scale) scale = 1;
          i = path.length;
          while (i--) {
            p = path[i];
            p.X = round(p.X * scale);
            p.Y = round(p.Y * scale);
          }
        };
        ClipperLib2.JS.ScaleUpPaths = function(paths, scale) {
          var i, j, p, round = Math.round;
          if (!scale) scale = 1;
          i = paths.length;
          while (i--) {
            j = paths[i].length;
            while (j--) {
              p = paths[i][j];
              p.X = round(p.X * scale);
              p.Y = round(p.Y * scale);
            }
          }
        };
        ClipperLib2.ExPolygons = function() {
          return [];
        };
        ClipperLib2.ExPolygon = function() {
          this.outer = null;
          this.holes = null;
        };
        ClipperLib2.JS.AddOuterPolyNodeToExPolygons = function(polynode, expolygons) {
          var ep = new ClipperLib2.ExPolygon();
          ep.outer = polynode.Contour();
          var childs = polynode.Childs();
          var ilen = childs.length;
          ep.holes = new Array(ilen);
          var node, n, i, j, childs2, jlen;
          for (i = 0; i < ilen; i++) {
            node = childs[i];
            ep.holes[i] = node.Contour();
            for (j = 0, childs2 = node.Childs(), jlen = childs2.length; j < jlen; j++) {
              n = childs2[j];
              ClipperLib2.JS.AddOuterPolyNodeToExPolygons(n, expolygons);
            }
          }
          expolygons.push(ep);
        };
        ClipperLib2.JS.ExPolygonsToPaths = function(expolygons) {
          var a, i, alen, ilen;
          var paths = new ClipperLib2.Paths();
          for (a = 0, alen = expolygons.length; a < alen; a++) {
            paths.push(expolygons[a].outer);
            for (i = 0, ilen = expolygons[a].holes.length; i < ilen; i++) {
              paths.push(expolygons[a].holes[i]);
            }
          }
          return paths;
        };
        ClipperLib2.JS.PolyTreeToExPolygons = function(polytree) {
          var expolygons = new ClipperLib2.ExPolygons();
          var node, i, childs, ilen;
          for (i = 0, childs = polytree.Childs(), ilen = childs.length; i < ilen; i++) {
            node = childs[i];
            ClipperLib2.JS.AddOuterPolyNodeToExPolygons(node, expolygons);
          }
          return expolygons;
        };
      })();
    }
  });

  // src/core/kernel.ts
  function deriveEdificio(edificio) {
    return { ...edificio, cumbreraMaxima: edificio.alturaMaxima + 2 };
  }
  function derivePatio(patio) {
    const esVentilacion = patio.tipo === "ventilacion";
    return {
      ...patio,
      diametroMinimoRequerido: esVentilacion ? Math.max(2, patio.alturaVinculada / 5) : Math.max(3, patio.alturaVinculada / 3)
    };
  }

  // src/core/geometry.ts
  var import_clipper_lib = __toESM(require_clipper(), 1);
  function distanciaPuntoSegmento(p, a, b) {
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const apx = p.x - a.x;
    const apy = p.y - a.y;
    const ab2 = abx * abx + aby * aby;
    if (ab2 === 0) return Math.hypot(apx, apy);
    const t2 = (apx * abx + apy * aby) / ab2;
    const tClamped = Math.max(0, Math.min(1, t2));
    return Math.hypot(p.x - (a.x + tClamped * abx), p.y - (a.y + tClamped * aby));
  }
  function distanciaSegmentoAPoligono(a, b, poligono) {
    let min = Infinity;
    for (const p of poligono) {
      min = Math.min(min, distanciaPuntoSegmento(p, a, b));
    }
    for (let i = 0; i < poligono.length; i++) {
      const q1 = poligono[i];
      const q2 = poligono[(i + 1) % poligono.length];
      min = Math.min(min, distanciaPuntoSegmento(a, q1, q2));
      min = Math.min(min, distanciaPuntoSegmento(b, q1, q2));
    }
    return min;
  }
  function distanciaHuellaLindero(huella2, lindero) {
    return distanciaSegmentoAPoligono(lindero.a, lindero.b, huella2);
  }
  function distanciaMinimaLinderos(huella2, linderos) {
    if (huella2.length < 3 || linderos.length === 0) return void 0;
    let min = Infinity;
    for (const lindero of linderos) {
      min = Math.min(min, distanciaHuellaLindero(huella2, lindero));
    }
    return Number.isFinite(min) ? min : void 0;
  }
  function distanciaSegmentoSegmento(a1, a2, b1, b2) {
    return Math.min(
      distanciaPuntoSegmento(a1, b1, b2),
      distanciaPuntoSegmento(a2, b1, b2),
      distanciaPuntoSegmento(b1, a1, a2),
      distanciaPuntoSegmento(b2, a1, a2)
    );
  }
  function distanciaEntrePoligonos(p1, p2) {
    let min = Infinity;
    for (let i = 0; i < p1.length; i++) {
      const a1 = p1[i];
      const a2 = p1[(i + 1) % p1.length];
      for (let j = 0; j < p2.length; j++) {
        min = Math.min(min, distanciaSegmentoSegmento(a1, a2, p2[j], p2[(j + 1) % p2.length]));
      }
    }
    return min;
  }
  function areaPoligono(poligono) {
    let area = 0;
    for (let i = 0; i < poligono.length; i++) {
      const p1 = poligono[i];
      const p2 = poligono[(i + 1) % poligono.length];
      area += p1.x * p2.y - p2.x * p1.y;
    }
    return Math.abs(area) / 2;
  }
  function orientarCCW(poligono) {
    let area = 0;
    for (let i = 0; i < poligono.length; i++) {
      const p1 = poligono[i];
      const p2 = poligono[(i + 1) % poligono.length];
      area += p1.x * p2.y - p2.x * p1.y;
    }
    return area < 0 ? [...poligono].reverse() : [...poligono];
  }
  function puntoEnPoligono(p, poligono) {
    let dentro = false;
    for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
      const pi = poligono[i];
      const pj = poligono[j];
      if (pi.y > p.y !== pj.y > p.y && p.x < (pj.x - pi.x) * (p.y - pi.y) / (pj.y - pi.y) + pi.x) {
        dentro = !dentro;
      }
    }
    return dentro;
  }
  var CLIPPER_ESCALA = 1e3;
  function deGeograficaAUTM(latGrados, lonGrados) {
    const a = 6378137;
    const f = 1 / 298.257223563;
    const k0 = 0.9996;
    const zona = Math.floor((lonGrados + 180) / 6) + 1;
    const lon0 = (zona * 6 - 183) * (Math.PI / 180);
    const phi = latGrados * (Math.PI / 180);
    const lam = lonGrados * (Math.PI / 180);
    const e2 = f * (2 - f);
    const ep2 = e2 / (1 - e2);
    const N = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2);
    const T = Math.tan(phi) ** 2;
    const C = ep2 * Math.cos(phi) ** 2;
    const A = (lam - lon0) * Math.cos(phi);
    const e4 = e2 * e2;
    const e6 = e4 * e2;
    const M = a * ((1 - e2 / 4 - 3 * e4 / 64 - 5 * e6 / 256) * phi - (3 * e2 / 8 + 3 * e4 / 32 + 45 * e6 / 1024) * Math.sin(2 * phi) + (15 * e4 / 256 + 45 * e6 / 1024) * Math.sin(4 * phi) - 35 * e6 / 3072 * Math.sin(6 * phi));
    const x = k0 * N * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T * T + 72 * C - 58 * ep2) * A ** 5 / 120) + 5e5;
    const y = k0 * (M + N * Math.tan(phi) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A ** 4 / 24 + (61 - 58 * T + T * T + 600 * C - 330 * ep2) * A ** 6 / 720));
    return { x, y };
  }
  function aClipper(puntos) {
    return puntos.map((p) => ({ X: Math.round(p.x * CLIPPER_ESCALA), Y: Math.round(p.y * CLIPPER_ESCALA) }));
  }
  function desdeClipper(puntos) {
    return puntos.map((p) => ({ x: p.X / CLIPPER_ESCALA, y: p.Y / CLIPPER_ESCALA }));
  }
  function poligonoOffsetInterior(poligono, d) {
    if (poligono.length < 3) return [];
    if (d <= 0) return orientarCCW(poligono);
    const clipper = new import_clipper_lib.default.ClipperOffset(2, 0.25 * CLIPPER_ESCALA);
    clipper.AddPath(aClipper(orientarCCW(poligono)), import_clipper_lib.default.JoinType.jtMiter, import_clipper_lib.default.EndType.etClosedPolygon);
    const solucion = new import_clipper_lib.default.Paths();
    clipper.Execute(solucion, -d * CLIPPER_ESCALA);
    let mejor = [];
    let mejorArea = 0;
    for (const camino of solucion) {
      if (camino.length < 3) continue;
      const puntos = desdeClipper(camino);
      const area = areaPoligono(puntos);
      if (area > mejorArea) {
        mejor = puntos;
        mejorArea = area;
      }
    }
    return mejor;
  }

  // src/core/derive.ts
  function buildModel(kernel) {
    const parcela = { ...kernel.parcela };
    if (kernel.parcela.contorno && kernel.parcela.contorno.length >= 3) {
      parcela.superficie = areaPoligono(kernel.parcela.contorno);
    }
    const frontales = kernel.parcela.linderos.filter((l) => l.tipo === "frontal");
    if (frontales.length > 0) {
      parcela.longitudLinderoFrontal = Math.max(
        ...frontales.map((l) => Math.hypot(l.b.x - l.a.x, l.b.y - l.a.y))
      );
    }
    const edificio = { ...deriveEdificio(kernel.edificio) };
    if (kernel.edificio.huella.length >= 3) {
      edificio.superficieOcupadaProyectada = areaPoligono(kernel.edificio.huella);
      const distancia = distanciaMinimaLinderos(kernel.edificio.huella, kernel.parcela.linderos);
      if (distancia !== void 0) edificio.distanciaMinimaLinderos = distancia;
      let fachadaMax = 0;
      for (let i = 0; i < kernel.edificio.huella.length; i++) {
        const p1 = kernel.edificio.huella[i];
        const p2 = kernel.edificio.huella[(i + 1) % kernel.edificio.huella.length];
        fachadaMax = Math.max(fachadaMax, Math.hypot(p2.x - p1.x, p2.y - p1.y));
      }
      edificio.longitudMaximaFachada = fachadaMax;
    }
    const model = {
      parcela,
      edificio,
      entities: kernel.entities
    };
    if (kernel.patio) model.patio = derivePatio(kernel.patio);
    if (kernel.patioVentilacion) model.patioVentilacion = derivePatio(kernel.patioVentilacion);
    if (kernel.patioManzana) model.patioManzana = { ...kernel.patioManzana };
    if (kernel.espacio) model.espacio = { ...kernel.espacio };
    if (kernel.edificio.huellaSotano && kernel.edificio.huellaSotano.length >= 3) {
      edificio.superficieSotano = areaPoligono(kernel.edificio.huellaSotano);
    }
    if (kernel.edificios && kernel.edificios.length >= 2) {
      const edificios = kernel.edificios;
      let mejor;
      for (let i = 0; i < edificios.length; i++) {
        for (let j = i + 1; j < edificios.length; j++) {
          const a = edificios[i];
          const b = edificios[j];
          const distancia = distanciaEntrePoligonos(a.huella, b.huella);
          const requerida = a.alturaMaxima === b.alturaMaxima ? a.alturaMaxima : (a.alturaMaxima + b.alturaMaxima) / 2;
          if (!mejor || distancia - requerida < mejor.distancia - mejor.requerida) {
            mejor = { distancia, requerida };
          }
        }
      }
      if (mejor) {
        model.edificios = {
          distanciaMinimaEntreEdificios: mejor.distancia,
          separacionRequeridaEntreEdificios: mejor.requerida
        };
      }
    }
    return model;
  }

  // src/core/catastro.ts
  function parsearParcelasGML(xml) {
    const parcelas = [];
    const bloques = xml.match(/<cp:CadastralParcel[\s\S]*?<\/cp:CadastralParcel>/g) ?? [];
    for (const bloque of bloques) {
      const ref = bloque.match(/<cp:nationalCadastralReference>([^<]+)<\/cp:nationalCadastralReference>/)?.[1];
      const area = Number(bloque.match(/<cp:areaValue uom="m2">([\d.]+)</)?.[1] ?? 0);
      const posList = bloque.match(/<gml:posList[^>]*>([^<]+)<\/gml:posList>/)?.[1];
      if (!ref || !posList) continue;
      const coords = posList.trim().split(/\s+/).map(Number);
      const puntos = [];
      for (let i = 0; i < coords.length - 1; i += 2) puntos.push({ x: coords[i], y: coords[i + 1] });
      if (puntos.length > 2) {
        const primero = puntos[0];
        const ultimo = puntos[puntos.length - 1];
        if (Math.abs(primero.x - ultimo.x) < 0.01 && Math.abs(primero.y - ultimo.y) < 0.01) puntos.pop();
      }
      parcelas.push({ ref, area, puntos });
    }
    return parcelas;
  }
  function tiparLinderos(puntos) {
    const lados = [];
    for (let i = 0; i < puntos.length; i++) {
      const a = puntos[i];
      const b = puntos[(i + 1) % puntos.length];
      lados.push({ a, b, longitud: Math.hypot(b.x - a.x, b.y - a.y) });
    }
    const frontal = lados.reduce((max, l) => l.longitud > max.longitud ? l : max, lados[0]);
    const medioFrontal = { x: (frontal.a.x + frontal.b.x) / 2, y: (frontal.a.y + frontal.b.y) / 2 };
    let testero;
    let maxDist = -1;
    for (const lado of lados) {
      if (lado === frontal) continue;
      const medio = { x: (lado.a.x + lado.b.x) / 2, y: (lado.a.y + lado.b.y) / 2 };
      const dist = Math.hypot(medio.x - medioFrontal.x, medio.y - medioFrontal.y);
      if (dist > maxDist) {
        maxDist = dist;
        testero = lado;
      }
    }
    return lados.map((lado) => ({
      a: lado.a,
      b: lado.b,
      tipo: lado === frontal ? "frontal" : lado === testero ? "testero" : "lateral"
    }));
  }
  function compacidad(parcela) {
    const xs = parcela.puntos.map((q) => q.x);
    const ys = parcela.puntos.map((q) => q.y);
    const bbox = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
    return bbox > 0 ? parcela.area / bbox : 0;
  }
  function urlWFSParcelasPorPunto(x, y, radio, count = 30) {
    const bbox = `${x - radio},${y - radio},${x + radio},${y + radio}`;
    return `https://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?request=GetFeature&typenames=cp:CadastralParcel&srsname=urn:ogc:def:crs:EPSG::25830&bbox=${bbox}&count=${count}`;
  }
  function esRefEstandar(ref) {
    return /^\d{5}[A-Z]/.test(ref);
  }
  function seleccionarParcelaRepresentativa(parcelas, minArea = 150, maxArea = 5e3, punto) {
    if (punto) {
      const dentro = parcelas.filter((p) => p.puntos.length >= 3 && puntoEnPoligono(punto, p.puntos));
      if (dentro.length > 0) {
        const estandarDentro = dentro.filter((p) => esRefEstandar(p.ref));
        return (estandarDentro.length > 0 ? estandarDentro : dentro)[0];
      }
    }
    const candidatas = parcelas.filter((p) => p.area >= minArea && p.area <= maxArea && p.puntos.length >= 3);
    if (candidatas.length === 0) return void 0;
    const estandar = candidatas.filter((p) => esRefEstandar(p.ref));
    const pool = estandar.length > 0 ? estandar : candidatas;
    return pool.sort((a, b) => compacidad(b) - compacidad(a))[0];
  }

  // src/engine/evaluator.ts
  var OPERATORS = {
    "<": (a, b) => a < b,
    "<=": (a, b) => a <= b,
    ">": (a, b) => a > b,
    ">=": (a, b) => a >= b,
    "==": (a, b) => a === b,
    "!=": (a, b) => a !== b
  };
  function resolveParameter(path, model) {
    let current = model;
    for (const key of path.split(".")) {
      if (current === null || current === void 0) return void 0;
      if (typeof current !== "object") return void 0;
      current = current[key];
    }
    return typeof current === "number" ? current : void 0;
  }
  function isRatioCondition(condition) {
    return "numerator" in condition;
  }
  function checkCondition(condition, model) {
    if (isRatioCondition(condition)) {
      const numerator = resolveParameter(condition.numerator, model);
      const denominator = resolveParameter(condition.denominator, model);
      if (numerator === void 0 || denominator === void 0 || denominator === 0) return false;
      return OPERATORS[condition.operator](numerator / denominator, condition.value);
    }
    const value = resolveParameter(condition.parameter, model);
    if (value === void 0) return false;
    const thresholdRaw = condition.value;
    const threshold = typeof thresholdRaw === "number" ? thresholdRaw : (resolveParameter(thresholdRaw.param, model) ?? 0) * (thresholdRaw.factor ?? 1);
    if (threshold === void 0) return false;
    return OPERATORS[condition.operator](value, threshold);
  }
  function checkGroup(group, model) {
    const results = group.items.map((c) => ({ c, hit: checkCondition(c, model) }));
    const failed = results.filter((r) => r.hit).map((r) => r.c);
    if (group.mode === "all") return failed.length === group.items.length ? failed : [];
    return failed.length > 0 ? failed : [];
  }
  function evaluateRule(rule, model) {
    const failed = checkGroup(rule.conditions, model);
    if (failed.length === 0) return null;
    return {
      ruleId: rule.id,
      severity: rule.severity,
      message: rule.message,
      source: rule.source,
      failed
    };
  }

  // src/ui/vista.ts
  function estadoGlobal(rs, sinEnvolvente) {
    if (sinEnvolvente) return "sin-envolvente";
    if (rs.some((r) => !r.cumple && r.severidad === "bloqueo")) return "rojo";
    if (rs.some((r) => !r.cumple && r.severidad === "ambar")) return "ambar";
    return "verde";
  }
  function pasos(rs) {
    const peso = (r) => (r.severidad === "bloqueo" ? 0 : 2) + (r.anclaPlano ? 0 : 1);
    return rs.filter((r) => !r.cumple).sort((a, b) => peso(a) - peso(b)).map((r, i) => ({ ...r, n: i + 1 }));
  }
  var fmt = (v, d = 2) => v.toFixed(d).replace(".", ",");

  // src/ui/i18n.ts
  var idioma = "es";
  function setIdioma(i) {
    idioma = i;
  }
  function getIdioma() {
    return idioma;
  }
  var DICT = {
    /* Header */
    "cargar-ifc": ["Cargar IFC", "Load IFC"],
    "informe": ["Informe", "Report"],
    "idioma-es": ["Espa\xF1ol", "Spanish"],
    "idioma-en": ["English", "English"],
    /* Búsqueda */
    "placeholder-dir": ["Direcci\xF3n de tu proyecto", "Your project address"],
    "buscar": ["Buscar", "Search"],
    "buscando": ["Buscando direcci\xF3n\u2026", "Searching address\u2026"],
    "parcela-cargada": ["Parcela", "Parcel"],
    "cargada": ["cargada", "loaded"],
    "cal-ruais": ["calificaci\xF3n RUAIS detectada en la capa del PGOU", "RUAIS zoning detected in the plan layer"],
    "cal-otra": ["la capa indica calificaci\xF3n", "the layer shows zoning"],
    "cal-otra2": [": sin pack para evaluarla", ": no pack available to evaluate it"],
    "cal-sin": ["sin cobertura en la capa de calificaciones: zona pendiente de trazado", "no coverage in the zoning layer: area pending tracing"],
    "no-encontre": ["No encontr\xE9 esa parcela", "Parcel not found"],
    "consultando": ["Consultando el catastro\u2026", "Querying the cadastre\u2026"],
    /* Franja */
    "altura-max": ["Altura m\xE1xima", "Maximum height"],
    "fija-norma": ["fija la norma \xB7 art.", "set by the code \xB7 art."],
    "sin-regla": ["sin regla en el pack", "no rule in the pack"],
    "plantas": ["Plantas", "Floors"],
    "max-construible": ["m\xE1ximo construible:", "maximum buildable:"],
    "planta-sing": ["planta", "floor"],
    "planta-plur": ["plantas", "floors"],
    /* Leyenda */
    "ley-zona": ["zona construible \xB7 retranqueo m\xEDn. 3 m", "buildable area \xB7 minimum setback 3 m"],
    "ley-frente": ["frente a v\xEDa p\xFAblica", "frontage to public road"],
    /* Estado vacío */
    "empieza": ["EMPIEZA AQU\xCD", "START HERE"],
    "busca-parcela": ["Busca una parcela.", "Search for a parcel."],
    "busca-hint": ["Escribe una direcci\xF3n o coordenadas en la barra superior y pulsa Buscar.", "Type an address or coordinates in the top bar and press Search."],
    "plano-vacio": ["Busca una parcela para empezar", "Search for a parcel to start"],
    /* Veredicto */
    "rojo": ["ROJO", "RED"],
    "ambar": ["\xC1MBAR", "AMBER"],
    "verde": ["VERDE", "GREEN"],
    "sin-modelo": ["SIN MODELO", "NO MODEL"],
    "sin-pack": ["SIN PACK", "NO PACK"],
    "h1-rojo": ["A\xFAn no es tramitable.", "Not submittable yet."],
    "h1-ambar": ["Tramitable, con una condici\xF3n.", "Submittable, with one condition."],
    "h1-verde": ["Tramitable.", "Submittable."],
    "h1-sin-modelo": ["Sin modelo a\xFAn.", "No model yet."],
    "h1-no-cabe": ["No cabe edificio.", "No building fits."],
    "sub-rojo-plur": ["incumplimientos", "violations"],
    "sub-rojo-sing": ["incumplimiento", "violation"],
    "sub-ambar": ["falta confirmar un dato del sitio", "one site condition needs confirmation"],
    "sub-verde": ["sin incumplimientos en lo evaluado", "no violations in what was evaluated"],
    "sub-sin-modelo": ["la huella y la ocupaci\xF3n nacen al modelar tu primer elemento", "the footprint and build-out come alive when you model your first element"],
    "sub-no-huella": ["la forma modelada no genera huella v\xE1lida", "the modeled shape yields no valid footprint"],
    "sub-no-evaluable": ["el pack cargado solo eval\xFAa RUAIS", "the loaded pack only evaluates RUAIS"],
    "cumple-de": ["Cumple", "Meets"],
    "de-articulos": ["de", "of"],
    "evaluados": ["art\xEDculos evaluados", "articles evaluated"],
    "lo-que-falta": ["Lo que falta", "What is missing"],
    "la-norma-dice": ["LA NORMA DICE", "THE CODE SAYS"],
    "huella-de": ["huella de", "footprint of"],
    /* Paso modelo */
    "paso-modelo": ["Dibuja el per\xEDmetro para calcular", "Draw the perimeter to calculate"],
    "paso-modelo-det": ["La huella, la ocupaci\xF3n y el retranqueo nacen al modelar tu primer elemento", "Footprint, build-out and setback are born when you model your first element"],
    "paso-modelo-tools": ["herramientas \u25AD y \u2B21 sobre el plano \xB7 o importa tu modelo con Cargar IFC", "tools \u25AD and \u2B21 on the plan \xB7 or import your model with Load IFC"],
    /* Acciones de reglas */
    "accion-altura": ["Baja la altura", "Lower the height"],
    "accion-separar": ["Separa", "Set back"],
    "mas-de-cada-lindero": ["m m\xE1s de cada lindero", "m more from each boundary"],
    "accion-ocupacion": ["Reduce la huella", "Reduce the footprint"],
    "accion-edificabilidad": ["Quita", "Remove"],
    "m2-construidos": ["m\xB2 construidos", "m\xB2 built"],
    "exige": ["Exige", "Requires"],
    "tienes": ["tienes", "you have"],
    "nombre-altura": ["altura", "height"],
    "nombre-separacion": ["separaci\xF3n", "setback"],
    "nombre-ocupacion": ["ocupaci\xF3n", "footprint"],
    "nombre-edificabilidad": ["edificabilidad", "buildability"],
    "nombre-patio": ["patio", "courtyard"],
    "revisa-linderos": ["Confirma qu\xE9 lindero da a la v\xEDa p\xFAblica", "Confirm which boundary faces the public road"],
    /* Condiciones de sitio */
    "sitio-lind-accion": ["Confirma qu\xE9 lindero da a la v\xEDa p\xFAblica", "Confirm which boundary faces the public road"],
    "sitio-lind-exige": ["revisi\xF3n humana", "human review"],
    "sitio-lind-conf": ["confirmado", "confirmed"],
    "sitio-lind-sinconf": ["sin confirmar", "unconfirmed"],
    "sitio-lind-nombre": ["linderos", "boundaries"],
    "sitio-cal-nombre": ["calificaci\xF3n", "zoning"],
    "sitio-cal-exige": ["cobertura de la capa de calificaciones", "zoning layer coverage"],
    "sitio-cal-ok": ["RUAIS en zona trazada", "RUAIS in a traced area"],
    "sitio-cal-sin": ["zona sin cobertura en la capa", "area without layer coverage"],
    "sitio-cal-accion": ["Zona pendiente de trazado en la capa \u2014 el equipo la verifica contra el plano de usos", "Area pending tracing in the layer \u2014 the team verifies it against the official use plan"],
    /* Modal lindero */
    "modal-lind-over": ["CONFIRMA EL SITIO", "CONFIRM THE SITE"],
    "modal-lind-preg": ["\xBFEs este lindero el frente a la v\xEDa p\xFAblica?", "Is this boundary the frontage to the public road?"],
    "modal-lind-si": ["S\xED, es el frente", "Yes, it is the frontage"],
    "cancelar": ["Cancelar", "Cancel"],
    /* Modal calificación */
    "modal-cal-over": ["CAPA DE CALIFICACIONES", "ZONING LAYER"],
    "modal-cal-preg": ["\xBFQu\xE9 calificaci\xF3n tiene el pol\xEDgono trazado?", "What zoning does the traced polygon have?"],
    "modal-cal-anadir": ["A\xF1adir a la capa", "Add to layer"],
    "modal-cal-descartar": ["Descartar", "Discard"],
    "modal-cal-pista": ["traza el contorno de la zona de unifamiliares: sus bordes son calles o el cambio de tejido visible en la foto", "trace the detached-houses area: its edges are streets or the visible fabric change in the photo"],
    "cal-ruais-op": ["RUAIS (unifamiliar aislada)", "RUAIS (detached single-family)"],
    "cal-ruas-op": ["RUAS (residencial en suelo urbano)", "RUAS (urban residential)"],
    "cal-casco-op": ["Casco urbano", "Urban core"],
    "cal-otra-op": ["Otra / sin determinar", "Other / undetermined"],
    /* Mensajes de herramientas */
    "no-cabe": ["No cabe dentro de la zona construible; reduce las medidas.", "It does not fit in the buildable area; reduce the dimensions."],
    "no-cabe-medidas": ["Con esas medidas el elemento no cabe en la zona construible.", "With those dimensions the element does not fit in the buildable area."],
    "forma-se-sale": ["La forma se sale de la zona construible: ajusta los v\xE9rtices.", "The shape leaves the buildable area: adjust the vertices."],
    "alineacion-no-cabe": ["La alineaci\xF3n saca el elemento de la zona construible: no cabe contra esa cara.", "The alignment takes the element out of the buildable area: it does not fit against that face."],
    "elige-otra-cara": ["Elige una cara de otro elemento o del per\xEDmetro de la zona.", "Choose a face of another element or of the area perimeter."],
    "pulsa-cara": ["Pulsa sobre un elemento o sobre el per\xEDmetro de la zona para elegir la cara.", "Click an element or the area perimeter to choose a face."],
    "largo": ["largo", "length"],
    "ancho": ["ancho", "width"],
    "aplicar": ["Aplicar", "Apply"],
    /* Zona del plano */
    "zona-no-evaluable": ["Zona", "Zoning"],
    "no-pack-zona": [": no hay pack para evaluarla", ": no pack available to evaluate it"],
    /* Textos normativos (traducci\u00f3n no oficial del PGOU) */
    "norma-01A": [
      "La altura m\xE1xima, medida en unidades m\xE9tricas, es la distancia desde la cota de referencia hasta la intersecci\xF3n de la cara superior del forjado que forma el techo de la \xFAltima planta con el plano de la fachada del edificio. La altura m\xE1xima se fija en las condiciones de calificaci\xF3n como valor l\xEDmite.",
      "The maximum height, measured in metric units, is the distance from the reference level to the intersection of the upper face of the slab forming the roof of the top floor with the plane of the building fa\xE7ade. The maximum height is set in the zoning conditions as a limit value."
    ],
    "norma-01B": [
      "Para edificios de dos plantas, se fija una altura m\xE1xima de setecientos noventa (790) cent\xEDmetros.",
      "For two-storey buildings, a maximum height of seven hundred and ninety (790) centimetres is set."
    ],
    "norma-01C": [
      "Para edificios de tres plantas, se fija una altura m\xE1xima de mil ciento veinte (1120) cent\xEDmetros.",
      "For three-storey buildings, a maximum height of one thousand one hundred and twenty (1120) centimetres is set."
    ],
    "norma-02": [
      "En el caso de proyectos unitarios de viviendas aisladas, dichos retranqueos obedecer\xE1n a ritmos uniformes, siendo sus valores m\xEDnimos de tres (3) metros.",
      "For single-family detached projects, setbacks shall follow uniform rhythms, with minimum values of three (3) metres."
    ],
    "norma-03": [
      "La ocupaci\xF3n m\xE1xima en planta ser\xE1 de un treinta por ciento, 30%, de la superficie de parcela para cada una de las plantas de la edificaci\xF3n, incluida la baja.",
      "The maximum footprint per floor shall be thirty percent, 30%, of the plot area for each of the building's floors, including the ground floor."
    ],
    "norma-04B": [
      "La edificaci\xF3n de nueva planta tendr\xE1 una edificabilidad neta en funci\xF3n del n\xFAmero de plantas m\xE1ximo autorizado\u2026 para edificios de dos plantas: 0,60 m2 t/m2s.",
      "New-build construction shall have a net buildability depending on the maximum number of authorised storeys\u2026 for two-storey buildings: 0.60 m\xB2 built / m\xB2 plot."
    ],
    "norma-05": [
      "La dimensi\xF3n de cualquier lado del patio ser\xE1 igual o superior a trescientos (300) cent\xEDmetros.",
      "Any side of the courtyard shall be equal to or greater than three hundred (300) centimetres."
    ],
    "norma-sitio-lind": [
      "Condici\xF3n del sitio: en parcelas con m\xE1s de un lindero en contacto con vial o espacio p\xFAblico, todos tienen consideraci\xF3n de lindero frontal (PGOU, art. 7.3.6). Confirma cu\xE1l da a la v\xEDa p\xFAblica antes de tramitar.",
      "Site condition: on plots with more than one boundary in contact with a public way or space, all are considered front boundaries (PGOU, art. 7.3.6). Confirm which one faces the public road before submitting."
    ],
    "norma-sitio-cal": [
      "El PGOU divide el municipio en zonas con reglas distintas (RUAIS, RUAS, casco, planes especiales\u2026). El pack cargado solo eval\xFAa RUAIS (art. 7.11): viviendas unifamiliares aisladas. La calificaci\xF3n la determina la capa de calificaciones del PGOU que carga la herramienta; las zonas las traza y verifica el equipo MonoLite contra el plano de usos oficial.",
      "The PGOU divides the municipality into zones with different rules (RUAIS, RUAS, urban core, special plans\u2026). The loaded pack only evaluates RUAIS (art. 7.11): detached single-family housing. Zoning is determined by the PGOU zoning layer loaded by the tool; areas are traced and verified by the MonoLite team against the official use plan."
    ],
    "art-sitio-lind": ["Art. 7.3.6 \xB7 condici\xF3n de sitio", "Art. 7.3.6 \xB7 site condition"],
    "art-sitio-cal": ["Art. 7.11 \xB7 condici\xF3n de sitio", "Art. 7.11 \xB7 site condition"],
    "fuente": ["PGOU Granada 2001 \xB7 T\xEDtulo S\xE9ptimo", "PGOU Granada 2001 \xB7 Title VII"],
    "fuente-norma": ["PGOU Granada 2001", "PGOU Granada 2001"],
    /* Idioma */
    "tt-crear": ["Crear volumen rectangular", "Create rectangular volume"],
    "tt-vertices": ["Dibujar por v\xE9rtices", "Draw by vertices"],
    "tt-girar": ["Girar libremente", "Rotate freely"],
    "tt-espejo-h": ["Espejo horizontal", "Horizontal mirror"],
    "tt-espejo-v": ["Espejo vertical", "Vertical mirror"],
    "tt-alinear": ["Alinear caras", "Align faces"],
    "tt-quitar": ["Quitar volumen", "Remove volume"],
    "tt-capa": ["Trazar calificaci\xF3n sobre la zona", "Trace zoning over the area"],
    "tt-descargar": ["Descargar geojson de calificaciones", "Download zoning geojson"],
    "aria-altura": ["Altura del proyecto en metros", "Project height in metres"],
    "aria-plantas": ["N\xFAmero de plantas", "Number of floors"],
    /* Informe */
    "inf-marca": ["MONOLITE \xB7 INFORME DE COMPATIBILIDAD URBANA", "MONOLITE \xB7 URBAN COMPLIANCE REPORT"],
    "inf-ref": ["Ref. catastral", "Cadastral ref."],
    "inf-calificacion": ["Calificaci\xF3n:", "Zoning:"],
    "inf-sin-determ": ["sin determinar", "undetermined"],
    "inf-cumple": ["CUMPLE", "MEETS"],
    "inf-no-cumple": ["NO CUMPLE", "VIOLATED"],
    "inf-pendiente": ["PENDIENTE", "PENDING"],
    "inf-croquis": ["Croquis del terreno", "Site sketch"],
    "inf-datos": ["Datos del proyecto", "Project data"],
    "inf-plantas": ["Plantas", "Floors"],
    "inf-segun-ifc": ["(seg\xFAn IFC importado)", "(from imported IFC)"],
    "inf-altura": ["Altura del proyecto", "Project height"],
    "inf-alt-max-legal": ["altura m\xE1xima legal:", "legal maximum height:"],
    "inf-retranqueo": ["Retranqueo a linderos", "Setback to boundaries"],
    "inf-min-legal": ["m\xEDnimo legal:", "legal minimum:"],
    "inf-dist-proy": ["distancia del proyecto:", "project distance:"],
    "inf-elementos": ["Elementos", "Elements"],
    "inf-huella-ifc": ["(huella IFC importada)", "(imported IFC footprint)"],
    "inf-ocup-total": ["ocupaci\xF3n total:", "total footprint:"],
    "inf-articulos": ["Art\xEDculos evaluados", "Evaluated articles"],
    "inf-la-norma": ["La norma dice.", "The code says."],
    "inf-huella": ["huella de", "footprint of"]
  };
  function t(k) {
    const e = DICT[k];
    if (!e) return k;
    return idioma === "en" ? e[1] : e[0];
  }

  // src/ui/acciones.ts
  function esEvaluable(rule, model) {
    const resolve = (path) => {
      let current = model;
      for (const key of path.split(".")) {
        if (current === null || current === void 0 || typeof current !== "object") return void 0;
        current = current[key];
      }
      return typeof current === "number" ? current : void 0;
    };
    for (const item of rule.conditions.items) {
      const rutas = item.numerator ? [item.numerator, item.denominator] : [item.parameter];
      if (rutas.some((r) => resolve(r) === void 0)) return false;
    }
    return true;
  }
  function sitioLind(linderosRevisados) {
    return {
      id: "SITIO-LIND",
      severidad: "ambar",
      cumple: linderosRevisados,
      nombreCorto: t("sitio-lind-nombre"),
      textoNorma: t("norma-sitio-lind"),
      articulo: t("art-sitio-lind"),
      fuente: "PGOU Granada 2001 \xB7 T\xEDtulo S\xE9ptimo",
      exige: t("sitio-lind-exige"),
      valorProyecto: linderosRevisados ? t("sitio-lind-conf") : t("sitio-lind-sinconf"),
      accion: t("sitio-lind-accion")
    };
  }
  function sitioCal(confirmada) {
    return {
      id: "SITIO-CAL",
      severidad: "ambar",
      cumple: confirmada,
      nombreCorto: t("sitio-cal-nombre"),
      textoNorma: t("norma-sitio-cal"),
      articulo: t("art-sitio-cal"),
      fuente: "PGOU Granada 2001 \xB7 T\xEDtulo S\xE9ptimo",
      exige: t("sitio-cal-exige"),
      valorProyecto: confirmada ? t("sitio-cal-ok") : t("sitio-cal-sin"),
      accion: t("sitio-cal-accion")
    };
  }
  var TEXTO_NORMA = {
    "GR-RUAIS-01A": { textoKey: "norma-01A", articulo: "Art. 7.11.6.2.a", nombreKey: "nombre-altura" },
    "GR-RUAIS-01B": { textoKey: "norma-01B", articulo: "Art. 7.11.6.2.b", nombreKey: "nombre-altura" },
    "GR-RUAIS-01C": { textoKey: "norma-01C", articulo: "Art. 7.11.6.2.c", nombreKey: "nombre-altura" },
    "GR-RUAIS-02": { textoKey: "norma-02", articulo: "Art. 7.11.3", nombreKey: "nombre-separacion" },
    "GR-RUAIS-03": { textoKey: "norma-03", articulo: "Art. 7.11.4.1", nombreKey: "nombre-ocupacion" },
    "GR-RUAIS-04B": { textoKey: "norma-04B", articulo: "Art. 7.11.8.1.b", nombreKey: "nombre-edificabilidad" },
    "GR-URB-05": { textoKey: "norma-05", articulo: "Art. 7.3.23.2", nombreKey: "nombre-patio" }
  };
  function adaptar(id, p, cumple, severidad) {
    const meta = TEXTO_NORMA[id];
    if (!meta) return void 0;
    const base = {
      id,
      severidad,
      cumple,
      nombreCorto: t(meta.nombreKey),
      textoNorma: t(meta.textoKey),
      articulo: meta.articulo,
      fuente: t("fuente"),
      exige: "",
      valorProyecto: "",
      accion: ""
    };
    if (id === "GR-RUAIS-01A" || id === "GR-RUAIS-01B" || id === "GR-RUAIS-01C") {
      const limite = id.endsWith("A") ? 4.6 : id.endsWith("B") ? 7.9 : 11.2;
      base.exige = `\u2264 ${fmt(limite)} m`;
      base.valorProyecto = `${fmt(p.altura ?? 0)} m`;
      base.accion = `${t("accion-altura")} ${fmt(Math.max(0, (p.altura ?? 0) - limite))} m`;
    } else if (id === "GR-RUAIS-02") {
      base.exige = "\u2265 3,00 m";
      base.valorProyecto = `${fmt(p.dist ?? 0)} m`;
      base.accion = `${t("accion-separar")} ${fmt(Math.max(0, 3 - (p.dist ?? 0)))} ${t("mas-de-cada-lindero")}`;
    } else if (id === "GR-RUAIS-03") {
      const ocup = p.superficie ? (p.huella ?? 0) / p.superficie : 0;
      base.exige = "\u2264 30 %";
      base.valorProyecto = `${fmt(ocup * 100, 1)} %`;
      base.accion = `${t("accion-ocupacion")} ${fmt(Math.max(0, (p.huella ?? 0) - 0.3 * (p.superficie ?? 0)), 0)} m\xB2`;
    } else if (id === "GR-RUAIS-04B") {
      const edif = p.edificada ?? 0;
      const lim = 0.6 * (p.superficie ?? 0);
      base.exige = "\u2264 0,60 m\xB2t/m\xB2s";
      base.valorProyecto = `${fmt(p.superficie ? edif / p.superficie : 0)} m\xB2t/m\xB2s`;
      base.accion = `${t("accion-edificabilidad")} ${fmt(Math.max(0, edif - lim), 0)} ${t("m2-construidos")}`;
    }
    return base;
  }

  // tests/fixtures/granada-sample.json
  var granada_sample_default = {
    jurisdiction: "Granada (PGOU 2001)",
    version: "0.3.0",
    vigencia: "PGOU 2001 con adaptaciones posteriores (verificar BOP)",
    rules: [
      {
        id: "GR-RUAIS-01A",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: {
          document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)",
          article: "7.11.6.2.a"
        },
        scope: {
          calificacion: "RUAIS"
        },
        conditions: {
          mode: "all",
          items: [
            {
              parameter: "edificio.numeroPlantas",
              operator: "==",
              value: 1
            },
            {
              parameter: "edificio.alturaMaxima",
              operator: ">",
              value: 4.6
            }
          ]
        },
        severity: "bloqueo",
        message: "Edificio de 1 planta en calificaci\xF3n RUAIS: la altura m\xE1xima es de 4,60 m (art. 7.11.6.2.a)."
      },
      {
        id: "GR-RUAIS-01B",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: {
          document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)",
          article: "7.11.6.2.b"
        },
        scope: {
          calificacion: "RUAIS"
        },
        conditions: {
          mode: "all",
          items: [
            {
              parameter: "edificio.numeroPlantas",
              operator: "==",
              value: 2
            },
            {
              parameter: "edificio.alturaMaxima",
              operator: ">",
              value: 7.9
            }
          ]
        },
        severity: "bloqueo",
        message: "Edificio de 2 plantas en calificaci\xF3n RUAIS: la altura m\xE1xima es de 7,90 m (art. 7.11.6.2.b)."
      },
      {
        id: "GR-RUAIS-01C",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: {
          document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)",
          article: "7.11.6.2.c"
        },
        scope: {
          calificacion: "RUAIS"
        },
        conditions: {
          mode: "all",
          items: [
            {
              parameter: "edificio.numeroPlantas",
              operator: "==",
              value: 3
            },
            {
              parameter: "edificio.alturaMaxima",
              operator: ">",
              value: 11.2
            }
          ]
        },
        severity: "bloqueo",
        message: "Edificio de 3 plantas en calificaci\xF3n RUAIS: la altura m\xE1xima es de 11,20 m (art. 7.11.6.2.c)."
      },
      {
        id: "GR-RUAIS-02",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: {
          document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)",
          article: "7.11.3"
        },
        scope: {
          calificacion: "RUAIS"
        },
        conditions: {
          mode: "any",
          items: [
            {
              parameter: "edificio.distanciaMinimaLinderos",
              operator: "<",
              value: 3
            }
          ]
        },
        severity: "bloqueo",
        message: "En calificaci\xF3n RUAIS la edificaci\xF3n debe separarse un m\xEDnimo de 3,00 m de todos los linderos (art. 7.11.3), medida en recta perpendicular al lindero (art. 7.3.6.1)."
      },
      {
        id: "GR-RUAIS-03",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: {
          document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)",
          article: "7.11.4.1"
        },
        scope: {
          calificacion: "RUAIS"
        },
        conditions: {
          mode: "all",
          items: [
            {
              numerator: "edificio.superficieOcupadaProyectada",
              denominator: "parcela.superficie",
              operator: ">",
              value: 0.3
            }
          ]
        },
        severity: "bloqueo",
        message: "La ocupaci\xF3n m\xE1xima en calificaci\xF3n RUAIS es del 30% de la superficie de parcela por planta (art. 7.11.4.1)."
      },
      {
        id: "GR-RUAIS-04B",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: {
          document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)",
          article: "7.11.8.1.b"
        },
        scope: {
          calificacion: "RUAIS"
        },
        conditions: {
          mode: "all",
          items: [
            {
              parameter: "edificio.numeroPlantas",
              operator: "==",
              value: 2
            },
            {
              numerator: "edificio.superficieEdificadaTotal",
              denominator: "parcela.superficie",
              operator: ">",
              value: 0.6
            }
          ]
        },
        severity: "bloqueo",
        message: "Edificio de 2 plantas en calificaci\xF3n RUAIS: edificabilidad m\xE1xima 0,60 m\xB2t/m\xB2s (art. 7.11.8.1.b)."
      },
      {
        id: "GR-URB-05",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: {
          document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo",
          article: "7.3.23.2 (patios de luces)"
        },
        conditions: {
          mode: "any",
          items: [
            {
              parameter: "patio.anchoMinimo",
              operator: "<",
              value: 3
            },
            {
              parameter: "patio.anchoMinimo",
              operator: "<",
              value: {
                param: "patio.diametroMinimoRequerido"
              }
            },
            {
              parameter: "patio.superficieUtil",
              operator: "<",
              value: 9
            }
          ]
        },
        severity: "bloqueo",
        message: "El patio de luces no cumple las dimensiones m\xEDnimas del art. 7.3.23.2: lado \u2265 3,00 m, c\xEDrculo de di\xE1metro m\xE1x(3 m, H/3), superficie \u2265 9 m\xB2. La anchura m\xEDnima debe mantenerse en toda la altura (art. 7.3.22.3)."
      },
      {
        id: "GR-RPMC-01B",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: {
          document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)",
          article: "7.12.6"
        },
        scope: {
          calificacion: "RPMC"
        },
        conditions: {
          mode: "all",
          items: [
            {
              parameter: "edificio.numeroPlantas",
              operator: "==",
              value: 2
            },
            {
              parameter: "edificio.alturaMaxima",
              operator: ">",
              value: 7.9
            }
          ]
        },
        severity: "bloqueo",
        message: "Edificio de 2 plantas en calificaci\xF3n RPMC: altura m\xE1xima 7,90 m (art. 7.12.6)."
      },
      {
        id: "GR-RPMC-03",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: {
          document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)",
          article: "7.12.4.1"
        },
        scope: {
          calificacion: "RPMC"
        },
        conditions: {
          mode: "all",
          items: [
            {
              numerator: "edificio.superficieOcupadaProyectada",
              denominator: "parcela.superficie",
              operator: ">",
              value: 0.8
            }
          ]
        },
        severity: "bloqueo",
        message: "La ocupaci\xF3n m\xE1xima en calificaci\xF3n RPMC es del 80% de la parcela por planta (art. 7.12.4.1)."
      },
      {
        id: "GR-RPMC-04B",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: {
          document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)",
          article: "7.12.8"
        },
        scope: {
          calificacion: "RPMC"
        },
        conditions: {
          mode: "all",
          items: [
            {
              parameter: "edificio.numeroPlantas",
              operator: "==",
              value: 2
            },
            {
              numerator: "edificio.superficieEdificadaTotal",
              denominator: "parcela.superficie",
              operator: ">",
              value: 1.6
            }
          ]
        },
        severity: "bloqueo",
        message: "Edificio de 2 plantas en RPMC: edificabilidad m\xE1xima 1,60 m\xB2t/m\xB2s (art. 7.12.8)."
      }
    ],
    noCubre: [
      "Normativa sectorial (CTE, REBT, RITE) \u2014 pack separado",
      "Cat\xE1logos de protecci\xF3n y planes especiales",
      "Condiciones de la calificaci\xF3n no cargadas en esta demo"
    ],
    estado: "vigente",
    cobertura: {
      fuente: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo",
      fechaConsulta: "2026-09-17",
      articulosMapeados: [
        "7.11.6.2.a",
        "7.11.6.2.b",
        "7.11.6.2.c",
        "7.11.3",
        "7.11.4.1",
        "7.11.8.1.b",
        "7.3.23.2 (patios de luces)",
        "7.12.6",
        "7.12.4.1",
        "7.12.8"
      ]
    }
  };

  // tests/fixtures/parcela-real.json
  var parcela_real_default = {
    refCatastral: "6537003VG4163E",
    crs: "EPSG:25830",
    fuente: "Catastro INSPIRE WFS CP",
    fechaConsulta: "2026-10-20",
    areaCatastral: 2651,
    parcela: {
      id: "6537003VG4163E",
      type: "parcela",
      crs: "EPSG:25830",
      superficie: 0,
      contorno: [
        {
          x: 446312,
          y: 411345265e-2
        },
        {
          x: 446309,
          y: 411345882e-2
        },
        {
          x: 446308.9,
          y: 411345904e-2
        },
        {
          x: 446347.22,
          y: 411347765e-2
        },
        {
          x: 446347.29,
          y: 41134775e-1
        },
        {
          x: 446350.37,
          y: 411347116e-2
        },
        {
          x: 446351.82,
          y: 411346817e-2
        },
        {
          x: 446353.45,
          y: 411346482e-2
        },
        {
          x: 446355.9,
          y: 411345977e-2
        },
        {
          x: 446360.19,
          y: 411345093e-2
        },
        {
          x: 446361,
          y: 411345133e-2
        },
        {
          x: 446364.24,
          y: 41134529e-1
        },
        {
          x: 446364.48,
          y: 411345241e-2
        },
        {
          x: 446368.63,
          y: 411344386e-2
        },
        {
          x: 446369.43,
          y: 41134422e-1
        },
        {
          x: 446370.99,
          y: 4113439
        },
        {
          x: 446377.48,
          y: 411342564e-2
        },
        {
          x: 446377.25,
          y: 411342553e-2
        },
        {
          x: 446371.5,
          y: 411342274e-2
        },
        {
          x: 446370.35,
          y: 411342218e-2
        },
        {
          x: 446343.29,
          y: 411340904e-2
        },
        {
          x: 446343.13,
          y: 41134091e-1
        },
        {
          x: 446338.65,
          y: 411341068e-2
        },
        {
          x: 446338.22,
          y: 411341083e-2
        },
        {
          x: 446336.32,
          y: 41134115e-1
        },
        {
          x: 446335.29,
          y: 411341186e-2
        },
        {
          x: 446331.09,
          y: 411341335e-2
        },
        {
          x: 446329.17,
          y: 411341729e-2
        },
        {
          x: 446323.68,
          y: 411342859e-2
        },
        {
          x: 446321.5,
          y: 411343308e-2
        },
        {
          x: 446320.24,
          y: 411343568e-2
        },
        {
          x: 446315.03,
          y: 411344641e-2
        },
        {
          x: 446314.37,
          y: 411344778e-2
        },
        {
          x: 446313.49,
          y: 411344959e-2
        }
      ],
      linderos: [
        {
          a: {
            x: 446312,
            y: 411345265e-2
          },
          b: {
            x: 446309,
            y: 411345882e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446309,
            y: 411345882e-2
          },
          b: {
            x: 446308.9,
            y: 411345904e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446308.9,
            y: 411345904e-2
          },
          b: {
            x: 446347.22,
            y: 411347765e-2
          },
          tipo: "frontal"
        },
        {
          a: {
            x: 446347.22,
            y: 411347765e-2
          },
          b: {
            x: 446347.29,
            y: 41134775e-1
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446347.29,
            y: 41134775e-1
          },
          b: {
            x: 446350.37,
            y: 411347116e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446350.37,
            y: 411347116e-2
          },
          b: {
            x: 446351.82,
            y: 411346817e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446351.82,
            y: 411346817e-2
          },
          b: {
            x: 446353.45,
            y: 411346482e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446353.45,
            y: 411346482e-2
          },
          b: {
            x: 446355.9,
            y: 411345977e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446355.9,
            y: 411345977e-2
          },
          b: {
            x: 446360.19,
            y: 411345093e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446360.19,
            y: 411345093e-2
          },
          b: {
            x: 446361,
            y: 411345133e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446361,
            y: 411345133e-2
          },
          b: {
            x: 446364.24,
            y: 41134529e-1
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446364.24,
            y: 41134529e-1
          },
          b: {
            x: 446364.48,
            y: 411345241e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446364.48,
            y: 411345241e-2
          },
          b: {
            x: 446368.63,
            y: 411344386e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446368.63,
            y: 411344386e-2
          },
          b: {
            x: 446369.43,
            y: 41134422e-1
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446369.43,
            y: 41134422e-1
          },
          b: {
            x: 446370.99,
            y: 4113439
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446370.99,
            y: 4113439
          },
          b: {
            x: 446377.48,
            y: 411342564e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446377.48,
            y: 411342564e-2
          },
          b: {
            x: 446377.25,
            y: 411342553e-2
          },
          tipo: "testero"
        },
        {
          a: {
            x: 446377.25,
            y: 411342553e-2
          },
          b: {
            x: 446371.5,
            y: 411342274e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446371.5,
            y: 411342274e-2
          },
          b: {
            x: 446370.35,
            y: 411342218e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446370.35,
            y: 411342218e-2
          },
          b: {
            x: 446343.29,
            y: 411340904e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446343.29,
            y: 411340904e-2
          },
          b: {
            x: 446343.13,
            y: 41134091e-1
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446343.13,
            y: 41134091e-1
          },
          b: {
            x: 446338.65,
            y: 411341068e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446338.65,
            y: 411341068e-2
          },
          b: {
            x: 446338.22,
            y: 411341083e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446338.22,
            y: 411341083e-2
          },
          b: {
            x: 446336.32,
            y: 41134115e-1
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446336.32,
            y: 41134115e-1
          },
          b: {
            x: 446335.29,
            y: 411341186e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446335.29,
            y: 411341186e-2
          },
          b: {
            x: 446331.09,
            y: 411341335e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446331.09,
            y: 411341335e-2
          },
          b: {
            x: 446329.17,
            y: 411341729e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446329.17,
            y: 411341729e-2
          },
          b: {
            x: 446323.68,
            y: 411342859e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446323.68,
            y: 411342859e-2
          },
          b: {
            x: 446321.5,
            y: 411343308e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446321.5,
            y: 411343308e-2
          },
          b: {
            x: 446320.24,
            y: 411343568e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446320.24,
            y: 411343568e-2
          },
          b: {
            x: 446315.03,
            y: 411344641e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446315.03,
            y: 411344641e-2
          },
          b: {
            x: 446314.37,
            y: 411344778e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446314.37,
            y: 411344778e-2
          },
          b: {
            x: 446313.49,
            y: 411344959e-2
          },
          tipo: "lateral"
        },
        {
          a: {
            x: 446313.49,
            y: 411344959e-2
          },
          b: {
            x: 446312,
            y: 411345265e-2
          },
          tipo: "lateral"
        }
      ],
      cotaReferencia: 0,
      calificacion: "RUAIS"
    },
    notaLinderos: "Tipado v1 autom\xE1tico: el lado m\xE1s largo es frontal; el m\xE1s alejado, testero; el resto laterales. Pendiente: marcado humano + inferencia de viales (v2).",
    analisisUrbanizable: {
      fecha: "2026-10-20",
      envolventes: [
        {
          retranqueo: 0.5,
          verticesEnvolvente: 30,
          areaEnvolvente: 2547.1
        },
        {
          retranqueo: 3,
          verticesEnvolvente: 30,
          areaEnvolvente: 2058.4
        },
        {
          retranqueo: 6,
          verticesEnvolvente: 28,
          areaEnvolvente: 1535.2
        }
      ],
      urbanizable: true
    }
  };

  // data/calificaciones-granada.json
  var calificaciones_granada_default = {
    fuente: "PGOU Granada 2001 \xB7 Planos de usos y aprovechamientos (georreferenciaci\xF3n propia)",
    crs: "EPSG:25830",
    aviso: "Capa de calificaciones construida por el equipo MonoLite a partir de los planos oficiales del PGOU. Las zonas marcadas 'demo' fueron verificadas contra el plano de usos por el equipo; pendiente de cobertura real del municipio.",
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          calificacion: "RUAIS",
          nota: "zona demo \xB7 manzana de la parcela de referencia, verificada contra el plano de usos del PGOU por el equipo"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [446290, 4113390],
            [446396, 4113390],
            [446396, 4113496],
            [446290, 4113496],
            [446290, 4113390]
          ]]
        }
      }
    ]
  };

  // src/ui/main.ts
  var todasReglas = granada_sample_default.rules;
  function retranqueoMin() {
    for (const r of todasReglas) {
      if (!r.id.startsWith("GR-RUAIS-02")) continue;
      for (const c of r.conditions.items) {
        if (c.parameter === "edificio.distanciaMinimaLinderos" && typeof c.value === "number") return c.value;
      }
    }
    return 3;
  }
  function alturaLegal(plantas) {
    for (const r of todasReglas) {
      if (!r.id.startsWith("GR-RUAIS-01")) continue;
      const items = r.conditions.items;
      const condPlantas = items.find((c) => c.parameter === "edificio.numeroPlantas");
      const condAltura = items.find((c) => c.parameter === "edificio.alturaMaxima");
      if (condPlantas && condAltura && condPlantas.value === plantas && typeof condAltura.value === "number") {
        return { valor: condAltura.value, articulo: r.source.article };
      }
    }
    return void 0;
  }
  function plantasMaximas() {
    let max = 1;
    let articulo = "";
    for (const r of todasReglas) {
      if (!r.id.startsWith("GR-RUAIS-01")) continue;
      for (const c of r.conditions.items) {
        if (c.parameter === "edificio.numeroPlantas" && typeof c.value === "number" && c.value > max) {
          max = c.value;
          articulo = r.source.article;
        }
      }
    }
    return { max, articulo };
  }
  function calificacionDetectada(p) {
    const fc = calificaciones_granada_default;
    const todas = [...fc.features ?? [], ...estado.capaNueva.map((f) => ({
      properties: f.properties,
      geometry: { type: f.geometry.type, coordinates: [f.geometry.coordinates] }
    }))];
    for (const f of todas) {
      if (f.geometry?.type !== "Polygon" || !f.geometry?.coordinates || !f.properties?.calificacion) continue;
      const anillo = f.geometry.coordinates[0];
      if (!anillo || anillo.length < 3) continue;
      if (puntoEnPoligono(p, anillo.map(([x, y]) => ({ x, y })))) return f.properties.calificacion;
    }
    return null;
  }
  var demo = {
    id: "demo",
    nombre: "Parcela demo",
    refCatastral: null,
    areaCatastral: 300,
    contorno: [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
      { x: 20, y: 15 },
      { x: 0, y: 15 }
    ],
    linderos: [
      { tipo: "frontal", a: { x: 0, y: 0 }, b: { x: 20, y: 0 } },
      { tipo: "lateral", a: { x: 0, y: 0 }, b: { x: 0, y: 15 } },
      { tipo: "lateral", a: { x: 20, y: 0 }, b: { x: 20, y: 15 } },
      { tipo: "testero", a: { x: 20, y: 15 }, b: { x: 0, y: 15 } }
    ]
  };
  var real = {
    id: "real",
    nombre: "Calle Arabial, Granada",
    refCatastral: parcela_real_default.refCatastral,
    areaCatastral: parcela_real_default.areaCatastral,
    contorno: parcela_real_default.parcela.contorno,
    linderos: tiparLinderos(parcela_real_default.parcela.contorno)
  };
  var PARCELAS = [demo, real];
  var estado = {
    parcela: null,
    plantas: 1,
    altura: alturaLegal(1)?.valor ?? 0,
    linderosRevisados: false,
    calificacion: "",
    modoCapa: false,
    trazo: [],
    capaNueva: [],
    cargando: false,
    ifcMsg: "",
    abierto: "",
    volumenes: [],
    activo: null,
    ifcVol: null,
    modoDibujo: false,
    dibujo: [],
    modoGirar: false,
    modoAlinear: false,
    alinearPend: null
  };
  var vistaObj = { minX: 0, maxY: 0, m: 2.5, baseW: 0, baseH: 0 };
  var vbGuardada = null;
  var $ = (id) => document.getElementById(id);
  function volActivo() {
    return estado.activo !== null && estado.volumenes[estado.activo] ? estado.volumenes[estado.activo] : null;
  }
  function huella() {
    if (estado.volumenes.length > 0) {
      return estado.volumenes.reduce((mejor, v) => areaPoligono(v) > areaPoligono(mejor) ? v : mejor, estado.volumenes[0]);
    }
    return [];
  }
  function zonaConstruible() {
    const zona = poligonoOffsetInterior(estado.parcela.contorno, retranqueoMin());
    return zona.length >= 3 ? zona : estado.parcela.contorno;
  }
  function cercaDeBordeZona(p, eps = 0.02) {
    for (const s of segZona()) {
      const abx = s.b.x - s.a.x, aby = s.b.y - s.a.y;
      const ab2 = abx * abx + aby * aby || 1;
      const t2 = Math.max(0, Math.min(1, ((p.x - s.a.x) * abx + (p.y - s.a.y) * aby) / ab2));
      if (Math.hypot(p.x - (s.a.x + t2 * abx), p.y - (s.a.y + t2 * aby)) < eps) return true;
    }
    return false;
  }
  function dentroZona(p) {
    return puntoEnPoligono(p, zonaConstruible()) || cercaDeBordeZona(p);
  }
  function orient(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  }
  function seCruzan(p1, p2, q1, q2) {
    const o1 = orient(p1, p2, q1), o2 = orient(p1, p2, q2);
    const o3 = orient(q1, q2, p1), o4 = orient(q1, q2, p2);
    return o1 > 0 !== o2 > 0 && o3 > 0 !== o4 > 0;
  }
  function contieneEnZona(h) {
    if (h.length < 3 || !h.every(dentroZona)) return false;
    const zs = segZona();
    for (let i = 0; i < h.length; i++) {
      const a = h[i];
      const b = h[(i + 1) % h.length];
      for (const s of zs) {
        if (seCruzan(a, b, s.a, s.b)) return false;
      }
    }
    return true;
  }
  function segZona() {
    const z = zonaConstruible();
    const segs = [];
    for (let i = 0; i < z.length; i++) {
      const a = z[i];
      const b = z[(i + 1) % z.length];
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      segs.push({ a, b, nx: -dy / len, ny: dx / len });
    }
    return segs;
  }
  function construirKernel(h) {
    const k = {
      parcela: {
        id: estado.parcela.id,
        type: "parcela",
        crs: "EPSG:25830",
        superficie: 0,
        contorno: estado.parcela.contorno,
        linderos: estado.parcela.linderos,
        cotaReferencia: 0,
        calificacion: "RUAIS"
      },
      edificio: {
        alturaMaxima: estado.altura,
        numeroPlantas: estado.plantas,
        superficieEdificadaTotal: 0,
        superficieOcupadaProyectada: 0,
        huella: h
      },
      entities: []
    };
    return k;
  }
  function carasDe(poligono) {
    const caras = [];
    for (let i = 0; i < poligono.length; i++) {
      const la = poligono[i];
      const lb = poligono[(i + 1) % poligono.length];
      const dx = lb.x - la.x, dy = lb.y - la.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      let cara = caras.find((c) => Math.abs(c.dirx * uy - c.diry * ux) < 0.02 && Math.abs((la.x - c.base.x) * c.diry - (la.y - c.base.y) * c.dirx) < 0.1);
      if (!cara) {
        caras.push({ dirx: ux, diry: uy, base: la, tmin: 0, tmax: len });
        continue;
      }
      const ta = (la.x - cara.base.x) * cara.dirx + (la.y - cara.base.y) * cara.diry;
      const tb = (lb.x - cara.base.x) * cara.dirx + (lb.y - cara.base.y) * cara.diry;
      cara.tmin = Math.min(cara.tmin, ta, tb);
      cara.tmax = Math.max(cara.tmax, ta, tb);
    }
    return caras.map((c) => ({
      a: { x: c.base.x + c.dirx * c.tmin, y: c.base.y + c.diry * c.tmin },
      b: { x: c.base.x + c.dirx * c.tmax, y: c.base.y + c.diry * c.tmax },
      dirx: c.dirx,
      diry: c.diry
    }));
  }
  function carasLindero() {
    return carasDe(estado.parcela.linderos.map((l) => l.a));
  }
  function carasZona() {
    return carasDe(zonaConstruible());
  }
  function masCercano(h) {
    if (h.length < 3) return void 0;
    let mejor;
    for (const l of estado.parcela.linderos) {
      for (const p of h) {
        const d = distanciaPuntoSegmento(p, l.a, l.b);
        if (!mejor || d < mejor.dist) {
          const t2 = Math.max(0, Math.min(1, ((p.x - l.a.x) * (l.b.x - l.a.x) + (p.y - l.a.y) * (l.b.y - l.a.y)) / ((l.b.x - l.a.x) ** 2 + (l.b.y - l.a.y) ** 2)));
          mejor = { lindero: { x: l.a.x + t2 * (l.b.x - l.a.x), y: l.a.y + t2 * (l.b.y - l.a.y) }, huellaP: p, dist: d };
        }
      }
    }
    return mejor;
  }
  function evaluar() {
    if (estado.calificacion && estado.calificacion !== "RUAIS") {
      return {
        h: [],
        sinEnvolvente: true,
        resultados: [],
        estado: "no-evaluable",
        dist: void 0,
        huellaArea: 0,
        superficie: 0
      };
    }
    const h = huella();
    const sinEnvolvente = h.length < 3;
    const kernel = construirKernel(h);
    const huellaArea = estado.volumenes.length > 0 ? estado.volumenes.reduce((a, v) => a + (v.length >= 3 ? areaPoligono(v) : 0), 0) : 0;
    if (sinEnvolvente) {
      delete kernel.edificio.superficieOcupadaProyectada;
      delete kernel.edificio.superficieEdificadaTotal;
    } else {
      kernel.edificio.superficieEdificadaTotal = huellaArea * estado.plantas;
    }
    const model = buildModel(kernel);
    if (estado.volumenes.length > 0) {
      model.edificio.superficieOcupadaProyectada = huellaArea;
    }
    const poligonos = estado.volumenes.length > 0 ? estado.volumenes : [h];
    let distMC;
    for (const v of poligonos) {
      const mc = masCercano(v);
      if (mc && (!distMC || mc.dist < distMC.dist)) distMC = mc;
    }
    const dist = distMC ? Math.round(distMC.dist * 100) / 100 : model.edificio.distanciaMinimaLinderos;
    if (distMC) model.edificio.distanciaMinimaLinderos = dist;
    const superficie = model.parcela.superficie;
    const edificada = huellaArea * estado.plantas;
    const activas = todasReglas.filter((r) => !r.scope || r.scope.calificacion === "RUAIS");
    const resultados = [];
    for (const rule of activas) {
      if (!esEvaluable(rule, model)) continue;
      const violation = evaluateRule(rule, model);
      const r = adaptar(rule.id, { dist, altura: estado.altura, huella: huellaArea, superficie, edificada, plantas: estado.plantas }, violation === null, rule.severity);
      if (r) resultados.push(r);
    }
    resultados.push(sitioLind(estado.linderosRevisados));
    resultados.push(sitioCal(estado.calificacion === "RUAIS"));
    const p = pasos(resultados);
    const porId = new Map(p.map((x) => [x.id, x]));
    const paso02 = porId.get("GR-RUAIS-02");
    if (paso02 && distMC) paso02.anclaPlano = distMC.lindero;
    const paso03 = porId.get("GR-RUAIS-03");
    if (paso03 && h.length >= 3) paso03.anclaPlano = h[0];
    return { h, sinEnvolvente, resultados, estado: estadoGlobal(resultados, sinEnvolvente), dist, huellaArea, superficie };
  }
  var COLOR = {
    rojo: "var(--ml-rojo)",
    ambar: "var(--ml-ambar)",
    verde: "var(--ml-verde)",
    "sin-envolvente": "var(--ml-neutro)",
    "no-evaluable": "var(--ml-neutro)"
  };
  var TINTE = {
    rojo: "var(--ml-rojo-tinte)",
    ambar: "var(--ml-ambar-tinte)",
    verde: "var(--ml-verde-tinte)",
    "sin-envolvente": "var(--ml-neutro-tinte)",
    "no-evaluable": "var(--ml-neutro-tinte)"
  };
  var TINTA = {
    rojo: "var(--ml-rojo-tinta)",
    ambar: "var(--ml-ambar-tinta)",
    verde: "var(--ml-verde-tinta)",
    "sin-envolvente": "var(--ml-sumi-2)",
    "no-evaluable": "var(--ml-sumi-2)"
  };
  function selloIcone(e) {
    if (e === "rojo") return `<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="${TINTA.rojo}" stroke-width="2.2" stroke-linecap="round"/></svg>`;
    if (e === "ambar") return `<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v10" stroke="${TINTA.ambar}" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="19" r="1.4" fill="${TINTA.ambar}"/></svg>`;
    if (e === "verde") return `<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 5 10-12" stroke="${TINTA.verde}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    return `<svg viewBox="0 0 24 24" fill="none"><path d="M6 12h12" stroke="var(--ml-sumi-2)" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  }
  function renderPlano(ev) {
    const svg = $("plano");
    const c = estado.parcela.contorno;
    const xs = c.map((p) => p.x);
    const ys = c.map((p) => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const m = 2.5;
    vistaObj.minX = minX;
    vistaObj.maxY = maxY;
    vistaObj.m = m;
    vistaObj.baseW = maxX - minX + 2 * m;
    vistaObj.baseH = maxY - minY + 2 * m;
    const W = maxX - minX + 2 * m;
    const H = maxY - minY + 2 * m;
    const sx = (p) => p.x - minX + m;
    const sy = (p) => maxY - p.y + m;
    const svgPt = (p) => `${sx(p).toFixed(2)},${sy(p).toFixed(2)}`;
    const kT = 2.4;
    const mono = (t2, x, y, tam, fill, anchor = "middle") => `<text x="${x}" y="${y}" font-family="var(--ml-font-ui)" font-size="${(tam * kT).toFixed(3)}" fill="${fill}" text-anchor="${anchor}">${t2}</text>`;
    let out = `<defs><pattern id="rayas-zona" width="1.6" height="1.6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><rect width="1.6" height="1.6" fill="var(--ml-kinari)"/><line x1="0" y1="0" x2="0" y2="1.6" stroke="#DB9A2F" stroke-width="0.28"/></pattern></defs>`;
    out += `<polygon points="${c.map(svgPt).join(" ")}" fill="var(--ml-lamina)" stroke="none"/>`;
    estado.parcela.linderos.forEach((l) => {
      const esFrontal = l.tipo === "frontal";
      out += `<line x1="${sx(l.a)}" y1="${sy(l.a)}" x2="${sx(l.b)}" y2="${sy(l.b)}" stroke="${esFrontal ? "var(--ml-rojo)" : "var(--ml-sumi)"}" stroke-width="${esFrontal ? 0.22 : 0.035}" ${l.tipo === "testero" ? 'stroke-dasharray="0.4 0.25"' : ""}></line>`;
    });
    {
      const zona = poligonoOffsetInterior(c, retranqueoMin());
      if (zona.length >= 3) {
        out += `<polygon data-zona="1" points="${zona.map(svgPt).join(" ")}" fill="url(#rayas-zona)" stroke="var(--ml-sumi-2)" stroke-width="0.05" stroke-dasharray="0.14 0.1" stroke-linecap="round"/>`;
      }
    }
    let mcGlobal;
    if (!ev.sinEnvolvente) {
      const e = ev.estado;
      if (estado.volumenes.length > 0) {
        estado.volumenes.forEach((v, i) => {
          const sel = estado.activo === i;
          out += `<polygon data-vol="${i}" id="vol-${i}" points="${v.map(svgPt).join(" ")}" fill="var(--ml-ail)" stroke="var(--ml-ail)" stroke-width="${sel ? 0.11 : 0.07}"/>`;
          const cx = v.reduce((a, p) => a + p.x, 0) / v.length;
          const cy = v.reduce((a, p) => a + p.y, 0) / v.length;
          if (esRectangulo(v)) {
            const lado1 = Math.hypot(v[1].x - v[0].x, v[1].y - v[0].y);
            const lado2 = Math.hypot(v[0].x - v[3].x, v[0].y - v[3].y);
            out += mono(`${fmt(lado1, 1)} \xD7 ${fmt(lado2, 1)}`, sx({ x: cx, y: cy }), sy({ x: cx, y: cy }) - 0.55 * kT, 0.42, "var(--ml-washi)").replace("<text ", `<text id="vol-dims-${i}" `);
          }
          out += mono(`${fmt(areaPoligono(v))} m\xB2`, sx({ x: cx, y: cy }), sy({ x: cx, y: cy }) + 0.75 * kT, 0.34, "var(--ml-washi)").replace("<text ", `<text id="vol-area-${i}" `);
        });
      } else {
        out += `<polygon id="huella" points="${ev.h.map(svgPt).join(" ")}" fill="${TINTE[e]}" stroke="${COLOR[e]}" stroke-width="0.07"/>`;
        const cx = ev.h.reduce((a, p) => a + p.x, 0) / ev.h.length;
        const cy = ev.h.reduce((a, p) => a + p.y, 0) / ev.h.length;
        out += mono(`${fmt(ev.huellaArea)} m\xB2`, sx({ x: cx, y: cy }), sy({ x: cx, y: cy }) + 0.1, 0.34, "var(--ml-sumi-3)");
      }
      let mc;
      for (const v of estado.volumenes.length > 0 ? estado.volumenes : [ev.h]) {
        const m2 = masCercano(v);
        if (m2 && (!mc || m2.dist < mc.dist)) mc = m2;
      }
      mcGlobal = mc;
    } else {
      const msg = ev.estado === "no-evaluable" ? `${t("zona-no-evaluable")} ${estado.calificacion}${t("no-pack-zona")}` : "";
      if (msg) out += `<text x="${W / 2}" y="${H / 2}" font-family="var(--ml-font-veredicto)" font-size="0.6" fill="var(--ml-sumi-2)" text-anchor="middle">${msg}</text>`;
    }
    for (const p of pasos(ev.resultados)) {
      if (!p.anclaPlano) continue;
      const col = COLOR[p.severidad === "bloqueo" ? "rojo" : "ambar"];
      out += `<circle cx="${sx(p.anclaPlano)}" cy="${sy(p.anclaPlano)}" r="${(0.28 * kT).toFixed(3)}" fill="var(--ml-lamina)" stroke="${col}" stroke-width="0.05"/>` + mono(String(p.n), sx(p.anclaPlano), sy(p.anclaPlano) + 0.14, 0.4, "var(--ml-sumi)");
    }
    if (estado.modoCapa && estado.trazo.length > 0) {
      const puntos = estado.trazo.map(svgPt).join(" ");
      out += `<polyline points="${puntos} ${svgPt(estado.trazo[0])}" fill="none" stroke="var(--ml-ail)" stroke-width="0.05" stroke-dasharray="0.2 0.15"/>`;
      for (const p of estado.trazo) {
        out += `<circle cx="${sx(p)}" cy="${sy(p)}" r="0.15" fill="var(--ml-ail)"/>`;
      }
    }
    if (estado.modoDibujo && estado.dibujo.length > 0) {
      const puntos = estado.dibujo.map(svgPt).join(" ");
      out += `<polyline points="${puntos} ${svgPt(estado.dibujo[0])}" fill="none" stroke="var(--ml-sumi-2)" stroke-width="0.04" stroke-dasharray="0.2 0.15"/>`;
      out += `<circle cx="${sx(estado.dibujo[0])}" cy="${sy(estado.dibujo[0])}" r="0.22" fill="var(--ml-ail)"/>`;
      for (const p of estado.dibujo) {
        out += `<circle cx="${sx(p)}" cy="${sy(p)}" r="0.15" fill="var(--ml-sumi-2)"/>`;
      }
    }
    if (estado.alinearPend) {
      const pv = estado.volumenes[estado.alinearPend.vol];
      if (pv) {
        const a = pv[estado.alinearPend.lado];
        const b = pv[(estado.alinearPend.lado + 1) % pv.length];
        out += `<line x1="${sx(a)}" y1="${sy(a)}" x2="${sx(b)}" y2="${sy(b)}" stroke="var(--ml-ambar)" stroke-width="0.14"/>`;
      }
    }
    const vAct = volActivo();
    out += `<g id="vol-verts">` + (vAct && !ev.sinEnvolvente && estado.activo !== estado.ifcVol ? vAct.map(
      (p, i) => `<circle data-vert="${i}" cx="${sx(p)}" cy="${sy(p)}" r="${(0.25 * kT).toFixed(3)}" fill="var(--ml-lamina)" stroke="var(--ml-ail)" stroke-width="0.06"/>`
    ).join("") : "") + `</g>`;
    if (!ev.sinEnvolvente) {
      const col = "var(--ml-ail)";
      const tick = 0.14;
      const caras = carasLindero();
      const pvsDibujados = [];
      for (const v of estado.volumenes) {
        const medidas = caras.map((f) => {
          const nx = -f.diry, ny = f.dirx;
          const lenF = Math.hypot(f.b.x - f.a.x, f.b.y - f.a.y);
          let mejor;
          for (const q of v) {
            const s = (q.x - f.a.x) * nx + (q.y - f.a.y) * ny;
            const along = (q.x - f.a.x) * f.dirx + (q.y - f.a.y) * f.diry;
            if (along < 0 || along > lenF) continue;
            const d = Math.abs(s);
            if (d >= 0.05 && (!mejor || d < mejor.d)) {
              mejor = { d, pv: q, pl: { x: q.x - s * nx, y: q.y - s * ny } };
            }
          }
          return mejor ? { ...mejor, dirx: f.dirx, diry: f.diry } : void 0;
        }).filter((m2) => m2 !== void 0).sort((a, b) => a.d - b.d).slice(0, 2);
        for (const c2 of medidas) {
          out += `<line x1="${sx(c2.pl)}" y1="${sy(c2.pl)}" x2="${sx(c2.pv)}" y2="${sy(c2.pv)}" stroke="${col}" stroke-width="0.022"/><line x1="${sx({ x: c2.pl.x - c2.dirx * tick, y: 0 })}" y1="${sy({ x: 0, y: c2.pl.y - c2.diry * tick })}" x2="${sx({ x: c2.pl.x + c2.dirx * tick, y: 0 })}" y2="${sy({ x: 0, y: c2.pl.y + c2.diry * tick })}" stroke="${col}" stroke-width="0.022"/><line x1="${sx({ x: c2.pv.x - c2.dirx * tick, y: 0 })}" y1="${sy({ x: 0, y: c2.pv.y - c2.diry * tick })}" x2="${sx({ x: c2.pv.x + c2.dirx * tick, y: 0 })}" y2="${sy({ x: 0, y: c2.pv.y + c2.diry * tick })}" stroke="${col}" stroke-width="0.022"/>`;
          const midX = (sx(c2.pl) + sx(c2.pv)) / 2;
          const midY = (sy(c2.pl) + sy(c2.pv)) / 2;
          const ddx = sx(c2.pv) - sx(c2.pl);
          const ddy = sy(c2.pv) - sy(c2.pl);
          const dl = Math.hypot(ddx, ddy) || 1;
          let pnx = -ddy / dl, pny = ddx / dl;
          if (pny > 0) {
            pnx = -pnx;
            pny = -pny;
          }
          const off = 0.34 * kT;
          const tx = midX + pnx * off;
          const ty = midY + pny * off;
          let ang = Math.atan2(ddy, ddx) * 180 / Math.PI;
          if (ang > 90) ang -= 180;
          if (ang < -90) ang += 180;
          out += `<text x="${tx}" y="${ty}" font-family="var(--ml-font-ui)" font-size="${(0.42 * kT).toFixed(3)}" fill="${col}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${ang.toFixed(1)} ${tx} ${ty})">${fmt(c2.d, 1)} m</text>`;
          pvsDibujados.push(c2.pv);
          pvsDibujados.push(c2.pl);
        }
      }
      if (mcGlobal && !pvsDibujados.some((pv) => Math.hypot(pv.x - mcGlobal.huellaP.x, pv.y - mcGlobal.huellaP.y) < 0.05 || Math.hypot(pv.x - mcGlobal.lindero.x, pv.y - mcGlobal.lindero.y) < 0.3)) {
        const colR = ev.resultados.some((r) => r.id === "GR-RUAIS-02" && !r.cumple) ? "var(--ml-rojo-tinta)" : "var(--ml-sumi-2)";
        out += `<line x1="${sx(mcGlobal.lindero)}" y1="${sy(mcGlobal.lindero)}" x2="${sx(mcGlobal.huellaP)}" y2="${sy(mcGlobal.huellaP)}" stroke="${colR}" stroke-width="0.025"/>
        <circle cx="${sx(mcGlobal.lindero)}" cy="${sy(mcGlobal.lindero)}" r="0.06" fill="${colR}"/>
        <circle cx="${sx(mcGlobal.huellaP)}" cy="${sy(mcGlobal.huellaP)}" r="0.06" fill="${colR}"/>`;
        const mcx = (sx(mcGlobal.lindero) + sx(mcGlobal.huellaP)) / 2;
        const mcy = (sy(mcGlobal.lindero) + sy(mcGlobal.huellaP)) / 2;
        const ddxR = sx(mcGlobal.huellaP) - sx(mcGlobal.lindero);
        const ddyR = sy(mcGlobal.huellaP) - sy(mcGlobal.lindero);
        const dlR = Math.hypot(ddxR, ddyR) || 1;
        let pnxR = -ddyR / dlR, pnyR = ddxR / dlR;
        if (pnyR > 0) {
          pnxR = -pnxR;
          pnyR = -pnyR;
        }
        const offR = 0.34 * kT;
        const txR = mcx + pnxR * offR;
        const tyR = mcy + pnyR * offR;
        let angR = Math.atan2(ddyR, ddxR) * 180 / Math.PI;
        if (angR > 90) angR -= 180;
        if (angR < -90) angR += 180;
        out += `<text x="${txR}" y="${tyR}" font-family="var(--ml-font-ui)" font-size="${(0.42 * kT).toFixed(3)}" fill="${colR}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${angR.toFixed(1)} ${txR} ${tyR})">${fmt(mcGlobal.dist)} m</text>`;
      }
    }
    if (estado.cargando) {
      out += `<text x="${W / 2}" y="${H / 2}" font-family="var(--ml-font-ui)" font-size="0.42" fill="var(--ml-sumi-3)" text-anchor="middle">${t("consultando")}</text>`;
    }
    svg.setAttribute("viewBox", vbGuardada ? `${vbGuardada.x} ${vbGuardada.y} ${vbGuardada.w} ${vbGuardada.h}` : `0 0 ${W.toFixed(2)} ${H.toFixed(2)}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", `Plano de parcela ${estado.parcela.nombre}. Estado del proyecto: ${ev.estado}.`);
    svg.innerHTML = out;
  }
  function actualizarVolPlano(i) {
    const v = estado.volumenes[i];
    if (!v) return;
    const poly = document.getElementById(`vol-${i}`);
    if (!poly) {
      recalcular();
      return;
    }
    const sx = (p) => p.x - vistaObj.minX + vistaObj.m;
    const sy = (p) => vistaObj.maxY + vistaObj.m - p.y;
    const svgPt = (p) => `${sx(p).toFixed(2)},${sy(p).toFixed(2)}`;
    poly.setAttribute("points", v.map(svgPt).join(" "));
    const cx = v.reduce((a, p) => a + p.x, 0) / v.length;
    const cy = v.reduce((a, p) => a + p.y, 0) / v.length;
    const kT = 2.4;
    const dims = document.getElementById(`vol-dims-${i}`);
    if (dims) {
      if (v.length === 4 && esRectangulo(v)) {
        const l1 = Math.hypot(v[1].x - v[0].x, v[1].y - v[0].y);
        const l2 = Math.hypot(v[0].x - v[3].x, v[0].y - v[3].y);
        dims.textContent = `${fmt(l1, 1)} \xD7 ${fmt(l2, 1)}`;
        dims.setAttribute("x", String(sx({ x: cx, y: 0 })));
        dims.setAttribute("y", String(sy({ x: 0, y: cy }) - 0.55 * kT));
      } else {
        dims.textContent = "";
      }
    }
    const area = document.getElementById(`vol-area-${i}`);
    if (area) {
      area.textContent = `${fmt(areaPoligono(v))} m\xB2`;
      area.setAttribute("x", String(sx({ x: cx, y: 0 })));
      area.setAttribute("y", String(sy({ x: 0, y: cy }) + 0.75 * kT));
    }
    const gVerts = document.getElementById("vol-verts");
    if (gVerts) {
      if (estado.activo === i && i !== estado.ifcVol) {
        gVerts.innerHTML = v.map(
          (p, j) => `<circle data-vert="${j}" cx="${sx(p).toFixed(2)}" cy="${sy(p).toFixed(2)}" r="${(0.25 * kT).toFixed(3)}" fill="var(--ml-lamina)" stroke="var(--ml-ail)" stroke-width="0.06"/>`
        ).join("");
      } else {
        gVerts.innerHTML = "";
      }
    }
  }
  function renderPanel(ev) {
    const nBloq = ev.resultados.filter((r) => !r.cumple && r.severidad === "bloqueo").length;
    const sub = {
      rojo: `${nBloq} ${nBloq > 1 ? t("sub-rojo-plur") : t("sub-rojo-sing")}`,
      ambar: t("sub-ambar"),
      verde: t("sub-verde"),
      "sin-envolvente": estado.volumenes.length === 0 ? t("sub-sin-modelo") : t("sub-no-huella"),
      "no-evaluable": t("sub-no-evaluable")
    };
    const h1 = {
      rojo: t("h1-rojo"),
      ambar: t("h1-ambar"),
      verde: t("h1-verde"),
      "sin-envolvente": estado.volumenes.length === 0 ? t("h1-sin-modelo") : t("h1-no-cabe"),
      "no-evaluable": getIdioma() === "en" ? `Not evaluable: zone ${estado.calificacion}.` : `No evaluable: zona ${estado.calificacion}.`
    };
    const overline = {
      rojo: t("rojo"),
      ambar: t("ambar"),
      verde: t("verde"),
      "sin-envolvente": t("sin-modelo"),
      "no-evaluable": t("sin-pack")
    };
    const nCumple = ev.resultados.filter((r) => r.cumple).length;
    const marks = ev.resultados.map((r) => {
      const col = r.cumple ? "var(--ml-verde)" : r.severidad === "bloqueo" ? "var(--ml-rojo)" : "var(--ml-ambar)";
      return `<span class="ml-marca-prog" style="background:${col}"></span>`;
    }).join("");
    const sinModelo = ev.estado === "sin-envolvente" && estado.volumenes.length === 0;
    const veredicto = sinModelo ? "" : `
    <div class="ml-veredicto" role="status" aria-live="polite">
      <div class="ml-sello" style="border-color:${COLOR[ev.estado]}">${selloIcone(ev.estado)}</div>
      <div class="ml-veredicto-texto" style="flex:1">
        <div class="ml-overline" style="color:${TINTA[ev.estado]}">${overline[ev.estado]}</div>
        <h1 class="ml-h1">${h1[ev.estado]}</h1>
        ${ev.estado === "no-evaluable" ? "" : `<div class="ml-progreso">${marks}<span>${t("cumple-de")} ${nCumple} ${t("de-articulos")} ${ev.resultados.length} \xB7 ${sub[ev.estado]}</span></div>`}
      </div>
    </div>`;
    const p = pasos(ev.resultados);
    const pasoModelo = sinModelo ? `
    <div class="ml-paso" data-abierto="0">
      <div class="ml-paso-cab">
        <span class="ml-circulo" style="border-color:${COLOR.ambar};color:${TINTA.ambar}">1</span>
        <span class="ml-paso-cuerpo">
          <span class="ml-accion">${t("paso-modelo")}</span>
          <span class="ml-detalle">${t("paso-modelo-det")}</span>
          <span class="ml-articulo">${t("paso-modelo-tools")}</span>
        </span>
      </div>
    </div>` : "";
    const desplz = sinModelo ? 1 : 0;
    const falta = p.length === 0 && !sinModelo ? "" : `
    <div class="ml-falta">
      <h2>${t("lo-que-falta")}</h2>
      ${pasoModelo}
      ${p.map((x) => `
        <div class="ml-paso" data-abierto="${estado.abierto === x.id ? "1" : "0"}">
          <button type="button" class="ml-paso-cab" data-paso="${x.id}" aria-expanded="${estado.abierto === x.id}">
            <span class="ml-circulo" style="border-color:${COLOR[x.severidad === "bloqueo" ? "rojo" : "ambar"]};color:${TINTA[x.severidad === "bloqueo" ? "rojo" : "ambar"]}">${x.n + desplz}</span>
            <span class="ml-paso-cuerpo">
              <span class="ml-accion">${x.accion}</span>
              <span class="ml-detalle">${t("exige")} ${x.exige} \xB7 ${t("tienes")} <b style="color:${TINTA[x.severidad === "bloqueo" ? "rojo" : "ambar"]}">${x.valorProyecto}</b></span>
              <span class="ml-articulo">${x.articulo}</span>
            </span>
            <span class="ml-flecha">\xE2\u2013\xB6</span>
          </button>
          ${estado.abierto === x.id ? `
          <div class="ml-norma">
            <div class="ml-norma-overline">${t("la-norma-dice")}</div>
            <p class="ml-norma-texto">${x.textoNorma}</p>
            <div class="ml-norma-fuente">${x.fuente}</div>
          </div>` : ""}
        </div>`).join("")}
    </div>`;
    $("panel").innerHTML = veredicto + falta;
  }
  function render(ev) {
    for (const id of ["altura", "cargar-ifc", "btn-informe", "vol-crear", "vol-vertices", "capa-crear"]) {
      $(id).disabled = false;
    }
    const inpAlt = $("altura");
    if (document.activeElement !== inpAlt) inpAlt.value = String(estado.altura).replace(".", ",");
    $("parcela-nombre").textContent = estado.parcela.nombre;
    $("parcela-datos").textContent = `${estado.parcela.refCatastral ? `Ref. ${estado.parcela.refCatastral} \xB7 ` : ""}${estado.parcela.areaCatastral ? `${estado.parcela.areaCatastral} m\xB2` : ""}`;
    $("ifc-msg").textContent = estado.ifcMsg;
    document.querySelector(".ml-leyenda").hidden = false;
    renderPlano(ev);
    renderPanel(ev);
    $("valor-plantas").textContent = String(estado.plantas);
    const selPlantas = $("plantas");
    if (document.activeElement !== selPlantas) selPlantas.value = String(estado.plantas);
    $("plantas").disabled = estado.parcela.deIFC === true;
    const conVol = volActivo() !== null;
    const sinPack = ev.estado === "no-evaluable";
    const deIFC = estado.parcela.deIFC === true;
    for (const id of ["vol-crear", "vol-vertices", "vol-girar", "vol-espejo-h", "vol-espejo-v", "vol-alinear", "vol-quitar"]) {
      $(id).disabled = sinPack || id !== "vol-crear" && id !== "vol-vertices" && !conVol;
    }
    const al = alturaLegal(estado.plantas);
    $("valor-max").textContent = al ? `${fmt(al.valor)} m` : "";
    $("max-legal").textContent = al ? `${t("fija-norma")} ${al.articulo}` : t("sin-regla");
    const pm = plantasMaximas();
    $("plantas-legal").textContent = `${t("max-construible")} ${pm.max} ${pm.max > 1 ? t("planta-plur") : t("planta-sing")}${pm.articulo ? ` \xB7 art. ${pm.articulo}` : ""}`;
  }
  function renderVacio() {
    $("parcela-nombre").textContent = "";
    $("parcela-datos").textContent = "";
    $("ifc-msg").textContent = "";
    $("msg").textContent = "";
    document.querySelector(".ml-leyenda").hidden = true;
    const svg = $("plano");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("aria-label", t("plano-vacio"));
    svg.innerHTML = `<text x="50" y="50" text-anchor="middle" class="ml-vacio">${t("plano-vacio")}</text>`;
    $("panel").innerHTML = `
    <div class="ml-veredicto" role="status" aria-live="polite">
      <div class="ml-veredicto-texto">
        <div class="ml-overline" style="color:var(--ml-sumi-3)">${t("empieza")}</div>
        <h1 class="ml-h1">${t("busca-parcela")}</h1>
        <div class="ml-progreso"><span>${t("busca-hint")}</span></div>
      </div>
    </div>`;
    for (const id of [
      "altura",
      "plantas",
      "cargar-ifc",
      "btn-informe",
      "capa-crear",
      "capa-descargar",
      "vol-crear",
      "vol-vertices",
      "vol-girar",
      "vol-espejo-h",
      "vol-espejo-v",
      "vol-alinear",
      "vol-quitar"
    ]) {
      const el = $(id);
      el.disabled = true;
    }
    if (estado.parcela === null) {
      $("valor-max").textContent = "";
      $("valor-plantas").textContent = "";
      $("max-legal").textContent = "";
      $("plantas-legal").textContent = "";
      $("altura").value = "";
      $("plantas").value = "";
    }
  }
  function recalcular() {
    if (!estado.parcela) {
      renderVacio();
      return;
    }
    render(evaluar());
  }
  $("altura").addEventListener("input", (e) => {
    const v = e.target.value.replace(",", ".");
    const n = Number(v);
    if (!Number.isNaN(n) && v.trim() !== "") {
      estado.altura = n;
      recalcular();
    }
  });
  $("plantas").addEventListener("change", (e) => {
    estado.plantas = Number(e.target.value);
    const al = alturaLegal(estado.plantas);
    if (al) estado.altura = al.valor;
    recalcular();
  });
  var linderoPendiente = null;
  $("lindero-si").addEventListener("click", () => {
    const i = linderoPendiente;
    if (i !== null && estado.parcela) {
      const ls = estado.parcela.linderos;
      const ref = ls[i];
      const ux = ref.b.x - ref.a.x, uy = ref.b.y - ref.a.y;
      const ul = Math.hypot(ux, uy) || 1;
      const mismos = [];
      ls.forEach((l, j) => {
        const paralelo = Math.abs((ux * (l.b.y - l.a.y) - uy * (l.b.x - l.a.x)) / (ul * (Math.hypot(l.b.x - l.a.x, l.b.y - l.a.y) || 1)));
        if (paralelo > 0.02) return;
        const mismaLinea = Math.abs((l.a.x - ref.a.x) * uy - (l.a.y - ref.a.y) * ux) / ul;
        if (mismaLinea > 0.1) return;
        mismos.push(j);
      });
      ls.forEach((l, j) => {
        if (l.tipo === "frontal" && !mismos.includes(j)) l.tipo = "lateral";
      });
      for (const j of mismos) ls[j].tipo = "frontal";
      estado.linderosRevisados = true;
    }
    linderoPendiente = null;
    $("modal-lindero").hidden = true;
    recalcular();
  });
  $("lindero-no").addEventListener("click", () => {
    linderoPendiente = null;
    $("modal-lindero").hidden = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("modal-lindero").hidden) {
      linderoPendiente = null;
      $("modal-lindero").hidden = true;
    }
  });
  $("panel").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-paso]");
    if (!btn) return;
    const id = btn.dataset.paso;
    estado.abierto = estado.abierto === id ? "" : id;
    recalcular();
  });
  function parseLado(id) {
    return Number($(id).value.replace(",", ".")) || 0;
  }
  function solapa(a, b) {
    if (a.some((p) => puntoEnPoligono(p, b))) return true;
    if (b.some((p) => puntoEnPoligono(p, a))) return true;
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        if (seCruzan(a[i], a[(i + 1) % a.length], b[j], b[(j + 1) % b.length])) return true;
      }
    }
    return false;
  }
  function crearRectangular() {
    const largo = parseLado("vol-largo");
    const ancho = parseLado("vol-ancho");
    if (largo <= 0 || ancho <= 0) return;
    const zona = zonaConstruible();
    const zs = zona.map((p) => ({ x: p.x, y: p.y }));
    const xs = zs.map((p) => p.x);
    const ys = zs.map((p) => p.y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const hacer = (px, py) => [
      { x: px - largo / 2, y: py - ancho / 2 },
      { x: px + largo / 2, y: py - ancho / 2 },
      { x: px + largo / 2, y: py + ancho / 2 },
      { x: px - largo / 2, y: py + ancho / 2 }
    ];
    const cabe = (vol2) => contieneEnZona(vol2) && !estado.volumenes.some((w) => solapa(vol2, w));
    let vol = hacer(cx, cy);
    if (!cabe(vol)) {
      const pasos2 = [1.5, 3, 4.5, 6, 7.5, 9];
      exterior:
        for (const d of pasos2) {
          for (const sx of [0, 1, -1]) {
            for (const sy of [0, 1, -1]) {
              if (sx === 0 && sy === 0) continue;
              const cand = hacer(cx + sx * d, cy + sy * d);
              if (cabe(cand)) {
                vol = cand;
                break exterior;
              }
            }
          }
        }
    }
    if (!contieneEnZona(vol)) {
      $("msg").textContent = t("no-cabe");
      return;
    }
    estado.volumenes.push(vol);
    estado.activo = estado.volumenes.length - 1;
    recalcular();
  }
  function addVerticeDibujo(p) {
    if (!dentroZona(p)) return;
    if (estado.dibujo.length >= 3 && Math.hypot(p.x - estado.dibujo[0].x, p.y - estado.dibujo[0].y) < 0.6) {
      cerrarDibujo();
      return;
    }
    estado.dibujo.push(p);
    recalcular();
  }
  function cerrarDibujo() {
    if (estado.dibujo.length < 3) return;
    if (!contieneEnZona([...estado.dibujo])) {
      $("msg").textContent = t("forma-se-sale");
      return;
    }
    estado.volumenes.push([...estado.dibujo]);
    estado.activo = estado.volumenes.length - 1;
    estado.dibujo = [];
    estado.modoDibujo = false;
    recalcular();
  }
  function cancelarDibujo() {
    estado.dibujo = [];
    estado.modoDibujo = false;
    recalcular();
  }
  function centroide(v) {
    return {
      x: v.reduce((a, p) => a + p.x, 0) / v.length,
      y: v.reduce((a, p) => a + p.y, 0) / v.length
    };
  }
  function esRectangulo(v) {
    if (v.length !== 4) return false;
    const e = (i) => ({ x: v[(i + 1) % 4].x - v[i].x, y: v[(i + 1) % 4].y - v[i].y });
    const dot = (a, b) => a.x * b.x + a.y * b.y;
    return Math.abs(dot(e(0), e(1))) < 0.05 && Math.abs(dot(e(1), e(2))) < 0.05;
  }
  function transformarVol(fn) {
    const v = volActivo();
    if (!v) return;
    const c = centroide(v);
    const nuevo = v.map((p) => fn(p, c));
    if (estado.activo !== estado.ifcVol && !contieneEnZona(nuevo)) return;
    estado.volumenes[estado.activo] = nuevo;
    recalcular();
  }
  $("vol-crear").addEventListener("click", crearRectangular);
  function cerrarTrazo() {
    if (estado.trazo.length < 3) return;
    $("modal-cal").hidden = false;
  }
  function cancelarTrazo() {
    estado.trazo = [];
    estado.modoCapa = false;
    $("capa-crear").style.borderColor = "";
    $("capa-crear").style.background = "";
    recalcular();
  }
  $("capa-crear").addEventListener("click", () => {
    estado.modoCapa = !estado.modoCapa;
    estado.trazo = [];
    $("capa-crear").style.borderColor = estado.modoCapa ? "var(--ml-sumi-2)" : "";
    $("capa-crear").style.background = estado.modoCapa ? "var(--ml-washi)" : "";
    recalcular();
  });
  $("cal-anadir").addEventListener("click", () => {
    if (estado.trazo.length >= 3) {
      const cal = $("cal-nueva").value;
      const anillo = estado.trazo.map((p) => [Number(p.x.toFixed(2)), Number(p.y.toFixed(2))]);
      anillo.push([...anillo[0]]);
      estado.capaNueva.push({ properties: { calificacion: cal }, geometry: { type: "Polygon", coordinates: anillo } });
      estado.trazo = [];
      estado.modoCapa = false;
      $("capa-crear").style.borderColor = "";
      $("capa-crear").style.background = "";
      $("capa-descargar").disabled = false;
      if (estado.parcela) {
        const cc = centroide(estado.parcela.contorno);
        const det = calificacionDetectada(cc);
        if (det) estado.calificacion = det;
      }
    }
    $("modal-cal").hidden = true;
    recalcular();
  });
  $("cal-cancelar").addEventListener("click", () => {
    estado.trazo = [];
    $("modal-cal").hidden = true;
    recalcular();
  });
  $("capa-descargar").addEventListener("click", () => {
    const fcBase = calificaciones_granada_default;
    const todo = {
      ...fcBase,
      features: [
        ...calificaciones_granada_default.features ?? [],
        ...estado.capaNueva.map((f) => ({
          type: "Feature",
          properties: f.properties,
          geometry: { type: "Polygon", coordinates: [f.geometry.coordinates] }
        }))
      ]
    };
    const blob = new Blob([JSON.stringify(todo, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "calificaciones-granada.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $("vol-vertices").addEventListener("click", () => {
    cancelarDibujo();
    estado.modoDibujo = true;
    recalcular();
  });
  $("vol-girar").addEventListener("click", () => {
    if (!volActivo()) return;
    estado.modoGirar = !estado.modoGirar;
    $("vol-girar").style.borderColor = estado.modoGirar ? "var(--ml-sumi-2)" : "";
    $("vol-girar").style.background = estado.modoGirar ? "var(--ml-washi)" : "";
    recalcular();
  });
  $("vol-espejo-h").addEventListener("click", () => transformarVol((p, c) => ({ x: 2 * c.x - p.x, y: p.y })));
  $("vol-espejo-v").addEventListener("click", () => transformarVol((p, c) => ({ x: p.x, y: 2 * c.y - p.y })));
  function ejecutarAlineacion(o, d) {
    const v = estado.volumenes[o.vol];
    const a1 = v[o.lado];
    const b1 = v[(o.lado + 1) % v.length];
    let a2, b2;
    let cRef;
    let haciaDentro;
    if ("zona" in d) {
      const z = carasZona();
      const f = z[d.zona % z.length];
      a2 = f.a;
      b2 = f.b;
      cRef = centroide(zonaConstruible());
      haciaDentro = true;
    } else {
      const w = estado.volumenes[d.vol];
      a2 = w[d.lado];
      b2 = w[(d.lado + 1) % w.length];
      cRef = centroide(w);
      haciaDentro = false;
    }
    const m1 = { x: (a1.x + b1.x) / 2, y: (a1.y + b1.y) / 2 };
    const m2 = { x: (a2.x + b2.x) / 2, y: (a2.y + b2.y) / 2 };
    let rot = Math.atan2(b2.y - a2.y, b2.x - a2.x) - Math.atan2(b1.y - a1.y, b1.x - a1.x);
    if (rot > Math.PI / 2) rot -= Math.PI;
    else if (rot < -Math.PI / 2) rot += Math.PI;
    const len2 = Math.hypot(b2.x - a2.x, b2.y - a2.y) || 1;
    const ex = (b2.x - a2.x) / len2, ey = (b2.y - a2.y) / len2;
    const nx = -ey, ny = ex;
    const sRef = (cRef.x - a2.x) * nx + (cRef.y - a2.y) * ny;
    const deseado = haciaDentro ? Math.sign(sRef) : -Math.sign(sRef);
    const candidatos = [0, Math.PI].map((extra) => {
      const cos = Math.cos(rot + extra), sin = Math.sin(rot + extra);
      let nuevo = v.map((p) => {
        const dx = p.x - m1.x, dy = p.y - m1.y;
        return { x: m1.x + dx * cos - dy * sin + (m2.x - m1.x), y: m1.y + dx * sin + dy * cos + (m2.y - m1.y) };
      });
      const na1 = nuevo[o.lado];
      const nb1 = nuevo[(o.lado + 1) % nuevo.length];
      const tA = (na1.x - a2.x) * ex + (na1.y - a2.y) * ey;
      const tB = (nb1.x - a2.x) * ex + (nb1.y - a2.y) * ey;
      const lo = Math.min(tA, tB), hi = Math.max(tA, tB);
      let dd = 0;
      if (lo < 0) dd = -lo;
      else if (hi > len2) dd = len2 - hi;
      if (dd !== 0) nuevo = nuevo.map((p) => ({ x: p.x + ex * dd, y: p.y + ey * dd }));
      return nuevo;
    });
    const ladoDe = (p) => Math.sign((centroide(p).x - a2.x) * nx + (centroide(p).y - a2.y) * ny);
    candidatos.sort((A, B) => (ladoDe(A) === deseado ? 0 : 1) - (ladoDe(B) === deseado ? 0 : 1));
    for (const nuevo of candidatos) {
      if (o.vol === estado.ifcVol || contieneEnZona(nuevo)) {
        estado.volumenes[o.vol] = nuevo;
        estado.activo = o.vol;
        return;
      }
      if (o.vol === estado.ifcVol) {
        estado.volumenes[o.vol] = nuevo;
        estado.activo = o.vol;
        return;
      }
      const xs = nuevo.map((p) => (p.x - a2.x) * ex + (p.y - a2.y) * ey);
      const emin = Math.min(...xs);
      const extent = Math.max(...xs) - emin;
      let aplicado = null;
      let mejorK = Infinity;
      const objetivo = (len2 - extent) / 2 - emin;
      for (let i = 0; i <= 24; i++) {
        const eminObj = -extent + i / 24 * (len2 + extent);
        const dd = eminObj - emin;
        if (Math.abs(dd) < 1e-9) continue;
        const cand = nuevo.map((p) => ({ x: p.x + ex * dd, y: p.y + ey * dd }));
        if (contieneEnZona(cand)) {
          const k = Math.abs(dd - objetivo);
          if (k < mejorK) {
            aplicado = cand;
            mejorK = k;
          }
        }
      }
      if (aplicado) {
        estado.volumenes[o.vol] = aplicado;
        estado.activo = o.vol;
        return;
      }
    }
    $("msg").textContent = t("alineacion-no-cabe");
  }
  function salirModoAlinear() {
    estado.modoAlinear = false;
    estado.alinearPend = null;
    $("vol-alinear").style.borderColor = "";
    $("vol-alinear").style.background = "";
  }
  $("vol-alinear").addEventListener("click", () => {
    if (estado.modoAlinear) {
      salirModoAlinear();
      recalcular();
      return;
    }
    estado.modoAlinear = true;
    estado.alinearPend = null;
    $("vol-alinear").style.borderColor = "var(--ml-sumi-2)";
    $("vol-alinear").style.background = "var(--ml-washi)";
    recalcular();
  });
  $("vol-quitar").addEventListener("click", () => {
    if (estado.parcela?.deIFC === true && estado.activo === estado.ifcVol) borrarIFC();
    else quitarVolumen();
  });
  function quitarVolumen() {
    if (estado.activo !== null) {
      estado.volumenes.splice(estado.activo, 1);
      estado.activo = estado.volumenes.length > 0 ? Math.min(estado.activo, estado.volumenes.length - 1) : null;
    } else if (estado.volumenes.length > 0) {
      estado.volumenes.pop();
      estado.activo = null;
    }
    estado.modoGirar = false;
    $("vol-girar").style.borderColor = "";
    $("vol-girar").style.background = "";
    recalcular();
  }
  function borrarIFC() {
    const ifcIdx = PARCELAS.findIndex((x) => x.id === estado.parcela.id);
    if (ifcIdx !== -1) PARCELAS.splice(ifcIdx, 1);
    const original = PARCELAS.find((x) => x.id === estado.parcela.id.replace(/-ifc$/, ""));
    if (estado.ifcVol !== null) {
      estado.volumenes.splice(estado.ifcVol, 1);
      estado.ifcVol = null;
    }
    estado.activo = estado.volumenes.length > 0 ? Math.min(estado.activo ?? estado.volumenes.length - 1, estado.volumenes.length - 1) : null;
    estado.ifcMsg = "";
    estado.plantas = 1;
    estado.altura = alturaLegal(1)?.valor ?? 0;
    if (original) estado.parcela = original;
    recalcular();
  }
  document.addEventListener("keydown", (e) => {
    if (estado.modoCapa) {
      if (e.key === "Enter") cerrarTrazo();
      if (e.key === "Escape") cancelarTrazo();
      return;
    }
    if (estado.modoDibujo) {
      if (e.key === "Enter") cerrarDibujo();
      if (e.key === "Escape") cancelarDibujo();
      return;
    }
    if (e.key !== "Escape") return;
    if (estado.modoAlinear) {
      salirModoAlinear();
      recalcular();
      return;
    }
    if (!$("dim-popup").hidden) {
      cerrarDimPopup();
      return;
    }
    if (e.target.closest?.("input, select, textarea")) return;
    if (estado.volumenes.length === 0) return;
    if (estado.parcela.deIFC === true && estado.activo === estado.ifcVol) borrarIFC();
    else quitarVolumen();
  });
  function insertarVertice(p) {
    const v = estado.modoDibujo ? estado.dibujo : volActivo();
    if (!v || v.length < 2) return false;
    let mejor;
    for (let i = 0; i < v.length; i++) {
      const a = v[i];
      const b = v[(i + 1) % v.length];
      const abx = b.x - a.x, aby = b.y - a.y;
      const ab2 = abx * abx + aby * aby;
      if (ab2 === 0) continue;
      const t2 = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / ab2));
      const proy = { x: a.x + t2 * abx, y: a.y + t2 * aby };
      const d = Math.hypot(p.x - proy.x, p.y - proy.y);
      if (!mejor || d < mejor.dist) mejor = { idx: i, punto: proy, dist: d };
    }
    if (!mejor || mejor.dist > 0.8) return false;
    if (v.some((q) => Math.hypot(q.x - mejor.punto.x, q.y - mejor.punto.y) < 0.3)) return false;
    v.splice(mejor.idx + 1, 0, mejor.punto);
    recalcular();
    return true;
  }
  function ladosRect(v) {
    const ax = v[1].x - v[0].x, ay = v[1].y - v[0].y;
    const bx = v[0].x - v[3].x, by = v[0].y - v[3].y;
    const l1 = Math.hypot(ax, ay) || 1;
    const l2 = Math.hypot(bx, by) || 1;
    return { u1: { x: ax / l1, y: ay / l1 }, u2: { x: bx / l2, y: by / l2 }, l1, l2 };
  }
  function abrirDimPopup(e) {
    const v = volActivo();
    if (!v) return;
    const esRect = v.length === 4 && esRectangulo(v);
    const { l1, l2 } = esRect ? ladosRect(v) : { l1: 0, l2: 0 };
    const w = esRect ? l1 : Math.max(...v.map((p) => p.x)) - Math.min(...v.map((p) => p.x));
    const h = esRect ? l2 : Math.max(...v.map((p) => p.y)) - Math.min(...v.map((p) => p.y));
    $("vol-largo").value = String(Math.round(w * 100) / 100);
    $("vol-ancho").value = String(Math.round(h * 100) / 100);
    const popup = $("dim-popup");
    const wrap = popup.parentElement;
    const wr = wrap.getBoundingClientRect();
    let left = e.clientX - wr.left + 14;
    let top = e.clientY - wr.top + 14;
    left = Math.max(8, Math.min(left, wr.width - 260));
    top = Math.max(8, Math.min(top, wr.height - 70));
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.hidden = false;
    $("vol-largo").focus();
  }
  function cerrarDimPopup() {
    $("dim-popup").hidden = true;
  }
  function aplicarDims() {
    const v = volActivo();
    if (!v || estado.activo === estado.ifcVol) return;
    const largo = parseLado("vol-largo");
    const ancho = parseLado("vol-ancho");
    if (largo <= 0 || ancho <= 0) return;
    const c = centroide(v);
    let nuevo;
    if (v.length === 4 && esRectangulo(v)) {
      const { u1, u2, l1, l2 } = ladosRect(v);
      const f1 = largo / l1, f2 = ancho / l2;
      const anclas = [
        ...v,
        ...v.map((q, i) => ({ x: (q.x + v[(i + 1) % 4].x) / 2, y: (q.y + v[(i + 1) % 4].y) / 2 })),
        c
      ];
      let aplicable = null;
      for (const an of anclas) {
        const cand = v.map((p) => {
          const a = (p.x - an.x) * u1.x + (p.y - an.y) * u1.y;
          const b = (p.x - an.x) * u2.x + (p.y - an.y) * u2.y;
          return {
            x: an.x + u1.x * a * f1 + u2.x * b * f2,
            y: an.y + u1.y * a * f1 + u2.y * b * f2
          };
        });
        if (contieneEnZona(cand)) {
          aplicable = cand;
          break;
        }
      }
      if (!aplicable) {
        $("msg").textContent = t("no-cabe-medidas");
        return;
      }
      nuevo = aplicable;
    } else {
      const w = Math.max(...v.map((p) => p.x)) - Math.min(...v.map((p) => p.x));
      const h = Math.max(...v.map((p) => p.y)) - Math.min(...v.map((p) => p.y));
      nuevo = v.map((p) => ({
        x: c.x + (p.x - c.x) * (largo / (w || 1)),
        y: c.y + (p.y - c.y) * (ancho / (h || 1))
      }));
    }
    if (!contieneEnZona(nuevo)) {
      $("msg").textContent = t("no-cabe-medidas");
      return;
    }
    estado.volumenes[estado.activo] = nuevo;
    cerrarDimPopup();
    recalcular();
  }
  $("dim-aplicar").addEventListener("click", aplicarDims);
  for (const id of ["vol-largo", "vol-ancho"]) {
    $(id).addEventListener("keydown", (e) => {
      if (e.key === "Enter") aplicarDims();
      if (e.key === "Escape") cerrarDimPopup();
    });
  }
  (function configurarInteraccion() {
    const svg = $("plano");
    let panMovio = false;
    let movioVol = false;
    let downPt = { x: 0, y: 0 };
    let activo = null;
    const escala = () => {
      const vb = (svg.getAttribute("viewBox") ?? "0 0 1 1").split(" ").map(Number);
      return vb[2] / svg.getBoundingClientRect().width;
    };
    const aUTM = (e) => {
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(
        svg.getScreenCTM().inverse()
      );
      return { x: pt.x + vistaObj.minX - vistaObj.m, y: vistaObj.maxY + vistaObj.m - pt.y };
    };
    const distSeg = (p, a, b) => {
      const abx = b.x - a.x, aby = b.y - a.y;
      const ab2 = abx * abx + aby * aby || 1;
      const t2 = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / ab2));
      return Math.hypot(p.x - (a.x + t2 * abx), p.y - (a.y + t2 * aby));
    };
    const pick = (p, pxTol = 12) => {
      const tol = pxTol * escala();
      const vA = volActivo();
      if (vA && estado.activo !== estado.ifcVol) {
        for (let i = 0; i < vA.length; i++) {
          if (Math.hypot(p.x - vA[i].x, p.y - vA[i].y) < tol) return { tipo: "vertice", idx: i };
        }
      }
      let mejorLado;
      estado.volumenes.forEach((v, i) => v.forEach((q, j) => {
        const d = distSeg(p, q, v[(j + 1) % v.length]);
        if (d < tol && (!mejorLado || d < mejorLado.d)) mejorLado = { vol: i, lado: j, d };
      }));
      if (mejorLado) return { tipo: "lado", vol: mejorLado.vol, lado: mejorLado.lado };
      for (let i = estado.volumenes.length - 1; i >= 0; i--) {
        if (puntoEnPoligono(p, estado.volumenes[i])) return { tipo: "vol", vol: i };
      }
      let mejorZona;
      carasZona().forEach((f, j) => {
        const d = distSeg(p, f.a, f.b);
        if (d < tol && (!mejorZona || d < mejorZona.d)) mejorZona = { lado: j, d };
      });
      if (mejorZona) return { tipo: "zona", lado: mejorZona.lado };
      let mejorLin;
      estado.parcela?.linderos.forEach((l, i) => {
        const d = distSeg(p, l.a, l.b);
        if (d < tol && (!mejorLin || d < mejorLin.d)) mejorLin = { idx: i, d };
      });
      if (mejorLin) return { tipo: "lindero", idx: mejorLin.idx };
      return null;
    };
    const marcaSel = (i) => {
      estado.volumenes.forEach((_, j) => {
        const el = document.getElementById(`vol-${j}`);
        if (el) el.setAttribute("stroke-width", j === i ? "0.11" : "0.07");
      });
    };
    const volDe = (p, i) => {
      const v = estado.volumenes[i];
      let mejor = { j: 0, d: Infinity };
      v.forEach((q, j) => {
        const d = distSeg(p, q, v[(j + 1) % v.length]);
        if (d < mejor.d) mejor = { j, d };
      });
      return { vol: i, lado: mejor.j };
    };
    svg.addEventListener("wheel", (e) => {
      if (!estado.parcela) return;
      e.preventDefault();
      const vb = (svg.getAttribute("viewBox") ?? "0 0 1 1").split(" ").map(Number);
      const [vx, vy, vw, vh] = vb;
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(
        svg.getScreenCTM().inverse()
      );
      const f = e.deltaY < 0 ? 0.85 : 1 / 0.85;
      const nw = Math.min(Math.max(vw * f, vistaObj.baseW / 12), vistaObj.baseW * 1.5);
      const nh = nw * (vh / vw);
      const nx = pt.x - (pt.x - vx) * (nw / vw);
      const ny = pt.y - (pt.y - vy) * (nh / vh);
      vbGuardada = { x: nx, y: ny, w: nw, h: nh };
      svg.setAttribute("viewBox", `${nx} ${ny} ${nw} ${nh}`);
    }, { passive: false });
    svg.addEventListener("pointerdown", (e) => {
      panMovio = false;
      movioVol = false;
      downPt = { x: e.clientX, y: e.clientY };
      if (estado.modoDibujo) {
        addVerticeDibujo(aUTM(e));
        return;
      }
      if (estado.modoCapa) {
        estado.trazo.push(aUTM(e));
        recalcular();
        return;
      }
      if (estado.modoAlinear) return;
      const pk = pick(aUTM(e));
      if (pk?.tipo === "vertice" && estado.activo !== estado.ifcVol) {
        activo = { tipo: "vertice", idx: pk.idx };
        return;
      }
      if (pk && (pk.tipo === "vol" || pk.tipo === "lado")) {
        estado.activo = pk.vol;
        marcaSel(pk.vol);
        const vol = estado.volumenes[pk.vol];
        const c = centroide(vol);
        if (estado.modoGirar) {
          const p = aUTM(e);
          activo = { tipo: "girar", c, a0: Math.atan2(p.y - c.y, p.x - c.x), origen: vol.map((q) => ({ ...q })) };
        } else {
          activo = { tipo: "mover", inicio: { x: e.clientX, y: e.clientY }, origen: vol.map((p) => ({ ...p })) };
        }
        return;
      }
      if (estado.parcela) {
        const vb = (svg.getAttribute("viewBox") ?? "0 0 1 1").split(" ").map(Number);
        activo = { tipo: "pan", vb: { x: vb[0], y: vb[1], w: vb[2], h: vb[3] }, inicio: { x: e.clientX, y: e.clientY } };
        svg.style.cursor = "grabbing";
      }
    });
    svg.addEventListener("pointermove", (e) => {
      if (!activo) return;
      if (activo.tipo === "pan") {
        const k = activo.vb.w / svg.getBoundingClientRect().width;
        const nx = activo.vb.x - (e.clientX - activo.inicio.x) * k;
        const ny = activo.vb.y - (e.clientY - activo.inicio.y) * k;
        if (Math.hypot(e.clientX - activo.inicio.x, e.clientY - activo.inicio.y) > 4) panMovio = true;
        vbGuardada = { x: nx, y: ny, w: activo.vb.w, h: activo.vb.h };
        svg.setAttribute("viewBox", `${nx} ${ny} ${activo.vb.w} ${activo.vb.h}`);
        return;
      }
      const vAct = volActivo();
      if (!vAct) return;
      if (activo.tipo === "vertice") {
        const idx = activo.idx;
        let p = aUTM(e);
        const v = vAct;
        const construir = (t1, t2) => {
          const nuevo = v.map((q) => ({ ...q }));
          nuevo[(idx + 1) % 4] = { x: v[(idx + 2) % 4].x + (v[(idx + 1) % 4].x - v[(idx + 2) % 4].x) * t1, y: v[(idx + 2) % 4].y + (v[(idx + 1) % 4].y - v[(idx + 2) % 4].y) * t1 };
          nuevo[(idx + 3) % 4] = { x: v[(idx + 2) % 4].x + (v[(idx + 3) % 4].x - v[(idx + 2) % 4].x) * t2, y: v[(idx + 2) % 4].y + (v[(idx + 3) % 4].y - v[(idx + 2) % 4].y) * t2 };
          nuevo[idx] = { x: nuevo[(idx + 1) % 4].x + nuevo[(idx + 3) % 4].x - v[(idx + 2) % 4].x, y: nuevo[(idx + 1) % 4].y + nuevo[(idx + 3) % 4].y - v[(idx + 2) % 4].y };
          return nuevo;
        };
        if (v.length === 4 && esRectangulo(v)) {
          const opp = v[(idx + 2) % 4];
          const e1 = { x: v[(idx + 1) % 4].x - opp.x, y: v[(idx + 1) % 4].y - opp.y };
          const e2 = { x: v[(idx + 3) % 4].x - opp.x, y: v[(idx + 3) % 4].y - opp.y };
          const det = e1.x * e2.y - e2.x * e1.y;
          if (Math.abs(det) < 1e-9) return;
          const rx = p.x - opp.x, ry = p.y - opp.y;
          const t1o = Math.max(0.05, (rx * e2.y - ry * e2.x) / det);
          const t2o = Math.max(0.05, (e1.x * ry - e1.y * rx) / det);
          let t1 = t1o, t2 = t2o;
          if (!contieneEnZona(construir(t1o, t2o))) {
            let lo = 0, hi = 1;
            for (let i = 0; i < 10; i++) {
              const s = (lo + hi) / 2;
              if (contieneEnZona(construir(1 + s * (t1o - 1), 1 + s * (t2o - 1)))) lo = s;
              else hi = s;
            }
            t1 = 1 + lo * (t1o - 1);
            t2 = 1 + lo * (t2o - 1);
          }
          estado.volumenes[estado.activo] = construir(t1, t2);
          actualizarVolPlano(estado.activo);
          movioVol = true;
          return;
        }
        const p0 = v[idx];
        let cand = v.map((q, j) => j === idx ? p : q);
        if (!dentroZona(p) || !contieneEnZona(cand)) {
          let lo = 0, hi = 1;
          const puntoS = (s) => ({ x: p0.x + (p.x - p0.x) * s, y: p0.y + (p.y - p0.y) * s });
          let mejor = puntoS(0);
          for (let i = 0; i < 10; i++) {
            const s = (lo + hi) / 2;
            const ps = puntoS(s);
            if (dentroZona(ps) && contieneEnZona(v.map((q, j) => j === idx ? ps : q))) {
              lo = s;
              mejor = ps;
            } else hi = s;
          }
          p = mejor;
          cand = v.map((q, j) => j === idx ? p : q);
          if (!contieneEnZona(cand)) return;
        }
        estado.volumenes[estado.activo] = cand;
        actualizarVolPlano(estado.activo);
        movioVol = true;
      } else if (activo.tipo === "girar") {
        const { c, a0, origen } = activo;
        const p = aUTM(e);
        const da = Math.atan2(p.y - c.y, p.x - c.x) - a0;
        const cos = Math.cos(da), sin = Math.sin(da);
        const nuevo = origen.map((q) => ({
          x: c.x + (q.x - c.x) * cos - (q.y - c.y) * sin,
          y: c.y + (q.x - c.x) * sin + (q.y - c.y) * cos
        }));
        if (estado.activo !== estado.ifcVol && !contieneEnZona(nuevo)) return;
        estado.volumenes[estado.activo] = nuevo;
        actualizarVolPlano(estado.activo);
        movioVol = true;
      } else if (activo.tipo === "mover") {
        const k = escala();
        const dx = (e.clientX - activo.inicio.x) * k;
        const dy = -((e.clientY - activo.inicio.y) * k);
        let nuevo = activo.origen.map((p) => ({ x: p.x + dx, y: p.y + dy }));
        if (estado.activo !== estado.ifcVol && !contieneEnZona(nuevo)) {
          let lo = 0, hi = 1;
          for (let i = 0; i < 12; i++) {
            const t2 = (lo + hi) / 2;
            const pr = activo.origen.map((p) => ({ x: p.x + dx * t2, y: p.y + dy * t2 }));
            if (contieneEnZona(pr)) lo = t2;
            else hi = t2;
          }
          nuevo = activo.origen.map((p) => ({ x: p.x + dx * lo, y: p.y + dy * lo }));
          if (!contieneEnZona(nuevo)) return;
        }
        estado.volumenes[estado.activo] = nuevo;
        actualizarVolPlano(estado.activo);
        movioVol = true;
      }
    });
    svg.addEventListener("click", (e) => {
      const arrastro = panMovio || Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y) > 4;
      if (arrastro) {
        panMovio = false;
        return;
      }
      const p = aUTM(e);
      const pk = pick(p);
      if (estado.modoGirar && !(pk && (pk.tipo === "vol" || pk.tipo === "lado"))) {
        estado.modoGirar = false;
        $("vol-girar").style.borderColor = "";
        $("vol-girar").style.background = "";
        recalcular();
        return;
      }
      if (estado.modoAlinear) {
        let sel = null;
        let selZona = null;
        if (pk?.tipo === "lado") {
          sel = { vol: pk.vol, lado: pk.lado };
        } else if (pk?.tipo === "vol") {
          sel = volDe(p, pk.vol);
        } else if (pk?.tipo === "vertice") {
          sel = volDe(p, estado.activo);
        } else if (pk?.tipo === "zona") {
          selZona = pk.lado;
        }
        if (selZona !== null && estado.alinearPend) {
          ejecutarAlineacion(estado.alinearPend, { zona: selZona });
          salirModoAlinear();
          recalcular();
          return;
        }
        if (sel) {
          if (!estado.alinearPend) {
            estado.alinearPend = sel;
            recalcular();
            return;
          }
          if (sel.vol === estado.alinearPend.vol) {
            $("msg").textContent = t("elige-otra-cara");
            return;
          }
          ejecutarAlineacion(estado.alinearPend, sel);
          salirModoAlinear();
          recalcular();
          return;
        }
        $("msg").textContent = t("pulsa-cara");
        return;
      }
      if (pk?.tipo === "lindero" && !estado.modoDibujo && !estado.modoCapa && estado.parcela) {
        linderoPendiente = pk.idx;
        $("modal-lindero").hidden = false;
      }
    });
    svg.addEventListener("dblclick", (e) => {
      if (e.target.closest(".ml-dim-popup")) return;
      const p = aUTM(e);
      if (estado.modoCapa) {
        estado.trazo.pop();
        cerrarTrazo();
        return;
      }
      if (estado.modoDibujo) {
        cerrarDibujo();
        return;
      }
      if (!estado.parcela) return;
      if (insertarVertice(p)) return;
      for (let i = estado.volumenes.length - 1; i >= 0; i--) {
        if (puntoEnPoligono(p, estado.volumenes[i])) {
          if (i === estado.ifcVol) return;
          estado.activo = i;
          marcaSel(i);
          abrirDimPopup(e);
          return;
        }
      }
    });
    svg.addEventListener("pointerup", () => {
      if (movioVol) {
        movioVol = false;
        recalcular();
      }
      activo = null;
      svg.style.cursor = "";
    });
  })();
  $("buscar").addEventListener("click", () => {
    const q = $("q").value.trim();
    if (q) buscarDireccion(q);
  });
  $("q").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = $("q").value.trim();
      if (q) buscarDireccion(q);
    }
  });
  async function buscarDireccion(q) {
    estado.cargando = true;
    $("msg").textContent = t("buscando");
    recalcular();
    try {
      let x;
      let y;
      let display_name = q;
      const m = q.match(/^\s*(\d+[.,]?\d*)\s*[,; ]\s*(\d+[.,]?\d*)\s*$/);
      if (m) {
        const a = Number(m[1].replace(",", "."));
        const b = Number(m[2].replace(",", "."));
        if (a <= 90 && b <= 90 && (a > 0 || b > 0) && q.includes(",")) {
          ({ x, y } = deGeograficaAUTM(a, b));
        } else {
          x = a;
          y = b;
        }
      } else {
        const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`).then((r) => r.json());
        if (!Array.isArray(geo) || geo.length === 0) throw new Error("no encontrada");
        ({ lat: x, lon: y } = geo[0]);
        display_name = geo[0].display_name;
        ({ x, y } = deGeograficaAUTM(Number(x), Number(y)));
      }
      const gml = await fetch(urlWFSParcelasPorPunto(x, y, 30)).then((r) => r.text());
      const parcelas = parsearParcelasGML(gml);
      const lote = seleccionarParcelaRepresentativa(parcelas, 150, 5e3, { x, y });
      if (!lote) throw new Error("sin parcela apta");
      const nueva = {
        id: "busqueda",
        nombre: `${getIdioma() === "en" ? "Search" : "B\xFAsqueda"}: ${display_name.split(",").slice(0, 3).join(",")}`,
        refCatastral: lote.ref,
        areaCatastral: lote.area,
        contorno: lote.puntos,
        linderos: tiparLinderos(lote.puntos)
      };
      const idx = PARCELAS.findIndex((p) => p.id === "busqueda");
      if (idx !== -1) PARCELAS[idx] = nueva;
      else PARCELAS.push(nueva);
      estado.parcela = nueva;
      vbGuardada = null;
      estado.volumenes = [];
      estado.activo = null;
      estado.plantas = 1;
      estado.altura = alturaLegal(1)?.valor ?? 0;
      estado.linderosRevisados = false;
      estado.calificacion = "";
      const cx0 = lote.puntos.reduce((a, p) => a + p.x, 0) / lote.puntos.length;
      const cy0 = lote.puntos.reduce((a, p) => a + p.y, 0) / lote.puntos.length;
      const calDet = calificacionDetectada({ x: cx0, y: cy0 });
      let msgCal = "";
      if (calDet === "RUAIS") {
        estado.calificacion = "RUAIS";
        msgCal = t("cal-ruais");
      } else if (calDet) {
        msgCal = `${t("cal-otra")} ${calDet}${t("cal-otra2")}`;
      } else {
        msgCal = t("cal-sin");
      }
      $("q").value = "";
      $("msg").textContent = msgCal;
    } catch (error) {
      $("msg").textContent = `${t("no-encontre")}: ${String(error)}`;
    } finally {
      estado.cargando = false;
      recalcular();
    }
  }
  $("ifc-input").addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) cargarIFC(file);
    e.target.value = "";
  });
  async function cargarIFC(file) {
    estado.ifcMsg = "";
    try {
      const extracto = await fetch("http://localhost:8788/extracto", { method: "POST", body: file }).then((r) => r.json());
      if (extracto.error) throw new Error(extracto.error);
      let h = extracto.edificio.huella;
      if (extracto.coordenadasLocales) {
        const xs = estado.parcela.contorno.map((p) => p.x);
        const ys = estado.parcela.contorno.map((p) => p.y);
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        const hx = h.map((p) => p.x);
        const hy = h.map((p) => p.y);
        const dx = cx - (Math.min(...hx) + Math.max(...hx)) / 2;
        const dy = cy - (Math.min(...hy) + Math.max(...hy)) / 2;
        h = h.map((p) => ({ x: p.x + dx, y: p.y + dy }));
      }
      estado.parcela = { ...estado.parcela, id: `${estado.parcela.id}-ifc`, deIFC: true };
      estado.volumenes.push(h);
      estado.ifcVol = estado.volumenes.length - 1;
      estado.activo = estado.ifcVol;
      estado.plantas = extracto.edificio.numeroPlantas;
      estado.altura = extracto.edificio.alturaMaxima;
      const ifcIdx = PARCELAS.findIndex((p) => p.id.endsWith("-ifc"));
      if (ifcIdx !== -1) PARCELAS.splice(ifcIdx, 1);
      PARCELAS.push(estado.parcela);
      estado.ifcMsg = `IFC cargado: ${extracto.edificio.numeroPlantas} plantas, ${fmt(extracto.edificio.alturaMaxima, 1)} m`;
    } catch {
      estado.ifcMsg = "El lector IFC local no responde. Puedes seguir con la huella dibujada.";
    }
    recalcular();
  }
  $("btn-informe").addEventListener("click", () => {
    if (!estado.parcela) return;
    generarInforme();
  });
  function croquisSVG() {
    const svgPlano = document.getElementById("plano");
    if (!svgPlano) return "";
    const clon = svgPlano.cloneNode(true);
    clon.setAttribute("viewBox", `0 0 ${vistaObj.baseW.toFixed(2)} ${vistaObj.baseH.toFixed(2)}`);
    clon.removeAttribute("id");
    let s = new XMLSerializer().serializeToString(clon);
    const TOKENS = {
      "washi": "#F6F4EF",
      "lamina": "#FBFAF7",
      "kinari": "#EFECE5",
      "hilo": "#E2DED5",
      "cota": "#C9C4B8",
      "vacio": "#D9D5CB",
      "sumi": "#23221F",
      "sumi-2": "#57554F",
      "sumi-3": "#6E6B64",
      "sumi-4": "#8A877F",
      "ail": "#2F4A6D",
      "ail-hover": "#1E3350",
      "rojo": "#A23A2C",
      "rojo-tinte": "#F4E6E1",
      "rojo-tinta": "#7E2A1F",
      "ambar": "#94600F",
      "ambar-tinte": "#F5ECDC",
      "ambar-tinta": "#6B450A",
      "verde": "#3E6A40",
      "verde-tinte": "#E6EEE2",
      "verde-tinta": "#2D4F2F",
      "neutro": "#57554F",
      "neutro-tinte": "#EFECE5",
      "font-ui": "Arial, sans-serif",
      "font-veredicto": "Georgia, serif",
      "font-medida": "monospace"
    };
    s = s.replace(/var\(--ml-([a-z0-9-]+)\)/g, (_m, k) => TOKENS[k] ?? "#333333");
    const frontal = estado.parcela.linderos.filter((l) => l.tipo === "frontal");
    if (frontal.length > 0) {
      const f0 = frontal[0];
      const dx0 = f0.b.x - f0.a.x, dy0 = f0.b.y - f0.a.y;
      const len0 = Math.hypot(dx0, dy0) || 1;
      const ux = dx0 / len0, uy = dy0 / len0;
      let tmin = Infinity, tmax = -Infinity;
      for (const l of frontal) {
        const ta = (l.a.x - f0.a.x) * ux + (l.a.y - f0.a.y) * uy;
        const tb = (l.b.x - f0.a.x) * ux + (l.b.y - f0.a.y) * uy;
        tmin = Math.min(tmin, ta, tb);
        tmax = Math.max(tmax, ta, tb);
      }
      const mx = f0.a.x + ux * (tmin + tmax) / 2;
      const my = f0.a.y + uy * (tmin + tmax) / 2;
      const X = (p) => p.x - vistaObj.minX + vistaObj.m;
      const Y = (p) => vistaObj.maxY + vistaObj.m - p.y;
      const c = estado.parcela.contorno;
      const cxp = c.reduce((a, p) => a + p.x, 0) / c.length;
      const cyp = c.reduce((a, p) => a + p.y, 0) / c.length;
      let px = -uy;
      let py = ux;
      if (px * (cxp - mx) + py * (cyp - my) > 0) {
        px = -px;
        py = -py;
      }
      const tx = X({ x: mx + px * 1.3, y: 0 });
      const ty = Y({ x: 0, y: my + py * 1.3 });
      let ang = Math.atan2(Y(f0.b) - Y(f0.a), X(f0.b) - X(f0.a)) * 180 / Math.PI;
      if (ang > 90) ang -= 180;
      if (ang < -90) ang += 180;
      const texto = `<text x="${tx.toFixed(2)}" y="${ty.toFixed(2)}" font-family="Arial, sans-serif" font-size="1" fill="#A23A2C" letter-spacing="0.05" text-anchor="middle" dominant-baseline="middle" transform="rotate(${ang.toFixed(1)} ${tx.toFixed(2)} ${ty.toFixed(2)})">${t("ley-frente")}</text>`;
      s = s.replace("</svg>", `${texto}</svg>`);
    }
    return s;
  }
  function generarInforme() {
    const ev = evaluar();
    const p = estado.parcela;
    const al = alturaLegal(estado.plantas);
    const fecha = (/* @__PURE__ */ new Date()).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    const croquis = croquisSVG();
    const estadoTexto = {
      rojo: t("h1-rojo"),
      ambar: t("h1-ambar"),
      verde: t("h1-verde"),
      "sin-envolvente": t("h1-no-cabe"),
      "no-evaluable": getIdioma() === "en" ? `Not evaluable: zone ${estado.calificacion}` : `No evaluable: zona ${estado.calificacion}`
    };
    const nCumple = ev.resultados.filter((r) => r.cumple).length;
    const filas = ev.resultados.map((r) => {
      const est = r.cumple ? t("inf-cumple") : r.severidad === "bloqueo" ? t("inf-no-cumple") : t("inf-pendiente");
      const col = r.cumple ? "#2f6b3a" : r.severidad === "bloqueo" ? "#a63a3a" : "#9a7b1e";
      return `<tr>
        <td class="art">${r.articulo}</td>
        <td>${r.nombreCorto}</td>
        <td>${r.exige}</td>
        <td><b>${r.valorProyecto}</b></td>
        <td class="estado" style="color:${col}">${est}</td>
      </tr>
      <tr class="norma"><td colspan="5"><b>${t("inf-la-norma")}</b> ${r.textoNorma}<span class="fuente">${r.fuente}</span></td></tr>`;
    }).join("");
    const volsDatos = estado.volumenes.map((vol, i) => {
      const w2 = Math.max(...vol.map((q) => q.x)) - Math.min(...vol.map((q) => q.x));
      const h = Math.max(...vol.map((q) => q.y)) - Math.min(...vol.map((q) => q.y));
      return `${fmt(w2, 1)} \xD7 ${fmt(h, 1)} m \xB7 ${fmt(areaPoligono(vol))} m\xB2`;
    });
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>MonoLite \xB7 Report \xB7 ${p.nombre}</title>
<style>
  body { font: 12pt/1.5 Georgia, serif; color: #1a1a1a; max-width: 720pt; margin: 40pt auto; padding: 0 24pt; }
  header { border-bottom: 2pt solid #1a1a1a; padding-bottom: 10pt; margin-bottom: 18pt; }
  .marca { font-family: Arial, sans-serif; font-size: 9pt; letter-spacing: 2pt; }
  h1 { font: 20pt/1.2 Georgia, serif; margin: 6pt 0 2pt; }
  .meta { font: 9pt Arial, sans-serif; color: #555; }
  .veredicto { border: 1pt solid #1a1a1a; padding: 10pt 14pt; margin: 14pt 0; }
  .veredicto .estado { font: 15pt Georgia, serif; font-weight: bold; }
  .veredicto .cuenta { font: 10pt Arial, sans-serif; color: #555; margin-top: 2pt; }
  h2 { font: bold 10pt Arial, sans-serif; letter-spacing: 1.5pt; text-transform: uppercase; margin: 18pt 0 6pt; }
  .datos { width: 100%; border-collapse: collapse; font: 11pt Georgia, serif; }
  .datos td { padding: 3pt 10pt 3pt 0; vertical-align: top; }
  .datos td.k { font: bold 9pt Arial, sans-serif; color: #555; text-transform: uppercase; width: 150pt; }
  table.articulos { width: 100%; border-collapse: collapse; font: 10pt Arial, sans-serif; }
  table.articulos td { padding: 5pt 8pt; border-bottom: 0.5pt solid #ccc; vertical-align: top; }
  td.art { font-weight: bold; white-space: nowrap; }
  td.estado { font-weight: bold; white-space: nowrap; }
  tr.norma td { font: 9pt Georgia, serif; color: #444; border-bottom: 1.5pt solid #1a1a1a; padding-bottom: 10pt; }
  tr.norma .fuente { display: block; margin-top: 3pt; font: 8pt Arial, sans-serif; color: #777; }
  .croquis { border: 1pt solid #ccc; padding: 8pt; margin: 6pt 0 4pt; background: #FFFFFF; }
  .croquis svg { width: 100%; height: auto; display: block; }
  footer { margin-top: 24pt; padding-top: 8pt; border-top: 1pt solid #1a1a1a; font: 8.5pt Arial, sans-serif; color: #555; }
  @media print { body { margin: 0; max-width: none; } }
</style></head><body>
<header>
  <div class="marca">${t("inf-marca")}</div>
  <h1>${p.nombre}</h1>
  <div class="meta">${p.refCatastral ? `${t("inf-ref")} ${p.refCatastral} \xB7 ` : ""}${p.areaCatastral ? `${p.areaCatastral} m\xB2 \xB7 ` : ""}${t("inf-calificacion")} ${estado.calificacion || t("inf-sin-determ")} \xB7 ${fecha}</div>
</header>
<div class="veredicto">
  <div class="estado">${estadoTexto[ev.estado]}</div>
  <div class="cuenta">${t("cumple-de")} ${nCumple} ${t("de-articulos")} ${ev.resultados.length} ${t("evaluados")}${ev.sinEnvolvente ? "" : ` \xB7 ${t("inf-huella")} ${fmt(ev.huellaArea)} m\xB2`}</div>
</div>
${croquis ? `<h2>${t("inf-croquis")}</h2><div class="croquis">${croquis}</div>` : ""}
<h2>${t("inf-datos")}</h2>
<table class="datos">
  <tr><td class="k">${t("inf-plantas")}</td><td>${estado.plantas}${p.deIFC === true ? ` ${t("inf-segun-ifc")}` : ""}</td></tr>
  <tr><td class="k">${t("inf-altura")}</td><td>${fmt(estado.altura)} m${al ? ` \xB7 ${t("inf-alt-max-legal")} ${fmt(al.valor)} m (art. ${al.articulo})` : ""}</td></tr>
  <tr><td class="k">${t("inf-retranqueo")}</td><td>${t("inf-min-legal")} ${fmt(retranqueoMin(), 2)} m \xB7 ${t("inf-dist-proy")} ${ev.dist !== void 0 ? `${fmt(ev.dist)} m` : "\u2014"}</td></tr>
  ${volsDatos.length > 0 ? `<tr><td class="k">${t("inf-elementos")} (${volsDatos.length})</td><td>${volsDatos.map((d, i) => `${i + 1}. ${d}`).join("<br>")}${p.deIFC === true ? ` ${t("inf-huella-ifc")}` : ""} \xB7 ${t("inf-ocup-total")} ${fmt(ev.huellaArea)} m\xB2</td></tr>` : ""}
</table>
<h2>${t("inf-articulos")}</h2>
<table class="articulos">${filas}</table>
<footer>Informe generado por MonoLite a partir del PGOU de Granada 2001 (T\xEDtulo S\xE9ptimo \xB7 RUAIS). Verificaci\xF3n autom\xE1tica de par\xE1metros urban\xEDsticos; no sustituye el informe urban\xEDstico municipal.</footer>
</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) {
      URL.revokeObjectURL(url);
      return;
    }
    w.addEventListener("load", () => {
      w.print();
    }, { once: true });
  }
  $("cargar-ifc").addEventListener("click", () => {
    if (!estado.parcela) return;
    $("ifc-input").click();
  });
  function aplicarIdiomaEstatica() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const v = t(el.dataset.i18nTitle);
      el.removeAttribute("title");
      el.setAttribute("data-tt", v);
      el.setAttribute("aria-label", v);
    });
    $("q").placeholder = t("placeholder-dir");
    $("q").setAttribute("aria-label", t("placeholder-dir"));
    $("altura").setAttribute("aria-label", t("aria-altura"));
    $("plantas").setAttribute("aria-label", t("aria-plantas"));
  }
  (function etiquetasHover() {
    const label = $("tool-label");
    const wrap = label.parentElement;
    const mostrar = (btn) => {
      if (btn.disabled || btn.hidden || !btn.getAttribute("data-tt")) return;
      label.textContent = btn.getAttribute("data-tt");
      label.hidden = false;
      const r = btn.getBoundingClientRect();
      const w = wrap.getBoundingClientRect();
      label.style.left = `${r.right - w.left + 12}px`;
      label.style.top = `${r.top + r.height / 2 - w.top}px`;
    };
    const ocultar = () => {
      label.hidden = true;
    };
    for (const btn of document.querySelectorAll(".ml-vol-icono")) {
      btn.addEventListener("pointerenter", () => mostrar(btn));
      btn.addEventListener("pointerleave", ocultar);
      btn.addEventListener("pointerdown", ocultar);
    }
    document.addEventListener("pointermove", (e) => {
      if (label.hidden) return;
      const dentro = e.target?.closest?.(".ml-vol-icono");
      if (!dentro) ocultar();
    });
  })();
  $("idioma").addEventListener("change", (e) => {
    const v = e.target.value;
    setIdioma(v);
    try {
      localStorage.setItem("monolite-idioma", v);
    } catch {
    }
    aplicarIdiomaEstatica();
    recalcular();
  });
  try {
    const guardado = localStorage.getItem("monolite-idioma");
    if (guardado === "en" || guardado === "es") {
      setIdioma(guardado);
      $("idioma").value = guardado;
    }
  } catch {
  }
  aplicarIdiomaEstatica();
  recalcular();
})();
