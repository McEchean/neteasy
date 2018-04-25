var dbits;
var canary = 0xdeadbeefcafe;
var j_lm = 15715070 == (16777215 & canary);
function BigInteger(e, t, i) {
    if (null != e)
        if ("number" == typeof e)
            this.fromNumber(e, t, i);
        else if (null == t && "string" != typeof e)
            this.fromString(e, 256);
        else
            this.fromString(e, t)
}
function nbi() {
    return new BigInteger(null)
}
function am1(e, t, i, n, r, s) {
    for (; --s >= 0; ) {
        var a = t * this[e++] + i[n] + r;
        r = Math.floor(a / 67108864);
        i[n++] = 67108863 & a
    }
    return r
}
function am2(e, t, i, n, r, s) {
    var a = 32767 & t
      , o = t >> 15;
    for (; --s >= 0; ) {
        var _ = 32767 & this[e];
        var c = this[e++] >> 15;
        var u = o * _ + c * a;
        _ = a * _ + ((32767 & u) << 15) + i[n] + (1073741823 & r);
        r = (_ >>> 30) + (u >>> 15) + o * c + (r >>> 30);
        i[n++] = 1073741823 & _
    }
    return r
}
function am3(e, t, i, n, r, s) {
    var a = 16383 & t
      , o = t >> 14;
    for (; --s >= 0; ) {
        var _ = 16383 & this[e];
        var c = this[e++] >> 14;
        var u = o * _ + c * a;
        _ = a * _ + ((16383 & u) << 14) + i[n] + r;
        r = (_ >> 28) + (u >> 14) + o * c;
        i[n++] = 268435455 & _
    }
    return r
}
if (j_lm ) {
    BigInteger.prototype.am = am2;
    dbits = 30
} else if (j_lm ) {
    BigInteger.prototype.am = am1;
    dbits = 26
} else {
    BigInteger.prototype.am = am3;
    dbits = 28
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = (1 << dbits) - 1;
BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array;
var rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv)
    BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv)
    BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv)
    BI_RC[rr++] = vv;
