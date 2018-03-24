// edited by Shadowslip

(function() {
    var t = {
        scope: {}
    };
    t.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function(e, t, a) {
        if (a.get || a.set)
            throw new TypeError("ES3 does not support getters and setters.");
        e != Array.prototype && e != Object.prototype && (e[t] = a.value)
    }
    ;
    t.getGlobal = function(e) {
        return "undefined" != typeof window && window === e ? e : "undefined" != typeof global ? global : e
    }
    ;
    t.global = t.getGlobal(this);
    t.polyfill = function(e, a, i, s) {
        if (a) {
            i = t.global;
            e = e.split(".");
            for (s = 0; s < e.length - 1; s++) {
                var r = e[s];
                r in i || (i[r] = {});
                i = i[r]
            }
            e = e[e.length - 1];
            s = i[e];
            a = a(s);
            a != s && null != a && t.defineProperty(i, e, {
                configurable: !0,
                writable: !0,
                value: a
            })
        }
    }
    ;
    t.polyfill("Math.trunc", function(e) {
        return e ? e : function(e) {
            e = Number(e);
            if (isNaN(e) || Infinity === e || -Infinity === e || 0 === e)
                return e;
            var t = Math.floor(Math.abs(e));
            return 0 > e ? -t : t
        }
    }, "es6-impl", "es3");
    t.polyfill("Array.prototype.fill", function(e) {
        return e ? e : function(e, t, a) {
            var i = this.length || 0;
            0 > t && (t = Math.max(0, i + t));
            if (null == a || a > i)
                a = i;
            a = Number(a);
            0 > a && (a = Math.max(0, i + a));
            for (t = Number(t || 0); t < a; t++)
                this[t] = e;
            return this
        }
    }, "es6-impl", "es3");
    (function() {
        function e(t, a, i) {
            function s(n, h) {
                if (!a[n]) {
                    if (!t[n]) {
                        var l = "function" == typeof require && require;
                        if (!h && l)
                            return l(n, !0);
                        if (r)
                            return r(n, !0);
                        l = Error("Cannot find module '" + n + "'");
                        throw l.code = "MODULE_NOT_FOUND",
                        l
                    }
                    l = a[n] = {
                        exports: {}
                    };
                    t[n][0].call(l.exports, function(e) {
                        var a = t[n][1][e];
                        return s(a ? a : e)
                    }, l, l.exports, e, t, a, i)
                }
                return a[n].exports
            }
            for (var r = "function" == typeof require && require, n = 0; n < i.length; n++)
                s(i[n]);
            return s
        }
        return e
    }
    )()({
        1: [function(t, a, i) {
            (function(a) {
                var i;
                function s(e, t, a) {
                    e = {
                        name: e,
                        ip: t,
                        serverConnURL: t,
                        region: a,
                        playersCount: -1,
                        ping: 1e4,
                        domOptionIndex: 0
                    };
                    ce.push(e);
                    fe[a].push(e);
                    return e
                }
                function r(e) {
                    this.serverObj = e;
                    e = "https:" === window.location.protocol ? "wss://" : "ws://";
                    this.testWs = new WebSocket(e + this.serverObj.serverConnURL + ":" + ("wss://" == e ? 7021 : 7020));
                    this.startT = +new Date;
                    this.testWs.binaryType = "arraybuffer";
                    var t = this;
                    this.pingsDelayMsTot = this.pingsRec = 0;
                    this.testWs.onopen = function() {
                        t.sendPing()
                    }
                    ;
                    this.sendPing = function() {
                        var e = new x(1);
                        e.writeUInt8(255);
                        t.testWs.send(e.dataView.buffer);
                        this.startT = +new Date
                    }
                    ;
                    this.testWs.onmessage = function(e) {
                        e = new T(new DataView(e.data));
                        255 == e.readUInt8() && (e = +new Date - t.startT,
                        t.pingsRec += 1,
                        t.pingsDelayMsTot += e,
                        3 <= t.pingsRec ? (t.serverObj.ping = t.pingsDelayMsTot / t.pingsRec,
                        t.testWs.close(),
                        t.serverObj.ping < Te.ping && (Te = t.serverObj),
                        e = xe.indexOf(t),
                        -1 != e && xe.splice(e, 1),
                        0 == xe.length && (Se && clearTimeout(Se),
                        h())) : t.sendPing())
                    }
                }
                function n() {
                    if (De)
                        h();
                    else if (!_e) {
                        _e = !0;
                        for (var e in fe)
                            fe.hasOwnProperty(e) && 0 < fe[e].length && "SANDBOX" != e && xe.push(new r(fe[e][0]));
                        Se = setTimeout(function() {
                            for (var e = 0; e < xe.length; e++)
                                xe[e].testWs.close();
                            h()
                        }, 3e3)
                    }
                }
                function h() {
                    _e && (De = !0);
                    _e = !1;
                    console.log("@@@@  Fastest region is " + Te.region + " with ping " + Te.ping + "ms ");
                    ke = Te.region;
                    l()
                }
                function l() {
                    var e = fe[ke].slice();
                    e.sort(function(e, t) {
                        return e.playersCount < t.playersCount ? 1 : e.playersCount > t.playersCount ? -1 : 0
                    });
                    for (var t = !1, a = !0, i = 0; i < e.length; i++)
                        if (500 > e[i].playersCount && 0 <= e[i].playersCount && (a = !1),
                        400 > e[i].playersCount && 0 <= e[i].playersCount) {
                            ve = e[i];
                            Me = fe[ke].indexOf(ve);
                            t = !0;
                            break
                        }
                    if (!t)
                        if (a && _r)
                            for (console.log("All servers in region " + ke + " are full/offline! Picking random server..."),
                            a = !0,
                            i = 0; i < ce.length; i++) {
                                if (500 > ce[i].playersCount) {
                                    ve = ce[i];
                                    Me = fe[ve.region].indexOf(ve);
                                    ke = ve.region;
                                    break
                                }
                            }
                        else
                            ve = e[p(0, e.length - 1)],
                            Me = e.indexOf(ve);
                    console.log("Connecting to best server...");
                    D(ve)
                }
                function o(e) {
                    switch (e) {
                    case Xi:
                        return Ne;
                    case Yi:
                        return Oe;
                    default:
                    case Li:
                        return Ce
                    }
                }
                function c(e) {
                    if (!loadedAudio.hasOwnProperty(e) && !vs) {
                        var t = new Audio(e);
                        console.log("loading audio: " + e);
                        loadedAudio[e] = t;
                        t.volume = .7;
                        t.muted = vs
                    }
                    return loadedAudio[e]
                }
                function g(e) {
                    $i && ($i.pause(),
                    $i.currentTime = 0);
                    es = e;
                    if (!vs) {
                        console.log("changed music to " + e);
                        $i = c(e, !0);
                        try {
                            $i.play()
                        } catch (e) {}
                    }
                }
                function f(e) {
                    loadedImgs.hasOwnProperty(e) || (loadedImgs[e] = new Image,
                    loadedImgs[e].src = e);
                    return 0 != loadedImgs[e].width && loadedImgs[e].complete ? loadedImgs[e] : null
                }
                function p(e, t) {
                    return Math.floor(Math.random() * (t - e + 1)) + e
                }
                function m(e) {
                    return Math.PI / 180 * e
                }
                function b(e, t) {
                    return 0 != (e >> t) % 2
                }
                function u(e, t) {
                    var a;
                    a = 180 / Math.PI * (t - e);
                    a = Math.trunc(a) % 360 + (a - Math.trunc(a));
                    a = 0 < a ? a : a + 360;
                    180 < a && (a -= 360);
                    return m(a)
                }
                function y(e) {
                    return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                function w(e, t, a, i, s, r) {
                    this.x = e;
                    this.y = t;
                    this.w = a;
                    this.h = i;
                    this.aniT = s;
                    this.buttonTXT = new I(12,"white");
                    this.buttonTXT.renderScale = 1.5;
                    this.buttonTXT.setText(W(s).aniName);
                    this.isHighLighted = !1;
                    this.biomeNum = r;
                    e = new k(0,ia,0,0,30);
                    e.x = e.ox = e.nx = 0;
                    e.y = e.oy = e.ny = 0;
                    e.type = s;
                    e.alwaysPlainOutline = !0;
                    this.drawnAniObj = e;
                    this.buttonScaleF = 1;
                    this.testPosHitsButton = function(e, t) {
                        return e < this.x - this.w / 2 || e > this.x + this.w / 2 ? !1 : t < this.y - this.w / 2 || t > this.y + this.w / 2 ? !1 : !0
                    }
                    ;
                    this.setPosAndSize = function(e, t, a, i, s, r) {
                        this.w = a;
                        this.h = i;
                        this.x = e + a * (.5 - s);
                        this.y = t + i * (.5 - r)
                    }
                    ;
                    this.draw = function() {
                        Ki.save();
                        Ki.translate(this.x, this.y);
                        Ki.scale(this.buttonScaleF, this.buttonScaleF);
                        var e = Ki.globalAlpha;
                        Ki.globalAlpha = .75 * e;
                        switch (this.biomeNum) {
                        case 1:
                            Ki.fillStyle = "#1C91B8";
                            break;
                        case 0:
                            Ki.fillStyle = "#26A73A";
                            break;
                        case 2:
                            Ki.fillStyle = "#B2B2B2"
                        }
                        Ki.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h);
                        this.isHighLighted && (Ki.fillStyle = "white",
                        Ki.globalAlpha = .2 * e,
                        Ki.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h));
                        Ki.globalAlpha = e;
                        this.drawnAniObj.nRad = this.drawnAniObj.rad = .6 * a / 2 * rs;
                        Ki.save();
                        Ki.scale(2, 2);
                        this.drawnAniObj.draw();
                        Ki.restore();
                        this.buttonTXT.setFontSize(23 * rs);
                        this.buttonTXT.x = 0;
                        this.buttonTXT.y = .375 * -this.h;
                        this.buttonTXT.draw();
                        Ki.restore()
                    }
                }
                function P(e) {
                    var t = c("audio/click.mp3");
                    if (t)
                        try {
                            t.play()
                        } catch (e) {}
                    newMsg = new x(2);
                    newMsg.writeUInt8(24);
                    newMsg.writeUInt8(zr.indexOf(e));
                    N(newMsg);
                    Lr && (cr = !1,
                    X(!1));
                    Lr = jr = !1
                }
                function A(e) {
                    this.buttonTXT = new I(10,"white");
                    this.buttonTXT.renderScale = 1.5;
                    this.buttonTXT.setText(e);
                    this.draw = function() {
                        this.visible && (Ki.save(),
                        Ki.globalAlpha = .2,
                        Ki.fillStyle = this.pressed ? "white" : "#000000",
                        Ki.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h),
                        Ki.globalAlpha = .2,
                        this.buttonTXT.setFontSize(15 * Zi),
                        this.buttonTXT.x = this.x,
                        this.buttonTXT.y = this.y,
                        this.buttonTXT.draw(),
                        Ki.restore())
                    }
                }
                function I(e, t) {
                    e && (this._fntSize = e);
                    t && (this._color = t)
                }
                function k(e, t, a, i, s) {
                    this.id = e;
                    this.oType = t;
                    this.ox = this.x = this.nx = a;
                    this.oy = this.y = this.ny = i;
                    this.nRad = s;
                    this.oRad = this.rad = 0;
                    if (t == ei || t == Ya || t == la || t == wa || t == ca || t == ba || t == sa || t == oa || t == ua || t == fa)
                        this.oRad = this.rad = s;
                    this.rPer = 1 * Math.random() + 0;
                    this.updateTime = this.spawnTime = Ur;
                    this.firstPosUpd = !0;
                    this.flag_hurt = !1;
                    this.hpBarTimeoutT = this.hpPer = this.hpPer_n = this.hpBarA = 0;
                    this.oType == ia && (this.flag_iceSliding = this.flag_eff_invincible = this.flag_usingAbility = this.flag_eff_frozen = this.flag_eff_stunned = this.flag_underWater = this.flag_tailBitten = this.flag_lowWat = !1,
                    this.frozenEffA = this.onFireEffA = this.effA_healing = this.effA_poison = this.effA_bleeding = this.effA_stunk = this.effA_constricted = this.effA_webStuck = this.stunA = this.bleedingA = this.underwaterA = 0,
                    this.flag_eff_healing = this.flag_eff_poison = this.flag_eff_bleeding = !1,
                    this.nameA = 0,
                    this.getNameSize = function() {
                        return 10
                    }
                    ,
                    this.setName = function(e) {
                        if (this.name = e)
                            null == this.nameTXT ? (this.nameTXT = new I(this.getNameSize(),"#FFFFFF"),
                            this.nameTXT.strokeW = 1.5,
                            this.nameTXT.renderScale = 5) : this.nameTXT.setFontSize(this.getNameSize()),
                            this.nameTXT.setText(this.name)
                    }
                    );
                    this.alwaysPlainOutline = !1;
                    if (this.oType == ia || this.oType == na || this.oType == ma || this.oType == da)
                        this.chatLines = [];
                    this.updateZ = function() {
                        switch (this.oType) {
                        case aa:
                            this.z = -220;
                            break;
                        case ya:
                            this.z = -210;
                            break;
                        case Ya:
                        case ei:
                            this.z = -209;
                            break;
                        case Na:
                            this.z = -202;
                            break;
                        case Oa:
                            this.z = -201;
                            break;
                        case Ga:
                        case ca:
                        case La:
                        case ii:
                            this.z = -159;
                            break;
                        case pa:
                        case la:
                            this.z = -158;
                            break;
                        case za:
                            this.z = -158;
                            break;
                        case wa:
                            this.z = -156;
                            break;
                        case ra:
                            this.z = -155;
                            break;
                        case ba:
                            if (this.type == Fi) {
                                this.z = 100002;
                                break
                            }
                            this.z = this.type == yi || this.type == Ai || this.type == xi || this.type == Ti || this.type == Gi || this.type == Ii || this.type == Ei || this.type == _i || this.type == Ui || this.type == Bi || this.type == Ni || this.type == Oi || this.type == Ri || this.type == Wi || this.type == Hi ? 10001 : this.type == vi ? 1002 : -152;
                            break;
                        case ma:
                            this.z = -150;
                            break;
                        case fa:
                            this.z = -102;
                            break;
                        case da:
                            this.z = -101;
                            break;
                        case na:
                            this.z = -100;
                            break;
                        case Xa:
                            this.z = -99;
                            break;
                        case sa:
                            this.z = 999;
                            break;
                        case di:
                        case ua:
                            this.z = 1e3;
                            break;
                        case oa:
                            this.z = 1001;
                            break;
                        case ai:
                            this.z = 1002;
                            break;
                        case Da:
                        case Sa:
                            this.z = 1004;
                            break;
                        case Ua:
                        case Ea:
                            this.z = 1006;
                            break;
                        case Pa:
                        case si:
                            this.z = 1006;
                            break;
                        case ha:
                            this.z = 1e4;
                            break;
                        case oi:
                            this.z = 1002;
                            0 != this.specType && (this.z = 10001);
                            break;
                        case ia:
                            this.z = this.flag_flying ? 10001 + this.rad - (this.flag_usingAbility ? 0 : this.rad / 2) : this.flag_usingAbility && this.type == Kt ? 10001 : this.flag_underWater || this.flag_usingAbility && this.type == et ? -140 : this.type == Kt ? 1010 : this.type == Ht ? 1009 : this.type == Vt ? 1008 + (this.flag_usingAbility ? 1 : 0) : this.type == lt ? 1007 : this.flag_canClimbHill || this.type == st || this.type == nt || this.type == It || this.type == St || this.type == ct || this.type == mt || this.type == Et || this.type == Bt || this.type == Tt || this.type == jt || this.type == kt || this.type == Lt || this.type == Xt || this.type == Yt ? 1003 : this.type == Jt ? 1e3 : this.rad;
                            break;
                        default:
                            this.z = this.rad
                        }
                    }
                    ;
                    this.draw = function(e) {
                        var t = this.moveUpdate();
                        Ki.save();
                        Ki.translate(this.x, this.y);
                        if (!Is)
                            var a = !1;
                        switch (this.oType) {
                        case Ia:
                        case Ea:
                        case Ba:
                        case Ca:
                        case Ua:
                        case ka:
                        case Pa:
                        case si:
                        case ai:
                        case Ma:
                        case Ta:
                        case va:
                        case na:
                        case ma:
                        case da:
                        case _a:
                        case Ra:
                        case Wa:
                        case Fa:
                        case Ha:
                        case ja:
                        case ri:
                        case Va:
                        case Ja:
                        case ti:
                        case qa:
                        case Ka:
                        case Za:
                        case Qa:
                        case $a:
                        case li:
                        case di:
                            a = !0
                        }
                        if (a) {
                            var i;
                            i = (Ur - this.spawnTime) / 1e3;
                            var s = 1.5
                              , a = .1;
                            if (this.oType == na || this.oType == da || this.oType == ma || this.oType == ai)
                                s = 2.5,
                                a = .04;
                            i = a * Math.sin(2 * Math.PI / s * i);
                            Ki.scale(1 + i, 1 + i / 2)
                        }
                        s = this.getOutlineColor();
                        a = 2;
                        Ki.globalAlpha = this.dead ? Ki.globalAlpha * (1 - t) : Ki.globalAlpha * Math.min(1, (Ur - this.spawnTime) / (1e3 * Ee));
                        switch (this.oType) {
                        case sa:
                            switch (this.curBiome) {
                            case Xi:
                                e ? v(0, 0, this.rad, this.getOutlineColor()) : v(0, 0, this.rad - 1.5, je);
                                break;
                            case Yi:
                                e ? v(0, 0, this.rad, "white") : v(0, 0, this.rad - 1.5, Be);
                                break;
                            default:
                                e ? v(0, 0, this.rad, this.getOutlineColor()) : v("", Ce)
                            }
                            break;
                        case Da:
                            Ki.save();
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 1.5 * Math.sin(2 * Math.PI / 2 * i);
                            var r = this.curBiome == Xi ? Xe : ze;
                            Ki.fillStyle = r;
                            t = .8 * this.rad;
                            this.drawOutlinedCircle("", r);
                            Ki.globalAlpha *= .98;
                            e = .5 * -t + 10 * this.rPer;
                            s = Math.max(0, .65 * t + i) + 2;
                            v(.5 * -t, e, s, r);
                            e = .5 * -t - 10 * this.rPer;
                            s = Math.max(0, .73 * t - i);
                            v(.5 * t, e, s, r);
                            s = Math.max(0, .78 * t + i);
                            v(.6 * t, .4 * t, s, r);
                            e = .5 * t + 10 * this.rPer;
                            s = Math.max(0, .6 * t + this.rPer - i);
                            v(.5 * -t, e, s, r);
                            Ki.restore();
                            break;
                        case ua:
                            this.drawOutlinedCircle("", "#1AAE31");
                            Ki.save();
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 1.5 * Math.sin(2 * Math.PI / 2 * i);
                            Ki.fillStyle = Ue;
                            e = .75 * this.rad;
                            Ki.globalAlpha *= .8;
                            Ki.beginPath();
                            Ki.arc(.5 * -e, .5 * -e + 10 * this.rPer, Math.max(0, .65 * e + i), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.beginPath();
                            Ki.arc(.5 * e, .5 * -e - 10 * this.rPer, Math.max(0, .73 * e - i), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.beginPath();
                            Ki.arc(.6 * e, .4 * e, Math.max(0, .78 * e + i), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.beginPath();
                            Ki.arc(.5 * -e, .5 * e, Math.max(0, .6 * e + this.rPer - i), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.restore();
                            break;
                        case Sa:
                            Ki.save();
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 1.5 * Math.sin(2 * Math.PI / 2 * i);
                            t = .8 * this.rad;
                            r = Xe;
                            this.drawOutlinedCircle("", r);
                            Ki.globalAlpha *= .98;
                            e = .5 * -t + 10 * this.rPer;
                            s = Math.max(0, .65 * t + i) + 2;
                            v(.5 * -t, e, s, r);
                            e = .5 * -t - 10 * this.rPer;
                            s = Math.max(0, .73 * t - i);
                            v(.5 * t, e, s, r);
                            s = Math.max(0, .78 * t + i);
                            v(.6 * t, .4 * t, s, r);
                            e = .5 * t + 10 * this.rPer;
                            s = Math.max(0, .6 * t + this.rPer - i);
                            v(.5 * -t, e, s, r);
                            Ki.restore();
                            break;
                        case ra:
                            Ki.save();
                            e = this.curBiome == Yi ? "#7790d8" : Fe;
                            this.drawOutlinedCircle("", e);
                            Is || Ki.rotate(2 * this.rPer * Math.PI);
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 4 * Math.sin(2 * Math.PI / 7 * i);
                            Ki.fillStyle = this.curBiome == Yi ? "#7790d8" : Fe;
                            Ki.beginPath();
                            Ki.arc(0, 0, Math.max(0, this.rad - a + i), 0, 2 * Math.PI);
                            Ki.fill();
                            Is || (Ki.beginPath(),
                            Ki.arc(.3 * this.rad, .35 * -this.rad + 15 * this.rPer, Math.max(0, .35 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.5 * this.rad, .5 * this.rad + 15 * this.rPer, Math.max(0, .4 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.55 * -this.rad * .707, .55 * +this.rad * .707 + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.75 * -this.rad, .35 * -this.rad + 15 * this.rPer, Math.max(0, .3 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill());
                            Ki.restore();
                            break;
                        case Ia:
                            e = Ge;
                            this.curBiome == Yi && (e = "#ac443c");
                            this.drawOutlinedCircle("", e);
                            break;
                        case Ea:
                            if (i = f("img/banana" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e);
                            break;
                        case Ba:
                            if (i = f("img/rasp" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e);
                            break;
                        case Ca:
                            if (i = f("img/pear" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e);
                            break;
                        case Ra:
                            if (i = f("img/seaweed" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e);
                            break;
                        case Wa:
                            if (i = f("img/starfish" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e);
                            break;
                        case Fa:
                            if (i = f("img/kelp" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e);
                            break;
                        case Ha:
                            if (i = f("img/clam" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e);
                            break;
                        case ja:
                            if (i = f("img/conch" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = 1 * this.rad,
                                Ki.save(),
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e),
                                Ki.restore();
                            break;
                        case Ua:
                            if (i = f("img/coconut" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e);
                            break;
                        case hi:
                        case ni:
                            break;
                        case oi:
                            if (i = f("img/santa/sleig.png"))
                                e = this.rad,
                                Ki.save(),
                                Ki.rotate(this.angle),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e),
                                Ki.restore();
                            break;
                        case li:
                            e = "";
                            1 == this.specType && (e = "golden");
                            if (i = f("img/" + e + "egg" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.save(),
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e),
                                Ki.restore();
                            break;
                        case di:
                            if (i = f("img/quill.png"))
                                e = this.rad,
                                Ki.rotate(this.angle),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e);
                            break;
                        case _a:
                            this.drawOutlinedCircle("", Le);
                            Ki.rotate(this.rPer * Math.PI * 2);
                            v(.25 * this.rad, .4 * this.rad, (.3 + .15 * this.rPer) * this.rad, "#905113");
                            break;
                        case Xa:
                            switch (this.curBiome) {
                            case Xi:
                                e = "_ocean";
                                break;
                            case Yi:
                                e = "_arctic";
                                break;
                            default:
                                e = ""
                            }
                            if (i = f("img/healingStone" + e + ".png"))
                                e = this.rad,
                                Ki.save(),
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e),
                                Ki.restore();
                            break;
                        case za:
                            v(0, 0, Math.max(0, 1 * this.rad), "#815427");
                            v(0, 0, Math.max(0, .6 * this.rad), "#6e4b29");
                            v(0, 0, Math.max(0, .5 * this.rad), "#543d28");
                            v(0, 0, Math.max(0, .45 * this.rad), "#3f3124");
                            v(0, 0, Math.max(0, .33 * this.rad), "#241e19");
                            v(0, 0, Math.max(0, .25 * this.rad), "#120f0d");
                            v(0, 0, Math.max(0, .2 * this.rad), We);
                            break;
                        case La:
                            Ki.save();
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 2.5 * Math.sin(2 * Math.PI / 4 * i);
                            if (e)
                                a = 4,
                                Ki.fillStyle = "#815427",
                                Ki.beginPath(),
                                Ki.arc(0, 0, this.rad, 0, 2 * Math.PI),
                                Ki.fill();
                            else {
                                Ki.fillStyle = We;
                                Ki.beginPath();
                                Ki.arc(0, 0, Math.max(0, this.rad - a + i), 0, 2 * Math.PI);
                                Ki.fill();
                                Is || (Ki.beginPath(),
                                Ki.arc(.45 * this.rad, .45 * -this.rad + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(.5 * this.rad, .5 * this.rad + 15 * this.rPer, Math.max(0, .4 * this.rad + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(.55 * -this.rad * .707, .55 * +this.rad * .707 + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(.75 * -this.rad, .35 * -this.rad + 15 * this.rPer, Math.max(0, .3 * this.rad + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(this.rad - 20 * this.rPer, 50 * this.rPer, 10, 0, 2 * Math.PI),
                                Ki.fill());
                                Ki.save();
                                Ki.globalAlpha = 1 - this.underwaterA;
                                i = (Ur - this.spawnTime) / 1e3;
                                e = 8 * Math.sin(2 * Math.PI / 1.5 * i);
                                this.flag_underWater && (Ki.globalAlpha *= .5,
                                this.type == rt && (Ki.globalAlpha = .3));
                                Ki.fillStyle = "yellow";
                                i = .15 * this.rad;
                                Ki.beginPath();
                                for (pe = t = 1; pe <= t; pe++)
                                    Ki.save(),
                                    Ki.globalAlpha = .2,
                                    Ki.rotate(this.rPer * Math.PI * 2 * pe),
                                    Ki.beginPath(),
                                    Ki.arc(-.35 * this.rad, -.33 * this.rad, Math.max(0, i + e), 0, 2 * Math.PI),
                                    Ki.fill(),
                                    Ki.beginPath(),
                                    Ki.arc(.35 * this.rad, -.32 * this.rad, Math.max(0, i - e), 0, 2 * Math.PI),
                                    Ki.fill(),
                                    Ki.beginPath(),
                                    Ki.arc(.35 * this.rad, .36 * this.rad, Math.max(0, i + e), 0, 2 * Math.PI),
                                    Ki.fill(),
                                    Ki.beginPath(),
                                    Ki.arc(-.35 * this.rad, .35 * this.rad, Math.max(0, i - e), 0, 2 * Math.PI),
                                    Ki.fill(),
                                    Ki.restore();
                                Ki.restore()
                            }
                            Ki.restore();
                            break;
                        case ii:
                            Ki.save();
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 2.5 * Math.sin(2 * Math.PI / 4 * i);
                            if (e)
                                a = 4,
                                Ki.fillStyle = "#5e5348",
                                Ki.beginPath(),
                                Ki.arc(0, 0, this.rad, 0, 2 * Math.PI),
                                Ki.fill();
                            else {
                                Ki.fillStyle = "#706962";
                                Ki.beginPath();
                                Ki.arc(0, 0, Math.max(0, this.rad - a + i), 0, 2 * Math.PI);
                                Ki.fill();
                                Is || (Ki.beginPath(),
                                Ki.arc(.45 * this.rad, .45 * -this.rad + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(.5 * this.rad, .5 * this.rad + 15 * this.rPer, Math.max(0, .4 * this.rad + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(.55 * -this.rad * .707, .55 * +this.rad * .707 + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(.75 * -this.rad, .35 * -this.rad + 15 * this.rPer, Math.max(0, .3 * this.rad + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(this.rad - 20 * this.rPer, 50 * this.rPer, 10, 0, 2 * Math.PI),
                                Ki.fill());
                                Ki.save();
                                Ki.globalAlpha = 1 - this.underwaterA;
                                i = (Ur - this.spawnTime) / 1e3;
                                e = 8 * Math.sin(2 * Math.PI / 1.5 * i);
                                this.flag_underWater && (Ki.globalAlpha *= .5,
                                this.type == rt && (Ki.globalAlpha = .3));
                                Ki.fillStyle = "yellow";
                                i = .15 * this.rad;
                                Ki.beginPath();
                                for (pe = t = 1; pe <= t; pe++)
                                    Ki.save(),
                                    Ki.globalAlpha = .2,
                                    Ki.rotate(this.rPer * Math.PI * 2 * pe),
                                    Ki.beginPath(),
                                    Ki.arc(-.35 * this.rad, -.33 * this.rad, Math.max(0, i + e), 0, 2 * Math.PI),
                                    Ki.fill(),
                                    Ki.beginPath(),
                                    Ki.arc(.35 * this.rad, -.32 * this.rad, Math.max(0, i - e), 0, 2 * Math.PI),
                                    Ki.fill(),
                                    Ki.beginPath(),
                                    Ki.arc(.35 * this.rad, .36 * this.rad, Math.max(0, i + e), 0, 2 * Math.PI),
                                    Ki.fill(),
                                    Ki.beginPath(),
                                    Ki.arc(-.35 * this.rad, .35 * this.rad, Math.max(0, i - e), 0, 2 * Math.PI),
                                    Ki.fill(),
                                    Ki.restore();
                                Ki.restore()
                            }
                            Ki.restore();
                            break;
                        case ri:
                            if (i = f("img/cloudberry" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                Ki.save(),
                                e = this.rad,
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e),
                                Ki.restore();
                            break;
                        case Va:
                            if (i = f("img/arcticNut" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                Ki.save(),
                                e = this.rad,
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e),
                                Ki.restore();
                            break;
                        case Ja:
                            if (i = f("img/carrot" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.save(),
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e),
                                Ki.restore();
                            break;
                        case qa:
                            if (i = f("img/watermelon" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.save(),
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e),
                                Ki.restore();
                            break;
                        case ti:
                            Ki.save();
                            v(0, 0, this.rad, this.isEdibleOutlined() ? Ve : o(this.curBiome));
                            v(0, 0, Math.max(0, this.rad - 2), "#74e61e");
                            Ki.restore();
                            break;
                        case Ka:
                            if (i = f("img/watermelonSlice" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.save(),
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e),
                                Ki.restore();
                            break;
                        case Za:
                        case Qa:
                        case $a:
                            if (i = f("img/meat" + (this.isEdibleOutlined() ? "_e" : "") + ".png"))
                                e = this.rad,
                                Ki.save(),
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e),
                                Ki.restore();
                            break;
                        case Ma:
                        case Ta:
                            a = 2;
                            e = this.oType == Ta ? 15 : 9;
                            Ki.fillStyle = this.getOutlineColor();
                            Ki.beginPath();
                            Ki.rect(-e / 2 - a, -a, e + 2 * a, .8 * this.rad + 2 * a);
                            Ki.fill();
                            Ki.fillStyle = "#FFCA49";
                            Ki.beginPath();
                            Ki.rect(-e / 2, 0 + a / 2, e, .8 * this.rad - a / 2);
                            Ki.fill();
                            Is || (Ki.beginPath(),
                            Ki.arc(0, 0, Math.max(0, this.rad), Math.PI, 2 * Math.PI),
                            Ki.fillStyle = this.getOutlineColor(),
                            Ki.fill());
                            Ki.beginPath();
                            Ki.arc(0, 0, Math.max(0, this.rad - a), Math.PI, 2 * Math.PI);
                            Ki.fillStyle = this.oType == Ta ? "#B8413B" : "#CFAD59";
                            Ki.fill();
                            break;
                        case xa:
                            a = 2;
                            Ki.save();
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 1.5 * Math.sin(2 * Math.PI / 2 * i);
                            Ki.fillStyle = "#45D157";
                            Ki.globalAlpha *= .93;
                            Ki.beginPath();
                            Ki.arc(.5 * -this.rad, .5 * -this.rad + 10 * this.rPer, Math.max(0, .55 * this.rad + i), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.beginPath();
                            Ki.arc(.5 * this.rad, .5 * -this.rad - 10 * this.rPer, Math.max(0, .43 * this.rad - i), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.beginPath();
                            Ki.arc(.6 * this.rad, .4 * this.rad, Math.max(0, .48 * this.rad + i), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.beginPath();
                            Ki.arc(.5 * -this.rad, .5 * this.rad, Math.max(0, .4 * this.rad + this.rPer - i), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.restore();
                            e = 20;
                            Ki.fillStyle = s;
                            Ki.beginPath();
                            Ki.rect(-e / 2 - a, -a, e + 2 * a, .8 * this.rad + 2 * a);
                            Ki.fill();
                            Ki.fillStyle = "#FFCA49";
                            Ki.beginPath();
                            Ki.rect(-e / 2, 0 + a / 2, e, .8 * this.rad - a / 2);
                            Ki.fill();
                            Ki.beginPath();
                            Ki.arc(0, 0, Math.max(0, .8 * this.rad), Math.PI, 2 * Math.PI);
                            Ki.fillStyle = s;
                            Ki.fill();
                            Ki.beginPath();
                            Ki.arc(0, 0, Math.max(0, .8 * this.rad - a), Math.PI, 2 * Math.PI);
                            Ki.fillStyle = "#B8413B";
                            Ki.fill();
                            break;
                        case va:
                            (i = f("img/lillypad" + (this.isEdibleOutlined() ? "_e" : "") + ".png")) ? (e = this.rad,
                            Ki.rotate(this.rPer * Math.PI * 2),
                            Ki.drawImage(i, -e, -e, 2 * e, 2 * e)) : (Ki.fillStyle = s,
                            e = 6.28 * this.rPer,
                            Ki.beginPath(),
                            Ki.arc(0, 0, this.rad + 2, 0 + e, e + 2 * Math.PI - 1.57),
                            Ki.fill(),
                            Ki.fillStyle = "#3DAA4C",
                            Ki.beginPath(),
                            Ki.arc(0, 0, this.rad, 0 + e, e + 2 * Math.PI - 1.57),
                            Ki.fill());
                            break;
                        case na:
                            this.drawOutlinedCircle("", "#9F8641");
                            v(0 - this.rPer, 0 - this.rPer, Math.max(0, this.rad - 7), "#7E6A35");
                            v(0 + this.rPer, 1, Math.max(0, this.rad - 12), "#5C4E28");
                            break;
                        case ba:
                            switch (this.type) {
                            case ji:
                                break;
                            case bi:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .4 * t;
                                v(0, 0, this.rad, "#7EBCC0");
                                Ki.globalAlpha = 1 * t;
                                Ki.strokeStyle = "white";
                                Ki.beginPath();
                                e = 10;
                                Ki.translate(-5, -.7 * this.rad);
                                Ki.moveTo(0, -e);
                                Ki.lineTo(0, e);
                                Ki.moveTo(-e, -e);
                                Ki.lineTo(e, e);
                                Ki.moveTo(e, -e);
                                Ki.lineTo(-e, e);
                                Ki.moveTo(-e, 0);
                                Ki.lineTo(e, 0);
                                Ki.lineWidth = 3;
                                Ki.stroke();
                                Ki.restore();
                                break;
                            case wi:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .15 * t;
                                v(0, 0, this.rad, "#755A2A");
                                Ki.restore();
                                break;
                            case _i:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_sabertoothJawAttack.png")) {
                                    var n = Math.min(1, (Ur - this.spawnTime) / 200);
                                    e = this.rad - 2.5;
                                    Ki.rotate(this.rPer * Math.PI * 2);
                                    Ki.drawImage(i, 0, 0, i.width * n, i.height, -e, -e, 2 * e * n, 2 * e)
                                }
                                Ki.restore();
                                break;
                            case yi:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_claw.png"))
                                    n = Math.min(1, (Ur - this.spawnTime) / 200),
                                    e = this.rad - 2.5,
                                    Ki.rotate(this.rPer * Math.PI * 2),
                                    Ki.drawImage(i, 0, 0, i.width * n, i.height, -e, -e, 2 * e * n, 2 * e);
                                Ki.restore();
                                break;
                            case xi:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .1 * t;
                                v(0, 0, this.rad, "#5B7EC7");
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_whaleTailHit.png")) {
                                    n = Math.min(1, (Ur - this.spawnTime) / 200);
                                    e = .85 * this.rad;
                                    Ki.rotate(this.angle);
                                    var t = this.rad, s = 2 * e, r = 2 * e * n, h;
                                    Ki.drawImage(i, 0 + -.5 * s, t + -.95 * r, s, r)
                                }
                                Ki.restore();
                                break;
                            case Hi:
                                i = (Ur - this.spawnTime) / 1e3;
                                r = ne(i, 1, .1, 1);
                                Ki.save();
                                Ki.globalAlpha = .1 - r;
                                Ki.restore();
                                Ki.save();
                                i = (Ur - this.spawnTime) / 1e3;
                                i = 1.5 * Math.sin(2 * Math.PI / 2 * i);
                                Ki.fillStyle = "white";
                                t = .7 * this.rad;
                                Ki.globalAlpha = .3 - r;
                                e = .5 * -t + 10 * this.rPer;
                                s = Math.max(0, .65 * t + i) + 2;
                                v(.6 * -t, e, s, "#654321");
                                e = .5 * -t - 10 * this.rPer;
                                s = Math.max(0, .73 * t - i);
                                v(.5 * t, e, s, "#654321");
                                s = Math.max(0, .78 * t + i);
                                v(.6 * t, .5 * t, s, "#654321");
                                e = .5 * t + 10 * this.rPer;
                                s = Math.max(0, .6 * t + this.rPer - i);
                                v(.5 * -t, e, s, "#654321");
                                Ki.restore();
                                break;
                            case Fi:
                                break;
                            case Gi:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .05 * t;
                                v(0, 0, this.rad, "#B32E10");
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_crabSmash" + this.specType + ".png"))
                                    e = Math.min(1, Math.max(0, (Ur - this.spawnTime) / 200)),
                                    t = 1 == this.specType ? -1 : 1,
                                    m(-90 * t),
                                    t = t * (.3 + e) + m(-30 * t),
                                    e = .6 * this.rad,
                                    Ki.rotate(this.angle + t),
                                    t = this.rad,
                                    s = 1.4 * e,
                                    r = 2 * e,
                                    n = .75,
                                    h = .95,
                                    1 == this.specType && (n = .25,
                                    h = .95),
                                    Ki.drawImage(i, 0 + s * -n, t + r * -h, s, r);
                                Ki.restore();
                                break;
                            case Ti:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .05 * t;
                                v(0, 0, this.rad, "#E4E7C8");
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_elephantTrunkSmack.png"))
                                    e = Math.min(1, Math.max(0, (Ur - this.spawnTime) / 300)),
                                    t = -(-.5 + e) * m(90),
                                    e = .6 * this.rad,
                                    Ki.rotate(this.angle + t),
                                    t = this.rad,
                                    s = 1.4 * e,
                                    r = 2 * e,
                                    Ki.drawImage(i, 0 + -.75 * s, t + -.95 * r, s, r);
                                Ki.restore();
                                break;
                            case Ai:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .1 * t;
                                v(0, 0, this.rad, "#755A2A");
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_backkick.png"))
                                    n = Math.min(1, (Ur - this.spawnTime) / 200),
                                    e = .6 * this.rad,
                                    Ki.rotate(this.angle),
                                    t = this.rad,
                                    s = 2 * e,
                                    r = 2 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -.95 * r, s, r);
                                Ki.restore();
                                break;
                            case Ii:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .25 * t;
                                v(0, 0, this.rad, "#44d31f");
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_crocBite.png"))
                                    n = Math.min(1, (Ur - this.spawnTime) / 200),
                                    e = .6 * this.rad,
                                    Ki.rotate(this.angle),
                                    t = this.rad,
                                    s = 2.5 * e,
                                    r = 2.5 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -.95 * r, s, r),
                                    Ki.rotate(Math.PI),
                                    t = .5 * this.rad,
                                    s = 2.5 * e,
                                    r = 2.5 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -.95 * r, s, r);
                                Ki.restore();
                                break;
                            case Ei:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .25 * t;
                                v(0, 0, this.rad, "#44d31f");
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_boaBite.png"))
                                    n = Math.min(1, (Ur - this.spawnTime) / 200),
                                    e = .6 * this.rad,
                                    Ki.rotate(this.angle),
                                    t = this.rad,
                                    s = 2.5 * e,
                                    r = 2.5 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -.95 * r, s, r),
                                    Ki.rotate(Math.PI),
                                    t = .5 * this.rad,
                                    s = 2.5 * e,
                                    r = 2.5 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -.95 * r, s, r);
                                Ki.restore();
                                break;
                            case Ci:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .1 * t;
                                v(0, 0, this.rad, "#755A2A");
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_tigerJump.png"))
                                    n = Math.min(1, (Ur - this.spawnTime) / 100),
                                    e = 1.1 * this.rad,
                                    Ki.rotate(this.angle),
                                    t = this.rad,
                                    s = 2 * e,
                                    r = 2 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -1 * r, s, r);
                                Ki.restore();
                                break;
                            case Ni:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .05 * t;
                                v(0, 0, this.rad, "#44d31f");
                                Ki.globalAlpha = 1 * t;
                                i = f("img/ability_pounce2.png");
                                h = f("img/ability_pounce1.png");
                                i && h && (n = Math.min(1, (Ur - this.spawnTime) / 200),
                                e = .4 * this.rad,
                                Ki.rotate(this.angle),
                                t = this.rad,
                                s = 2.5 * e,
                                r = 2.5 * e * n,
                                Ki.drawImage(i, 0 + -.5 * s, t + -.95 * r, s, r),
                                e = .6 * this.rad,
                                t = .5 * this.rad,
                                s = 2.5 * e,
                                r = 2.5 * e * n,
                                Ki.drawImage(h, 0 + -.5 * s, t + -.95 * r, s, r));
                                Ki.restore();
                                break;
                            case Bi:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .05 * t;
                                v(0, 0, this.rad, "#E4E7C8");
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_tigerSlash" + this.specType + ".png"))
                                    e = Math.min(1, Math.max(0, (Ur - this.spawnTime) / 300)),
                                    t = (1 == this.specType ? 1 : -1) * (-.6 + e) * m(90),
                                    e = 1.2 * this.rad,
                                    Ki.rotate(this.angle + t),
                                    t = this.rad,
                                    s = 1.4 * e,
                                    r = 2 * e,
                                    Ki.drawImage(i, 0 + -.2 * s, t + -.5 * r, s, r);
                                Ki.restore();
                                break;
                            case Ri:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .1 * t;
                                v(0, 0, this.rad, "#755A2A");
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_zebraKick.png"))
                                    n = Math.min(1, (Ur - this.spawnTime) / 200),
                                    e = .6 * this.rad,
                                    Ki.rotate(this.angle),
                                    t = this.rad,
                                    s = 2 * e,
                                    r = 3 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -1 * r, s, r);
                                Ki.restore();
                                break;
                            case Oi:
                                t = Ki.globalAlpha;
                                Ki.save();
                                i = (Ur - this.spawnTime) / 1e3;
                                e = 1 * Math.sin(2 * Math.PI / 1.5 * i);
                                i = Ki.globalAlpha;
                                Ki.globalAlpha = .6 * Ki.globalAlpha * e;
                                Ki.rotate(this.angle);
                                Ki.globalAlpha = .15 * t;
                                v(.3 * this.rad, 0, this.rad * (.9 + .12 * e), "#E4E7C8");
                                v(.3 * -this.rad, 0, this.rad * (1.05 + .09 * e), "#E4E7C8");
                                Ki.globalAlpha = i;
                                Ki.restore();
                                Ki.save();
                                if (i = f("img/ability_giraffeStompLeg.png"))
                                    n = Math.min(1, (Ur - this.spawnTime) / 200),
                                    Ki.rotate(this.angle),
                                    e = 1 * -this.rad,
                                    t = this.rad,
                                    s = 2 * e,
                                    r = 2 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -.8 * r + e, s, r);
                                Ki.restore();
                                break;
                            case Wi:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .15 * t;
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_sharkBite.png"))
                                    n = Math.min(1, (Ur - this.spawnTime) / 200),
                                    e = .6 * this.rad,
                                    Ki.rotate(this.angle),
                                    t = this.rad,
                                    s = 2.5 * e,
                                    r = 2.5 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -.95 * r, s, r),
                                    Ki.rotate(Math.PI),
                                    t = .5 * this.rad,
                                    s = 2.5 * e,
                                    r = 2.5 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -1.35 * r, s, r);
                                if (i = f("img/shark-head.png"))
                                    r = Math.min(1, (Ur - this.spawnTime) / 200),
                                    Ki.globalAlpha = .9,
                                    e = 1.75 * -this.rad,
                                    Ki.rotate(m(180)),
                                    t = this.rad,
                                    s = 2 * e,
                                    r *= 2 * e,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -.5 * r + e, s, r);
                                Ki.restore();
                                break;
                            case Ui:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .15 * t;
                                Ki.globalAlpha = 1 * t;
                                if (i = f("img/ability_trexBite.png"))
                                    n = Math.min(1, (Ur - this.spawnTime) / 200),
                                    e = .6 * this.rad,
                                    Ki.rotate(this.angle),
                                    t = this.rad,
                                    s = 2.5 * e,
                                    r = 2.5 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -.95 * r, s, r),
                                    Ki.rotate(Math.PI),
                                    t = .5 * this.rad,
                                    s = 2.5 * e,
                                    r = 2.5 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -.95 * r, s, r);
                                if (i = f("img/trex-head.png"))
                                    n = Math.min(1, (Ur - this.spawnTime) / 200),
                                    e = 1.5 * -this.rad,
                                    Ki.rotate(m(180)),
                                    t = this.rad,
                                    s = 2 * e,
                                    r = 2 * e * n,
                                    Ki.drawImage(i, 0 + -.5 * s, t + -.5 * r + e, s, r);
                                Ki.restore();
                                break;
                            case ui:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .15 * t;
                                v(0, 0, this.rad, "#6D7471");
                                Ki.restore();
                                break;
                            case Di:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .15 * t;
                                v(0, 0, this.rad, "#6D7471");
                                Ki.restore();
                                break;
                            case Si:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .15 * t;
                                v(0, 0, this.rad, "#f2f2f2");
                                Ki.restore();
                                break;
                            case vi:
                                Ki.save();
                                Ki.rotate(this.angle + m(180));
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .8 * t;
                                if (i = f("img/wave.png"))
                                    e = this.rad,
                                    Ki.drawImage(i, -e, -e, 2 * e, 2 * e);
                                Ki.restore();
                                break;
                            case Pi:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .2 * t;
                                v(0, 0, this.rad, "#746B3E");
                                Ki.restore();
                                break;
                            case fi:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .5 * t;
                                v(0, 0, this.rad, "#62C5FF");
                                Ki.globalAlpha = 1 * t;
                                Ki.strokeStyle = "#62C5FF";
                                Ki.beginPath();
                                e = -.7 * this.rad;
                                Ki.moveTo(e, -5);
                                Ki.lineTo(e - 4, 5);
                                Ki.lineTo(e + 4, 2);
                                Ki.lineTo(e + 2, 15);
                                Ki.lineWidth = 3;
                                Ki.stroke();
                                Ki.restore();
                                break;
                            case mi:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .5 * t;
                                e = Math.max(0, this.rad - 30);
                                i = (Ur - this.spawnTime) / 1e3;
                                s = 2.2;
                                r = 6.5 * Math.cos(2 * Math.PI / s * i);
                                i = 6.5 * Math.sin(2 * Math.PI / s * i);
                                Ki.globalAlpha = .4 * t;
                                v(0, 0, e, "#2CAAC4");
                                Ki.globalAlpha = .7 * t;
                                Is || v(0 + r / 2 - this.rPer, 0 + i / 2 - this.rPer, Math.max(0, e - 6), "#2D93B0");
                                v(0 + r / 4.5 + this.rPer, 1 + i / 1.5, Math.max(0, e - 14), "#29A0BA");
                                v(0 + r / 1.5 - 2 * this.rPer, i, Math.max(0, e - 38.5 + i / 5), "#2B8CAA");
                                v(0 + r / 1.5 - 2 * this.rPer, i, Math.max(0, e - 54.5 + i / 11), "#28829E");
                                Ki.restore();
                                break;
                            case pi:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Is || Ki.rotate(2 * this.rPer * Math.PI);
                                i = (Ur - this.spawnTime) / 1e3;
                                i = 1.5 * Math.sin(2 * Math.PI / 6 * i);
                                Ki.globalAlpha = .7 * t;
                                a = 4;
                                Ki.fillStyle = "black";
                                Ki.beginPath();
                                Ki.arc(0, 0, this.rad, 0, 2 * Math.PI);
                                Ki.fill();
                                Is || (Ki.fillStyle = "black",
                                Ki.globalAlpha = .5 * t,
                                Ki.beginPath(),
                                Ki.arc(0, 0, Math.max(0, this.rad - a + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(.45 * this.rad, .45 * -this.rad + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(.5 * this.rad, .5 * this.rad + 15 * this.rPer, Math.max(0, .4 * this.rad + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(.55 * -this.rad * .707, .55 * +this.rad * .707 + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.arc(.75 * -this.rad, .35 * -this.rad + 15 * this.rPer, Math.max(0, .3 * this.rad + i), 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.beginPath(),
                                Ki.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath(),
                                Ki.beginPath(),
                                Ki.arc(this.rad - 20 * this.rPer, 50 * this.rPer, 10, 0, 2 * Math.PI),
                                Ki.fill(),
                                Ki.beginPath());
                                Ki.restore();
                                break;
                            case ki:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .25 * t;
                                v(0, 0, this.rad, "#9F8641");
                                Ki.restore();
                                break;
                            case Mi:
                                Ki.save();
                                t = Ki.globalAlpha;
                                Ki.globalAlpha = .25 * t;
                                v(0, 0, this.rad, "#785228");
                                Ki.restore();
                                break;
                            default:
                                Ki.save(),
                                t = Ki.globalAlpha,
                                Ki.globalAlpha = .15 * t,
                                v(0, 0, this.rad, "black"),
                                Ki.restore()
                            }
                            break;
                        case ma:
                            i = (Ur - this.spawnTime) / 1e3;
                            s = 1.2;
                            r = 2.5 * Math.cos(2 * Math.PI / s * i);
                            i = 2.5 * Math.sin(2 * Math.PI / s * i);
                            this.drawOutlinedCircle("", "#2CAAC4");
                            Is || v(0 + r / 2 - this.rPer, 0 + i / 2 - this.rPer, Math.max(0, this.rad - 6), "#2D93B0");
                            v(0 + r / 4.5 + this.rPer, 1 + i / 1.5, Math.max(0, this.rad - 14), "#29A0BA");
                            v(0 + r / 1.5 - 2 * this.rPer, i, Math.max(0, this.rad - 18.5 + i / 5), "#2B8CAA");
                            v(0 + r / 1.5 - 2 * this.rPer, i, Math.max(0, this.rad - 24.5 + i / 11), "#28829E");
                            break;
                        case da:
                            this.drawOutlinedCircle("", "#9F8641");
                            Is || v(0 - this.rPer, 0 - this.rPer, Math.max(0, this.rad - 7), "#7E6A35");
                            v(0 + this.rPer, 1, Math.max(0, this.rad - 14), "#5C4E28");
                            v(0 - 2 * this.rPer - 3, 1, Math.max(0, this.rad - 18.5), "#40371D");
                            break;
                        case ha:
                            Ki.save();
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 1.5 * Math.sin(2 * Math.PI / 2 * i);
                            switch (this.curBiome) {
                            case Xi:
                                e = "#786810";
                                break;
                            case Yi:
                                e = "#CED0D0";
                                break;
                            default:
                            case Li:
                                e = "#45D157"
                            }
                            Ki.fillStyle = e;
                            Ki.globalAlpha *= .93;
                            Ki.beginPath();
                            Ki.arc(.5 * -this.rad, .5 * -this.rad + 10 * this.rPer, Math.max(0, .65 * this.rad + i), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.beginPath();
                            Ki.arc(.5 * this.rad, .5 * -this.rad - 10 * this.rPer, Math.max(0, .73 * this.rad - i), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.beginPath();
                            Ki.arc(.6 * this.rad, .4 * this.rad, Math.max(0, .78 * this.rad + i), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.beginPath();
                            Ki.arc(.5 * -this.rad, .5 * this.rad, Math.max(0, .6 * this.rad + this.rPer - i), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.restore();
                            break;
                        case Ya:
                            Ki.save();
                            Is || Ki.rotate(2 * this.rPer * Math.PI);
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 1.5 * Math.sin(2 * Math.PI / 6 * i);
                            a = 4;
                            Ki.fillStyle = "#604729";
                            Ki.beginPath();
                            Ki.arc(0, 0, this.rad, 0, 2 * Math.PI);
                            Ki.fill();
                            Is || (Ki.fillStyle = "#8A681B",
                            Ki.beginPath(),
                            Ki.arc(0, 0, Math.max(0, this.rad - a + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.45 * this.rad, .45 * -this.rad + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.5 * this.rad, .5 * this.rad + 15 * this.rPer, Math.max(0, .4 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.55 * -this.rad * .707, .55 * +this.rad * .707 + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.75 * -this.rad, .35 * -this.rad + 15 * this.rPer, Math.max(0, .3 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.beginPath(),
                            Ki.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.beginPath(),
                            Ki.arc(this.rad - 20 * this.rPer, 50 * this.rPer, 10, 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath());
                            Ki.restore();
                            break;
                        case ei:
                            Ki.save();
                            Is || Ki.rotate(2 * this.rPer * Math.PI);
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 1.5 * Math.sin(2 * Math.PI / 6 * i);
                            a = 4;
                            Ki.fillStyle = "#605649";
                            Ki.beginPath();
                            Ki.arc(0, 0, this.rad, 0, 2 * Math.PI);
                            Ki.fill();
                            Is || (Ki.fillStyle = "#5e4f36",
                            Ki.beginPath(),
                            Ki.arc(0, 0, Math.max(0, this.rad - a + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.45 * this.rad, .45 * -this.rad + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.5 * this.rad, .5 * this.rad + 15 * this.rPer, Math.max(0, .4 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.55 * -this.rad * .707, .55 * +this.rad * .707 + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.75 * -this.rad, .35 * -this.rad + 15 * this.rPer, Math.max(0, .3 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.beginPath(),
                            Ki.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.beginPath(),
                            Ki.arc(this.rad - 20 * this.rPer, 50 * this.rPer, 10, 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath());
                            Ki.restore();
                            break;
                        case la:
                            Ki.save();
                            Is || Ki.rotate(2 * this.rPer * Math.PI);
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 1.5 * Math.sin(2 * Math.PI / 6 * i);
                            a = 4;
                            Ki.fillStyle = "#8B7833";
                            Ki.beginPath();
                            Ki.arc(0, 0, this.rad, 0, 2 * Math.PI);
                            Ki.fill();
                            Is || (Ki.fillStyle = "#98803A",
                            Ki.beginPath(),
                            Ki.arc(0, 0, Math.max(0, this.rad - a + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.45 * this.rad, .45 * -this.rad + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.5 * this.rad, .5 * this.rad + 15 * this.rPer, Math.max(0, .4 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.55 * -this.rad * .707, .55 * +this.rad * .707 + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.75 * -this.rad, .35 * -this.rad + 15 * this.rPer, Math.max(0, .3 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.beginPath(),
                            Ki.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.beginPath(),
                            Ki.arc(this.rad - 20 * this.rPer, 50 * this.rPer, 10, 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath());
                            Ki.restore();
                            break;
                        case wa:
                            Ki.save();
                            Is || Ki.rotate(2 * this.rPer * Math.PI);
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 1.5 * Math.sin(2 * Math.PI / 6 * i);
                            a = 4;
                            Ki.fillStyle = "#8CC3C7";
                            Ki.beginPath();
                            Ki.arc(0, 0, this.rad, 0, 2 * Math.PI);
                            Ki.fill();
                            Is || (Ki.fillStyle = "#9DDADE",
                            Ki.beginPath(),
                            Ki.arc(0, 0, Math.max(0, this.rad - a + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.45 * this.rad, .45 * -this.rad + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.5 * this.rad, .5 * this.rad + 15 * this.rPer, Math.max(0, .4 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.55 * -this.rad * .707, .55 * +this.rad * .707 + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.75 * -this.rad, .35 * -this.rad + 15 * this.rPer, Math.max(0, .3 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.beginPath(),
                            Ki.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.beginPath(),
                            Ki.arc(this.rad - 20 * this.rPer, 50 * this.rPer, 10, 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath());
                            Ki.restore();
                            break;
                        case ca:
                            Ki.save();
                            Is || Ki.rotate(2 * this.rPer * Math.PI);
                            i = (Ur - this.spawnTime) / 1e3;
                            i = 5.5 * Math.sin(2 * Math.PI / 4 * i);
                            a = 4;
                            Ki.fillStyle = je;
                            Ki.beginPath();
                            Ki.arc(0, 0, this.rad, 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.fillStyle = this.curBiome == Yi ? "#8da0d6" : Fe;
                            Ki.beginPath();
                            Ki.arc(0, 0, Math.max(0, this.rad - a + i), 0, 2 * Math.PI);
                            Ki.fill();
                            Is || (Ki.beginPath(),
                            Ki.arc(.45 * this.rad, .45 * -this.rad + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.5 * this.rad, .5 * this.rad + 15 * this.rPer, Math.max(0, .4 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.55 * -this.rad * .707, .55 * +this.rad * .707 + 15 * this.rPer, Math.max(0, .5 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.75 * -this.rad, .35 * -this.rad + 15 * this.rPer, Math.max(0, .3 * this.rad + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(this.rad - 20 * this.rPer, 50 * this.rPer, 10, 0, 2 * Math.PI),
                            Ki.fill());
                            Ki.restore();
                            break;
                        case Oa:
                            Ki.save();
                            Is || Ki.rotate(2 * this.rPer * Math.PI);
                            i = (Ur - Ir) / 1e3;
                            i = 5.5 * Math.sin(2 * Math.PI / 5 * i);
                            e || (Ki.fillStyle = He,
                            Ki.beginPath(),
                            Ki.arc(0, 0, Math.max(0, this.rad - a + i), 0, 2 * Math.PI),
                            Ki.fill(),
                            Is || (Ki.beginPath(),
                            Ki.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(this.rad - 20 * this.rPer, 50 * this.rPer, 10, 0, 2 * Math.PI),
                            Ki.fill()));
                            Ki.restore();
                            break;
                        case pa:
                            i = (Ur - Ir) / 1e3;
                            e = -8.5 * Math.sin(2 * Math.PI / 5 * i);
                            1 == (this.x > bs / 2 ? 1 : 0) ? (Ki.fillStyle = He,
                            Ki.fillRect(-this.rectW / 2 + e, -this.rectH / 2 + e + 10, this.rectW - e, this.rectH - e - 10),
                            Ki.beginPath(),
                            Ki.arc(-this.rectW / 2 + 50, -this.rectH / 2 + 50, 70 - e, 0, 2 * Math.PI),
                            Ki.fill(),
                            e = 35) : (Ki.fillStyle = He,
                            e *= -1,
                            Ki.fillRect(-this.rectW / 2, -this.rectH / 2 - e + 10, this.rectW + e, this.rectH + e - 10),
                            e = 25);
                            F(-this.rectW / 2 + e, -this.rectH / 2 + e, this.rectW / 2 - e, this.rectH / 2 - e, this.x, this.y);
                            break;
                        case Na:
                            Ki.fillStyle = je;
                            t = -this.rectW / 2;
                            s = this.rectW / 2;
                            r = -this.rectH / 2;
                            n = this.rectH / 2;
                            Ki.beginPath();
                            Ki.moveTo(t, r);
                            h = 20;
                            var l = [-15, 10, -10, 12, 0, 5, -10, 5, -12, 5, 10, 0, -6]
                              , d = 45
                              , c = 0
                              , g = bs - this.x
                              , p = 0 - this.x
                              , b = us - this.y
                              , u = 0 - this.y;
                            i = t - h;
                            for (e = r; e < n; e += d)
                                Ki.lineTo(Math.min(g, Math.max(p, i + l[c])), e),
                                c = (c + 1) % l.length;
                            Ki.lineTo(t, n);
                            e = n + h;
                            for (i = t; i < s; i += d)
                                Ki.lineTo(i, Math.min(b, Math.max(u, e + l[c]))),
                                c = (c + 1) % l.length;
                            Ki.lineTo(s, n);
                            i = s + h;
                            for (e = n; e > r; e -= d)
                                Ki.lineTo(Math.min(g, Math.max(p, i + l[c])), e),
                                c = (c + 1) % l.length;
                            Ki.lineTo(s, r);
                            e = r - h;
                            for (i = s; i > t; i -= d)
                                Ki.lineTo(i, Math.min(b, Math.max(u, e + l[c]))),
                                c = (c + 1) % l.length;
                            Ki.closePath();
                            Ki.fill();
                            break;
                        case ya:
                            Ki.fillStyle = "#ececec";
                            Ki.fillRect(-this.rectW / 2, -this.rectH / 2, this.rectW, this.rectH);
                            t = -this.rectW / 2;
                            s = this.rectW / 2;
                            r = this.rectH / 2 - 20;
                            n = this.rectH / 2;
                            snowLandWidth = this.rectW;
                            snowLandHeight = this.rectH;
                            Ki.beginPath();
                            Ki.moveTo(t, r);
                            h = 20;
                            l = [-15, 5, 10, 0, -10, 3, 12, 4, 0, 3, 5, -10, 5, -12, 5, 10, 0, -6];
                            d = 60;
                            c = 0;
                            b = us - this.y;
                            u = 0 - this.y;
                            Ki.lineTo(t, n);
                            e = n + h;
                            for (i = t; i < s; i += d)
                                Ki.lineTo(i, Math.min(b, Math.max(u, e + l[c]))),
                                c = (c + 1) % l.length;
                            Ki.lineTo(s, n);
                            Ki.lineTo(s, r);
                            Ki.closePath();
                            Ki.fill();
                            e = 20;
                            F(-this.rectW / 2 + e, -this.rectH / 2 + e, this.rectW / 2 - e, this.rectH / 2 - e, this.x, this.y);
                            break;
                        case Ga:
                            Ki.fillStyle = Fe;
                            Ki.fillRect(-this.rectW / 2, -this.rectH / 2, this.rectW, this.rectH);
                            Ki.fillStyle = Fe;
                            t = -this.rectW / 2;
                            s = this.rectW / 2;
                            r = -this.rectH / 2 + 3;
                            n = -this.rectH / 2 - 15;
                            Ki.beginPath();
                            Ki.moveTo(t, r);
                            h = 0;
                            l = [-15, 5, 10, 0, -10, 3, 12, 4, 0, 3, 5, -10, 5, -12, 5, 10, 0, -6];
                            d = 60;
                            c = 0;
                            b = us - this.y;
                            u = 0 - this.y;
                            Ki.lineTo(t, n);
                            e = n + h;
                            for (i = t; i < s; i += d)
                                Ki.lineTo(i, Math.min(b, Math.max(u, e + l[c]))),
                                c = (c + 1) % l.length;
                            Ki.lineTo(s, n);
                            Ki.lineTo(s, r);
                            Ki.closePath();
                            Ki.fill();
                            Ki.fillStyle = Fe;
                            t = -this.rectW / 2;
                            s = this.rectW / 2;
                            r = this.rectH / 2 - 3;
                            n = this.rectH / 2 + 15;
                            Ki.beginPath();
                            Ki.moveTo(t, r);
                            h = 0;
                            l = [-15, 5, 10, 0, -10, 3, 12, 4, 0, 3, 5, -10, 5, -12, 5, 10, 0, -6];
                            d = 60;
                            c = 0;
                            b = us - this.y;
                            u = 0 - this.y;
                            Ki.lineTo(t, n);
                            e = n + h;
                            for (i = t; i < s; i += d)
                                Ki.lineTo(i, Math.min(b, Math.max(u, e + l[c]))),
                                c = (c + 1) % l.length;
                            Ki.lineTo(s, n);
                            Ki.lineTo(s, r);
                            Ki.closePath();
                            Ki.fill();
                            if (i = f("img/riverCurrent" + this.riverSpecT + ".png"))
                                for (e = -this.rectW / 2,
                                pe = 0; 40 > pe; pe++)
                                    t = 100 / 120 * this.riverFlowSpeedX * 1e3,
                                    n = (Ur - this.spawnTime) % t / t,
                                    Ki.drawImage(i, e + 100 * n, -this.rectH / 2, 100, this.rectH),
                                    e += 100;
                            break;
                        case aa:
                            Ki.fillStyle = Ue;
                            Ki.fillRect(-this.rectW / 2, -this.rectH / 2, this.rectW, this.rectH);
                            e = 20;
                            F(-this.rectW / 2 + e, -this.rectH / 2 + e, this.rectW / 2 - e, this.rectH / 2 - e, this.x, this.y);
                            break;
                        case oa:
                            e ? v(0, 0, this.rad, this.getOutlineColor()) : v(0, 0, this.rad - 1.5, Je);
                            break;
                        case fa:
                            Ki.fillStyle = je;
                            Ki.beginPath();
                            Ki.arc(0, 0, Math.max(0, this.rad), 0, 2 * Math.PI);
                            Ki.fill();
                            Ki.fillStyle = "#E4D04C";
                            Ki.beginPath();
                            Ki.arc(-5 + 10 * this.rPer, -5 + 10 * this.rPer, .8 * this.rad, 0, 2 * Math.PI);
                            Ki.fill();
                            break;
                        case ka:
                            if (0 == this.specType)
                                e = this.curBiome == Yi ? "#8fa4e0" : Re,
                                this.drawOutlinedCircle("", e);
                            else if (i = f("img/santa/gifts/" + this.specType + ".png"))
                                Ki.save(),
                                e = this.rad,
                                Ki.rotate(this.angle),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e),
                                Ki.restore();
                            break;
                        case Aa:
                            (i = f("img/snowball.png")) ? (e = this.rad,
                            Ki.rotate(this.rPer * Math.PI * 2),
                            Ki.drawImage(i, -e, -e, 2 * e, 2 * e)) : this.drawOutlinedCircle("", "white");
                            break;
                        case ai:
                            Ki.save();
                            Ki.globalAlpha = this.specType / 100 * Ki.globalAlpha * .9;
                            if (i = f("img/spiderWeb.png"))
                                e = this.rad,
                                Ki.rotate(this.rPer * Math.PI * 2),
                                Ki.drawImage(i, -e, -e, 2 * e, 2 * e);
                            Ki.restore();
                            break;
                        case si:
                            Ki.save();
                            v(0, 0, this.rad, this.isEdibleOutlined() ? Ve : o(this.curBiome));
                            v(0, 0, Math.max(0, this.rad - 2), Re);
                            Ki.restore();
                            Ki.save();
                            e = .3;
                            i = .5 * (.7 - e);
                            Ki.globalAlpha *= e + i + i * Math.sin(2 * Math.PI / 1.2 * ((Ur - this.spawnTime) / 1e3));
                            Ki.globalAlpha *= this.effA_poison;
                            v(0, 0, this.rad + 2.6, "#7FF600");
                            Ki.restore();
                            break;
                        case Pa:
                            e = .15;
                            i = .5 * (.8 - e);
                            e = e + i + i * Math.sin(2 * Math.PI / 1 * (Ur / 1e3));
                            Ki.save();
                            Ki.globalAlpha *= e;
                            v(0, 0, Math.max(0, this.rad), "#F6EA65");
                            Ki.restore();
                            e = .85;
                            i = .5 * (1 - e);
                            e = e + i + i * Math.sin(2 * Math.PI / 1 * (Ur / 1e3));
                            if (i = f(1 == Math.trunc(Ur / 300) % 2 ? "img/fire.png" : "img/fire2.png"))
                                t = .3 * this.rad,
                                s = 2 * this.rad * (2 + 2 * e) / 3,
                                r = 2 * this.rad * e,
                                n = .5,
                                h = .95,
                                Ki.save(),
                                i && (Ki.globalAlpha = Ki.globalAlpha * this.onFireEffA * e,
                                Ki.drawImage(i, 0 + s * -n, t + r * -h, s, r)),
                                Ki.restore();
                            break;
                        case ia:
                            this.drawAnimal(t);
                            break;
                        default:
                            console.log("Unhandled obj " + this),
                            console.log("rect? " + this.isRectangle + " pos " + this.x + "," + this.y),
                            this.isRectangle ? (Ki.fillStyle = "black",
                            Ki.fillRect(-this.rectW / 2, -this.rectH / 2, this.rectW, this.rectH)) : this.drawOutlinedCircle("????", "black")
                        }
                        this.flag_hurt && (Ki.fillStyle = "rgba(255,0,0,0.3)",
                        Ki.beginPath(),
                        Ki.arc(0, 0, Math.max(0, this.rad - a), 0, 2 * Math.PI),
                        Ki.fill());
                        this.hpBarA += .04 * ((Ur < this.hpBarTimeoutT ? 1 : 0) - this.hpBarA);
                        .001 < this.hpBarA && (this.hpPer += .1 * (this.hpPer_n - this.hpPer),
                        i = Math.max(1, this.rad / 25),
                        a = 20 * i,
                        e = 5 * i,
                        i = -this.rad - 10 * i,
                        Ki.globalAlpha *= this.hpBarA,
                        Ki.fillStyle = "rgba(0,0,0,0.35)",
                        Ki.fillRect(0 - a / 2, i - e / 2, a, e),
                        Ki.fillStyle = "#16D729",
                        Ki.fillRect(0 - a / 2, i - e / 2, this.hpPer / 100 * a, e));
                        Ki.restore()
                    }
                    ;
                    this.drawChat = function() {
                        if (!(1 > this.chatLines.length)) {
                            Ki.save();
                            Ki.font = "10px Arial";
                            Ki.lineWidth = 1;
                            Ki.textAlign = "center";
                            Ki.textBaseline = "middle";
                            for (var e = .01 < this.hpBarA ? -10 : 0, t = [], a = this.chatLines.length - 1; 0 <= a; a--) {
                                var i = this.chatLines[a]
                                  , s = -13 * (this.chatLines.length - 1 - a) + e
                                  , r = Ur > i.chatFadeT ? 0 : 1;
                                i.chatA += .1 * (r - i.chatA);
                                Ki.shadowOffsetX = 0;
                                Ki.shadowOffsetY = 0;
                                .02 > i.chatA ? (.02 > r && (i.chatTxt = ""),
                                t.push(a)) : (r = Ki.measureText(i.chatTxt).width,
                                Ki.globalAlpha = .8 * i.chatA,
                                Ki.fillStyle = o(this.curBiome),
                                Ki.fillRect(this.x - 1 - r / 2, s + this.y - this.rad - 10 - 5 - 1, r + 2, 12),
                                Ki.fillStyle = "#F1C34C",
                                Is || (Ki.shadowOffsetX = 1,
                                Ki.shadowOffsetY = 1,
                                Ki.shadowColor = "black"),
                                Ki.globalAlpha = i.chatA,
                                Ki.fillText(i.chatTxt, this.x, s + this.y - this.rad - 10))
                            }
                            for (a = 0; a < t.length; a++)
                                this.chatLines.splice(t[a], 1);
                            Ki.restore()
                        }
                    }
                    ;
                    this.getOutlineColor = function() {
                        if (this.alwaysPlainOutline)
                            return Ce;
                        if (this.isEdibleOutlined())
                            return Ve;
                        if (this.oType == ia && 0 < hr[this.type - 1] && this.id != Ds)
                            return Ye;
                        var e = this.curBiome;
                        if (this.flag_inWater)
                            e = Xi;
                        else if (this.flag_inLava)
                            return We;
                        return o(e)
                    }
                    ;
                    this.isEdibleOutlined = function() {
                        return this.oType == ia ? 0 < lr[this.type - 1] && this.id != Ds : 0 < dr[this.oType - 1]
                    }
                    ;
                    this.gotChat = function(e) {
                        this.chatLines.push({
                            chatTxt: e,
                            chatFadeT: Ur + 4e3,
                            chatA: 0
                        });
                        5 < this.chatLines.length && this.chatLines.splice(this.chatLines.length - 1, 1)
                    }
                    ;
                    this.drawOutlinedCircle = function(e, t) {
                        var a = this.getOutlineColor();
                        Is && a == Ce || v(0, 0, this.rad, a);
                        v(0, 0, Math.max(0, this.rad - 1.5), t)
                    }
                    ;
                    this.drawAnimal = function(e) {
                        var t = W(this.type)
                          , a = t.aniCol
                          , i = t.skinName
                          , s = .1 * this.rad;
                        switch (this.type) {
                        case wt:
                        case _t:
                        case At:
                        case mt:
                        case rt:
                            s = .16 * this.rad
                        }
                        switch (this.type) {
                        case wt:
                        case _t:
                        case At:
                        case mt:
                        case ct:
                        case Ft:
                        case Lt:
                        case Xt:
                        case Kt:
                        case Zt:
                            this.flag_eff_aniInClaws ? i += "3" : this.flag_usingAbility && (i += "2");
                            break;
                        case Jt:
                            this.z *= 2,
                            this.flag_usingAbility && 4 == this.specType && (i += "2")
                        }
                        Ki.save();
                        0 != this.angle && Ki.rotate(this.angle);
                        var r = (Ur - this.spawnTime) / 1e3
                          , t = .7 * Math.sin(2 * Math.PI / 2.5 * r)
                          , n = this.flag_underWater || this.flag_usingAbility && (this.type == et || this.type == kt || this.type == Tt) ? 0 : 1;
                        this.flag_stealth && (n = this.type == bt ? 0 : .2);
                        this.flag_flying && this.id != Ds && this.type != Qt && !this.flag_isGrabbed && (n = .6);
                        this.underwaterA += .1 * (n - this.underwaterA);
                        Ki.globalAlpha *= this.underwaterA;
                        if (this.flag_eff_invincible) {
                            var h = .3
                              , l = .5 * (1 - h);
                            Ki.globalAlpha *= h + l + l * Math.sin(2 * Math.PI / 1 * ((Ur - this.spawnTime) / 1e3))
                        }
                        if (this.flag_eff_stunk) {
                            Ki.save();
                            var h = .3
                              , l = .5 * (1 - h)
                              , o = h + l + l * Math.sin(2 * Math.PI / 1 * ((Ur - this.spawnTime) / 1e3));
                            Ki.globalAlpha *= o;
                            v(0, 0, this.rad + 2.6 * o, "brown");
                            Ki.restore()
                        }
                        this.flag_eff_stunk && (Ki.save(),
                        h = .3,
                        l = .5 * (1 - h),
                        o = h + l + l * Math.sin(2 * Math.PI / 1 * ((Ur - this.spawnTime) / 1e3)),
                        Ki.globalAlpha *= o,
                        v(0, 0, this.rad + 2.6 * o, "brown"),
                        Ki.restore());
                        this.nameA += .1 * (n - this.nameA);
                        this.flag_iceSliding && (n = 1 * Math.sin(2 * Math.PI / .75 * r),
                        h = Ki.globalAlpha,
                        Ki.globalAlpha *= .8 - .2 * n,
                        v(0, .3 * this.rad, this.rad * (.9 + .15 * n), "#7BB7BB"),
                        v(0, .3 * -this.rad, this.rad * (1.05 + .1 * n), "#7BB7BB"),
                        Ki.globalAlpha = h);
                        !this.flag_usingAbility || this.type != $e && this.type != Ct || (n = 1 * Math.sin(2 * Math.PI / 1.5 * r),
                        h = Ki.globalAlpha,
                        Ki.globalAlpha *= .8,
                        v(0, .3 * this.rad, this.rad * (.9 + .12 * n), "#7F582B"),
                        v(0, .3 * -this.rad, this.rad * (1.05 + .09 * n), "#7F582B"),
                        Ki.globalAlpha = h);
                        n = this.flag_eff_frozen || this.flag_cold ? 1 : 0;
                        this.frozenEffA += .1 * (n - this.frozenEffA);
                        .01 < this.frozenEffA && (h = Ki.globalAlpha,
                        Ki.globalAlpha *= this.frozenEffA,
                        v(0, 0, this.rad + 1.6 * this.frozenEffA, "white"),
                        Ki.globalAlpha = h);
                        n = this.flag_eff_healing ? 1 : 0;
                        this.effA_healing += .1 * (n - this.effA_healing);
                        .01 < this.effA_healing && (Ki.save(),
                        Ki.globalAlpha *= this.effA_healing,
                        v(0, 0, this.rad + 2.6 * this.effA_healing, "purple"),
                        Ki.restore());
                        n = this.flag_eff_poison ? 1 : 0;
                        this.effA_poison += .1 * (n - this.effA_poison);
                        .01 < this.effA_poison && (Ki.save(),
                        h = .3,
                        l = .5 * (1 - h),
                        Ki.globalAlpha *= h + l + l * Math.sin(2 * Math.PI / 1.2 * ((Ur - this.spawnTime) / 1e3)),
                        Ki.globalAlpha *= this.effA_poison,
                        v(0, 0, this.rad + 2.6 * this.effA_poison, "#7FF600"),
                        Ki.restore());
                        n = this.flag_eff_bleeding ? 1 : 0;
                        this.effA_bleeding += .1 * (n - this.effA_bleeding);
                        .01 < this.effA_bleeding && (Ki.save(),
                        h = .3,
                        l = .5 * (1 - h),
                        Ki.globalAlpha *= h + l + l * Math.sin(2 * Math.PI / 1.2 * ((Ur - this.spawnTime) / 1e3)),
                        Ki.globalAlpha *= this.effA_bleeding,
                        v(0, 0, this.rad + 2.6 * this.effA_bleeding, "red"),
                        Ki.restore());
                        t = 2 + t;
                        n = this.getOutlineColor();
                        Is && n == Ce ? t = 0 : this.flag_flying || v(0, 0, this.rad, n);
                        o = null;
                        i && !Ps && (!this.flag_flying || this.flag_isGrabbed || this.type != Qt && this.type != Kt && this.type != Ht || (i = "flying_" + i),
                        this.type == Qt && (i += "_" + this.specType),
                        this.flag_isDevMode && this.type == Kt && (i = "santa/" + i),
                        o = f("./skins/" + i + ".png"));
                        o || (Ki.fillStyle = a,
                        Ki.beginPath(),
                        Ki.arc(0, 0, Math.max(0, this.rad - t), 0, 2 * Math.PI),
                        Ki.fill());
                        this.type != Ke && this.type != qe && this.type != ct && (r = (Ur - this.spawnTime) / 1e3,
                        i = 4 * Math.sin(2 * Math.PI / 5 * r),
                        h = 2.5 * t,
                        l = Math.PI / 180,
                        Ki.fillStyle = this.flag_tailBitten ? Ye : 0 < or[this.type - 1] && this.id != Ds ? Ve : n,
                        Is && Ki.fillStyle != Ce || this.flag_flying || (Ki.beginPath(),
                        Ki.moveTo((this.rad - t + 1) * Math.cos((282.5 + h) * l), (this.rad - t + 1) * Math.sin(282.5 * l)),
                        Ki.lineTo((this.rad - t + 1) * Math.cos((257.5 - h) * l), (this.rad - t + 1) * Math.sin(257.5 * l)),
                        Ki.lineTo((this.rad + s + t) * Math.cos((270 + i) * l), (this.rad + s + t) * Math.sin((270 + i) * l)),
                        Ki.lineTo((this.rad - t + 1) * Math.cos((282.5 + h) * l), (this.rad - t + 1) * Math.sin(282.5 * l)),
                        Ki.fill()),
                        Is || o && !this.flag_tailBitten || (Ki.fillStyle = this.flag_tailBitten ? Ye : a,
                        Ki.beginPath(),
                        Ki.moveTo((this.rad - t) * Math.cos(282.5 * l), (this.rad - t) * Math.sin(282.5 * l)),
                        Ki.lineTo((this.rad - t) * Math.cos(257.5 * l), (this.rad - t) * Math.sin(257.5 * l)),
                        Ki.lineTo((this.rad + s) * Math.cos((270 + i) * l), (this.rad + s) * Math.sin((270 + i) * l)),
                        Ki.lineTo((this.rad - t) * Math.cos(282.5 * l), (this.rad - t) * Math.sin(282.5 * l)),
                        Ki.fill()));
                        if (o) {
                            if ((this.type == Kt || this.type == Qt) && this.flag_flying && !this.flag_isGrabbed) {
                                Ki.save();
                                var d;
                                d = this.type == Kt ? (this.flag_isDevMode ? "santa/" : "") + "eagle" : "duck";
                                var r = (Ur - this.spawnTime) / 1e3
                                  , c = ne(r, .9, .3, 2);
                                if (s = f("img/" + d + "_wing1.png"))
                                    Ki.save(),
                                    i = -(-.2 + c) * m(90),
                                    n = .8 * this.rad,
                                    Ki.rotate(i),
                                    i = this.rad,
                                    h = 1.4 * n,
                                    l = 2 * n,
                                    Ki.drawImage(s, 0 + .2 * h, i + -1.2 * l, h, l),
                                    Ki.restore();
                                if (s = f("img/" + d + "_wing2.png"))
                                    Ki.save(),
                                    i = -(-.2 + c) * m(-90),
                                    n = .8 * this.rad,
                                    Ki.rotate(i),
                                    i = this.rad,
                                    h = 1.4 * n,
                                    l = 2 * n,
                                    Ki.drawImage(s, 0 + -1.2 * h, i + -1.2 * l, h, l),
                                    Ki.restore();
                                Ki.restore()
                            }
                            s = 500 / 340;
                            this.type == Vt ? (s = 1.5,
                            n = this.rad - t,
                            overSizeOffset = n / 2,
                            Ki.drawImage(o, -n - overSizeOffset, -n - overSizeOffset, 2 * n * s, 2.4 * n * s)) : (n = this.rad - t,
                            Ki.drawImage(o, -n * s, -n * s, 2 * n * s, 2 * n * s));
                            if (this.type == Ht && this.flag_flying && !this.flag_isGrabbed) {
                                Ki.save();
                                r = (Ur - this.spawnTime) / 1e3;
                                c = ne(r, 2.1, .4, 1.5);
                                d = ne(r, 2.1, -8, 1.5);
                                var g = ne(r, 2.1, .4, 1.5)
                                  , p = ne(r, 2.1, .3, 1.5)
                                  , s = f("img/blackdragon_wing1.png")
                                  , n = .6 * this.rad;
                                s && (Ki.save(),
                                i = -(-.3 + c) * m(90),
                                Ki.rotate(i),
                                i = this.rad,
                                h = 1.6 * n,
                                l = 2 * n + 5 * d,
                                Ki.drawImage(s, 0 + .65 * h, i + l * -(1.75 - (g + g / 4 - p)), h, l),
                                Ki.restore());
                                if (s = f("img/blackdragon_wing2.png"))
                                    Ki.save(),
                                    i = -(-.3 + c) * m(-90),
                                    Ki.rotate(i),
                                    i = this.rad,
                                    h = 1.6 * n,
                                    l = 2 * n + 5 * d,
                                    Ki.drawImage(s, 0 + -1.65 * h, i + l * -(1.75 - (g + g / 4) + p), h, l),
                                    Ki.restore();
                                Ki.restore()
                            }
                        }
                        .01 < this.frozenEffA && (Ki.save(),
                        Ki.globalAlpha = .3 * Ki.globalAlpha * this.frozenEffA,
                        v(0, 0, Math.max(0, this.rad - t), "white"),
                        Ki.restore());
                        .01 < this.effA_healing && (Ki.save(),
                        Ki.globalAlpha = .3 * Ki.globalAlpha * this.effA_healing,
                        v(0, 0, Math.max(0, this.rad - t), "#ef24ed"),
                        Ki.restore());
                        .01 < this.effA_poison && (Ki.save(),
                        Ki.globalAlpha = .3 * Ki.globalAlpha * this.effA_poison,
                        h = .3,
                        l = .5 * (1 - h),
                        Ki.globalAlpha *= h + l + l * Math.sin(2 * Math.PI / 1.2 * ((Ur - this.spawnTime) / 1e3)),
                        v(0, 0, Math.max(0, this.rad - t), "#9FDA00"),
                        Ki.restore());
                        this.flag_hurt && (Ki.fillStyle = "rgba(255,0,0,0.3)",
                        Ki.beginPath(),
                        Ki.arc(0, 0, Math.max(0, this.rad - t), 0, 2 * Math.PI),
                        Ki.fill());
                        n = this.flag_eff_bleeding ? .8 : 0;
                        this.effA_bleeding += .1 * (n - this.effA_bleeding);
                        .01 < this.effA_bleeding && (Ki.save(),
                        h = .3,
                        l = .3 * (1 - h),
                        Ki.globalAlpha *= h + l + l * Math.sin(2 * Math.PI / 1.2 * ((Ur - this.spawnTime) / 1e3)),
                        Ki.globalAlpha *= this.effA_bleeding,
                        v(0, 0, this.rad + -2.6 * this.effA_bleeding, "red"),
                        Ki.restore());
                        n = this.flag_eff_stunk ? .8 : 0;
                        this.effA_stunk += .1 * (n - this.effA_stunk);
                        .01 < this.effA_stunk && (Ki.save(),
                        h = .3,
                        l = .3 * (1 - h),
                        Ki.globalAlpha *= h + l + l * Math.sin(2 * Math.PI / 1.2 * ((Ur - this.spawnTime) / 1e3)),
                        Ki.globalAlpha *= this.effA_stunk,
                        v(0, 0, this.rad + -2.6 * this.effA_stunk, "brown"),
                        Ki.restore());
                        this.type == nt && (Ki.fillStyle = "#E5CF79",
                        Ki.beginPath(),
                        n = this.rad - t,
                        s = 1 * n,
                        Ki.moveTo(-.16 * n, s),
                        Ki.lineTo(0, n * (this.flag_usingAbility ? 1.41 : .7)),
                        Ki.lineTo(.153 * n, s),
                        Ki.closePath(),
                        Ki.fill());
                        this.type == Yt && this.flag_usingAbility && (n = 1 * Math.sin(2 * Math.PI / .75 * r),
                        h = Ki.globalAlpha,
                        Ki.globalAlpha *= .8 - .2 * n,
                        v(.15 * this.rad, 1.27 * -this.rad, this.rad * (.1 + .05 * n), "#efefef"),
                        v(.15 * -this.rad, 1.27 * -this.rad, this.rad * (.1 - .05 * n), "#efefef"),
                        Ki.globalAlpha = h);
                        o || (this.type == ht ? (Ki.fillStyle = a,
                        Ki.beginPath(),
                        Ki.arc(.2 * this.rad, .7 * this.rad, Math.max(0, .55 * this.rad - t), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(.2 * -this.rad, .7 * this.rad, Math.max(0, .55 * this.rad - t), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.fillStyle = "#8C96A6",
                        Ki.beginPath(),
                        Ki.arc(-(.29 * this.rad), .7 * this.rad + 10, Math.max(0, 3 - t / 2), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(.29 * this.rad, .7 * this.rad + 10, Math.max(0, 3 - t / 2), 0, 2 * Math.PI),
                        Ki.fill()) : this.type == it ? (Ki.fillStyle = "#B5AE4C",
                        Ki.beginPath(),
                        Ki.arc(.1 * this.rad, -.45 * this.rad, .13 * this.rad, 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(-.4 * this.rad, -.2 * this.rad, .12 * this.rad, 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(.15 * this.rad, -.25 * this.rad, .16 * this.rad, 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(.63 * this.rad, -.4 * this.rad, .1 * this.rad, 0, 2 * Math.PI),
                        Ki.fill()) : this.type == tt ? (Ki.fillStyle = "#000000",
                        n = Math.max(0, this.rad - t),
                        a = 0,
                        Ki.beginPath(),
                        Ki.moveTo(1 * -n, 0 + a),
                        Ki.lineTo(0, .2 * -n + a),
                        Ki.lineTo(1 * n, 0 + a),
                        Ki.lineTo(0, .1 * n + a),
                        Ki.closePath(),
                        Ki.fill(),
                        a -= .3 * this.rad,
                        Ki.beginPath(),
                        Ki.moveTo(.8 * -n, 0 + a),
                        Ki.lineTo(0, .2 * -n + a),
                        Ki.lineTo(.8 * n, 0 + a),
                        Ki.lineTo(0, .1 * n + a),
                        Ki.closePath(),
                        Ki.fill(),
                        a -= .3 * this.rad,
                        Ki.beginPath(),
                        Ki.moveTo(.7 * -n, 0 + a),
                        Ki.lineTo(0, .1 * -n + a),
                        Ki.lineTo(.7 * n, 0 + a),
                        Ki.lineTo(0, .1 * n + a),
                        Ki.closePath(),
                        Ki.fill()) : this.type == $e ? (Ki.fillStyle = "#E5C870",
                        Ki.beginPath(),
                        a = .35 * -this.rad,
                        s = .1 * -this.rad,
                        Ki.moveTo(a, s),
                        Ki.lineTo(a + .25 * this.rad, s),
                        Ki.lineTo(a - .35 * this.rad, s - 15),
                        Ki.fill(),
                        Ki.beginPath(),
                        a = .35 * this.rad,
                        s = .1 * -this.rad,
                        Ki.moveTo(a, s),
                        Ki.lineTo(a - .25 * this.rad, s),
                        Ki.lineTo(a + .35 * this.rad, s - 15),
                        Ki.fill()) : this.type == st ? (Ki.fillStyle = "black",
                        Ki.beginPath(),
                        Ki.arc(0, this.rad - 3, Math.max(0, 5 - t / 2), 0, 2 * Math.PI),
                        Ki.fill()) : this.type == et && (Ki.fillStyle = "#FA2E8D",
                        Ki.beginPath(),
                        Ki.arc(0, this.rad - 3, Math.max(0, 4 - t / 2), 0, 2 * Math.PI),
                        Ki.fill(),
                        n = Math.max(0, this.rad + 2.5 - t),
                        Ki.fillStyle = "#F64455",
                        Ki.beginPath(),
                        a = .707 * -n,
                        r = .707 * n,
                        Ki.arc(a, r, Math.max(0, 5 - t / 2), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(a + 2, r + 2, Math.max(0, 4 - t / 2), 0, 2 * Math.PI),
                        Ki.fill(),
                        a = .707 * n,
                        r = .707 * n,
                        Ki.arc(a, r, Math.max(0, 5 - t / 2), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(a - 2, r + 2, Math.max(0, 4 - t / 2), 0, 2 * Math.PI),
                        Ki.fill()));
                        o || (Ki.save(),
                        o = Math.max(1, this.rad / 25),
                        Ki.scale(o, o),
                        this.drawEyeAtPos(6, .32 * this.rad),
                        this.drawEyeAtPos(-6, .32 * this.rad),
                        Ki.restore());
                        n = this.flag_webStuck ? 1 : 0;
                        this.effA_webStuck += .02 * (n - this.effA_webStuck);
                        if (.01 < this.effA_webStuck) {
                            Ki.save();
                            Ki.globalAlpha = .9 * Ki.globalAlpha * this.effA_webStuck;
                            if (s = f("img/spiderWeb_stuck.png"))
                                n = 1.3 * this.rad,
                                Ki.drawImage(s, -n, -n, 2 * n, 2 * n);
                            Ki.restore()
                        }
                        n = this.flag_constricted ? 1 : 0;
                        this.effA_constricted += .04 * (n - this.effA_constricted);
                        if (.01 < this.effA_constricted) {
                            Ki.save();
                            Ki.globalAlpha = .9 * Ki.globalAlpha * this.effA_constricted;
                            if (s = f("img/constrict.png"))
                                n = 1.3 * this.rad,
                                Ki.rotate(-this.angle),
                                Ki.drawImage(s, -n, -n, 2 * n, 2 * n);
                            Ki.restore()
                        }
                        if (this.flag_underWater || this.flag_usingAbility && this.type == et)
                            Ki.save(),
                            Ki.globalAlpha = 1 - this.underwaterA,
                            r = (Ur - this.spawnTime) / 1e3,
                            n = 1 * Math.sin(2 * Math.PI / 1.5 * r),
                            this.flag_underWater && (Ki.globalAlpha *= .5,
                            this.type == rt && (Ki.globalAlpha = .3)),
							// changed colors
                            Ki.fillStyle = this.flag_underWater ? "#FF3F00" : "#FF00FF",
							if (window.event.shiftKey === true) { Ki.fillStyle = this.flag_underWater ? "#00FFFF" : "#FFFF00" }
                            o = this.flag_underWater ? .15 * this.rad : .1 * this.rad,
                            Ki.beginPath(),
                            Ki.arc(-.35 * this.rad, -.33 * this.rad, Math.max(0, o + n), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.35 * this.rad, -.32 * this.rad, Math.max(0, o - n), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(.35 * this.rad, .36 * this.rad, Math.max(0, o + n), 0, 2 * Math.PI),
                            Ki.fill(),
                            Ki.beginPath(),
                            Ki.arc(-.35 * this.rad, .35 * this.rad, Math.max(0, o - n), 0, 2 * Math.PI),
                            Ki.fill(),
                            this.type == ft ? (Ki.globalAlpha = 1 - this.underwaterA,
                            Ki.fillStyle = "#73799b",
                            Ki.beginPath(),
                            n = this.rad,
                            s = .25 * n,
                            Ki.moveTo(-.07 * n, s),
                            Ki.lineTo(0, s - .5 * n),
                            Ki.lineTo(.35 * n, s),
                            Ki.closePath(),
                            Ki.fill()) : this.type == Pt ? v(0, .2 * this.rad, .12 * this.rad, "#4D4D4D") : this.type == zt ? v(0, .45 * this.rad, .08 * this.rad, "#202A65") : this.type == ta ? (c = ne(r, 1, 1, 1),
                            Ki.save(),
                            Ki.rotate(m(40)),
                            Ki.scale(1, 2),
                            Ki.globalAlpha = .08,
                            v(1 * this.rad, .2 * this.rad, .1 * this.rad + .1 * this.rad * c, "#B32E10"),
                            Ki.globalAlpha = .2,
                            v(1 * this.rad, .2 * this.rad, .15 * this.rad, "#B32E10"),
                            Ki.restore(),
                            Ki.save(),
                            Ki.globalAlpha = 1,
                            Ki.rotate(m(-40)),
                            Ki.scale(1, 2),
                            Ki.globalAlpha = .08,
                            v(-1 * this.rad, .2 * this.rad, .1 * this.rad + .1 * this.rad * -c, "#B32E10"),
                            Ki.globalAlpha = .2,
                            v(-1 * this.rad, .2 * this.rad, .15 * this.rad, "#B32E10"),
                            Ki.restore()) : this.type == yt ? (Ki.globalAlpha = 1 - this.underwaterA,
                            v(.4 * this.rad, .75 * this.rad, .12 * this.rad, "#598b30"),
                            v(.65 * this.rad, .55 * this.rad, .1 * this.rad, "#64a034"),
                            v(-.4 * this.rad, .75 * this.rad, .12 * this.rad, "#64a034"),
                            v(-.65 * this.rad, .55 * this.rad, .1 * this.rad, "#598b30")) : this.type == Vt && (Ki.save(),
                            Ki.globalAlpha = .2,
                            Ki.scale(1, 2),
                            v(0, .24 * this.rad, .08 * this.rad, "#202A65"),
                            v(0, -.02 * this.rad, .06 * this.rad, "#202A65"),
                            v(0, -.28 * this.rad, .05 * this.rad, "#202A65"),
                            v(0, -.54 * this.rad, .04 * this.rad, "#202A65"),
                            Ki.restore()),
                            Ki.restore();
							// ft is shark, Pt is Killer Whale, zt is Blue Whale, ta is King Crab, yt is The Kraken, Vt is T-Rex
                        this.flag_usingAbility && this.type == kt && (Ki.save(),
                        Ki.globalAlpha = 1 - this.underwaterA,
                        "undefined" == typeof this.octoDrawObj && (this.octoDrawObj = new k(0,Ta,0,0,this.rad)),
                        this.octoDrawObj.oType = this.octoDisguiseObjT,
                        this.octoDrawObj.curBiome = Xi,
                        1 == this.specType ? (this.octoDrawObj.oType = ia,
                        this.octoDrawObj.type = this.octoDisguiseObjT,
                        this.octoDrawObj.nRad = this.rad) : this.octoDisguiseObjT == Ta ? this.octoDrawObj.nRad = 25 : this.octoDisguiseObjT == _a ? this.octoDrawObj.nRad = 17 : this.octoDisguiseObjT == Xa ? this.octoDrawObj.nRad = 15 : this.octoDisguiseObjT == sa && (this.octoDrawObj.curBiome = Xi),
                        this.octoDrawObj.nRad = this.rad,
                        this.octoDrawObj.draw(),
                        Ki.restore());
                        this.flag_usingAbility && this.type == Tt && (Ki.save(),
                        Ki.globalAlpha = 1 - this.underwaterA,
                        (s = f("img/snowball.png")) ? (n = this.rad,
                        Ki.rotate(this.rPer * Math.PI * 2),
                        Ki.drawImage(s, -n, -n, 2 * n, 2 * n)) : this.drawOutlinedCircle("", "white"),
                        Ki.restore());
                        Ki.restore();
                        n = this.flag_eff_stunned ? 1 : 0;
                        this.stunA += .1 * (n - this.stunA);
                        .01 < this.stunA && (Ki.save(),
                        o = 2.5,
                        o = Ur % (1e3 * o) / (1e3 * o),
                        Ki.rotate(2 * o * Math.PI),
                        Ki.globalAlpha *= this.stunA,
                        o = .2 * this.rad,
                        r = (Ur - this.spawnTime) / 1e3,
                        n = (.5 + .07 * o) * Math.sin(2 * Math.PI / 1 * r),
                        Ki.fillStyle = "#F3D444",
                        Ki.beginPath(),
                        Ki.arc(-.22 * this.rad, -.22 * this.rad, Math.max(0, o + n), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(.22 * this.rad, -.22 * this.rad, Math.max(0, o - n), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(.22 * this.rad, .22 * this.rad, Math.max(0, o + n), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(-.22 * this.rad, .22 * this.rad, Math.max(0, o - n), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.restore());
                        n = this.flag_eff_onFire ? 1 : 0;
                        this.onFireEffA += .1 * (n - this.onFireEffA);
                        .01 < this.onFireEffA && (h = .15,
                        l = .5 * (.4 - h),
                        o = h + l + l * Math.sin(2 * Math.PI / 1 * (Ur / 1e3)),
                        Ki.save(),
                        Ki.globalAlpha = Ki.globalAlpha * o * this.onFireEffA,
                        v(0, 0, Math.max(0, this.rad - t), "orange"),
                        Ki.restore(),
                        h = .5,
                        l = .5 * (1 - h),
                        n = h + l + l * Math.sin(2 * Math.PI / 1 * (Ur / 1e3)),
                        t = Math.trunc(Ur / 300) % 2,
                        s = f(1 == t ? "img/fire.png" : "img/fire2.png"),
                        o = f(0 == t ? "img/fire.png" : "img/fire2.png"),
                        s || o) && (t = 0 - .3 * this.rad,
                        i = .2 * this.rad - .3 * this.rad,
                        h = 1 * this.rad * (2 + 2 * n) / 3,
                        l = 1 * this.rad * n,
                        Ki.save(),
                        s && (Ki.globalAlpha = Ki.globalAlpha * this.onFireEffA * n,
                        Ki.drawImage(s, t + -.5 * h, i + -.95 * l, h, l)),
                        o && (Ki.globalAlpha = Ki.globalAlpha * this.onFireEffA * n,
                        Ki.drawImage(o, t + .5 * this.rad + -.5 * h, i + .5 * this.rad + -.95 * l, h, l)),
                        Ki.restore());
                        .01 < this.frozenEffA && this.flag_eff_frozen && (Ki.save(),
                        o = 7,
                        o = Ur % (1e3 * o) / (1e3 * o),
                        Ki.rotate(2 * o * Math.PI),
                        Ki.globalAlpha *= this.frozenEffA,
                        o = .2 * this.rad,
                        r = (Ur - this.spawnTime) / 1e3,
                        n = (.5 + .07 * o) * Math.sin(2 * Math.PI / 1 * r),
                        Ki.fillStyle = "white",
                        t = .27 * this.rad,
                        Ki.beginPath(),
                        Ki.arc(-t, -t, Math.max(0, o + n), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(t, -t, Math.max(0, o - n), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(t, t, Math.max(0, o + n), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.beginPath(),
                        Ki.arc(-t, t, Math.max(0, o - n), 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.restore());
                        this.flag_lowWat && (h = .2,
                        l = .5 * (.8 - h),
                        o = h + l + l * Math.sin(2 * Math.PI / 1.2 * (Ur / 1e3)),
                        Ki.save(),
                        Ki.globalAlpha = o,
                        Ki.fillStyle = this.type == Ht ? We : Re,
                        Ki.beginPath(),
                        Ki.arc(0, this.rad + 5, 5, 0, 2 * Math.PI),
                        Ki.fill(),
                        Ki.restore());
                        Ki.save();
                        this.name && this.nameTXT && !As && (Ki.globalAlpha = this.dead ? Ki.globalAlpha * (1 - e) : 1,
                        Ki.globalAlpha *= this.nameA,
                        this.nameTXT.x = 0,
                        this.nameTXT.y = this.rad + 9,
                        this.nameTXT.draw());
                        Ki.restore()
                    }
                    ;
                    this.drawEyeAtPos = function(e, t) {
                        Ki.beginPath();
                        Ki.arc(e, t, 4.5, 0, 2 * Math.PI);
                        Ki.fillStyle = "black";
                        Ki.fill();
                        Ki.beginPath();
                        Ki.fillStyle = "white";
                        Ki.arc(e - 2, t - 1, .99, 0, 2 * Math.PI);
                        Ki.fill()
                    }
                    ;
                    this.moveUpdate = function() {
                        var e = (Ur - this.updateTime) / 1e3 / Ee
                          , e = 0 > e ? 0 : 1 < e ? 1 : e;
                        this.dead && 1 <= e && pr.push(this);
                        this.x = e * (this.nx - this.ox) + this.ox;
                        this.y = e * (this.ny - this.oy) + this.oy;
                        this.rad += .1 * (this.nRad - this.rad);
                        if (this.oType == ia) {
                            var t = .1 * this.angleDelta;
                            this.angleDelta -= t;
                            this.angle += t
                        }
                        return Math.min(1, e)
                    }
                    ;
                    this.worldUpd_readNewlyVisibleObjMessage = function(e) {
                        var a = e.readBitGroup()
                          , i = a.getBool()
                          , s = a.getBool();
                        this.curBiome = a.getInt0to3();
                        a = null;
                        i && (a = fr[e.readUInt32()]);
                        a && (this.updateTime = Ur,
                        this.nx = this.x,
                        this.ny = this.y,
                        this.ox = a.x,
                        this.oy = a.y,
                        this.x = a.x,
                        this.y = a.y);
                        t == ia && (i = e.readUInt8(),
                        a = e.readString(),
                        this.type = i,
                        this.setName(a ? a : "mope.io"));
                        s && (this.isRectangle = !0,
                        this.rectW = e.readUInt16(),
                        this.rectH = e.readUInt16());
                        if (this.oType == ba) {
                            this.type = e.readUInt8();
                            this.hasAngleUpdate = 1 == e.readUInt8();
                            this.specType = e.readUInt8();
                            if (this.hasAngleUpdate || this.type == _i || this.type == Ti || this.type == xi || this.type == Ai || this.type == Ii || this.type == Ei || this.type == vi || this.type == Ui || this.type == Ni || this.type == Oi || this.type == Bi || this.type == Ci || this.type == Ri)
                                s = 3 * e.readUInt8() + 180,
                                this.angle = m(s);
                            if (this.type == bi || this.type == ui || this.type == vi || this.type == Pi || this.type == Mi)
                                this.rad = this.oRad = 0
                        }
                        this.oType == Ga && (this.riverSpecT = s = e.readUInt8(),
                        this.riverFlowSpeedX = 0 == s ? 1 : -1);
                        this.oType == ti && (this.specType = e.readUInt8());
                        this.oType == ai && (this.specType = e.readUInt8());
                        if ((this.objAngleUpdate = 1 == e.readUInt8()) || this.oType == oi || this.oType == ka)
                            s = 3 * e.readUInt8(),
                            this.angle = m(s + 90),
                            this.specType = e.readUInt8()
                    }
                    ;
                    this.worldUpd_readUpdatedObjMessage = function(e) {
                        var t = e.readUInt16() / 4
                          , a = e.readUInt16() / 4
                          , i = e.readUInt16() / 10
                          , s = e.readBitGroup()
                          , r = s.getBool()
                          , s = s.getBool();
                        this.updateTime = Ur;
                        this.ox = this.x;
                        this.oy = this.y;
                        this.nx = t;
                        this.ny = a;
                        this.oRad = this.rad;
                        this.nRad = i;
                        this.flag_hurt = s;
                        r ? (t = e.readUInt8(),
                        .001 > this.hpBarA && (this.hpPer = t),
                        this.hpPer_n = t,
                        this.hpBarTimeoutT = +new Date + 3e3) : this.hpBarTimeoutT = +new Date;
                        if (this.oType == ia) {
                            t = e.readString();
                            this.setName(t ? t : "mope.io");
                            this.specType = e.readUInt8();
                            t = 2 * e.readUInt8();
                            t = m(t - 90);
                            this.angleDelta = u(this.angle, t);
                            this.oAngle = this.angle;
                            this.firstPosUpd && (this.oAngle = this.angle = t,
                            this.angleDelta = 0);
                            t = e.readBitGroup();
                            this.curBiome = t.getIntWithXBits(3);
                            this.flag_lowWat = t.getBool();
                            this.flag_underWater = t.getBool();
                            this.flag_eff_invincible = t.getBool();
                            this.flag_usingAbility = t.getBool();
                            this.flag_tailBitten = t.getBool();
                            this.flag_eff_stunned = t.getBool();
                            this.flag_iceSliding = t.getBool();
                            this.flag_eff_frozen = t.getBool();
                            this.flag_eff_onFire = t.getBool();
                            this.flag_eff_healing = t.getBool();
                            this.flag_eff_poison = t.getBool();
                            this.flag_constricted = t.getBool();
                            this.flag_webStuck = t.getBool();
                            this.flag_stealth = t.getBool();
                            this.flag_eff_bleeding = t.getBool();
                            this.flag_flying = t.getBool();
                            this.flag_isGrabbed = t.getBool();
                            this.flag_eff_aniInClaws = t.getBool();
                            this.flag_eff_stunk = t.getBool();
                            this.flag_cold = t.getBool();
                            this.flag_inWater = t.getBool();
                            this.flag_inLava = t.getBool();
                            this.flag_canClimbHill = t.getBool();
                            this.flag_isDevMode = t.getBool();
                            if (this.type == Qt || this.type == $t)
                                if (this.flag_quack = t.getBool())
                                    (t = fr[this.id]) && t.gotChat(this.type == Qt ? "QUACK!" : "PEEP!"),
                                    this.flag_quack = !1;
                            this.type != kt && this.type != Jt || !this.flag_usingAbility || (this.octoDisguiseObjT = e.readUInt8())
                        }
                        this.oType == ai && (this.specType = e.readUInt8());
                        if (this.oType == ba) {
                            if (this.hasAngleUpdate || this.type == Oi || this.type == Ci)
                                t = 3 * e.readUInt8(),
                                this.angle = m(t);
                            this.type == Gi && (this.specType = e.readUInt8())
                        }
                        if (this.objAngleUpdate || this.oType == oi || this.oType == ka)
                            t = 3 * e.readUInt8(),
                            this.angle = m(t + 90),
                            this.specType = e.readUInt8();
                        this.firstPosUpd = !1
                    }
                    ;
                    this.worldUpd_readRemovedObjMessage = function(e) {
                        e = 0 < e.readUInt8() ? e.readUInt32() : 0;
                        e = 0 < e ? fr[e] : void 0;
                        this.dead = !0;
                        this.updateTime = Ur;
                        this.oType == ba ? (this.ox = this.x,
                        this.oy = this.y,
                        this.nx = this.x,
                        this.ny = this.y) : e ? (this.ox = this.x,
                        this.oy = this.y,
                        this.oRad = this.rad,
                        this.nx = e.nx,
                        this.ny = e.ny,
                        this.nRad = Math.min(this.rad, e.rad),
                        this.hp_n = 0) : (this.ox = this.x,
                        this.oy = this.y,
                        this.oRad = this.rad,
                        this.nx = this.x,
                        this.ny = this.y,
                        this.nRad = 0)
                    }
                }
                function M() {}
                function v(e, t, a, i) {
                    Ki.fillStyle = i;
                    Ki.beginPath();
                    Ki.arc(e, t, Math.max(0, a), 0, 2 * Math.PI);
                    Ki.fill()
                }
                function T(e) {
                    this.data = e;
                    this.offset = 0;
                    this.readUInt8 = function() {
                        var e = this.data.getUint8(this.offset);
                        this.offset += 1;
                        return e
                    }
                    ;
                    this.readUInt16 = function() {
                        try {
                            var e = this.data.getUint16(this.offset, !1);
                            this.offset += 2;
                            return e
                        } catch (e) {
                            return 0
                        }
                    }
                    ;
                    this.readUInt32 = function() {
                        var e = this.data.getUint32(this.offset, !1);
                        this.offset += 4;
                        return e
                    }
                    ;
                    this.readString = function() {
                        for (var e = this.readUInt16(), t = "", a, i = 0; i < e; i++)
                            a = this.readUInt8(),
                            i != e - 1 && (t += String.fromCharCode(a));
                        return decodeURIComponent(escape(t))
                    }
                    ;
                    this.readMsgReaderBitsGroup = function() {}
                    ;
                    this.readBitGroup = function() {
                        return new _(this)
                    }
                }
                function x(e) {
                    this.len = 0;
                    this.dataView = new DataView(new ArrayBuffer(e));
                    this.writeUInt8 = function(e) {
                        this.dataView.setUint8(this.len, e);
                        this.len += 1
                    }
                    ;
                    this.writeUInt16 = function(e) {
                        this.dataView.setUint16(this.len, e, !1);
                        this.len += 2
                    }
                    ;
                    this.writeInt16 = function(e) {
                        this.dataView.setInt16(this.len, e, !1);
                        this.len += 2
                    }
                    ;
                    this.writeUInt32 = function(e) {
                        this.dataView.setUint32(this.len, e, !1);
                        this.len += 4
                    }
                    ;
                    this.writeString = function(e) {
                        e = unescape(encodeURIComponent(e));
                        len = e.length;
                        this.writeUInt16(e.length);
                        for (var t = 0; t < len; t++)
                            this.writeUInt8(e.charCodeAt(t))
                    }
                }
                function _(e) {
                    this.bytesArray = new Uint8Array(20);
                    this.bytesLen = 0;
                    this.rBitIndex = 1;
                    this.rByteIndex = 0;
                    this.getBool = function() {
                        var e = 0 < b(this.bytesArray[this.rByteIndex], this.rBitIndex);
                        this.rBitIndex += 1;
                        7 < this.rBitIndex && (this.rBitIndex = 1,
                        this.rByteIndex += 1);
                        return e
                    }
                    ;
                    this.getInt0to3 = function() {
                        return this.getIntWithXBits(2)
                    }
                    ;
                    this.getIntWithXBits = function(e) {
                        for (var t = 0, a = 0; a < e; a++)
                            t = this.getBool() ? t | 1 << a : t & ~(1 << a);
                        return t
                    }
                    ;
                    this.byteToStr = function(e) {
                        for (var t = "", a = 0; 8 > a; a++)
                            t += 0 < b(e, a) ? "1" : "0";
                        return t
                    }
                    ;
                    var t = !0;
                    do
                        t = e.readUInt8(),
                        this.bytesArray[this.bytesLen++] = t,
                        t = 0 < b(t, 0);
                    while (t)
                }
                function D(e) {
                    U();
                    E();
                    S();
                    ve = e;
                    ke = e.region;
                    Me = fe[e.region].indexOf(e);
                    O() && (theWs = Mr,
                    Mr = null,
                    theWs.close());
                    1 < ws && (Me += 1,
                    Me > fe[ke].length - 1 && (Me = 0),
                    ve = ce[Me],
                    ke = ve.region,
                    S());
                    Ns = !1;
                    document.getElementById("connecting").style.visibility = "visible";
                    console.log("Connecting to " + ve.name + "...");
                    var t = "https:" === window.location.protocol ? "wss://" : "ws://"
                      , t = t + ve.serverConnURL + ":" + ("wss://" == t ? 7021 : 7020);
                    console.log("connecting to " + t);
                    Mr = new WebSocket(t);
                    Mr.binaryType = "arraybuffer";
                    Mr.onopen = function() {
                        ws = 0;
                        document.getElementById("startMenu").style.visibility = "visible";
                        document.getElementById("connecting").style.visibility = "hidden"
                    }
                    ;
                    Mr.onmessage = function(e) {
                        C(new DataView(e.data))
                    }
                    ;
                    Mr.onclose = function(t) {
                        this == Mr && (ws += 1,
                        Es = Us = !1,
                        Ns || (setTimeout(function() {
                            D(e)
                        }, 2e3),
                        document.getElementById("connecting").style.visibility = "visible"))
                    }
                    ;
                    Mr.onerror = function() {
                        console.log("socket error!")
                    }
                }
                function S() {
                    document.getElementById("serverSelect").selectedIndex = Me + 1
                }
                function E() {
                    for (var e = document.getElementById("serverSelect"); e.lastChild; )
                        e.removeChild(e.lastChild);
                    var t = document.createElement("option");
                    t.text = "Choose a server:";
                    t.disabled = !0;
                    e.add(t);
                    for (var a = -1, i = fe[ke], s = 0; s < i.length; s++)
                        t = document.createElement("option"),
                        t.text = i[s].name + " [" + (0 > i[s].playersCount ? "..." : i[s].playersCount) + " players " + (500 <= i[s].playersCount ? "-FULL!" : "") + "]",
                        i[s].ip == ve.ip && (a = s),
                        e.add(t);
                    -1 == a && (a = 0);
                    e.selectedIndex = a + 1
                }
                function U() {
                    for (var e = document.getElementById("regionSelect"); e.lastChild; )
                        e.removeChild(e.lastChild);
                    var t = document.createElement("option");
                    t.text = "Choose a region:";
                    t.disabled = !0;
                    e.add(t);
                    for (var a = -1, i = 0; i < ge.length; i++) {
                        for (var s = ge[i], t = fe[s], r = 0; r < t.length; r++)
                            ;
                        t = document.createElement("option");
                        t.text = s;
                        s == ke && (a = i);
                        e.add(t)
                    }
                    -1 == a && (a = 0);
                    e.selectedIndex = a + 1
                }
                function B() {
                    if (!ye) {
                        var e = ve.name.replace(/\W/g, "").toUpperCase()
                          , t = window.location.href.split("?")[0];
                        console.log("URL is " + location.protocol + "//" + location.host + location.pathname);
                        window.history.replaceState({
                            foo: "foo"
                        }, "mope.io (" + e + ")", t + "?server=" + e)
                    }
                    document.getElementById("startMenuWrapper").style.display = "block";
                    X(!0)
                }
                function C(e) {
                    e = new T(e);
                    switch (e.readUInt8()) {
                    case 1:
                        nPlayers = e.readUInt16();
                        Gs.setText(y(nPlayers) + " players");
                        serverVer = e.readUInt16();
                        209 < serverVer ? setTimeout(function() {
                            ye || (window.onbeforeunload = null);
                            console.log("Old client (ver 209/" + serverVer + ")");
                            alert("mope.io has been updated! You need to refresh to get the latest version of the game! (If this keeps appearing, hold SHIFT when pressing refresh!)");
                            window.location.reload(!0)
                        }, 1500) : (209 > serverVer && console.log("Old server version detected!"),
                        B());
                        break;
                    case 2:
                        var t = e.readUInt8();
                        if (1 == t) {
                            spectating = 2 == e.readUInt8();
                            Es = !spectating;
                            Us = !0;
                            Bs || (document.getElementById("onconnectDiv").style.visibility = "visible");
                            Bs = !0;
                            bs = e.readUInt16();
                            us = e.readUInt16();
                            gameMode = e.readUInt8();
                            he();
                            ss = camx_o = camx_n = e.readUInt16() / 4;
                            camy = camy_o = camy_n = e.readUInt16() / 4;
                            camzoom_n = e.readUInt16() / 1e3;
                            is = 1.2 * camzoom_n;
                            spectating || H(e);
                            spectating || (document.getElementById("startMenuWrapper").style.display = "none",
                            g(ts),
                            ye || (window.onbeforeunload = function(e) {
                                return "You're alive in a game, close mope.io?"
                            }
                            ));
                            if (!spectating && (nn += 1,
                            window.localStorage))
                                try {
                                    window.localStorage.setItem("gamesSinceAd", nn)
                                } catch (e) {}
                            Q()
                        } else if (0 == t) {
                            e = document.getElementById("spawnXpLabel");
                            e.style.display = "block";
                            e.style.opacity = 1;
                            e.textContent = "Error: this server is full!";
                            var a = ve;
                            setTimeout(function() {
                                Es || ve != a || (ws = 100,
                                D(ve))
                            }, 1e3)
                        }
                        break;
                    case 24:
                        var i = e.readUInt8();
                        5 == i && (jr = !1);
                        if (0 == i || 1 == i) {
                            var t = 1 == i
                              , i = e.readUInt8()
                              , s = e.readUInt8();
                            jr = !0;
                            Gr = 0;
                            zr = [];
                            Lr = t;
                            Xr = +new Date;
                            Yr = Xr + 1e3 * i;
                            for (i = 0; i < s; i++) {
                                var r = e.readUInt8()
                                  , n = e.readUInt8()
                                  , r = new w(0,0,100,100,r,n);
                                zr.push(r)
                            }
                        }
                        Rr = +new Date;
                        t && (document.getElementById("startMenuWrapper").style.display = "none");
                        break;
                    case 8:
                        t = e.readUInt16();
                        s = e.readUInt8();
                        lbData = [];
                        for (i = 0; i < s; ++i)
                            lbData.push({
                                rank: e.readUInt16(),
                                name: e.readString(),
                                score: e.readUInt32()
                            });
                        j(lbData, 0, t);
                        break;
                    case 10:
                        nPlayers = e.readUInt16();
                        Gs.setText(y(nPlayers) + " players");
                        break;
                    case 18:
                        t = e.readUInt8();
                        i = 0 < e.readUInt8();
                        Ds = e.readUInt32();
                        nr = e.readUInt32();
                        s = W(t);
                        Nr = i ? "You downgraded to " + s.aniName + "! \nDont lose too much xp!" : s.upgradeText;
                        Or = "white";
                        Rr = +new Date + 9e3;
                        cr || (cr = !0,
                        hr = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0),
                        lr = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0),
                        or = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0),
                        dr = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0));
                        hr = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0);
                        i = e.readUInt8();
                        for (s = 0; s < i; s++)
                            hr[e.readUInt8() - 1] = 1;
                        lr = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0);
                        i = e.readUInt8();
                        for (s = 0; s < i; s++)
                            lr[e.readUInt8() - 1] = 1;
                        or = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0);
                        i = e.readUInt8();
                        for (s = 0; s < i; s++)
                            or[e.readUInt8() - 1] = 1;
                        dr = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0);
                        i = e.readUInt8();
                        for (s = 0; s < i; s++)
                            dr[e.readUInt8() - 1] = 1;
                        Hr = t == qe || t == ot;
                        Wr = +new Date + 9e3;
                        Fr = 0;
                        break;
                    case 14:
                        var t = e.readUInt8()
                          , h = e.readUInt32();
                        Nr = 1 == t ? "Oh no, You were eaten! \n Watch out for red-circled players!" : 2 == t ? "Oh no, You died from a tail-bite!\n Watch your tail!" : 4 == t ? "You died of thirst :( Don't let your water run out!" : 13 == t ? "You died from burning! (Get to water when on fire!)" : "You died! Watch your health!";
                        Or = "#F1C34C";
                        Rr = +new Date + 3500;
                        jr = Es = !1;
                        Z();
                        try {
                            ye || setTimeout(factorem.refreshAds.bind(factorem, null, !0), 800)
                        } catch (e) {}
                        window.setTimeout(function() {
                            if (!Es) {
                                be && ee();
                                ue && (console.log("Showing ad android..."),
                                window.location = "myscheme://showAdmob");
                                document.getElementById("startMenuWrapper").style.display = "block";
                                zs = 0 < h ? "You'll spawn with +" + abbreviate_number(h) + " XP!" : "";
                                var e = document.getElementById("spawnXpLabel");
                                e.style.opacity = 0;
                                zs && setTimeout(function() {
                                    Es || (e.style.display = "block",
                                    e.style.opacity = 1)
                                }, 1e3);
                                document.getElementById("spawnXpLabel").textContent = zs;
                                ye || (window.onbeforeunload = null)
                            }
                        }, 2e3);
                        break;
                    case 4:
                        R(e);
                        break;
                    case 19:
                        t = e.readUInt32();
                        if (t = fr[t])
                            e = e.readString(),
                            t.gotChat(e);
                        break;
                    case 23:
                        t = e.readUInt8();
                        if (Es)
                            switch (Rr = Ur + 3500,
                            Or = "white",
                            t) {
                            case 255:
                                Nr = e.readString();
                                break;
                            case 2:
                                Nr = "Ouch! Your tail got bitten!";
                                break;
                            case 12:
                                Nr = "You've been stung by a jellyfish!";
                                break;
                            case 3:
                                Nr = "ZAP! You've been shocked by a STINGRAY!";
                                break;
                            case 8:
                                Nr = "You've been inked!";
                                break;
                            case 5:
                                Nr = "Oh no! Escape the kraken's pull!";
                                break;
                            case 6:
                                Nr = "Ouch! Pufferfish are pointy!";
                                break;
                            case 7:
                                Nr = "That's an octopus in disguise!";
                                break;
                            case 9:
                                Nr = "Brrr! You've been frozen!";
                                break;
                            case 10:
                                Nr = "Ahh! The wolf's howl scared you!";
                                break;
                            case 11:
                                Nr = "Ouch! A VERY LOUD sound hit you!";
                                break;
                            case 13:
                                Nr = "Ah! You're on fire!";
                                break;
                            case 14:
                                Nr = "BAM! You got kicked by a donkey!";
                                break;
                            case 16:
                                Nr = "Ouch! You're getting dragged by a croc!";
                                break;
                            case 17:
                                Nr = "A fox DUG you out of the hole!";
                                break;
                            case 18:
                                Nr = "A wave has swept you away!"
                            }
                        break;
                    case 25:
                        t = 0 < e.readUInt8(),
                        e = e.readUInt8() / 10,
                        t ? (wr = 1e3 * e,
                        Pr = +new Date + 1e3 * e,
                        yr = !0) : (br = 1e3 * e,
                        ur = +new Date + 1e3 * e,
                        mr = !0)
                    }
                }
                function N(e) {
                    Mr.send(e.dataView.buffer)
                }
                function O() {
                    return null != Mr && Mr.readyState == Mr.OPEN
                }
                function R(e) {
                    kr = Ur = +new Date;
                    camx_o = ss;
                    camy_o = camy;
                    camx_n = e.readUInt16() / 4;
                    camy_n = e.readUInt16() / 4;
                    camzoom_n = e.readUInt16() / 1e3;
                    var t = e.readUInt8()
                      , a = b(t, 0)
                      , i = b(t, 1)
                      , s = b(t, 2);
                    Ar = b(t, 3);
                    Os = b(t, 7);
                    if (!a) {
                        var a = mr = abil_active = !1
                          , r = gi;
                        i && (a = b(t, 4),
                        mr = b(t, 5),
                        abil_active = b(t, 6),
                        r = e.readUInt8());
                        t = yr = abil_dive_active = !1;
                        if (s) {
                            var n = e.readUInt8()
                              , t = b(n, 0);
                            yr = b(n, 1);
                            abil_dive_active = b(n, 2)
                        }
                        Ar ? (Ys.abil_usable = a,
                        Ys.abil_recharging = mr,
                        Ys.abil_possible = i,
                        Ys.abil_active = abil_active,
                        Ys.abil_Type = r,
                        Xs.abil_usable = t,
                        Xs.abil_recharging = yr,
                        Xs.abil_possible = s,
                        Xs.abil_active = abil_dive_active,
                        Xs.abil_Type = ci,
                        yr && (Xs.abil_rechargeTotalT = wr,
                        Xs.abil_rechargeEndT = Pr),
                        mr && (Ys.abil_rechargeTotalT = br,
                        Ys.abil_rechargeEndT = ur)) : (Xs.abil_usable = a,
                        Xs.abil_recharging = mr,
                        Xs.abil_possible = i,
                        Xs.abil_active = abil_active,
                        Xs.abil_Type = r,
                        Ys.abil_usable = t,
                        Ys.abil_recharging = yr,
                        Ys.abil_possible = s,
                        Ys.abil_active = abil_dive_active,
                        Ys.abil_Type = ci,
                        mr && (Xs.abil_rechargeTotalT = br,
                        Xs.abil_rechargeEndT = ur),
                        yr && (Ys.abil_rechargeTotalT = wr,
                        Ys.abil_rechargeEndT = Pr));
                        waterBarPerc_n = e.readUInt8();
                        xp = e.readUInt32();
                        Ws = e.readUInt8()
                    }
                    i = e.readUInt16();
                    for (s = 0; s < i; s++) {
                        var a = e.readUInt8()
                          , h = e.readUInt32()
                          , r = e.readUInt16() / 4
                          , t = e.readUInt16() / 4
                          , n = e.readUInt16() / 4
                          , a = new k(h,a,t,n,r)
                          , r = fr[h];
                        delete fr[h];
                        r = gr.indexOf(r);
                        -1 != r && gr.splice(r, 1);
                        fr[h] = a;
                        gr.push(a);
                        a.worldUpd_readNewlyVisibleObjMessage(e)
                    }
                    i = e.readUInt16();
                    for (s = 0; s < i; s++)
                        h = e.readUInt32(),
                        (a = fr[h]) ? a.worldUpd_readUpdatedObjMessage(e) : console.log("Error: Updated GameObj id " + h + " doesn't exist!");
                    i = e.readUInt16();
                    for (s = 0; s < i; s++)
                        a = e.readUInt32(),
                        (a = fr[a]) ? a.worldUpd_readRemovedObjMessage(e) : console.log("Error: Removed GameObj id " + h + " doesn't exist!")
                }
                function W(e) {
                    var t = {};
                    switch (e) {
                    case Ft:
                        t.aniName = "Snail";
                        t.aniDesc = "";
                        t.upgradeText = "You're a super slow snail!";
                        t.aniCol = "#fcc02b";
                        t.skinName = "snail";
                        break;
                    case qe:
                        t.aniName = "Mouse";
                        t.aniDesc = "";
                        t.upgradeText = "";
                        t.aniCol = "#9BA9B9";
                        t.skinName = "mouse";
                        break;
                    case Ke:
                        t.aniName = "Rabbit";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to RABBIT! \nPress W to burrow a hole to hide in!";
                        t.aniCol = "#AA937E";
                        t.skinName = "rabbit";
                        break;
                    case Ze:
                        t.aniName = "Pig";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to PIG!\n Pigs move FAST through MUD! (Can use 'stink' on mud/ hiding holes!)";
                        t.aniCol = "#DD6BD4";
                        t.skinName = "pig";
                        break;
                    case Qe:
                        t.aniName = "Fox";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to FOX! ,\n You can kick players out of hiding holes! (Press W when in one!)\n+ Hide in red berry bushes!";
                        t.aniCol = "#FF9D43";
                        t.skinName = "fox";
                        break;
                    case $e:
                        t.aniName = "Deer";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to DEER! \nPress W to dig up food! \nDig in mud for better food!\n Hint:Check water areas for new food sources!";
                        t.aniCol = "#C4773E";
                        t.skinName = "deer";
                        break;
                    case et:
                        t.aniName = "Mole";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to MOLE!\n Hold W to dig underground!\nGo under anything, do surprise attacks!";
                        t.aniCol = "#4C4A45";
                        t.skinName = "mole";
                        break;
                    case tt:
                        t.aniName = "Zebra";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to ZEBRA! \nPress W to kick side ways!";
                        t.aniCol = "#FFFFFF";
                        t.skinName = "zebra";
                        break;
                    case at:
                        t.aniName = "Lion";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to LION!\n Press W to release a mighty ROAR (Rawr!)!";
                        t.aniCol = "#f8c923";
                        t.skinName = "lion";
                        break;
                    case it:
                        t.aniName = "Cheetah";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to CHEETAH!\n Press W to get a speed boost! (Every 8 seconds)!";
                        t.aniCol = "#CAC05B";
                        t.skinName = "cheetah";
                        break;
                    case st:
                        t.aniName = "Bear";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to BEAR!\n Bears climb through green hills! (Press W to use your claw!)";
                        t.aniCol = "#99591C";
                        t.skinName = "bear";
                        break;
                    case rt:
                        t.aniName = "Croc";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to CROCODILE!\n Press W to bite and drag around animals! \n+ (Now hide in water spots)+ Swim well in Mud, Lakes & Oceans!";
                        t.aniCol = "#30F51C";
                        t.skinName = "croc";
                        break;
                    case ht:
                        t.aniName = "Hippo";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to HIPPO!\nHippos are great swimmers, dominate the Lakes/Oceans/Mud!";
                        t.aniCol = "#945A99";
                        t.skinName = "hippo";
                        break;
                    case nt:
                        t.aniName = "Rhino";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to RHINO!\n Press W to CHARGE with your mighty horn!";
                        t.aniCol = "#94a3a9";
                        t.skinName = "rhino";
                        break;
                    case ot:
                        t.aniName = "Shrimp";
                        t.aniDesc = "";
                        t.upgradeText = "";
                        t.aniCol = "#f88e37";
                        t.skinName = "shrimp";
                        break;
                    case dt:
                        t.aniName = "Trout";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to TROUT!\nHint: Hold Left-click to RUN! (Uses extra water)";
                        t.aniCol = "#ac8686";
                        t.skinName = "trout";
                        break;
                    case ct:
                        t.aniName = "Crab";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to CRAB!\n Crabs can survive on dry land!\n (On land, Press W to go into your shell!)";
                        t.aniCol = "#bf2408";
                        t.skinName = "crab";
                        break;
                    case gt:
                        t.aniName = "Squid";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to SQUID!\n Squids can use INK when injured (press W!) \n+ you can hide in plankton bushes!";
                        t.aniCol = "#40dda4";
                        t.skinName = "squid";
                        break;
                    case ft:
                        t.aniName = "Shark";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to SHARK!\n A vicious predator of the oceans!";
                        t.aniCol = "#999fc6";
                        t.skinName = "shark";
                        break;
                    case bt:
                        t.aniName = "Sea-horse";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to SEA HORSE!\n An agile hunter!";
                        t.aniCol = "#73BE2F";
                        t.skinName = "seahorse";
                        break;
                    case ut:
                        t.aniName = "Jellyfish";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to JELLYFISH!\n A slowly-turning animal that can grow quite large!";
                        t.aniCol = "#FDB9BA";
                        t.skinName = "jellyfish";
                        break;
                    case mt:
                        t.aniName = "Turtle";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to TURTLE!\n Lives well on land & water! (On land, Press W to go into your shell!)";
                        t.aniCol = "#502E1A";
                        t.skinName = "turtle";
                        break;
                    case pt:
                        t.aniName = "Stringray";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to STINGRAY!\n Use electic shock (Release W key!) to shock animals! \n(Takes time to recharge)";
                        t.aniCol = "#164336";
                        t.skinName = "stingray";
                        break;
                    case yt:
                        t.aniName = "The Kraken";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to THE KRAKEN!\n Terrorize the oceans, and be feared by all!\n (Release W to use whirlpool ability!)";
                        t.aniCol = "#64a034";
                        t.skinName = "kraken";
                        break;
                    case wt:
                        t.aniName = "Pufferfish";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to PUFFERFISH!\n (Hold W to inflate- become spiky, and dangerous to touch!)";
                        t.aniCol = "#6C5C2C";
                        t.skinName = "pufferfish";
                        break;
                    case Pt:
                        t.aniName = "Killer Whale";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to Killer Whale! \nWhales blow out water when diving! (And sometimes other loot!)";
                        t.aniCol = "#141414";
                        t.skinName = "killerwhale";
                        break;
                    case At:
                        t.aniName = "Swordfish";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n (Press W to rush with your sharp nose!)";
                        t.aniCol = "#689CD7";
                        t.skinName = "swordfish";
                        break;
                    case It:
                        t.aniName = "Gorilla";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Gorillas are very fast on hills/trees!\n Press W to throw bananas! (from trees)";
                        t.aniCol = "#323232";
                        t.skinName = "gorilla";
                        break;
                    case kt:
                        t.aniName = "Octopus";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to Octopus!\nHold W to use your 'Disguise' ability!\n(Hint: wait for prey to bite you- they get stunned!)";
                        t.aniCol = "#ff8340";
                        t.skinName = "octopus";
                        break;
                    case lt:
                        t.aniName = "Dragon";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n (You're amazing!) \nFly over everything, Hold W to shoot fire!";
                        t.aniCol = "#22FF8A";
                        t.skinName = "dragon";
                        break;
                    case Ht:
                        t.aniName = "Black Dragon";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Black dragons drink lava instead of water! Black dragons only heal on healing stones/lava!";
                        t.aniCol = "black";
                        t.skinName = "blackdragon";
                        break;
                    case Yt:
                        t.aniName = "Giant Spider";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Place web around the game to catch prey!";
                        t.aniCol = "black";
                        t.skinName = "giantSpider";
                        break;
                    case Lt:
                        t.aniName = "Cobra";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Hold W to Spit venom, and poison animals with your bite!";
                        t.aniCol = "black";
                        t.skinName = "cobra";
                        break;
                    case Xt:
                        t.aniName = "Boa Constrictor";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Coil and suffocate other animals!";
                        t.aniCol = "black";
                        t.skinName = "boaConstrictor";
                        break;
                    case Vt:
                        t.aniName = "T-REX";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + " The Dinosaur!\n This ancient dinosaur has powerful jaws that can drag prey around!!";
                        t.aniCol = "#862A2A";
                        t.skinName = "trex";
                        break;
                    case Jt:
                        t.aniName = "Tiger";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to Tiger!\n Tigers can launch an ambush attack (HOLD W to grow a bush)!";
                        t.aniCol = "#FF9000";
                        t.skinName = "tiger";
                        break;
                    case qt:
                        t.aniName = "Giraffe";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to Giraffe!\nGiraffe have huge legs and stomp anyone in their way!";
                        t.aniCol = "#E9BD23";
                        t.skinName = "giraffe";
                        break;
                    case Kt:
                        t.aniName = "Eagle";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to Eagle!\nEagles can fly up other animals in the air! !\nThey can also fly high (double click)";
                        t.aniCol = "#5b400d";
                        t.skinName = "eagle";
                        break;
                    case Nt:
                        t.aniName = "Arctic Fox";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n You can kick players out of hiding holes! (Press W when in one!)\n+ Hide in red berry bushes!";
                        t.aniCol = "#CFCFCF";
                        t.skinName = "arctic/arcticfox";
                        break;
                    case vt:
                        t.aniName = "Arctic Hare";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n \nPress W to burrow a hole to hide in!";
                        t.aniCol = "#D5D5D5";
                        t.skinName = "arctic/arctichare";
                        break;
                    case Tt:
                        t.aniName = "The Yeti!";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n So it really exists... \n Hold W to turn into snow, release W to freeeeeze!";
                        t.aniCol = "#839eb5";
                        t.skinName = "arctic/yeti";
                        break;
                    case xt:
                        t.aniName = "Chipmunk";
                        t.aniDesc = "";
                        t.upgradeText = "";
                        t.aniCol = "#A77C30";
                        t.skinName = "arctic/chipmunk";
                        break;
                    case _t:
                        t.aniName = "Muskox";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Press W to charge with your horns! \nPlus move decently on ice!";
                        t.aniCol = "#231f18";
                        t.skinName = "arctic/muskox";
                        break;
                    case Dt:
                        t.aniName = "Penguin";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Left-click to run!\n (HOLD W to slide FAST on ice)!";
                        t.aniCol = "#FFFFFF";
                        t.skinName = "arctic/penguin";
                        break;
                    case St:
                        t.aniName = "Polar Bear";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Polar bears can climb hills! \n+ They're amazing swimmers!";
                        t.aniCol = "#e4e4e4";
                        t.skinName = "arctic/polarbear";
                        break;
                    case Et:
                        t.aniName = "Seal";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Seals can slide on ice (Hold W) + can climb hills (rocks too!)";
                        t.aniCol = "#cfcfcf";
                        t.skinName = "arctic/seal";
                        break;
                    case Ut:
                        t.aniName = "Snow leopard";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Press W to get a speed boost! (Every 8 seconds)!";
                        t.aniCol = "#cfcfcf";
                        t.skinName = "arctic/snowleopard";
                        break;
                    case Bt:
                        t.aniName = "Walrus";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n You can slide on ice (Hold W) + can climb hills (rocks too!)";
                        t.aniCol = "#633838";
                        t.skinName = "arctic/walrus";
                        break;
                    case Ct:
                        t.aniName = "Reindeer";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Press W to dig up food! \n Your sharp hooves let you turn very well on ice!";
                        t.aniCol = "#a68976";
                        t.skinName = "arctic/reindeer";
                        break;
                    case Mt:
                        t.aniName = "Wolf";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Wolf paws turn very well on ice!\n Press W to howl!";
                        t.aniCol = "#6B6B6B";
                        t.skinName = "arctic/wolf";
                        break;
                    case Ot:
                        t.aniName = "Wolverine";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Press W to Let out a Powerful GROWL! (Knocks back prey!)";
                        t.aniCol = "#843A0F";
                        t.skinName = "arctic/wolverine";
                        break;
                    case Rt:
                        t.aniName = "Mammoth";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Press W to roll snowballs with your trunk!\n The bigger the snowball gets, the longer the freeze!";
                        t.aniCol = "#9d4717";
                        t.skinName = "arctic/mammoth";
                        break;
                    case Wt:
                        t.aniName = "Donkey";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Press W to Kick any animal behind you";
                        t.aniCol = "#8c7c64";
                        t.skinName = "donkey";
                        break;
                    case jt:
                        t.aniName = "Sabertooth Tiger";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to Sabertooth Tiger!\nSabertooth Tigers are great swimmers, dominate the Lakes/Oceans/Mud!";
                        t.aniCol = "#945A99";
                        t.skinName = "sabertoothtiger";
                        break;
                    case Gt:
                        t.aniName = "Elephant";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to " + t.aniName + "!\n Use your long trunk to attack and eat food!";
                        t.aniCol = "#945A99";
                        t.skinName = "elephant";
                        break;
                    case zt:
                        t.aniName = "Blue Whale";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to Blue Whale!\n Smash with your powerful tail!";
                        t.aniCol = "#945A99";
                        t.skinName = "bluewhale";
                        break;
                    case Qt:
                        t.aniName = "Duck";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to a DUCK!";
                        t.aniCol = "#FF9000";
                        t.skinName = "duck";
                        break;
                    case $t:
                        t.aniName = "Duckling";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to a DUCK!";
                        t.aniCol = "#FF9000";
                        t.skinName = "duckling";
                        break;
                    case Zt:
                        t.aniName = "Hedgehog";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to Hedgehog!\n (Hold W to become spiky, and dangerous to touch!)";
                        t.aniCol = "#5b400d";
                        t.skinName = "hedgehog";
                        break;
                    case ta:
                        t.aniName = "King Crab";
                        t.aniDesc = "";
                        t.upgradeText = "UPGRADED to a KING CRAB!\n Spam that Crabhammer!";
                        t.aniCol = "#7F00FF";
                        t.skinName = "kingcrab";
                        break;
                    case ea:
                        t.aniName = "Lemming";
                        t.aniDesc = "";
                        t.upgradeText = "";
                        t.aniCol = "#A77C30";
                        t.skinName = "arctic/lemming";
                        break;
                    default:
                        t.aniName = "(Animal)",
                        t.aniDesc = "",
                        t.upgradeText = "UPGRADED!"
                    }
                    return t
                }
                function F(e, t, a, i, s, r) {
                    if (!Is) {
                        Ki.save();
                        var n = a - e
                          , h = i - t
                          , l = ps / 2 / is
                          , o = ms / 2 / is;
                        e = Math.max(e, ss - l - s + 0);
                        t = Math.max(t, camy - o - r + 0);
                        a = Math.min(a, ss + l - s - 0);
                        i = Math.min(i, camy + o - r - 0);
                        Ki.strokeStyle = "black";
                        Ki.globalAlpha = .055;
                        a -= e;
                        fillH = i - t;
                        for (i = -.5 + e + (n - e) % 30; i < e + a; i += 30)
                            Ki.beginPath(),
                            Ki.moveTo(i, t),
                            Ki.lineTo(i, t + fillH),
                            Ki.stroke();
                        for (dy = -.5 + t + (h - t) % 30; dy < t + fillH; dy += 30)
                            Ki.beginPath(),
                            Ki.moveTo(e, dy),
                            Ki.lineTo(e + a, dy),
                            Ki.stroke();
                        Ki.restore()
                    }
                }
                function H(e) {
                    Br = bs / us * Cr;
                    qi = document.createElement("canvas");
                    qi.width = Br;
                    qi.height = Cr;
                    var t = qi.getContext("2d");
                    t.globalAlpha = .35;
                    t.fillStyle = "#000000";
                    t.fillRect(0, 0, qi.width, qi.height);
                    for (var a = Br / 200, i = Cr / 200, s = e.readUInt16(), r = e.readUInt16(), n = e.readUInt16(), h = 0; 2 > h; h++) {
                        t.fillStyle = He;
                        t.globalAlpha = .5;
                        var l = Br / bs;
                        0 == h ? t.fillRect(0 * l, n * l, s * l, us * l) : t.fillRect((bs - s) * l, n * l, s * l, us * l)
                    }
                    t.fillStyle = "white";
                    t.globalAlpha = .5;
                    l = Br / bs;
                    t.fillRect((bs / 2 - r / 2) * l, 0 * l, r * l, n * l);
                    s = e.readUInt16();
                    t.fillStyle = He;
                    t.globalAlpha = .5;
                    for (h = 0; h < s; h++) {
                        var r = e.readUInt16() * (Br / bs)
                          , n = e.readUInt16() * (Cr / us)
                          , l = e.readUInt16() * (Br / bs)
                          , o = e.readUInt16() * (Cr / us);
                        t.globalAlpha = .5;
                        t.fillRect(l - r / 2, o - n / 2, r, n)
                    }
                    s = e.readUInt16();
                    t.fillStyle = We;
                    for (h = 0; h < s; h++)
                        r = 5 * e.readUInt8(),
                        n = e.readUInt16() * (Br / bs),
                        l = e.readUInt16() * (Cr / us),
                        t.beginPath(),
                        t.arc(n, l, Math.max(1, Br / bs * r), 0, 2 * Math.PI),
                        t.fill();
                    s = e.readUInt16();
                    t.fillStyle = Re;
                    t.globalAlpha = .5;
                    for (h = 0; h < s; h++)
                        r = e.readUInt8() * a,
                        n = e.readUInt8() * i,
                        l = 5 * e.readUInt8(),
                        t.beginPath(),
                        t.arc(r, n, Math.max(1, Br / bs * l), 0, 2 * Math.PI),
                        t.fill();
                    s = e.readUInt16();
                    t.fillStyle = "#907A33";
                    t.globalAlpha = .7;
                    for (h = 0; h < s; h++)
                        r = e.readUInt8() * a,
                        n = e.readUInt8() * i,
                        l = 5 * e.readUInt8(),
                        t.beginPath(),
                        t.arc(r, n, Math.max(1, Br / bs * l), 0, 2 * Math.PI),
                        t.fill();
                    s = e.readUInt16();
                    t.fillStyle = "#7BB7BB";
                    t.globalAlpha = .85;
                    for (h = 0; h < s; h++)
                        r = e.readUInt8() * a,
                        n = e.readUInt8() * i,
                        l = 5 * e.readUInt8(),
                        t.beginPath(),
                        t.arc(r, n, Math.max(1, Br / bs * l), 0, 2 * Math.PI),
                        t.fill();
                    s = e.readUInt16();
                    t.fillStyle = Ce;
                    t.globalAlpha = 1;
                    for (h = 0; h < s; h++)
                        r = e.readUInt8() * a,
                        n = e.readUInt8() * i,
                        l = 5 * e.readUInt8(),
                        t.beginPath(),
                        t.arc(r, n, Math.max(1, Br / bs * l), 0, 2 * Math.PI),
                        t.fill();
                    s = e.readUInt16();
                    t.fillStyle = "#A89937";
                    t.globalAlpha = .6;
                    for (h = 0; h < s; h++)
                        r = e.readUInt8() * a,
                        n = e.readUInt8() * i,
                        l = 5 * e.readUInt8(),
                        t.beginPath(),
                        t.arc(r, n, Math.max(1, Br / bs * l), 0, 2 * Math.PI),
                        t.fill();
                    s = e.readUInt16();
                    t.fillStyle = Ge;
                    t.globalAlpha = 1;
                    for (h = 0; h < s; h++)
                        r = e.readUInt8() * a,
                        n = e.readUInt8() * i,
                        t.beginPath(),
                        t.arc(r, n, Math.max(2.5, Br / bs * 40), 0, 2 * Math.PI),
                        t.fill();
                    s = e.readUInt16();
                    t.fillStyle = Re;
                    t.globalAlpha = 1;
                    for (h = 0; h < s; h++)
                        r = e.readUInt8() * a,
                        n = e.readUInt8() * i,
                        t.beginPath(),
                        t.arc(r, n, Math.max(2.5, Br / bs * 50), 0, 2 * Math.PI),
                        t.fill()
                }
                function j(e, t, a) {
                    Ji = null;
                    if (0 != e.length) {
                        Ji = document.createElement("canvas");
                        t = Ji.getContext("2d");
                        var i;
                        i = 55 + 22 * e.length;
                        Ji.width = 220;
                        Ji.height = i;
                        t.globalAlpha = .35;
                        t.fillStyle = "#000000";
                        t.fillRect(0, 0, 200, i);
                        t.globalAlpha = 1;
                        t.fillStyle = "#FFFFFF";
                        i = "Top Players";
                        t.font = "27px Arial";
                        Is || (t.shadowOffsetX = 1,
                        t.shadowOffsetY = 1);
                        t.shadowColor = "black";
                        t.fillText(i, 95 - t.measureText(i).width / 2, 40);
                        var s;
                        t.textAlign = "left";
                        t.font = "17px Arial";
                        for (s = 0; s < e.length; ++s)
                            i = As ? "" : e[s].name || "mope.io",
                            a == e[s].rank ? (t.fillStyle = "#FEED92",
                            As && (i = "you")) : t.fillStyle = "#FFFFFF",
                            i = e[s].rank + ". " + i + " (" + abbreviate_number(e[s].score) + (gameMode == zi ? " kills" : "") + ")",
                            t.fillText(i, 15, 65 + 22 * s)
                    }
                }
                function G() {
                    Ki.save();
                    if (Es) {
                        Rs += .1 * (waterBarPerc_n - Rs);
                        xpPer += .03 * (Ws - xpPer);
                        var e = fr[Ds];
                        e && (Ss = e.type);
                        var t = 1
                          , a = 25 >= Rs;
                        a && (t = .7 + .3 * Math.sin(2 * Math.PI / 1.2 * (Ur / 1e3)));
                        var i = Math.min(450, .9 * ps) * rs
                          , s = 30 * rs
                          , r = ps / 2
                          , n = ms - 60 * rs;
                        Ki.globalAlpha = .35 * t;
                        Ki.fillStyle = "#000000";
                        Ki.fillRect(r - i / 2, n - s / 2, i, s);
                        Ki.globalAlpha = t;
                        Ki.fillStyle = Ss == Ht ? We : Os ? "#8CCEF4" : Re;
                        Ki.fillRect(r - i / 2, n - s / 2, Rs / 100 * i, s);
                        Ki.fillStyle = gs ? a ? Ge : "orange" : a ? Ge : "white";
                        Ki.globalAlpha = 1 * t;
                        Fs.setText(Os ? a ? "LOW Air" : "Air" : e && e.type == Ht ? a ? "LOW Lava" : "Lava" : a ? "LOW Water" : "Water");
                        Fs.setFontSize(22 * rs);
                        Fs.setColor(a ? Ge : "white");
                        Fs.x = r;
                        Fs.y = n;
                        Ki.globalAlpha *= a ? 1 : .5;
                        Fs.draw();
                        Ki.globalAlpha = .35;
                        Ki.fillStyle = "#000000";
                        n = ms - s / 2 - 5;
                        i = .9 * ps;
                        Ki.fillRect(r - i / 2, n - s / 2, i, s);
                        Ki.globalAlpha = 1;
                        Ki.fillStyle = "#F3C553";
                        Ki.fillRect(r - i / 2, n - s / 2, xpPer / 100 * i, s);
                        Ki.globalAlpha = 1;
                        Hs.setText("" + abbreviate_number(xp) + " xp  (" + abbreviate_number(nr) + " xp Next Animal)");
                        Hs.setFontSize(22 * rs);
                        Hs.x = r;
                        Hs.y = n;
                        Hs.draw();
                        for (e = 0; e < Ls.length; e++)
                            Ls[e].draw();
                        Qi && (ir += .1 * ((Zs ? 1 : 0) - ir),
                        .005 < ir && Es && (Ki.globalAlpha = .3 * ir,
                        Ki.beginPath(),
                        Ki.arc($s, er, 50 * Zi, 0, 2 * Math.PI),
                        Ki.fillStyle = "#000000",
                        Ki.fill(),
                        Ki.globalAlpha = .5 * ir,
                        Ki.beginPath(),
                        Ki.arc(tr, ar, 50 * Zi * .57, 0, 2 * Math.PI),
                        Ki.fillStyle = "#000000",
                        Ki.fill(),
                        e = .3 * rr,
                        rr -= e,
                        sr += e,
                        joystickDistF += .1 * (joystickDistF_n - joystickDistF),
                        Ki.save(),
                        Ki.translate(ps / 2, ms / 2),
                        Ki.rotate(sr),
                        Ki.globalAlpha = .5 * ir,
                        Ki.beginPath(),
                        Ki.fillStyle = "#000000",
                        e = 40 * Zi,
                        fr[Ds] && (e = (9 + fr[Ds].rad) * is),
                        e *= .1 + .9 * joystickDistF,
                        t = 15 * Zi,
                        Ki.moveTo(e + 30 * Zi * (.2 + .8 * joystickDistF), 0),
                        Ki.lineTo(e, t / 2),
                        Ki.lineTo(e, -t / 2),
                        Ki.closePath(),
                        Ki.fill(),
                        Ki.restore()))
                    }
                    Ki.restore()
                }
                function z() {
                    var e = (Rr - Ur) / 1e3 / 1
                      , e = 0 > e ? 0 : 1 < e ? 1 : e;
                    0 < e && (Ki.save(),
                    Ki.globalAlpha = e,
                    js.setText(Nr),
                    js.setColor(Or),
                    js.setFontSize(25 * rs),
                    js.x = ps / 2,
                    js.y = .3 * ms,
                    js.draw(),
                    Ki.restore());
                    e = 0 < Wr - Ur ? 1 : 0;
                    Fr += .05 * (e - Fr);
                    if (.01 < Fr && !Is && Hr) {
                        Ki.save();
                        Ki.translate(ps / 2, ms * (.9 + .3 * (1 - Fr)));
                        if (e = f("./img/howToPlay1.png")) {
                            var t = .2 * ms / e.height * Fr;
                            Ki.drawImage(e, -.5 * e.width * t, -1 * e.height * t, e.width * t, e.height * t)
                        }
                        Ki.restore()
                    }
                    e = jr ? 1 : 0;
                    Gr += .1 * (e - Gr);
                    if (.01 < Gr) {
                        if (0 < zr.length) {
                            Ki.save();
                            Ki.translate(0, -.5 * ms * (1 - Gr));
                            for (var e = 170 * rs, t = e + 20, a = ps / 2 - (Math.max(0, zr.length - 1) * (10 + e) + (t - e)) / 2, i = 0; i < zr.length; i++) {
                                var s = zr[i];
                                s.buttonScaleF = 0 == i ? t / e : 1;
                                s.w = e;
                                s.h = e;
                                s.x = a;
                                s.y = .25 * ms;
                                a += s.w / 2 * s.buttonScaleF + e / 2 + 10
                            }
                            Ki.globalAlpha = Gr;
                            for (i = 0; i < zr.length; i++)
                                s = zr[i],
                                s.draw()
                        }
                        e = Math.max(0, Yr - Ur) / 1e3;
                        t = 1;
                        0 != e && 8 > e && (t = .7 + .3 * Math.sin(2 * Math.PI / 1.2 * (Ur / 1e3)));
                        Ki.save();
                        Ki.globalAlpha = Gr * t;
                        Ki.fillStyle = 0 != e && 8 > e ? "red" : "white";
                        Ki.font = 25 * rs + "px Arial";
                        Ki.lineWidth = 1;
                        Ki.textAlign = "center";
                        Ki.textBaseline = "middle";
                        Is || (Ki.shadowOffsetX = 1,
                        Ki.shadowOffsetY = 1,
                        Ki.shadowColor = "black");
                        e = 0 < e ? " (auto in " + Math.trunc(e) + "s)" : "";
                        Ki.fillText(Lr ? "Choose which animal to spawn as:" : "Choose an upgrade:" + e, ps / 2, zr[0].y - zr[0].w / 2 - 25);
                        Ki.restore();
                        Ki.restore()
                    }
                }
                function L(t) {
                    Ur = +new Date;
                    window.requestAnimationFrame(L);
                    1 != Ki.globalAlpha && (Ki.setTransform(1, 0, 0, 1, 0, 0),
                    Ki.globalAlpha = 1);
                    Ki.clearRect(0, 0, ps, ms);
                    t = (Ur - kr) / 1e3 / .2;
                    t = 0 > t ? 0 : 1 < t ? 1 : t;
                    ss = t * (camx_n - camx_o) + camx_o;
                    camy = t * (camy_n - camy_o) + camy_o;
                    is = (25 * is + camzoom_n) / 26;
                    q();
                    Ki.save();
                    t = ps / 2;
                    var a = ms / 2;
                    Ki.translate(t * (1 - is) + (t - ss) * is, a * (1 - is) + (a - camy) * is);
                    Ki.scale(is, is);
                    Ki.save();
                    Bs ? (t = 10,
                    t = 600,
                    Ki.globalAlpha = 1,
                    Ki.fillStyle = Ce,
                    Ki.fillRect(0, 0 - t, bs, t),
                    Ki.fillRect(0, us, bs, t),
                    Ki.fillRect(-t, -t, t, us + 2 * t),
                    Ki.fillRect(bs, -t, t, us + 2 * t)) : F((0 - (ps / 2 - ss * is)) / is, (0 - (ms / 2 - camy * is)) / is, (ps - (ps / 2 - ss * is)) / is, (ms - (ms / 2 - camy * is)) / is, 0, 0);
                    Ki.restore();
                    t = gr.slice();
                    for (var a = [sa, oa, La, ii], i = {}, s = 0; s < a.length; s++) {
                        var r = new M;
                        i[a[s]] = r;
                        t.push(r)
                    }
                    for (d = t.length - 1; 0 <= d; d--)
                        for (s = t[d],
                        e = 0; e < a.length; e++)
                            if (r = a[e],
                            r == s.oType && !(s instanceof M)) {
                                i[r].addBatchedObj(s);
                                t.splice(d, 1);
                                break
                            }
                    pr = [];
                    for (d = 0; d < t.length; d++)
                        t[d].updateZ();
                    t.sort(function(e, t) {
                        return e.z == t.z ? e.id - t.id : e.z - t.z
                    });
                    for (d = 0; d < t.length; d++)
                        s = t[d],
                        s.draw();
                    if (!As)
                        for (d = 0; d < t.length; d++)
                            "undefined" != typeof t[d].chatLines && t[d].drawChat();
                    for (d = 0; d < pr.length; d++)
                        t = pr[d],
                        fr.hasOwnProperty(t.id) && delete fr[t.id],
                        t = gr.indexOf(t),
                        -1 != t && gr.splice(t, 1);
                    Ki.restore();
                    Es && (Ji && Ji.width && Ki.drawImage(Ji, 10 * Zi, 10 * Zi, Ji.width * rs, Ji.height * rs),
                    qi && qi.width && Ki.drawImage(qi, ps - (10 * Zi + qi.width * rs), 10 * Zi, Br * rs, Cr * rs),
                    t = fr[Ds]) && (Ki.fillStyle = "white",
                    Ki.beginPath(),
                    Ki.arc(ps - (10 * Zi + qi.width * rs) + t.x * qi.width * rs / bs, 10 * Zi + t.y * qi.height * rs / us, 3, 0, 2 * Math.PI),
                    Ki.fill());
                    G();
                    z();
                    cn && (fn.setFontSize(40 * rs),
                    fn.x = ps / 2,
                    fn.y = .2 * ms,
                    gn ? fn.setText("") : fn.setText("Connecting to game..."),
                    fn.draw(),
                    !gn && (t = ps / 2,
                    a = .25 * ms + 120 * rs,
                    i = f("skins/mouse.png"))) && (Ki.save(),
                    Ki.translate(t, a),
                    Ki.rotate(Ur % 800 / 800 * Math.PI * 2),
                    Ki.drawImage(i, -75, -75, 150, 150),
                    Ki.restore());
                    370 < Zr && !Es && (Is && (xs += 1,
                    1e3 < Ur - _s && (_s = +new Date,
                    Gs.setText(xs + " fps"),
                    xs = 0)),
                    Gs.setFontSize(15 * rs),
                    Gs.x = ps - 5 - Gs.width / 2,
                    Gs.y = ms - 2 - Gs.height / 2,
                    Gs.draw())
                }
                function X(e) {
                    if (O() && !Es) {
                        playerName = nickInput.value.replace(/(<([^>]+)>)/gi, "").substring(0, 20);
                        var t = 9 + unescape(encodeURIComponent(playerName)).length + 1;
                        mes = new x(t);
                        mes.writeUInt8(2);
                        mes.writeString(playerName);
                        mes.writeUInt16(ps);
                        mes.writeUInt16(ms);
                        mes.writeUInt8(e ? 1 : 0);
                        N(mes);
                        if (!e && window.localStorage)
                            try {
                                window.localStorage.setItem("nick", playerName + "")
                            } catch (e) {}
                    }
                }
                function Y() {
                    var e = document.getElementById("chatinput");
                    if (!qr && Es)
                        e.style.visibility = "visible",
                        e.focus(),
                        qr = !0,
                        e.onblur = function() {
                            qr && Y()
                        }
                        ;
                    else if (qr) {
                        var t = e.value + "";
                        qr = !1;
                        e.style.visibility = "hidden";
                        e.blur();
                        0 < t.length && Es && (newMsg = new x(3 + unescape(encodeURIComponent(t)).length),
                        newMsg.writeUInt8(19),
                        newMsg.writeString(t),
                        N(newMsg));
                        e.value = ""
                    }
                }
                function V() {
                    Zr = window.innerWidth;
                    Qr = window.innerHeight;
                    be && (Zr = document.body.clientWidth,
                    Qr = document.body.clientHeight);
                    Zi = window.devicePixelRatio;
                    ps = Zr * Zi;
                    ms = Qr * Zi;
                    Vi.width = ps;
                    Vi.height = ms;
                    Vi.style.width = Zr + "px";
                    Vi.style.height = Qr + "px";
                    document.getElementById("chatinput").style.marginTop = Qr / 2 - 50 + "px";
                    Vs.w = Vs.h = 95 * Zi;
                    Xs.w = Xs.h = 95 * Zi;
                    Ys.w = Ys.h = 95 * Zi;
                    Js.w = 60 * Zi;
                    Js.h = 30 * Zi;
                    Vs.x = 25 * Zi + Vs.w / 2;
                    Vs.y = ms - (40 * Zi + Vs.w / 2);
                    Ms && (Vs.x = ps - Vs.x);
                    Xs.x = Vs.x;
                    Xs.y = Qi ? Vs.y - (10 * Zi + Xs.w / 2 + Vs.w / 2) : Vs.y;
                    Ys.x = Vs.x;
                    Ys.y = Xs.y - (10 * Zi + Ys.w / 2 + Xs.w / 2);
                    Js.x = 72.5 * Zi + 125 * Zi;
                    Js.y = 15 * Zi + Js.h / 2;
                    qs.setPosAndSize(Js.x - (Js.w / 2 + 10 * Zi), Js.y, 60 * Zi, 30 * Zi, 1, .5);
                    Ks.setPosAndSize(qs.x, qs.y + qs.h / 2 + 10 * Zi, 60 * Zi, 30 * Zi, .5, 0);
                    for (var e = 0; e < Ls.length; e++)
                        Ls[e].visible = Qi;
                    Xs.visible = !0;
                    Ys.visible = !0;
                    qs.visible = qs.touchEnabled = Qi;
                    Ks.visible = Ks.touchEnabled = Qi && !1;
                    rs = Math.max(ps / 1344, ms / 756);
                    rs = Math.min(1, Math.max(.4, rs * Zi));
                    500 > Math.min(Zr, Qr) && (rs = Zi / 2 * .9);
                    O() && (mes = new x(5),
                    mes.writeUInt8(17),
                    mes.writeUInt16(ps),
                    mes.writeUInt16(ms),
                    N(mes))
                }
                function J(e, t) {
                    switch (e) {
                    case $r:
                        gs != t && O() && Es && (t && K(),
                        mes = new x(2),
                        mes.writeUInt8(21),
                        mes.writeUInt8(t ? 1 : 0),
                        N(mes));
                        gs = t;
                        break;
                    case en:
                        fs != t && O() && Es && (t && K(),
                        mes = new x(2),
                        mes.writeUInt8(20),
                        mes.writeUInt8(t ? 1 : 0),
                        N(mes));
                        fs = t;
                        break;
                    case sn:
                        Es && (mes = new x(1),
                        mes.writeUInt8(28),
                        N(mes))
                    }
                }
                function q() {
                    var e = ms / 2;
                    ls = (ns - (ps / 2 - ss * is)) / is;
                    os = (hs - (e - camy * is)) / is
                }
                function K() {
                    if (Kr) {
                        var e = fr[Ds];
                        if (e)
                            ls = e.x,
                            os = e.y + 2;
                        else
                            return
                    }
                    O() && Es && (.1 < Math.abs(ds - ls) || .1 < Math.abs(cs - os)) && (ds = ls,
                    cs = os,
                    mes = new x(7),
                    mes.writeUInt8(5),
                    mes.writeInt16(ls),
                    mes.writeInt16(os),
                    mes.writeInt16(wn),
                    N(mes))
                }
                function Z() {
                    Cs = +new Date;
                    Ns && (Ns = !1,
                    ye || (window.onbeforeunload = null),
                    document.getElementById("connecting").style.visibility = "visible",
                    window.location.reload())
                }
                function Q() {
                    V();
                    fr = {};
                    gr = [];
                    pr = [];
                    Ws = xpPer = xp = waterBarPerc_n = Rs = 0;
                    Ji = null;
                    zs = "";
                    var e = document.getElementById("spawnXpLabel");
                    e.style.display = zs ? "block" : "none";
                    e.textContent = zs;
                    for (e = 0; e < Ls.length; e++)
                        Ls[e].pressed = !1;
                    jr = Zs = !1;
                    Gr = 0;
                    zr = [];
                    Lr = !1
                }
                function $(e) {
                    if (window.WebViewJavascriptBridge)
                        return e(WebViewJavascriptBridge);
                    if (window.WVJBCallbacks)
                        return window.WVJBCallbacks.push(e);
                    window.WVJBCallbacks = [e];
                    var t = document.createElement("iframe");
                    t.style.display = "none";
                    t.src = "wvjbscheme://__BRIDGE_LOADED__";
                    document.documentElement.appendChild(t);
                    setTimeout(function() {
                        document.documentElement.removeChild(t)
                    }, 0)
                }
                function ee() {
                    rn && be && rn.callHandler("adShowCallBack", {
                        foo: "bar"
                    }, function(e) {
                        console.log("JS got response " + e)
                    })
                }
                function te() {
                    var e;
                    e = !ye && !0;
                    e = dn ? e && "undefined" != typeof adplayer : e;
                    return e ? we ? (console.log("videoAd: test mode, always show video ad!"),
                    !0) : Pe ? (console.log("videoAd: no show: ad blocker on!"),
                    !1) : 300 < (+new Date - hn) / 1e3 && 0 < nn ? (console.log("videoAd: show: time limit passed!"),
                    !0) : 3 <= nn ? (console.log("videoAd: show: 3+ games passed!"),
                    !0) : !1 : (console.log("videoAd: no show: ads disabled"),
                    !1)
                }
                function ae() {
                    dn && se("//api.adinplay.com/player/v2/MOP/mope.io/player.min.js", function() {
                        "undefined" != typeof aipPlayer ? (console.log("Loading video preroll..."),
                        adplayer = new aipPlayer({
                            AD_WIDTH: 960,
                            AD_HEIGHT: 540,
                            AD_FULLSCREEN: !1,
                            PREROLL_ELEM: document.getElementById("preroll"),
                            AIP_COMPLETE: function() {
                                console.log("Video ad finished.");
                                ie(!0)
                            }
                        })) : (console.log("Video ad (blocked) -finished."),
                        ie(!1))
                    })
                }
                function ie(e) {
                    if (on) {
                        cn = gn = on = !1;
                        dn || (document.getElementById("pvVidContainer").style.display = "none",
                        document.getElementById("my-content-2").style.display = "none");
                        if (e && (nn = 0,
                        hn = +new Date,
                        window.localStorage))
                            try {
                                window.localStorage.setItem("lastAdShowT", hn),
                                window.localStorage.setItem("gamesSinceAd", nn)
                            } catch (e) {}
                        $i && ($i.volume = .7);
                        var t = c("audio/click.mp3");
                        if (t)
                            try {
                                t.play()
                            } catch (e) {}
                        console.log("Video done (success: " + e + "), joining game!");
                        X(!1)
                    } else
                        console.log("ad isn't playing!")
                }
                function se(e, t) {
                    var a = document.head || document.getElementsByTagName("head")[0]
                      , i = document.createElement("script")
                      , s = !0;
                    i.async = "async";
                    i.type = "text/javascript";
                    i.charset = "UTF-8";
                    i.src = e;
                    i.onload = i.onreadystatechange = function() {
                        !s || i.readyState && !/loaded|complete/.test(i.readyState) || (s = !1,
                        t(),
                        i.onload = i.onreadystatechange = null)
                    }
                    ;
                    a.appendChild(i)
                }
                function re(e) {
                    adSuccess = !1;
                    e = document.getElementById("pvVidContainer");
                    mn = setTimeout(function() {
                        console.log("Error: ad failed to start playing!");
                        ie(!0)
                    }, 1e4);
                    try {
                        script = document.createElement("script"),
                        script.src = "http://cdn.playwire.com/bolt/js/zeus/embed.js",
                        script.type = "text/javascript",
                        script.id = "script",
                        script.setAttribute("charset", "utf-8"),
                        script.setAttribute("data-config", "http://config.playwire.com/1018393/v2/pre_content.json"),
                        script.setAttribute("data-width", "100%"),
                        script.setAttribute("data-height", "100%"),
                        script.setAttribute("data-id", bn),
                        script.setAttribute("data-onready", "onBoltLoaded"),
                        script.setAttribute("data-post-ad-container", "my-content-2"),
                        script.setAttribute("data-theme", "http://cdn.playwire.com/bolt/js/zeus/themes/orion/main.js"),
                        e.appendChild(script),
                        console.log("loading player...")
                    } catch (e) {
                        console.log("Error: " + e)
                    }
                }
                function ne(e, t, a, i) {
                    return a * Math.sin(i * Math.PI / t * e)
                }
                function he() {
                    un = [];
                    for (var e = 0; 1e3 > e; e++)
                        un.push({
                            x: p(-yn, bs - yn),
                            y: p(-yn, us - yn),
                            r: 3 * Math.random() + 1,
                            d: 1e3 * Math.random(),
                            mx: bs,
                            my: us,
                            angle: 0,
                            alpha: 0,
                            isArctic: !1,
                            color: Be
                        });
                    le("arctic", 7e3, 1600);
                    le("ocean", 1550, 5500)
                }
                function le(e, t, a) {
                    for (var i = un.length + ("ocean" == e ? 200 : 500), s = 0; un.length < i; s++) {
                        var r = p(10, 50) * ("ocean" == e ? 3 : 1);
                        un.push({
                            x: p(-yn, t - yn * ("ocean" == e ? 3 : 1)),
                            y: p(-yn, a - yn * ("ocean" == e ? 3 : 1)),
                            r: 3 * Math.random() + 2,
                            d: 100 * Math.random(),
                            mx: t + r,
                            my: a + r,
                            angle: 0,
                            alpha: 0,
                            biome: e,
                            color: 0 == p(0, 1) ? "#f2f2f2" : Be
                        })
                    }
                }
                function oe(e) {
                    e = window.event || e;
                    wn = 1 == Math.max(-1, Math.min(1, e.wheelDelta || -e.detail)) ? wn + 1 : wn - 1;
                    400 < wn ? wn = 400 : -100 > wn && (wn = -100)
                }
                a.TestObj = t("./objs/TestObj");
                var de = new (a.TestObjBerry = t("./objs/TestObjBerry"))(1);
                de.draw();
                de.describeObj();
                for (var ce = [], ge = ["USA-East", "USA-West", "Brazil/ USA-South", "Europe", "Asia/Australia"], fe = {}, pe = 0; pe < ge.length; pe++)
                    fe[ge[pe]] = [];
                console.log("------------MOPE.IO Version 209-------------");
                i = "USA-East";
                s("USA 1", "104.207.132.63", i);
                s("USA 2", "107.191.40.35", i);
                s("USA 3", "107.191.43.180", i);
                s("USA 4", "45.63.17.44", i);
                s("USA 5", "107.191.40.38", i);
                s("USA 6", "104.238.138.249", i);
                s("USA 7", "45.76.20.213", i);
                s("USA 8", "45.76.28.156", i);
                s("USA 9", "104.238.135.150", i);
                s("USA 10", "207.246.83.246", i);
                s("USA 11", "104.238.131.13", i);
                s("USA 12", "108.61.87.46", i);
                i = "USA-West";
                s("USA W 1", "45.63.87.103", i);
                s("USA W 2", "45.32.137.149", i);
                s("USA W 3", "45.76.67.64", i);
                s("USA W 4", "45.63.51.60", i);
                s("USA W 5", "45.32.228.141", i);
                s("USA W 6", "104.207.158.226", i);
                i = "Brazil/ USA-South";
                s("USA S 1", "108.61.224.165", i);
                s("USA S 2", "107.191.55.233", i);
                s("USA S 3", "45.32.198.173", i);
                s("USA S 4", "104.238.147.152", i);
                s("USA S 5", "108.61.205.88", i);
                i = "Europe";
                s("Europe 1", "45.77.88.81", i);
                s("Europe 2", "104.238.170.8", i);
                s("Europe 3", "45.76.129.33", i);
                s("Europe 4", "45.76.134.74", i);
                s("Europe 5", "45.76.135.33", i);
                s("Europe 6", "45.76.129.125", i);
                s("Europe 7", "45.32.144.28", i);
                s("Europe 8", "185.92.221.137", i);
                s("Europe 9", "45.32.152.68", i);
                s("Europe 10", "45.32.156.214", i);
                s("Europe 11", "45.32.154.83", i);
                s("Europe 12", "45.63.117.122", i);
                s("Europe 13", "104.238.159.143", i);
                s("Europe 14", "45.32.157.75", i);
                s("Europe 15", "45.77.67.70", i);
                s("Europe 16", "45.76.81.117", i);
                s("Europe 17", "45.63.117.130", i);
                s("Europe 18", "45.63.116.195", i);
                s("Europe 19", "45.77.52.178", i);
                s("Europe 20", "45.76.91.16", i);
                s("Europe 21", "108.61.211.119", i);
                s("Europe 22", "45.76.89.189", i);
                s("Europe 23", "45.76.87.177", i);
                i = "Asia/Australia";
                s("Asia 1", "45.63.28.66", i);
                s("Asia 2", "45.76.112.176", i);
                s("Asia 3", "45.32.101.8", i);
                var me = function(e) {
                    e = e.split("+").join(" ");
                    for (var t = {}, a, i = /[?&]?([^=]+)=([^&]*)/g; a = i.exec(e); )
                        t[decodeURIComponent(a[1])] = decodeURIComponent(a[2]);
                    return t
                }(document.location.search)
                  , be = 0 < me.mobileios
                  , ue = 0 < me.mobileAndroid
                  , ye = be || ue
                  , we = 0 < me.videoson;
                0 < me.videomode && setTimeout(function() {
                    var e = document.getElementById("startMenuWrapper");
                    e && (e.style.display = "none")
                }, 4e3);
                var Pe = !1;
                if (!ye) {
                    var Ae = document.createElement("div");
                    Ae.innerHTML = "&nbsp;";
                    Ae.className = "adsbox";
                    document.body.appendChild(Ae);
                    window.setTimeout(function() {
                        0 === Ae.offsetHeight && (Pe = !0,
                        document.getElementById("blockedImg").style.display = "block");
                        Ae.remove();
                        console.log("AdBlock Enabled? ", Pe)
                    }, 1e3)
                }
                var Ie = me.server;
                ye || (function(e, t, a, i, s, r, n) {
                    e.GoogleAnalyticsObject = s;
                    e[s] = e[s] || function() {
                        (e[s].q = e[s].q || []).push(arguments)
                    }
                    ;
                    e[s].l = 1 * new Date;
                    r = t.createElement(a);
                    n = t.getElementsByTagName(a)[0];
                    r.async = 1;
                    r.src = i;
                    n.parentNode.insertBefore(r, n)
                }(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga"),
                ga("create", "UA-36494583-11", "auto"),
                ga("send", "pageview"));
                var ke = ge[p(0, Math.max(0, ge.length - 1 - 1))], Me = 0, ve = fe[ke][Me], ke = ve.region, Te = ve, xe = [], _e = !1, De = !1, Se, Ee = .175, Ue = "#3FBA54", Be = "#f7f7f7", Ce = "#09992F", Ne = "#007ec0", Oe = "grey", Re = "#4E66E4", We = "#ff6000", Fe = "#5e69a0", He = Fe, je = "#c8b745", Ge = "#F35F53", ze = "#CF6259", Le = "#FF911E", Xe = "#C67019", Ye = "#EF3C31", Ve = "#4AE05E", Je = "#8C9688", qe = 1, Ke = 2, Ze = 3, Qe = 4, $e = 5, et = 6, tt = 7, at = 8, it = 9, st = 10, rt = 11, nt = 12, ht = 13, lt = 14, ot = 15, dt = 16, ct = 17, gt = 18, ft = 19, pt = 20, mt = 21, bt = 22, ut = 23, yt = 24, wt = 25, Pt = 26, At = 27, It = 28, kt = 29, Mt = 30, vt = 31, Tt = 32, xt = 33, _t = 34, Dt = 35, St = 36, Et = 37, Ut = 38, Bt = 39, Ct = 40, Nt = 41, Ot = 42, Rt = 43, Wt = 44, Ft = 45, Ht = 46, jt = 47, Gt = 48, zt = 49, Lt = 50, Xt = 51, Yt = 52, Vt = 53, Jt = 54, qt = 55, Kt = 56, Zt = 57, Qt = 58, $t = 59, ea = 60, ta = 61, aa = 1, ia = 2, sa = 3, ra = 4, na = 5, ha = 6, la = 7, oa = 8, da = 9, ca = 10, fa = 11, pa = 12, ma = 13, ba = 14, ua = 15, ya = 16, wa = 17, Pa = 18, Aa = 19, Ia = 20, ka = 21, Ma = 22, va = 23, Ta = 24, xa = 25, _a = 26, Da = 27, Sa = 28, Ea = 29, Ua = 30, Ba = 31, Ca = 32, Na = 33, Oa = 34, Ra = 35, Wa = 36, Fa = 37, Ha = 38, ja = 39, Ga = 40, za = 42, La = 44, Xa = 46, Ya = 47, Va = 48, Ja = 49, qa = 50, Ka = 51, Za = 52, Qa = 53, $a = 54, ei = 55, ti = 56, ai = 57, ii = 58, si = 59, ri = 60, ni = 61, hi = 62, li = 63, oi = 64, di = 65, ci = 100, gi = 0, fi = 3, pi = 4, mi = 5, bi = 11, ui = 12, yi = 14, wi = 15, Pi = 18, Ai = 20, Ii = 21, ki = 22, Mi = 23, vi = 28, Ti = 31, xi = 32, _i = 33, Di = 34, Si = 35, Ei = 36, Ui = 37, Bi = 39, Ci = 40, Ni = 41, Oi = 42, Ri = 43, Wi = 46, Fi = 47, Hi = 48, ji = 49, Gi = 51, zi = 1, Li = 0, Xi = 1, Yi = 2, Vi = document.getElementById("gCanvas"), Ji = null, qi = null, Ki = Vi.getContext("2d");
                Ki.shadowColor = "black";
                var Zi = Math.min(window.devicePixelRatio, 2)
                  , Qi = 1 == ("ontouchstart"in window || navigator.maxTouchPoints);
                Qi && console.log("mobile touch device detected!");
                loadedAudio = {};
                var $i = null, es = "", ts = "audio/music_game.mp3", as = function() {
                    var e = document.getElementById("button_mute_img");
                    if (e) {
                        e.src = vs ? "img/sound_off.png" : "img/sound_on.png";
                        for (var t in loadedAudio)
                            loadedAudio.hasOwnProperty(t) && (loadedAudio[t].muted = vs);
                        !vs && es && null == $i && g(es)
                    }
                }, is = camzoom_n = 2.7, is = 1, ss = camy = camx_n = camy_n = camx_o = camy_o = 0, rs = 1, ns = 0, hs = 0, ls = 0, os = 0, ds = 0, cs = 0, gs = !1, fs = !1, ps, ms, bs = 0, us = 0;
                gameMode = 1;
                loadedImgs = {};
                abbreviate_number = function(e, t) {
                    if (null === e)
                        return null;
                    if (0 === e)
                        return "0";
                    t = !t || 0 > t ? 0 : t;
                    var a = e.toPrecision(2).split("e")
                      , a = 1 === a.length ? 0 : Math.floor(Math.min(a[1].slice(1), 14) / 3)
                      , i = 1 > a ? e.toFixed(0 + t) : (e / Math.pow(10, 3 * a)).toFixed(2);
                    return (0 > i ? i : Math.abs(i)) + ["", "K", "M", "B", "T"][a]
                }
                ;
                A.prototype = {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0,
                    visible: !0,
                    buttonTXT: null,
                    pressed: !1,
                    pressedTouchID: -1,
                    touchEnabled: !0,
                    testPosHitsButton: function(e, t) {
                        return e < this.x - this.w / 2 || e > this.x + this.w / 2 ? !1 : t < this.y - this.w / 2 || t > this.y + this.w / 2 ? !1 : !0
                    },
                    setPosAndSize: function(e, t, a, i, s, r) {
                        this.w = a;
                        this.h = i;
                        this.x = e + a * (.5 - s);
                        this.y = t + i * (.5 - r)
                    },
                    onButtonTouchStart: function() {},
                    onButtonTouchEnd: function() {}
                };
                var ys = function() {
                    this.buttonTXT = new I(10,"white");
                    this.buttonTXT.renderScale = 1.5;
                    this.isMiniRechargeBut = !1;
                    this.abil_Type = 0;
                    this.abil_possible = this.abil_usable = this.abil_recharging = this.abil_active = !1;
                    this.abil_avilableA = this.abil_rechargeBarA = this.abil_rechargeTotalT = this.abil_rechargeEndT = 0;
                    this.draw = function() {
                        if (this.visible && (this.abil_rechargeBarA += .1 * ((this.abil_recharging ? 1 : 0) - this.abil_rechargeBarA),
                        this.abil_avilableA += .1 * ((this.abil_usable || this.abil_active ? 1 : .2) - this.abil_avilableA),
                        this.isMiniRechargeBut && (this.h = .6 * this.w),
                        this.abil_possible)) {
                            Ki.save();
                            this.isMiniRechargeBut ? (this.h = .8 * this.w,
                            Ki.translate(this.x, this.y + .36 * this.h),
                            Ki.scale(.65, .65)) : Ki.translate(this.x, this.y);
                            var e = .2 * this.abil_avilableA
                              , t = this.pressed || fs ? "#CECECE" : "#000000";
                            this.abil_active && (t = Ve,
                            e = .7);
                            Ki.fillStyle = t;
                            Ki.globalAlpha = 1 * e;
                            Ki.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h);
                            switch (this.abil_Type) {
                            case xi:
                                e = "Tail Slap";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case Ti:
                                e = "Trunk Hit";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case ci:
                                e = "Dive";
                                t = "img/ability_dive.png";
                                break;
                            case 25:
                                e = "Dig For Food";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case 2:
                                e = "Shell";
                                t = "skins/" + W(Ss).skinName + "2.png";
                                break;
                            case Ii:
                                e = "Bite Drag";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case Ei:
                                e = "Suffocate prey";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case 7:
                                e = "Disguise";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case ki:
                                e = "Burrow Hole";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case Mi:
                                e = "Pull from Hole";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case 9:
                                e = "Charge";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case 17:
                                e = "Roll snow";
                                t = "img/snowball.png";
                                break;
                            case Di:
                                e = "Venom Spit";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case Si:
                                e = "Spin Web";
                                t = "img/spiderWeb.png";
                                break;
                            case 13:
                                e = "Throw Snow";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case 16:
                                e = "Drop Snow";
                                t = "img/snowball.png";
                                break;
                            case Pi:
                                e = "Loud Noise";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case yi:
                                e = "Claw Slash";
                                t = "img/ability_claw.png";
                                break;
                            case pi:
                                e = "Ink";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case fi:
                                e = "Shock";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case 1:
                                e = "Hold to Dig";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case ui:
                                e = "Howl";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case 24:
                                e = "Throw Banana";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case vi:
                                e = "Cause Wave";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case wi:
                                e = "Extra Boost";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case 8:
                                e = "Slide on ice";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case 10:
                                e = "Inflate";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case ji:
                                e = "Spikes";
                                t = "skins/" + W(Ss).skinName + "2.png";
                                break;
                            case 19:
                                e = "Fire";
                                t = "img/fire.png";
                                break;
                            case 30:
                                e = "Fire";
                                t = "img/fire.png";
                                break;
                            case Gi:
                                e = "Arm Smash";
                                t = "img/ability_crabSmashSkin.png";
                                break;
                            case Ui:
                                e = "Jaws Bite";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case Wi:
                                e = "Jaws Bite";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case 38:
                                e = "Ambush Attack";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case Oi:
                                e = "Stomp";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case Fi:
                                e = "Fly with prey";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            case Hi:
                                e = "Stink";
                                t = "skins/" + W(Ss).skinName + ".png";
                                break;
                            default:
                                e = "Ability",
                                t = "skins/" + W(Ss).skinName + ".png"
                            }
                            if (t = f(t)) {
                                var a = .4 * this.w;
                                Ki.globalAlpha = 1 * this.abil_avilableA;
                                Ki.drawImage(t, -a, .85 * -a, 2 * a, 2 * a)
                            }
                            this.buttonTXT.setText(e);
                            this.buttonTXT.setFontSize(15 * Zi);
                            this.buttonTXT.x = 0;
                            this.buttonTXT.y = .35 * -this.w;
                            this.buttonTXT.draw();
                            e = Math.max(0, this.abil_rechargeEndT - Ur);
                            this.abil_rechargeBarA += .1 * ((this.abil_recharging ? 1 : 0) - this.abil_rechargeBarA);
                            .01 < this.abil_rechargeBarA && (Ki.globalAlpha = .35 * this.abil_rechargeBarA,
                            Ki.fillStyle = "#000000",
                            t = .8 * this.w,
                            a = .5 * this.h,
                            Ki.fillRect(0 - t / 2, 0 - a / 2, t, a),
                            Ki.globalAlpha = 1 * this.abil_rechargeBarA,
                            Ki.fillStyle = "#F3C553",
                            Ki.fillRect(0 - t / 2, 0 - a / 2, e / this.abil_rechargeTotalT * t, a));
                            Ki.restore()
                        }
                    }
                };
                ys.prototype = Object.create(A.prototype);
                I.prototype = {
                    strokeW: 1,
                    strokeColor: "#000000",
                    multiLine: !1,
                    _text: "",
                    _color: "#000000",
                    x: 0,
                    y: 0,
                    _fntSize: 16,
                    _canvas: null,
                    _ctx: null,
                    _dirty: !1,
                    renderScale: 1.5,
                    _scale: 1,
                    width: 0,
                    height: 0,
                    setColor: function(e) {
                        this._color != e && (this._color = e,
                        this._dirty = !0)
                    },
                    setFontSize: function(e) {
                        this._fntSize != e && (this._fntSize = e,
                        this._dirty = !0)
                    },
                    setText: function(e) {
                        e != this._text && (this._text = e,
                        this._dirty = !0)
                    },
                    getRenderedCanvas: function() {
                        null == this._canvas && (this._canvas = document.createElement("canvas"),
                        this._ctx = this._canvas.getContext("2d"));
                        if (this._dirty) {
                            this._dirty = !1;
                            var e = this._canvas
                              , t = this._ctx
                              , a = this._text
                              , i = this._scale
                              , s = this._fntSize * this.renderScale
                              , r = s + "px Arial";
                            t.font = r;
                            var n = ~~(.2 * s);
                            t.font = r;
                            if (this.multiLine) {
                                for (var h = 1.2 * t.measureText("M").width, a = a.split("\n"), l = 0, o = 0; o < a.length; ++o)
                                    l = Math.max(l, t.measureText(a[o]).width);
                                this.width = (l + 6) * i;
                                this.height = (h * a.length + n) * i;
                                e.width = this.width;
                                e.height = this.height;
                                this.width /= this.renderScale;
                                this.height /= this.renderScale;
                                t.globalAlpha = 1;
                                t.font = r;
                                0 < this.strokeW && (t.shadowOffsetX = this.strokeW,
                                t.shadowOffsetY = this.strokeW,
                                t.shadowColor = this.strokeColor);
                                t.fillStyle = this._color;
                                t.textAlign = "center";
                                e = 3 + e.width / 2;
                                s -= n / 2;
                                for (o = 0; o < a.length; ++o)
                                    t.fillText(a[o], e, s),
                                    s += h
                            } else
                                this.width = (t.measureText(a).width + 6) * i,
                                this.height = (s + n) * i,
                                e.width = this.width,
                                e.height = this.height,
                                this.width /= this.renderScale,
                                this.height /= this.renderScale,
                                t.globalAlpha = 1,
                                t.font = r,
                                0 < this.strokeW && (t.shadowOffsetX = this.strokeW,
                                t.shadowOffsetY = this.strokeW,
                                t.shadowColor = this.strokeColor),
                                t.fillStyle = this._color,
                                t.fillText(a, 3, s - n / 2)
                        }
                        return this._canvas
                    },
                    draw: function() {
                        if (this._text) {
                            var e = this.renderScale
                              , t = this.getRenderedCanvas()
                              , a = t.width / e
                              , e = t.height / e;
                            Ki.drawImage(t, this.x - a / 2, this.y - e / 2, a, e)
                        }
                    }
                };
                k.prototype = {
                    id: 0,
                    oType: Ia,
                    spawnTime: 0,
                    rPer: 0,
                    updateTime: 0,
                    x: 0,
                    y: 0,
                    ox: 0,
                    oy: 0,
                    nx: 0,
                    ny: 0,
                    rad: 0,
                    oRad: 0,
                    nRad: 0,
                    angle: 0,
                    oAngle: 0,
                    angleDelta: 0,
                    z: 0,
                    name: "",
                    dead: !1,
                    type: 0,
                    curBiome: 0,
                    isRectangle: !1,
                    rectW: 0,
                    rectH: 0,
                    toString: function() {
                        return "[GObj t=" + this.oType + " id=" + this.id + "]"
                    }
                };
                M.prototype = {
                    objs: [],
                    z: 0,
                    id: 0,
                    oType: 0,
                    updateZ: function() {
                        0 < this.objs.length && (this.objs[0].updateZ(),
                        this.z = this.objs[0].z)
                    },
                    draw: function() {
                        for (var e = 0; e < this.objs.length; e++) {
                            var t = this.objs[e];
                            t.draw(!0)
                        }
                        for (e = 0; e < this.objs.length; e++)
                            t = this.objs[e],
                            t.draw(!1)
                    },
                    addBatchedObj: function(e) {
                        0 == this.objs.length && (this.oType = e.oType,
                        this.objs = []);
                        this.objs.push(e)
                    }
                };
                var ws = 0
                  , Ps = !1
                  , As = !1
                  , Is = !1
                  , ks = !1
                  , Ms = !1
                  , vs = !1;
                if (window.localStorage) {
                    Ps = 0 < window.localStorage.getItem("options_noImages") + 0;
                    document.getElementById("options_noImages").checked = Ps;
                    As = 0 < window.localStorage.getItem("options_noNames") + 0;
                    document.getElementById("options_noNames").checked = As;
                    Is = 0 < window.localStorage.getItem("options_lowGraphics") + 0;
                    document.getElementById("options_lowGraphics").checked = Is;
                    ks = 0 < window.localStorage.getItem("options_noJoystick") + 0;
                    document.getElementById("options_noJoystick").checked = ks;
                    ks = 0 < window.localStorage.getItem("options_noJoystick") + 0;
                    document.getElementById("options_noJoystick").checked = ks;
                    var Ms = 0 < window.localStorage.getItem("options_leftHanded") + 0
                      , Ts = document.getElementById("options_leftHanded");
                    Ts && (Ts.checked = Ms);
                    vs = 0 < window.localStorage.getItem("options_muted") + 0;
                    as()
                }
                var xs = 0
                  , _s = +new Date
                  , Ds = 0
                  , Ss = qe
                  , Es = !1
                  , Us = !1
                  , Bs = !1
                  , Cs = +new Date
                  , Ns = !1
                  , Os = !1
                  , Rs = waterBarPerc_n = 100
                  , Ws = xp = xpPer = 0
                  , Fs = new I(16,"white")
                  , Hs = new I(16,"white")
                  , js = new I(16,"white")
                  , Gs = new I(10,"white");
                js.multiLine = !0;
                js.renderScale = 1;
                Gs.renderScale = 1;
                var zs = ""
                  , Ls = []
                  , Xs = new ys;
                Xs.onButtonTouchStart = function() {
                    J(en, !0)
                }
                ;
                Xs.onButtonTouchEnd = function() {
                    J(en, !1);
                    Vs.pressed && -1 == Vs.pressedTouchID && (Vs.pressed = !1,
                    J($r, !1))
                }
                ;
                Ls.push(Xs);
                var Ys = new ys;
                Ys.isMiniRechargeBut = !0;
                Ys.touchEnabled = !1;
                Ls.push(Ys);
                var Vs = new A("RUN");
                Vs.onButtonTouchStart = function() {
                    J($r, !0)
                }
                ;
                Vs.onButtonTouchEnd = function() {
                    J($r, !1)
                }
                ;
                Ls.push(Vs);
                var Js = new A("CHAT");
                Js.onButtonTouchStart = function() {
                    Y()
                }
                ;
                Ls.push(Js);
                var qs = new A("S");
                qs.onButtonTouchStart = function() {
                    J(sn, !0)
                }
                ;
                Ls.push(qs);
                var Ks = new A("DOWN↓");
                Ks.onButtonTouchStart = function() {
                    J(an, !0)
                }
                ;
                Ls.push(Ks);
                var Zs = !1
                  , Qs = -1
                  , $s = 0
                  , er = 0
                  , tr = 0
                  , ar = 0
                  , ir = 0
                  , sr = 0
                  , rr = 0;
                joystickDistF_n = joystickDistF = 0;
                var nr = 100
                  , hr = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0)
                  , lr = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0)
                  , or = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0)
                  , dr = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0)
                  , cr = !1
                  , gr = []
                  , fr = {}
                  , pr = []
                  , mr = !1
                  , br = 0
                  , ur = 1
                  , yr = !1
                  , wr = 0
                  , Pr = 1
                  , Ar = !1
                  , Ir = +new Date;
                c("audio/click.mp3");
                var kr = +Date.now(), Mr;
                V();
                Q();
                var vr = null;
                if (Ie)
                    for (Ie = Ie.replace(/\W/g, "").toUpperCase(),
                    pe = 0; pe < ce.length; pe++) {
                        var Tr = ce[pe]
                          , xr = Tr.name.toUpperCase()
                          , xr = xr.replace(/\W/g, "");
                        if (xr == Ie) {
                            vr = Tr;
                            break
                        }
                    }
                vr ? (console.log("Connecting to URL server..."),
                D(vr)) : n();
                var _r = !1;
                (function() {
                    var e = "https:" === window.location.protocol ? "wss://" : "ws://";
                    masterWs = new WebSocket(e + "master1.mope.io:" + ("wss://" == e ? 7501 : 7500));
                    masterWs.binaryType = "arraybuffer";
                    masterWs.onopen = function() {
                        var e = new x(1);
                        e.writeUInt8(200);
                        masterWs.send(e.dataView.buffer)
                    }
                    ;
                    masterWs.onmessage = function(e) {
                        e = new T(new DataView(e.data));
                        if (100 == e.readUInt8()) {
                            _r = !0;
                            var t = e.readUInt32();
                            console.log("MasterServer: " + t + " total players online!");
                            Gs.setText(y(t) + " players");
                            for (var t = e.readUInt16(), a = 0; a < t; a++) {
                                var i;
                                i = e.readUInt32();
                                for (var s = i % 256, r = 3; 0 < r; r--)
                                    i = Math.floor(i / 256),
                                    s = i % 256 + "." + s;
                                i = s;
                                s = e.readUInt16();
                                for (r = 0; r < ce.length; r++)
                                    if (ce[r].ip == i) {
                                        ce[r].playersCount = 6e4 == s ? -1 : s;
                                        break
                                    }
                            }
                        }
                        U();
                        E()
                    }
                    ;
                    masterWs.onerror = function(e) {
                        console.log("MasterServer: error connecting!")
                    }
                    ;
                    masterWs.onclose = function(e) {
                        console.log("Disconnected from master server!")
                    }
                }
                )();
                var Dr = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
                  , Sr = -1 < navigator.userAgent.toLowerCase().indexOf("android");
                if ((Dr || Sr) && !ye) {
                    var Er = !1;
                    if (window.localStorage) {
                        Er = 0 < window.localStorage.getItem("oldVisitor");
                        try {
                            window.localStorage.setItem("oldVisitor", 1)
                        } catch (e) {
                            Er = !0
                        }
                    }
                    Er || (Dr ? window.location.href = "https://itunes.apple.com/us/app/mope.io/id1086471119?ls=1&mt=8" : Sr && (window.location.href = "https://play.google.com/store/apps/details?id=tatarnykov.stan.mopeioandroid"))
                }
                document.getElementById("serverSelect").onchange = function() {
                    Me = document.getElementById("serverSelect").selectedIndex - 1;
                    ve = fe[ke][Me];
                    S();
                    console.log("Server changed...");
                    O() && Mr.close();
                    document.getElementById("spawnXpLabel").style.opacity = 0;
                    partyLinkKey = partyLinkIP = null;
                    D(ve)
                }
                ;
                document.getElementById("regionSelect").onchange = function() {
                    console.log("Region changed...");
                    var e = document.getElementById("regionSelect").selectedIndex - 1;
                    ke = ge[e];
                    O() && Mr.close();
                    document.getElementById("spawnXpLabel").style.opacity = 0;
                    l()
                }
                ;
                var Ur = +new Date
                  , kr = +new Date
                  , Br = 250
                  , Cr = 250
                  , Nr = "Ready to survive!"
                  , Or = "white"
                  , Rr = +new Date + 0
                  , Wr = +new Date + 0
                  , Fr = 0
                  , Hr = !1
                  , jr = !1
                  , Gr = 0
                  , zr = []
                  , Lr = !1
                  , Xr = 0
                  , Yr = 0;
                window.requestAnimationFrame ? window.requestAnimationFrame(L) : setInterval(draw, 1e3 / 60);
                document.getElementById("startButton").onclick = function() {
                    Z();
                    var e = c("audio/click.mp3");
                    if (e)
                        try {
                            e.play()
                        } catch (e) {}
                    !on && Us && (te() ? ($i && ($i.volume = .2),
                    on = !0,
                    document.getElementById("startMenuWrapper").style.display = "none",
                    cn = !0,
                    gn = !1,
                    dn ? adplayer.startPreRoll() : (document.getElementById("pvVidContainer").style.display = "block",
                    re())) : X(!1))
                }
                ;
                var Vr = document.getElementById("button_GMsandbox");
                Vr && (Vr.onclick = function() {}
                );
                if (Vr = document.getElementById("button_GMnormal"))
                    Vr.onclick = function() {}
                    ;
                if (Vr = document.getElementById("button_mute"))
                    Vr.onclick = function() {
                        vs = !vs;
                        as();
                        try {
                            window.localStorage.setItem("options_muted", vs ? 1 : 0)
                        } catch (e) {}
                    }
                    ;
                document.getElementById("settingsButton").onclick = function() {
                    var e = document.getElementById("optionsDiv");
                    e.style.display = "block" == e.style.display ? "none" : "block";
                    if (e = c("audio/click.mp3"))
                        try {
                            e.play()
                        } catch (e) {}
                }
                ;
                document.getElementById("closeBut").onclick = function() {
                    var e = document.getElementById("optionsDiv");
                    e.style.display = "block" == e.style.display ? "none" : "block";
                    if (e = c("audio/click.mp3"))
                        try {
                            e.play()
                        } catch (e) {}
                }
                ;
                document.getElementById("options_noImages").onchange = function() {
                    if (window.localStorage) {
                        Ps = document.getElementById("options_noImages").checked;
                        try {
                            window.localStorage.setItem("options_noImages", Ps ? 1 : 0)
                        } catch (e) {}
                        console.log("options_noimages: saved as " + window.localStorage.getItem("options_noImages"))
                    }
                }
                ;
                document.getElementById("options_noNames").onchange = function() {
                    if (window.localStorage) {
                        As = document.getElementById("options_noNames").checked;
                        try {
                            window.localStorage.setItem("options_noNames", As ? 1 : 0)
                        } catch (e) {}
                        console.log("options_noNames: saved as " + window.localStorage.getItem("options_noNames"))
                    }
                }
                ;
                document.getElementById("options_lowGraphics").onchange = function() {
                    if (window.localStorage) {
                        Is = document.getElementById("options_lowGraphics").checked;
                        try {
                            window.localStorage.setItem("options_lowGraphics", Is ? 1 : 0)
                        } catch (e) {}
                        V();
                        console.log("options_lowGraphics: saved as " + window.localStorage.getItem("options_lowGraphics"))
                    }
                }
                ;
                document.getElementById("options_noJoystick").onchange = function() {
                    if (window.localStorage) {
                        ks = document.getElementById("options_noJoystick").checked;
                        try {
                            window.localStorage.setItem("options_noJoystick", ks ? 1 : 0)
                        } catch (e) {}
                        V();
                        console.log("options_noJoystick: saved as " + window.localStorage.getItem("options_noJoystick"))
                    }
                }
                ;
                var Jr = document.getElementById("options_leftHanded");
                Jr && (Jr.onchange = function() {
                    if (window.localStorage) {
                        Ms = Jr.checked;
                        try {
                            window.localStorage.setItem("options_leftHanded", Ms ? 1 : 0)
                        } catch (e) {}
                        V();
                        console.log("options_leftHanded: saved as " + window.localStorage.getItem("options_leftHanded"))
                    }
                }
                );
                var qr = !1
                  , Kr = !1;
                document.onkeydown = function(e) {
                    Z();
                    var t = e.keyCode || e.which;
                    if (!qr && Es)
                        switch (t) {
                        case 32:
                            e.preventDefault();
                            J($r, !0);
                            break;
                        case 87:
                            e.preventDefault();
                            J(en, !0);
                            break;
                        case 83:
                            e.preventDefault(),
                            J(sn, !0)
                        }
                }
                ;
                document.onkeyup = function(e) {
                    var t = e.keyCode || e.which;
                    if (13 == t) {
                        if (!Es && !jr) {
                            document.getElementById("startButton").click();
                            return
                        }
                        if (jr) {
                            P(zr[0]);
                            return
                        }
                    }
                    if (Es)
                        if (t = e.keyCode || e.which,
                        13 == t)
                            Y();
                        else if (!qr && Es)
                            switch (t) {
                            case 32:
                                e.preventDefault();
                                J($r, !1);
                                break;
                            case 87:
                                e.preventDefault();
                                J(en, !1);
                                break;
                            case 38:
                                e.preventDefault();
                                J(tn, !1);
                                break;
                            case 40:
                                e.preventDefault(),
                                J(an, !1)
                            }
                }
                ;
                window.onresize = V;
                var Zr = 100
                  , Qr = 100
                  , $r = 1
                  , en = 2
                  , tn = 3
                  , an = 4
                  , sn = 5;
                Vi.addEventListener("gesturestart", function(e) {
                    e.preventDefault()
                });
                Vi.ontouchstart = function(e) {
                    Z();
                    if (1 == e.touches.length) {
                        console.log("Resetting all buttons (joytick bug fix)");
                        for (var t = 0; t < Ls.length; t++) {
                            var a = Ls[t];
                            a.pressed = !1;
                            a.pressedTouchID = -1
                        }
                        Zs = !1
                    }
                    if (Es) {
                        for (t = 0; t < e.changedTouches.length; t++)
                            for (var a = e.changedTouches[t], i = 0; i < Ls.length; i++) {
                                var s = Ls[i];
                                if (s.testPosHitsButton(a.clientX * Zi, a.clientY * Zi) && !s.pressed && s.touchEnabled) {
                                    e.preventDefault();
                                    s.pressed = !0;
                                    s.pressedTouchID = a.identifier;
                                    s.onButtonTouchStart();
                                    return
                                }
                            }
                        ks || Zs ? (ns = e.touches[0].clientX * Zi,
                        hs = e.touches[0].clientY * Zi,
                        q()) : (a = e.changedTouches[0],
                        Zs = !0,
                        $s = a.clientX * Zi,
                        er = a.clientY * Zi,
                        tr = $s,
                        ar = er,
                        Qs = a.identifier)
                    }
                }
                ;
                Vi.ontouchmove = function(e) {
                    Z();
                    e.preventDefault();
                    for (var t = 0; t < e.changedTouches.length; t++) {
                        var a = e.changedTouches[t];
                        if (a.identifier == Xs.pressedTouchID) {
                            if (-1 == Vs.pressedTouchID) {
                                var i = Vs.testPosHitsButton(a.clientX * Zi, a.clientY * Zi)
                                  , a = Vs.pressed;
                                (Vs.pressed = i) && !a ? J($r, !0) : !i && a && J($r, !1)
                            }
                        } else if (ks)
                            ns = a.clientX * Zi,
                            hs = a.clientY * Zi,
                            q();
                        else if (Zs && a.identifier == Qs) {
                            var i = a.clientX * Zi - $s
                              , a = a.clientY * Zi - er
                              , s = Math.sqrt(i * i + a * a);
                            if (0 < s) {
                                var i = i / s
                                  , a = a / s
                                  , s = Math.min(1, s / (50 * Zi))
                                  , r = Math.pow(s, 3);
                                .1 > r && (r = 0);
                                r *= 300 * Zi;
                                rr = u(sr, Math.atan2(a, i));
                                joystickDistF_n = s;
                                tr = $s + 50 * Zi * i * s;
                                ar = er + 50 * Zi * a * s;
                                ns = ps / 2 + i * r;
                                hs = ms / 2 + a * r;
                                q()
                            }
                        }
                    }
                }
                ;
                Vi.ontouchend = function(e) {
                    for (var t = 0; t < e.changedTouches.length; t++) {
                        var a = e.changedTouches[t];
                        if (Zs && a.identifier == Qs)
                            Zs = !1,
                            Qs = -1;
                        else
                            for (var i = 0; i < Ls.length; i++) {
                                var s = Ls[i];
                                if (s.pressed && s.pressedTouchID == a.identifier && s.touchEnabled) {
                                    s.pressed = !1;
                                    s.pressedTouchID = -1;
                                    if (Es)
                                        s.onButtonTouchEnd();
                                    return
                                }
                            }
                    }
                }
                ;
                Vi.ontouchcancel = function(e) {
                    console.log("touch cancel");
                    Vi.ontouchend(e)
                }
                ;
                Vi.ontouchleave = function(e) {
                    console.log("touch leave")
                }
                ;
                Vi.onmousemove = function(e) {
                    ns = e.clientX * Zi;
                    hs = e.clientY * Zi;
                    q();
                    Ns || Z();
                    if (jr && 650 < Ur - Xr)
                        for (var t = 0; t < zr.length; t++) {
                            var a = zr[t];
                            a.isHighLighted = a.testPosHitsButton(ns, hs)
                        }
                    e.preventDefault()
                }
                ;
                Vi.onmousedown = function(e) {
                    Z();
                    1 == e.which && J($r, !0);
                    3 == e.which && J(en, !0);
                    e.preventDefault()
                }
                ;
                Vi.onmouseup = function(e) {
                    if (1 == e.which && (J($r, !1),
                    jr && 650 < Ur - Xr)) {
                        ns = e.clientX * Zi;
                        hs = e.clientY * Zi;
                        for (var t = 0; t < zr.length; t++) {
                            var a = zr[t];
                            if (a.testPosHitsButton(ns, hs)) {
                                P(a);
                                break
                            }
                        }
                    }
                    3 == e.which && J(en, !1);
                    e.preventDefault()
                }
                ;
                Vi.onblur = function(e) {
                    J($r, !1);
                    J(en, !1)
                }
                ;
                window.onfocus = function(e) {
                    Z()
                }
                ;
                window.onmouseout = function(e) {
                    null == e.toElement && null == e.relatedTarget && (J($r, !1),
                    J(en, !1))
                }
                ;
                document.oncontextmenu = document.body.oncontextmenu = function() {
                    return !Es
                }
                ;
                setInterval(K, 20);
                setInterval(function() {
                    +new Date - Cs > 6e4 * (Es ? 2400 : 10) && !Ns && Us && (console.log("Disconnected for afk..."),
                    Ns = !0,
                    O() && Mr.close())
                }, 5e3);
                window.onload = function() {
                    V();
                    if (window.localStorage) {
                        var e = document.getElementById("nickInput");
                        e.value = window.localStorage.getItem("nick");
                        e.setSelectionRange(0, e.value.length);
                        Qi || e.focus()
                    }
                }
                ;
                var rn;
                be && $(function(e) {
                    rn = e;
                    e.registerHandler("testJavascriptHandler", function(e, t) {
                        console.log("ObjC called testJavascriptHandler with", e);
                        t({
                            "Javascript Says": "Right back atcha!"
                        })
                    })
                });
                var nn = 0
                  , hn = 0;
                if (window.localStorage)
                    var ln = 1 * window.localStorage.getItem("lastAdShowT") || 0
                      , hn = 0 < +new Date - ln ? ln : 0
                      , nn = 1 * window.localStorage.getItem("gamesSinceAd");
                var on = !1
                  , dn = !1
                  , cn = !1
                  , gn = !1
                  , fn = new I(10,"white");
                fn.setText("Connecting...");
                fn.renderScale = 1;
                ye || ae();
                var pn = !1
                  , mn = null
                  , bn = "player-2";
                this.onBoltLoaded = function(e) {
                    console.log("onBoltLoaded: playerName '" + e + "'");
                    clearTimeout(mn);
                    Bolt.on(e, "showHiddenContainer", function() {
                        console.log("BOLT showHiddenContainer fired");
                        ie(pn)
                    });
                    Bolt.on(e, Bolt.BOLT_AD_STARTED, function() {
                        console.log("AD STARTED: SUCCESS");
                        pn = gn = !0
                    });
                    Bolt.on(e, Bolt.BOLT_AD_ERROR, function() {
                        console.log("AD ERROR EVENT FIRED");
                        ie(pn)
                    })
                }
                ;
                var un = []
                  , yn = 25;
                Vi.addEventListener ? (Vi.addEventListener("mousewheel", oe, !1),
                Vi.addEventListener("DOMMouseScroll", oe, !1)) : Vi.attachEvent("onmousewheel", oe);
                var wn = 0
            }
            ).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {})
        }
        , {
            "./objs/TestObj": 2,
            "./objs/TestObjBerry": 3
        }],
        2: [function(e, t, a) {
            function i(e, t) {
                this.id = e;
                this.oType = t
            }
            i.prototype = {
                id: -1,
                oType: 0,
                draw: function() {
                    console.log("Drawing generic TestObj, id = " + this.id)
                },
                describeObj: function() {
                    console.log("obj is of type " + this.oType)
                }
            };
            t.exports = i
        }
        , {}],
        3: [function(e, t, a) {
            (function(e) {
                function a(e) {
                    i.call(this, e, 100);
                    console.log("creating BERRY obj, id is " + this.id)
                }
                var i = e.TestObj;
                a.prototype = Object.create(i.prototype);
                a.prototype.constructor = a;
                a.prototype.draw = function() {
                    console.log("Drawing BERRY TestObj, id = " + this.id)
                }
                ;
                a.prototype.subclassMethod = function() {
                    console.log("New subclass method!")
                }
                ;
                t.exports = a
            }
            ).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {})
        }
        , {}]
    }, {}, [1])
}
)();