function int2char(e) {
    return BI_RM.charAt(e)
}
function intAt(e, t) {
    var i = BI_RC[e.charCodeAt(t)];
    return null == i ? -1 : i
}
function bnpCopyTo(e) {
    for (var t = this.t - 1; t >= 0; --t)
        e[t] = this[t];
    e.t = this.t;
    e.s = this.s
}
function bnpFromInt(e) {
    this.t = 1;
    this.s = e < 0 ? -1 : 0;
    if (e > 0)
        this[0] = e;
    else if (e < -1)
        this[0] = e + DV;
    else
        this.t = 0
}
function nbv(e) {
    var t = nbi();
    t.fromInt(e);
    return t
}
function bnpFromString(e, t) {
    var i;
    if (16 == t)
        i = 4;
    else if (8 == t)
        i = 3;
    else if (256 == t)
        i = 8;
    else if (2 == t)
        i = 1;
    else if (32 == t)
        i = 5;
    else if (4 == t)
        i = 2;
    else {
        this.fromRadix(e, t);
        return
    }
    this.t = 0;
    this.s = 0;
    var n = e.length
      , r = !1
      , s = 0;
    for (; --n >= 0; ) {
        var a = 8 == i ? 255 & e[n] : intAt(e, n);
        if (!(a < 0)) {
            r = !1;
            if (0 == s)
                this[this.t++] = a;
            else if (s + i > this.DB) {
                this[this.t - 1] |= (a & (1 << this.DB - s) - 1) << s;
                this[this.t++] = a >> this.DB - s
            } else
                this[this.t - 1] |= a << s;
            s += i;
            if (s >= this.DB)
                s -= this.DB
        } else if ("-" == e.charAt(n))
            r = !0
    }
    if (8 == i && 0 != (128 & e[0])) {
        this.s = -1;
        if (s > 0)
            this[this.t - 1] |= (1 << this.DB - s) - 1 << s
    }
    this.clamp();
    if (r)
        BigInteger.ZERO.subTo(this, this)
}
function bnpClamp() {
    var e = this.s & this.DM;
    for (; this.t > 0 && this[this.t - 1] == e; )
        --this.t
}
function bnToString(e) {
    if (this.s < 0)
        return "-" + this.negate().toString(e);
    var t;
    if (16 == e)
        t = 4;
    else if (8 == e)
        t = 3;
    else if (2 == e)
        t = 1;
    else if (32 == e)
        t = 5;
    else if (4 == e)
        t = 2;
    else
        return this.toRadix(e);
    var i = (1 << t) - 1, n, r = !1, s = "", a = this.t;
    var o = this.DB - a * this.DB % t;
    if (a-- > 0) {
        if (o < this.DB && (n = this[a] >> o) > 0) {
            r = !0;
            s = int2char(n)
        }
        for (; a >= 0; ) {
            if (o < t) {
                n = (this[a] & (1 << o) - 1) << t - o;
                n |= this[--a] >> (o += this.DB - t)
            } else {
                n = this[a] >> (o -= t) & i;
                if (o <= 0) {
                    o += this.DB;
                    --a
                }
            }
            if (n > 0)
                r = !0;
            if (r)
                s += int2char(n)
        }
    }
    return r ? s : "0"
}
function bnNegate() {
    var e = nbi();
    BigInteger.ZERO.subTo(this, e);
    return e
}
function bnAbs() {
    return this.s < 0 ? this.negate() : this
}
function bnCompareTo(e) {
    var t = this.s - e.s;
    if (0 != t)
        return t;
    var i = this.t;
    t = i - e.t;
    if (0 != t)
        return this.s < 0 ? -t : t;
    for (; --i >= 0; )
        if (0 != (t = this[i] - e[i]))
            return t;
    return 0
}
function nbits(e) {
    var t = 1, i;
    if (0 != (i = e >>> 16)) {
        e = i;
        t += 16
    }
    if (0 != (i = e >> 8)) {
        e = i;
        t += 8
    }
    if (0 != (i = e >> 4)) {
        e = i;
        t += 4
    }
    if (0 != (i = e >> 2)) {
        e = i;
        t += 2
    }
    if (0 != (i = e >> 1)) {
        e = i;
        t += 1
    }
    return t
}
function bnBitLength() {
    if (this.t <= 0)
        return 0;
    else
        return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
}
function bnpDLShiftTo(e, t) {
    var i;
    for (i = this.t - 1; i >= 0; --i)
        t[i + e] = this[i];
    for (i = e - 1; i >= 0; --i)
        t[i] = 0;
    t.t = this.t + e;
    t.s = this.s
}
function bnpDRShiftTo(e, t) {
    for (var i = e; i < this.t; ++i)
        t[i - e] = this[i];
    t.t = Math.max(this.t - e, 0);
    t.s = this.s
}
function bnpLShiftTo(e, t) {
    var i = e % this.DB;
    var n = this.DB - i;
    var r = (1 << n) - 1;
    var s = Math.floor(e / this.DB), a = this.s << i & this.DM, o;
    for (o = this.t - 1; o >= 0; --o) {
        t[o + s + 1] = this[o] >> n | a;
        a = (this[o] & r) << i
    }
    for (o = s - 1; o >= 0; --o)
        t[o] = 0;
    t[s] = a;
    t.t = this.t + s + 1;
    t.s = this.s;
    t.clamp()
}
function bnpRShiftTo(e, t) {
    t.s = this.s;
    var i = Math.floor(e / this.DB);
    if (!(i >= this.t)) {
        var n = e % this.DB;
        var r = this.DB - n;
        var s = (1 << n) - 1;
        t[0] = this[i] >> n;
        for (var a = i + 1; a < this.t; ++a) {
            t[a - i - 1] |= (this[a] & s) << r;
            t[a - i] = this[a] >> n
        }
        if (n > 0)
            t[this.t - i - 1] |= (this.s & s) << r;
        t.t = this.t - i;
        t.clamp()
    } else
        t.t = 0
}
function bnpSubTo(e, t) {
    var i = 0
      , n = 0
      , r = Math.min(e.t, this.t);
    for (; i < r; ) {
        n += this[i] - e[i];
        t[i++] = n & this.DM;
        n >>= this.DB
    }
    if (e.t < this.t) {
        n -= e.s;
        for (; i < this.t; ) {
            n += this[i];
            t[i++] = n & this.DM;
            n >>= this.DB
        }
        n += this.s
    } else {
        n += this.s;
        for (; i < e.t; ) {
            n -= e[i];
            t[i++] = n & this.DM;
            n >>= this.DB
        }
        n -= e.s
    }
    t.s = n < 0 ? -1 : 0;
    if (n < -1)
        t[i++] = this.DV + n;
    else if (n > 0)
        t[i++] = n;
    t.t = i;
    t.clamp()
}
function bnpMultiplyTo(e, t) {
    var i = this.abs()
      , n = e.abs();
    var r = i.t;
    t.t = r + n.t;
    for (; --r >= 0; )
        t[r] = 0;
    for (r = 0; r < n.t; ++r)
        t[r + i.t] = i.am(0, n[r], t, r, 0, i.t);
    t.s = 0;
    t.clamp();
    if (this.s != e.s)
        BigInteger.ZERO.subTo(t, t)
}
function bnpSquareTo(e) {
    var t = this.abs();
    var i = e.t = 2 * t.t;
    for (; --i >= 0; )
        e[i] = 0;
    for (i = 0; i < t.t - 1; ++i) {
        var n = t.am(i, t[i], e, 2 * i, 0, 1);
        if ((e[i + t.t] += t.am(i + 1, 2 * t[i], e, 2 * i + 1, n, t.t - i - 1)) >= t.DV) {
            e[i + t.t] -= t.DV;
            e[i + t.t + 1] = 1
        }
    }
    if (e.t > 0)
        e[e.t - 1] += t.am(i, t[i], e, 2 * i, 0, 1);
    e.s = 0;
    e.clamp()
}
function bnpDivRemTo(e, t, i) {
    var n = e.abs();
    if (!(n.t <= 0)) {
        var r = this.abs();
        if (!(r.t < n.t)) {
            if (null == i)
                i = nbi();
            var s = nbi()
              , a = this.s
              , o = e.s;
            var _ = this.DB - nbits(n[n.t - 1]);
            if (_ > 0) {
                n.lShiftTo(_, s);
                r.lShiftTo(_, i)
            } else {
                n.copyTo(s);
                r.copyTo(i)
            }
            var c = s.t;
            var u = s[c - 1];
            if (0 != u) {
                var f = u * (1 << this.F1) + (c > 1 ? s[c - 2] >> this.F2 : 0);
                var h = this.FV / f
                  , l = (1 << this.F1) / f
                  , d = 1 << this.F2;
                var p = i.t
                  , N = p - c
                  , v = null == t ? nbi() : t;
                s.dlShiftTo(N, v);
                if (i.compareTo(v) >= 0) {
                    i[i.t++] = 1;
                    i.subTo(v, i)
                }
                BigInteger.ONE.dlShiftTo(c, v);
                v.subTo(s, s);
                for (; s.t < c; )
                    s[s.t++] = 0;
                for (; --N >= 0; ) {
                    var m = i[--p] == u ? this.DM : Math.floor(i[p] * h + (i[p - 1] + d) * l);
                    if ((i[p] += s.am(0, m, i, N, 0, c)) < m) {
                        s.dlShiftTo(N, v);
                        i.subTo(v, i);
                        for (; i[p] < --m; )
                            i.subTo(v, i)
                    }
                }
                if (null != t) {
                    i.drShiftTo(c, t);
                    if (a != o)
                        BigInteger.ZERO.subTo(t, t)
                }
                i.t = c;
                i.clamp();
                if (_ > 0)
                    i.rShiftTo(_, i);
                if (a < 0)
                    BigInteger.ZERO.subTo(i, i)
            }
        } else {
            if (null != t)
                t.fromInt(0);
            if (null != i)
                this.copyTo(i)
        }
    }
}
function bnMod(e) {
    var t = nbi();
    this.abs().divRemTo(e, null, t);
    if (this.s < 0 && t.compareTo(BigInteger.ZERO) > 0)
        e.subTo(t, t);
    return t
}
function Classic(e) {
    this.m = e
}
function cConvert(e) {
    if (e.s < 0 || e.compareTo(this.m) >= 0)
        return e.mod(this.m);
    else
        return e
}
function cRevert(e) {
    return e
}
function cReduce(e) {
    e.divRemTo(this.m, null, e)
}
function cMulTo(e, t, i) {
    e.multiplyTo(t, i);
    this.reduce(i)
}
function cSqrTo(e, t) {
    e.squareTo(t);
    this.reduce(t)
}
Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;
function bnpInvDigit() {
    if (this.t < 1)
        return 0;
    var e = this[0];
    if (0 == (1 & e))
        return 0;
    var t = 3 & e;
    t = t * (2 - (15 & e) * t) & 15;
    t = t * (2 - (255 & e) * t) & 255;
    t = t * (2 - ((65535 & e) * t & 65535)) & 65535;
    t = t * (2 - e * t % this.DV) % this.DV;
    return t > 0 ? this.DV - t : -t
}
function Montgomery(e) {
    this.m = e;
    this.mp = e.invDigit();
    this.mpl = 32767 & this.mp;
    this.mph = this.mp >> 15;
    this.um = (1 << e.DB - 15) - 1;
    this.mt2 = 2 * e.t
}
function montConvert(e) {
    var t = nbi();
    e.abs().dlShiftTo(this.m.t, t);
    t.divRemTo(this.m, null, t);
    if (e.s < 0 && t.compareTo(BigInteger.ZERO) > 0)
        this.m.subTo(t, t);
    return t
}
function montRevert(e) {
    var t = nbi();
    e.copyTo(t);
    this.reduce(t);
    return t
}
function montReduce(e) {
    for (; e.t <= this.mt2; )
        e[e.t++] = 0;
    for (var t = 0; t < this.m.t; ++t) {
        var i = 32767 & e[t];
        var n = i * this.mpl + ((i * this.mph + (e[t] >> 15) * this.mpl & this.um) << 15) & e.DM;
        i = t + this.m.t;
        e[i] += this.m.am(0, n, e, t, 0, this.m.t);
        for (; e[i] >= e.DV; ) {
            e[i] -= e.DV;
            e[++i]++
        }
    }
    e.clamp();
    e.drShiftTo(this.m.t, e);
    if (e.compareTo(this.m) >= 0)
        e.subTo(this.m, e)
}
function montSqrTo(e, t) {
    e.squareTo(t);
    this.reduce(t)
}
function montMulTo(e, t, i) {
    e.multiplyTo(t, i);
    this.reduce(i)
}
Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;
function bnpIsEven() {
    return 0 == (this.t > 0 ? 1 & this[0] : this.s)
}
function bnpExp(e, t) {
    if (e > 4294967295 || e < 1)
        return BigInteger.ONE;
    var i = nbi()
      , n = nbi()
      , r = t.convert(this)
      , s = nbits(e) - 1;
    r.copyTo(i);
    for (; --s >= 0; ) {
        t.sqrTo(i, n);
        if ((e & 1 << s) > 0)
            t.mulTo(n, r, i);
        else {
            var a = i;
            i = n;
            n = a
        }
    }
    return t.revert(i)
}
function bnModPowInt(e, t) {
    var i;
    if (e < 256 || t.isEven())
        i = new Classic(t);
    else
        i = new Montgomery(t);
    return this.exp(e, i)
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
    var e = nbi();
    this.copyTo(e);
    return e
}
function bnIntValue() {
    if (this.s < 0) {
        if (1 == this.t)
            return this[0] - this.DV;
        else if (0 == this.t)
            return -1
    } else if (1 == this.t)
        return this[0];
    else if (0 == this.t)
        return 0;
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
}
function bnByteValue() {
    return 0 == this.t ? this.s : this[0] << 24 >> 24
}
function bnShortValue() {
    return 0 == this.t ? this.s : this[0] << 16 >> 16
}
function bnpChunkSize(e) {
    return Math.floor(Math.LN2 * this.DB / Math.log(e))
}
function bnSigNum() {
    if (this.s < 0)
        return -1;
    else if (this.t <= 0 || 1 == this.t && this[0] <= 0)
        return 0;
    else
        return 1
}
function bnpToRadix(e) {
    if (null == e)
        e = 10;
    if (0 == this.signum() || e < 2 || e > 36)
        return "0";
    var t = this.chunkSize(e);
    var i = Math.pow(e, t);
    var n = nbv(i)
      , r = nbi()
      , s = nbi()
      , a = "";
    this.divRemTo(n, r, s);
    for (; r.signum() > 0; ) {
        a = (i + s.intValue()).toString(e).substr(1) + a;
        r.divRemTo(n, r, s)
    }
    return s.intValue().toString(e) + a
}
function bnpFromRadix(e, t) {
    this.fromInt(0);
    if (null == t)
        t = 10;
    var i = this.chunkSize(t);
    var n = Math.pow(t, i)
      , r = !1
      , s = 0
      , a = 0;
    for (var o = 0; o < e.length; ++o) {
        var _ = intAt(e, o);
        if (!(_ < 0)) {
            a = t * a + _;
            if (++s >= i) {
                this.dMultiply(n);
                this.dAddOffset(a, 0);
                s = 0;
                a = 0
            }
        } else if ("-" == e.charAt(o) && 0 == this.signum())
            r = !0
    }
    if (s > 0) {
        this.dMultiply(Math.pow(t, s));
        this.dAddOffset(a, 0)
    }
    if (r)
        BigInteger.ZERO.subTo(this, this)
}
function bnpFromNumber(e, t, i) {
    if ("number" == typeof t)
        if (e < 2)
            this.fromInt(1);
        else {
            this.fromNumber(e, i);
            if (!this.testBit(e - 1))
                this.bitwiseTo(BigInteger.ONE.shiftLeft(e - 1), op_or, this);
            if (this.isEven())
                this.dAddOffset(1, 0);
            for (; !this.isProbablePrime(t); ) {
                this.dAddOffset(2, 0);
                if (this.bitLength() > e)
                    this.subTo(BigInteger.ONE.shiftLeft(e - 1), this)
            }
        }
    else {
        var n = new Array
          , r = 7 & e;
        n.length = (e >> 3) + 1;
        t.nextBytes(n);
        if (r > 0)
            n[0] &= (1 << r) - 1;
        else
            n[0] = 0;
        this.fromString(n, 256)
    }
}
function bnToByteArray() {
    var e = this.t
      , t = new Array;
    t[0] = this.s;
    var i = this.DB - e * this.DB % 8, n, r = 0;
    if (e-- > 0) {
        if (i < this.DB && (n = this[e] >> i) != (this.s & this.DM) >> i)
            t[r++] = n | this.s << this.DB - i;
        for (; e >= 0; ) {
            if (i < 8) {
                n = (this[e] & (1 << i) - 1) << 8 - i;
                n |= this[--e] >> (i += this.DB - 8)
            } else {
                n = this[e] >> (i -= 8) & 255;
                if (i <= 0) {
                    i += this.DB;
                    --e
                }
            }
            if (0 != (128 & n))
                n |= -256;
            if (0 == r && (128 & this.s) != (128 & n))
                ++r;
            if (r > 0 || n != this.s)
                t[r++] = n
        }
    }
    return t
}
function bnEquals(e) {
    return 0 == this.compareTo(e)
}
function bnMin(e) {
    return this.compareTo(e) < 0 ? this : e
}
function bnMax(e) {
    return this.compareTo(e) > 0 ? this : e
}
function bnpBitwiseTo(e, t, i) {
    var n, r, s = Math.min(e.t, this.t);
    for (n = 0; n < s; ++n)
        i[n] = t(this[n], e[n]);
    if (e.t < this.t) {
        r = e.s & this.DM;
        for (n = s; n < this.t; ++n)
            i[n] = t(this[n], r);
        i.t = this.t
    } else {
        r = this.s & this.DM;
        for (n = s; n < e.t; ++n)
            i[n] = t(r, e[n]);
        i.t = e.t
    }
    i.s = t(this.s, e.s);
    i.clamp()
}
function op_and(e, t) {
    return e & t
}
function bnAnd(e) {
    var t = nbi();
    this.bitwiseTo(e, op_and, t);
    return t
}
function op_or(e, t) {
    return e | t
}
function bnOr(e) {
    var t = nbi();
    this.bitwiseTo(e, op_or, t);
    return t
}
function op_xor(e, t) {
    return e ^ t
}
function bnXor(e) {
    var t = nbi();
    this.bitwiseTo(e, op_xor, t);
    return t
}
function op_andnot(e, t) {
    return e & ~t
}
function bnAndNot(e) {
    var t = nbi();
    this.bitwiseTo(e, op_andnot, t);
    return t
}
function bnNot() {
    var e = nbi();
    for (var t = 0; t < this.t; ++t)
        e[t] = this.DM & ~this[t];
    e.t = this.t;
    e.s = ~this.s;
    return e
}
function bnShiftLeft(e) {
    var t = nbi();
    if (e < 0)
        this.rShiftTo(-e, t);
    else
        this.lShiftTo(e, t);
    return t
}
function bnShiftRight(e) {
    var t = nbi();
    if (e < 0)
        this.lShiftTo(-e, t);
    else
        this.rShiftTo(e, t);
    return t
}
function lbit(e) {
    if (0 == e)
        return -1;
    var t = 0;
    if (0 == (65535 & e)) {
        e >>= 16;
        t += 16
    }
    if (0 == (255 & e)) {
        e >>= 8;
        t += 8
    }
    if (0 == (15 & e)) {
        e >>= 4;
        t += 4
    }
    if (0 == (3 & e)) {
        e >>= 2;
        t += 2
    }
    if (0 == (1 & e))
        ++t;
    return t
}
function bnGetLowestSetBit() {
    for (var e = 0; e < this.t; ++e)
        if (0 != this[e])
            return e * this.DB + lbit(this[e]);
    if (this.s < 0)
        return this.t * this.DB;
    else
        return -1
}
function cbit(e) {
    var t = 0;
    for (; 0 != e; ) {
        e &= e - 1;
        ++t
    }
    return t
}
function bnBitCount() {
    var e = 0
      , t = this.s & this.DM;
    for (var i = 0; i < this.t; ++i)
        e += cbit(this[i] ^ t);
    return e
}
function bnTestBit(e) {
    var t = Math.floor(e / this.DB);
    if (t >= this.t)
        return 0 != this.s;
    else
        return 0 != (this[t] & 1 << e % this.DB)
}
function bnpChangeBit(e, t) {
    var i = BigInteger.ONE.shiftLeft(e);
    this.bitwiseTo(i, t, i);
    return i
}
function bnSetBit(e) {
    return this.changeBit(e, op_or)
}
function bnClearBit(e) {
    return this.changeBit(e, op_andnot)
}
function bnFlipBit(e) {
    return this.changeBit(e, op_xor)
}
function bnpAddTo(e, t) {
    var i = 0
      , n = 0
      , r = Math.min(e.t, this.t);
    for (; i < r; ) {
        n += this[i] + e[i];
        t[i++] = n & this.DM;
        n >>= this.DB
    }
    if (e.t < this.t) {
        n += e.s;
        for (; i < this.t; ) {
            n += this[i];
            t[i++] = n & this.DM;
            n >>= this.DB
        }
        n += this.s
    } else {
        n += this.s;
        for (; i < e.t; ) {
            n += e[i];
            t[i++] = n & this.DM;
            n >>= this.DB
        }
        n += e.s
    }
    t.s = n < 0 ? -1 : 0;
    if (n > 0)
        t[i++] = n;
    else if (n < -1)
        t[i++] = this.DV + n;
    t.t = i;
    t.clamp()
}
function bnAdd(e) {
    var t = nbi();
    this.addTo(e, t);
    return t
}
function bnSubtract(e) {
    var t = nbi();
    this.subTo(e, t);
    return t
}
function bnMultiply(e) {
    var t = nbi();
    this.multiplyTo(e, t);
    return t
}
function bnSquare() {
    var e = nbi();
    this.squareTo(e);
    return e
}
function bnDivide(e) {
    var t = nbi();
    this.divRemTo(e, t, null);
    return t
}
function bnRemainder(e) {
    var t = nbi();
    this.divRemTo(e, null, t);
    return t
}
function bnDivideAndRemainder(e) {
    var t = nbi()
      , i = nbi();
    this.divRemTo(e, t, i);
    return new Array(t,i)
}
function bnpDMultiply(e) {
    this[this.t] = this.am(0, e - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp()
}
function bnpDAddOffset(e, t) {
    if (0 != e) {
        for (; this.t <= t; )
            this[this.t++] = 0;
        this[t] += e;
        for (; this[t] >= this.DV; ) {
            this[t] -= this.DV;
            if (++t >= this.t)
                this[this.t++] = 0;
            ++this[t]
        }
    }
}
function NullExp() {}
function nNop(e) {
    return e
}
function nMulTo(e, t, i) {
    e.multiplyTo(t, i)
}
function nSqrTo(e, t) {
    e.squareTo(t)
}
NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;
function bnPow(e) {
    return this.exp(e, new NullExp)
}
function bnpMultiplyLowerTo(e, t, i) {
    var n = Math.min(this.t + e.t, t);
    i.s = 0;
    i.t = n;
    for (; n > 0; )
        i[--n] = 0;
    var r;
    for (r = i.t - this.t; n < r; ++n)
        i[n + this.t] = this.am(0, e[n], i, n, 0, this.t);
    for (r = Math.min(e.t, t); n < r; ++n)
        this.am(0, e[n], i, n, 0, t - n);
    i.clamp()
}
function bnpMultiplyUpperTo(e, t, i) {
    --t;
    var n = i.t = this.t + e.t - t;
    i.s = 0;
    for (; --n >= 0; )
        i[n] = 0;
    for (n = Math.max(t - this.t, 0); n < e.t; ++n)
        i[this.t + n - t] = this.am(t - n, e[n], i, 0, 0, this.t + n - t);
    i.clamp();
    i.drShiftTo(1, i)
}
function Barrett(e) {
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * e.t, this.r2);
    this.mu = this.r2.divide(e);
    this.m = e
}
function barrettConvert(e) {
    if (e.s < 0 || e.t > 2 * this.m.t)
        return e.mod(this.m);
    else if (e.compareTo(this.m) < 0)
        return e;
    else {
        var t = nbi();
        e.copyTo(t);
        this.reduce(t);
        return t
    }
}
function barrettRevert(e) {
    return e
}
function barrettReduce(e) {
    e.drShiftTo(this.m.t - 1, this.r2);
    if (e.t > this.m.t + 1) {
        e.t = this.m.t + 1;
        e.clamp()
    }
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    for (; e.compareTo(this.r2) < 0; )
        e.dAddOffset(1, this.m.t + 1);
    e.subTo(this.r2, e);
    for (; e.compareTo(this.m) >= 0; )
        e.subTo(this.m, e)
}
function barrettSqrTo(e, t) {
    e.squareTo(t);
    this.reduce(t)
}
function barrettMulTo(e, t, i) {
    e.multiplyTo(t, i);
    this.reduce(i)
}
Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;
function bnModPow(e, t) {
    var i = e.bitLength(), n, r = nbv(1), s;
    if (i <= 0)
        return r;
    else if (i < 18)
        n = 1;
    else if (i < 48)
        n = 3;
    else if (i < 144)
        n = 4;
    else if (i < 768)
        n = 5;
    else
        n = 6;
    if (i < 8)
        s = new Classic(t);
    else if (t.isEven())
        s = new Barrett(t);
    else
        s = new Montgomery(t);
    var a = new Array
      , o = 3
      , _ = n - 1
      , c = (1 << n) - 1;
    a[1] = s.convert(this);
    if (n > 1) {
        var u = nbi();
        s.sqrTo(a[1], u);
        for (; o <= c; ) {
            a[o] = nbi();
            s.mulTo(u, a[o - 2], a[o]);
            o += 2
        }
    }
    var f = e.t - 1, h, l = !0, d = nbi(), p;
    i = nbits(e[f]) - 1;
    for (; f >= 0; ) {
        if (i >= _)
            h = e[f] >> i - _ & c;
        else {
            h = (e[f] & (1 << i + 1) - 1) << _ - i;
            if (f > 0)
                h |= e[f - 1] >> this.DB + i - _
        }
        o = n;
        for (; 0 == (1 & h); ) {
            h >>= 1;
            --o
        }
        if ((i -= o) < 0) {
            i += this.DB;
            --f
        }
        if (l) {
            a[h].copyTo(r);
            l = !1
        } else {
            for (; o > 1; ) {
                s.sqrTo(r, d);
                s.sqrTo(d, r);
                o -= 2
            }
            if (o > 0)
                s.sqrTo(r, d);
            else {
                p = r;
                r = d;
                d = p
            }
            s.mulTo(d, a[h], r)
        }
        for (; f >= 0 && 0 == (e[f] & 1 << i); ) {
            s.sqrTo(r, d);
            p = r;
            r = d;
            d = p;
            if (--i < 0) {
                i = this.DB - 1;
                --f
            }
        }
    }
    return s.revert(r)
}
function bnGCD(e) {
    var t = this.s < 0 ? this.negate() : this.clone();
    var i = e.s < 0 ? e.negate() : e.clone();
    if (t.compareTo(i) < 0) {
        var n = t;
        t = i;
        i = n
    }
    var r = t.getLowestSetBit()
      , s = i.getLowestSetBit();
    if (s < 0)
        return t;
    if (r < s)
        s = r;
    if (s > 0) {
        t.rShiftTo(s, t);
        i.rShiftTo(s, i)
    }
    for (; t.signum() > 0; ) {
        if ((r = t.getLowestSetBit()) > 0)
            t.rShiftTo(r, t);
        if ((r = i.getLowestSetBit()) > 0)
            i.rShiftTo(r, i);
        if (t.compareTo(i) >= 0) {
            t.subTo(i, t);
            t.rShiftTo(1, t)
        } else {
            i.subTo(t, i);
            i.rShiftTo(1, i)
        }
    }
    if (s > 0)
        i.lShiftTo(s, i);
    return i
}
function bnpModInt(e) {
    if (e <= 0)
        return 0;
    var t = this.DV % e
      , i = this.s < 0 ? e - 1 : 0;
    if (this.t > 0)
        if (0 == t)
            i = this[0] % e;
        else
            for (var n = this.t - 1; n >= 0; --n)
                i = (t * i + this[n]) % e;
    return i
}
function bnModInverse(e) {
    var t = e.isEven();
    if (this.isEven() && t || 0 == e.signum())
        return BigInteger.ZERO;
    var i = e.clone()
      , n = this.clone();
    var r = nbv(1)
      , s = nbv(0)
      , a = nbv(0)
      , o = nbv(1);
    for (; 0 != i.signum(); ) {
        for (; i.isEven(); ) {
            i.rShiftTo(1, i);
            if (t) {
                if (!r.isEven() || !s.isEven()) {
                    r.addTo(this, r);
                    s.subTo(e, s)
                }
                r.rShiftTo(1, r)
            } else if (!s.isEven())
                s.subTo(e, s);
            s.rShiftTo(1, s)
        }
        for (; n.isEven(); ) {
            n.rShiftTo(1, n);
            if (t) {
                if (!a.isEven() || !o.isEven()) {
                    a.addTo(this, a);
                    o.subTo(e, o)
                }
                a.rShiftTo(1, a)
            } else if (!o.isEven())
                o.subTo(e, o);
            o.rShiftTo(1, o)
        }
        if (i.compareTo(n) >= 0) {
            i.subTo(n, i);
            if (t)
                r.subTo(a, r);
            s.subTo(o, s)
        } else {
            n.subTo(i, n);
            if (t)
                a.subTo(r, a);
            o.subTo(s, o)
        }
    }
    if (0 != n.compareTo(BigInteger.ONE))
        return BigInteger.ZERO;
    if (o.compareTo(e) >= 0)
        return o.subtract(e);
    if (o.signum() < 0)
        o.addTo(e, o);
    else
        return o;
    if (o.signum() < 0)
        return o.add(e);
    else
        return o
}
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
function bnIsProbablePrime(e) {
    var t, i = this.abs();
    if (1 == i.t && i[0] <= lowprimes[lowprimes.length - 1]) {
        for (t = 0; t < lowprimes.length; ++t)
            if (i[0] == lowprimes[t])
                return !0;
        return !1
    }
    if (i.isEven())
        return !1;
    t = 1;
    for (; t < lowprimes.length; ) {
        var n = lowprimes[t]
          , r = t + 1;
        for (; r < lowprimes.length && n < lplim; )
            n *= lowprimes[r++];
        n = i.modInt(n);
        for (; t < r; )
            if (n % lowprimes[t++] == 0)
                return !1
    }
    return i.millerRabin(e)
}
function bnpMillerRabin(e) {
    var t = this.subtract(BigInteger.ONE);
    var i = t.getLowestSetBit();
    if (i <= 0)
        return !1;
    var n = t.shiftRight(i);
    e = e + 1 >> 1;
    if (e > lowprimes.length)
        e = lowprimes.length;
    var r = nbi();
    for (var s = 0; s < e; ++s) {
        r.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
        var a = r.modPow(n, this);
        if (0 != a.compareTo(BigInteger.ONE) && 0 != a.compareTo(t)) {
            var o = 1;
            for (; o++ < i && 0 != a.compareTo(t); ) {
                a = a.modPowInt(2, this);
                if (0 == a.compareTo(BigInteger.ONE))
                    return !1
            }
            if (0 != a.compareTo(t))
                return !1
        }
    }
    return !0
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
if ("object" != typeof JSON)
    JSON = {};
!function() {
    "use strict";
    function f(e) {
        return e < 10 ? "0" + e : e
    }
    function quote(e) {
        escapable.lastIndex = 0;
        return escapable.test(e) ? '"' + e.replace(escapable, function(e) {
            var t = meta[e];
            return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + e + '"'
    }
    function str(e, t) {
        var i, n, r, s, a = gap, o, _ = t[e];
        if (_ && "object" == typeof _ && "function" == typeof _.toJSON)
            _ = _.toJSON(e);
        if ("function" == typeof rep)
            _ = rep.call(t, e, _);
        switch (typeof _) {
        case "string":
            return quote(_);
        case "number":
            return isFinite(_) ? String(_) : "null";
        case "boolean":
        case "null":
            return String(_);
        case "object":
            if (!_)
                return "null";
            gap += indent;
            o = [];
            if ("[object Array]" === Object.prototype.toString.apply(_)) {
                s = _.length;
                for (i = 0; i < s; i += 1)
                    o[i] = str(i, _) || "null";
                r = 0 === o.length ? "[]" : gap ? "[\n" + gap + o.join(",\n" + gap) + "\n" + a + "]" : "[" + o.join(",") + "]";
                gap = a;
                return r
            }
            if (rep && "object" == typeof rep) {
                s = rep.length;
                for (i = 0; i < s; i += 1)
                    if ("string" == typeof rep[i]) {
                        n = rep[i];
                        r = str(n, _);
                        if (r)
                            o.push(quote(n) + (gap ? ": " : ":") + r)
                    }
            } else
                for (n in _)
                    if (Object.prototype.hasOwnProperty.call(_, n)) {
                        r = str(n, _);
                        if (r)
                            o.push(quote(n) + (gap ? ": " : ":") + r)
                    }
            r = 0 === o.length ? "{}" : gap ? "{\n" + gap + o.join(",\n" + gap) + "\n" + a + "}" : "{" + o.join(",") + "}";
            gap = a;
            return r
        }
    }
    if ("function" != typeof Date.prototype.toJSON) {
        Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }
        ;
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf()
        }
    }
    var cx, escapable, gap, indent, meta, rep;
    if ("function" != typeof JSON.stringify) {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        };
        JSON.stringify = function(e, t, i) {
            var n;
            gap = "";
            indent = "";
            if ("number" == typeof i)
                for (n = 0; n < i; n += 1)
                    indent += " ";
            else if ("string" == typeof i)
                indent = i;
            rep = t;
            if (t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length))
                throw new Error("JSON.stringify");
            return str("", {
                "": e
            })
        }
    }
    if ("function" != typeof JSON.parse) {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function(text, reviver) {
            function walk(e, t) {
                var i, n, r = e[t];
                if (r && "object" == typeof r)
                    for (i in r)
                        if (Object.prototype.hasOwnProperty.call(r, i)) {
                            n = walk(r, i);
                            if (void 0 !== n)
                                r[i] = n;
                            else
                                delete r[i]
                        }
                return reviver.call(e, t, r)
            }
            var j;
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text))
                text = text.replace(cx, function(e) {
                    return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                });
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return "function" == typeof reviver ? walk({
                    "": j
                }, "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    }
}();
var RSAPublicKey = function(e, t) {
    this.modulus = new BigInteger(Hex.encode(e),16);
    this.encryptionExponent = new BigInteger(Hex.encode(t),16)
};
var UTF8 = {
    encode: function(e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var i = 0; i < e.length; i++) {
            var n = e.charCodeAt(i);
            if (n < 128)
                t += String.fromCharCode(n);
            else if (n > 127 && n < 2048) {
                t += String.fromCharCode(n >> 6 | 192);
                t += String.fromCharCode(63 & n | 128)
            } else {
                t += String.fromCharCode(n >> 12 | 224);
                t += String.fromCharCode(n >> 6 & 63 | 128);
                t += String.fromCharCode(63 & n | 128)
            }
        }
        return t
    },
    decode: function(e) {
        var t = "";
        var i = 0;
        var n = $c1 = $c2 = 0;
        for (; i < e.length; ) {
            n = e.charCodeAt(i);
            if (n < 128) {
                t += String.fromCharCode(n);
                i++
            } else if (n > 191 && n < 224) {
                $c2 = e.charCodeAt(i + 1);
                t += String.fromCharCode((31 & n) << 6 | 63 & $c2);
                i += 2
            } else {
                $c2 = e.charCodeAt(i + 1);
                $c3 = e.charCodeAt(i + 2);
                t += String.fromCharCode((15 & n) << 12 | (63 & $c2) << 6 | 63 & $c3);
                i += 3
            }
        }
        return t
    }
};
var Base64 = {
    base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
        if (!e)
            return !1;
        var t = "";
        var i, n, r;
        var s, a, o, _;
        var c = 0;
        do {
            i = e.charCodeAt(c++);
            n = e.charCodeAt(c++);
            r = e.charCodeAt(c++);
            s = i >> 2;
            a = (3 & i) << 4 | n >> 4;
            o = (15 & n) << 2 | r >> 6;
            _ = 63 & r;
            if (isNaN(n))
                o = _ = 64;
            else if (isNaN(r))
                _ = 64;
            t += this.base64.charAt(s) + this.base64.charAt(a) + this.base64.charAt(o) + this.base64.charAt(_)
        } while (c < e.length);return t
    },
    decode: function(e) {
        if (!e)
            return !1;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        var t = "";
        var i, n, r, s;
        var a = 0;
        do {
            i = this.base64.indexOf(e.charAt(a++));
            n = this.base64.indexOf(e.charAt(a++));
            r = this.base64.indexOf(e.charAt(a++));
            s = this.base64.indexOf(e.charAt(a++));
            t += String.fromCharCode(i << 2 | n >> 4);
            if (64 != r)
                t += String.fromCharCode((15 & n) << 4 | r >> 2);
            if (64 != s)
                t += String.fromCharCode((3 & r) << 6 | s)
        } while (a < e.length);return t
    }
};
var Hex = {
    hex: "0123456789abcdef",
    encode: function(e) {
        if (!e)
            return !1;
        var t = "";
        var i;
        var n = 0;
        do {
            i = e.charCodeAt(n++);
            t += this.hex.charAt(i >> 4 & 15) + this.hex.charAt(15 & i)
        } while (n < e.length);return t
    },
    decode: function(e) {
        if (!e)
            return !1;
        e = e.replace(/[^0-9abcdef]/g, "");
        var t = "";
        var i = 0;
        do
            t += String.fromCharCode(this.hex.indexOf(e.charAt(i++)) << 4 & 240 | 15 & this.hex.indexOf(e.charAt(i++)));
        while (i < e.length);return t
    }
};
var ASN1Data = function(e) {
    this.error = !1;
    this.parse = function(e) {
        if (!e) {
            this.error = !0;
            return null
        }
        var t = [];
        for (; e.length > 0; ) {
            var i = e.charCodeAt(0);
            e = e.substr(1);
            var n = 0;
            if (5 == (31 & i))
                e = e.substr(1);
            else if (128 & e.charCodeAt(0)) {
                var r = 127 & e.charCodeAt(0);
                e = e.substr(1);
                if (r > 0)
                    n = e.charCodeAt(0);
                if (r > 1)
                    n = n << 8 | e.charCodeAt(1);
                if (r > 2) {
                    this.error = !0;
                    return null
                }
                e = e.substr(r)
            } else {
                n = e.charCodeAt(0);
                e = e.substr(1)
            }
            var s = "";
            if (n) {
                if (n > e.length) {
                    this.error = !0;
                    return null
                }
                s = e.substr(0, n);
                e = e.substr(n)
            }
            if (32 & i)
                t.push(this.parse(s));
            else
                t.push(this.value(128 & i ? 4 : 31 & i, s))
        }
        return t
    }
    ;
    this.value = function(e, t) {
        if (1 == e)
            return t ? !0 : !1;
        else if (2 == e)
            return t;
        else if (3 == e)
            return this.parse(t.substr(1));
        else if (5 == e)
            return null;
        else if (6 == e) {
            var i = [];
            var n = t.charCodeAt(0);
            i.push(Math.floor(n / 40));
            i.push(n - 40 * i[0]);
            var r = [];
            var s = 0;
            var a;
            for (a = 1; a < t.length; a++) {
                var o = t.charCodeAt(a);
                r.push(127 & o);
                if (128 & o)
                    s++;
                else {
                    var _;
                    var c = 0;
                    for (_ = 0; _ < r.length; _++)
                        c += r[_] * Math.pow(128, s--);
                    i.push(c);
                    s = 0;
                    r = []
                }
            }
            return i.join(".")
        }
        return null
    }
    ;
    this.data = this.parse(e)
};
var RSA = {
    getPublicKey: function(e) {
        if (e.length < 50)
            return !1;
        if ("-----BEGIN PUBLIC KEY-----" != e.substr(0, 26))
            return !1;
        e = e.substr(26);
        if ("-----END PUBLIC KEY-----" != e.substr(e.length - 24))
            return !1;
        e = e.substr(0, e.length - 24);
        e = new ASN1Data(Base64.decode(e));
        if (e.error)
            return !1;
        e = e.data;
        if ("1.2.840.113549.1.1.1" == e[0][0][0])
            return new RSAPublicKey(e[0][1][0][0],e[0][1][0][1]);
        else
            return !1
    },
    encrypt: function(e, t) {
        if (!t)
            return !1;
        var i = t.modulus.bitLength() + 7 >> 3;
        e = this.pkcs1pad2(e, i);
        if (!e)
            return !1;
        e = e.modPowInt(t.encryptionExponent, t.modulus);
        if (!e)
            return !1;
        e = e.toString(16);
        for (; e.length < 2 * i; )
            e = "0" + e;
        return Base64.encode(Hex.decode(e))
    },
    decrypt: function(e) {
        var t = new BigInteger(e,16)
    },
    pkcs1pad2: function(e, t) {
        if (t < e.length + 11)
            return null;
        var i = [];
        var n = e.length - 1;
        for (; n >= 0 && t > 0; )
            i[--t] = e.charCodeAt(n--);
        i[--t] = 0;
        for (; t > 2; )
            i[--t] = Math.floor(254 * Math.random()) + 1;
        i[--t] = 2;
        i[--t] = 0;
        return new BigInteger(i)
    }
};
var MpUtil = function() {
    var e = function(e, t, i) {
        e.addEventListener ? e.addEventListener(t, i, !1) : e.attachEvent("on" + t, i)
    };
    var t = function(e, t, i) {
        e.removeEventListener ? e.removeEventListener(t, i, !1) : e.detachEvent("on" + t, i)
    };
    var i = function() {
        var e = +new Date;
        return function() {
            return "" + e++
        }
    }();
    var n = function(e, t) {
        try {
            t = t.toLowerCase();
            if (null === e)
                return "null" == t;
            if (void 0 === e)
                return "undefined" == t;
            else
                return Object.prototype.toString.call(e).toLowerCase() == "[object " + t + "]"
        } catch (i) {
            return !1
        }
    };
    return {
        addEvent: e,
        clearEvent: t,
        uniqueId: i,
        isTypeOf: n
    }
}();
var MP = function() {
    var e = "zc.reg.163.com"
      , t = "ntes_zc_"
      , i = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5gsH+AA4XWONB5TDcUd+xCz7ejOFHZKlcZDx+pF1i7Gsvi1vjyJoQhRtRSn950x498VUkx7rUxg1/ScBVfrRxQOZ8xFBye3pjAzfb22+RCuYApSVpJ3OO3KsEuKExftz9oFBv3ejxPlYc5yq7YiBO8XlTnQN0Sa4R4qhPO3I2MQIDAQAB-----END PUBLIC KEY-----"
      , n = "dl.reg.163.com";
    var r = function(e) {
        var t = "&";
        if (e.indexOf("?") == -1) {
            e += "?";
            t = ""
        }
        e = e + t + "topURL=";
        return e
    };
    var s = function(e) {
        return e.replace("dl.reg.163.com", "dl2.reg.163.com").replace("zc.reg.163.com", "zc2.reg.163.com").replace("passport.", "passport2.").replace("reg.icourse163.org", "reg2.icourse163.org")
    };
    var a = function(e) {
        var t = "&";
        if (e.indexOf("?") == -1) {
            e += "?";
            t = ""
        }
        return e
    };
    var o = function(e) {

        return e
    }
      , _ = function(t) {
        var i = t.data
          , n = (t.host ? t.host : e) + t.path;
        var r;
        var a = t.isLogin;
        if ("string" == typeof i)
            i = JSON.parse(i);
        r = i;
        delete i.isleak;
        delete r.isleak;
        u(i);
        var _ = 1e4;
        if ("POST" == t.type)
            i = JSON.stringify(i);
        var f = a ? {
            url: n,
            type: t.type,
            data: i,
            contentType: t.contentType || "application/json",
            dataType: t.dataType || "json",
            timeout: _,
            success: function(e) {
                var i = e && e.ret;
                if (201 != i)
                    t.error(t.path, e);
                else
                    t.success(t.path, e)
            },
            error: function() {
                var e = Array.prototype.slice.call(arguments);
                e.unshift(t.path);
                t.error.apply(null, e)
            }
        } : {
            url: n,
            type: t.type,
            data: i,
            contentType: t.contentType || "application/json",
            dataType: t.dataType || "json",
            timeout: _,
            success: function(e) {
                if (e && e.ret && ("102" === e.ret || "104" === e.ret || "200" === e.ret || "201" === e.ret || "202" === e.ret))
                    t.success(t.path, e);
                else
                    t.error(t.path, e)
            },
            error: function() {
                var e = Array.prototype.slice.call(arguments);
                e.unshift(t.path);
                t.error.apply(null, e)
            }
        };
        c(f)
    };
    var c = function() {
        var e = function(e) {
            var t = [];
            for (var i in e)
                t.push(encodeURIComponent(i) + "=" + encodeURIComponent(e[i]));
            return t.join("&")
        };
        var t = function() {
            if ("undefined" != typeof XMLHttpRequest)
                return new XMLHttpRequest;
            else if ("undefined" != typeof ActiveXObject) {
                var e = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
                for (var t = 0; t < e.length; t++)
                    try {
                        return new ActiveXObject(e[t])
                    } catch (i) {}
            } else
                throw new Error("您的系统或浏览器不支持XHR对象！")
        };
        var i = function(e) {
            var t = [];
            for (var i in e)
                t.push(encodeURIComponent(i) + "=" + encodeURIComponent(e[i]));
            t.push("nocache=" + (new Date).getTime());
            return t.join("&")
        };
        var n = function() {
            var e = function(e) {
                try {
                    return new Function("return " + e)()
                } catch (t) {
                    return null
                }
            };
            return function(t) {
                if ("string" != typeof t)
                    return t;

            }
        }();
        var r = function(e, t) {
            if (4 == e.readyState && !t.requestDone) {
                var i = e.status;
                var r = n(e.responseText) || {};
                if (i >= 200 && i < 300)
                    t.success && t.success(r);
                else {
                    r.eurl = t.url;
                    r.ret = i;
                    t.error && t.error(r)
                }
                this.xhr = null;
                clearTimeout(t.reqTimeout)
            } else if (!t.requestDone)
                if (!t.reqTimeout)
                    t.reqTimeout = setTimeout(function() {
                        t.requestDone = !0;
                        !!this.xhr && this.xhr.abort();
                        t.error && t.error({
                            ret: "-1"
                        });
                        clearTimeout(t.reqTimeout)
                    }, !t.timeout ? 5e3 : t.timeout)
        };
        return function(n) {
            n = n || {};
            n.requestDone = !1;
            n.type = (n.type || "GET").toUpperCase();
            n.dataType = n.dataType || "json";
            n.contentType = n.contentType || "application/x-www-form-urlencoded";
            n.async = n.async || !0;
            var s = n.data;
            var a = t();
            if (n.async === !0)
                a.onreadystatechange = function() {
                    r(a, n)
                }
                ;
            if ("GET" == n.type) {
                s = i(s);
                a.open("GET", n.url + "?" + s, n.async);
                a.send(null)
            } else if ("POST" == n.type) {
                a.open("POST", n.url, n.async);
                a.setRequestHeader("Content-Type", n.contentType);
                if ("application/x-www-form-urlencoded" == n.contentType) {
                    try {
                        s = JSON.parse(s)
                    } catch (o) {}
                    s = e(s)
                }
                a.send(s)
            }
            if (n.async === !1)
                r(a, n)
        }
    }();
    var u = function(e) {
        try {
            e.topURL = '11'
        } catch (t) {
            return
        }
    };
    return {
        promarkIdData: {},
        TICKET: "",
        encrypt: function(e, t) {
            var n = RSA.getPublicKey(i);
            return RSA.encrypt(e + "`" + t, n)
        },
        encrypt2: function(e) {
            var t = RSA.getPublicKey(i);
            return RSA.encrypt(e, t)
        },
        getCookieId: function(e, t) {
            MpRequest2.getCookie(e, t)
        },
        getId: function(e, i) {
            var n = t + e;
            var r = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(n).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
            i(r)
        }
    }
}();