(() => {
  // output-es/runtime.js
  function binding(init) {
    let state = 0;
    let value2;
    return () => {
      if (state === 2) {
        return value2;
      }
      if (state === 1) {
        throw new Error("Binding demanded before initialized");
      }
      state = 1;
      value2 = init();
      state = 2;
      return value2;
    };
  }
  function fail() {
    throw new Error("Failed pattern match");
  }
  function intDiv(x2, y2) {
    if (y2 > 0)
      return Math.floor(x2 / y2);
    if (y2 < 0)
      return -Math.floor(x2 / -y2);
    return 0;
  }

  // output-es/Control.Monad.Logger.Trans/index.js
  var bindLoggerT = (dictMonad) => ({ bind: (v) => (f2) => (l2) => dictMonad.Bind1().bind(v(l2))((x2) => f2(x2)(l2)), Apply0: () => applyLoggerT(dictMonad) });
  var applyLoggerT = (dictMonad) => {
    const $0 = dictMonad.Bind1().Apply0().Functor0();
    const functorLoggerT1 = {
      map: (x2) => {
        const $1 = $0.map(x2);
        return (v) => (x$1) => $1(v(x$1));
      }
    };
    return {
      apply: (() => {
        const $1 = bindLoggerT(dictMonad);
        return (f2) => (a2) => $1.bind(f2)((f$p) => $1.bind(a2)((a$p) => applicativeLoggerT(dictMonad).pure(f$p(a$p))));
      })(),
      Functor0: () => functorLoggerT1
    };
  };
  var applicativeLoggerT = (dictMonad) => ({
    pure: (x2) => {
      const $0 = dictMonad.Applicative0().pure(x2);
      return (v) => $0;
    },
    Apply0: () => applyLoggerT(dictMonad)
  });
  var monadAskLoggerT = (dictMonadAsk) => {
    const Monad0 = dictMonadAsk.Monad0();
    const monadLoggerT1 = { Applicative0: () => applicativeLoggerT(Monad0), Bind1: () => bindLoggerT(Monad0) };
    return {
      ask: (() => {
        const $0 = dictMonadAsk.ask;
        return (v) => $0;
      })(),
      Monad0: () => monadLoggerT1
    };
  };
  var monadEffectLoggerT = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const monadLoggerT1 = { Applicative0: () => applicativeLoggerT(Monad0), Bind1: () => bindLoggerT(Monad0) };
    return {
      liftEffect: (x2) => {
        const $0 = dictMonadEffect.liftEffect(x2);
        return (v) => $0;
      },
      Monad0: () => monadLoggerT1
    };
  };
  var monadAffLoggerT = (dictMonadAff) => {
    const monadEffectLoggerT1 = monadEffectLoggerT(dictMonadAff.MonadEffect0());
    return {
      liftAff: (x2) => {
        const $0 = dictMonadAff.liftAff(x2);
        return (v) => $0;
      },
      MonadEffect0: () => monadEffectLoggerT1
    };
  };

  // output-es/Control.Monad.Reader.Trans/index.js
  var withReaderT = (f2) => (v) => (x2) => v(f2(x2));
  var bindReaderT = (dictBind) => {
    const $0 = dictBind.Apply0();
    const $1 = $0.Functor0();
    const applyReaderT1 = (() => {
      const functorReaderT1 = {
        map: (x2) => {
          const $2 = $1.map(x2);
          return (v) => (x$1) => $2(v(x$1));
        }
      };
      return { apply: (v) => (v1) => (r2) => $0.apply(v(r2))(v1(r2)), Functor0: () => functorReaderT1 };
    })();
    return { bind: (v) => (k) => (r2) => dictBind.bind(v(r2))((a2) => k(a2)(r2)), Apply0: () => applyReaderT1 };
  };
  var monadReaderT = (dictMonad) => {
    const $0 = dictMonad.Applicative0();
    const $1 = $0.Apply0();
    const applicativeReaderT1 = (() => {
      const $2 = $1.Functor0();
      const functorReaderT1 = {
        map: (x2) => {
          const $3 = $2.map(x2);
          return (v) => (x$1) => $3(v(x$1));
        }
      };
      const applyReaderT1 = { apply: (v) => (v1) => (r2) => $1.apply(v(r2))(v1(r2)), Functor0: () => functorReaderT1 };
      return {
        pure: (x2) => {
          const $3 = $0.pure(x2);
          return (v) => $3;
        },
        Apply0: () => applyReaderT1
      };
    })();
    const bindReaderT1 = bindReaderT(dictMonad.Bind1());
    return { Applicative0: () => applicativeReaderT1, Bind1: () => bindReaderT1 };
  };
  var monadReaderReaderT = (dictMonad) => {
    const monadReaderT1 = monadReaderT(dictMonad);
    const monadAskReaderT1 = { ask: dictMonad.Applicative0().pure, Monad0: () => monadReaderT1 };
    return { local: withReaderT, MonadAsk0: () => monadAskReaderT1 };
  };
  var monadEffectReader = (dictMonadEffect) => {
    const monadReaderT1 = monadReaderT(dictMonadEffect.Monad0());
    return {
      liftEffect: (x2) => {
        const $0 = dictMonadEffect.liftEffect(x2);
        return (v) => $0;
      },
      Monad0: () => monadReaderT1
    };
  };
  var monadStateReaderT = (dictMonadState) => {
    const monadReaderT1 = monadReaderT(dictMonadState.Monad0());
    return {
      state: (x2) => {
        const $0 = dictMonadState.state(x2);
        return (v) => $0;
      },
      Monad0: () => monadReaderT1
    };
  };

  // output-es/Data.Ordering/index.js
  var $Ordering = (tag) => tag;
  var LT = /* @__PURE__ */ $Ordering("LT");
  var GT = /* @__PURE__ */ $Ordering("GT");
  var EQ = /* @__PURE__ */ $Ordering("EQ");
  var semigroupOrdering = {
    append: (v) => (v1) => {
      if (v === "LT") {
        return LT;
      }
      if (v === "GT") {
        return GT;
      }
      if (v === "EQ") {
        return v1;
      }
      fail();
    }
  };

  // output-es/Data.Log.Level/index.js
  var $LogLevel = (tag) => tag;
  var Debug = /* @__PURE__ */ $LogLevel("Debug");
  var Info = /* @__PURE__ */ $LogLevel("Info");
  var Warn = /* @__PURE__ */ $LogLevel("Warn");
  var eqLogLevel = {
    eq: (x2) => (y2) => {
      if (x2 === "Trace") {
        return y2 === "Trace";
      }
      if (x2 === "Debug") {
        return y2 === "Debug";
      }
      if (x2 === "Info") {
        return y2 === "Info";
      }
      if (x2 === "Warn") {
        return y2 === "Warn";
      }
      return x2 === "Error" && y2 === "Error";
    }
  };
  var ordLogLevel = {
    compare: (x2) => (y2) => {
      if (x2 === "Trace") {
        if (y2 === "Trace") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Trace") {
        return GT;
      }
      if (x2 === "Debug") {
        if (y2 === "Debug") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Debug") {
        return GT;
      }
      if (x2 === "Info") {
        if (y2 === "Info") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Info") {
        return GT;
      }
      if (x2 === "Warn") {
        if (y2 === "Warn") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Warn") {
        return GT;
      }
      if (x2 === "Error" && y2 === "Error") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqLogLevel
  };

  // output-es/Record.Unsafe/foreign.js
  var unsafeGet = function(label) {
    return function(rec) {
      return rec[label];
    };
  };
  var unsafeSet = function(label) {
    return function(value2) {
      return function(rec) {
        var copy = {};
        for (var key2 in rec) {
          if ({}.hasOwnProperty.call(rec, key2)) {
            copy[key2] = rec[key2];
          }
        }
        copy[label] = value2;
        return copy;
      };
    };
  };

  // output-es/Type.Proxy/index.js
  var $$$Proxy = () => ({ tag: "Proxy" });
  var $$Proxy = /* @__PURE__ */ $$$Proxy();

  // output-es/Data.Show/foreign.js
  var showIntImpl = function(n2) {
    return n2.toString();
  };
  var showNumberImpl = function(n2) {
    var str2 = n2.toString();
    return isNaN(str2 + ".0") ? str2 : str2 + ".0";
  };
  var showStringImpl = function(s2) {
    var l2 = s2.length;
    return '"' + s2.replace(
      /[\0-\x1F\x7F"\\]/g,
      // eslint-disable-line no-control-regex
      function(c2, i2) {
        switch (c2) {
          case '"':
          case "\\":
            return "\\" + c2;
          case "\x07":
            return "\\a";
          case "\b":
            return "\\b";
          case "\f":
            return "\\f";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
          case "	":
            return "\\t";
          case "\v":
            return "\\v";
        }
        var k = i2 + 1;
        var empty2 = k < l2 && s2[k] >= "0" && s2[k] <= "9" ? "\\&" : "";
        return "\\" + c2.charCodeAt(0).toString(10) + empty2;
      }
    ) + '"';
  };
  var showArrayImpl = function(f2) {
    return function(xs) {
      var ss = [];
      for (var i2 = 0, l2 = xs.length; i2 < l2; i2++) {
        ss[i2] = f2(xs[i2]);
      }
      return "[" + ss.join(",") + "]";
    };
  };

  // output-es/Data.Generic.Rep/index.js
  var $NoArguments = () => ({ tag: "NoArguments" });
  var $Product = (_1, _2) => ({ tag: "Product", _1, _2 });
  var $Sum = (tag, _1) => ({ tag, _1 });
  var Inl = (value0) => $Sum("Inl", value0);
  var Inr = (value0) => $Sum("Inr", value0);
  var Product = (value0) => (value1) => $Product(value0, value1);
  var NoArguments = /* @__PURE__ */ $NoArguments();
  var Constructor = (x2) => x2;
  var Argument = (x2) => x2;

  // output-es/Data.Maybe/index.js
  var $Maybe = (tag, _1) => ({ tag, _1 });
  var Nothing = /* @__PURE__ */ $Maybe("Nothing");
  var Just = (value0) => $Maybe("Just", value0);
  var isNothing = (v2) => {
    if (v2.tag === "Nothing") {
      return true;
    }
    if (v2.tag === "Just") {
      return false;
    }
    fail();
  };
  var isJust = (v2) => {
    if (v2.tag === "Nothing") {
      return false;
    }
    if (v2.tag === "Just") {
      return true;
    }
    fail();
  };
  var functorMaybe = {
    map: (v) => (v1) => {
      if (v1.tag === "Just") {
        return $Maybe("Just", v(v1._1));
      }
      return Nothing;
    }
  };
  var ordMaybe = (dictOrd) => {
    const $0 = dictOrd.Eq0();
    const eqMaybe1 = {
      eq: (x2) => (y2) => {
        if (x2.tag === "Nothing") {
          return y2.tag === "Nothing";
        }
        return x2.tag === "Just" && y2.tag === "Just" && $0.eq(x2._1)(y2._1);
      }
    };
    return {
      compare: (x2) => (y2) => {
        if (x2.tag === "Nothing") {
          if (y2.tag === "Nothing") {
            return EQ;
          }
          return LT;
        }
        if (y2.tag === "Nothing") {
          return GT;
        }
        if (x2.tag === "Just" && y2.tag === "Just") {
          return dictOrd.compare(x2._1)(y2._1);
        }
        fail();
      },
      Eq0: () => eqMaybe1
    };
  };
  var applyMaybe = {
    apply: (v) => (v1) => {
      if (v.tag === "Just") {
        if (v1.tag === "Just") {
          return $Maybe("Just", v._1(v1._1));
        }
        return Nothing;
      }
      if (v.tag === "Nothing") {
        return Nothing;
      }
      fail();
    },
    Functor0: () => functorMaybe
  };

  // output-es/Data.Either/index.js
  var $Either = (tag, _1) => ({ tag, _1 });
  var Left = (value0) => $Either("Left", value0);
  var Right = (value0) => $Either("Right", value0);
  var functorEither = {
    map: (f2) => (m2) => {
      if (m2.tag === "Left") {
        return $Either("Left", m2._1);
      }
      if (m2.tag === "Right") {
        return $Either("Right", f2(m2._1));
      }
      fail();
    }
  };
  var blush = (v2) => {
    if (v2.tag === "Left") {
      return $Maybe("Just", v2._1);
    }
    if (v2.tag === "Right") {
      return Nothing;
    }
    fail();
  };
  var applyEither = {
    apply: (v) => (v1) => {
      if (v.tag === "Left") {
        return $Either("Left", v._1);
      }
      if (v.tag === "Right") {
        if (v1.tag === "Left") {
          return $Either("Left", v1._1);
        }
        if (v1.tag === "Right") {
          return $Either("Right", v._1(v1._1));
        }
      }
      fail();
    },
    Functor0: () => functorEither
  };
  var bindEither = {
    bind: (v2) => {
      if (v2.tag === "Left") {
        const $0 = v2._1;
        return (v) => $Either("Left", $0);
      }
      if (v2.tag === "Right") {
        const $0 = v2._1;
        return (f2) => f2($0);
      }
      fail();
    },
    Apply0: () => applyEither
  };
  var applicativeEither = { pure: Right, Apply0: () => applyEither };
  var monadEither = { Applicative0: () => applicativeEither, Bind1: () => bindEither };

  // output-es/Effect/foreign.js
  var pureE = function(a2) {
    return function() {
      return a2;
    };
  };
  var bindE = function(a2) {
    return function(f2) {
      return function() {
        return f2(a2())();
      };
    };
  };
  var untilE = function(f2) {
    return function() {
      while (!f2())
        ;
    };
  };

  // output-es/Effect/index.js
  var monadEffect = { Applicative0: () => applicativeEffect, Bind1: () => bindEffect };
  var bindEffect = { bind: bindE, Apply0: () => applyEffect };
  var applyEffect = {
    apply: (f2) => (a2) => () => {
      const f$p = f2();
      const a$p = a2();
      return applicativeEffect.pure(f$p(a$p))();
    },
    Functor0: () => functorEffect
  };
  var applicativeEffect = { pure: pureE, Apply0: () => applyEffect };
  var functorEffect = {
    map: (f2) => (a2) => () => {
      const a$p = a2();
      return f2(a$p);
    }
  };

  // output-es/Effect.Exception/foreign.js
  function error(msg) {
    return new Error(msg);
  }
  function throwException(e2) {
    return function() {
      throw e2;
    };
  }

  // output-es/Control.Monad.Error.Class/index.js
  var monadThrowEither = { throwError: Left, Monad0: () => monadEither };
  var monadErrorEither = {
    catchError: (v) => (v1) => {
      if (v.tag === "Left") {
        return v1(v._1);
      }
      if (v.tag === "Right") {
        return $Either("Right", v._1);
      }
      fail();
    },
    MonadThrow0: () => monadThrowEither
  };
  var $$try = (dictMonadError) => {
    const Monad0 = dictMonadError.MonadThrow0().Monad0();
    return (a2) => dictMonadError.catchError(Monad0.Bind1().Apply0().Functor0().map(Right)(a2))((x2) => Monad0.Applicative0().pure($Either("Left", x2)));
  };

  // output-es/Data.Function/index.js
  var $$const = (a2) => (v) => a2;
  var applyFlipped = (x2) => (f2) => f2(x2);
  var apply = (f2) => (x2) => f2(x2);

  // output-es/Control.Semigroupoid/index.js
  var semigroupoidFn = { compose: (f2) => (g2) => (x2) => f2(g2(x2)) };

  // output-es/Data.Functor/foreign.js
  var arrayMap = function(f2) {
    return function(arr) {
      var l2 = arr.length;
      var result = new Array(l2);
      for (var i2 = 0; i2 < l2; i2++) {
        result[i2] = f2(arr[i2]);
      }
      return result;
    };
  };

  // output-es/Data.Functor/index.js
  var functorFn = /* @__PURE__ */ (() => ({ map: semigroupoidFn.compose }))();
  var functorArray = { map: arrayMap };

  // output-es/Control.Apply/foreign.js
  var arrayApply = function(fs) {
    return function(xs) {
      var l2 = fs.length;
      var k = xs.length;
      var result = new Array(l2 * k);
      var n2 = 0;
      for (var i2 = 0; i2 < l2; i2++) {
        var f2 = fs[i2];
        for (var j = 0; j < k; j++) {
          result[n2++] = f2(xs[j]);
        }
      }
      return result;
    };
  };

  // output-es/Control.Apply/index.js
  var identity = (x2) => x2;
  var applyFn = { apply: (f2) => (g2) => (x2) => f2(x2)(g2(x2)), Functor0: () => functorFn };
  var applyArray = { apply: arrayApply, Functor0: () => functorArray };

  // output-es/Data.Maybe.First/index.js
  var semigroupFirst = {
    append: (v) => (v1) => {
      if (v.tag === "Just") {
        return v;
      }
      return v1;
    }
  };
  var monoidFirst = { mempty: Nothing, Semigroup0: () => semigroupFirst };

  // output-es/Data.Foldable/foreign.js
  var foldrArray = function(f2) {
    return function(init) {
      return function(xs) {
        var acc = init;
        var len = xs.length;
        for (var i2 = len - 1; i2 >= 0; i2--) {
          acc = f2(xs[i2])(acc);
        }
        return acc;
      };
    };
  };
  var foldlArray = function(f2) {
    return function(init) {
      return function(xs) {
        var acc = init;
        var len = xs.length;
        for (var i2 = 0; i2 < len; i2++) {
          acc = f2(acc)(xs[i2]);
        }
        return acc;
      };
    };
  };

  // output-es/Data.Foldable/index.js
  var identity2 = (x2) => x2;
  var monoidEndo = /* @__PURE__ */ (() => {
    const semigroupEndo1 = { append: (v) => (v1) => (x2) => v(v1(x2)) };
    return { mempty: (x2) => x2, Semigroup0: () => semigroupEndo1 };
  })();
  var traverse_ = (dictApplicative) => {
    const $0 = dictApplicative.Apply0();
    return (dictFoldable) => (f2) => dictFoldable.foldr((x2) => {
      const $1 = f2(x2);
      return (b) => $0.apply($0.Functor0().map((v) => identity)($1))(b);
    })(dictApplicative.pure());
  };
  var for_ = (dictApplicative) => {
    const traverse_18 = traverse_(dictApplicative);
    return (dictFoldable) => {
      const $0 = traverse_18(dictFoldable);
      return (b) => (a2) => $0(a2)(b);
    };
  };
  var indexl = (dictFoldable) => (idx) => {
    const $0 = dictFoldable.foldl((cursor) => (a2) => {
      if (cursor.elem.tag === "Just") {
        return cursor;
      }
      if (cursor.pos === idx) {
        return { elem: $Maybe("Just", a2), pos: cursor.pos };
      }
      return { pos: cursor.pos + 1 | 0, elem: cursor.elem };
    })({ elem: Nothing, pos: 0 });
    return (x2) => $0(x2).elem;
  };
  var maximumBy = (dictFoldable) => (cmp) => dictFoldable.foldl((v) => (v1) => {
    if (v.tag === "Nothing") {
      return $Maybe("Just", v1);
    }
    if (v.tag === "Just") {
      return $Maybe("Just", cmp(v._1)(v1) === "GT" ? v._1 : v1);
    }
    fail();
  })(Nothing);
  var foldableMaybe = {
    foldr: (v) => (v1) => (v2) => {
      if (v2.tag === "Nothing") {
        return v1;
      }
      if (v2.tag === "Just") {
        return v(v2._1)(v1);
      }
      fail();
    },
    foldl: (v) => (v1) => (v2) => {
      if (v2.tag === "Nothing") {
        return v1;
      }
      if (v2.tag === "Just") {
        return v(v1)(v2._1);
      }
      fail();
    },
    foldMap: (dictMonoid) => {
      const mempty2 = dictMonoid.mempty;
      return (v) => (v1) => {
        if (v1.tag === "Nothing") {
          return mempty2;
        }
        if (v1.tag === "Just") {
          return v(v1._1);
        }
        fail();
      };
    }
  };
  var foldableEither = {
    foldr: (v) => (v1) => (v2) => {
      if (v2.tag === "Left") {
        return v1;
      }
      if (v2.tag === "Right") {
        return v(v2._1)(v1);
      }
      fail();
    },
    foldl: (v) => (v1) => (v2) => {
      if (v2.tag === "Left") {
        return v1;
      }
      if (v2.tag === "Right") {
        return v(v1)(v2._1);
      }
      fail();
    },
    foldMap: (dictMonoid) => {
      const mempty2 = dictMonoid.mempty;
      return (v) => (v1) => {
        if (v1.tag === "Left") {
          return mempty2;
        }
        if (v1.tag === "Right") {
          return v(v1._1);
        }
        fail();
      };
    }
  };
  var foldableArray = {
    foldr: foldrArray,
    foldl: foldlArray,
    foldMap: (dictMonoid) => {
      const mempty2 = dictMonoid.mempty;
      return (f2) => foldableArray.foldr((x2) => (acc) => dictMonoid.Semigroup0().append(f2(x2))(acc))(mempty2);
    }
  };
  var surroundMap = (dictFoldable) => {
    const foldMap22 = dictFoldable.foldMap(monoidEndo);
    return (dictSemigroup) => (d3) => (t2) => (f2) => foldMap22((a2) => (m2) => dictSemigroup.append(d3)(dictSemigroup.append(t2(a2))(m2)))(f2)(d3);
  };
  var surround = (dictFoldable) => {
    const surroundMap1 = surroundMap(dictFoldable);
    return (dictSemigroup) => {
      const surroundMap2 = surroundMap1(dictSemigroup);
      return (d3) => surroundMap2(d3)(identity2);
    };
  };
  var find = (dictFoldable) => (p2) => dictFoldable.foldl((v) => (v1) => {
    if (v.tag === "Nothing" && p2(v1)) {
      return $Maybe("Just", v1);
    }
    return v;
  })(Nothing);
  var and = (dictFoldable) => (dictHeytingAlgebra) => dictFoldable.foldMap((() => {
    const semigroupConj1 = { append: (v) => (v1) => dictHeytingAlgebra.conj(v)(v1) };
    return { mempty: dictHeytingAlgebra.tt, Semigroup0: () => semigroupConj1 };
  })())(identity2);

  // output-es/Control.Parallel/index.js
  var identity3 = (x2) => x2;
  var parTraverse_ = (dictParallel) => (dictApplicative) => {
    const traverse_18 = traverse_(dictApplicative);
    return (dictFoldable) => {
      const traverse_19 = traverse_18(dictFoldable);
      return (f2) => {
        const $0 = traverse_19((x2) => dictParallel.parallel(f2(x2)));
        return (x2) => dictParallel.sequential($0(x2));
      };
    };
  };

  // output-es/Partial/foreign.js
  var _crashWith = function(msg) {
    throw new Error(msg);
  };

  // output-es/Unsafe.Coerce/foreign.js
  var unsafeCoerce = function(x2) {
    return x2;
  };

  // output-es/Effect.Aff/foreign.js
  var Aff = function() {
    var EMPTY = {};
    var PURE = "Pure";
    var THROW = "Throw";
    var CATCH = "Catch";
    var SYNC = "Sync";
    var ASYNC = "Async";
    var BIND = "Bind";
    var BRACKET = "Bracket";
    var FORK = "Fork";
    var SEQ = "Sequential";
    var MAP = "Map";
    var APPLY = "Apply";
    var ALT = "Alt";
    var CONS = "Cons";
    var RESUME = "Resume";
    var RELEASE = "Release";
    var FINALIZER = "Finalizer";
    var FINALIZED = "Finalized";
    var FORKED = "Forked";
    var FIBER = "Fiber";
    var THUNK = "Thunk";
    function Aff2(tag, _1, _2, _3) {
      this.tag = tag;
      this._1 = _1;
      this._2 = _2;
      this._3 = _3;
    }
    function AffCtr(tag) {
      var fn = function(_1, _2, _3) {
        return new Aff2(tag, _1, _2, _3);
      };
      fn.tag = tag;
      return fn;
    }
    function nonCanceler2(error3) {
      return new Aff2(PURE, void 0);
    }
    function runEff(eff) {
      try {
        eff();
      } catch (error3) {
        setTimeout(function() {
          throw error3;
        }, 0);
      }
    }
    function runSync(left2, right, eff) {
      try {
        return right(eff());
      } catch (error3) {
        return left2(error3);
      }
    }
    function runAsync(left2, eff, k) {
      try {
        return eff(k)();
      } catch (error3) {
        k(left2(error3))();
        return nonCanceler2;
      }
    }
    var Scheduler = function() {
      var limit = 1024;
      var size3 = 0;
      var ix4 = 0;
      var queue = new Array(limit);
      var draining = false;
      function drain() {
        var thunk4;
        draining = true;
        while (size3 !== 0) {
          size3--;
          thunk4 = queue[ix4];
          queue[ix4] = void 0;
          ix4 = (ix4 + 1) % limit;
          thunk4();
        }
        draining = false;
      }
      return {
        isDraining: function() {
          return draining;
        },
        enqueue: function(cb) {
          var i2, tmp;
          if (size3 === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }
          queue[(ix4 + size3) % limit] = cb;
          size3++;
          if (!draining) {
            drain();
          }
        }
      };
    }();
    function Supervisor(util2) {
      var fibers = {};
      var fiberId = 0;
      var count = 0;
      return {
        register: function(fiber) {
          var fid = fiberId++;
          fiber.onComplete({
            rethrow: true,
            handler: function(result) {
              return function() {
                count--;
                delete fibers[fid];
              };
            }
          })();
          fibers[fid] = fiber;
          count++;
        },
        isEmpty: function() {
          return count === 0;
        },
        killAll: function(killError, cb) {
          return function() {
            if (count === 0) {
              return cb();
            }
            var killCount = 0;
            var kills = {};
            function kill(fid) {
              kills[fid] = fibers[fid].kill(killError, function(result) {
                return function() {
                  delete kills[fid];
                  killCount--;
                  if (util2.isLeft(result) && util2.fromLeft(result)) {
                    setTimeout(function() {
                      throw util2.fromLeft(result);
                    }, 0);
                  }
                  if (killCount === 0) {
                    cb();
                  }
                };
              })();
            }
            for (var k in fibers) {
              if (fibers.hasOwnProperty(k)) {
                killCount++;
                kill(k);
              }
            }
            fibers = {};
            fiberId = 0;
            count = 0;
            return function(error3) {
              return new Aff2(SYNC, function() {
                for (var k2 in kills) {
                  if (kills.hasOwnProperty(k2)) {
                    kills[k2]();
                  }
                }
              });
            };
          };
        }
      };
    }
    var SUSPENDED = 0;
    var CONTINUE = 1;
    var STEP_BIND = 2;
    var STEP_RESULT = 3;
    var PENDING = 4;
    var RETURN = 5;
    var COMPLETED = 6;
    function Fiber(util2, supervisor, aff) {
      var runTick = 0;
      var status = SUSPENDED;
      var step2 = aff;
      var fail3 = null;
      var interrupt = null;
      var bhead = null;
      var btail = null;
      var attempts = null;
      var bracketCount = 0;
      var joinId = 0;
      var joins = null;
      var rethrow = true;
      function run3(localRunTick) {
        var tmp, result, attempt;
        while (true) {
          tmp = null;
          result = null;
          attempt = null;
          switch (status) {
            case STEP_BIND:
              status = CONTINUE;
              try {
                step2 = bhead(step2);
                if (btail === null) {
                  bhead = null;
                } else {
                  bhead = btail._1;
                  btail = btail._2;
                }
              } catch (e2) {
                status = RETURN;
                fail3 = util2.left(e2);
                step2 = null;
              }
              break;
            case STEP_RESULT:
              if (util2.isLeft(step2)) {
                status = RETURN;
                fail3 = step2;
                step2 = null;
              } else if (bhead === null) {
                status = RETURN;
              } else {
                status = STEP_BIND;
                step2 = util2.fromRight(step2);
              }
              break;
            case CONTINUE:
              switch (step2.tag) {
                case BIND:
                  if (bhead) {
                    btail = new Aff2(CONS, bhead, btail);
                  }
                  bhead = step2._2;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case PURE:
                  if (bhead === null) {
                    status = RETURN;
                    step2 = util2.right(step2._1);
                  } else {
                    status = STEP_BIND;
                    step2 = step2._1;
                  }
                  break;
                case SYNC:
                  status = STEP_RESULT;
                  step2 = runSync(util2.left, util2.right, step2._1);
                  break;
                case ASYNC:
                  status = PENDING;
                  step2 = runAsync(util2.left, step2._1, function(result2) {
                    return function() {
                      if (runTick !== localRunTick) {
                        return;
                      }
                      runTick++;
                      Scheduler.enqueue(function() {
                        if (runTick !== localRunTick + 1) {
                          return;
                        }
                        status = STEP_RESULT;
                        step2 = result2;
                        run3(runTick);
                      });
                    };
                  });
                  return;
                case THROW:
                  status = RETURN;
                  fail3 = util2.left(step2._1);
                  step2 = null;
                  break;
                case CATCH:
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step2, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step2, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case BRACKET:
                  bracketCount++;
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step2, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step2, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case FORK:
                  status = STEP_RESULT;
                  tmp = Fiber(util2, supervisor, step2._2);
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
                  if (step2._1) {
                    tmp.run();
                  }
                  step2 = util2.right(tmp);
                  break;
                case SEQ:
                  status = CONTINUE;
                  step2 = sequential(util2, supervisor, step2._1);
                  break;
              }
              break;
            case RETURN:
              bhead = null;
              btail = null;
              if (attempts === null) {
                status = COMPLETED;
                step2 = interrupt || fail3 || step2;
              } else {
                tmp = attempts._3;
                attempt = attempts._1;
                attempts = attempts._2;
                switch (attempt.tag) {
                  case CATCH:
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      status = RETURN;
                    } else if (fail3) {
                      status = CONTINUE;
                      step2 = attempt._2(util2.fromLeft(fail3));
                      fail3 = null;
                    }
                    break;
                  case RESUME:
                    if (interrupt && interrupt !== tmp && bracketCount === 0 || fail3) {
                      status = RETURN;
                    } else {
                      bhead = attempt._1;
                      btail = attempt._2;
                      status = STEP_BIND;
                      step2 = util2.fromRight(step2);
                    }
                    break;
                  case BRACKET:
                    bracketCount--;
                    if (fail3 === null) {
                      result = util2.fromRight(step2);
                      attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                      if (interrupt === tmp || bracketCount > 0) {
                        status = CONTINUE;
                        step2 = attempt._3(result);
                      }
                    }
                    break;
                  case RELEASE:
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail3), attempts, interrupt);
                    status = CONTINUE;
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      step2 = attempt._1.killed(util2.fromLeft(interrupt))(attempt._2);
                    } else if (fail3) {
                      step2 = attempt._1.failed(util2.fromLeft(fail3))(attempt._2);
                    } else {
                      step2 = attempt._1.completed(util2.fromRight(step2))(attempt._2);
                    }
                    fail3 = null;
                    bracketCount++;
                    break;
                  case FINALIZER:
                    bracketCount++;
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail3), attempts, interrupt);
                    status = CONTINUE;
                    step2 = attempt._1;
                    break;
                  case FINALIZED:
                    bracketCount--;
                    status = RETURN;
                    step2 = attempt._1;
                    fail3 = attempt._2;
                    break;
                }
              }
              break;
            case COMPLETED:
              for (var k in joins) {
                if (joins.hasOwnProperty(k)) {
                  rethrow = rethrow && joins[k].rethrow;
                  runEff(joins[k].handler(step2));
                }
              }
              joins = null;
              if (interrupt && fail3) {
                setTimeout(function() {
                  throw util2.fromLeft(fail3);
                }, 0);
              } else if (util2.isLeft(step2) && rethrow) {
                setTimeout(function() {
                  if (rethrow) {
                    throw util2.fromLeft(step2);
                  }
                }, 0);
              }
              return;
            case SUSPENDED:
              status = CONTINUE;
              break;
            case PENDING:
              return;
          }
        }
      }
      function onComplete(join2) {
        return function() {
          if (status === COMPLETED) {
            rethrow = rethrow && join2.rethrow;
            join2.handler(step2)();
            return function() {
            };
          }
          var jid = joinId++;
          joins = joins || {};
          joins[jid] = join2;
          return function() {
            if (joins !== null) {
              delete joins[jid];
            }
          };
        };
      }
      function kill(error3, cb) {
        return function() {
          if (status === COMPLETED) {
            cb(util2.right(void 0))();
            return function() {
            };
          }
          var canceler = onComplete({
            rethrow: false,
            handler: function() {
              return cb(util2.right(void 0));
            }
          })();
          switch (status) {
            case SUSPENDED:
              interrupt = util2.left(error3);
              status = COMPLETED;
              step2 = interrupt;
              run3(runTick);
              break;
            case PENDING:
              if (interrupt === null) {
                interrupt = util2.left(error3);
              }
              if (bracketCount === 0) {
                if (status === PENDING) {
                  attempts = new Aff2(CONS, new Aff2(FINALIZER, step2(error3)), attempts, interrupt);
                }
                status = RETURN;
                step2 = null;
                fail3 = null;
                run3(++runTick);
              }
              break;
            default:
              if (interrupt === null) {
                interrupt = util2.left(error3);
              }
              if (bracketCount === 0) {
                status = RETURN;
                step2 = null;
                fail3 = null;
              }
          }
          return canceler;
        };
      }
      function join(cb) {
        return function() {
          var canceler = onComplete({
            rethrow: false,
            handler: cb
          })();
          if (status === SUSPENDED) {
            run3(runTick);
          }
          return canceler;
        };
      }
      return {
        kill,
        join,
        onComplete,
        isSuspended: function() {
          return status === SUSPENDED;
        },
        run: function() {
          if (status === SUSPENDED) {
            if (!Scheduler.isDraining()) {
              Scheduler.enqueue(function() {
                run3(runTick);
              });
            } else {
              run3(runTick);
            }
          }
        }
      };
    }
    function runPar(util2, supervisor, par, cb) {
      var fiberId = 0;
      var fibers = {};
      var killId = 0;
      var kills = {};
      var early = new Error("[ParAff] Early exit");
      var interrupt = null;
      var root2 = EMPTY;
      function kill(error3, par2, cb2) {
        var step2 = par2;
        var head = null;
        var tail = null;
        var count = 0;
        var kills2 = {};
        var tmp, kid;
        loop:
          while (true) {
            tmp = null;
            switch (step2.tag) {
              case FORKED:
                if (step2._3 === EMPTY) {
                  tmp = fibers[step2._1];
                  kills2[count++] = tmp.kill(error3, function(result) {
                    return function() {
                      count--;
                      if (count === 0) {
                        cb2(result)();
                      }
                    };
                  });
                }
                if (head === null) {
                  break loop;
                }
                step2 = head._2;
                if (tail === null) {
                  head = null;
                } else {
                  head = tail._1;
                  tail = tail._2;
                }
                break;
              case MAP:
                step2 = step2._2;
                break;
              case APPLY:
              case ALT:
                if (head) {
                  tail = new Aff2(CONS, head, tail);
                }
                head = step2;
                step2 = step2._1;
                break;
            }
          }
        if (count === 0) {
          cb2(util2.right(void 0))();
        } else {
          kid = 0;
          tmp = count;
          for (; kid < tmp; kid++) {
            kills2[kid] = kills2[kid]();
          }
        }
        return kills2;
      }
      function join(result, head, tail) {
        var fail3, step2, lhs, rhs, tmp, kid;
        if (util2.isLeft(result)) {
          fail3 = result;
          step2 = null;
        } else {
          step2 = result;
          fail3 = null;
        }
        loop:
          while (true) {
            lhs = null;
            rhs = null;
            tmp = null;
            kid = null;
            if (interrupt !== null) {
              return;
            }
            if (head === null) {
              cb(fail3 || step2)();
              return;
            }
            if (head._3 !== EMPTY) {
              return;
            }
            switch (head.tag) {
              case MAP:
                if (fail3 === null) {
                  head._3 = util2.right(head._1(util2.fromRight(step2)));
                  step2 = head._3;
                } else {
                  head._3 = fail3;
                }
                break;
              case APPLY:
                lhs = head._1._3;
                rhs = head._2._3;
                if (fail3) {
                  head._3 = fail3;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill(early, fail3 === lhs ? head._2 : head._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail === null) {
                        join(fail3, null, null);
                      } else {
                        join(fail3, tail._1, tail._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                } else if (lhs === EMPTY || rhs === EMPTY) {
                  return;
                } else {
                  step2 = util2.right(util2.fromRight(lhs)(util2.fromRight(rhs)));
                  head._3 = step2;
                }
                break;
              case ALT:
                lhs = head._1._3;
                rhs = head._2._3;
                if (lhs === EMPTY && util2.isLeft(rhs) || rhs === EMPTY && util2.isLeft(lhs)) {
                  return;
                }
                if (lhs !== EMPTY && util2.isLeft(lhs) && rhs !== EMPTY && util2.isLeft(rhs)) {
                  fail3 = step2 === lhs ? rhs : lhs;
                  step2 = null;
                  head._3 = fail3;
                } else {
                  head._3 = step2;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill(early, step2 === lhs ? head._2 : head._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail === null) {
                        join(step2, null, null);
                      } else {
                        join(step2, tail._1, tail._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                }
                break;
            }
            if (tail === null) {
              head = null;
            } else {
              head = tail._1;
              tail = tail._2;
            }
          }
      }
      function resolve(fiber) {
        return function(result) {
          return function() {
            delete fibers[fiber._1];
            fiber._3 = result;
            join(result, fiber._2._1, fiber._2._2);
          };
        };
      }
      function run3() {
        var status = CONTINUE;
        var step2 = par;
        var head = null;
        var tail = null;
        var tmp, fid;
        loop:
          while (true) {
            tmp = null;
            fid = null;
            switch (status) {
              case CONTINUE:
                switch (step2.tag) {
                  case MAP:
                    if (head) {
                      tail = new Aff2(CONS, head, tail);
                    }
                    head = new Aff2(MAP, step2._1, EMPTY, EMPTY);
                    step2 = step2._2;
                    break;
                  case APPLY:
                    if (head) {
                      tail = new Aff2(CONS, head, tail);
                    }
                    head = new Aff2(APPLY, EMPTY, step2._2, EMPTY);
                    step2 = step2._1;
                    break;
                  case ALT:
                    if (head) {
                      tail = new Aff2(CONS, head, tail);
                    }
                    head = new Aff2(ALT, EMPTY, step2._2, EMPTY);
                    step2 = step2._1;
                    break;
                  default:
                    fid = fiberId++;
                    status = RETURN;
                    tmp = step2;
                    step2 = new Aff2(FORKED, fid, new Aff2(CONS, head, tail), EMPTY);
                    tmp = Fiber(util2, supervisor, tmp);
                    tmp.onComplete({
                      rethrow: false,
                      handler: resolve(step2)
                    })();
                    fibers[fid] = tmp;
                    if (supervisor) {
                      supervisor.register(tmp);
                    }
                }
                break;
              case RETURN:
                if (head === null) {
                  break loop;
                }
                if (head._1 === EMPTY) {
                  head._1 = step2;
                  status = CONTINUE;
                  step2 = head._2;
                  head._2 = EMPTY;
                } else {
                  head._2 = step2;
                  step2 = head;
                  if (tail === null) {
                    head = null;
                  } else {
                    head = tail._1;
                    tail = tail._2;
                  }
                }
            }
          }
        root2 = step2;
        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }
      function cancel2(error3, cb2) {
        interrupt = util2.left(error3);
        var innerKills;
        for (var kid in kills) {
          if (kills.hasOwnProperty(kid)) {
            innerKills = kills[kid];
            for (kid in innerKills) {
              if (innerKills.hasOwnProperty(kid)) {
                innerKills[kid]();
              }
            }
          }
        }
        kills = null;
        var newKills = kill(error3, root2, cb2);
        return function(killError) {
          return new Aff2(ASYNC, function(killCb) {
            return function() {
              for (var kid2 in newKills) {
                if (newKills.hasOwnProperty(kid2)) {
                  newKills[kid2]();
                }
              }
              return nonCanceler2;
            };
          });
        };
      }
      run3();
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            return cancel2(killError, killCb);
          };
        });
      };
    }
    function sequential(util2, supervisor, par) {
      return new Aff2(ASYNC, function(cb) {
        return function() {
          return runPar(util2, supervisor, par, cb);
        };
      });
    }
    Aff2.EMPTY = EMPTY;
    Aff2.Pure = AffCtr(PURE);
    Aff2.Throw = AffCtr(THROW);
    Aff2.Catch = AffCtr(CATCH);
    Aff2.Sync = AffCtr(SYNC);
    Aff2.Async = AffCtr(ASYNC);
    Aff2.Bind = AffCtr(BIND);
    Aff2.Bracket = AffCtr(BRACKET);
    Aff2.Fork = AffCtr(FORK);
    Aff2.Seq = AffCtr(SEQ);
    Aff2.ParMap = AffCtr(MAP);
    Aff2.ParApply = AffCtr(APPLY);
    Aff2.ParAlt = AffCtr(ALT);
    Aff2.Fiber = Fiber;
    Aff2.Supervisor = Supervisor;
    Aff2.Scheduler = Scheduler;
    Aff2.nonCanceler = nonCanceler2;
    return Aff2;
  }();
  var _pure = Aff.Pure;
  var _throwError = Aff.Throw;
  function _catchError(aff) {
    return function(k) {
      return Aff.Catch(aff, k);
    };
  }
  function _map(f2) {
    return function(aff) {
      if (aff.tag === Aff.Pure.tag) {
        return Aff.Pure(f2(aff._1));
      } else {
        return Aff.Bind(aff, function(value2) {
          return Aff.Pure(f2(value2));
        });
      }
    };
  }
  function _bind(aff) {
    return function(k) {
      return Aff.Bind(aff, k);
    };
  }
  function _fork(immediate) {
    return function(aff) {
      return Aff.Fork(immediate, aff);
    };
  }
  var _liftEffect = Aff.Sync;
  function _parAffMap(f2) {
    return function(aff) {
      return Aff.ParMap(f2, aff);
    };
  }
  function _parAffApply(aff1) {
    return function(aff2) {
      return Aff.ParApply(aff1, aff2);
    };
  }
  function _parAffAlt(aff1) {
    return function(aff2) {
      return Aff.ParAlt(aff1, aff2);
    };
  }
  var makeAff = Aff.Async;
  function generalBracket(acquire) {
    return function(options) {
      return function(k) {
        return Aff.Bracket(acquire, options, k);
      };
    };
  }
  function _makeFiber(util2, aff) {
    return function() {
      return Aff.Fiber(util2, null, aff);
    };
  }
  var _delay = function() {
    function setDelay(n2, k) {
      if (n2 === 0 && typeof setImmediate !== "undefined") {
        return setImmediate(k);
      } else {
        return setTimeout(k, n2);
      }
    }
    function clearDelay(n2, t2) {
      if (n2 === 0 && typeof clearImmediate !== "undefined") {
        return clearImmediate(t2);
      } else {
        return clearTimeout(t2);
      }
    }
    return function(right, ms) {
      return Aff.Async(function(cb) {
        return function() {
          var timer = setDelay(ms, cb(right()));
          return function() {
            return Aff.Sync(function() {
              return right(clearDelay(ms, timer));
            });
          };
        };
      });
    };
  }();
  var _sequential = Aff.Seq;

  // output-es/Effect.Aff/index.js
  var suspendAff = /* @__PURE__ */ _fork(false);
  var functorParAff = { map: _parAffMap };
  var functorAff = { map: _map };
  var forkAff = /* @__PURE__ */ _fork(true);
  var ffiUtil = {
    isLeft: (v) => {
      if (v.tag === "Left") {
        return true;
      }
      if (v.tag === "Right") {
        return false;
      }
      fail();
    },
    fromLeft: (v) => {
      if (v.tag === "Left") {
        return v._1;
      }
      if (v.tag === "Right") {
        return _crashWith("unsafeFromLeft: Right");
      }
      fail();
    },
    fromRight: (v) => {
      if (v.tag === "Right") {
        return v._1;
      }
      if (v.tag === "Left") {
        return _crashWith("unsafeFromRight: Left");
      }
      fail();
    },
    left: Left,
    right: Right
  };
  var applyParAff = { apply: _parAffApply, Functor0: () => functorParAff };
  var monadAff = { Applicative0: () => applicativeAff, Bind1: () => bindAff };
  var bindAff = { bind: _bind, Apply0: () => applyAff };
  var applyAff = { apply: (f2) => (a2) => _bind(f2)((f$p) => _bind(a2)((a$p) => applicativeAff.pure(f$p(a$p)))), Functor0: () => functorAff };
  var applicativeAff = { pure: _pure, Apply0: () => applyAff };
  var cancelWith = (aff) => (v) => generalBracket(_pure())({ killed: (e2) => (v1) => v(e2), failed: (v$1) => _pure, completed: (v$1) => _pure })((v$1) => aff);
  var $$finally = (fin) => (a2) => generalBracket(_pure())({ killed: (v) => (v$1) => fin, failed: (v) => (v$1) => fin, completed: (v) => (v$1) => fin })((v) => a2);
  var parallelAff = { parallel: unsafeCoerce, sequential: _sequential, Apply0: () => applyAff, Apply1: () => applyParAff };
  var applicativeParAff = { pure: (x2) => _pure(x2), Apply0: () => applyParAff };
  var monadEffectAff = { liftEffect: _liftEffect, Monad0: () => monadAff };
  var joinFiber = (v) => makeAff((k) => {
    const $0 = v.join(k);
    return () => {
      const a$p = $0();
      const $1 = _liftEffect(a$p);
      return (v$1) => $1;
    };
  });
  var killFiber = (e2) => (v) => _bind(_liftEffect(v.isSuspended))((suspended) => {
    if (suspended) {
      return _liftEffect((() => {
        const $0 = v.kill(e2, (v$1) => () => {
        });
        return () => {
          $0();
        };
      })());
    }
    return makeAff((k) => {
      const $0 = v.kill(e2, k);
      return () => {
        const a$p = $0();
        const $1 = _liftEffect(a$p);
        return (v$1) => $1;
      };
    });
  });
  var monadThrowAff = { throwError: _throwError, Monad0: () => monadAff };
  var monadErrorAff = { catchError: _catchError, MonadThrow0: () => monadThrowAff };
  var $$try2 = /* @__PURE__ */ $$try(monadErrorAff);
  var runAff = (k) => (aff) => {
    const $0 = _makeFiber(ffiUtil, _bind($$try2(aff))((x2) => _liftEffect(k(x2))));
    return () => {
      const fiber = $0();
      fiber.run();
      return fiber;
    };
  };
  var runAff_ = (k) => (aff) => {
    const $0 = runAff(k)(aff);
    return () => {
      $0();
    };
  };
  var monadRecAff = {
    tailRecM: (k) => {
      const go = (a2) => _bind(k(a2))((res) => {
        if (res.tag === "Done") {
          return _pure(res._1);
        }
        if (res.tag === "Loop") {
          return go(res._1);
        }
        fail();
      });
      return go;
    },
    Monad0: () => monadAff
  };
  var nonCanceler = /* @__PURE__ */ (() => {
    const $0 = _pure();
    return (v) => $0;
  })();
  var never = /* @__PURE__ */ makeAff((v) => () => nonCanceler);
  var altAff = { alt: (a1) => (a2) => _catchError(a1)((v) => a2), Functor0: () => functorAff };
  var plusAff = { empty: /* @__PURE__ */ _throwError(/* @__PURE__ */ error("Always fails")), Alt0: () => altAff };

  // output-es/Control.Applicative/index.js
  var applicativeFn = { pure: (x2) => (v) => x2, Apply0: () => applyFn };
  var applicativeArray = { pure: (x2) => [x2], Apply0: () => applyArray };

  // output-es/Control.Bind/foreign.js
  var arrayBind = function(arr) {
    return function(f2) {
      var result = [];
      for (var i2 = 0, l2 = arr.length; i2 < l2; i2++) {
        Array.prototype.push.apply(result, f2(arr[i2]));
      }
      return result;
    };
  };

  // output-es/Control.Bind/index.js
  var bindFn = { bind: (m2) => (f2) => (x2) => f2(m2(x2))(x2), Apply0: () => applyFn };

  // output-es/Control.Monad/index.js
  var monadFn = { Applicative0: () => applicativeFn, Bind1: () => bindFn };

  // output-es/Data.Identity/index.js
  var Identity = (x2) => x2;
  var functorIdentity = { map: (f2) => (m2) => f2(m2) };
  var applyIdentity = { apply: (v) => (v1) => v(v1), Functor0: () => functorIdentity };
  var bindIdentity = { bind: (v) => (f2) => f2(v), Apply0: () => applyIdentity };
  var applicativeIdentity = { pure: Identity, Apply0: () => applyIdentity };
  var monadIdentity = { Applicative0: () => applicativeIdentity, Bind1: () => bindIdentity };

  // output-es/Control.Monad.Rec.Class/index.js
  var $Step = (tag, _1) => ({ tag, _1 });
  var Done = (value0) => $Step("Done", value0);
  var monadRecEffect = {
    tailRecM: (f2) => (a2) => {
      const $0 = f2(a2);
      return () => {
        const $1 = $0();
        let r2 = $1;
        untilE(() => {
          const v = r2;
          if (v.tag === "Loop") {
            const e2 = f2(v._1)();
            r2 = e2;
            return false;
          }
          if (v.tag === "Done") {
            return true;
          }
          fail();
        })();
        const a$p = r2;
        if (a$p.tag === "Done") {
          return a$p._1;
        }
        fail();
      };
    },
    Monad0: () => monadEffect
  };

  // output-es/Data.Tuple/index.js
  var $Tuple = (_1, _2) => ({ tag: "Tuple", _1, _2 });
  var Tuple = (value0) => (value1) => $Tuple(value0, value1);
  var snd = (v) => v._2;
  var ringTuple = (dictRing) => {
    const $0 = dictRing.Semiring0();
    const one = $0.one;
    const semiringTuple1 = (() => {
      const zero = $0.zero;
      return (dictSemiring1) => ({
        add: (v) => (v1) => $Tuple($0.add(v._1)(v1._1), dictSemiring1.add(v._2)(v1._2)),
        one: $Tuple(one, dictSemiring1.one),
        mul: (v) => (v1) => $Tuple($0.mul(v._1)(v1._1), dictSemiring1.mul(v._2)(v1._2)),
        zero: $Tuple(zero, dictSemiring1.zero)
      });
    })();
    return (dictRing1) => {
      const semiringTuple2 = semiringTuple1(dictRing1.Semiring0());
      return { sub: (v) => (v1) => $Tuple(dictRing.sub(v._1)(v1._1), dictRing1.sub(v._2)(v1._2)), Semiring0: () => semiringTuple2 };
    };
  };
  var functorTuple = { map: (f2) => (m2) => $Tuple(m2._1, f2(m2._2)) };
  var fst = (v) => v._1;
  var ordTuple = (dictOrd) => {
    const $0 = dictOrd.Eq0();
    return (dictOrd1) => {
      const $1 = dictOrd1.Eq0();
      const eqTuple2 = { eq: (x2) => (y2) => $0.eq(x2._1)(y2._1) && $1.eq(x2._2)(y2._2) };
      return {
        compare: (x2) => (y2) => {
          const v = dictOrd.compare(x2._1)(y2._1);
          if (v === "LT") {
            return LT;
          }
          if (v === "GT") {
            return GT;
          }
          return dictOrd1.compare(x2._2)(y2._2);
        },
        Eq0: () => eqTuple2
      };
    };
  };

  // output-es/Control.Monad.Except.Trans/index.js
  var bindExceptT = (dictMonad) => ({
    bind: (v) => (k) => dictMonad.Bind1().bind(v)((v2) => {
      if (v2.tag === "Left") {
        return dictMonad.Applicative0().pure($Either("Left", v2._1));
      }
      if (v2.tag === "Right") {
        return k(v2._1);
      }
      fail();
    }),
    Apply0: () => applyExceptT(dictMonad)
  });
  var applyExceptT = (dictMonad) => {
    const $0 = dictMonad.Bind1().Apply0().Functor0();
    const functorExceptT1 = {
      map: (f2) => $0.map((m2) => {
        if (m2.tag === "Left") {
          return $Either("Left", m2._1);
        }
        if (m2.tag === "Right") {
          return $Either("Right", f2(m2._1));
        }
        fail();
      })
    };
    return {
      apply: (() => {
        const $1 = bindExceptT(dictMonad);
        return (f2) => (a2) => $1.bind(f2)((f$p) => $1.bind(a2)((a$p) => applicativeExceptT(dictMonad).pure(f$p(a$p))));
      })(),
      Functor0: () => functorExceptT1
    };
  };
  var applicativeExceptT = (dictMonad) => ({ pure: (x2) => dictMonad.Applicative0().pure($Either("Right", x2)), Apply0: () => applyExceptT(dictMonad) });
  var monadEffectExceptT = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const monadExceptT1 = { Applicative0: () => applicativeExceptT(Monad0), Bind1: () => bindExceptT(Monad0) };
    return { liftEffect: (x2) => Monad0.Bind1().bind(dictMonadEffect.liftEffect(x2))((a2) => Monad0.Applicative0().pure($Either("Right", a2))), Monad0: () => monadExceptT1 };
  };
  var monadStateExceptT = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const monadExceptT1 = { Applicative0: () => applicativeExceptT(Monad0), Bind1: () => bindExceptT(Monad0) };
    return { state: (f2) => Monad0.Bind1().bind(dictMonadState.state(f2))((a2) => Monad0.Applicative0().pure($Either("Right", a2))), Monad0: () => monadExceptT1 };
  };
  var monadThrowExceptT = (dictMonad) => {
    const monadExceptT1 = { Applicative0: () => applicativeExceptT(dictMonad), Bind1: () => bindExceptT(dictMonad) };
    return { throwError: (x2) => dictMonad.Applicative0().pure($Either("Left", x2)), Monad0: () => monadExceptT1 };
  };
  var monadErrorExceptT = (dictMonad) => {
    const monadThrowExceptT1 = monadThrowExceptT(dictMonad);
    return {
      catchError: (v) => (k) => dictMonad.Bind1().bind(v)((v2) => {
        if (v2.tag === "Left") {
          return k(v2._1);
        }
        if (v2.tag === "Right") {
          return dictMonad.Applicative0().pure($Either("Right", v2._1));
        }
        fail();
      }),
      MonadThrow0: () => monadThrowExceptT1
    };
  };
  var altExceptT = (dictSemigroup) => (dictMonad) => {
    const Bind1 = dictMonad.Bind1();
    const $0 = dictMonad.Applicative0();
    const $1 = Bind1.Apply0().Functor0();
    const functorExceptT1 = {
      map: (f2) => $1.map((m2) => {
        if (m2.tag === "Left") {
          return $Either("Left", m2._1);
        }
        if (m2.tag === "Right") {
          return $Either("Right", f2(m2._1));
        }
        fail();
      })
    };
    return {
      alt: (v) => (v1) => Bind1.bind(v)((rm) => {
        if (rm.tag === "Right") {
          return $0.pure($Either("Right", rm._1));
        }
        if (rm.tag === "Left") {
          const $2 = rm._1;
          return Bind1.bind(v1)((rn) => {
            if (rn.tag === "Right") {
              return $0.pure($Either("Right", rn._1));
            }
            if (rn.tag === "Left") {
              return $0.pure($Either("Left", dictSemigroup.append($2)(rn._1)));
            }
            fail();
          });
        }
        fail();
      }),
      Functor0: () => functorExceptT1
    };
  };

  // output-es/Control.Monad.Maybe.Trans/index.js
  var bindMaybeT = (dictMonad) => ({
    bind: (v) => (f2) => dictMonad.Bind1().bind(v)((v1) => {
      if (v1.tag === "Nothing") {
        return dictMonad.Applicative0().pure(Nothing);
      }
      if (v1.tag === "Just") {
        return f2(v1._1);
      }
      fail();
    }),
    Apply0: () => applyMaybeT(dictMonad)
  });
  var applyMaybeT = (dictMonad) => {
    const $0 = dictMonad.Bind1().Apply0().Functor0();
    const functorMaybeT1 = { map: (f2) => (v) => $0.map(functorMaybe.map(f2))(v) };
    return {
      apply: (() => {
        const $1 = bindMaybeT(dictMonad);
        return (f2) => (a2) => $1.bind(f2)((f$p) => $1.bind(a2)((a$p) => applicativeMaybeT(dictMonad).pure(f$p(a$p))));
      })(),
      Functor0: () => functorMaybeT1
    };
  };
  var applicativeMaybeT = (dictMonad) => ({ pure: (x2) => dictMonad.Applicative0().pure($Maybe("Just", x2)), Apply0: () => applyMaybeT(dictMonad) });
  var monadEffectMaybe = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const monadMaybeT1 = { Applicative0: () => applicativeMaybeT(Monad0), Bind1: () => bindMaybeT(Monad0) };
    return { liftEffect: (x2) => Monad0.Bind1().bind(dictMonadEffect.liftEffect(x2))((a$p) => Monad0.Applicative0().pure($Maybe("Just", a$p))), Monad0: () => monadMaybeT1 };
  };
  var monadStateMaybeT = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const monadMaybeT1 = { Applicative0: () => applicativeMaybeT(Monad0), Bind1: () => bindMaybeT(Monad0) };
    return { state: (f2) => Monad0.Bind1().bind(dictMonadState.state(f2))((a$p) => Monad0.Applicative0().pure($Maybe("Just", a$p))), Monad0: () => monadMaybeT1 };
  };

  // output-es/Control.Monad.State.Trans/index.js
  var evalStateT = (dictFunctor) => (v) => (s2) => dictFunctor.map(fst)(v(s2));
  var bindStateT = (dictMonad) => ({ bind: (v) => (f2) => (s2) => dictMonad.Bind1().bind(v(s2))((v1) => f2(v1._1)(v1._2)), Apply0: () => applyStateT(dictMonad) });
  var applyStateT = (dictMonad) => {
    const $0 = dictMonad.Bind1().Apply0().Functor0();
    const functorStateT1 = { map: (f2) => (v) => (s2) => $0.map((v1) => $Tuple(f2(v1._1), v1._2))(v(s2)) };
    return {
      apply: (() => {
        const $1 = bindStateT(dictMonad);
        return (f2) => (a2) => $1.bind(f2)((f$p) => $1.bind(a2)((a$p) => applicativeStateT(dictMonad).pure(f$p(a$p))));
      })(),
      Functor0: () => functorStateT1
    };
  };
  var applicativeStateT = (dictMonad) => ({ pure: (a2) => (s2) => dictMonad.Applicative0().pure($Tuple(a2, s2)), Apply0: () => applyStateT(dictMonad) });
  var monadStateStateT = (dictMonad) => {
    const monadStateT1 = { Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) };
    return { state: (f2) => (x2) => dictMonad.Applicative0().pure(f2(x2)), Monad0: () => monadStateT1 };
  };
  var monadThrowStateT = (dictMonadThrow) => {
    const Monad0 = dictMonadThrow.Monad0();
    const monadStateT1 = { Applicative0: () => applicativeStateT(Monad0), Bind1: () => bindStateT(Monad0) };
    return {
      throwError: (e2) => {
        const $0 = dictMonadThrow.throwError(e2);
        return (s2) => Monad0.Bind1().bind($0)((x2) => Monad0.Applicative0().pure($Tuple(x2, s2)));
      },
      Monad0: () => monadStateT1
    };
  };
  var monadErrorStateT = (dictMonadError) => {
    const monadThrowStateT1 = monadThrowStateT(dictMonadError.MonadThrow0());
    return { catchError: (v) => (h2) => (s2) => dictMonadError.catchError(v(s2))((e2) => h2(e2)(s2)), MonadThrow0: () => monadThrowStateT1 };
  };

  // output-es/Control.Monad.Writer.Trans/index.js
  var bindWriterT = (dictSemigroup) => (dictBind) => {
    const Apply0 = dictBind.Apply0();
    const Functor0 = Apply0.Functor0();
    const functorWriterT1 = { map: (f2) => Functor0.map((v) => $Tuple(f2(v._1), v._2)) };
    const applyWriterT2 = {
      apply: (v) => (v1) => Apply0.apply(Functor0.map((v3) => (v4) => $Tuple(v3._1(v4._1), dictSemigroup.append(v3._2)(v4._2)))(v))(v1),
      Functor0: () => functorWriterT1
    };
    return {
      bind: (v) => (k) => dictBind.bind(v)((v1) => {
        const $0 = v1._2;
        return Apply0.Functor0().map((v3) => $Tuple(v3._1, dictSemigroup.append($0)(v3._2)))(k(v1._1));
      }),
      Apply0: () => applyWriterT2
    };
  };
  var applicativeWriterT = (dictMonoid) => {
    const mempty2 = dictMonoid.mempty;
    const $0 = dictMonoid.Semigroup0();
    return (dictApplicative) => {
      const $1 = dictApplicative.Apply0();
      const Functor0 = $1.Functor0();
      const applyWriterT2 = (() => {
        const functorWriterT1 = { map: (f2) => Functor0.map((v) => $Tuple(f2(v._1), v._2)) };
        return { apply: (v) => (v1) => $1.apply(Functor0.map((v3) => (v4) => $Tuple(v3._1(v4._1), $0.append(v3._2)(v4._2)))(v))(v1), Functor0: () => functorWriterT1 };
      })();
      return { pure: (a2) => dictApplicative.pure($Tuple(a2, mempty2)), Apply0: () => applyWriterT2 };
    };
  };
  var monadWriterT = (dictMonoid) => {
    const applicativeWriterT1 = applicativeWriterT(dictMonoid);
    const bindWriterT1 = bindWriterT(dictMonoid.Semigroup0());
    return (dictMonad) => {
      const applicativeWriterT22 = applicativeWriterT1(dictMonad.Applicative0());
      const bindWriterT2 = bindWriterT1(dictMonad.Bind1());
      return { Applicative0: () => applicativeWriterT22, Bind1: () => bindWriterT2 };
    };
  };
  var monadStateWriterT = (dictMonoid) => {
    const mempty2 = dictMonoid.mempty;
    const monadWriterT1 = monadWriterT(dictMonoid);
    return (dictMonadState) => {
      const Monad0 = dictMonadState.Monad0();
      const monadWriterT2 = monadWriterT1(Monad0);
      return { state: (f2) => Monad0.Bind1().bind(dictMonadState.state(f2))((a2) => Monad0.Applicative0().pure($Tuple(a2, mempty2))), Monad0: () => monadWriterT2 };
    };
  };
  var monadTellWriterT = (dictMonoid) => {
    const Semigroup0 = dictMonoid.Semigroup0();
    const monadWriterT1 = monadWriterT(dictMonoid);
    return (dictMonad) => {
      const monadWriterT2 = monadWriterT1(dictMonad);
      return {
        tell: (() => {
          const $0 = Tuple();
          return (x2) => dictMonad.Applicative0().pure($0(x2));
        })(),
        Semigroup0: () => Semigroup0,
        Monad1: () => monadWriterT2
      };
    };
  };

  // output-es/Effect.Aff.Class/index.js
  var monadAffAff = { liftAff: (x2) => x2, MonadEffect0: () => monadEffectAff };
  var monadAffExceptT = (dictMonadAff) => {
    const MonadEffect0 = dictMonadAff.MonadEffect0();
    const monadEffectExceptT2 = monadEffectExceptT(MonadEffect0);
    return {
      liftAff: (() => {
        const $0 = MonadEffect0.Monad0();
        return (x2) => $0.Bind1().bind(dictMonadAff.liftAff(x2))((a2) => $0.Applicative0().pure($Either("Right", a2)));
      })(),
      MonadEffect0: () => monadEffectExceptT2
    };
  };
  var monadAffReader = (dictMonadAff) => {
    const monadEffectReader3 = monadEffectReader(dictMonadAff.MonadEffect0());
    return {
      liftAff: (x2) => {
        const $0 = dictMonadAff.liftAff(x2);
        return (v) => $0;
      },
      MonadEffect0: () => monadEffectReader3
    };
  };

  // output-es/Data.NonEmpty/index.js
  var $NonEmpty = (_1, _2) => ({ tag: "NonEmpty", _1, _2 });

  // output-es/Data.List.Types/index.js
  var $List = (tag, _1, _2) => ({ tag, _1, _2 });
  var Nil = /* @__PURE__ */ $List("Nil");
  var Cons = (value0) => (value1) => $List("Cons", value0, value1);
  var listMap = (f2) => {
    const chunkedRevMap = (chunkedRevMap$a0$copy) => (chunkedRevMap$a1$copy) => {
      let chunkedRevMap$a0 = chunkedRevMap$a0$copy, chunkedRevMap$a1 = chunkedRevMap$a1$copy, chunkedRevMap$c = true, chunkedRevMap$r;
      while (chunkedRevMap$c) {
        const v = chunkedRevMap$a0, v1 = chunkedRevMap$a1;
        if (v1.tag === "Cons" && v1._2.tag === "Cons" && v1._2._2.tag === "Cons") {
          chunkedRevMap$a0 = $List("Cons", v1, v);
          chunkedRevMap$a1 = v1._2._2._2;
          continue;
        }
        const reverseUnrolledMap = (reverseUnrolledMap$a0$copy) => (reverseUnrolledMap$a1$copy) => {
          let reverseUnrolledMap$a0 = reverseUnrolledMap$a0$copy, reverseUnrolledMap$a1 = reverseUnrolledMap$a1$copy, reverseUnrolledMap$c = true, reverseUnrolledMap$r;
          while (reverseUnrolledMap$c) {
            const v2 = reverseUnrolledMap$a0, v3 = reverseUnrolledMap$a1;
            if (v2.tag === "Cons" && v2._1.tag === "Cons" && v2._1._2.tag === "Cons" && v2._1._2._2.tag === "Cons") {
              reverseUnrolledMap$a0 = v2._2;
              reverseUnrolledMap$a1 = $List("Cons", f2(v2._1._1), $List("Cons", f2(v2._1._2._1), $List("Cons", f2(v2._1._2._2._1), v3)));
              continue;
            }
            reverseUnrolledMap$c = false;
            reverseUnrolledMap$r = v3;
          }
          return reverseUnrolledMap$r;
        };
        chunkedRevMap$c = false;
        chunkedRevMap$r = reverseUnrolledMap(v)((() => {
          if (v1.tag === "Cons") {
            if (v1._2.tag === "Cons") {
              if (v1._2._2.tag === "Nil") {
                return $List("Cons", f2(v1._1), $List("Cons", f2(v1._2._1), Nil));
              }
              return Nil;
            }
            if (v1._2.tag === "Nil") {
              return $List("Cons", f2(v1._1), Nil);
            }
          }
          return Nil;
        })());
      }
      return chunkedRevMap$r;
    };
    return chunkedRevMap(Nil);
  };
  var foldableList = {
    foldr: (f2) => (b) => {
      const $0 = foldableList.foldl((b$1) => (a2) => f2(a2)(b$1))(b);
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const v = go$a0, v1 = go$a1;
          if (v1.tag === "Nil") {
            go$c = false;
            go$r = v;
            continue;
          }
          if (v1.tag === "Cons") {
            go$a0 = $List("Cons", v1._1, v);
            go$a1 = v1._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      const $1 = go(Nil);
      return (x2) => $0($1(x2));
    },
    foldl: (f2) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, v = go$a1;
          if (v.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v.tag === "Cons") {
            go$a0 = f2(b)(v._1);
            go$a1 = v._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return go;
    },
    foldMap: (dictMonoid) => {
      const mempty2 = dictMonoid.mempty;
      return (f2) => foldableList.foldl((acc) => {
        const $0 = dictMonoid.Semigroup0().append(acc);
        return (x2) => $0(f2(x2));
      })(mempty2);
    }
  };
  var semigroupList = { append: (xs) => (ys) => foldableList.foldr(Cons)(ys)(xs) };
  var monoidList = { mempty: Nil, Semigroup0: () => semigroupList };
  var unfoldable1List = {
    unfoldr1: (f2) => (b) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const source2 = go$a0, memo = go$a1;
          const v = f2(source2);
          if (v._2.tag === "Just") {
            go$a0 = v._2._1;
            go$a1 = $List("Cons", v._1, memo);
            continue;
          }
          if (v._2.tag === "Nothing") {
            const go$1 = (go$1$a0$copy) => (go$1$a1$copy) => {
              let go$1$a0 = go$1$a0$copy, go$1$a1 = go$1$a1$copy, go$1$c = true, go$1$r;
              while (go$1$c) {
                const b$1 = go$1$a0, v$1 = go$1$a1;
                if (v$1.tag === "Nil") {
                  go$1$c = false;
                  go$1$r = b$1;
                  continue;
                }
                if (v$1.tag === "Cons") {
                  go$1$a0 = $List("Cons", v$1._1, b$1);
                  go$1$a1 = v$1._2;
                  continue;
                }
                fail();
              }
              return go$1$r;
            };
            go$c = false;
            go$r = go$1(Nil)($List("Cons", v._1, memo));
            continue;
          }
          fail();
        }
        return go$r;
      };
      return go(b)(Nil);
    }
  };
  var unfoldableList = {
    unfoldr: (f2) => (b) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const source2 = go$a0, memo = go$a1;
          const v = f2(source2);
          if (v.tag === "Nothing") {
            const go$1 = (go$1$a0$copy) => (go$1$a1$copy) => {
              let go$1$a0 = go$1$a0$copy, go$1$a1 = go$1$a1$copy, go$1$c = true, go$1$r;
              while (go$1$c) {
                const b$1 = go$1$a0, v$1 = go$1$a1;
                if (v$1.tag === "Nil") {
                  go$1$c = false;
                  go$1$r = b$1;
                  continue;
                }
                if (v$1.tag === "Cons") {
                  go$1$a0 = $List("Cons", v$1._1, b$1);
                  go$1$a1 = v$1._2;
                  continue;
                }
                fail();
              }
              return go$1$r;
            };
            go$c = false;
            go$r = go$1(Nil)(memo);
            continue;
          }
          if (v.tag === "Just") {
            go$a0 = v._1._2;
            go$a1 = $List("Cons", v._1._1, memo);
            continue;
          }
          fail();
        }
        return go$r;
      };
      return go(b)(Nil);
    },
    Unfoldable10: () => unfoldable1List
  };
  var eq1List = {
    eq1: (dictEq) => (xs) => (ys) => {
      const go = (v) => (v1) => (v2) => {
        if (!v2) {
          return false;
        }
        if (v.tag === "Nil") {
          return v1.tag === "Nil" && v2;
        }
        return v.tag === "Cons" && v1.tag === "Cons" && go(v._2)(v1._2)(v2 && dictEq.eq(v1._1)(v._1));
      };
      return go(xs)(ys)(true);
    }
  };
  var ord1List = {
    compare1: (dictOrd) => (xs) => (ys) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const v = go$a0, v1 = go$a1;
          if (v.tag === "Nil") {
            if (v1.tag === "Nil") {
              go$c = false;
              go$r = EQ;
              continue;
            }
            go$c = false;
            go$r = LT;
            continue;
          }
          if (v1.tag === "Nil") {
            go$c = false;
            go$r = GT;
            continue;
          }
          if (v.tag === "Cons" && v1.tag === "Cons") {
            const v2 = dictOrd.compare(v._1)(v1._1);
            if (v2 === "EQ") {
              go$a0 = v._2;
              go$a1 = v1._2;
              continue;
            }
            go$c = false;
            go$r = v2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return go(xs)(ys);
    },
    Eq10: () => eq1List
  };
  var ordList = (dictOrd) => {
    const $0 = dictOrd.Eq0();
    const eqList1 = {
      eq: (xs) => (ys) => {
        const go = (v) => (v1) => (v2) => {
          if (!v2) {
            return false;
          }
          if (v.tag === "Nil") {
            return v1.tag === "Nil" && v2;
          }
          return v.tag === "Cons" && v1.tag === "Cons" && go(v._2)(v1._2)(v2 && $0.eq(v1._1)(v._1));
        };
        return go(xs)(ys)(true);
      }
    };
    return { compare: ord1List.compare1(dictOrd), Eq0: () => eqList1 };
  };

  // output-es/Data.List/index.js
  var reverse = /* @__PURE__ */ (() => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0, v1 = go$a1;
        if (v1.tag === "Nil") {
          go$c = false;
          go$r = v;
          continue;
        }
        if (v1.tag === "Cons") {
          go$a0 = $List("Cons", v1._1, v);
          go$a1 = v1._2;
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go(Nil);
  })();
  var unsnoc = (lst) => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0, v1 = go$a1;
        if (v.tag === "Nil") {
          go$c = false;
          go$r = Nothing;
          continue;
        }
        if (v.tag === "Cons") {
          if (v._2.tag === "Nil") {
            go$c = false;
            go$r = $Maybe("Just", { revInit: v1, last: v._1 });
            continue;
          }
          go$a0 = v._2;
          go$a1 = $List("Cons", v._1, v1);
          continue;
        }
        fail();
      }
      return go$r;
    };
    const $0 = go(lst)(Nil);
    if ($0.tag === "Just") {
      return $Maybe("Just", { init: reverse($0._1.revInit), last: $0._1.last });
    }
    return Nothing;
  };
  var zipWith = (f2) => (xs) => (ys) => {
    const go = (go$a0$copy) => (go$a1$copy) => (go$a2$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$a2 = go$a2$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0, v1 = go$a1, v2 = go$a2;
        if (v.tag === "Nil") {
          go$c = false;
          go$r = v2;
          continue;
        }
        if (v1.tag === "Nil") {
          go$c = false;
          go$r = v2;
          continue;
        }
        if (v.tag === "Cons" && v1.tag === "Cons") {
          go$a0 = v._2;
          go$a1 = v1._2;
          go$a2 = $List("Cons", f2(v._1)(v1._1), v2);
          continue;
        }
        fail();
      }
      return go$r;
    };
    return reverse(go(xs)(ys)(Nil));
  };
  var range = (start) => (end3) => {
    if (start === end3) {
      return $List("Cons", start, Nil);
    }
    const go = (go$a0$copy) => (go$a1$copy) => (go$a2$copy) => (go$a3$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$a2 = go$a2$copy, go$a3 = go$a3$copy, go$c = true, go$r;
      while (go$c) {
        const s2 = go$a0, e2 = go$a1, step2 = go$a2, rest3 = go$a3;
        if (s2 === e2) {
          go$c = false;
          go$r = $List("Cons", s2, rest3);
          continue;
        }
        go$a0 = s2 + step2 | 0;
        go$a1 = e2;
        go$a2 = step2;
        go$a3 = $List("Cons", s2, rest3);
      }
      return go$r;
    };
    return go(end3)(start)(start > end3 ? 1 : -1)(Nil);
  };
  var deleteBy = (v) => (v1) => (v2) => {
    if (v2.tag === "Nil") {
      return Nil;
    }
    if (v2.tag === "Cons") {
      if (v(v1)(v2._1)) {
        return v2._2;
      }
      return $List("Cons", v2._1, deleteBy(v)(v1)(v2._2));
    }
    fail();
  };

  // output-es/Data.Traversable/foreign.js
  var traverseArrayImpl = function() {
    function array1(a2) {
      return [a2];
    }
    function array2(a2) {
      return function(b) {
        return [a2, b];
      };
    }
    function array3(a2) {
      return function(b) {
        return function(c2) {
          return [a2, b, c2];
        };
      };
    }
    function concat2(xs) {
      return function(ys) {
        return xs.concat(ys);
      };
    }
    return function(apply2) {
      return function(map3) {
        return function(pure) {
          return function(f2) {
            return function(array) {
              function go(bot, top) {
                switch (top - bot) {
                  case 0:
                    return pure([]);
                  case 1:
                    return map3(array1)(f2(array[bot]));
                  case 2:
                    return apply2(map3(array2)(f2(array[bot])))(f2(array[bot + 1]));
                  case 3:
                    return apply2(apply2(map3(array3)(f2(array[bot])))(f2(array[bot + 1])))(f2(array[bot + 2]));
                  default:
                    var pivot = bot + Math.floor((top - bot) / 4) * 2;
                    return apply2(map3(concat2)(go(bot, pivot)))(go(pivot, top));
                }
              }
              return go(0, array.length);
            };
          };
        };
      };
    };
  }();

  // output-es/Data.Traversable/index.js
  var identity5 = (x2) => x2;
  var traversableMaybe = {
    traverse: (dictApplicative) => (v) => (v1) => {
      if (v1.tag === "Nothing") {
        return dictApplicative.pure(Nothing);
      }
      if (v1.tag === "Just") {
        return dictApplicative.Apply0().Functor0().map(Just)(v(v1._1));
      }
      fail();
    },
    sequence: (dictApplicative) => (v) => {
      if (v.tag === "Nothing") {
        return dictApplicative.pure(Nothing);
      }
      if (v.tag === "Just") {
        return dictApplicative.Apply0().Functor0().map(Just)(v._1);
      }
      fail();
    },
    Functor0: () => functorMaybe,
    Foldable1: () => foldableMaybe
  };
  var traversableArray = {
    traverse: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      return traverseArrayImpl(Apply0.apply)(Apply0.Functor0().map)(dictApplicative.pure);
    },
    sequence: (dictApplicative) => traversableArray.traverse(dictApplicative)(identity5),
    Functor0: () => functorArray,
    Foldable1: () => foldableArray
  };

  // output-es/Data.CatQueue/index.js
  var $CatQueue = (_1, _2) => ({ tag: "CatQueue", _1, _2 });
  var uncons = (uncons$a0$copy) => {
    let uncons$a0 = uncons$a0$copy, uncons$c = true, uncons$r;
    while (uncons$c) {
      const v = uncons$a0;
      if (v._1.tag === "Nil") {
        if (v._2.tag === "Nil") {
          uncons$c = false;
          uncons$r = Nothing;
          continue;
        }
        uncons$a0 = $CatQueue(reverse(v._2), Nil);
        continue;
      }
      if (v._1.tag === "Cons") {
        uncons$c = false;
        uncons$r = $Maybe("Just", $Tuple(v._1._1, $CatQueue(v._1._2, v._2)));
        continue;
      }
      fail();
    }
    return uncons$r;
  };

  // output-es/Data.CatList/index.js
  var $CatList = (tag, _1, _2) => ({ tag, _1, _2 });
  var CatNil = /* @__PURE__ */ $CatList("CatNil");
  var link = (v) => (v1) => {
    if (v.tag === "CatNil") {
      return v1;
    }
    if (v1.tag === "CatNil") {
      return v;
    }
    if (v.tag === "CatCons") {
      return $CatList("CatCons", v._1, $CatQueue(v._2._1, $List("Cons", v1, v._2._2)));
    }
    fail();
  };
  var foldr = (k) => (b) => (q) => {
    const foldl = (foldl$a0$copy) => (foldl$a1$copy) => (foldl$a2$copy) => {
      let foldl$a0 = foldl$a0$copy, foldl$a1 = foldl$a1$copy, foldl$a2 = foldl$a2$copy, foldl$c = true, foldl$r;
      while (foldl$c) {
        const v = foldl$a0, v1 = foldl$a1, v2 = foldl$a2;
        if (v2.tag === "Nil") {
          foldl$c = false;
          foldl$r = v1;
          continue;
        }
        if (v2.tag === "Cons") {
          foldl$a0 = v;
          foldl$a1 = v(v1)(v2._1);
          foldl$a2 = v2._2;
          continue;
        }
        fail();
      }
      return foldl$r;
    };
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const xs = go$a0, ys = go$a1;
        const v = uncons(xs);
        if (v.tag === "Nothing") {
          go$c = false;
          go$r = foldl((x2) => (i2) => i2(x2))(b)(ys);
          continue;
        }
        if (v.tag === "Just") {
          go$a0 = v._1._2;
          go$a1 = $List("Cons", k(v._1._1), ys);
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go(q)(Nil);
  };
  var uncons2 = (v) => {
    if (v.tag === "CatNil") {
      return Nothing;
    }
    if (v.tag === "CatCons") {
      return $Maybe("Just", $Tuple(v._1, v._2._1.tag === "Nil" && v._2._2.tag === "Nil" ? CatNil : foldr(link)(CatNil)(v._2)));
    }
    fail();
  };
  var snoc = (cat) => (a2) => {
    if (cat.tag === "CatNil") {
      return $CatList("CatCons", a2, $CatQueue(Nil, Nil));
    }
    if (cat.tag === "CatCons") {
      return $CatList(
        "CatCons",
        cat._1,
        $CatQueue(
          cat._2._1,
          $List("Cons", $CatList("CatCons", a2, $CatQueue(Nil, Nil)), cat._2._2)
        )
      );
    }
    fail();
  };

  // output-es/Control.Monad.Free/index.js
  var $Free = (_1, _2) => ({ tag: "Free", _1, _2 });
  var $FreeView = (tag, _1, _2) => ({ tag, _1, _2 });
  var toView = (toView$a0$copy) => {
    let toView$a0 = toView$a0$copy, toView$c = true, toView$r;
    while (toView$c) {
      const v = toView$a0;
      if (v._1.tag === "Return") {
        const v2 = uncons2(v._2);
        if (v2.tag === "Nothing") {
          toView$c = false;
          toView$r = $FreeView("Return", v._1._1);
          continue;
        }
        if (v2.tag === "Just") {
          toView$a0 = (() => {
            const $0 = v2._1._1(v._1._1);
            return $Free(
              $0._1,
              (() => {
                if ($0._2.tag === "CatNil") {
                  return v2._1._2;
                }
                if (v2._1._2.tag === "CatNil") {
                  return $0._2;
                }
                if ($0._2.tag === "CatCons") {
                  return $CatList("CatCons", $0._2._1, $CatQueue($0._2._2._1, $List("Cons", v2._1._2, $0._2._2._2)));
                }
                fail();
              })()
            );
          })();
          continue;
        }
        fail();
      }
      if (v._1.tag === "Bind") {
        toView$c = false;
        toView$r = $FreeView(
          "Bind",
          v._1._1,
          (a2) => {
            const $0 = v._1._2(a2);
            return $Free(
              $0._1,
              (() => {
                if ($0._2.tag === "CatNil") {
                  return v._2;
                }
                if (v._2.tag === "CatNil") {
                  return $0._2;
                }
                if ($0._2.tag === "CatCons") {
                  return $CatList("CatCons", $0._2._1, $CatQueue($0._2._2._1, $List("Cons", v._2, $0._2._2._2)));
                }
                fail();
              })()
            );
          }
        );
        continue;
      }
      fail();
    }
    return toView$r;
  };
  var freeMonad = { Applicative0: () => freeApplicative, Bind1: () => freeBind };
  var freeFunctor = { map: (k) => (f2) => freeBind.bind(f2)((x2) => freeApplicative.pure(k(x2))) };
  var freeBind = { bind: (v) => (k) => $Free(v._1, snoc(v._2)(k)), Apply0: () => freeApply };
  var freeApply = {
    apply: (f2) => (a2) => $Free(f2._1, snoc(f2._2)((f$p) => $Free(a2._1, snoc(a2._2)((a$p) => freeApplicative.pure(f$p(a$p)))))),
    Functor0: () => freeFunctor
  };
  var freeApplicative = { pure: (x2) => $Free($FreeView("Return", x2), CatNil), Apply0: () => freeApply };
  var substFree = (k) => {
    const go = (f2) => {
      const v = toView(f2);
      if (v.tag === "Return") {
        return $Free($FreeView("Return", v._1), CatNil);
      }
      if (v.tag === "Bind") {
        const $0 = k(v._1);
        return $Free($0._1, snoc($0._2)((x2) => go(v._2(x2))));
      }
      fail();
    };
    return go;
  };
  var hoistFree = (k) => substFree((x2) => $Free($FreeView("Bind", k(x2), (x$1) => $Free($FreeView("Return", x$1), CatNil)), CatNil));
  var foldFree = (dictMonadRec) => {
    const Monad0 = dictMonadRec.Monad0();
    const $0 = Monad0.Bind1().Apply0().Functor0();
    return (k) => dictMonadRec.tailRecM((f2) => {
      const v = toView(f2);
      if (v.tag === "Return") {
        return $0.map(Done)(Monad0.Applicative0().pure(v._1));
      }
      if (v.tag === "Bind") {
        return $0.map((x2) => $Step("Loop", v._2(x2)))(k(v._1));
      }
      fail();
    });
  };

  // output-es/Data.Bifunctor/index.js
  var identity7 = (x2) => x2;
  var bifunctorTuple = { bimap: (f2) => (g2) => (v) => $Tuple(f2(v._1), g2(v._2)) };

  // output-es/Data.Unfoldable1/foreign.js
  var unfoldr1ArrayImpl = function(isNothing2) {
    return function(fromJust3) {
      return function(fst2) {
        return function(snd2) {
          return function(f2) {
            return function(b) {
              var result = [];
              var value2 = b;
              while (true) {
                var tuple = f2(value2);
                result.push(fst2(tuple));
                var maybe = snd2(tuple);
                if (isNothing2(maybe))
                  return result;
                value2 = fromJust3(maybe);
              }
            };
          };
        };
      };
    };
  };

  // output-es/Data.Unfoldable1/index.js
  var fromJust = (v) => {
    if (v.tag === "Just") {
      return v._1;
    }
    fail();
  };
  var unfoldable1Array = { unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust)(fst)(snd) };
  var replicate1 = (dictUnfoldable1) => (n2) => (v) => dictUnfoldable1.unfoldr1((i2) => {
    if (i2 <= 0) {
      return $Tuple(v, Nothing);
    }
    return $Tuple(v, $Maybe("Just", i2 - 1 | 0));
  })(n2 - 1 | 0);

  // output-es/Data.Unfoldable/foreign.js
  var unfoldrArrayImpl = function(isNothing2) {
    return function(fromJust3) {
      return function(fst2) {
        return function(snd2) {
          return function(f2) {
            return function(b) {
              var result = [];
              var value2 = b;
              while (true) {
                var maybe = f2(value2);
                if (isNothing2(maybe))
                  return result;
                var tuple = fromJust3(maybe);
                result.push(fst2(tuple));
                value2 = snd2(tuple);
              }
            };
          };
        };
      };
    };
  };

  // output-es/Data.Unfoldable/index.js
  var fromJust2 = (v) => {
    if (v.tag === "Just") {
      return v._1;
    }
    fail();
  };
  var unfoldableArray = {
    unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust2)(fst)(snd),
    Unfoldable10: () => unfoldable1Array
  };
  var replicate = (dictUnfoldable) => (n2) => (v) => dictUnfoldable.unfoldr((i2) => {
    if (i2 <= 0) {
      return Nothing;
    }
    return $Maybe("Just", $Tuple(v, i2 - 1 | 0));
  })(n2);

  // output-es/Data.Map.Internal/index.js
  var $$$Map = (tag, _1, _2, _3, _4, _5, _6) => ({ tag, _1, _2, _3, _4, _5, _6 });
  var $MapIter = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
  var $MapIterStep = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
  var $Split = (_1, _2, _3) => ({ tag: "Split", _1, _2, _3 });
  var $SplitLast = (_1, _2, _3) => ({ tag: "SplitLast", _1, _2, _3 });
  var identity8 = (x2) => x2;
  var Leaf2 = /* @__PURE__ */ $$$Map("Leaf");
  var IterLeaf = /* @__PURE__ */ $MapIter("IterLeaf");
  var IterDone = /* @__PURE__ */ $MapIterStep("IterDone");
  var unsafeNode = (k, v, l2, r2) => {
    if (l2.tag === "Leaf") {
      if (r2.tag === "Leaf") {
        return $$$Map("Node", 1, 1, k, v, l2, r2);
      }
      if (r2.tag === "Node") {
        return $$$Map("Node", 1 + r2._1 | 0, 1 + r2._2 | 0, k, v, l2, r2);
      }
      fail();
    }
    if (l2.tag === "Node") {
      if (r2.tag === "Leaf") {
        return $$$Map("Node", 1 + l2._1 | 0, 1 + l2._2 | 0, k, v, l2, r2);
      }
      if (r2.tag === "Node") {
        return $$$Map("Node", l2._1 > r2._1 ? 1 + l2._1 | 0 : 1 + r2._1 | 0, (1 + l2._2 | 0) + r2._2 | 0, k, v, l2, r2);
      }
    }
    fail();
  };
  var singleton = (k) => (v) => $$$Map("Node", 1, 1, k, v, Leaf2, Leaf2);
  var unsafeBalancedNode = (k, v, l2, r2) => {
    if (l2.tag === "Leaf") {
      if (r2.tag === "Leaf") {
        return $$$Map("Node", 1, 1, k, v, Leaf2, Leaf2);
      }
      if (r2.tag === "Node" && r2._1 > 1) {
        if (r2._5.tag === "Node" && (() => {
          if (r2._6.tag === "Leaf") {
            return r2._5._1 > 0;
          }
          if (r2._6.tag === "Node") {
            return r2._5._1 > r2._6._1;
          }
          fail();
        })()) {
          return unsafeNode(r2._5._3, r2._5._4, unsafeNode(k, v, l2, r2._5._5), unsafeNode(r2._3, r2._4, r2._5._6, r2._6));
        }
        return unsafeNode(r2._3, r2._4, unsafeNode(k, v, l2, r2._5), r2._6);
      }
      return unsafeNode(k, v, l2, r2);
    }
    if (l2.tag === "Node") {
      if (r2.tag === "Node") {
        if (r2._1 > (l2._1 + 1 | 0)) {
          if (r2._5.tag === "Node" && (() => {
            if (r2._6.tag === "Leaf") {
              return r2._5._1 > 0;
            }
            if (r2._6.tag === "Node") {
              return r2._5._1 > r2._6._1;
            }
            fail();
          })()) {
            return unsafeNode(r2._5._3, r2._5._4, unsafeNode(k, v, l2, r2._5._5), unsafeNode(r2._3, r2._4, r2._5._6, r2._6));
          }
          return unsafeNode(r2._3, r2._4, unsafeNode(k, v, l2, r2._5), r2._6);
        }
        if (l2._1 > (r2._1 + 1 | 0)) {
          if (l2._6.tag === "Node" && (() => {
            if (l2._5.tag === "Leaf") {
              return 0 <= l2._6._1;
            }
            if (l2._5.tag === "Node") {
              return l2._5._1 <= l2._6._1;
            }
            fail();
          })()) {
            return unsafeNode(l2._6._3, l2._6._4, unsafeNode(l2._3, l2._4, l2._5, l2._6._5), unsafeNode(k, v, l2._6._6, r2));
          }
          return unsafeNode(l2._3, l2._4, l2._5, unsafeNode(k, v, l2._6, r2));
        }
        return unsafeNode(k, v, l2, r2);
      }
      if (r2.tag === "Leaf" && l2._1 > 1) {
        if (l2._6.tag === "Node" && (() => {
          if (l2._5.tag === "Leaf") {
            return 0 <= l2._6._1;
          }
          if (l2._5.tag === "Node") {
            return l2._5._1 <= l2._6._1;
          }
          fail();
        })()) {
          return unsafeNode(l2._6._3, l2._6._4, unsafeNode(l2._3, l2._4, l2._5, l2._6._5), unsafeNode(k, v, l2._6._6, r2));
        }
        return unsafeNode(l2._3, l2._4, l2._5, unsafeNode(k, v, l2._6, r2));
      }
      return unsafeNode(k, v, l2, r2);
    }
    fail();
  };
  var unsafeSplit = (comp, k, m2) => {
    if (m2.tag === "Leaf") {
      return $Split(Nothing, Leaf2, Leaf2);
    }
    if (m2.tag === "Node") {
      const v = comp(k)(m2._3);
      if (v === "LT") {
        const v1 = unsafeSplit(comp, k, m2._5);
        return $Split(v1._1, v1._2, unsafeBalancedNode(m2._3, m2._4, v1._3, m2._6));
      }
      if (v === "GT") {
        const v1 = unsafeSplit(comp, k, m2._6);
        return $Split(v1._1, unsafeBalancedNode(m2._3, m2._4, m2._5, v1._2), v1._3);
      }
      if (v === "EQ") {
        return $Split($Maybe("Just", m2._4), m2._5, m2._6);
      }
    }
    fail();
  };
  var unsafeSplitLast = (k, v, l2, r2) => {
    if (r2.tag === "Leaf") {
      return $SplitLast(k, v, l2);
    }
    if (r2.tag === "Node") {
      const v1 = unsafeSplitLast(r2._3, r2._4, r2._5, r2._6);
      return $SplitLast(v1._1, v1._2, unsafeBalancedNode(k, v, l2, v1._3));
    }
    fail();
  };
  var unsafeJoinNodes = (v, v1) => {
    if (v.tag === "Leaf") {
      return v1;
    }
    if (v.tag === "Node") {
      const v2 = unsafeSplitLast(v._3, v._4, v._5, v._6);
      return unsafeBalancedNode(v2._1, v2._2, v2._3, v1);
    }
    fail();
  };
  var unsafeUnionWith = (comp, app, l2, r2) => {
    if (l2.tag === "Leaf") {
      return r2;
    }
    if (r2.tag === "Leaf") {
      return l2;
    }
    if (r2.tag === "Node") {
      const v = unsafeSplit(comp, r2._3, l2);
      const l$p = unsafeUnionWith(comp, app, v._2, r2._5);
      const r$p = unsafeUnionWith(comp, app, v._3, r2._6);
      if (v._1.tag === "Just") {
        return unsafeBalancedNode(r2._3, app(v._1._1)(r2._4), l$p, r$p);
      }
      if (v._1.tag === "Nothing") {
        return unsafeBalancedNode(r2._3, r2._4, l$p, r$p);
      }
    }
    fail();
  };
  var update = (dictOrd) => (f2) => (k) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf2;
      }
      if (v.tag === "Node") {
        const v1 = dictOrd.compare(k)(v._3);
        if (v1 === "LT") {
          return unsafeBalancedNode(v._3, v._4, go(v._5), v._6);
        }
        if (v1 === "GT") {
          return unsafeBalancedNode(v._3, v._4, v._5, go(v._6));
        }
        if (v1 === "EQ") {
          const v2 = f2(v._4);
          if (v2.tag === "Nothing") {
            return unsafeJoinNodes(v._5, v._6);
          }
          if (v2.tag === "Just") {
            return $$$Map("Node", v._1, v._2, v._3, v2._1, v._5, v._6);
          }
        }
      }
      fail();
    };
    return go;
  };
  var pop = (dictOrd) => {
    const compare = dictOrd.compare;
    return (k) => (m2) => {
      const v = unsafeSplit(compare, k, m2);
      if (v._1.tag === "Just") {
        return $Maybe("Just", $Tuple(v._1._1, unsafeJoinNodes(v._2, v._3)));
      }
      return Nothing;
    };
  };
  var mapMaybeWithKey = (dictOrd) => (f2) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf2;
      }
      if (v.tag === "Node") {
        const v2 = f2(v._3)(v._4);
        if (v2.tag === "Just") {
          return unsafeBalancedNode(v._3, v2._1, go(v._5), go(v._6));
        }
        if (v2.tag === "Nothing") {
          return unsafeJoinNodes(go(v._5), go(v._6));
        }
      }
      fail();
    };
    return go;
  };
  var lookup = (dictOrd) => (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = Nothing;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = dictOrd.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = $Maybe("Just", v._4);
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var stepAscCps = (next) => (done) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "IterLeaf") {
          go$c = false;
          go$r = done();
          continue;
        }
        if (v.tag === "IterEmit") {
          go$c = false;
          go$r = next(v._1, v._2, v._3);
          continue;
        }
        if (v.tag === "IterNode") {
          go$a0 = (() => {
            const go$1 = (go$1$a0$copy) => (go$1$a1$copy) => {
              let go$1$a0 = go$1$a0$copy, go$1$a1 = go$1$a1$copy, go$1$c = true, go$1$r;
              while (go$1$c) {
                const iter = go$1$a0, v$1 = go$1$a1;
                if (v$1.tag === "Leaf") {
                  go$1$c = false;
                  go$1$r = iter;
                  continue;
                }
                if (v$1.tag === "Node") {
                  if (v$1._6.tag === "Leaf") {
                    go$1$a0 = $MapIter("IterEmit", v$1._3, v$1._4, iter);
                    go$1$a1 = v$1._5;
                    continue;
                  }
                  go$1$a0 = $MapIter("IterEmit", v$1._3, v$1._4, $MapIter("IterNode", v$1._6, iter));
                  go$1$a1 = v$1._5;
                  continue;
                }
                fail();
              }
              return go$1$r;
            };
            return go$1(v._2)(v._1);
          })();
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var stepAsc = /* @__PURE__ */ stepAscCps((k, v, next) => $MapIterStep("IterNext", k, v, next))((v) => IterDone);
  var eqMapIter = (dictEq) => (dictEq1) => ({
    eq: (() => {
      const go = (a2) => (b) => {
        const v = stepAsc(a2);
        if (v.tag === "IterNext") {
          const v2 = stepAsc(b);
          return v2.tag === "IterNext" && dictEq.eq(v._1)(v2._1) && dictEq1.eq(v._2)(v2._2) && go(v._3)(v2._3);
        }
        if (v.tag === "IterDone") {
          return true;
        }
        fail();
      };
      return go;
    })()
  });
  var ordMapIter = (dictOrd) => {
    const eqMapIter1 = eqMapIter(dictOrd.Eq0());
    return (dictOrd1) => {
      const eqMapIter2 = eqMapIter1(dictOrd1.Eq0());
      return {
        compare: (() => {
          const go = (go$a0$copy) => (go$a1$copy) => {
            let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
            while (go$c) {
              const a2 = go$a0, b = go$a1;
              const v = stepAsc(b);
              const v1 = stepAsc(a2);
              if (v1.tag === "IterNext") {
                if (v.tag === "IterNext") {
                  const v3 = dictOrd.compare(v1._1)(v._1);
                  if (v3 === "EQ") {
                    const v4 = dictOrd1.compare(v1._2)(v._2);
                    if (v4 === "EQ") {
                      go$a0 = v1._3;
                      go$a1 = v._3;
                      continue;
                    }
                    go$c = false;
                    go$r = v4;
                    continue;
                  }
                  go$c = false;
                  go$r = v3;
                  continue;
                }
                if (v.tag === "IterDone") {
                  go$c = false;
                  go$r = GT;
                  continue;
                }
                fail();
              }
              if (v1.tag === "IterDone") {
                if (v.tag === "IterDone") {
                  go$c = false;
                  go$r = EQ;
                  continue;
                }
                go$c = false;
                go$r = LT;
                continue;
              }
              if (v.tag === "IterDone") {
                go$c = false;
                go$r = GT;
                continue;
              }
              fail();
            }
            return go$r;
          };
          return go;
        })(),
        Eq0: () => eqMapIter2
      };
    };
  };
  var stepUnfoldr = /* @__PURE__ */ stepAscCps((k, v, next) => $Maybe("Just", $Tuple($Tuple(k, v), next)))((v) => Nothing);
  var toUnfoldable1 = /* @__PURE__ */ (() => {
    const $0 = unfoldableArray.unfoldr(stepUnfoldr);
    return (x2) => $0($MapIter("IterNode", x2, IterLeaf));
  })();
  var showMap = (dictShow) => (dictShow1) => {
    const show13 = showArrayImpl((v) => "(Tuple " + dictShow.show(v._1) + " " + dictShow1.show(v._2) + ")");
    return { show: (as2) => "(fromFoldable " + show13(toUnfoldable1(as2)) + ")" };
  };
  var insert = (dictOrd) => (k) => (v) => {
    const go = (v1) => {
      if (v1.tag === "Leaf") {
        return $$$Map("Node", 1, 1, k, v, Leaf2, Leaf2);
      }
      if (v1.tag === "Node") {
        const v2 = dictOrd.compare(k)(v1._3);
        if (v2 === "LT") {
          return unsafeBalancedNode(v1._3, v1._4, go(v1._5), v1._6);
        }
        if (v2 === "GT") {
          return unsafeBalancedNode(v1._3, v1._4, v1._5, go(v1._6));
        }
        if (v2 === "EQ") {
          return $$$Map("Node", v1._1, v1._2, k, v, v1._5, v1._6);
        }
      }
      fail();
    };
    return go;
  };
  var functorMap = {
    map: (f2) => {
      const go = (v) => {
        if (v.tag === "Leaf") {
          return Leaf2;
        }
        if (v.tag === "Node") {
          return $$$Map("Node", v._1, v._2, v._3, f2(v._4), go(v._5), go(v._6));
        }
        fail();
      };
      return go;
    }
  };
  var functorWithIndexMap = {
    mapWithIndex: (f2) => {
      const go = (v) => {
        if (v.tag === "Leaf") {
          return Leaf2;
        }
        if (v.tag === "Node") {
          return $$$Map("Node", v._1, v._2, v._3, f2(v._3)(v._4), go(v._5), go(v._6));
        }
        fail();
      };
      return go;
    },
    Functor0: () => functorMap
  };
  var foldableMap = {
    foldr: (f2) => (z) => {
      const go = (m$p, z$p) => {
        if (m$p.tag === "Leaf") {
          return z$p;
        }
        if (m$p.tag === "Node") {
          return go(m$p._5, f2(m$p._4)(go(m$p._6, z$p)));
        }
        fail();
      };
      return (m2) => go(m2, z);
    },
    foldl: (f2) => (z) => {
      const go = (z$p, m$p) => {
        if (m$p.tag === "Leaf") {
          return z$p;
        }
        if (m$p.tag === "Node") {
          return go(f2(go(z$p, m$p._5))(m$p._4), m$p._6);
        }
        fail();
      };
      return (m2) => go(z, m2);
    },
    foldMap: (dictMonoid) => {
      const mempty2 = dictMonoid.mempty;
      const $0 = dictMonoid.Semigroup0();
      return (f2) => {
        const go = (v) => {
          if (v.tag === "Leaf") {
            return mempty2;
          }
          if (v.tag === "Node") {
            return $0.append(go(v._5))($0.append(f2(v._4))(go(v._6)));
          }
          fail();
        };
        return go;
      };
    }
  };
  var foldableWithIndexMap = {
    foldrWithIndex: (f2) => (z) => {
      const go = (m$p, z$p) => {
        if (m$p.tag === "Leaf") {
          return z$p;
        }
        if (m$p.tag === "Node") {
          return go(m$p._5, f2(m$p._3)(m$p._4)(go(m$p._6, z$p)));
        }
        fail();
      };
      return (m2) => go(m2, z);
    },
    foldlWithIndex: (f2) => (z) => {
      const go = (z$p, m$p) => {
        if (m$p.tag === "Leaf") {
          return z$p;
        }
        if (m$p.tag === "Node") {
          return go(f2(m$p._3)(go(z$p, m$p._5))(m$p._4), m$p._6);
        }
        fail();
      };
      return (m2) => go(z, m2);
    },
    foldMapWithIndex: (dictMonoid) => {
      const mempty2 = dictMonoid.mempty;
      const $0 = dictMonoid.Semigroup0();
      return (f2) => {
        const go = (v) => {
          if (v.tag === "Leaf") {
            return mempty2;
          }
          if (v.tag === "Node") {
            return $0.append(go(v._5))($0.append(f2(v._3)(v._4))(go(v._6)));
          }
          fail();
        };
        return go;
      };
    },
    Foldable0: () => foldableMap
  };
  var keys = /* @__PURE__ */ (() => {
    const go = (m$p, z$p) => {
      if (m$p.tag === "Leaf") {
        return z$p;
      }
      if (m$p.tag === "Node") {
        return go(m$p._5, $List("Cons", m$p._3, go(m$p._6, z$p)));
      }
      fail();
    };
    return (m2) => go(m2, Nil);
  })();
  var traversableMap = {
    traverse: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      return (f2) => {
        const go = (v) => {
          if (v.tag === "Leaf") {
            return dictApplicative.pure(Leaf2);
          }
          if (v.tag === "Node") {
            const $0 = v._1;
            const $1 = v._3;
            const $2 = v._2;
            return Apply0.apply(Apply0.apply(Apply0.Functor0().map((l$p) => (v$p) => (r$p) => $$$Map("Node", $0, $2, $1, v$p, l$p, r$p))(go(v._5)))(f2(v._4)))(go(v._6));
          }
          fail();
        };
        return go;
      };
    },
    sequence: (dictApplicative) => traversableMap.traverse(dictApplicative)(identity8),
    Functor0: () => functorMap,
    Foldable1: () => foldableMap
  };
  var traversableWithIndexMap = {
    traverseWithIndex: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      return (f2) => {
        const go = (v) => {
          if (v.tag === "Leaf") {
            return dictApplicative.pure(Leaf2);
          }
          if (v.tag === "Node") {
            const $0 = v._1;
            const $1 = v._3;
            const $2 = v._2;
            return Apply0.apply(Apply0.apply(Apply0.Functor0().map((l$p) => (v$p) => (r$p) => $$$Map("Node", $0, $2, $1, v$p, l$p, r$p))(go(v._5)))(f2($1)(v._4)))(go(v._6));
          }
          fail();
        };
        return go;
      };
    },
    FunctorWithIndex0: () => functorWithIndexMap,
    FoldableWithIndex1: () => foldableWithIndexMap,
    Traversable2: () => traversableMap
  };
  var values = /* @__PURE__ */ (() => {
    const go = (m$p, z$p) => {
      if (m$p.tag === "Leaf") {
        return z$p;
      }
      if (m$p.tag === "Node") {
        return go(m$p._5, $List("Cons", m$p._4, go(m$p._6, z$p)));
      }
      fail();
    };
    return (m2) => go(m2, Nil);
  })();
  var foldSubmapBy = (dictOrd) => (appendFn) => (memptyValue) => (kmin) => (kmax) => (f2) => {
    const tooSmall = (() => {
      if (kmin.tag === "Just") {
        const $0 = kmin._1;
        return (k) => dictOrd.compare(k)($0) === "LT";
      }
      if (kmin.tag === "Nothing") {
        return (v) => false;
      }
      fail();
    })();
    const tooLarge = (() => {
      if (kmax.tag === "Just") {
        const $0 = kmax._1;
        return (k) => dictOrd.compare(k)($0) === "GT";
      }
      if (kmax.tag === "Nothing") {
        return (v) => false;
      }
      fail();
    })();
    const inBounds = (() => {
      if (kmin.tag === "Just") {
        if (kmax.tag === "Just") {
          const $0 = kmax._1;
          const $1 = kmin._1;
          return (k) => dictOrd.compare($1)(k) !== "GT" && dictOrd.compare(k)($0) !== "GT";
        }
        if (kmax.tag === "Nothing") {
          const $0 = kmin._1;
          return (k) => dictOrd.compare($0)(k) !== "GT";
        }
        fail();
      }
      if (kmin.tag === "Nothing") {
        if (kmax.tag === "Just") {
          const $0 = kmax._1;
          return (k) => dictOrd.compare(k)($0) !== "GT";
        }
        if (kmax.tag === "Nothing") {
          return (v) => true;
        }
      }
      fail();
    })();
    const go = (v) => {
      if (v.tag === "Leaf") {
        return memptyValue;
      }
      if (v.tag === "Node") {
        return appendFn(appendFn(tooSmall(v._3) ? memptyValue : go(v._5))(inBounds(v._3) ? f2(v._3)(v._4) : memptyValue))(tooLarge(v._3) ? memptyValue : go(v._6));
      }
      fail();
    };
    return go;
  };
  var filterWithKey = (dictOrd) => (f2) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf2;
      }
      if (v.tag === "Node") {
        if (f2(v._3)(v._4)) {
          return unsafeBalancedNode(v._3, v._4, go(v._5), go(v._6));
        }
        return unsafeJoinNodes(go(v._5), go(v._6));
      }
      fail();
    };
    return go;
  };
  var filterKeys = (dictOrd) => (f2) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf2;
      }
      if (v.tag === "Node") {
        if (f2(v._3)) {
          return unsafeBalancedNode(v._3, v._4, go(v._5), go(v._6));
        }
        return unsafeJoinNodes(go(v._5), go(v._6));
      }
      fail();
    };
    return go;
  };
  var eqMap = (dictEq) => (dictEq1) => ({
    eq: (xs) => (ys) => {
      if (xs.tag === "Leaf") {
        return ys.tag === "Leaf";
      }
      if (xs.tag === "Node") {
        return ys.tag === "Node" && xs._2 === ys._2 && eqMapIter(dictEq)(dictEq1).eq($MapIter("IterNode", xs, IterLeaf))($MapIter("IterNode", ys, IterLeaf));
      }
      fail();
    }
  });
  var ordMap = (dictOrd) => {
    const ordMapIter1 = ordMapIter(dictOrd);
    const eqMap1 = eqMap(dictOrd.Eq0());
    return (dictOrd1) => {
      const eqMap2 = eqMap1(dictOrd1.Eq0());
      return {
        compare: (xs) => (ys) => {
          if (xs.tag === "Leaf") {
            if (ys.tag === "Leaf") {
              return EQ;
            }
            return LT;
          }
          if (ys.tag === "Leaf") {
            return GT;
          }
          return ordMapIter1(dictOrd1).compare($MapIter("IterNode", xs, IterLeaf))($MapIter("IterNode", ys, IterLeaf));
        },
        Eq0: () => eqMap2
      };
    };
  };
  var fromFoldable = (dictOrd) => (dictFoldable) => dictFoldable.foldl((m2) => (v) => insert(dictOrd)(v._1)(v._2)(m2))(Leaf2);
  var submap = (dictOrd) => {
    const compare = dictOrd.compare;
    return (kmin) => (kmax) => foldSubmapBy(dictOrd)((m1) => (m2) => unsafeUnionWith(compare, $$const, m1, m2))(Leaf2)(kmin)(kmax)(singleton);
  };
  var $$delete = (dictOrd) => (k) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf2;
      }
      if (v.tag === "Node") {
        const v1 = dictOrd.compare(k)(v._3);
        if (v1 === "LT") {
          return unsafeBalancedNode(v._3, v._4, go(v._5), v._6);
        }
        if (v1 === "GT") {
          return unsafeBalancedNode(v._3, v._4, v._5, go(v._6));
        }
        if (v1 === "EQ") {
          return unsafeJoinNodes(v._5, v._6);
        }
      }
      fail();
    };
    return go;
  };
  var alter = (dictOrd) => {
    const compare = dictOrd.compare;
    return (f2) => (k) => (m2) => {
      const v = unsafeSplit(compare, k, m2);
      const v2 = f2(v._1);
      if (v2.tag === "Nothing") {
        return unsafeJoinNodes(v._2, v._3);
      }
      if (v2.tag === "Just") {
        return unsafeBalancedNode(k, v2._1, v._2, v._3);
      }
      fail();
    };
  };

  // output-es/Data.Eq/foreign.js
  var refEq = function(r1) {
    return function(r2) {
      return r1 === r2;
    };
  };
  var eqIntImpl = refEq;
  var eqStringImpl = refEq;

  // output-es/Data.Eq/index.js
  var eqUnit = { eq: (v) => (v1) => true };
  var eqString = { eq: eqStringImpl };
  var eqInt = { eq: eqIntImpl };

  // output-es/Data.Ord/foreign.js
  var unsafeCompareImpl = function(lt) {
    return function(eq2) {
      return function(gt) {
        return function(x2) {
          return function(y2) {
            return x2 < y2 ? lt : x2 === y2 ? eq2 : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;
  var ordStringImpl = unsafeCompareImpl;

  // output-es/Data.Ord/index.js
  var ordUnit = { compare: (v) => (v1) => EQ, Eq0: () => eqUnit };
  var ordString = { compare: /* @__PURE__ */ ordStringImpl(LT)(EQ)(GT), Eq0: () => eqString };
  var ordInt = { compare: /* @__PURE__ */ ordIntImpl(LT)(EQ)(GT), Eq0: () => eqInt };

  // output-es/Halogen.Data.OrdBox/index.js
  var $OrdBox = (_1, _2, _3) => ({ tag: "OrdBox", _1, _2, _3 });
  var OrdBox = (value0) => (value1) => (value2) => $OrdBox(value0, value1, value2);
  var eqOrdBox = { eq: (v) => (v1) => v._1(v._3)(v1._3) };
  var ordOrdBox = { compare: (v) => (v1) => v._2(v._3)(v1._3), Eq0: () => eqOrdBox };

  // output-es/Halogen.Data.Slot/index.js
  var ordTuple2 = /* @__PURE__ */ ordTuple(ordString)(ordOrdBox);
  var pop1 = /* @__PURE__ */ pop(ordTuple2);
  var pop2 = () => (dictIsSymbol) => (dictOrd) => {
    const mkOrdBox = OrdBox(dictOrd.Eq0().eq)(dictOrd.compare);
    return (sym) => (key2) => (v) => pop1($Tuple(dictIsSymbol.reflectSymbol(sym), mkOrdBox(key2)))(v);
  };
  var lookup2 = () => (dictIsSymbol) => (dictOrd) => {
    const mkOrdBox = OrdBox(dictOrd.Eq0().eq)(dictOrd.compare);
    return (sym) => (key2) => (v) => lookup(ordTuple2)($Tuple(dictIsSymbol.reflectSymbol(sym), mkOrdBox(key2)))(v);
  };
  var insert2 = () => (dictIsSymbol) => (dictOrd) => {
    const mkOrdBox = OrdBox(dictOrd.Eq0().eq)(dictOrd.compare);
    return (sym) => (key2) => (val) => (v) => insert(ordTuple2)($Tuple(dictIsSymbol.reflectSymbol(sym), mkOrdBox(key2)))(val)(v);
  };
  var foreachSlot = (dictApplicative) => {
    const traverse_18 = traverse_(dictApplicative)(foldableMap);
    return (v) => (k) => traverse_18((x2) => k(x2))(v);
  };

  // output-es/Data.String.Common/foreign.js
  var replaceAll = function(s1) {
    return function(s2) {
      return function(s3) {
        return s3.replace(new RegExp(s1.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"), s2);
      };
    };
  };
  var split = function(sep) {
    return function(s2) {
      return s2.split(sep);
    };
  };
  var toLower = function(s2) {
    return s2.toLowerCase();
  };
  var toUpper = function(s2) {
    return s2.toUpperCase();
  };
  var joinWith = function(s2) {
    return function(xs) {
      return xs.join(s2);
    };
  };

  // output-es/Halogen.Query.Input/index.js
  var $Input = (tag, _1, _2) => ({ tag, _1, _2 });

  // output-es/Data.Nullable/foreign.js
  var nullImpl = null;
  function nullable(a2, r2, f2) {
    return a2 == null ? r2 : f2(a2);
  }
  function notNull(x2) {
    return x2;
  }

  // output-es/Data.Number/foreign.js
  var isFiniteImpl = isFinite;
  var atan2 = function(y2) {
    return function(x2) {
      return Math.atan2(y2, x2);
    };
  };
  var round = Math.round;

  // output-es/Data.Int/foreign.js
  var fromNumberImpl = function(just) {
    return function(nothing) {
      return function(n2) {
        return (n2 | 0) === n2 ? just(n2) : nothing;
      };
    };
  };
  var toNumber = function(n2) {
    return n2;
  };
  var fromStringAsImpl = function(just) {
    return function(nothing) {
      return function(radix) {
        var digits;
        if (radix < 11) {
          digits = "[0-" + (radix - 1).toString() + "]";
        } else if (radix === 11) {
          digits = "[0-9a]";
        } else {
          digits = "[0-9a-" + String.fromCharCode(86 + radix) + "]";
        }
        var pattern = new RegExp("^[\\+\\-]?" + digits + "+$", "i");
        return function(s2) {
          if (pattern.test(s2)) {
            var i2 = parseInt(s2, radix);
            return (i2 | 0) === i2 ? just(i2) : nothing;
          } else {
            return nothing;
          }
        };
      };
    };
  };
  var toStringAs = function(radix) {
    return function(i2) {
      return i2.toString(radix);
    };
  };

  // output-es/Data.Int/index.js
  var fromStringAs = /* @__PURE__ */ fromStringAsImpl(Just)(Nothing);
  var fromString = /* @__PURE__ */ fromStringAs(10);
  var fromNumber = /* @__PURE__ */ fromNumberImpl(Just)(Nothing);
  var unsafeClamp = (x2) => {
    if (!isFiniteImpl(x2)) {
      return 0;
    }
    if (x2 >= toNumber(2147483647)) {
      return 2147483647;
    }
    if (x2 <= toNumber(-2147483648)) {
      return -2147483648;
    }
    const $0 = fromNumber(x2);
    if ($0.tag === "Nothing") {
      return 0;
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  };

  // output-es/Data.String.Unsafe/foreign.js
  var charAt = function(i2) {
    return function(s2) {
      if (i2 >= 0 && i2 < s2.length)
        return s2.charAt(i2);
      throw new Error("Data.String.Unsafe.charAt: Invalid index.");
    };
  };

  // output-es/Data.String.CodeUnits/foreign.js
  var fromCharArray = function(a2) {
    return a2.join("");
  };
  var singleton2 = function(c2) {
    return c2;
  };
  var length = function(s2) {
    return s2.length;
  };
  var _indexOf = function(just) {
    return function(nothing) {
      return function(x2) {
        return function(s2) {
          var i2 = s2.indexOf(x2);
          return i2 === -1 ? nothing : just(i2);
        };
      };
    };
  };
  var take = function(n2) {
    return function(s2) {
      return s2.substr(0, n2);
    };
  };
  var drop = function(n2) {
    return function(s2) {
      return s2.substring(n2);
    };
  };
  var splitAt = function(i2) {
    return function(s2) {
      return { before: s2.substring(0, i2), after: s2.substring(i2) };
    };
  };

  // output-es/Data.String.CodeUnits/index.js
  var stripPrefix = (v) => (str2) => {
    const v1 = splitAt(length(v))(str2);
    if (v1.before === v) {
      return $Maybe("Just", v1.after);
    }
    return Nothing;
  };
  var indexOf = /* @__PURE__ */ _indexOf(Just)(Nothing);

  // output-es/Foreign/foreign.js
  function typeOf(value2) {
    return typeof value2;
  }
  var isArray = Array.isArray || function(value2) {
    return Object.prototype.toString.call(value2) === "[object Array]";
  };

  // output-es/Control.Monad.ST.Internal/foreign.js
  var map_ = function(f2) {
    return function(a2) {
      return function() {
        return f2(a2());
      };
    };
  };
  var pure_ = function(a2) {
    return function() {
      return a2;
    };
  };
  var bind_ = function(a2) {
    return function(f2) {
      return function() {
        return f2(a2())();
      };
    };
  };

  // output-es/Control.Monad.ST.Internal/index.js
  var functorST = { map: map_ };
  var monadST = { Applicative0: () => applicativeST, Bind1: () => bindST };
  var bindST = { bind: bind_, Apply0: () => applyST };
  var applyST = {
    apply: (f2) => (a2) => () => {
      const f$p = f2();
      const a$p = a2();
      return applicativeST.pure(f$p(a$p))();
    },
    Functor0: () => functorST
  };
  var applicativeST = { pure: pure_, Apply0: () => applyST };

  // output-es/Control.Monad.ST.Uncurried/foreign.js
  var runSTFn2 = function runSTFn22(fn) {
    return function(a2) {
      return function(b) {
        return function() {
          return fn(a2, b);
        };
      };
    };
  };

  // output-es/Data.Array.ST/foreign.js
  var sortByImpl = function() {
    function mergeFromTo(compare, fromOrdering, xs1, xs2, from, to) {
      var mid;
      var i2;
      var j;
      var k;
      var x2;
      var y2;
      var c2;
      mid = from + (to - from >> 1);
      if (mid - from > 1)
        mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid);
      if (to - mid > 1)
        mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);
      i2 = from;
      j = mid;
      k = from;
      while (i2 < mid && j < to) {
        x2 = xs2[i2];
        y2 = xs2[j];
        c2 = fromOrdering(compare(x2)(y2));
        if (c2 > 0) {
          xs1[k++] = y2;
          ++j;
        } else {
          xs1[k++] = x2;
          ++i2;
        }
      }
      while (i2 < mid) {
        xs1[k++] = xs2[i2++];
      }
      while (j < to) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare, fromOrdering, xs) {
      if (xs.length < 2)
        return xs;
      mergeFromTo(compare, fromOrdering, xs, xs.slice(0), 0, xs.length);
      return xs;
    };
  }();
  var pushImpl = function(a2, xs) {
    return xs.push(a2);
  };

  // output-es/Data.Array.ST/index.js
  var push = /* @__PURE__ */ runSTFn2(pushImpl);

  // output-es/Data.Array.ST.Iterator/index.js
  var $Iterator = (_1, _2) => ({ tag: "Iterator", _1, _2 });
  var iterate = (iter) => (f2) => () => {
    let $$break = false;
    const $0 = iter._2;
    while ((() => {
      const $1 = $$break;
      return !$1;
    })()) {
      const i2 = $0.value;
      const $1 = $0.value;
      $0.value = $1 + 1 | 0;
      const mx = iter._1(i2);
      if (mx.tag === "Just") {
        f2(mx._1)();
        continue;
      }
      if (mx.tag === "Nothing") {
        $$break = true;
        continue;
      }
      fail();
    }
  };

  // output-es/Data.FunctorWithIndex/foreign.js
  var mapWithIndexArray = function(f2) {
    return function(xs) {
      var l2 = xs.length;
      var result = Array(l2);
      for (var i2 = 0; i2 < l2; i2++) {
        result[i2] = f2(i2)(xs[i2]);
      }
      return result;
    };
  };

  // output-es/Data.FunctorWithIndex/index.js
  var functorWithIndexArray = { mapWithIndex: mapWithIndexArray, Functor0: () => functorArray };

  // output-es/Data.Array/foreign.js
  var rangeImpl = function(start, end3) {
    var step2 = start > end3 ? -1 : 1;
    var result = new Array(step2 * (end3 - start) + 1);
    var i2 = start, n2 = 0;
    while (i2 !== end3) {
      result[n2++] = i2;
      i2 += step2;
    }
    result[n2] = i2;
    return result;
  };
  var replicateFill = function(count, value2) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value2);
  };
  var replicatePolyfill = function(count, value2) {
    var result = [];
    var n2 = 0;
    for (var i2 = 0; i2 < count; i2++) {
      result[n2++] = value2;
    }
    return result;
  };
  var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
  var fromFoldableImpl = function() {
    function Cons2(head, tail) {
      this.head = head;
      this.tail = tail;
    }
    var emptyList = {};
    function curryCons(head) {
      return function(tail) {
        return new Cons2(head, tail);
      };
    }
    function listToArray(list) {
      var result = [];
      var count = 0;
      var xs = list;
      while (xs !== emptyList) {
        result[count++] = xs.head;
        xs = xs.tail;
      }
      return result;
    }
    return function(foldr2, xs) {
      return listToArray(foldr2(curryCons)(emptyList)(xs));
    };
  }();
  var unconsImpl = function(empty2, next, xs) {
    return xs.length === 0 ? empty2({}) : next(xs[0])(xs.slice(1));
  };
  var findIndexImpl = function(just, nothing, f2, xs) {
    for (var i2 = 0, l2 = xs.length; i2 < l2; i2++) {
      if (f2(xs[i2]))
        return just(i2);
    }
    return nothing;
  };
  var _deleteAt = function(just, nothing, i2, l2) {
    if (i2 < 0 || i2 >= l2.length)
      return nothing;
    var l1 = l2.slice();
    l1.splice(i2, 1);
    return just(l1);
  };
  var reverse2 = function(l2) {
    return l2.slice().reverse();
  };
  var concat = function(xss) {
    if (xss.length <= 1e4) {
      return Array.prototype.concat.apply([], xss);
    }
    var result = [];
    for (var i2 = 0, l2 = xss.length; i2 < l2; i2++) {
      var xs = xss[i2];
      for (var j = 0, m2 = xs.length; j < m2; j++) {
        result.push(xs[j]);
      }
    }
    return result;
  };
  var filterImpl = function(f2, xs) {
    return xs.filter(f2);
  };
  var partitionImpl = function(f2, xs) {
    var yes = [];
    var no = [];
    for (var i2 = 0; i2 < xs.length; i2++) {
      var x2 = xs[i2];
      if (f2(x2))
        yes.push(x2);
      else
        no.push(x2);
    }
    return { yes, no };
  };
  var sortByImpl2 = function() {
    function mergeFromTo(compare, fromOrdering, xs1, xs2, from, to) {
      var mid;
      var i2;
      var j;
      var k;
      var x2;
      var y2;
      var c2;
      mid = from + (to - from >> 1);
      if (mid - from > 1)
        mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid);
      if (to - mid > 1)
        mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);
      i2 = from;
      j = mid;
      k = from;
      while (i2 < mid && j < to) {
        x2 = xs2[i2];
        y2 = xs2[j];
        c2 = fromOrdering(compare(x2)(y2));
        if (c2 > 0) {
          xs1[k++] = y2;
          ++j;
        } else {
          xs1[k++] = x2;
          ++i2;
        }
      }
      while (i2 < mid) {
        xs1[k++] = xs2[i2++];
      }
      while (j < to) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare, fromOrdering, xs) {
      var out;
      if (xs.length < 2)
        return xs;
      out = xs.slice(0);
      mergeFromTo(compare, fromOrdering, out, xs.slice(0), 0, xs.length);
      return out;
    };
  }();
  var sliceImpl = function(s2, e2, l2) {
    return l2.slice(s2, e2);
  };
  var zipWithImpl = function(f2, xs, ys) {
    var l2 = xs.length < ys.length ? xs.length : ys.length;
    var result = new Array(l2);
    for (var i2 = 0; i2 < l2; i2++) {
      result[i2] = f2(xs[i2])(ys[i2]);
    }
    return result;
  };

  // output-es/Data.Array/index.js
  var intercalate1 = (dictMonoid) => {
    const $0 = dictMonoid.Semigroup0();
    const mempty2 = dictMonoid.mempty;
    return (sep) => (xs) => foldlArray((v) => (v1) => {
      if (v.init) {
        return { init: false, acc: v1 };
      }
      return { init: false, acc: $0.append(v.acc)($0.append(sep)(v1)) };
    })({ init: true, acc: mempty2 })(xs).acc;
  };
  var zipWith2 = ($0) => ($1) => ($2) => zipWithImpl($0, $1, $2);
  var toUnfoldable = (dictUnfoldable) => (xs) => {
    const len = xs.length;
    return dictUnfoldable.unfoldr((i2) => {
      if (i2 < len) {
        return $Maybe("Just", $Tuple(xs[i2], i2 + 1 | 0));
      }
      return Nothing;
    })(0);
  };
  var sortBy = (comp) => ($0) => sortByImpl2(
    comp,
    (v) => {
      if (v === "GT") {
        return 1;
      }
      if (v === "EQ") {
        return 0;
      }
      if (v === "LT") {
        return -1;
      }
      fail();
    },
    $0
  );
  var sortWith = (dictOrd) => (f2) => sortBy((x2) => (y2) => dictOrd.compare(f2(x2))(f2(y2)));
  var snoc2 = (xs) => (x2) => (() => {
    const $0 = push(x2);
    return () => {
      const result = [...xs];
      $0(result)();
      return result;
    };
  })()();
  var partition = ($0) => ($1) => partitionImpl($0, $1);
  var last = (xs) => {
    const $0 = xs.length - 1 | 0;
    if ($0 >= 0 && $0 < xs.length) {
      return $Maybe("Just", xs[$0]);
    }
    return Nothing;
  };
  var nubBy = (comp) => (xs) => {
    const indexedAndSorted = sortBy((x2) => (y2) => comp(x2._2)(y2._2))(mapWithIndexArray(Tuple)(xs));
    if (0 < indexedAndSorted.length) {
      return arrayMap(snd)(sortWith(ordInt)(fst)((() => {
        const result = [indexedAndSorted[0]];
        for (const v1 of indexedAndSorted) {
          const $0 = comp((() => {
            const $02 = last(result);
            if ($02.tag === "Just") {
              return $02._1._2;
            }
            fail();
          })())(v1._2);
          if ($0 === "LT" || $0 === "GT" || $0 !== "EQ") {
            result.push(v1);
          }
        }
        return result;
      })()));
    }
    return [];
  };
  var foldM = (dictMonad) => (f2) => (b) => ($0) => unconsImpl((v) => dictMonad.Applicative0().pure(b), (a2) => (as2) => dictMonad.Bind1().bind(f2(b)(a2))((b$p) => foldM(dictMonad)(f2)(b$p)(as2)), $0);
  var find2 = (f2) => (xs) => {
    const $0 = findIndexImpl(Just, Nothing, f2, xs);
    if ($0.tag === "Just") {
      return $Maybe("Just", xs[$0._1]);
    }
    return Nothing;
  };
  var filter = ($0) => ($1) => filterImpl($0, $1);
  var elem = (dictEq) => (a2) => (arr) => {
    const $0 = findIndexImpl(Just, Nothing, (v) => dictEq.eq(v)(a2), arr);
    if ($0.tag === "Nothing") {
      return false;
    }
    if ($0.tag === "Just") {
      return true;
    }
    fail();
  };
  var deleteBy2 = (v) => (v1) => (v2) => {
    if (v2.length === 0) {
      return [];
    }
    const $0 = findIndexImpl(Just, Nothing, v(v1), v2);
    if ($0.tag === "Nothing") {
      return v2;
    }
    if ($0.tag === "Just") {
      const $1 = _deleteAt(Just, Nothing, $0._1, v2);
      if ($1.tag === "Just") {
        return $1._1;
      }
    }
    fail();
  };
  var cons = (x2) => (xs) => [x2, ...xs];
  var concatMap = (b) => (a2) => arrayBind(a2)(b);
  var mapMaybe = (f2) => concatMap((x2) => {
    const $0 = f2(x2);
    if ($0.tag === "Nothing") {
      return [];
    }
    if ($0.tag === "Just") {
      return [$0._1];
    }
    fail();
  });

  // output-es/Data.FoldableWithIndex/index.js
  var traverseWithIndex_ = (dictApplicative) => {
    const $0 = dictApplicative.Apply0();
    return (dictFoldableWithIndex) => (f2) => dictFoldableWithIndex.foldrWithIndex((i2) => {
      const $1 = f2(i2);
      return (x2) => {
        const $2 = $1(x2);
        return (b) => $0.apply($0.Functor0().map((v) => identity)($2))(b);
      };
    })(dictApplicative.pure());
  };
  var forWithIndex_ = (dictApplicative) => {
    const traverseWithIndex_1 = traverseWithIndex_(dictApplicative);
    return (dictFoldableWithIndex) => {
      const $0 = traverseWithIndex_1(dictFoldableWithIndex);
      return (b) => (a2) => $0(a2)(b);
    };
  };
  var foldableWithIndexArray = {
    foldrWithIndex: (f2) => (z) => {
      const $0 = foldrArray((v) => {
        const $02 = v._1;
        const $12 = v._2;
        return (y2) => f2($02)($12)(y2);
      })(z);
      const $1 = mapWithIndexArray(Tuple);
      return (x2) => $0($1(x2));
    },
    foldlWithIndex: (f2) => (z) => {
      const $0 = foldlArray((y2) => (v) => f2(v._1)(y2)(v._2))(z);
      const $1 = mapWithIndexArray(Tuple);
      return (x2) => $0($1(x2));
    },
    foldMapWithIndex: (dictMonoid) => {
      const mempty2 = dictMonoid.mempty;
      return (f2) => foldableWithIndexArray.foldrWithIndex((i2) => (x2) => (acc) => dictMonoid.Semigroup0().append(f2(i2)(x2))(acc))(mempty2);
    },
    Foldable0: () => foldableArray
  };
  var findWithIndex = (dictFoldableWithIndex) => (p2) => dictFoldableWithIndex.foldlWithIndex((v) => (v1) => (v2) => {
    if (v1.tag === "Nothing" && p2(v)(v2)) {
      return $Maybe("Just", { index: v, value: v2 });
    }
    return v1;
  })(Nothing);

  // output-es/Foreign.Object/foreign.js
  var empty = {};
  function _fmapObject(m0, f2) {
    var m2 = {};
    for (var k in m0) {
      if (hasOwnProperty.call(m0, k)) {
        m2[k] = f2(m0[k]);
      }
    }
    return m2;
  }
  function _mapWithKey(m0, f2) {
    var m2 = {};
    for (var k in m0) {
      if (hasOwnProperty.call(m0, k)) {
        m2[k] = f2(k)(m0[k]);
      }
    }
    return m2;
  }
  function _foldM(bind) {
    return function(f2) {
      return function(mz) {
        return function(m2) {
          var acc = mz;
          function g2(k2) {
            return function(z) {
              return f2(z)(k2)(m2[k2]);
            };
          }
          for (var k in m2) {
            if (hasOwnProperty.call(m2, k)) {
              acc = bind(acc)(g2(k));
            }
          }
          return acc;
        };
      };
    };
  }
  function all(f2) {
    return function(m2) {
      for (var k in m2) {
        if (hasOwnProperty.call(m2, k) && !f2(k)(m2[k]))
          return false;
      }
      return true;
    };
  }
  function _lookup(no, yes, k, m2) {
    return k in m2 ? yes(m2[k]) : no;
  }
  function toArrayWithKey(f2) {
    return function(m2) {
      var r2 = [];
      for (var k in m2) {
        if (hasOwnProperty.call(m2, k)) {
          r2.push(f2(k)(m2[k]));
        }
      }
      return r2;
    };
  }
  var keys2 = Object.keys || toArrayWithKey(function(k) {
    return function() {
      return k;
    };
  });

  // output-es/Foreign.Object/index.js
  var identity9 = (x2) => x2;
  var values2 = /* @__PURE__ */ toArrayWithKey((v) => (v1) => v1);
  var mutate = (f2) => (m2) => {
    const s2 = { ...m2 };
    f2(s2)();
    return s2;
  };
  var mapWithKey = (f2) => (m2) => _mapWithKey(m2, f2);
  var isEmpty = /* @__PURE__ */ all((v) => (v1) => false);
  var insert3 = (k) => (v) => mutate(($0) => () => {
    $0[k] = v;
    return $0;
  });
  var functorObject = { map: (f2) => (m2) => _fmapObject(m2, f2) };
  var functorWithIndexObject = { mapWithIndex: mapWithKey, Functor0: () => functorObject };
  var fromFoldable2 = (dictFoldable) => {
    const $0 = dictFoldable.foldr;
    return (l2) => {
      const s2 = {};
      for (const v of fromFoldableImpl($0, l2)) {
        s2[v._1] = v._2;
      }
      return s2;
    };
  };
  var foldM2 = (dictMonad) => {
    const bind1 = dictMonad.Bind1().bind;
    return (f2) => (z) => _foldM(bind1)(f2)(dictMonad.Applicative0().pure(z));
  };
  var foldM1 = /* @__PURE__ */ foldM2(monadST);
  var unionWith = (f2) => (m1) => (m2) => mutate((s1) => foldM1((s2) => (k) => (v1) => {
    const $0 = _lookup(v1, (v2) => f2(v1)(v2), k, m2);
    return () => {
      s2[k] = $0;
      return s2;
    };
  })(s1)(m1))(m2);
  var fold = /* @__PURE__ */ _foldM(applyFlipped);
  var foldMap = (dictMonoid) => {
    const mempty2 = dictMonoid.mempty;
    return (f2) => fold((acc) => (k) => (v) => dictMonoid.Semigroup0().append(acc)(f2(k)(v)))(mempty2);
  };
  var foldableObject = {
    foldl: (f2) => fold((z) => (v) => f2(z)),
    foldr: (f2) => (z) => (m2) => foldrArray(f2)(z)(values2(m2)),
    foldMap: (dictMonoid) => {
      const foldMap1 = foldMap(dictMonoid);
      return (f2) => foldMap1((v) => f2);
    }
  };
  var foldableWithIndexObject = {
    foldlWithIndex: (f2) => fold((b) => (a2) => f2(a2)(b)),
    foldrWithIndex: (f2) => (z) => (m2) => foldrArray((v) => f2(v._1)(v._2))(z)(toArrayWithKey(Tuple)(m2)),
    foldMapWithIndex: (dictMonoid) => foldMap(dictMonoid),
    Foldable0: () => foldableObject
  };
  var traversableWithIndexObject = {
    traverseWithIndex: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      return (f2) => (ms) => fold((acc) => (k) => (v) => Apply0.apply(Apply0.Functor0().map((b) => (a2) => mutate(($0) => () => {
        $0[k] = a2;
        return $0;
      })(b))(acc))(f2(k)(v)))(dictApplicative.pure(empty))(ms);
    },
    FunctorWithIndex0: () => functorWithIndexObject,
    FoldableWithIndex1: () => foldableWithIndexObject,
    Traversable2: () => traversableObject
  };
  var traversableObject = {
    traverse: (dictApplicative) => {
      const $0 = traversableWithIndexObject.traverseWithIndex(dictApplicative);
      return (x2) => $0((v) => x2);
    },
    sequence: (dictApplicative) => traversableObject.traverse(dictApplicative)(identity9),
    Functor0: () => functorObject,
    Foldable1: () => foldableObject
  };

  // output-es/Halogen.VDom.Machine/index.js
  var $Step$p = (_1, _2, _3, _4) => ({ tag: "Step", _1, _2, _3, _4 });
  var step = (v, $0) => {
    const $1 = v._2;
    return v._3($1, $0);
  };
  var halt = (v) => {
    const $0 = v._2;
    return v._4($0);
  };

  // output-es/Halogen.VDom.Util/foreign.js
  function unsafeGetAny(key2, obj) {
    return obj[key2];
  }
  function unsafeHasAny(key2, obj) {
    return obj.hasOwnProperty(key2);
  }
  function unsafeSetAny(key2, val, obj) {
    obj[key2] = val;
  }
  function forE2(a2, f2) {
    var b = [];
    for (var i2 = 0; i2 < a2.length; i2++) {
      b.push(f2(i2, a2[i2]));
    }
    return b;
  }
  function forEachE(a2, f2) {
    for (var i2 = 0; i2 < a2.length; i2++) {
      f2(a2[i2]);
    }
  }
  function forInE(o2, f2) {
    var ks = Object.keys(o2);
    for (var i2 = 0; i2 < ks.length; i2++) {
      var k = ks[i2];
      f2(k, o2[k]);
    }
  }
  function diffWithIxE(a1, a2, f1, f2, f3) {
    var a3 = [];
    var l1 = a1.length;
    var l2 = a2.length;
    var i2 = 0;
    while (1) {
      if (i2 < l1) {
        if (i2 < l2) {
          a3.push(f1(i2, a1[i2], a2[i2]));
        } else {
          f2(i2, a1[i2]);
        }
      } else if (i2 < l2) {
        a3.push(f3(i2, a2[i2]));
      } else {
        break;
      }
      i2++;
    }
    return a3;
  }
  function strMapWithIxE(as2, fk, f2) {
    var o2 = {};
    for (var i2 = 0; i2 < as2.length; i2++) {
      var a2 = as2[i2];
      var k = fk(a2);
      o2[k] = f2(k, i2, a2);
    }
    return o2;
  }
  function diffWithKeyAndIxE(o1, as2, fk, f1, f2, f3) {
    var o2 = {};
    for (var i2 = 0; i2 < as2.length; i2++) {
      var a2 = as2[i2];
      var k = fk(a2);
      if (o1.hasOwnProperty(k)) {
        o2[k] = f1(k, i2, o1[k], a2);
      } else {
        o2[k] = f3(k, i2, a2);
      }
    }
    for (var k in o1) {
      if (k in o2) {
        continue;
      }
      f2(k, o1[k]);
    }
    return o2;
  }
  function refEq2(a2, b) {
    return a2 === b;
  }
  function createTextNode(s2, doc) {
    return doc.createTextNode(s2);
  }
  function setTextContent(s2, n2) {
    n2.textContent = s2;
  }
  function createElement(ns, name2, doc) {
    if (ns != null) {
      return doc.createElementNS(ns, name2);
    } else {
      return doc.createElement(name2);
    }
  }
  function insertChildIx(i2, a2, b) {
    var n2 = b.childNodes.item(i2) || null;
    if (n2 !== a2) {
      b.insertBefore(a2, n2);
    }
  }
  function removeChild(a2, b) {
    if (b && a2.parentNode === b) {
      b.removeChild(a2);
    }
  }
  function parentNode(a2) {
    return a2.parentNode;
  }
  function setAttribute(ns, attr2, val, el) {
    if (ns != null) {
      el.setAttributeNS(ns, attr2, val);
    } else {
      el.setAttribute(attr2, val);
    }
  }
  function removeAttribute(ns, attr2, el) {
    if (ns != null) {
      el.removeAttributeNS(ns, attr2);
    } else {
      el.removeAttribute(attr2);
    }
  }
  function hasAttribute(ns, attr2, el) {
    if (ns != null) {
      return el.hasAttributeNS(ns, attr2);
    } else {
      return el.hasAttribute(attr2);
    }
  }
  function addEventListener(ev, listener, el) {
    el.addEventListener(ev, listener, false);
  }
  function removeEventListener(ev, listener, el) {
    el.removeEventListener(ev, listener, false);
  }
  var jsUndefined = void 0;

  // output-es/Web.Event.EventTarget/foreign.js
  function eventListener(fn) {
    return function() {
      return function(event) {
        return fn(event)();
      };
    };
  }
  function addEventListener2(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target2) {
          return function() {
            return target2.addEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }
  function removeEventListener2(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target2) {
          return function() {
            return target2.removeEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }

  // output-es/Halogen.VDom.DOM.Prop/index.js
  var $ElemRef = (tag, _1) => ({ tag, _1 });
  var $Prop = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
  var Attribute = (value0) => (value1) => (value2) => $Prop("Attribute", value0, value1, value2);
  var Property = (value0) => (value1) => $Prop("Property", value0, value1);
  var removeProperty = (key2, el) => {
    const v = hasAttribute(nullImpl, key2, el);
    if (v) {
      return removeAttribute(nullImpl, key2, el);
    }
    if (typeOf(unsafeGetAny(key2, el)) === "string") {
      return unsafeSetAny(key2, "", el);
    }
    if (key2 === "rowSpan") {
      return unsafeSetAny(key2, 1, el);
    }
    if (key2 === "colSpan") {
      return unsafeSetAny(key2, 1, el);
    }
    return unsafeSetAny(key2, jsUndefined, el);
  };
  var propToStrKey = (v) => {
    if (v.tag === "Attribute") {
      if (v._1.tag === "Just") {
        return "attr/" + v._1._1 + ":" + v._2;
      }
      return "attr/:" + v._2;
    }
    if (v.tag === "Property") {
      return "prop/" + v._1;
    }
    if (v.tag === "Handler") {
      return "handler/" + v._1;
    }
    if (v.tag === "Ref") {
      return "ref";
    }
    fail();
  };
  var functorProp = {
    map: (v) => (v1) => {
      if (v1.tag === "Handler") {
        return $Prop(
          "Handler",
          v1._1,
          (x2) => {
            const $0 = v1._2(x2);
            if ($0.tag === "Just") {
              return $Maybe("Just", v($0._1));
            }
            return Nothing;
          }
        );
      }
      if (v1.tag === "Ref") {
        return $Prop(
          "Ref",
          (x2) => {
            const $0 = v1._1(x2);
            if ($0.tag === "Just") {
              return $Maybe("Just", v($0._1));
            }
            return Nothing;
          }
        );
      }
      return v1;
    }
  };
  var buildProp = (emit) => (el) => {
    const haltProp = (state) => {
      const v = _lookup(Nothing, Just, "ref", state.props);
      if (v.tag === "Just" && v._1.tag === "Ref") {
        const $0 = v._1._1($ElemRef("Removed", el));
        if ($0.tag === "Just") {
          return emit($0._1)();
        }
      }
    };
    const applyProp = (events) => (v, v1, v2) => {
      if (v2.tag === "Attribute") {
        const $0 = v2._2;
        const $1 = v2._3;
        const $2 = (() => {
          if (v2._1.tag === "Nothing") {
            return nullImpl;
          }
          if (v2._1.tag === "Just") {
            return notNull(v2._1._1);
          }
          fail();
        })();
        setAttribute($2, $0, $1, el);
        return v2;
      }
      if (v2.tag === "Property") {
        const $0 = v2._1;
        const $1 = v2._2;
        unsafeSetAny($0, $1, el);
        return v2;
      }
      if (v2.tag === "Handler") {
        if (unsafeHasAny(v2._1, events)) {
          const $0 = unsafeGetAny(v2._1, events)._2;
          $0.value = v2._2;
          return v2;
        }
        const ref = { value: v2._2 };
        const listener = eventListener((ev) => () => {
          const f$p = ref.value;
          const $0 = f$p(ev);
          if ($0.tag === "Just") {
            return emit($0._1)();
          }
        })();
        unsafeSetAny(v2._1, $Tuple(listener, ref), events);
        addEventListener(v2._1, listener, el);
        return v2;
      }
      if (v2.tag === "Ref") {
        const $0 = v2._1($ElemRef("Created", el));
        if ($0.tag === "Just") {
          emit($0._1)();
        }
        return v2;
      }
      fail();
    };
    const patchProp = (state, ps2) => {
      const events = {};
      const $0 = state.events;
      const props = diffWithKeyAndIxE(
        state.props,
        ps2,
        propToStrKey,
        (v, v1, v11, v2) => {
          if (v11.tag === "Attribute") {
            if (v2.tag === "Attribute") {
              if (v11._3 === v2._3) {
                return v2;
              }
              const $1 = (() => {
                if (v2._1.tag === "Nothing") {
                  return nullImpl;
                }
                if (v2._1.tag === "Just") {
                  return notNull(v2._1._1);
                }
                fail();
              })();
              setAttribute($1, v2._2, v2._3, el);
            }
            return v2;
          }
          if (v11.tag === "Property") {
            if (v2.tag === "Property") {
              if (refEq2(v11._2, v2._2)) {
                return v2;
              }
              if (v2._1 === "value" && refEq2(unsafeGetAny("value", el), v2._2)) {
                return v2;
              }
              unsafeSetAny(v2._1, v2._2, el);
            }
            return v2;
          }
          if (v11.tag === "Handler" && v2.tag === "Handler") {
            const $1 = v2._2;
            const $2 = v2._1;
            const handler = unsafeGetAny($2, $0);
            const $3 = handler._2;
            $3.value = $1;
            unsafeSetAny($2, handler, events);
          }
          return v2;
        },
        (v, v1) => {
          if (v1.tag === "Attribute") {
            const $1 = v1._2;
            const $2 = (() => {
              if (v1._1.tag === "Nothing") {
                return nullImpl;
              }
              if (v1._1.tag === "Just") {
                return notNull(v1._1._1);
              }
              fail();
            })();
            return removeAttribute($2, $1, el);
          }
          if (v1.tag === "Property") {
            const $1 = v1._1;
            return removeProperty($1, el);
          }
          if (v1.tag === "Handler") {
            const $1 = v1._1;
            const $2 = unsafeGetAny($1, $0)._1;
            return removeEventListener($1, $2, el);
          }
          if (v1.tag === "Ref") {
            return;
          }
          fail();
        },
        applyProp(events)
      );
      return $Step$p(void 0, { events, props }, patchProp, haltProp);
    };
    return (ps1) => {
      const events = {};
      const ps1$p = strMapWithIxE(ps1, propToStrKey, applyProp(events));
      return $Step$p(void 0, { events, props: ps1$p }, patchProp, haltProp);
    };
  };

  // output-es/Halogen.VDom.Types/index.js
  var $GraftX = (_1, _2, _3) => ({ tag: "Graft", _1, _2, _3 });
  var $VDom = (tag, _1, _2, _3, _4) => ({ tag, _1, _2, _3, _4 });
  var runGraft = (x2) => {
    const go = (v2) => {
      if (v2.tag === "Text") {
        return $VDom("Text", v2._1);
      }
      if (v2.tag === "Elem") {
        return $VDom("Elem", v2._1, v2._2, x2._1(v2._3), arrayMap(go)(v2._4));
      }
      if (v2.tag === "Keyed") {
        return $VDom("Keyed", v2._1, v2._2, x2._1(v2._3), arrayMap((m2) => $Tuple(m2._1, go(m2._2)))(v2._4));
      }
      if (v2.tag === "Widget") {
        return $VDom("Widget", x2._2(v2._1));
      }
      if (v2.tag === "Grafted") {
        const $0 = v2._1;
        return $VDom("Grafted", $GraftX((x$1) => x2._1($0._1(x$1)), (x$1) => x2._2($0._2(x$1)), $0._3));
      }
      fail();
    };
    return go(x2._3);
  };

  // output-es/Halogen.HTML.Core/index.js
  var bifunctorHTML = {
    bimap: (f2) => (g2) => (v) => {
      const $0 = arrayMap(functorProp.map((m2) => {
        if (m2.tag === "RefUpdate") {
          return $Input("RefUpdate", m2._1, m2._2);
        }
        if (m2.tag === "Action") {
          return $Input("Action", g2(m2._1));
        }
        fail();
      }));
      if (v.tag === "Text") {
        return $VDom("Text", v._1);
      }
      if (v.tag === "Grafted") {
        const $1 = v._1;
        return $VDom("Grafted", $GraftX((x2) => $0($1._1(x2)), (x2) => f2($1._2(x2)), $1._3));
      }
      return $VDom("Grafted", $GraftX($0, f2, v));
    }
  };

  // output-es/Control.Applicative.Free/index.js
  var $FreeAp = (tag, _1, _2) => ({ tag, _1, _2 });
  var identity10 = (x2) => x2;
  var Pure = (value0) => $FreeAp("Pure", value0);
  var goLeft = (goLeft$a0$copy) => (goLeft$a1$copy) => (goLeft$a2$copy) => (goLeft$a3$copy) => (goLeft$a4$copy) => (goLeft$a5$copy) => {
    let goLeft$a0 = goLeft$a0$copy;
    let goLeft$a1 = goLeft$a1$copy;
    let goLeft$a2 = goLeft$a2$copy;
    let goLeft$a3 = goLeft$a3$copy;
    let goLeft$a4 = goLeft$a4$copy;
    let goLeft$a5 = goLeft$a5$copy;
    let goLeft$c = true;
    let goLeft$r;
    while (goLeft$c) {
      const dictApplicative = goLeft$a0, fStack = goLeft$a1, valStack = goLeft$a2, nat = goLeft$a3, func = goLeft$a4, count = goLeft$a5;
      if (func.tag === "Pure") {
        goLeft$c = false;
        goLeft$r = $Tuple($List("Cons", { func: dictApplicative.pure(func._1), count }, fStack), valStack);
        continue;
      }
      if (func.tag === "Lift") {
        goLeft$c = false;
        goLeft$r = $Tuple($List("Cons", { func: nat(func._1), count }, fStack), valStack);
        continue;
      }
      if (func.tag === "Ap") {
        goLeft$a0 = dictApplicative;
        goLeft$a1 = fStack;
        goLeft$a2 = $NonEmpty(func._2, $List("Cons", valStack._1, valStack._2));
        goLeft$a3 = nat;
        goLeft$a4 = func._1;
        goLeft$a5 = count + 1 | 0;
        continue;
      }
      fail();
    }
    return goLeft$r;
  };
  var goApply = (goApply$a0$copy) => (goApply$a1$copy) => (goApply$a2$copy) => (goApply$a3$copy) => {
    let goApply$a0 = goApply$a0$copy, goApply$a1 = goApply$a1$copy, goApply$a2 = goApply$a2$copy, goApply$a3 = goApply$a3$copy, goApply$c = true, goApply$r;
    while (goApply$c) {
      const dictApplicative = goApply$a0, fStack = goApply$a1, vals = goApply$a2, gVal = goApply$a3;
      if (fStack.tag === "Nil") {
        goApply$c = false;
        goApply$r = $Either("Left", gVal);
        continue;
      }
      if (fStack.tag === "Cons") {
        const gRes = dictApplicative.Apply0().apply(fStack._1.func)(gVal);
        if (fStack._1.count === 1) {
          if (fStack._2.tag === "Nil") {
            goApply$c = false;
            goApply$r = $Either("Left", gRes);
            continue;
          }
          goApply$a0 = dictApplicative;
          goApply$a1 = fStack._2;
          goApply$a2 = vals;
          goApply$a3 = gRes;
          continue;
        }
        if (vals.tag === "Nil") {
          goApply$c = false;
          goApply$r = $Either("Left", gRes);
          continue;
        }
        if (vals.tag === "Cons") {
          goApply$c = false;
          goApply$r = $Either(
            "Right",
            $Tuple($List("Cons", { func: gRes, count: fStack._1.count - 1 | 0 }, fStack._2), $NonEmpty(vals._1, vals._2))
          );
          continue;
        }
      }
      fail();
    }
    return goApply$r;
  };
  var functorFreeAp = { map: (f2) => (x2) => $FreeAp("Ap", $FreeAp("Pure", f2), x2) };
  var foldFreeAp = (dictApplicative) => (nat) => (z) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v._2._1.tag === "Pure") {
          const v1 = goApply(dictApplicative)(v._1)(v._2._2)(dictApplicative.pure(v._2._1._1));
          if (v1.tag === "Left") {
            go$c = false;
            go$r = v1._1;
            continue;
          }
          if (v1.tag === "Right") {
            go$a0 = v1._1;
            continue;
          }
          fail();
        }
        if (v._2._1.tag === "Lift") {
          const v1 = goApply(dictApplicative)(v._1)(v._2._2)(nat(v._2._1._1));
          if (v1.tag === "Left") {
            go$c = false;
            go$r = v1._1;
            continue;
          }
          if (v1.tag === "Right") {
            go$a0 = v1._1;
            continue;
          }
          fail();
        }
        if (v._2._1.tag === "Ap") {
          go$a0 = goLeft(dictApplicative)(v._1)($NonEmpty(v._2._1._2, v._2._2))(nat)(v._2._1._1)(1);
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go($Tuple(Nil, $NonEmpty(z, Nil)));
  };
  var applyFreeAp = { apply: (fba) => (fb) => $FreeAp("Ap", fba, fb), Functor0: () => functorFreeAp };
  var applicativeFreeAp = { pure: Pure, Apply0: () => applyFreeAp };

  // output-es/Halogen.Query.ChildQuery/index.js
  var $ChildQuery = (_1, _2, _3) => ({ tag: "ChildQuery", _1, _2, _3 });

  // output-es/Halogen.Query.HalogenM/index.js
  var $HalogenF = (tag, _1, _2) => ({ tag, _1, _2 });
  var identity11 = (x2) => x2;
  var SubscriptionId = (x2) => x2;
  var ForkId = (x2) => x2;
  var raise = (o2) => $Free(
    $FreeView("Bind", $HalogenF("Raise", o2, void 0), (x2) => $Free($FreeView("Return", x2), CatNil)),
    CatNil
  );
  var query = () => (dictIsSymbol) => (dictOrd) => {
    const lookup22 = lookup2()(dictIsSymbol)(dictOrd);
    return (label) => (p2) => (q) => $Free(
      $FreeView(
        "Bind",
        $HalogenF(
          "ChildQuery",
          $ChildQuery(
            (dictApplicative) => (k) => {
              const $0 = dictApplicative.pure(Nothing);
              const $1 = lookup22(label)(p2);
              return (x2) => {
                const $2 = $1(x2);
                if ($2.tag === "Nothing") {
                  return $0;
                }
                if ($2.tag === "Just") {
                  return k($2._1);
                }
                fail();
              };
            },
            q,
            identity11
          )
        ),
        (x2) => $Free($FreeView("Return", x2), CatNil)
      ),
      CatNil
    );
  };
  var monadTransHalogenM = {
    lift: (dictMonad) => (x2) => $Free(
      $FreeView("Bind", $HalogenF("Lift", x2), (x$1) => $Free($FreeView("Return", x$1), CatNil)),
      CatNil
    )
  };
  var monadStateHalogenM = {
    state: (x2) => $Free(
      $FreeView("Bind", $HalogenF("State", x2), (x$1) => $Free($FreeView("Return", x$1), CatNil)),
      CatNil
    ),
    Monad0: () => freeMonad
  };
  var monadEffectHalogenM = (dictMonadEffect) => ({
    liftEffect: (x2) => $Free(
      $FreeView(
        "Bind",
        $HalogenF("Lift", dictMonadEffect.liftEffect(x2)),
        (x$1) => $Free($FreeView("Return", x$1), CatNil)
      ),
      CatNil
    ),
    Monad0: () => freeMonad
  });
  var monadAffHalogenM = (dictMonadAff) => {
    const monadEffectHalogenM1 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
    return {
      liftAff: (x2) => $Free(
        $FreeView(
          "Bind",
          $HalogenF("Lift", dictMonadAff.liftAff(x2)),
          (x$1) => $Free($FreeView("Return", x$1), CatNil)
        ),
        CatNil
      ),
      MonadEffect0: () => monadEffectHalogenM1
    };
  };
  var hoist = (dictFunctor) => (nat) => (v) => hoistFree((v1) => {
    if (v1.tag === "State") {
      return $HalogenF("State", v1._1);
    }
    if (v1.tag === "Subscribe") {
      return $HalogenF("Subscribe", v1._1, v1._2);
    }
    if (v1.tag === "Unsubscribe") {
      return $HalogenF("Unsubscribe", v1._1, v1._2);
    }
    if (v1.tag === "Lift") {
      return $HalogenF("Lift", nat(v1._1));
    }
    if (v1.tag === "ChildQuery") {
      return $HalogenF("ChildQuery", v1._1);
    }
    if (v1.tag === "Raise") {
      return $HalogenF("Raise", v1._1, v1._2);
    }
    if (v1.tag === "Par") {
      return $HalogenF(
        "Par",
        (() => {
          const $0 = hoist(dictFunctor)(nat);
          return foldFreeAp(applicativeFreeAp)((x2) => $FreeAp("Lift", $0(x2)))(v1._1);
        })()
      );
    }
    if (v1.tag === "Fork") {
      return $HalogenF("Fork", hoist(dictFunctor)(nat)(v1._1), v1._2);
    }
    if (v1.tag === "Join") {
      return $HalogenF("Join", v1._1, v1._2);
    }
    if (v1.tag === "Kill") {
      return $HalogenF("Kill", v1._1, v1._2);
    }
    if (v1.tag === "GetRef") {
      return $HalogenF("GetRef", v1._1, v1._2);
    }
    fail();
  })(v);

  // output-es/Halogen.VDom.DOM/index.js
  var haltWidget = (v) => {
    const $0 = v.widget;
    return halt($0);
  };
  var patchWidget = (state, vdom) => {
    if (vdom.tag === "Grafted") {
      const $0 = runGraft(vdom._1);
      return patchWidget(state, $0);
    }
    if (vdom.tag === "Widget") {
      const $0 = vdom._1;
      const res = step(state.widget, $0);
      return $Step$p(res._1, { build: state.build, widget: res }, patchWidget, haltWidget);
    }
    haltWidget(state);
    return state.build(vdom);
  };
  var haltText = (v) => {
    const $0 = v.node;
    const parent2 = parentNode($0);
    return removeChild($0, parent2);
  };
  var patchText = (state, vdom) => {
    if (vdom.tag === "Grafted") {
      const $0 = runGraft(vdom._1);
      return patchText(state, $0);
    }
    if (vdom.tag === "Text") {
      if (state.value === vdom._1) {
        return $Step$p(state.node, state, patchText, haltText);
      }
      const $0 = vdom._1;
      setTextContent($0, state.node);
      return $Step$p(state.node, { build: state.build, node: state.node, value: $0 }, patchText, haltText);
    }
    haltText(state);
    return state.build(vdom);
  };
  var haltKeyed = (v) => {
    const $0 = v.attrs;
    const $1 = v.children;
    const $2 = v.node;
    const parent2 = parentNode($2);
    removeChild($2, parent2);
    forInE($1, (v1, s2) => halt(s2));
    return halt($0);
  };
  var haltElem = (v) => {
    const $0 = v.attrs;
    const $1 = v.children;
    const $2 = v.node;
    const parent2 = parentNode($2);
    removeChild($2, parent2);
    forEachE($1, halt);
    return halt($0);
  };
  var eqElemSpec = (ns1, v, ns2, v1) => v === v1 && (ns1.tag === "Just" ? ns2.tag === "Just" && ns1._1 === ns2._1 : ns1.tag === "Nothing" && ns2.tag === "Nothing");
  var patchElem = (state, vdom) => {
    if (vdom.tag === "Grafted") {
      const $0 = runGraft(vdom._1);
      return patchElem(state, $0);
    }
    if (vdom.tag === "Elem" && eqElemSpec(state.ns, state.name, vdom._1, vdom._2)) {
      if (state.children.length === 0 && vdom._4.length === 0) {
        const attrs22 = step(state.attrs, vdom._3);
        return $Step$p(
          state.node,
          { build: state.build, node: state.node, attrs: attrs22, ns: vdom._1, name: vdom._2, children: state.children },
          patchElem,
          haltElem
        );
      }
      const children2 = diffWithIxE(
        state.children,
        vdom._4,
        (ix4, s2, v2) => {
          const res = step(s2, v2);
          insertChildIx(ix4, res._1, state.node);
          return res;
        },
        (v2, s2) => halt(s2),
        (ix4, v2) => {
          const res = state.build(v2);
          insertChildIx(ix4, res._1, state.node);
          return res;
        }
      );
      const attrs2 = step(state.attrs, vdom._3);
      return $Step$p(state.node, { build: state.build, node: state.node, attrs: attrs2, ns: vdom._1, name: vdom._2, children: children2 }, patchElem, haltElem);
    }
    haltElem(state);
    return state.build(vdom);
  };
  var patchKeyed = (state, vdom) => {
    if (vdom.tag === "Grafted") {
      const $0 = runGraft(vdom._1);
      return patchKeyed(state, $0);
    }
    if (vdom.tag === "Keyed" && eqElemSpec(state.ns, state.name, vdom._1, vdom._2)) {
      const v = vdom._4.length;
      if (state.length === 0 && v === 0) {
        const attrs22 = step(state.attrs, vdom._3);
        return $Step$p(
          state.node,
          { build: state.build, node: state.node, attrs: attrs22, ns: vdom._1, name: vdom._2, children: state.children, length: 0 },
          patchKeyed,
          haltKeyed
        );
      }
      const children2 = diffWithKeyAndIxE(
        state.children,
        vdom._4,
        fst,
        (v2, ix$p, s2, v3) => {
          const $0 = v3._2;
          const res = step(s2, $0);
          insertChildIx(ix$p, res._1, state.node);
          return res;
        },
        (v2, s2) => halt(s2),
        (v2, ix4, v3) => {
          const $0 = v3._2;
          const res = state.build($0);
          insertChildIx(ix4, res._1, state.node);
          return res;
        }
      );
      const attrs2 = step(state.attrs, vdom._3);
      return $Step$p(
        state.node,
        { build: state.build, node: state.node, attrs: attrs2, ns: vdom._1, name: vdom._2, children: children2, length: v },
        patchKeyed,
        haltKeyed
      );
    }
    haltKeyed(state);
    return state.build(vdom);
  };
  var buildWidget = (v, build, w) => {
    const res = v.buildWidget(v)(w);
    return $Step$p(res._1, { build, widget: res }, patchWidget, haltWidget);
  };
  var buildText = (v, build, s2) => {
    const $0 = v.document;
    const node = createTextNode(s2, $0);
    return $Step$p(node, { build, node, value: s2 }, patchText, haltText);
  };
  var buildKeyed = (v, build, ns1, name1, as1, ch1) => {
    const $0 = (() => {
      if (ns1.tag === "Nothing") {
        return nullImpl;
      }
      if (ns1.tag === "Just") {
        return notNull(ns1._1);
      }
      fail();
    })();
    const $1 = v.document;
    const el = createElement($0, name1, $1);
    const children2 = strMapWithIxE(
      ch1,
      fst,
      (v1, ix4, v2) => {
        const $2 = v2._2;
        const res = build($2);
        insertChildIx(ix4, res._1, el);
        return res;
      }
    );
    const attrs = v.buildAttributes(el)(as1);
    return $Step$p(el, { build, node: el, attrs, ns: ns1, name: name1, children: children2, length: ch1.length }, patchKeyed, haltKeyed);
  };
  var buildElem = (v, build, ns1, name1, as1, ch1) => {
    const $0 = (() => {
      if (ns1.tag === "Nothing") {
        return nullImpl;
      }
      if (ns1.tag === "Just") {
        return notNull(ns1._1);
      }
      fail();
    })();
    const $1 = v.document;
    const el = createElement($0, name1, $1);
    const children2 = forE2(
      ch1,
      (ix4, child) => {
        const res = build(child);
        insertChildIx(ix4, res._1, el);
        return res;
      }
    );
    const attrs = v.buildAttributes(el)(as1);
    return $Step$p(el, { build, node: el, attrs, ns: ns1, name: name1, children: children2 }, patchElem, haltElem);
  };
  var buildVDom = (spec) => {
    const build = (v) => {
      if (v.tag === "Text") {
        const $0 = v._1;
        return buildText(spec, build, $0);
      }
      if (v.tag === "Elem") {
        const $0 = v._3;
        const $1 = v._4;
        const $2 = v._2;
        const $3 = v._1;
        return buildElem(spec, build, $3, $2, $0, $1);
      }
      if (v.tag === "Keyed") {
        const $0 = v._3;
        const $1 = v._4;
        const $2 = v._2;
        const $3 = v._1;
        return buildKeyed(spec, build, $3, $2, $0, $1);
      }
      if (v.tag === "Widget") {
        const $0 = v._1;
        return buildWidget(spec, build, $0);
      }
      if (v.tag === "Grafted") {
        const $0 = runGraft(v._1);
        return build($0);
      }
      fail();
    };
    return build;
  };

  // output-es/Halogen.VDom.Thunk/index.js
  var $Thunk = (_1, _2, _3, _4) => ({ tag: "Thunk", _1, _2, _3, _4 });
  var unsafeEqThunk = (v, $0) => refEq2(v._1, $0._1) && refEq2(v._2, $0._2) && v._2(v._4, $0._4);
  var buildThunk = (toVDom) => {
    const patchThunk = (state, t2) => {
      if (unsafeEqThunk(state.thunk, t2)) {
        const $02 = $Step$p(
          state.vdom._1,
          state,
          patchThunk,
          (state$1) => {
            const $03 = state$1.vdom;
            return halt($03);
          }
        );
        return $02;
      }
      const $0 = toVDom(t2._3(t2._4));
      const vdom = step(state.vdom, $0);
      return $Step$p(
        vdom._1,
        { vdom, thunk: t2 },
        patchThunk,
        (state$1) => {
          const $1 = state$1.vdom;
          return halt($1);
        }
      );
    };
    return (spec) => (t2) => {
      const $0 = toVDom(t2._3(t2._4));
      const vdom = buildVDom(spec)($0);
      return $Step$p(
        vdom._1,
        { thunk: t2, vdom },
        patchThunk,
        (state) => {
          const $1 = state.vdom;
          return halt($1);
        }
      );
    };
  };

  // output-es/Halogen.Component/index.js
  var $ComponentSlot = (tag, _1) => ({ tag, _1 });
  var traverse_2 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var mkEval = (args) => (v) => {
    if (v.tag === "Initialize") {
      const $0 = v._1;
      const $1 = traverse_2(args.handleAction)(args.initialize);
      return $Free($1._1, snoc($1._2)((x2) => $Free($FreeView("Return", $0), CatNil)));
    }
    if (v.tag === "Finalize") {
      const $0 = v._1;
      const $1 = traverse_2(args.handleAction)(args.finalize);
      return $Free($1._1, snoc($1._2)((x2) => $Free($FreeView("Return", $0), CatNil)));
    }
    if (v.tag === "Receive") {
      const $0 = v._2;
      const $1 = traverse_2(args.handleAction)(args.receive(v._1));
      return $Free($1._1, snoc($1._2)((x2) => $Free($FreeView("Return", $0), CatNil)));
    }
    if (v.tag === "Action") {
      const $0 = v._2;
      const $1 = args.handleAction(v._1);
      return $Free($1._1, snoc($1._2)((x2) => $Free($FreeView("Return", $0), CatNil)));
    }
    if (v.tag === "Query") {
      const $0 = v._2();
      const $1 = args.handleQuery(v._1._2);
      return $Free(
        $1._1,
        snoc($1._2)((x2) => $Free(
          $FreeView(
            "Return",
            (() => {
              if (x2.tag === "Nothing") {
                return $0;
              }
              if (x2.tag === "Just") {
                return v._1._1(x2._1);
              }
              fail();
            })()
          ),
          CatNil
        ))
      );
    }
    fail();
  };
  var hoistSlot = (dictFunctor) => (nat) => (v) => {
    if (v.tag === "ComponentSlot") {
      return $ComponentSlot("ComponentSlot", { ...v._1, component: hoist2(dictFunctor)(nat)(v._1.component) });
    }
    if (v.tag === "ThunkSlot") {
      return $ComponentSlot(
        "ThunkSlot",
        (() => {
          const $0 = v._1;
          return $Thunk($0._1, $0._2, (x2) => bifunctorHTML.bimap(hoistSlot(dictFunctor)(nat))(identity7)($0._3(x2)), $0._4);
        })()
      );
    }
    fail();
  };
  var hoist2 = (dictFunctor) => (nat) => (c2) => ({
    initialState: c2.initialState,
    render: (x2) => bifunctorHTML.bimap(hoistSlot(dictFunctor)(nat))(identity7)(c2.render(x2)),
    eval: (x2) => hoist(dictFunctor)(nat)(c2.eval(x2))
  });
  var functorComponentSlotBox = {
    map: (f2) => (slot3) => ({
      ...slot3,
      output: (x2) => {
        const $0 = slot3.output(x2);
        if ($0.tag === "Just") {
          return $Maybe("Just", f2($0._1));
        }
        return Nothing;
      }
    })
  };
  var functorComponentSlot = {
    map: (f2) => (v) => {
      if (v.tag === "ComponentSlot") {
        return $ComponentSlot("ComponentSlot", functorComponentSlotBox.map(f2)(v._1));
      }
      if (v.tag === "ThunkSlot") {
        return $ComponentSlot(
          "ThunkSlot",
          (() => {
            const $0 = bifunctorHTML.bimap(functorComponentSlot.map(f2))(f2);
            const $1 = v._1;
            return $Thunk($1._1, $1._2, (x2) => $0($1._3(x2)), $1._4);
          })()
        );
      }
      fail();
    }
  };
  var defaultEval = {
    handleAction: (v) => $Free($FreeView("Return", void 0), CatNil),
    handleQuery: (v) => $Free($FreeView("Return", Nothing), CatNil),
    receive: (v) => Nothing,
    initialize: Nothing,
    finalize: Nothing
  };
  var componentSlot = () => (dictIsSymbol) => (dictOrd) => {
    const lookup22 = lookup2()(dictIsSymbol)(dictOrd);
    const pop22 = pop2()(dictIsSymbol)(dictOrd);
    const insert22 = insert2()(dictIsSymbol)(dictOrd);
    return (label) => (p2) => (comp) => (input) => (output) => ({ get: lookup22(label)(p2), pop: pop22(label)(p2), set: insert22(label)(p2), component: comp, input, output });
  };

  // output-es/Data.Date.Component/index.js
  var $Month = (tag) => tag;
  var January = /* @__PURE__ */ $Month("January");
  var February = /* @__PURE__ */ $Month("February");
  var March = /* @__PURE__ */ $Month("March");
  var April = /* @__PURE__ */ $Month("April");
  var May = /* @__PURE__ */ $Month("May");
  var June = /* @__PURE__ */ $Month("June");
  var July = /* @__PURE__ */ $Month("July");
  var August = /* @__PURE__ */ $Month("August");
  var September = /* @__PURE__ */ $Month("September");
  var October = /* @__PURE__ */ $Month("October");
  var November = /* @__PURE__ */ $Month("November");
  var December = /* @__PURE__ */ $Month("December");
  var eqMonth = {
    eq: (x2) => (y2) => {
      if (x2 === "January") {
        return y2 === "January";
      }
      if (x2 === "February") {
        return y2 === "February";
      }
      if (x2 === "March") {
        return y2 === "March";
      }
      if (x2 === "April") {
        return y2 === "April";
      }
      if (x2 === "May") {
        return y2 === "May";
      }
      if (x2 === "June") {
        return y2 === "June";
      }
      if (x2 === "July") {
        return y2 === "July";
      }
      if (x2 === "August") {
        return y2 === "August";
      }
      if (x2 === "September") {
        return y2 === "September";
      }
      if (x2 === "October") {
        return y2 === "October";
      }
      if (x2 === "November") {
        return y2 === "November";
      }
      return x2 === "December" && y2 === "December";
    }
  };
  var ordMonth = {
    compare: (x2) => (y2) => {
      if (x2 === "January") {
        if (y2 === "January") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "January") {
        return GT;
      }
      if (x2 === "February") {
        if (y2 === "February") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "February") {
        return GT;
      }
      if (x2 === "March") {
        if (y2 === "March") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "March") {
        return GT;
      }
      if (x2 === "April") {
        if (y2 === "April") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "April") {
        return GT;
      }
      if (x2 === "May") {
        if (y2 === "May") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "May") {
        return GT;
      }
      if (x2 === "June") {
        if (y2 === "June") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "June") {
        return GT;
      }
      if (x2 === "July") {
        if (y2 === "July") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "July") {
        return GT;
      }
      if (x2 === "August") {
        if (y2 === "August") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "August") {
        return GT;
      }
      if (x2 === "September") {
        if (y2 === "September") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "September") {
        return GT;
      }
      if (x2 === "October") {
        if (y2 === "October") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "October") {
        return GT;
      }
      if (x2 === "November") {
        if (y2 === "November") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "November") {
        return GT;
      }
      if (x2 === "December" && y2 === "December") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqMonth
  };
  var boundedMonth = { bottom: January, top: December, Ord0: () => ordMonth };
  var boundedEnumMonth = {
    cardinality: 12,
    toEnum: (v) => {
      if (v === 1) {
        return $Maybe("Just", January);
      }
      if (v === 2) {
        return $Maybe("Just", February);
      }
      if (v === 3) {
        return $Maybe("Just", March);
      }
      if (v === 4) {
        return $Maybe("Just", April);
      }
      if (v === 5) {
        return $Maybe("Just", May);
      }
      if (v === 6) {
        return $Maybe("Just", June);
      }
      if (v === 7) {
        return $Maybe("Just", July);
      }
      if (v === 8) {
        return $Maybe("Just", August);
      }
      if (v === 9) {
        return $Maybe("Just", September);
      }
      if (v === 10) {
        return $Maybe("Just", October);
      }
      if (v === 11) {
        return $Maybe("Just", November);
      }
      if (v === 12) {
        return $Maybe("Just", December);
      }
      return Nothing;
    },
    fromEnum: (v) => {
      if (v === "January") {
        return 1;
      }
      if (v === "February") {
        return 2;
      }
      if (v === "March") {
        return 3;
      }
      if (v === "April") {
        return 4;
      }
      if (v === "May") {
        return 5;
      }
      if (v === "June") {
        return 6;
      }
      if (v === "July") {
        return 7;
      }
      if (v === "August") {
        return 8;
      }
      if (v === "September") {
        return 9;
      }
      if (v === "October") {
        return 10;
      }
      if (v === "November") {
        return 11;
      }
      if (v === "December") {
        return 12;
      }
      fail();
    },
    Bounded0: () => boundedMonth,
    Enum1: () => enumMonth
  };
  var enumMonth = {
    succ: (x2) => boundedEnumMonth.toEnum((() => {
      if (x2 === "January") {
        return 2;
      }
      if (x2 === "February") {
        return 3;
      }
      if (x2 === "March") {
        return 4;
      }
      if (x2 === "April") {
        return 5;
      }
      if (x2 === "May") {
        return 6;
      }
      if (x2 === "June") {
        return 7;
      }
      if (x2 === "July") {
        return 8;
      }
      if (x2 === "August") {
        return 9;
      }
      if (x2 === "September") {
        return 10;
      }
      if (x2 === "October") {
        return 11;
      }
      if (x2 === "November") {
        return 12;
      }
      if (x2 === "December") {
        return 13;
      }
      fail();
    })()),
    pred: (x2) => boundedEnumMonth.toEnum((() => {
      if (x2 === "January") {
        return 0;
      }
      if (x2 === "February") {
        return 1;
      }
      if (x2 === "March") {
        return 2;
      }
      if (x2 === "April") {
        return 3;
      }
      if (x2 === "May") {
        return 4;
      }
      if (x2 === "June") {
        return 5;
      }
      if (x2 === "July") {
        return 6;
      }
      if (x2 === "August") {
        return 7;
      }
      if (x2 === "September") {
        return 8;
      }
      if (x2 === "October") {
        return 9;
      }
      if (x2 === "November") {
        return 10;
      }
      if (x2 === "December") {
        return 11;
      }
      fail();
    })()),
    Ord0: () => ordMonth
  };

  // output-es/Data.Semiring/foreign.js
  var intAdd = function(x2) {
    return function(y2) {
      return x2 + y2 | 0;
    };
  };
  var numAdd = function(n1) {
    return function(n2) {
      return n1 + n2;
    };
  };
  var numMul = function(n1) {
    return function(n2) {
      return n1 * n2;
    };
  };

  // output-es/Data.Semiring/index.js
  var semiringNumber = { add: numAdd, zero: 0, mul: numMul, one: 1 };

  // output-es/Data.Ring/foreign.js
  var numSub = function(n1) {
    return function(n2) {
      return n1 - n2;
    };
  };

  // output-es/Data.Ring/index.js
  var ringNumber = { sub: numSub, Semiring0: () => semiringNumber };

  // output-es/Data.EuclideanRing/foreign.js
  var intMod = function(x2) {
    return function(y2) {
      if (y2 === 0)
        return 0;
      var yy = Math.abs(y2);
      return (x2 % yy + yy) % yy;
    };
  };

  // output-es/Data.Date/foreign.js
  var createDate = function(y2, m2, d3) {
    var date = new Date(Date.UTC(y2, m2, d3));
    if (y2 >= 0 && y2 < 100) {
      date.setUTCFullYear(y2);
    }
    return date;
  };
  function canonicalDateImpl(ctor, y2, m2, d3) {
    var date = createDate(y2, m2 - 1, d3);
    return ctor(date.getUTCFullYear())(date.getUTCMonth() + 1)(date.getUTCDate());
  }

  // output-es/Data.Date/index.js
  var $$$Date = (_1, _2, _3) => ({ tag: "Date", _1, _2, _3 });
  var canonicalDate = (y2) => (m2) => (d3) => canonicalDateImpl(
    (y$p) => (m$p) => (d$p) => $$$Date(
      y$p,
      (() => {
        const $0 = boundedEnumMonth.toEnum(m$p);
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })(),
      d$p
    ),
    y2,
    (() => {
      if (m2 === "January") {
        return 1;
      }
      if (m2 === "February") {
        return 2;
      }
      if (m2 === "March") {
        return 3;
      }
      if (m2 === "April") {
        return 4;
      }
      if (m2 === "May") {
        return 5;
      }
      if (m2 === "June") {
        return 6;
      }
      if (m2 === "July") {
        return 7;
      }
      if (m2 === "August") {
        return 8;
      }
      if (m2 === "September") {
        return 9;
      }
      if (m2 === "October") {
        return 10;
      }
      if (m2 === "November") {
        return 11;
      }
      if (m2 === "December") {
        return 12;
      }
      fail();
    })(),
    d3
  );

  // output-es/Data.Time/index.js
  var $Time = (_1, _2, _3, _4) => ({ tag: "Time", _1, _2, _3, _4 });

  // output-es/Data.DateTime/index.js
  var $DateTime = (_1, _2) => ({ tag: "DateTime", _1, _2 });

  // output-es/Data.DateTime.Instant/foreign.js
  function toDateTimeImpl(ctor) {
    return function(instant) {
      var dt = new Date(instant);
      return ctor(dt.getUTCFullYear())(dt.getUTCMonth() + 1)(dt.getUTCDate())(dt.getUTCHours())(dt.getUTCMinutes())(dt.getUTCSeconds())(dt.getUTCMilliseconds());
    };
  }

  // output-es/Data.DateTime.Instant/index.js
  var toDateTime = /* @__PURE__ */ toDateTimeImpl((y2) => (mo) => (d3) => (h2) => (mi) => (s2) => (ms) => $DateTime(
    canonicalDate(y2)((() => {
      const $0 = boundedEnumMonth.toEnum(mo);
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })())(d3),
    $Time(h2, mi, s2, ms)
  ));

  // output-es/Data.JSDate/foreign.js
  function now() {
    return /* @__PURE__ */ new Date();
  }
  function dateMethodEff(method, date) {
    return function() {
      return date[method]();
    };
  }

  // output-es/Control.Monad.Logger.Class/index.js
  var log$p = (dictMonadLogger) => {
    const MonadEffect0 = dictMonadLogger.MonadEffect0();
    return (level) => (tags) => (message2) => MonadEffect0.Monad0().Bind1().bind(MonadEffect0.liftEffect(now))((x2) => dictMonadLogger.log({ level, message: message2, tags, timestamp: x2 }));
  };

  // output-es/Data.Log.Filter/index.js
  var minimumLevel = (dictMonadEffect) => (level) => (logger) => (message2) => {
    if (ordLogLevel.compare(message2.level)(level) !== "LT") {
      return logger(message2);
    }
    return dictMonadEffect.Monad0().Applicative0().pure();
  };

  // output-es/Ansi.Codes/index.js
  var $Color = (tag) => tag;
  var $EscapeCode = (tag, _1, _2) => ({ tag, _1, _2 });
  var $GraphicsParam = (tag, _1) => ({ tag, _1 });
  var $RenderingMode = (tag) => tag;
  var Bold = /* @__PURE__ */ $RenderingMode("Bold");
  var Red = /* @__PURE__ */ $Color("Red");
  var Yellow = /* @__PURE__ */ $Color("Yellow");
  var Blue = /* @__PURE__ */ $Color("Blue");
  var Cyan = /* @__PURE__ */ $Color("Cyan");
  var White = /* @__PURE__ */ $Color("White");
  var BrightBlack = /* @__PURE__ */ $Color("BrightBlack");
  var Reset = /* @__PURE__ */ $GraphicsParam("Reset");
  var graphicsParamToString = (gp) => {
    if (gp.tag === "Reset") {
      return "0";
    }
    if (gp.tag === "PMode") {
      return showIntImpl((() => {
        if (gp._1 === "Bold") {
          return 1;
        }
        if (gp._1 === "Dim") {
          return 2;
        }
        if (gp._1 === "Italic") {
          return 3;
        }
        if (gp._1 === "Underline") {
          return 4;
        }
        if (gp._1 === "Inverse") {
          return 7;
        }
        if (gp._1 === "Strikethrough") {
          return 9;
        }
        fail();
      })());
    }
    if (gp.tag === "PForeground") {
      return showIntImpl((() => {
        if (gp._1 === "Black") {
          return 30;
        }
        if (gp._1 === "Red") {
          return 31;
        }
        if (gp._1 === "Green") {
          return 32;
        }
        if (gp._1 === "Yellow") {
          return 33;
        }
        if (gp._1 === "Blue") {
          return 34;
        }
        if (gp._1 === "Magenta") {
          return 35;
        }
        if (gp._1 === "Cyan") {
          return 36;
        }
        if (gp._1 === "White") {
          return 37;
        }
        if (gp._1 === "BrightBlack") {
          return 90;
        }
        if (gp._1 === "BrightRed") {
          return 91;
        }
        if (gp._1 === "BrightGreen") {
          return 92;
        }
        if (gp._1 === "BrightYellow") {
          return 93;
        }
        if (gp._1 === "BrightBlue") {
          return 94;
        }
        if (gp._1 === "BrightMagenta") {
          return 95;
        }
        if (gp._1 === "BrightCyan") {
          return 96;
        }
        if (gp._1 === "BrightWhite") {
          return 97;
        }
        fail();
      })());
    }
    if (gp.tag === "PBackground") {
      return showIntImpl((() => {
        if (gp._1 === "Black") {
          return 40;
        }
        if (gp._1 === "Red") {
          return 41;
        }
        if (gp._1 === "Green") {
          return 42;
        }
        if (gp._1 === "Yellow") {
          return 43;
        }
        if (gp._1 === "Blue") {
          return 44;
        }
        if (gp._1 === "Magenta") {
          return 45;
        }
        if (gp._1 === "Cyan") {
          return 46;
        }
        if (gp._1 === "White") {
          return 47;
        }
        if (gp._1 === "BrightBlack") {
          return 100;
        }
        if (gp._1 === "BrightRed") {
          return 101;
        }
        if (gp._1 === "BrightGreen") {
          return 102;
        }
        if (gp._1 === "BrightYellow") {
          return 103;
        }
        if (gp._1 === "BrightBlue") {
          return 104;
        }
        if (gp._1 === "BrightMagenta") {
          return 105;
        }
        if (gp._1 === "BrightCyan") {
          return 106;
        }
        if (gp._1 === "BrightWhite") {
          return 107;
        }
        fail();
      })());
    }
    fail();
  };
  var escapeCodeToString = (x2) => {
    if (x2.tag === "Up") {
      return "\x1B[" + showIntImpl(x2._1) + "A";
    }
    if (x2.tag === "Down") {
      return "\x1B[" + showIntImpl(x2._1) + "B";
    }
    if (x2.tag === "Forward") {
      return "\x1B[" + showIntImpl(x2._1) + "C";
    }
    if (x2.tag === "Back") {
      return "\x1B[" + showIntImpl(x2._1) + "D";
    }
    if (x2.tag === "NextLine") {
      return "\x1B[" + showIntImpl(x2._1) + "E";
    }
    if (x2.tag === "PreviousLine") {
      return "\x1B[" + showIntImpl(x2._1) + "F";
    }
    if (x2.tag === "HorizontalAbsolute") {
      return "\x1B[" + showIntImpl(x2._1) + "G";
    }
    if (x2.tag === "Position") {
      return "\x1B[" + showIntImpl(x2._1) + ";" + showIntImpl(x2._2) + "H";
    }
    if (x2.tag === "EraseData") {
      if (x2._1 === "ToEnd") {
        return "\x1B[0J";
      }
      if (x2._1 === "FromBeginning") {
        return "\x1B[1J";
      }
      if (x2._1 === "Entire") {
        return "\x1B[2J";
      }
      fail();
    }
    if (x2.tag === "EraseLine") {
      if (x2._1 === "ToEnd") {
        return "\x1B[0K";
      }
      if (x2._1 === "FromBeginning") {
        return "\x1B[1K";
      }
      if (x2._1 === "Entire") {
        return "\x1B[2K";
      }
      fail();
    }
    if (x2.tag === "ScrollUp") {
      return "\x1B[" + showIntImpl(x2._1) + "S";
    }
    if (x2.tag === "ScrollDown") {
      return "\x1B[" + showIntImpl(x2._1) + "T";
    }
    if (x2.tag === "Graphics") {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, v = go$a1;
          if (v.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v.tag === "Cons") {
            go$a0 = b.init ? { init: false, acc: v._1 } : { init: false, acc: b.acc + ";" + v._1 };
            go$a1 = v._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return "\x1B[" + go({ init: false, acc: graphicsParamToString(x2._1._1) })(listMap(graphicsParamToString)(x2._1._2)).acc + "m";
    }
    if (x2.tag === "SavePosition") {
      return "\x1B[s";
    }
    if (x2.tag === "RestorePosition") {
      return "\x1B[u";
    }
    if (x2.tag === "QueryPosition") {
      return "\x1B[6n";
    }
    if (x2.tag === "HideCursor") {
      return "\x1B[?25l";
    }
    if (x2.tag === "ShowCursor") {
      return "\x1B[?25h";
    }
    fail();
  };

  // output-es/Ansi.Output/index.js
  var withGraphics = (params) => (text) => escapeCodeToString($EscapeCode("Graphics", params)) + text + escapeCodeToString($EscapeCode(
    "Graphics",
    $NonEmpty(Reset, Nil)
  ));

  // output-es/Data.Semigroup/foreign.js
  var concatString = function(s1) {
    return function(s2) {
      return s1 + s2;
    };
  };
  var concatArray = function(xs) {
    return function(ys) {
      if (xs.length === 0)
        return ys;
      if (ys.length === 0)
        return xs;
      return xs.concat(ys);
    };
  };

  // output-es/Data.Semigroup/index.js
  var semigroupString = { append: concatString };
  var semigroupArray = { append: concatArray };

  // output-es/Data.Log.Formatter.Pretty/index.js
  var toUnfoldable2 = /* @__PURE__ */ (() => {
    const $0 = unfoldableArray.unfoldr(stepUnfoldr);
    return (x2) => $0($MapIter("IterNode", x2, IterLeaf));
  })();
  var indentEachLine1 = /* @__PURE__ */ arrayMap(($0) => "   " + $0);
  var showLevel = (v) => {
    if (v === "Trace") {
      return withGraphics($NonEmpty($GraphicsParam("PForeground", Cyan), Nil))("[TRACE]");
    }
    if (v === "Debug") {
      return withGraphics($NonEmpty($GraphicsParam("PForeground", Blue), Nil))("[DEBUG]");
    }
    if (v === "Info") {
      return withGraphics($NonEmpty($GraphicsParam("PForeground", White), Nil))("[INFO]");
    }
    if (v === "Warn") {
      return withGraphics($NonEmpty($GraphicsParam("PForeground", Yellow), Nil))("[WARN]");
    }
    if (v === "Error") {
      return withGraphics($NonEmpty($GraphicsParam("PForeground", Red), Nil))("[ERROR]");
    }
    fail();
  };
  var showMainLine = (dictMonadEffect) => (v) => {
    const $0 = v.level;
    const $1 = v.message;
    return dictMonadEffect.liftEffect((() => {
      const $2 = dateMethodEff("toISOString", v.timestamp);
      return () => {
        const a$p = $2();
        return joinWith(" ")([
          showLevel($0),
          withGraphics($NonEmpty($GraphicsParam("PForeground", BrightBlack), Nil))(a$p),
          withGraphics($NonEmpty($GraphicsParam("PForeground", Cyan), Nil))($1)
        ]);
      };
    })());
  };
  var showSpecial = (dictApplicative) => (x2) => {
    const $0 = withGraphics($NonEmpty($GraphicsParam("PForeground", Yellow), Nil))(x2);
    return (label) => dictApplicative.pure([label + $0]);
  };
  var showJsDate = (dictMonadEffect) => (value2) => (label) => dictMonadEffect.liftEffect((() => {
    const $0 = dateMethodEff("toISOString", value2);
    return () => {
      const $1 = $0();
      return showSpecial(applicativeEffect)($1)(label)();
    };
  })());
  var tagLines = (dictMonadEffect) => (tags) => {
    if (tags.tag === "Leaf") {
      return Nothing;
    }
    return $Maybe("Just", dictMonadEffect.Monad0().Bind1().Apply0().Functor0().map((x2) => indentEachLine1(concat(x2)))(lineify(dictMonadEffect)(tags)));
  };
  var showTag = (dictMonadEffect) => {
    const Applicative0 = dictMonadEffect.Monad0().Applicative0();
    return (v) => {
      if (v.tag === "StringTag") {
        const $0 = v._1;
        return (label) => Applicative0.pure([label + $0]);
      }
      if (v.tag === "IntTag") {
        return showSpecial(Applicative0)(showIntImpl(v._1));
      }
      if (v.tag === "NumberTag") {
        return showSpecial(Applicative0)(showNumberImpl(v._1));
      }
      if (v.tag === "BooleanTag") {
        return showSpecial(Applicative0)(v._1 ? "true" : "false");
      }
      if (v.tag === "TagSetTag") {
        return showSubTags(dictMonadEffect)(v._1);
      }
      if (v.tag === "JSDateTag") {
        return showJsDate(dictMonadEffect)(v._1);
      }
      fail();
    };
  };
  var showSubTags = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    return (value2) => (label) => Monad0.Bind1().Apply0().Functor0().map(cons(label))((() => {
      const $0 = Monad0.Applicative0().pure([]);
      const $1 = tagLines(dictMonadEffect)(value2);
      if ($1.tag === "Nothing") {
        return $0;
      }
      if ($1.tag === "Just") {
        return $1._1;
      }
      fail();
    })());
  };
  var showField = (dictMonadEffect) => (v) => showTag(dictMonadEffect)(v._2)(withGraphics($NonEmpty(
    $GraphicsParam("PMode", Bold),
    Nil
  ))(v._1) + withGraphics($NonEmpty($GraphicsParam("PMode", Bold), Nil))(": "));
  var lineify = (dictMonadEffect) => {
    const sequence1 = traversableArray.traverse(dictMonadEffect.Monad0().Applicative0())(identity5);
    return (tags) => sequence1(arrayMap(showField(dictMonadEffect))(toUnfoldable2(tags)));
  };
  var showTags = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const $0 = Monad0.Bind1().Apply0().Functor0();
    return (x2) => {
      const $1 = tagLines(dictMonadEffect)(x2);
      if ($1.tag === "Nothing") {
        return Monad0.Applicative0().pure("");
      }
      if ($1.tag === "Just") {
        const $2 = joinWith("\n");
        return $0.map((x$1) => "\n" + $2(x$1))($1._1);
      }
      fail();
    };
  };
  var prettyFormatter = (dictMonadEffect) => {
    const Apply0 = dictMonadEffect.Monad0().Bind1().Apply0();
    const showTags1 = showTags(dictMonadEffect);
    return (message2) => Apply0.apply(Apply0.Functor0().map(concatString)(showMainLine(dictMonadEffect)(message2)))(showTags1(message2.tags));
  };

  // output-es/Data.Log.Tag/index.js
  var $Tag = (tag, _1) => ({ tag, _1 });

  // output-es/Effect.Console/foreign.js
  var log2 = function(s2) {
    return function() {
      console.log(s2);
    };
  };
  var warn = function(s2) {
    return function() {
      console.warn(s2);
    };
  };

  // output-es/Effect.Class.Console/index.js
  var log3 = (dictMonadEffect) => (x2) => dictMonadEffect.liftEffect(log2(x2));

  // output-es/Logging/index.js
  var logMessage = (dictMonadEffect) => {
    const $0 = dictMonadEffect.Monad0().Bind1();
    const prettyFormatter2 = prettyFormatter(dictMonadEffect);
    return (logLevel) => minimumLevel(dictMonadEffect)(logLevel)((a2) => $0.bind(prettyFormatter2(a2))(log3(dictMonadEffect)));
  };

  // output-es/Web.HTML/foreign.js
  var windowImpl = function() {
    return window;
  };

  // output-es/Web.Internal.FFI/foreign.js
  function _unsafeReadProtoTagged(nothing, just, name2, value2) {
    if (typeof window !== "undefined") {
      var ty = window[name2];
      if (ty != null && value2 instanceof ty) {
        return just(value2);
      }
    }
    var obj = value2;
    while (obj != null) {
      var proto = Object.getPrototypeOf(obj);
      var constructorName = proto.constructor.name;
      if (constructorName === name2) {
        return just(value2);
      } else if (constructorName === "Object") {
        return nothing;
      }
      obj = proto;
    }
    return nothing;
  }

  // output-es/Web.Internal.FFI/index.js
  var unsafeReadProtoTagged = (name2) => (value2) => _unsafeReadProtoTagged(Nothing, Just, name2, value2);

  // output-es/Web.HTML.Window/foreign.js
  function document2(window2) {
    return function() {
      return window2.document;
    };
  }
  function location(window2) {
    return function() {
      return window2.location;
    };
  }
  function confirm(str2) {
    return function(window2) {
      return function() {
        return window2.confirm(str2);
      };
    };
  }
  function localStorage(window2) {
    return function() {
      return window2.localStorage;
    };
  }

  // output-es/Web.Storage.Storage/foreign.js
  function _getItem(key2) {
    return function(storage) {
      return function() {
        return storage.getItem(key2);
      };
    };
  }
  function setItem(key2) {
    return function(value2) {
      return function(storage) {
        return function() {
          storage.setItem(key2, value2);
        };
      };
    };
  }
  function clear2(storage) {
    return function() {
      storage.clear();
    };
  }

  // output-es/Web.Storage.Storage/index.js
  var getItem = (s2) => {
    const $0 = _getItem(s2);
    return (x2) => {
      const $1 = $0(x2);
      return () => {
        const a$p = $1();
        return nullable(a$p, Nothing, Just);
      };
    };
  };

  // output-es/Capability.LocalStorage/index.js
  var saveProgress = (dictLocalStorage) => {
    const itemName1 = dictLocalStorage.itemName;
    return (key2) => (value2) => () => {
      const $0 = windowImpl();
      const storage = localStorage($0)();
      const oldValue = getItem(itemName1 + "-" + dictLocalStorage.Show0().show(key2))(storage)();
      return setItem(itemName1 + "-" + dictLocalStorage.Show0().show(key2))(dictLocalStorage.Show1().show((() => {
        const $1 = (() => {
          if (oldValue.tag === "Just") {
            return dictLocalStorage.parseValue(oldValue._1);
          }
          if (oldValue.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })();
        if ($1.tag === "Nothing") {
          return value2;
        }
        if ($1.tag === "Just") {
          return dictLocalStorage.Semigroup2().append($1._1)(value2);
        }
        fail();
      })()))(storage)();
    };
  };
  var getProgress = (dictLocalStorage) => {
    const itemName1 = dictLocalStorage.itemName;
    return (key2) => {
      const $0 = getItem(itemName1 + "-" + dictLocalStorage.Show0().show(key2));
      return () => {
        const $1 = windowImpl();
        const $2 = localStorage($1)();
        const str2 = $0($2)();
        if (str2.tag === "Just") {
          return dictLocalStorage.parseValue(str2._1);
        }
        if (str2.tag === "Nothing") {
          return Nothing;
        }
        fail();
      };
    };
  };
  var deleteProgress = () => {
    const $0 = windowImpl();
    const $1 = localStorage($0)();
    return clear2($1)();
  };

  // output-es/Game.Level.Suite/index.js
  var showLevelId = { show: (v) => v.suiteName + "-" + v.levelName };
  var toLevelSuite = (dictFoldable) => (suiteName) => (levels) => ({ suiteName, levels: dictFoldable.foldr((v) => insert3(v.name)(v))(empty)(levels) });

  // output-es/Capability.LocalStorage.LevelProgress/index.js
  var $LevelProgress = (tag) => tag;
  var Unlocked = /* @__PURE__ */ $LevelProgress("Unlocked");
  var Incomplete = /* @__PURE__ */ $LevelProgress("Incomplete");
  var Completed = /* @__PURE__ */ $LevelProgress("Completed");
  var showLevelProgress = {
    show: (v) => {
      if (v === "Unlocked") {
        return "Unlocked";
      }
      if (v === "Incomplete") {
        return "Incomplete";
      }
      if (v === "Completed") {
        return "Completed";
      }
      fail();
    }
  };
  var eqLevelProgress = {
    eq: (x2) => (y2) => {
      if (x2 === "Unlocked") {
        return y2 === "Unlocked";
      }
      if (x2 === "Incomplete") {
        return y2 === "Incomplete";
      }
      return x2 === "Completed" && y2 === "Completed";
    }
  };
  var ordLevelProgress = {
    compare: (x2) => (y2) => {
      if (x2 === "Unlocked") {
        if (y2 === "Unlocked") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Unlocked") {
        return GT;
      }
      if (x2 === "Incomplete") {
        if (y2 === "Incomplete") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Incomplete") {
        return GT;
      }
      if (x2 === "Completed" && y2 === "Completed") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqLevelProgress
  };
  var semigroupLevelProgress = {
    append: (x2) => (y2) => {
      const v = ordLevelProgress.compare(x2)(y2);
      if (v === "LT") {
        return y2;
      }
      if (v === "EQ") {
        return x2;
      }
      if (v === "GT") {
        return x2;
      }
      fail();
    }
  };
  var localStorageLevelIdLevelP = {
    itemName: "level-progress",
    parseValue: (v) => {
      if (v === "Unlocked") {
        return $Maybe("Just", Unlocked);
      }
      if (v === "Incomplete") {
        return $Maybe("Just", Incomplete);
      }
      if (v === "Completed") {
        return $Maybe("Just", Completed);
      }
      return Nothing;
    },
    Show0: () => showLevelId,
    Show1: () => showLevelProgress,
    Semigroup2: () => semigroupLevelProgress
  };

  // output-es/Data.Set/index.js
  var foldableSet = {
    foldMap: (dictMonoid) => {
      const foldMap1 = foldableList.foldMap(dictMonoid);
      return (f2) => {
        const $0 = foldMap1(f2);
        return (x2) => $0(keys(x2));
      };
    },
    foldl: (f2) => (x2) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, v = go$a1;
          if (v.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v.tag === "Cons") {
            go$a0 = f2(b)(v._1);
            go$a1 = v._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      const $0 = go(x2);
      return (x$1) => $0(keys(x$1));
    },
    foldr: (f2) => (x2) => {
      const $0 = foldableList.foldr(f2)(x2);
      return (x$1) => $0(keys(x$1));
    }
  };
  var ordSet = (dictOrd) => {
    const $0 = dictOrd.Eq0();
    const eqSet1 = { eq: (v) => (v1) => eqMap($0)(eqUnit).eq(v)(v1) };
    return { compare: (s1) => (s2) => ordList(dictOrd).compare(keys(s1))(keys(s2)), Eq0: () => eqSet1 };
  };
  var map = (dictOrd) => (f2) => foldableSet.foldl((m2) => (a2) => insert(dictOrd)(f2(a2))()(m2))(Leaf2);

  // output-es/Game.Piece.Capacity/index.js
  var $Capacity = (tag) => tag;
  var OneBit = /* @__PURE__ */ $Capacity("OneBit");
  var TwoBit = /* @__PURE__ */ $Capacity("TwoBit");
  var FourBit = /* @__PURE__ */ $Capacity("FourBit");
  var EightBit = /* @__PURE__ */ $Capacity("EightBit");
  var eqCapacity = {
    eq: (x2) => (y2) => {
      if (x2 === "OneBit") {
        return y2 === "OneBit";
      }
      if (x2 === "TwoBit") {
        return y2 === "TwoBit";
      }
      if (x2 === "FourBit") {
        return y2 === "FourBit";
      }
      return x2 === "EightBit" && y2 === "EightBit";
    }
  };
  var ordCapacity = {
    compare: (x2) => (y2) => {
      if (x2 === "OneBit") {
        if (y2 === "OneBit") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "OneBit") {
        return GT;
      }
      if (x2 === "TwoBit") {
        if (y2 === "TwoBit") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "TwoBit") {
        return GT;
      }
      if (x2 === "FourBit") {
        if (y2 === "FourBit") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "FourBit") {
        return GT;
      }
      if (x2 === "EightBit" && y2 === "EightBit") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqCapacity
  };
  var showCapacity = {
    show: (capacity) => "Capacity " + showIntImpl((() => {
      if (capacity === "OneBit") {
        return 1;
      }
      if (capacity === "TwoBit") {
        return 2;
      }
      if (capacity === "FourBit") {
        return 4;
      }
      if (capacity === "EightBit") {
        return 8;
      }
      fail();
    })())
  };
  var halveCapacity = (v) => {
    if (v === "OneBit") {
      return Nothing;
    }
    if (v === "TwoBit") {
      return $Maybe("Just", OneBit);
    }
    if (v === "FourBit") {
      return $Maybe("Just", TwoBit);
    }
    if (v === "EightBit") {
      return $Maybe("Just", FourBit);
    }
    fail();
  };
  var doubleCapacity = (v) => {
    if (v === "OneBit") {
      return $Maybe("Just", TwoBit);
    }
    if (v === "TwoBit") {
      return $Maybe("Just", FourBit);
    }
    if (v === "FourBit") {
      return $Maybe("Just", EightBit);
    }
    if (v === "EightBit") {
      return Nothing;
    }
    fail();
  };

  // output-es/Data.Bounded/foreign.js
  var topChar = String.fromCharCode(65535);
  var bottomChar = String.fromCharCode(0);
  var topNumber = Number.POSITIVE_INFINITY;
  var bottomNumber = Number.NEGATIVE_INFINITY;

  // output-es/Data.Enum/foreign.js
  function toCharCode(c2) {
    return c2.charCodeAt(0);
  }
  function fromCharCode(c2) {
    return String.fromCharCode(c2);
  }

  // output-es/Data.Enum/index.js
  var enumInt = {
    succ: (n2) => {
      if (n2 < 2147483647) {
        return $Maybe("Just", n2 + 1 | 0);
      }
      return Nothing;
    },
    pred: (n2) => {
      if (n2 > -2147483648) {
        return $Maybe("Just", n2 - 1 | 0);
      }
      return Nothing;
    },
    Ord0: () => ordInt
  };
  var enumFromTo = (dictEnum) => {
    const Ord0 = dictEnum.Ord0();
    return (dictUnfoldable1) => (v) => (v1) => {
      if (Ord0.Eq0().eq(v)(v1)) {
        return replicate1(dictUnfoldable1)(1)(v);
      }
      if (Ord0.compare(v)(v1) === "LT") {
        return dictUnfoldable1.unfoldr1((a2) => $Tuple(
          a2,
          (() => {
            const $0 = dictEnum.succ(a2);
            if ($0.tag === "Just") {
              if (Ord0.compare($0._1)(v1) !== "GT") {
                return $Maybe("Just", $0._1);
              }
              return Nothing;
            }
            if ($0.tag === "Nothing") {
              return Nothing;
            }
            fail();
          })()
        ))(v);
      }
      return dictUnfoldable1.unfoldr1((a2) => $Tuple(
        a2,
        (() => {
          const $0 = dictEnum.pred(a2);
          if ($0.tag === "Just") {
            if (Ord0.compare($0._1)(v1) !== "LT") {
              return $Maybe("Just", $0._1);
            }
            return Nothing;
          }
          if ($0.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })()
      ))(v);
    };
  };

  // output-es/Game.Piece.Direction/index.js
  var $CardinalDirection = (tag) => tag;
  var Up = /* @__PURE__ */ $CardinalDirection("Up");
  var Right2 = /* @__PURE__ */ $CardinalDirection("Right");
  var Down = /* @__PURE__ */ $CardinalDirection("Down");
  var Left2 = /* @__PURE__ */ $CardinalDirection("Left");
  var showCardinalDirection = {
    show: (v) => {
      if (v === "Up") {
        return "Up";
      }
      if (v === "Right") {
        return "Right";
      }
      if (v === "Down") {
        return "Down";
      }
      if (v === "Left") {
        return "Left";
      }
      fail();
    }
  };
  var eqCardinalDirection = {
    eq: (x2) => (y2) => {
      if (x2 === "Up") {
        return y2 === "Up";
      }
      if (x2 === "Right") {
        return y2 === "Right";
      }
      if (x2 === "Down") {
        return y2 === "Down";
      }
      return x2 === "Left" && y2 === "Left";
    }
  };
  var ordCardinalDirection = {
    compare: (x2) => (y2) => {
      if (x2 === "Up") {
        if (y2 === "Up") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Up") {
        return GT;
      }
      if (x2 === "Right") {
        if (y2 === "Right") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Right") {
        return GT;
      }
      if (x2 === "Down") {
        if (y2 === "Down") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Down") {
        return GT;
      }
      if (x2 === "Left" && y2 === "Left") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqCardinalDirection
  };
  var enumCardinalDirection = {
    succ: (v) => {
      if (v === "Up") {
        return $Maybe("Just", Right2);
      }
      if (v === "Right") {
        return $Maybe("Just", Down);
      }
      if (v === "Down") {
        return $Maybe("Just", Left2);
      }
      if (v === "Left") {
        return Nothing;
      }
      fail();
    },
    pred: (v) => {
      if (v === "Up") {
        return Nothing;
      }
      if (v === "Right") {
        return $Maybe("Just", Up);
      }
      if (v === "Down") {
        return $Maybe("Just", Right2);
      }
      if (v === "Left") {
        return $Maybe("Just", Down);
      }
      fail();
    },
    Ord0: () => ordCardinalDirection
  };
  var boundedCardinalDirection = { bottom: Up, top: Left2, Ord0: () => ordCardinalDirection };
  var boundedEnumCardinalDirect = {
    cardinality: 4,
    fromEnum: (v) => {
      if (v === "Up") {
        return 0;
      }
      if (v === "Right") {
        return 1;
      }
      if (v === "Down") {
        return 2;
      }
      if (v === "Left") {
        return 3;
      }
      fail();
    },
    toEnum: (v) => {
      if (v === 0) {
        return $Maybe("Just", Up);
      }
      if (v === 1) {
        return $Maybe("Just", Right2);
      }
      if (v === 2) {
        return $Maybe("Just", Down);
      }
      if (v === 3) {
        return $Maybe("Just", Left2);
      }
      return Nothing;
    },
    Bounded0: () => boundedCardinalDirection,
    Enum1: () => enumCardinalDirection
  };
  var rotateDirection = (dir2) => (rot) => {
    const $0 = boundedEnumCardinalDirect.toEnum(intMod((() => {
      if (dir2 === "Up") {
        return 0 + rot | 0;
      }
      if (dir2 === "Right") {
        return 1 + rot | 0;
      }
      if (dir2 === "Down") {
        return 2 + rot | 0;
      }
      if (dir2 === "Left") {
        return 3 + rot | 0;
      }
      fail();
    })())(4));
    if ($0.tag === "Nothing") {
      return Up;
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  };
  var clockwiseRotation = (d1) => (d22) => intMod((() => {
    if (d22 === "Up") {
      return 0;
    }
    if (d22 === "Right") {
      return 1;
    }
    if (d22 === "Down") {
      return 2;
    }
    if (d22 === "Left") {
      return 3;
    }
    fail();
  })() - (() => {
    if (d1 === "Up") {
      return 0;
    }
    if (d1 === "Right") {
      return 1;
    }
    if (d1 === "Down") {
      return 2;
    }
    if (d1 === "Left") {
      return 3;
    }
    fail();
  })() | 0)(4);
  var allDirections = /* @__PURE__ */ enumFromTo(enumCardinalDirection)(unfoldable1Array)(Up)(Left2);

  // output-es/Control.Category/index.js
  var categoryFn = { identity: (x2) => x2, Semigroupoid0: () => semigroupoidFn };

  // output-es/Data.Profunctor/index.js
  var identity12 = (x2) => x2;
  var profunctorFn = { dimap: (a2b) => (c2d) => (b2c) => (x2) => c2d(b2c(a2b(x2))) };

  // output-es/Data.Profunctor.Strong/index.js
  var identity13 = (x2) => x2;
  var strongFn = /* @__PURE__ */ (() => ({ first: (a2b) => (v) => $Tuple(a2b(v._1), v._2), second: functorTuple.map, Profunctor0: () => profunctorFn }))();
  var fanout = (dictCategory) => {
    const identity1 = dictCategory.identity;
    const $0 = dictCategory.Semigroupoid0();
    const $1 = dictCategory.Semigroupoid0();
    return (dictStrong) => (l2) => (r2) => $0.compose($1.compose(dictStrong.second(r2))(dictStrong.first(l2)))(dictStrong.Profunctor0().dimap(identity13)((a2) => $Tuple(a2, a2))(identity1));
  };

  // output-es/Data.Lens.Getter/index.js
  var identity14 = (x2) => x2;
  var use = (dictMonadState) => (p2) => dictMonadState.state((s2) => $Tuple(p2(identity14)(s2), s2));

  // output-es/Data.Lens.Internal.Forget/index.js
  var profunctorForget = { dimap: (f2) => (v) => (v1) => (x2) => v1(f2(x2)) };
  var strongForget = { first: (v) => (x2) => v(x2._1), second: (v) => (x2) => v(x2._2), Profunctor0: () => profunctorForget };
  var choiceForget = (dictMonoid) => {
    const mempty1 = dictMonoid.mempty;
    return {
      left: (v) => (v2) => {
        if (v2.tag === "Left") {
          return v(v2._1);
        }
        if (v2.tag === "Right") {
          return mempty1;
        }
        fail();
      },
      right: (v) => (v2) => {
        if (v2.tag === "Left") {
          return mempty1;
        }
        if (v2.tag === "Right") {
          return v(v2._1);
        }
        fail();
      },
      Profunctor0: () => profunctorForget
    };
  };

  // output-es/Data.Lens.Iso/index.js
  var coerced = () => () => (dictProfunctor) => (pab) => dictProfunctor.dimap(unsafeCoerce)(unsafeCoerce)(pab);

  // output-es/Data.Lens.Iso.Newtype/index.js
  var _Newtype = () => () => (dictProfunctor) => coerced()()(dictProfunctor);

  // output-es/Data.Lens.Prism/index.js
  var prism = (to) => (fro) => (dictChoice) => {
    const Profunctor0 = dictChoice.Profunctor0();
    return (pab) => Profunctor0.dimap(fro)((v2) => {
      if (v2.tag === "Left") {
        return v2._1;
      }
      if (v2.tag === "Right") {
        return v2._1;
      }
      fail();
    })(dictChoice.right(Profunctor0.dimap(identity12)(to)(pab)));
  };
  var prism$p = (to) => (fro) => (dictChoice) => prism(to)((s2) => {
    const $0 = fro(s2);
    if ($0.tag === "Nothing") {
      return $Either("Left", s2);
    }
    if ($0.tag === "Just") {
      return $Either("Right", $0._1);
    }
    fail();
  })(dictChoice);
  var only = (dictEq) => (x2) => (dictChoice) => prism$p((v) => x2)((x$1) => {
    if (dictEq.eq(x$1)(x2)) {
      return $Maybe("Just", void 0);
    }
    return Nothing;
  })(dictChoice);

  // output-es/Data.Lens.Record/index.js
  var prop = (dictIsSymbol) => () => () => (l2) => (dictStrong) => (pab) => dictStrong.Profunctor0().dimap((s2) => $Tuple(
    unsafeGet(dictIsSymbol.reflectSymbol(l2))(s2),
    (b) => unsafeSet(dictIsSymbol.reflectSymbol(l2))(b)(s2)
  ))((v) => v._2(v._1))(dictStrong.first(pab));

  // output-es/Game.Piece.Port/index.js
  var $PortType = (tag) => tag;
  var Input = /* @__PURE__ */ $PortType("Input");
  var Output = /* @__PURE__ */ $PortType("Output");
  var showPort = {
    show: (v) => (() => {
      if (v.portType === "Input") {
        return "Input ";
      }
      if (v.portType === "Output") {
        return "Output ";
      }
      fail();
    })() + showCapacity.show(v.capacity)
  };
  var eqPortType = {
    eq: (x2) => (y2) => {
      if (x2 === "Input") {
        return y2 === "Input";
      }
      return x2 === "Output" && y2 === "Output";
    }
  };
  var ordPortType = {
    compare: (x2) => (y2) => {
      if (x2 === "Input") {
        if (y2 === "Input") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Input") {
        return GT;
      }
      if (x2 === "Output" && y2 === "Output") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqPortType
  };
  var eqPort = {
    eq: (x2) => (y2) => (() => {
      if (x2.capacity === "OneBit") {
        return y2.capacity === "OneBit";
      }
      if (x2.capacity === "TwoBit") {
        return y2.capacity === "TwoBit";
      }
      if (x2.capacity === "FourBit") {
        return y2.capacity === "FourBit";
      }
      return x2.capacity === "EightBit" && y2.capacity === "EightBit";
    })() && (x2.portType === "Input" ? y2.portType === "Input" : x2.portType === "Output" && y2.portType === "Output")
  };
  var ordPort = {
    compare: (x2) => (y2) => {
      const v = ordCapacity.compare(x2.capacity)(y2.capacity);
      if (v === "LT") {
        return LT;
      }
      if (v === "GT") {
        return GT;
      }
      return ordPortType.compare(x2.portType)(y2.portType);
    },
    Eq0: () => eqPort
  };
  var matchingPortType = (v) => {
    if (v === "Input") {
      return Output;
    }
    if (v === "Output") {
      return Input;
    }
    fail();
  };
  var _portType = (dictStrong) => {
    const $0 = _Newtype()()(dictStrong.Profunctor0());
    return (x2) => $0(prop({ reflectSymbol: () => "portType" })()()($$Proxy)(dictStrong)(x2));
  };
  var _portType1 = /* @__PURE__ */ _portType(strongForget);
  var isInput = /* @__PURE__ */ _portType1(/* @__PURE__ */ only(eqPortType)(Input)(/* @__PURE__ */ choiceForget(/* @__PURE__ */ (() => {
    const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
    return { mempty: false, Semigroup0: () => semigroupDisj1 };
  })()))((v) => true));
  var isOutput = (x2) => !isInput(x2);
  var matchingPort = /* @__PURE__ */ _portType(strongFn)(matchingPortType);
  var portMatches = (port2) => (otherPort) => {
    const $0 = matchingPort(otherPort);
    return (() => {
      if (port2.capacity === "OneBit") {
        return $0.capacity === "OneBit";
      }
      if (port2.capacity === "TwoBit") {
        return $0.capacity === "TwoBit";
      }
      if (port2.capacity === "FourBit") {
        return $0.capacity === "FourBit";
      }
      return port2.capacity === "EightBit" && $0.capacity === "EightBit";
    })() && (port2.portType === "Input" ? $0.portType === "Input" : port2.portType === "Output" && $0.portType === "Output");
  };
  var portType = /* @__PURE__ */ _portType1(identity14);
  var _portCapacity = (dictStrong) => {
    const $0 = _Newtype()()(dictStrong.Profunctor0());
    return (x2) => $0(prop({ reflectSymbol: () => "capacity" })()()($$Proxy)(dictStrong)(x2));
  };
  var portCapacity = /* @__PURE__ */ _portCapacity(strongForget)(identity14);

  // output-es/Data.Monoid/index.js
  var monoidString = { mempty: "", Semigroup0: () => semigroupString };
  var monoidOrdering = { mempty: EQ, Semigroup0: () => semigroupOrdering };
  var monoidArray = { mempty: [], Semigroup0: () => semigroupArray };
  var monoidRecord = () => (dictMonoidRecord) => {
    const semigroupRecord1 = { append: dictMonoidRecord.SemigroupRecord0().appendRecord($$Proxy) };
    return { mempty: dictMonoidRecord.memptyRecord($$Proxy), Semigroup0: () => semigroupRecord1 };
  };
  var power = (dictMonoid) => {
    const mempty1 = dictMonoid.mempty;
    const $0 = dictMonoid.Semigroup0();
    return (x2) => {
      const go = (p2) => {
        if (p2 <= 0) {
          return mempty1;
        }
        if (p2 === 1) {
          return x2;
        }
        if (intMod(p2)(2) === 0) {
          const x$p2 = go(intDiv(p2, 2));
          return $0.append(x$p2)(x$p2);
        }
        const x$p = go(intDiv(p2, 2));
        return $0.append(x$p)($0.append(x$p)(x2));
      };
      return go;
    };
  };

  // output-es/Game.Piece.Signal/index.js
  var fold2 = /* @__PURE__ */ (() => foldableArray.foldMap(monoidString)(identity2))();
  var showSignal = { show: (v) => toUpper(fold2(arrayMap((shift) => toStringAs(16)(v >> shift & 15))([12, 8, 4, 0]))) };
  var eqSignal = { eq: (x2) => (y2) => x2 === y2 };
  var ordSignal = { compare: (x2) => (y2) => ordInt.compare(x2)(y2), Eq0: () => eqSignal };

  // output-es/Data.HeytingAlgebra/foreign.js
  var boolConj = function(b1) {
    return function(b2) {
      return b1 && b2;
    };
  };
  var boolDisj = function(b1) {
    return function(b2) {
      return b1 || b2;
    };
  };
  var boolNot = function(b) {
    return !b;
  };

  // output-es/Data.HeytingAlgebra/index.js
  var heytingAlgebraBoolean = { ff: false, tt: true, implies: (a2) => (b) => heytingAlgebraBoolean.disj(heytingAlgebraBoolean.not(a2))(b), conj: boolConj, disj: boolDisj, not: boolNot };

  // output-es/Data.Map/index.js
  var keys3 = /* @__PURE__ */ (() => functorMap.map((v) => {
  }))();

  // output-es/Game.Piece.Types/index.js
  var $IsSimplifiable = (tag, _1) => ({ tag, _1 });
  var and2 = /* @__PURE__ */ and(foldableArray)(heytingAlgebraBoolean);
  var eq1 = /* @__PURE__ */ (() => eqMap(eqCardinalDirection)(eqPort).eq)();
  var fold3 = /* @__PURE__ */ (() => foldableArray.foldMap(monoidOrdering)(identity2))();
  var compare1 = /* @__PURE__ */ (() => ordMap(ordCardinalDirection)(ordPort).compare)();
  var eqPieceId = { eq: (x2) => (y2) => x2 === y2 };
  var ordPieceId = { compare: (x2) => (y2) => ordString.compare(x2)(y2), Eq0: () => eqPieceId };
  var eqPiece = { eq: (v) => (v1) => and2([v.name === v1.name, eq1(v.ports)(v1.ports)]) };
  var ordPiece = { compare: (v) => (v1) => fold3([ordString.compare(v.name)(v1.name), compare1(v.ports)(v1.ports)]), Eq0: () => eqPiece };

  // output-es/Game.Piece.ConnectionPiece/index.js
  var ordSet2 = /* @__PURE__ */ ordSet(ordCardinalDirection);
  var fromFoldable1 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var fromFoldable22 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableSet);
  var ordTuple3 = /* @__PURE__ */ ordTuple(ordCardinalDirection);
  var fromFoldable3 = /* @__PURE__ */ foldlArray((m2) => (a2) => insert(ordCardinalDirection)(a2)()(m2))(Leaf2);
  var wirePieceNames = /* @__PURE__ */ (() => fromFoldable(ordSet2)(foldableArray)([
    $Tuple($$$Map("Node", 1, 1, Up, void 0, Leaf2, Leaf2), "left-piece"),
    $Tuple($$$Map("Node", 1, 1, Right2, void 0, Leaf2, Leaf2), "id-piece"),
    $Tuple($$$Map("Node", 1, 1, Down, void 0, Leaf2, Leaf2), "right-piece"),
    $Tuple(
      unsafeUnionWith(
        ordCardinalDirection.compare,
        $$const,
        $$$Map("Node", 1, 1, Up, void 0, Leaf2, Leaf2),
        $$$Map("Node", 1, 1, Right2, void 0, Leaf2, Leaf2)
      ),
      "intersection-left-piece"
    ),
    $Tuple(
      unsafeUnionWith(
        ordCardinalDirection.compare,
        $$const,
        $$$Map("Node", 1, 1, Up, void 0, Leaf2, Leaf2),
        $$$Map("Node", 1, 1, Down, void 0, Leaf2, Leaf2)
      ),
      "intersection-junction-piece"
    ),
    $Tuple(
      unsafeUnionWith(
        ordCardinalDirection.compare,
        $$const,
        $$$Map("Node", 1, 1, Right2, void 0, Leaf2, Leaf2),
        $$$Map("Node", 1, 1, Down, void 0, Leaf2, Leaf2)
      ),
      "intersection-right-piece"
    ),
    $Tuple(
      unsafeUnionWith(
        ordCardinalDirection.compare,
        $$const,
        $$$Map("Node", 1, 1, Up, void 0, Leaf2, Leaf2),
        unsafeUnionWith(
          ordCardinalDirection.compare,
          $$const,
          $$$Map("Node", 1, 1, Right2, void 0, Leaf2, Leaf2),
          $$$Map("Node", 1, 1, Down, void 0, Leaf2, Leaf2)
        )
      ),
      "super-piece"
    )
  ]))();
  var mkMultipleInputConnectionPiece = (piece) => ({
    complexity: { space: 3, time: 0 },
    eval: (inputs) => fromFoldable1([
      $Tuple(
        piece.conn1.to,
        (() => {
          const $0 = lookup(ordCardinalDirection)(piece.conn1.from)(inputs);
          if ($0.tag === "Nothing") {
            return 0;
          }
          if ($0.tag === "Just") {
            return $0._1;
          }
          fail();
        })()
      ),
      $Tuple(
        piece.conn2.to,
        (() => {
          const $0 = lookup(ordCardinalDirection)(piece.conn2.from)(inputs);
          if ($0.tag === "Nothing") {
            return 0;
          }
          if ($0.tag === "Just") {
            return $0._1;
          }
          fail();
        })()
      )
    ]),
    isSimplifiable: $Maybe(
      "Just",
      $IsSimplifiable(
        "IsConnection",
        fromFoldable1([$Tuple(piece.conn1.to, piece.conn1.from), $Tuple(piece.conn2.to, piece.conn2.from)])
      )
    ),
    name: piece.name,
    ports: fromFoldable1([
      $Tuple(piece.conn1.from, { portType: Input, capacity: piece.conn1.capacity }),
      $Tuple(piece.conn1.to, { portType: Output, capacity: piece.conn1.capacity }),
      $Tuple(piece.conn2.from, { portType: Input, capacity: piece.conn2.capacity }),
      $Tuple(piece.conn2.to, { portType: Output, capacity: piece.conn2.capacity })
    ]),
    shouldRipple: true,
    updateCapacity: (dir2) => (capacity) => {
      if ((() => {
        if (dir2 === "Up") {
          return piece.conn1.from === "Up";
        }
        if (dir2 === "Right") {
          return piece.conn1.from === "Right";
        }
        if (dir2 === "Down") {
          return piece.conn1.from === "Down";
        }
        return dir2 === "Left" && piece.conn1.from === "Left";
      })() || (() => {
        if (dir2 === "Up") {
          return piece.conn2.to === "Up";
        }
        if (dir2 === "Right") {
          return piece.conn2.to === "Right";
        }
        if (dir2 === "Down") {
          return piece.conn2.to === "Down";
        }
        return dir2 === "Left" && piece.conn2.to === "Left";
      })()) {
        return $Maybe("Just", mkMultipleInputConnectionPiece({ ...piece, conn1: { ...piece.conn1, capacity } }));
      }
      return $Maybe("Just", mkMultipleInputConnectionPiece({ ...piece, conn2: { ...piece.conn2, capacity } }));
    },
    updatePort: (v) => (v1) => Nothing
  });
  var reverseChickenPiece = /* @__PURE__ */ mkMultipleInputConnectionPiece({
    name: "reverse-chicken-piece",
    conn1: { from: Left2, to: Up, capacity: OneBit },
    conn2: { from: Right2, to: Down, capacity: OneBit }
  });
  var mkConnectionPiece = (piece) => ({
    complexity: { space: 1, time: 0 },
    eval: (inputs) => {
      const $0 = lookup(ordCardinalDirection)(Left2)(inputs);
      const signal = (() => {
        if ($0.tag === "Nothing") {
          return 0;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })();
      return fromFoldable22(map(ordTuple3(ordSignal))((d3) => $Tuple(d3, signal))(piece.outputs));
    },
    isSimplifiable: $Maybe(
      "Just",
      $IsSimplifiable(
        "IsConnection",
        fromFoldable22(map(ordTuple3(ordCardinalDirection))((d3) => $Tuple(d3, Left2))(piece.outputs))
      )
    ),
    name: (() => {
      const $0 = lookup(ordSet2)(piece.outputs)(wirePieceNames);
      if ($0.tag === "Nothing") {
        return _crashWith("impossible to create wirePiece with no outputs");
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })(),
    ports: unsafeUnionWith(
      ordCardinalDirection.compare,
      $$const,
      $$$Map(
        "Node",
        1,
        1,
        Left2,
        { portType: Input, capacity: piece.capacity },
        Leaf2,
        Leaf2
      ),
      fromFoldable22(map(ordTuple3(ordPort))((d3) => $Tuple(d3, { portType: Output, capacity: piece.capacity }))(piece.outputs))
    ),
    shouldRipple: true,
    updateCapacity: (dir2) => (capacity) => $Maybe("Just", mkConnectionPiece({ ...piece, capacity })),
    updatePort: (dir2) => (portType2) => {
      if (dir2 === "Left") {
        return Nothing;
      }
      if (portType2.tag === "Just") {
        if (portType2._1 === "Input") {
          const newOutputs = insert(ordCardinalDirection)(dir2)()(piece.outputs);
          if (!eqMap(eqCardinalDirection)(eqUnit).eq(piece.outputs)(newOutputs)) {
            return $Maybe("Just", mkConnectionPiece({ ...piece, outputs: newOutputs }));
          }
          return Nothing;
        }
        if (portType2._1 === "Output") {
          return Nothing;
        }
        fail();
      }
      if (portType2.tag === "Nothing") {
        const newOutputs = $$delete(ordCardinalDirection)(dir2)(piece.outputs);
        if (!eqMap(eqCardinalDirection)(eqUnit).eq(piece.outputs)(newOutputs)) {
          if (newOutputs.tag === "Leaf") {
            return $Maybe(
              "Just",
              mkConnectionPiece({
                ...piece,
                outputs: $$$Map("Node", 1, 1, Right2, void 0, Leaf2, Leaf2)
              })
            );
          }
          return $Maybe("Just", mkConnectionPiece({ ...piece, outputs: newOutputs }));
        }
        return Nothing;
      }
      fail();
    }
  });
  var rightPiece = /* @__PURE__ */ mkConnectionPiece({ capacity: OneBit, outputs: /* @__PURE__ */ fromFoldable3([Down]) });
  var superPiece = /* @__PURE__ */ mkConnectionPiece({
    capacity: OneBit,
    outputs: /* @__PURE__ */ fromFoldable3([Up, Right2, Down])
  });
  var leftPiece = /* @__PURE__ */ mkConnectionPiece({ capacity: OneBit, outputs: /* @__PURE__ */ fromFoldable3([Up]) });
  var isWirePiece = (piece) => {
    const $0 = piece.name;
    const go = (v) => {
      if (v.tag === "Leaf") {
        return false;
      }
      if (v.tag === "Node") {
        return go(v._5) || $0 === v._4 || go(v._6);
      }
      fail();
    };
    return go(wirePieceNames);
  };
  var idPiece = /* @__PURE__ */ mkConnectionPiece({ capacity: OneBit, outputs: /* @__PURE__ */ fromFoldable3([Right2]) });
  var crossPiece = /* @__PURE__ */ mkMultipleInputConnectionPiece({
    name: "cross-piece",
    conn1: { from: Left2, to: Right2, capacity: OneBit },
    conn2: { from: Up, to: Down, capacity: OneBit }
  });
  var cornerCutPiece = /* @__PURE__ */ mkMultipleInputConnectionPiece({
    name: "corner-cut-piece",
    conn1: { from: Left2, to: Down, capacity: OneBit },
    conn2: { from: Up, to: Right2, capacity: OneBit }
  });
  var chickenPiece = /* @__PURE__ */ mkMultipleInputConnectionPiece({
    name: "chicken-piece",
    conn1: { from: Left2, to: Down, capacity: OneBit },
    conn2: { from: Right2, to: Up, capacity: OneBit }
  });
  var allConnectionPieces = [idPiece, leftPiece, rightPiece, superPiece, crossPiece, cornerCutPiece, chickenPiece, reverseChickenPiece];

  // output-es/Game.Level/index.js
  var traverse = /* @__PURE__ */ (() => traversableArray.traverse(applicativeArray))();
  var fromFoldable4 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var mkLevel = () => () => (level) => ({
    name: "default name",
    goal: idPiece,
    description: "default description",
    testCases: [],
    requiresAutomaticTesting: false,
    availablePieces: [],
    conversation: (() => {
      const $0 = _pure();
      return (v) => $0;
    })(),
    otherRestrictions: [],
    unlocksUponCompletion: [],
    enableBoardSizeChange: true,
    enableClickAndDragPaths: true,
    ...level
  });
  var binaryTestInputs = (directions) => arrayBind(traverse((v) => [0, 1])(directions))((inputs) => [
    fromFoldable4(zipWithImpl(Tuple, directions, inputs))
  ]);

  // output-es/Data.Int.Bits/foreign.js
  var and3 = function(n1) {
    return function(n2) {
      return n1 & n2;
    };
  };
  var or = function(n1) {
    return function(n2) {
      return n1 | n2;
    };
  };
  var xor = function(n1) {
    return function(n2) {
      return n1 ^ n2;
    };
  };

  // output-es/Game.Piece.BivariatePiece/index.js
  var fromFoldable5 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var mkBivariatePiece = (piece) => ({
    complexity: piece.complexity,
    eval: (inputs) => $$$Map(
      "Node",
      1,
      1,
      Right2,
      (() => {
        if (piece.capacity === "OneBit") {
          return 1;
        }
        if (piece.capacity === "TwoBit") {
          return 3;
        }
        if (piece.capacity === "FourBit") {
          return 15;
        }
        if (piece.capacity === "EightBit") {
          return 255;
        }
        fail();
      })() & piece.operation((() => {
        const $0 = lookup(ordCardinalDirection)(Left2)(inputs);
        if ($0.tag === "Nothing") {
          return 0;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })())((() => {
        const $0 = lookup(ordCardinalDirection)(Up)(inputs);
        if ($0.tag === "Nothing") {
          return 0;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })()),
      Leaf2,
      Leaf2
    ),
    isSimplifiable: Nothing,
    name: piece.name,
    ports: fromFoldable5([
      $Tuple(Up, { portType: Input, capacity: piece.capacity }),
      $Tuple(Left2, { portType: Input, capacity: piece.capacity }),
      $Tuple(Right2, { portType: Output, capacity: piece.capacity })
    ]),
    shouldRipple: true,
    updateCapacity: (dir2) => (capacity) => {
      if (dir2 === "Down") {
        return Nothing;
      }
      return $Maybe("Just", mkBivariatePiece({ ...piece, capacity }));
    },
    updatePort: (v) => (v1) => Nothing
  });
  var orPiece = /* @__PURE__ */ mkBivariatePiece({ name: "or-piece", operation: or, capacity: OneBit, complexity: { space: 3, time: 0 } });
  var xorPiece = /* @__PURE__ */ mkBivariatePiece({ name: "xor-piece", operation: xor, capacity: OneBit, complexity: { space: 3, time: 0 } });
  var andPiece = /* @__PURE__ */ mkBivariatePiece({ name: "and-piece", operation: and3, capacity: OneBit, complexity: { space: 3, time: 0 } });
  var allBivariatePieces = [orPiece, andPiece, xorPiece];

  // output-es/Game.Piece.UnivariatePiece/index.js
  var fromFoldable6 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var monoidAdditive = /* @__PURE__ */ (() => {
    const semigroupAdditive1 = { append: (v) => (v1) => v + v1 };
    return { mempty: 0, Semigroup0: () => semigroupAdditive1 };
  })();
  var mempty = /* @__PURE__ */ (() => monoidRecord()((() => {
    const Semigroup0 = monoidAdditive.Semigroup0();
    const Semigroup0$1 = monoidAdditive.Semigroup0();
    const semigroupRecordCons1 = { appendRecord: (v) => (ra) => (rb) => ({ space: Semigroup0.append(ra.space)(rb.space), time: Semigroup0$1.append(ra.time)(rb.time) }) };
    return { memptyRecord: (v) => ({ space: monoidAdditive.mempty, time: monoidAdditive.mempty }), SemigroupRecord0: () => semigroupRecordCons1 };
  })()).mempty)();
  var mkUnivariatePiece = (piece) => ({
    complexity: piece.complexity,
    eval: (inputs) => $$$Map(
      "Node",
      1,
      1,
      Right2,
      (() => {
        if (piece.capacity === "OneBit") {
          return 1;
        }
        if (piece.capacity === "TwoBit") {
          return 3;
        }
        if (piece.capacity === "FourBit") {
          return 15;
        }
        if (piece.capacity === "EightBit") {
          return 255;
        }
        fail();
      })() & piece.operation((() => {
        const $0 = lookup(ordCardinalDirection)(Left2)(inputs);
        if ($0.tag === "Nothing") {
          return 0;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })()),
      Leaf2,
      Leaf2
    ),
    isSimplifiable: Nothing,
    name: piece.name,
    ports: fromFoldable6([
      $Tuple(Left2, { portType: Input, capacity: piece.capacity }),
      $Tuple(Right2, { portType: Output, capacity: piece.capacity })
    ]),
    shouldRipple: true,
    updateCapacity: (dir2) => (capacity) => {
      if (elem(eqCardinalDirection)(dir2)([Left2, Right2])) {
        return $Maybe("Just", mkUnivariatePiece({ ...piece, capacity }));
      }
      return Nothing;
    },
    updatePort: (v) => (v1) => Nothing
  });
  var notPiece = /* @__PURE__ */ mkUnivariatePiece({ name: "not-piece", capacity: OneBit, operation: (v) => ~v, complexity: { space: 2, time: 0 } });
  var allUnivariatePieces = [notPiece];

  // output-es/Resources.LevelSuites.Intermediate.Suite/index.js
  var intermediateSuite = /* @__PURE__ */ toLevelSuite(foldableArray)("Intermediate Suite")([
    /* @__PURE__ */ mkLevel()()({
      goal: crossPiece,
      name: "Cross over",
      description: "Propogate the signal on the left to the right, and the top to the bottom",
      testCases: /* @__PURE__ */ binaryTestInputs([Left2, Up]),
      requiresAutomaticTesting: false,
      availablePieces: [
        idPiece,
        superPiece,
        leftPiece,
        rightPiece,
        xorPiece
      ],
      otherRestrictions: []
    }),
    /* @__PURE__ */ mkLevel()()({
      goal: andPiece,
      name: "From Or, birthed And",
      description: "Create an and-piece using only or-piece and not-piece",
      testCases: /* @__PURE__ */ binaryTestInputs([Left2, Up]),
      availablePieces: [orPiece, notPiece]
    }),
    /* @__PURE__ */ mkLevel()()({
      goal: xorPiece,
      name: "Exclusive Or: Pick One",
      description: "Output true when EXACTLY one input is true. If both inputs are true, output false",
      testCases: /* @__PURE__ */ binaryTestInputs([Left2, Up]),
      requiresAutomaticTesting: false,
      availablePieces: [
        idPiece,
        notPiece,
        orPiece,
        andPiece,
        crossPiece
      ],
      otherRestrictions: []
    })
  ]);

  // output-es/Game.Piece.FusePiece/index.js
  var fromFoldable7 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var mkSeverPiece = (v) => {
    const $0 = v.outputCapacity;
    return {
      name: "sever-piece",
      eval: (inputs) => {
        const $1 = lookup(ordCardinalDirection)(Left2)(inputs);
        if ($1.tag === "Nothing") {
          return fromFoldable7([$Tuple(Up, 0), $Tuple(Down, 0)]);
        }
        if ($1.tag === "Just") {
          const n2 = (() => {
            if ($0 === "OneBit") {
              return 1;
            }
            if ($0 === "TwoBit") {
              return 2;
            }
            if ($0 === "FourBit") {
              return 4;
            }
            if ($0 === "EightBit") {
              return 8;
            }
            fail();
          })();
          return fromFoldable7([$Tuple(Up, $1._1 >> n2), $Tuple(Down, $1._1 & ((1 << n2) - 1 | 0))]);
        }
        fail();
      },
      complexity: { space: 1, time: 0 },
      shouldRipple: false,
      updateCapacity: (dir2) => (capacity) => {
        if (dir2 === "Right") {
          return Nothing;
        }
        if (dir2 === "Left") {
          const $1 = halveCapacity(capacity);
          if ($1.tag === "Just") {
            if ((() => {
              if ($0 === "OneBit") {
                return $1._1 !== "OneBit";
              }
              if ($0 === "TwoBit") {
                return $1._1 !== "TwoBit";
              }
              if ($0 === "FourBit") {
                return $1._1 !== "FourBit";
              }
              return !($0 === "EightBit" && $1._1 === "EightBit");
            })()) {
              return $Maybe("Just", mkSeverPiece({ outputCapacity: $1._1 }));
            }
            return Nothing;
          }
          if ($1.tag === "Nothing") {
            return Nothing;
          }
          fail();
        }
        if ((() => {
          if (capacity === "OneBit") {
            return $0 !== "OneBit";
          }
          if (capacity === "TwoBit") {
            return $0 !== "TwoBit";
          }
          if (capacity === "FourBit") {
            return $0 !== "FourBit";
          }
          return !(capacity === "EightBit" && $0 === "EightBit");
        })()) {
          return $Maybe("Just", mkSeverPiece({ outputCapacity: capacity }));
        }
        return Nothing;
      },
      ports: (() => {
        const $1 = doubleCapacity($0);
        if ($1.tag === "Just") {
          return fromFoldable7([
            $Tuple(Left2, { portType: Input, capacity: $1._1 }),
            $Tuple(Up, { portType: Output, capacity: $0 }),
            $Tuple(Down, { portType: Output, capacity: $0 })
          ]);
        }
        if ($1.tag === "Nothing") {
          return Leaf2;
        }
        fail();
      })(),
      updatePort: (v1) => (v2) => Nothing,
      isSimplifiable: Nothing
    };
  };
  var severPiece = /* @__PURE__ */ mkSeverPiece({ outputCapacity: OneBit });
  var mkFusePiece = (v) => {
    const $0 = v.inputCapacity;
    return {
      name: "fuse-piece",
      eval: (inputs) => {
        const $1 = lookup(ordCardinalDirection)(Up)(inputs);
        return $$$Map(
          "Node",
          1,
          1,
          Right2,
          (() => {
            const $2 = lookup(ordCardinalDirection)(Down)(inputs);
            const n2 = (() => {
              if ($0 === "OneBit") {
                return 1;
              }
              if ($0 === "TwoBit") {
                return 2;
              }
              if ($0 === "FourBit") {
                return 4;
              }
              if ($0 === "EightBit") {
                return 8;
              }
              fail();
            })();
            return (() => {
              if ($1.tag === "Nothing") {
                return 0 << n2;
              }
              if ($1.tag === "Just") {
                return $1._1 << n2;
              }
              fail();
            })() | (() => {
              if ($2.tag === "Nothing") {
                return 0;
              }
              if ($2.tag === "Just") {
                return $2._1;
              }
              fail();
            })() & ((1 << n2) - 1 | 0);
          })(),
          Leaf2,
          Leaf2
        );
      },
      complexity: { space: 1, time: 0 },
      shouldRipple: false,
      updateCapacity: (dir2) => (capacity) => {
        if (dir2 === "Left") {
          return Nothing;
        }
        if (dir2 === "Right") {
          const $1 = halveCapacity(capacity);
          if ($1.tag === "Just") {
            if ((() => {
              if ($1._1 === "OneBit") {
                return $0 !== "OneBit";
              }
              if ($1._1 === "TwoBit") {
                return $0 !== "TwoBit";
              }
              if ($1._1 === "FourBit") {
                return $0 !== "FourBit";
              }
              return !($1._1 === "EightBit" && $0 === "EightBit");
            })()) {
              return $Maybe("Just", mkFusePiece({ inputCapacity: $1._1 }));
            }
            return Nothing;
          }
          if ($1.tag === "Nothing") {
            return Nothing;
          }
          fail();
        }
        if ((() => {
          if (capacity === "OneBit") {
            return $0 !== "OneBit";
          }
          if (capacity === "TwoBit") {
            return $0 !== "TwoBit";
          }
          if (capacity === "FourBit") {
            return $0 !== "FourBit";
          }
          return !(capacity === "EightBit" && $0 === "EightBit");
        })()) {
          const $1 = doubleCapacity(capacity);
          if ($1.tag === "Just") {
            return $Maybe("Just", mkFusePiece({ inputCapacity: capacity }));
          }
          if ($1.tag === "Nothing") {
            return Nothing;
          }
          fail();
        }
        return Nothing;
      },
      ports: (() => {
        const $1 = doubleCapacity($0);
        if ($1.tag === "Just") {
          return fromFoldable7([
            $Tuple(Up, { portType: Input, capacity: $0 }),
            $Tuple(Down, { portType: Input, capacity: $0 }),
            $Tuple(Right2, { portType: Output, capacity: $1._1 })
          ]);
        }
        if ($1.tag === "Nothing") {
          return Leaf2;
        }
        fail();
      })(),
      updatePort: (v1) => (v2) => Nothing,
      isSimplifiable: Nothing
    };
  };
  var fusePiece = /* @__PURE__ */ mkFusePiece({ inputCapacity: OneBit });

  // output-es/Resources.LevelSuites.ShiftingSuite/index.js
  var shiftingSuite = /* @__PURE__ */ toLevelSuite(foldableArray)("Shifting Suite")([
    /* @__PURE__ */ mkLevel()()({
      goal: /* @__PURE__ */ mkUnivariatePiece({
        name: "shift-left-piece",
        capacity: FourBit,
        operation: (v) => v << 1,
        complexity: mempty
      }),
      name: "4 bit left shift",
      description: "For each of the 4 bits in the input, shift them up towards the left by one place\n bluefdsajafdskl",
      testCases: /* @__PURE__ */ arrayMap(/* @__PURE__ */ singleton(Left2))([0, 1, 2, 3, 8, 9, 15]),
      requiresAutomaticTesting: false,
      availablePieces: [
        severPiece,
        fusePiece,
        idPiece,
        leftPiece,
        rightPiece
      ],
      otherRestrictions: []
    })
  ]);

  // output-es/Data.String.CodePoints/foreign.js
  var hasArrayFrom = typeof Array.from === "function";
  var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
  var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
  var hasCodePointAt = typeof String.prototype.codePointAt === "function";
  var _unsafeCodePointAt0 = function(fallback) {
    return hasCodePointAt ? function(str2) {
      return str2.codePointAt(0);
    } : fallback;
  };
  var _codePointAt = function(fallback) {
    return function(Just2) {
      return function(Nothing2) {
        return function(unsafeCodePointAt02) {
          return function(index2) {
            return function(str2) {
              var length5 = str2.length;
              if (index2 < 0 || index2 >= length5)
                return Nothing2;
              if (hasStringIterator) {
                var iter = str2[Symbol.iterator]();
                for (var i2 = index2; ; --i2) {
                  var o2 = iter.next();
                  if (o2.done)
                    return Nothing2;
                  if (i2 === 0)
                    return Just2(unsafeCodePointAt02(o2.value));
                }
              }
              return fallback(index2)(str2);
            };
          };
        };
      };
    };
  };
  var _singleton = function(fallback) {
    return hasFromCodePoint ? String.fromCodePoint : fallback;
  };
  var _take = function(fallback) {
    return function(n2) {
      if (hasStringIterator) {
        return function(str2) {
          var accum = "";
          var iter = str2[Symbol.iterator]();
          for (var i2 = 0; i2 < n2; ++i2) {
            var o2 = iter.next();
            if (o2.done)
              return accum;
            accum += o2.value;
          }
          return accum;
        };
      }
      return fallback(n2);
    };
  };
  var _toCodePointArray = function(fallback) {
    return function(unsafeCodePointAt02) {
      if (hasArrayFrom) {
        return function(str2) {
          return Array.from(str2, unsafeCodePointAt02);
        };
      }
      return fallback;
    };
  };

  // output-es/Data.String.CodePoints/index.js
  var uncons3 = (s2) => {
    const v = length(s2);
    if (v === 0) {
      return Nothing;
    }
    if (v === 1) {
      return $Maybe("Just", { head: toCharCode(charAt(0)(s2)), tail: "" });
    }
    const cu1 = toCharCode(charAt(1)(s2));
    const cu0 = toCharCode(charAt(0)(s2));
    if (55296 <= cu0 && cu0 <= 56319 && 56320 <= cu1 && cu1 <= 57343) {
      return $Maybe("Just", { head: (((cu0 - 55296 | 0) * 1024 | 0) + (cu1 - 56320 | 0) | 0) + 65536 | 0, tail: drop(2)(s2) });
    }
    return $Maybe("Just", { head: cu0, tail: drop(1)(s2) });
  };
  var unconsButWithTuple = (s2) => {
    const $0 = uncons3(s2);
    if ($0.tag === "Just") {
      return $Maybe("Just", $Tuple($0._1.head, $0._1.tail));
    }
    return Nothing;
  };
  var toCodePointArrayFallback = (s2) => unfoldableArray.unfoldr(unconsButWithTuple)(s2);
  var unsafeCodePointAt0Fallback = (s2) => {
    const cu0 = toCharCode(charAt(0)(s2));
    if (55296 <= cu0 && cu0 <= 56319 && length(s2) > 1) {
      const cu1 = toCharCode(charAt(1)(s2));
      if (56320 <= cu1 && cu1 <= 57343) {
        return (((cu0 - 55296 | 0) * 1024 | 0) + (cu1 - 56320 | 0) | 0) + 65536 | 0;
      }
    }
    return cu0;
  };
  var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
  var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
  var fromCharCode2 = (x2) => singleton2((() => {
    if (x2 >= 0 && x2 <= 65535) {
      return fromCharCode(x2);
    }
    if (x2 < 0) {
      return "\0";
    }
    return "\uFFFF";
  })());
  var singletonFallback = (v) => {
    if (v <= 65535) {
      return fromCharCode2(v);
    }
    return fromCharCode2(intDiv(v - 65536 | 0, 1024) + 55296 | 0) + fromCharCode2(intMod(v - 65536 | 0)(1024) + 56320 | 0);
  };
  var singleton3 = /* @__PURE__ */ _singleton(singletonFallback);
  var takeFallback = (v) => (v1) => {
    if (v < 1) {
      return "";
    }
    const v2 = uncons3(v1);
    if (v2.tag === "Just") {
      return singleton3(v2._1.head) + takeFallback(v - 1 | 0)(v2._1.tail);
    }
    return v1;
  };
  var take2 = /* @__PURE__ */ _take(takeFallback);
  var codePointAtFallback = (codePointAtFallback$a0$copy) => (codePointAtFallback$a1$copy) => {
    let codePointAtFallback$a0 = codePointAtFallback$a0$copy, codePointAtFallback$a1 = codePointAtFallback$a1$copy, codePointAtFallback$c = true, codePointAtFallback$r;
    while (codePointAtFallback$c) {
      const n2 = codePointAtFallback$a0, s2 = codePointAtFallback$a1;
      const v = uncons3(s2);
      if (v.tag === "Just") {
        if (n2 === 0) {
          codePointAtFallback$c = false;
          codePointAtFallback$r = $Maybe("Just", v._1.head);
          continue;
        }
        codePointAtFallback$a0 = n2 - 1 | 0;
        codePointAtFallback$a1 = v._1.tail;
        continue;
      }
      codePointAtFallback$c = false;
      codePointAtFallback$r = Nothing;
    }
    return codePointAtFallback$r;
  };
  var codePointAt = (v) => (v1) => {
    if (v < 0) {
      return Nothing;
    }
    if (v === 0) {
      if (v1 === "") {
        return Nothing;
      }
      return $Maybe("Just", unsafeCodePointAt0(v1));
    }
    return _codePointAt(codePointAtFallback)(Just)(Nothing)(unsafeCodePointAt0)(v)(v1);
  };

  // output-es/Effect.Aff.Compat/index.js
  var fromEffectFnAff = (v) => makeAff((k) => () => {
    const v1 = v((x2) => k($Either("Left", x2))(), (x2) => k($Either("Right", x2))());
    return (e2) => makeAff((k2) => () => {
      v1(e2, (x2) => k2($Either("Left", x2))(), (x2) => k2($Either("Right", x2))());
      return nonCanceler;
    });
  });

  // output-es/Halogen.HTML.Properties/index.js
  var readOnly = /* @__PURE__ */ Property("readOnly");
  var rows = /* @__PURE__ */ Property("rows");
  var id = /* @__PURE__ */ Property("id");
  var href = /* @__PURE__ */ Property("href");
  var draggable = /* @__PURE__ */ Property("draggable");
  var cols = /* @__PURE__ */ Property("cols");
  var classes = /* @__PURE__ */ (() => {
    const $0 = Property("className");
    const $1 = joinWith(" ");
    const $2 = arrayMap(unsafeCoerce);
    return (x2) => $0($1($2(x2)));
  })();
  var class_ = /* @__PURE__ */ Property("className");
  var style = /* @__PURE__ */ Attribute(Nothing)("style");

  // output-es/Game.Message/foreign.js
  var addOnClickEventListenerUnsafe = (id4) => (value2) => (onError, onSuccess) => {
    button = document.getElementById(id4);
    if (button == null) {
      onError("can't find element with id " + id4);
    } else {
      button.addEventListener("click", () => {
        onSuccess(value2);
      });
    }
    return function(cancelError, onCancelerError, onCancelerSuccess) {
      cancel();
      onCancelerSuccess();
    };
  };

  // output-es/Game.Message/index.js
  var intercalate2 = (sep) => (xs) => foldlArray((v) => (v1) => {
    if (v.init) {
      return { init: false, acc: v1 };
    }
    return { init: false, acc: v.acc + sep + v1 };
  })({ init: true, acc: "" })(xs).acc;
  var sum = /* @__PURE__ */ foldlArray(intAdd)(0);
  var bindReaderT2 = /* @__PURE__ */ bindReaderT(bindAff);
  var liftEffect = /* @__PURE__ */ (() => monadEffectReader(monadEffectAff).liftEffect)();
  var liftAff = /* @__PURE__ */ (() => monadAffReader(monadAffAff).liftAff)();
  var functorMessage = { map: (f2) => (v) => ({ ...v, action: _map(f2)(v.action) }) };
  var applyMessage = {
    apply: (v) => (v1) => ({
      user: (() => {
        if (v.user.tag === "Nothing") {
          return v1.user;
        }
        if (v.user.tag === "Just") {
          return $Maybe("Just", v.user._1);
        }
        fail();
      })(),
      html: [...v.html, ...v1.html],
      action: applyAff.apply(v.action)(v1.action)
    }),
    Functor0: () => functorMessage
  };
  var altMessage = {
    alt: (v) => (v1) => ({
      user: (() => {
        if (v.user.tag === "Nothing") {
          return v1.user;
        }
        if (v.user.tag === "Just") {
          return $Maybe("Just", v.user._1);
        }
        fail();
      })(),
      html: [...v.html, ...v1.html],
      action: _sequential(_parAffAlt(v.action)(v1.action))
    }),
    Functor0: () => functorMessage
  };
  var showPlainHTML = /* @__PURE__ */ (() => {
    const showVDom = (v) => {
      if (v.tag === "Text") {
        return v._1;
      }
      if (v.tag === "Elem") {
        return intercalate2(" ")(arrayMap(showVDom)(v._4));
      }
      if (v.tag === "Keyed") {
        return intercalate2(" ")(arrayMap((x2) => showVDom(x2._2))(v._4));
      }
      if (v.tag === "Widget") {
        const spin = (spin$a0$copy) => {
          let spin$a0 = spin$a0$copy, spin$c = true, spin$r;
          while (spin$c) {
            const v$1 = spin$a0;
            spin$a0 = v$1;
          }
          return spin$r;
        };
        return spin(v._1);
      }
      if (v.tag === "Grafted") {
        return showVDom(runGraft(v._1));
      }
      fail();
    };
    return (x2) => showVDom(x2);
  })();
  var timeToRead = (v) => 1500 + toNumber(sum(arrayMap((x2) => toCodePointArray(showPlainHTML(x2)).length)(v.html))) * 65;
  var sendMessage = (v) => bindReaderT2.bind(_pure)((listener) => bindReaderT2.bind(liftEffect(listener({ user: v.user, html: v.html })))(() => liftAff(v.action)));
  var sendMessageWithDelay = (message2) => {
    const $0 = sendMessage(message2);
    const $1 = liftAff(_delay(Right, timeToRead(message2)));
    const $2 = _map($$const);
    return (r2) => applyAff.apply($2($0(r2)))($1(r2));
  };
  var button2 = (id4) => (text) => (value2) => ({
    user: Nothing,
    html: [$VDom("Elem", Nothing, "button", [id(id4)], [$VDom("Text", text)])],
    action: fromEffectFnAff(addOnClickEventListenerUnsafe(id4)(value2))
  });

  // output-es/Control.Monad.Reader.Class/index.js
  var monadAskFun = { ask: (x2) => x2, Monad0: () => monadFn };
  var monadReaderFun = { local: (f2) => (g2) => (x2) => g2(f2(x2)), MonadAsk0: () => monadAskFun };

  // output-es/Data.Lens.AffineTraversal/index.js
  var fanout2 = /* @__PURE__ */ fanout(categoryFn)(strongFn);
  var affineTraversal = ($$set) => (pre) => (dictStrong) => (dictChoice) => {
    const $0 = fanout2($$set)(pre);
    return (pab) => dictChoice.Profunctor0().dimap($0)((v) => {
      if (v._2.tag === "Left") {
        return v._2._1;
      }
      if (v._2.tag === "Right") {
        return v._1(v._2._1);
      }
      fail();
    })(dictStrong.second(dictChoice.right(pab)));
  };

  // output-es/Data.Lens.Prism.Maybe/index.js
  var _Just = (dictChoice) => prism(Just)((v2) => {
    if (v2.tag === "Nothing") {
      return $Either("Left", Nothing);
    }
    if (v2.tag === "Just") {
      return $Either("Right", v2._1);
    }
    fail();
  })(dictChoice);

  // output-es/Data.Lens.Index/index.js
  var indexMap = (dictOrd) => ({
    ix: (k) => (dictStrong) => (dictChoice) => affineTraversal((s2) => (b) => update(dictOrd)((v) => $Maybe("Just", b))(k)(s2))((s2) => {
      const $0 = lookup(dictOrd)(k)(s2);
      if ($0.tag === "Nothing") {
        return $Either("Left", s2);
      }
      if ($0.tag === "Just") {
        return $Either("Right", $0._1);
      }
      fail();
    })(dictStrong)(dictChoice)
  });

  // output-es/Data.Lens.At/index.js
  var atMap = (dictOrd) => {
    const indexMap2 = indexMap(dictOrd);
    return {
      at: (k) => (dictStrong) => {
        const $0 = lookup(dictOrd)(k);
        return (pab) => dictStrong.Profunctor0().dimap((s2) => $Tuple(
          $0(s2),
          (b) => {
            if (b.tag === "Nothing") {
              return $$delete(dictOrd)(k)(s2);
            }
            if (b.tag === "Just") {
              return insert(dictOrd)(k)(b._1)(s2);
            }
            fail();
          }
        ))((v) => v._2(v._1))(dictStrong.first(pab));
      },
      Index0: () => indexMap2
    };
  };

  // output-es/Game.Location/index.js
  var showLocation = { show: (v) => "(" + showIntImpl(v.x) + "," + showIntImpl(v.y) + ")" };
  var eqLocation = { eq: (x2) => (y2) => x2.x === y2.x && x2.y === y2.y };
  var ordLocation = {
    compare: (x2) => (y2) => {
      const v = ordInt.compare(x2.x)(y2.x);
      if (v === "LT") {
        return LT;
      }
      if (v === "GT") {
        return GT;
      }
      return ordInt.compare(x2.y)(y2.y);
    },
    Eq0: () => eqLocation
  };
  var directionTo = (l1) => (l2) => find2((d3) => {
    if (d3 === "Up") {
      return l1.x === l2.x && (l1.y - 1 | 0) === l2.y;
    }
    if (d3 === "Right") {
      return (l1.x + 1 | 0) === l2.x && l1.y === l2.y;
    }
    if (d3 === "Down") {
      return l1.x === l2.x && (l1.y + 1 | 0) === l2.y;
    }
    if (d3 === "Left") {
      return (l1.x - 1 | 0) === l2.x && l1.y === l2.y;
    }
    fail();
  })(allDirections);

  // output-es/Game.Edge/index.js
  var eqEdge = {
    eq: (x2) => (y2) => (() => {
      if (x2.dir === "Up") {
        return y2.dir === "Up";
      }
      if (x2.dir === "Right") {
        return y2.dir === "Right";
      }
      if (x2.dir === "Down") {
        return y2.dir === "Down";
      }
      return x2.dir === "Left" && y2.dir === "Left";
    })() && x2.loc.x === y2.loc.x && x2.loc.y === y2.loc.y
  };
  var ordEdge = {
    compare: (v) => (v1) => {
      const $0 = ordLocation.compare(v.loc)(v1.loc);
      const $1 = ordCardinalDirection.compare(v.dir)(v1.dir);
      if ($0 === "LT") {
        return LT;
      }
      if ($0 === "GT") {
        return GT;
      }
      if ($0 === "EQ") {
        return $1;
      }
      fail();
    },
    Eq0: () => eqEdge
  };
  var matchEdge = (v) => ({
    loc: (() => {
      if (v.dir === "Up") {
        return { x: v.loc.x, y: v.loc.y - 1 | 0 };
      }
      if (v.dir === "Right") {
        return { x: v.loc.x + 1 | 0, y: v.loc.y };
      }
      if (v.dir === "Down") {
        return { x: v.loc.x, y: v.loc.y + 1 | 0 };
      }
      if (v.dir === "Left") {
        return { x: v.loc.x - 1 | 0, y: v.loc.y };
      }
      fail();
    })(),
    dir: (() => {
      if (v.dir === "Up") {
        return Down;
      }
      if (v.dir === "Right") {
        return Left2;
      }
      if (v.dir === "Down") {
        return Up;
      }
      if (v.dir === "Left") {
        return Right2;
      }
      fail();
    })()
  });

  // output-es/Game.Board.RelativeEdge/index.js
  var showRelativeEdge = {
    show: (v) => "(RelEdge " + showLocation.show(v.loc) + " " + (() => {
      if (v.dir === "Up") {
        return "Up";
      }
      if (v.dir === "Right") {
        return "Right";
      }
      if (v.dir === "Down") {
        return "Down";
      }
      if (v.dir === "Left") {
        return "Left";
      }
      fail();
    })() + ")"
  };
  var eqRelativeEdge = {
    eq: (x2) => (y2) => (() => {
      if (x2.dir === "Up") {
        return y2.dir === "Up";
      }
      if (x2.dir === "Right") {
        return y2.dir === "Right";
      }
      if (x2.dir === "Down") {
        return y2.dir === "Down";
      }
      return x2.dir === "Left" && y2.dir === "Left";
    })() && x2.loc.x === y2.loc.x && x2.loc.y === y2.loc.y
  };
  var ordRelativeEdge = { compare: (x2) => (y2) => ordEdge.compare(x2)(y2), Eq0: () => eqRelativeEdge };
  var relativeEdgeDirection = (v) => v.dir;

  // output-es/Game.Board.BoardConnections/index.js
  var submap2 = /* @__PURE__ */ submap(ordRelativeEdge);
  var eq = (xs) => (ys) => {
    const go = (v) => (v1) => (v2) => {
      if (!v2) {
        return false;
      }
      if (v.tag === "Nil") {
        return v1.tag === "Nil" && v2;
      }
      return v.tag === "Cons" && v1.tag === "Cons" && go(v._2)(v1._2)(v2 && (() => {
        if (v1._1.dir === "Up") {
          return v._1.dir === "Up";
        }
        if (v1._1.dir === "Right") {
          return v._1.dir === "Right";
        }
        if (v1._1.dir === "Down") {
          return v._1.dir === "Down";
        }
        return v1._1.dir === "Left" && v._1.dir === "Left";
      })() && v1._1.loc.x === v._1.loc.x && v1._1.loc.y === v._1.loc.y);
    };
    return go(xs)(ys)(true);
  };
  var getParentRelEdges = (connections) => (loc) => values(submap2($Maybe("Just", { loc, dir: Up }))($Maybe(
    "Just",
    { loc, dir: Left2 }
  ))(connections));
  var topologicalSortLocations = (v) => (v1) => {
    if (v.tag === "Nil") {
      return $Maybe("Just", Nil);
    }
    const $0 = find(foldableList)((loc) => eq(getParentRelEdges(v1)(loc))(Nil))(v);
    if ($0.tag === "Just") {
      const $1 = $0._1;
      const $2 = Cons($1);
      const $3 = topologicalSortLocations(deleteBy(eqLocation.eq)($1)(v))(filterWithKey(ordRelativeEdge)((v$1) => (v2) => !(v2.loc.x === $1.x && v2.loc.y === $1.y))(v1));
      if ($3.tag === "Just") {
        return $Maybe("Just", $2($3._1));
      }
      return Nothing;
    }
    if ($0.tag === "Nothing") {
      return Nothing;
    }
    fail();
  };

  // output-es/Game.Board.PseudoPiece/index.js
  var psuedoPiece = (port2) => ({
    name: (() => {
      const v = portType(port2);
      if (v === "Input") {
        return "psuedo-input";
      }
      if (v === "Output") {
        return "psuedo-output";
      }
      fail();
    })(),
    eval: (v) => Leaf2,
    complexity: { space: 0, time: 0 },
    shouldRipple: false,
    updateCapacity: (v) => (v1) => Nothing,
    ports: $$$Map("Node", 1, 1, Right2, matchingPort(port2), Leaf2, Leaf2),
    updatePort: (v) => (v1) => Nothing,
    isSimplifiable: Nothing
  });
  var getPsuedoPiecePort = (v) => {
    if (elem(eqPieceId)(v.name)(["psuedo-input", "psuedo-output"])) {
      return lookup(ordCardinalDirection)(Right2)(v.ports);
    }
    return Nothing;
  };

  // output-es/Data.Profunctor.Choice/index.js
  var choiceFn = /* @__PURE__ */ (() => ({
    left: (v) => (v1) => {
      if (v1.tag === "Left") {
        return $Either("Left", v(v1._1));
      }
      if (v1.tag === "Right") {
        return $Either("Right", v1._1);
      }
      fail();
    },
    right: functorEither.map,
    Profunctor0: () => profunctorFn
  }))();

  // output-es/Data.Compactable/index.js
  var compactableArray = {
    compact: (xs) => {
      const result = [];
      const $0 = { value: 0 };
      iterate($Iterator(
        (v) => {
          if (v >= 0 && v < xs.length) {
            return $Maybe("Just", xs[v]);
          }
          return Nothing;
        },
        $0
      ))((x2) => {
        const $1 = (() => {
          if (x2.tag === "Nothing") {
            return () => 0;
          }
          if (x2.tag === "Just") {
            const $12 = x2._1;
            return () => result.push($12);
          }
          fail();
        })();
        return () => {
          $1();
        };
      })();
      return result;
    },
    separate: (xs) => {
      const ls = [];
      const rs = [];
      const $0 = { value: 0 };
      iterate($Iterator(
        (v) => {
          if (v >= 0 && v < xs.length) {
            return $Maybe("Just", xs[v]);
          }
          return Nothing;
        },
        $0
      ))((x2) => {
        const $1 = (() => {
          if (x2.tag === "Left") {
            const $12 = x2._1;
            return () => ls.push($12);
          }
          if (x2.tag === "Right") {
            const $12 = x2._1;
            return () => rs.push($12);
          }
          fail();
        })();
        return () => {
          $1();
        };
      })();
      return { left: ls, right: rs };
    }
  };

  // output-es/Data.Filterable/index.js
  var filterableArray = {
    partitionMap: (p2) => foldlArray((acc) => (x2) => {
      const v = p2(x2);
      if (v.tag === "Left") {
        return { ...acc, left: [...acc.left, v._1] };
      }
      if (v.tag === "Right") {
        return { ...acc, right: [...acc.right, v._1] };
      }
      fail();
    })({ left: [], right: [] }),
    partition,
    filterMap: mapMaybe,
    filter,
    Compactable0: () => compactableArray,
    Functor1: () => functorArray
  };

  // output-es/Data.Witherable/index.js
  var witherableArray = {
    wilt: (dictApplicative) => {
      const separate = witherableArray.Filterable0().Compactable0().separate;
      const traverse1 = witherableArray.Traversable1().traverse(dictApplicative);
      return (p2) => {
        const $0 = dictApplicative.Apply0().Functor0().map(separate);
        const $1 = traverse1(p2);
        return (x2) => $0($1(x2));
      };
    },
    wither: (dictApplicative) => {
      const compact = witherableArray.Filterable0().Compactable0().compact;
      const traverse1 = witherableArray.Traversable1().traverse(dictApplicative);
      return (p2) => {
        const $0 = dictApplicative.Apply0().Functor0().map(compact);
        const $1 = traverse1(p2);
        return (x2) => $0($1(x2));
      };
    },
    Filterable0: () => filterableArray,
    Traversable1: () => traversableArray
  };

  // output-es/Data.Map.Unsafe/index.js
  var unsafeMapKey = (f2) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf2;
      }
      if (v.tag === "Node") {
        return $$$Map("Node", v._1, v._2, f2(v._3), v._4, go(v._5), go(v._6));
      }
      fail();
    };
    return go;
  };

  // output-es/Game.Board.Types/index.js
  var $BoardError = (tag, _1) => ({ tag, _1 });
  var submap3 = /* @__PURE__ */ submap(ordRelativeEdge);
  var fromFoldable8 = /* @__PURE__ */ foldrArray(Cons)(Nil);
  var surround2 = /* @__PURE__ */ surround(foldableList)(semigroupString);
  var foldMap2 = /* @__PURE__ */ (() => foldableList.foldMap(monoidString))();
  var member = (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = false;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = ordLocation.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = true;
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var Cyclic = /* @__PURE__ */ $BoardError("Cyclic");
  var showBoardError = {
    show: (v) => {
      if (v.tag === "LocationOccupied") {
        return "Location Occupied: " + showLocation.show(v._1);
      }
      if (v.tag === "LocationNotOccupied") {
        return "Location Not Occupied: " + showLocation.show(v._1);
      }
      if (v.tag === "InvalidLocation") {
        return "Location " + showLocation.show(v._1) + " is outside range of the board";
      }
      if (v.tag === "InvalidBoardInitialisation") {
        return "Invalid Board Initialisation: " + showIntImpl(v._1) + " is not a valid board size";
      }
      if (v.tag === "BadBoardSize") {
        return "Boards of size " + showIntImpl(v._1) + " are not valid";
      }
      if (v.tag === "Cyclic") {
        return "ABED does not admit cyclic boards";
      }
      fail();
    }
  };
  var toLocalInputs = (loc) => {
    const $0 = submap3($Maybe("Just", { loc, dir: Up }))($Maybe("Just", { loc, dir: Left2 }));
    const $1 = unsafeMapKey(relativeEdgeDirection);
    return (x2) => $1($0(x2));
  };
  var standardBoard = { size: 3, pieces: Leaf2 };
  var printBoard = (v) => {
    const interleave = (v12) => (v2) => {
      if (v12.tag === "Cons") {
        if (v2.tag === "Cons") {
          return $List("Cons", v12._1, $List("Cons", v2._1, interleave(v12._2)(v2._2)));
        }
        if (v2.tag === "Nil") {
          return v12;
        }
        fail();
      }
      if (v12.tag === "Nil") {
        return v2;
      }
      if (v2.tag === "Nil") {
        return v12;
      }
      fail();
    };
    const getPortCapacity = (v12) => {
      const $0 = lookup(ordLocation)(v12.loc)(v.pieces);
      if ($0.tag === "Just") {
        const $1 = lookup(ordCardinalDirection)(rotateDirection(v12.dir)(intMod(-$0._1.rotation)(4)))($0._1.piece.ports);
        if ($1.tag === "Just") {
          return $Maybe("Just", portCapacity($1._1));
        }
        if ($1.tag === "Nothing") {
          return Nothing;
        }
        fail();
      }
      if ($0.tag === "Nothing") {
        return Nothing;
      }
      fail();
    };
    const v1 = unsnoc(interleave(listMap((y2) => surround2("+")(listMap((x2) => {
      const upperPortCapacity = getPortCapacity({ loc: { x: x2, y: y2 }, dir: Up });
      const lowerPortCapacity = getPortCapacity({ loc: { x: x2, y: y2 - 1 | 0 }, dir: Down });
      if (upperPortCapacity.tag === "Just" && lowerPortCapacity.tag === "Just") {
        if ((() => {
          if (upperPortCapacity._1 === "OneBit") {
            return lowerPortCapacity._1 === "OneBit";
          }
          if (upperPortCapacity._1 === "TwoBit") {
            return lowerPortCapacity._1 === "TwoBit";
          }
          if (upperPortCapacity._1 === "FourBit") {
            return lowerPortCapacity._1 === "FourBit";
          }
          return upperPortCapacity._1 === "EightBit" && lowerPortCapacity._1 === "EightBit";
        })()) {
          return "\u2501\u2501 " + showIntImpl((() => {
            if (upperPortCapacity._1 === "OneBit") {
              return 1;
            }
            if (upperPortCapacity._1 === "TwoBit") {
              return 2;
            }
            if (upperPortCapacity._1 === "FourBit") {
              return 4;
            }
            if (upperPortCapacity._1 === "EightBit") {
              return 8;
            }
            fail();
          })()) + " \u2501\u2501";
        }
        return "\u2501\u2501\u2501\u2501\u2501\u2501\u2501";
      }
      if (upperPortCapacity.tag === "Nothing") {
        if (lowerPortCapacity.tag === "Just") {
          return "\u2501\u2501 " + showIntImpl((() => {
            if (lowerPortCapacity._1 === "OneBit") {
              return 1;
            }
            if (lowerPortCapacity._1 === "TwoBit") {
              return 2;
            }
            if (lowerPortCapacity._1 === "FourBit") {
              return 4;
            }
            if (lowerPortCapacity._1 === "EightBit") {
              return 8;
            }
            fail();
          })()) + " \u2501\u2501";
        }
        if (lowerPortCapacity.tag === "Nothing") {
          return "\u2501\u2501\u2501\u2501\u2501\u2501\u2501";
        }
        fail();
      }
      if (upperPortCapacity.tag === "Just") {
        return "\u2501\u2501 " + showIntImpl((() => {
          if (upperPortCapacity._1 === "OneBit") {
            return 1;
          }
          if (upperPortCapacity._1 === "TwoBit") {
            return 2;
          }
          if (upperPortCapacity._1 === "FourBit") {
            return 4;
          }
          if (upperPortCapacity._1 === "EightBit") {
            return 8;
          }
          fail();
        })()) + " \u2501\u2501";
      }
      if (upperPortCapacity.tag === "Nothing") {
        return "\u2501\u2501\u2501\u2501\u2501\u2501\u2501";
      }
      fail();
    })(range(0)(v.size - 1 | 0))))(range(0)(v.size)))(listMap((x2) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, v$1 = go$a1;
          if (v$1.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v$1.tag === "Cons") {
            go$a0 = b.init ? { init: false, acc: v$1._1 } : { init: false, acc: b.acc + "\n" + v$1._1 };
            go$a1 = v$1._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return go({ init: true, acc: "" })(foldableList.foldr(zipWith(concatString))(replicate(unfoldableList)(3)(""))(interleave(listMap((x$1) => {
        const rightPortCapacity = getPortCapacity({ loc: { x: x$1 - 1 | 0, y: x2 }, dir: Right2 });
        const leftPortCapacity = getPortCapacity({ loc: { x: x$1, y: x2 }, dir: Left2 });
        if (leftPortCapacity.tag === "Just" && rightPortCapacity.tag === "Just") {
          if ((() => {
            if (leftPortCapacity._1 === "OneBit") {
              return rightPortCapacity._1 === "OneBit";
            }
            if (leftPortCapacity._1 === "TwoBit") {
              return rightPortCapacity._1 === "TwoBit";
            }
            if (leftPortCapacity._1 === "FourBit") {
              return rightPortCapacity._1 === "FourBit";
            }
            return leftPortCapacity._1 === "EightBit" && rightPortCapacity._1 === "EightBit";
          })()) {
            return $List(
              "Cons",
              "\u2579",
              $List(
                "Cons",
                showIntImpl((() => {
                  if (leftPortCapacity._1 === "OneBit") {
                    return 1;
                  }
                  if (leftPortCapacity._1 === "TwoBit") {
                    return 2;
                  }
                  if (leftPortCapacity._1 === "FourBit") {
                    return 4;
                  }
                  if (leftPortCapacity._1 === "EightBit") {
                    return 8;
                  }
                  fail();
                })()),
                $List("Cons", "\u257B", Nil)
              )
            );
          }
          return replicate(unfoldableList)(3)("\u2503");
        }
        if (leftPortCapacity.tag === "Nothing") {
          if (rightPortCapacity.tag === "Just") {
            return $List(
              "Cons",
              "\u2579",
              $List(
                "Cons",
                showIntImpl((() => {
                  if (rightPortCapacity._1 === "OneBit") {
                    return 1;
                  }
                  if (rightPortCapacity._1 === "TwoBit") {
                    return 2;
                  }
                  if (rightPortCapacity._1 === "FourBit") {
                    return 4;
                  }
                  if (rightPortCapacity._1 === "EightBit") {
                    return 8;
                  }
                  fail();
                })()),
                $List("Cons", "\u257B", Nil)
              )
            );
          }
          if (rightPortCapacity.tag === "Nothing") {
            return replicate(unfoldableList)(3)("\u2503");
          }
          fail();
        }
        if (leftPortCapacity.tag === "Just") {
          return $List(
            "Cons",
            "\u2579",
            $List(
              "Cons",
              showIntImpl((() => {
                if (leftPortCapacity._1 === "OneBit") {
                  return 1;
                }
                if (leftPortCapacity._1 === "TwoBit") {
                  return 2;
                }
                if (leftPortCapacity._1 === "FourBit") {
                  return 4;
                }
                if (leftPortCapacity._1 === "EightBit") {
                  return 8;
                }
                fail();
              })()),
              $List("Cons", "\u257B", Nil)
            )
          );
        }
        if (leftPortCapacity.tag === "Nothing") {
          return replicate(unfoldableList)(3)("\u2503");
        }
        fail();
      })(range(0)(v.size)))(listMap((x$1) => {
        const loc = { x: x$1, y: x2 };
        const v12 = lookup(ordLocation)(loc)(v.pieces);
        if (v12.tag === "Just") {
          const $0 = v12._1.rotation;
          const $1 = v12._1.piece.ports;
          const port2 = (dir2) => {
            const $2 = lookup(ordCardinalDirection)(rotateDirection(dir2)(intMod(-$0)(4)))($1);
            if ($2.tag === "Nothing") {
              return " ";
            }
            if ($2.tag === "Just") {
              if (isInput($2._1)) {
                if (dir2 === "Up") {
                  return "\u2228";
                }
                if (dir2 === "Right") {
                  return "<";
                }
                if (dir2 === "Down") {
                  return "\u2227";
                }
                if (dir2 === "Left") {
                  return ">";
                }
                fail();
              }
              if (dir2 === "Up") {
                return "\u2227";
              }
              if (dir2 === "Right") {
                return ">";
              }
              if (dir2 === "Down") {
                return "\u2228";
              }
              if (dir2 === "Left") {
                return "<";
              }
            }
            fail();
          };
          return fromFoldable8([
            "   " + port2(Up) + "   ",
            (() => {
              const $2 = lookup(ordLocation)(loc)(v.pieces);
              return port2(Left2) + " " + ($2.tag === "Just" ? take2(3)($2._1.piece.name) + " " + port2(Right2) : showIntImpl(loc.x) + "," + showIntImpl(loc.y) + " " + port2(Right2));
            })(),
            "   " + port2(Down) + "   "
          ]);
        }
        if (v12.tag === "Nothing") {
          return fromFoldable8(["       ", "  " + showIntImpl(loc.x) + "," + showIntImpl(loc.y) + "  ", "       "]);
        }
        fail();
      })(range(0)(v.size - 1 | 0))))).acc;
    })(range(0)(v.size - 1 | 0))));
    if (v1.tag === "Just") {
      return foldMap2((v2) => v2 + "\n")(v1._1.init) + v1._1.last;
    }
    if (v1.tag === "Nothing") {
      return _crashWith("this should never happen");
    }
    fail();
  };
  var _size = (dictStrong) => {
    const $0 = _Newtype()()(dictStrong.Profunctor0());
    return (x2) => $0(prop({ reflectSymbol: () => "size" })()()($$Proxy)(dictStrong)(x2));
  };
  var _size1 = /* @__PURE__ */ _size(strongForget);
  var _pieces = (dictStrong) => {
    const $0 = _Newtype()()(dictStrong.Profunctor0());
    return (x2) => $0(prop({ reflectSymbol: () => "pieces" })()()($$Proxy)(dictStrong)(x2));
  };
  var allOccupiedLocations = /* @__PURE__ */ _pieces(strongForget)((x2) => keys3(x2));
  var firstEmptyLocation = (board2) => {
    const n2 = _size1(identity14)(board2);
    const occupied = allOccupiedLocations(board2);
    return find2((loc) => !member(loc)(occupied))(arrayBind(rangeImpl(0, n2 - 1 | 0))((j) => arrayBind(rangeImpl(
      0,
      n2 - 1 | 0
    ))((i2) => [{ x: i2, y: j }])));
  };

  // output-es/Game.Piece.Rotation/index.js
  var semigroupRotation = { append: (v) => (v1) => intMod(v + v1 | 0)(4) };
  var monoidRotation = { mempty: /* @__PURE__ */ intMod(0)(4), Semigroup0: () => semigroupRotation };

  // output-es/Game.Board.Query/index.js
  var _pieces2 = /* @__PURE__ */ _pieces(strongForget);
  var ix = /* @__PURE__ */ (() => indexMap(ordLocation).ix)();
  var choiceForget2 = /* @__PURE__ */ choiceForget(monoidRotation);
  var _size2 = /* @__PURE__ */ _size(strongForget);
  var at = /* @__PURE__ */ (() => atMap(ordLocation).at)();
  var _pieces1 = /* @__PURE__ */ _pieces(strongFn);
  var member2 = (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = false;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = ordLocation.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = true;
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var fromFoldable9 = /* @__PURE__ */ foldrArray(Cons)(Nil);
  var applicativeWriterT2 = /* @__PURE__ */ applicativeWriterT(monoidList);
  var monadStateWriterT2 = /* @__PURE__ */ monadStateWriterT(monoidList);
  var monadTellWriterT2 = /* @__PURE__ */ monadTellWriterT(monoidList);
  var fromFoldable12 = /* @__PURE__ */ fromFoldable(ordRelativeEdge)(foldableList);
  var fromFoldable23 = /* @__PURE__ */ (() => foldableSet.foldr(Cons)(Nil))();
  var catMaybes2 = /* @__PURE__ */ mapMaybeWithKey(ordCardinalDirection)((v) => identity8);
  var fromFoldable32 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var toRelativeEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (v) => {
      const $0 = v.dir;
      const $1 = v.loc;
      return Monad0.Bind1().bind((() => {
        const $2 = _pieces2(ix($1)(strongForget)(choiceForget2)(prop({ reflectSymbol: () => "rotation" })()()($$Proxy)(strongForget)(identity14)));
        return dictMonadState.state((s2) => $Tuple($2(s2), s2));
      })())((rot) => Monad0.Applicative0().pure({ loc: $1, dir: rotateDirection($0)(intMod(-rot)(4)) }));
    };
  };
  var toAbsoluteEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (v) => {
      const $0 = v.dir;
      const $1 = v.loc;
      return Monad0.Bind1().bind((() => {
        const $2 = _pieces2(ix($1)(strongForget)(choiceForget2)(prop({ reflectSymbol: () => "rotation" })()()($$Proxy)(strongForget)(identity14)));
        return dictMonadState.state((s2) => $Tuple($2(s2), s2));
      })())((rot) => Monad0.Applicative0().pure({ loc: $1, dir: rotateDirection($0)(rot) }));
    };
  };
  var isInsideBoard = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (v) => {
      const $0 = v.x;
      const $1 = v.y;
      return Monad0.Bind1().bind(dictMonadState.state((s2) => $Tuple(_size2(identity14)(s2), s2)))((n2) => Monad0.Applicative0().pure(0 <= $0 && $0 < n2 && 0 <= $1 && $1 < n2));
    };
  };
  var getPortOnEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (v) => {
      const $0 = v.dir;
      return Monad0.Bind1().bind((() => {
        const $1 = at(v.loc)(strongForget);
        return dictMonadState.state((s2) => $Tuple(_pieces2($1(identity14))(s2), s2));
      })())((maybePieceInfo) => Monad0.Applicative0().pure((() => {
        if (maybePieceInfo.tag === "Just") {
          return lookup(ordCardinalDirection)($0)(maybePieceInfo._1.piece.ports);
        }
        if (maybePieceInfo.tag === "Nothing") {
          return Nothing;
        }
        fail();
      })()));
    };
  };
  var getBoardEdgePseudoLocation = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (dir2) => Monad0.Bind1().bind(dictMonadState.state((s2) => $Tuple(_size2(identity14)(s2), s2)))((n2) => Monad0.Applicative0().pure((() => {
      if (dir2 === "Up") {
        return { x: intDiv(n2, 2), y: -1 };
      }
      if (dir2 === "Right") {
        return { x: n2, y: intDiv(n2, 2) };
      }
      if (dir2 === "Down") {
        return { x: intDiv(n2, 2), y: n2 };
      }
      if (dir2 === "Left") {
        return { x: -1, y: intDiv(n2, 2) };
      }
      fail();
    })()));
  };
  var getBoardPortEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const getBoardEdgePseudoLocation1 = getBoardEdgePseudoLocation(dictMonadState);
    return (dir2) => Monad0.Bind1().bind(getBoardEdgePseudoLocation1(dir2))((loc) => Monad0.Applicative0().pure({ loc, dir: Right2 }));
  };
  var adjacentRelativeEdge = (dictMonadState) => {
    const toAbsoluteEdge1 = toAbsoluteEdge(dictMonadState);
    const toRelativeEdge1 = toRelativeEdge(dictMonadState);
    return (relEdge) => dictMonadState.Monad0().Bind1().bind(toAbsoluteEdge1(relEdge))((absEdge) => toRelativeEdge1(matchEdge(absEdge)));
  };
  var connectedRelativeEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const $0 = Monad0.Bind1();
    const getPortOnEdge1 = getPortOnEdge(dictMonadState);
    const adjacentRelativeEdge1 = adjacentRelativeEdge(dictMonadState);
    const $1 = Monad0.Applicative0();
    return (relEdge) => $0.bind(getPortOnEdge1(relEdge))((port2) => $0.bind(adjacentRelativeEdge1(relEdge))((adjRelEdge) => $0.bind(getPortOnEdge1(adjRelEdge))((adjPort) => {
      if ((() => {
        const $2 = applyMaybe.apply(port2.tag === "Just" ? $Maybe("Just", portMatches(port2._1)) : Nothing)(adjPort);
        if ($2.tag === "Nothing") {
          return false;
        }
        return $2.tag === "Just" && $2._1;
      })()) {
        return $1.pure($Maybe("Just", adjRelEdge));
      }
      return $1.pure(Nothing);
    })));
  };
  var allConnectedRelativeEdges = (dictMonadState) => {
    const wither1 = witherableArray.wither(dictMonadState.Monad0().Applicative0());
    const connectedRelativeEdge1 = connectedRelativeEdge(dictMonadState);
    return (loc) => wither1(connectedRelativeEdge1)(arrayMap((dir2) => ({ loc, dir: dir2 }))(allDirections));
  };
  var capacityRippleAcc = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Bind1 = Monad0.Bind1();
    const allConnectedRelativeEdges1 = allConnectedRelativeEdges(dictMonadState);
    const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
    });
    return (capacity) => (vars) => {
      if (vars.openSet.tag === "Nil") {
        return Monad0.Applicative0().pure();
      }
      if (vars.openSet.tag === "Cons") {
        const $0 = vars.openSet._2;
        const $1 = vars.openSet._1;
        const loc = $1.loc;
        const closedSet = insert(ordLocation)(loc)()(vars.closedSet);
        return Bind1.bind(Bind1.Apply0().Functor0().map((v1) => {
          if (v1.tag === "Just") {
            return $Maybe("Just", v1._1.piece);
          }
          return Nothing;
        })((() => {
          const $2 = at(loc)(strongForget);
          return dictMonadState.state((s2) => $Tuple(_pieces2($2(identity14))(s2), s2));
        })()))((maybePiece) => {
          const v = (() => {
            if (maybePiece.tag === "Just") {
              return maybePiece._1.updateCapacity($1.dir)(capacity);
            }
            if (maybePiece.tag === "Nothing") {
              return Nothing;
            }
            fail();
          })();
          if (v.tag === "Just") {
            const $2 = v._1;
            return Bind1.bind(allConnectedRelativeEdges1(loc))((connected) => Bind1.bind($$void((() => {
              const $3 = _pieces1(ix(loc)(strongFn)(choiceFn)((v1) => ({ ...v1, piece: $2 })));
              return dictMonadState.state((s2) => {
                const s$p = $3(s2);
                return $Tuple(s$p, s$p);
              });
            })()))(() => {
              if ($2.shouldRipple) {
                return capacityRippleAcc(dictMonadState)(capacity)({
                  openSet: foldableList.foldr(Cons)($0)(fromFoldable9(filterImpl((r2) => !member2(r2.loc)(vars.closedSet), connected))),
                  closedSet
                });
              }
              return capacityRippleAcc(dictMonadState)(capacity)({ openSet: $0, closedSet });
            }));
          }
          if (v.tag === "Nothing") {
            return capacityRippleAcc(dictMonadState)(capacity)({ openSet: $0, closedSet });
          }
          fail();
        });
      }
      fail();
    };
  };
  var capacityRipple = (dictMonadState) => {
    const capacityRippleAcc1 = capacityRippleAcc(dictMonadState);
    return (relEdge) => (capacity) => capacityRippleAcc1(capacity)({ openSet: $List("Cons", relEdge, Nil), closedSet: Leaf2 });
  };
  var buildConnectionMapAt = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const applicativeWriterT1 = applicativeWriterT2(Monad0.Applicative0());
    const for_9 = for_(applicativeWriterT1)(foldableArray);
    const $0 = bindWriterT(semigroupList)(Monad0.Bind1());
    const monadStateWriterT1 = monadStateWriterT2(dictMonadState);
    const connectedRelativeEdge1 = connectedRelativeEdge(monadStateWriterT1);
    const traverse_18 = traverse_(applicativeWriterT1)(foldableMaybe);
    const getPortOnEdge1 = getPortOnEdge(monadStateWriterT1);
    const $1 = monadTellWriterT2(Monad0);
    return (loc) => for_9(allDirections)((dir2) => {
      const relEdge = { loc, dir: dir2 };
      return $0.bind(connectedRelativeEdge1(relEdge))(traverse_18((adjRelEdge) => $0.bind(getPortOnEdge1(relEdge))((port2) => {
        if (port2.tag === "Just") {
          if (portType(port2._1) === "Input") {
            return $1.tell($List("Cons", $Tuple(relEdge, adjRelEdge), Nil));
          }
          if (portType(port2._1) === "Output") {
            return $1.tell($List("Cons", $Tuple(adjRelEdge, relEdge), Nil));
          }
          fail();
        }
        return applicativeWriterT1.pure();
      })));
    });
  };
  var buildConnectionMap = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Bind1 = Monad0.Bind1();
    const Functor0 = Bind1.Apply0().Functor0();
    const traverse_18 = traverse_(applicativeWriterT2(Monad0.Applicative0()))(foldableList);
    const buildConnectionMapAt1 = buildConnectionMapAt(dictMonadState);
    return Bind1.bind(dictMonadState.state((s2) => $Tuple(_pieces2(identity14)(s2), s2)))((pieceInfos) => Functor0.map(fromFoldable12)(Functor0.map(snd)(traverse_18(buildConnectionMapAt1)(fromFoldable23(keys3(pieceInfos))))));
  };
  var getBoardPorts = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Bind1 = Monad0.Bind1();
    const Applicative0 = Monad0.Applicative0();
    const getBoardEdgePseudoLocation1 = getBoardEdgePseudoLocation(dictMonadState);
    const toRelativeEdge1 = toRelativeEdge(dictMonadState);
    const adjacentRelativeEdge1 = adjacentRelativeEdge(dictMonadState);
    const getPortOnEdge1 = getPortOnEdge(dictMonadState);
    return Bind1.Apply0().Functor0().map((x2) => catMaybes2(fromFoldable32(x2)))(traversableArray.traverse(Applicative0)((dir2) => Bind1.bind(getBoardEdgePseudoLocation1(dir2))((loc) => Bind1.bind(Bind1.bind(toRelativeEdge1({
      loc,
      dir: (() => {
        if (dir2 === "Up") {
          return Down;
        }
        if (dir2 === "Right") {
          return Left2;
        }
        if (dir2 === "Down") {
          return Up;
        }
        if (dir2 === "Left") {
          return Right2;
        }
        fail();
      })()
    }))(adjacentRelativeEdge1))((relEdge) => Bind1.bind(getPortOnEdge1(relEdge))((maybePort) => Applicative0.pure($Tuple(dir2, maybePort))))))(allDirections));
  };

  // output-es/Game.PortInfo/index.js
  var getClampedSignal = (v) => {
    const $0 = portCapacity(v.port);
    if ($0 === "OneBit") {
      return 1 & v.signal;
    }
    if ($0 === "TwoBit") {
      return 3 & v.signal;
    }
    if ($0 === "FourBit") {
      return 15 & v.signal;
    }
    if ($0 === "EightBit") {
      return 255 & v.signal;
    }
    fail();
  };

  // output-es/Game.Board.EvaluableBoard/index.js
  var at2 = /* @__PURE__ */ (() => atMap(ordRelativeEdge).at)();
  var catMaybes3 = /* @__PURE__ */ mapMaybeWithKey(ordCardinalDirection)((v) => identity8);
  var fromFoldable10 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableMap);
  var monadStateStateT2 = /* @__PURE__ */ monadStateStateT(monadIdentity);
  var _pieces3 = /* @__PURE__ */ _pieces(strongFn);
  var at1 = /* @__PURE__ */ (() => atMap(ordLocation).at)();
  var _pieces12 = /* @__PURE__ */ _pieces(strongForget);
  var fromFoldable13 = /* @__PURE__ */ (() => foldableSet.foldr(Cons)(Nil))();
  var getBoardPorts2 = /* @__PURE__ */ getBoardPorts(monadStateStateT2);
  var setOuterPort = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const $$void = Monad0.Bind1().Apply0().Functor0().map((v) => {
    });
    const $0 = bindMaybeT(Monad0);
    const ask1 = MonadAsk0.ask;
    const asks = (f2) => MonadAsk0.Monad0().Bind1().Apply0().Functor0().map(f2)(ask1);
    const $1 = applicativeMaybeT(Monad0);
    return (dictMonadState) => {
      const $2 = monadStateMaybeT(dictMonadState);
      return (dir2) => (signal) => $$void($0.bind((() => {
        const $3 = lookup(ordCardinalDirection)(dir2);
        return asks((x2) => $3(x2.psuedoPieceLocations));
      })())((loc) => $0.bind((() => {
        const $3 = lookup(ordLocation)(loc);
        return asks((x2) => $3(x2.pieces));
      })())((v) => {
        const $3 = $0.bind(Monad0.Applicative0().pure(getPsuedoPiecePort(v)))((port2) => {
          const $32 = insert(ordRelativeEdge)({ loc, dir: Right2 })({
            connected: false,
            port: port2,
            signal: (() => {
              const $33 = portCapacity(port2);
              if ($33 === "OneBit") {
                return 1 & signal;
              }
              if ($33 === "TwoBit") {
                return 3 & signal;
              }
              if ($33 === "FourBit") {
                return 15 & signal;
              }
              if ($33 === "EightBit") {
                return 255 & signal;
              }
              fail();
            })()
          });
          return $2.state((s2) => $Tuple(void 0, $32(s2)));
        });
        if (v.name === "psuedo-input") {
          return $3;
        }
        return $1.pure();
      })));
    };
  };
  var injectInputs = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const ask1 = MonadAsk0.ask;
    const Applicative0 = Monad0.Applicative0();
    const forWithIndex_4 = forWithIndex_(Applicative0)(foldableWithIndexMap);
    const for_9 = for_(Applicative0)(foldableMaybe);
    const setOuterPort1 = setOuterPort(dictMonadReader);
    return (dictMonadState) => {
      const setOuterPort2 = setOuterPort1(dictMonadState);
      return (inputs) => Monad0.Bind1().bind(MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x2) => x2.psuedoPieceLocations)(ask1))((psuedoPieceLocations) => forWithIndex_4(psuedoPieceLocations)((dir2) => (loc) => for_9(lookup(ordCardinalDirection)(dir2)(inputs))((signal) => setOuterPort2(dir2)(signal))));
    };
  };
  var getPorts = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const $0 = Monad0.Bind1();
    const ask1 = MonadAsk0.ask;
    const asks = (f2) => MonadAsk0.Monad0().Bind1().Apply0().Functor0().map(f2)(ask1);
    return $0.bind(asks((x2) => x2.pieces))((pieces) => $0.bind(asks((x2) => x2.psuedoPieceLocations))((psuedoPieceLocations) => Monad0.Applicative0().pure(mapMaybeWithKey(ordCardinalDirection)((v) => (loc) => {
      const $1 = lookup(ordLocation)(loc)(pieces);
      const $2 = (() => {
        if ($1.tag === "Just") {
          return lookup(ordCardinalDirection)(Right2)($1._1.ports);
        }
        if ($1.tag === "Nothing") {
          return Nothing;
        }
        fail();
      })();
      if ($2.tag === "Just") {
        return $Maybe("Just", matchingPort($2._1));
      }
      return Nothing;
    })(psuedoPieceLocations))));
  };
  var getPorts1 = /* @__PURE__ */ getPorts(monadReaderFun);
  var getOuterPort = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const Bind1 = Monad0.Bind1();
    const ask1 = MonadAsk0.ask;
    return (dictMonadState) => (dir2) => Bind1.bind((() => {
      const $0 = lookup(ordCardinalDirection)(dir2);
      return MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x2) => $0(x2.psuedoPieceLocations))(ask1);
    })())((maybeLoc) => traversableMaybe.traverse(Monad0.Applicative0())((loc) => Bind1.Apply0().Functor0().map((v2) => {
      if (v2.tag === "Nothing") {
        return 0;
      }
      if (v2.tag === "Just") {
        return v2._1.signal;
      }
      fail();
    })((() => {
      const $0 = lookup(ordRelativeEdge)({ loc, dir: Right2 });
      return dictMonadState.state((s2) => $Tuple($0(s2), s2));
    })()))(maybeLoc));
  };
  var getInputOnEdge = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const Bind1 = Monad0.Bind1();
    const ask1 = MonadAsk0.ask;
    const Applicative0 = Monad0.Applicative0();
    return (dictMonadState) => {
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      const assign3 = (p2, b) => $$void((() => {
        const $0 = p2((v) => b);
        return dictMonadState.state((s2) => {
          const s$p = $0(s2);
          return $Tuple(s$p, s$p);
        });
      })());
      return (inRelEdge) => (capacity) => Bind1.bind(MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x2) => x2.connections)(ask1))((connections) => {
        const v = lookup(ordRelativeEdge)(inRelEdge)(connections);
        if (v.tag === "Just") {
          const $0 = v._1;
          return Bind1.bind(Bind1.bind((() => {
            const $1 = at2($0)(strongForget);
            return dictMonadState.state((s2) => $Tuple($1(identity14)(s2), s2));
          })())(traversableMaybe.traverse(Applicative0)((info2) => {
            const signal = getClampedSignal(info2);
            return Bind1.bind(assign3(
              at2(inRelEdge)(strongFn),
              $Maybe("Just", { connected: true, signal, port: { portType: Input, capacity } })
            ))(() => Bind1.bind(assign3(
              at2($0)(strongFn),
              $Maybe("Just", { connected: true, signal, port: { portType: Output, capacity } })
            ))(() => Applicative0.pure(signal)));
          })))((maybeSignal) => Applicative0.pure((() => {
            if (maybeSignal.tag === "Nothing") {
              return 0;
            }
            if (maybeSignal.tag === "Just") {
              return maybeSignal._1;
            }
            fail();
          })()));
        }
        if (v.tag === "Nothing") {
          return Bind1.bind(Bind1.Apply0().Functor0().map((v2) => {
            if (v2.tag === "Nothing") {
              return 0;
            }
            if (v2.tag === "Just") {
              return v2._1.signal;
            }
            fail();
          })((() => {
            const $0 = at2(inRelEdge)(strongForget);
            return dictMonadState.state((s2) => $Tuple($0(identity14)(s2), s2));
          })()))((signal) => Bind1.bind(assign3(
            at2(inRelEdge)(strongFn),
            $Maybe("Just", { connected: false, signal, port: { portType: Input, capacity } })
          ))(() => Applicative0.pure(signal)));
        }
        fail();
      });
    };
  };
  var extractOutputs = (dictMonadReader) => {
    const Monad0 = dictMonadReader.MonadAsk0().Monad0();
    const Bind1 = Monad0.Bind1();
    const $0 = Bind1.Apply0().Functor0();
    const getPorts2 = getPorts(dictMonadReader);
    const $1 = traversableWithIndexMap.traverseWithIndex(Monad0.Applicative0());
    const getOuterPort1 = getOuterPort(dictMonadReader);
    return (dictMonadState) => {
      const getOuterPort2 = getOuterPort1(dictMonadState);
      return $0.map(catMaybes3)(Bind1.bind($0.map(filterWithKey(ordCardinalDirection)((v) => isOutput))(getPorts2))((outputPorts) => $1((dir2) => (port2) => getOuterPort2(dir2))(outputPorts)));
    };
  };
  var evalWithPortInfoAt = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const Bind1 = Monad0.Bind1();
    const ask1 = MonadAsk0.ask;
    const Applicative0 = Monad0.Applicative0();
    const for_9 = for_(Applicative0)(foldableMaybe);
    const $0 = Bind1.Apply0().Functor0();
    const $1 = traversableWithIndexMap.traverseWithIndex(Applicative0);
    const getInputOnEdge1 = getInputOnEdge(dictMonadReader);
    const forWithIndex_4 = forWithIndex_(Applicative0)(foldableWithIndexMap);
    return (dictMonadState) => {
      const getInputOnEdge2 = getInputOnEdge1(dictMonadState);
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      return (loc) => Bind1.bind(MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x2) => x2.pieces)(ask1))((pieces) => for_9(lookup(ordLocation)(loc)(pieces))((v) => Bind1.bind($0.map(fromFoldable10)($1((dir2) => (port2) => $0.map(Tuple(dir2))(getInputOnEdge2({
        loc,
        dir: dir2
      })(portCapacity(port2))))(filterWithKey(ordCardinalDirection)((v$1) => isInput)(v.ports))))((inputs) => {
        const $2 = elem(eqPieceId)(v.name)(["psuedo-input", "psuedo-output"]);
        const outputs = v.eval(inputs);
        const $3 = forWithIndex_4(filterWithKey(ordCardinalDirection)((v$1) => isOutput)(v.ports))((dir2) => (port2) => {
          const $32 = $Maybe(
            "Just",
            {
              connected: false,
              signal: (() => {
                const $33 = portCapacity(port2);
                const $4 = (() => {
                  if ($33 === "OneBit") {
                    return 1;
                  }
                  if ($33 === "TwoBit") {
                    return 3;
                  }
                  if ($33 === "FourBit") {
                    return 15;
                  }
                  if ($33 === "EightBit") {
                    return 255;
                  }
                  fail();
                })();
                const $5 = lookup(ordCardinalDirection)(dir2)(outputs);
                if ($5.tag === "Nothing") {
                  return 0;
                }
                if ($5.tag === "Just") {
                  return $4 & $5._1;
                }
                fail();
              })(),
              port: port2
            }
          );
          return $$void((() => {
            const $4 = at2({ loc, dir: dir2 })(strongFn)((v$1) => $32);
            return dictMonadState.state((s2) => {
              const s$p = $4(s2);
              return $Tuple(s$p, s$p);
            });
          })());
        });
        if (!$2) {
          return $3;
        }
        if ($2) {
          return Applicative0.pure();
        }
        fail();
      })));
    };
  };
  var evalWithPortInfo = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const Bind1 = Monad0.Bind1();
    const ask1 = MonadAsk0.ask;
    const injectInputs1 = injectInputs(dictMonadReader);
    const traverse_18 = traverse_(Monad0.Applicative0())(foldableList);
    const evalWithPortInfoAt1 = evalWithPortInfoAt(dictMonadReader);
    const extractOutputs1 = extractOutputs(dictMonadReader);
    return (dictMonadState) => {
      const injectInputs2 = injectInputs1(dictMonadState);
      const evalWithPortInfoAt2 = evalWithPortInfoAt1(dictMonadState);
      const extractOutputs2 = extractOutputs1(dictMonadState);
      return (inputs) => Bind1.bind(MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x2) => x2.evalOrder)(ask1))((evalOrder) => Bind1.bind(injectInputs2(inputs))(() => Bind1.bind(traverse_18(evalWithPortInfoAt2)(evalOrder))(() => extractOutputs2)));
    };
  };
  var evalWithPortInfo1 = /* @__PURE__ */ evalWithPortInfo(/* @__PURE__ */ monadReaderReaderT({
    Applicative0: () => applicativeStateT(monadIdentity),
    Bind1: () => bindStateT(monadIdentity)
  }))(/* @__PURE__ */ monadStateReaderT(monadStateStateT2));
  var evaluableBoardPiece = (v) => ({
    name: "evaluable",
    eval: (inputs) => evalWithPortInfo1(inputs)(v)(Leaf2)._1,
    complexity: { space: 0, time: 0 },
    shouldRipple: false,
    updateCapacity: (v1) => (v2) => Nothing,
    ports: getPorts1(v),
    updatePort: (v1) => (v2) => Nothing,
    isSimplifiable: Nothing
  });
  var buildEvaluableBoard = (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Monad0 = MonadThrow0.Monad0();
    const Functor0 = Monad0.Bind1().Apply0().Functor0();
    const bindStateT2 = bindStateT(Monad0);
    const applicativeStateT2 = applicativeStateT(Monad0);
    const forWithIndex_4 = forWithIndex_(applicativeStateT2)(foldableWithIndexMap);
    const monadStateStateT12 = monadStateStateT(Monad0);
    const getBoardEdgePseudoLocation2 = getBoardEdgePseudoLocation(monadStateStateT12);
    const $$void = monadStateStateT12.Monad0().Bind1().Apply0().Functor0().map((v) => {
    });
    const buildConnectionMap2 = buildConnectionMap(monadStateStateT12);
    const $0 = traversableWithIndexMap.traverseWithIndex(applicativeStateT2);
    return (psuedoPiecePorts) => evalStateT(Functor0)(bindStateT2.bind(forWithIndex_4(psuedoPiecePorts)((dir2) => (port2) => bindStateT2.bind(getBoardEdgePseudoLocation2(dir2))((loc) => {
      const $1 = $Maybe("Just", { piece: psuedoPiece(port2), rotation: clockwiseRotation(Left2)(dir2) });
      return $$void((() => {
        const $2 = _pieces3(at1(loc)(strongFn)((v) => $1));
        return monadStateStateT12.state((s2) => {
          const s$p = $2(s2);
          return $Tuple(s$p, s$p);
        });
      })());
    })))(() => bindStateT2.bind((() => {
      const $1 = functorMap.map((v) => v.piece);
      const $2 = monadStateStateT12.state((s2) => $Tuple(_pieces12(identity14)(s2), s2));
      return (s2) => Functor0.map((v1) => $Tuple($1(v1._1), v1._2))($2(s2));
    })())((pieces) => bindStateT2.bind(buildConnectionMap2)((connections) => bindStateT2.bind($0((dir2) => (v) => getBoardEdgePseudoLocation2(dir2))(psuedoPiecePorts))((psuedoPieceLocations) => bindStateT2.bind((() => {
      const $1 = monadThrowStateT(MonadThrow0).throwError(Cyclic);
      const $2 = topologicalSortLocations(fromFoldable13(keys3(pieces)))(connections);
      if ($2.tag === "Nothing") {
        return $1;
      }
      if ($2.tag === "Just") {
        return applicativeStateT2.pure($2._1);
      }
      fail();
    })())((evalOrder) => applicativeStateT2.pure({ pieces, connections, evalOrder, psuedoPieceLocations })))))));
  };
  var buildEvaluableBoard1 = /* @__PURE__ */ buildEvaluableBoard(/* @__PURE__ */ monadErrorExceptT(monadIdentity));

  // output-es/Game.Level.Completion/index.js
  var $CompletionStatus = (tag, _1) => ({ tag, _1 });
  var $PortMismatch = (tag, _1) => ({ tag, _1 });
  var eq7 = /* @__PURE__ */ (() => eqMap(eqCardinalDirection)(eqSignal).eq)();
  var for_2 = /* @__PURE__ */ for_(applicativeEither)(foldableArray);
  var NotStarted = /* @__PURE__ */ $CompletionStatus("NotStarted");
  var ReadyForTesting = /* @__PURE__ */ $CompletionStatus("ReadyForTesting");
  var Completed2 = /* @__PURE__ */ $CompletionStatus("Completed");
  var runSingleTest = (dictMonad) => {
    const $0 = dictMonad.Applicative0();
    return (piece) => (testIndex) => (inputs) => (testEval) => {
      const expected = piece.eval(inputs);
      return dictMonad.Bind1().bind(testEval(inputs))((recieved) => {
        if (eq7(expected)(recieved)) {
          return $0.pure($Either("Right", void 0));
        }
        return $0.pure($Either("Left", { testIndex, inputs, expected, recieved }));
      });
    };
  };
  var isPortMismatch = (direction2) => (maybeExpected) => (maybeRecieved) => {
    if (maybeRecieved.tag === "Nothing") {
      if (maybeExpected.tag === "Nothing") {
        return Nothing;
      }
      if (maybeExpected.tag === "Just") {
        return $Maybe("Just", $PortMismatch("PortExpected", { direction: direction2, expected: maybeExpected._1 }));
      }
      fail();
    }
    if (maybeRecieved.tag === "Just") {
      if (maybeExpected.tag === "Nothing") {
        return $Maybe("Just", $PortMismatch("NoPortExpected", { direction: direction2, received: maybeRecieved._1 }));
      }
      if (maybeExpected.tag === "Just") {
        if (maybeExpected._1.portType === "Input" ? maybeRecieved._1.portType !== "Input" : !(maybeExpected._1.portType === "Output" && maybeRecieved._1.portType === "Output")) {
          return $Maybe(
            "Just",
            $PortMismatch("IncorrectPortType", { direction: direction2, capacity: maybeRecieved._1.capacity, expected: maybeExpected._1.portType, received: maybeRecieved._1.portType })
          );
        }
        if ((() => {
          if (maybeExpected._1.capacity === "OneBit") {
            return maybeRecieved._1.capacity !== "OneBit";
          }
          if (maybeExpected._1.capacity === "TwoBit") {
            return maybeRecieved._1.capacity !== "TwoBit";
          }
          if (maybeExpected._1.capacity === "FourBit") {
            return maybeRecieved._1.capacity !== "FourBit";
          }
          return !(maybeExpected._1.capacity === "EightBit" && maybeRecieved._1.capacity === "EightBit");
        })()) {
          return $Maybe(
            "Just",
            $PortMismatch("IncorrectCapacity", { direction: direction2, portType: maybeRecieved._1.portType, expected: maybeExpected._1.capacity, received: maybeRecieved._1.capacity })
          );
        }
        return Nothing;
      }
    }
    fail();
  };
  var checkPortMismatch = (v) => (evaluable) => for_2(allDirections)((dir2) => {
    const $0 = isPortMismatch(dir2)(lookup(ordCardinalDirection)(dir2)(v.goal.ports))(lookup(ordCardinalDirection)(dir2)(evaluable.ports));
    if ($0.tag === "Nothing") {
      return $Either("Right", void 0);
    }
    if ($0.tag === "Just") {
      return $Either("Left", $0._1);
    }
    fail();
  });
  var checkOtherRestrictions = (v) => (board2) => for_2(v.otherRestrictions)((r2) => {
    const $0 = r2.restriction(board2);
    if (!$0) {
      return $Either("Left", { name: r2.name, description: r2.description });
    }
    if ($0) {
      return $Either("Right", void 0);
    }
    fail();
  });
  var checkEvaluable = (board2) => {
    const $0 = buildEvaluableBoard1(getBoardPorts2(board2)._1)(board2);
    if ($0.tag === "Left") {
      return $Either("Left", $CompletionStatus("NotEvaluable", $0._1));
    }
    if ($0.tag === "Right") {
      return $Either("Right", $0._1);
    }
    fail();
  };
  var isReadyForTesting = (level) => (board2) => {
    const $0 = checkEvaluable(board2);
    const $1 = (() => {
      if ($0.tag === "Left") {
        const $12 = $0._1;
        return (v) => $Either("Left", $12);
      }
      if ($0.tag === "Right") {
        const $12 = $0._1;
        return (f2) => f2($12);
      }
      fail();
    })()((evaluable) => {
      const $12 = checkPortMismatch(level)(evaluableBoardPiece(evaluable));
      if ($12.tag === "Left") {
        return $Either("Left", $CompletionStatus("PortMismatch", $12._1));
      }
      if ($12.tag === "Right") {
        const $2 = checkOtherRestrictions(level)(board2);
        if ($2.tag === "Left") {
          return $Either("Left", $CompletionStatus("FailedRestriction", $2._1));
        }
        if ($2.tag === "Right") {
          return $Either("Right", $2._1);
        }
      }
      fail();
    });
    if ($1.tag === "Left") {
      return $1._1;
    }
    return ReadyForTesting;
  };

  // output-es/Parsing/index.js
  var $ParseError = (_1, _2) => ({ tag: "ParseError", _1, _2 });
  var $ParseState = (_1, _2, _3) => ({ tag: "ParseState", _1, _2, _3 });
  var position = (state1, v, v1, v2, done) => done(state1, state1._2);
  var fail2 = (message2) => (state1, more, lift1, $$throw, done) => more((v1) => position(
    state1,
    more,
    lift1,
    $$throw,
    (state2, a2) => more((v2) => $$throw(state2, $ParseError(message2, a2)))
  ));

  // output-es/Parsing.Combinators/index.js
  var withErrorMessage = (p2) => (msg) => {
    const $0 = fail2("Expected " + msg);
    return (v2, $1, $2, $3, $4) => {
      const $5 = v2._1;
      const $6 = v2._2;
      return $1((v3) => p2(
        $ParseState($5, $6, false),
        $1,
        $2,
        (v4, $7) => {
          const $8 = v4._3;
          return $1((v5) => {
            if ($8) {
              return $3(v4, $7);
            }
            return $0(v2, $1, $2, $3, $4);
          });
        },
        $4
      ));
    };
  };
  var choice = (dictFoldable) => {
    const $0 = dictFoldable.foldr((p1) => (v) => {
      if (v.tag === "Nothing") {
        return $Maybe("Just", p1);
      }
      if (v.tag === "Just") {
        return $Maybe(
          "Just",
          (v2, $02, $1, $2, $3) => {
            const $4 = v2._1;
            const $5 = v2._2;
            return $02((v3) => p1(
              $ParseState($4, $5, false),
              $02,
              $1,
              (v4, $6) => {
                const $7 = v4._3;
                return $02((v5) => {
                  if ($7) {
                    return $2(v4, $6);
                  }
                  return v._1(v2, $02, $1, $2, $3);
                });
              },
              $3
            ));
          }
        );
      }
      fail();
    })(Nothing);
    return (x2) => {
      const $1 = $0(x2);
      if ($1.tag === "Nothing") {
        return fail2("No alternative");
      }
      if ($1.tag === "Just") {
        return $1._1;
      }
      fail();
    };
  };

  // output-es/Parsing.Combinators.Array/index.js
  var many = (p2) => (state1, more, lift1, $$throw, done) => more((v1) => {
    const loop = (state2, arg, gas) => {
      const $0 = (state3, step2) => {
        if (step2.tag === "Loop") {
          if (gas === 0) {
            return more((v1$1) => loop(state3, step2._1, 30));
          }
          return loop(state3, step2._1, gas - 1 | 0);
        }
        if (step2.tag === "Done") {
          const $02 = step2._1;
          return more((v2) => done(state3, reverse2(fromFoldableImpl(foldableList.foldr, $02))));
        }
        fail();
      };
      const $1 = state2._1;
      const $2 = state2._2;
      return more((v3) => more((v1$1) => p2(
        $ParseState($1, $2, false),
        more,
        lift1,
        (v2, $3) => more((v5) => $0(state2, $Step("Done", arg))),
        (state2$1, a2) => more((v2) => $0(state2$1, $Step("Loop", $List("Cons", a2, arg))))
      )));
    };
    return loop(state1, Nil, 30);
  });
  var many1 = (p2) => (state1, more, lift1, $$throw, done) => more((v1) => many(p2)(
    state1,
    more,
    lift1,
    $$throw,
    (state2, a2) => more((v2) => {
      if (a2.length > 0) {
        return done(state2, a2);
      }
      return fail2("Expected at least 1")(state2, more, lift1, $$throw, done);
    })
  ));

  // output-es/Parsing.String/index.js
  var updatePosSingle = (v) => (cp) => (after) => {
    if (cp === 10) {
      return { index: v.index + 1 | 0, line: v.line + 1 | 0, column: 1 };
    }
    if (cp === 13) {
      const v2 = codePointAt(0)(after);
      if (v2.tag === "Just" && v2._1 === 10) {
        return { index: v.index + 1 | 0, line: v.line, column: v.column };
      }
      return { index: v.index + 1 | 0, line: v.line + 1 | 0, column: 1 };
    }
    if (cp === 9) {
      return { index: v.index + 1 | 0, line: v.line, column: (v.column + 8 | 0) - intMod(v.column - 1 | 0)(8) | 0 };
    }
    return { index: v.index + 1 | 0, line: v.line, column: v.column + 1 | 0 };
  };
  var updatePosString = (updatePosString$a0$copy) => (updatePosString$a1$copy) => (updatePosString$a2$copy) => {
    let updatePosString$a0 = updatePosString$a0$copy;
    let updatePosString$a1 = updatePosString$a1$copy;
    let updatePosString$a2 = updatePosString$a2$copy;
    let updatePosString$c = true;
    let updatePosString$r;
    while (updatePosString$c) {
      const pos = updatePosString$a0, before = updatePosString$a1, after = updatePosString$a2;
      const v = uncons3(before);
      if (v.tag === "Nothing") {
        updatePosString$c = false;
        updatePosString$r = pos;
        continue;
      }
      if (v.tag === "Just") {
        updatePosString$a0 = v._1.tail === "" ? updatePosSingle(pos)(v._1.head)(after) : updatePosSingle(pos)(v._1.head)(v._1.tail);
        updatePosString$a1 = v._1.tail;
        updatePosString$a2 = after;
        continue;
      }
      fail();
    }
    return updatePosString$r;
  };
  var satisfy = (f2) => (v, $0, $1, $2, $3) => {
    const v3 = uncons3(v._1);
    if (v3.tag === "Nothing") {
      return $2(v, $ParseError("Unexpected EOF", v._2));
    }
    if (v3.tag === "Just") {
      if (v3._1.head < 0 || v3._1.head > 65535) {
        return $2(v, $ParseError("Expected Char", v._2));
      }
      if (v3._1.head >= 0 && v3._1.head <= 65535) {
        const ch = fromCharCode(v3._1.head);
        if (f2(ch)) {
          return $3($ParseState(v3._1.tail, updatePosSingle(v._2)(v3._1.head)(v3._1.tail), true), ch);
        }
        return $2(v, $ParseError("Predicate unsatisfied", v._2));
      }
    }
    fail();
  };
  var consumeWith = (f2) => (v, $0, $1, $2, $3) => {
    const v3 = f2(v._1);
    if (v3.tag === "Left") {
      return $2(v, $ParseError(v3._1, v._2));
    }
    if (v3.tag === "Right") {
      return $3($ParseState(v3._1.remainder, updatePosString(v._2)(v3._1.consumed)(v3._1.remainder), v3._1.consumed !== ""), v3._1.value);
    }
    fail();
  };
  var rest = /* @__PURE__ */ consumeWith((consumed) => $Either("Right", { value: consumed, consumed, remainder: "" }));
  var string = (str2) => consumeWith((input) => {
    const v = stripPrefix(str2)(input);
    if (v.tag === "Just") {
      return $Either("Right", { value: str2, consumed: str2, remainder: v._1 });
    }
    return $Either("Left", "Expected " + showStringImpl(str2));
  });

  // output-es/Data.CodePoint.Unicode/index.js
  var isDecDigit = (c2) => {
    const diff = c2 - 48 | 0;
    return diff <= 9 && diff >= 0;
  };

  // output-es/Parsing.String.Basic/index.js
  var satisfyCP = (p2) => satisfy((x2) => p2(toCharCode(x2)));
  var digit = /* @__PURE__ */ withErrorMessage(/* @__PURE__ */ satisfyCP(isDecDigit))("digit");

  // output-es/Web.DOM.Element/foreign.js
  var getProp = function(name2) {
    return function(doctype) {
      return doctype[name2];
    };
  };
  var _namespaceURI = getProp("namespaceURI");
  var _prefix = getProp("prefix");
  var localName = getProp("localName");
  var tagName = getProp("tagName");
  function classList(element) {
    return function() {
      return element.classList;
    };
  }
  function scrollTop(node) {
    return function() {
      return node.scrollTop;
    };
  }
  function setScrollTop(scrollTop2) {
    return function(node) {
      return function() {
        node.scrollTop = scrollTop2;
      };
    };
  }
  function scrollHeight(el) {
    return function() {
      return el.scrollHeight;
    };
  }
  function clientWidth(el) {
    return function() {
      return el.clientWidth;
    };
  }
  function getBoundingClientRect(el) {
    return function() {
      var rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y
      };
    };
  }

  // output-es/Component.DataAttribute/index.js
  var choice2 = /* @__PURE__ */ choice(foldableArray);
  var direction = {
    attrName: "data-direction",
    attrPrint: (x2) => toLower((() => {
      if (x2 === "Up") {
        return "Up";
      }
      if (x2 === "Right") {
        return "Right";
      }
      if (x2 === "Down") {
        return "Down";
      }
      if (x2 === "Left") {
        return "Left";
      }
      fail();
    })()),
    attrParse: /* @__PURE__ */ choice2([
      (state1, more, lift1, $$throw, done) => more((v1) => string("up")(
        state1,
        more,
        lift1,
        $$throw,
        (state2, a2) => more((v2) => done(state2, Up))
      )),
      (state1, more, lift1, $$throw, done) => more((v1) => string("right")(
        state1,
        more,
        lift1,
        $$throw,
        (state2, a2) => more((v2) => done(state2, Right2))
      )),
      (state1, more, lift1, $$throw, done) => more((v1) => string("down")(
        state1,
        more,
        lift1,
        $$throw,
        (state2, a2) => more((v2) => done(state2, Down))
      )),
      (state1, more, lift1, $$throw, done) => more((v1) => string("left")(
        state1,
        more,
        lift1,
        $$throw,
        (state2, a2) => more((v2) => done(state2, Left2))
      ))
    ])
  };
  var $$int = {
    attrName: "int",
    attrPrint: showIntImpl,
    attrParse: (state1, more, lift1, $$throw, done) => more((v1) => more((v1$1) => many1(digit)(
      state1,
      more,
      lift1,
      $$throw,
      (state2, a2) => more((v2) => {
        const $0 = fromCharArray(fromFoldableImpl(foldrArray, a2));
        return more((v2$1) => {
          const $1 = fromString($0);
          if ($1.tag === "Nothing") {
            return fail2($0)(state2, more, lift1, $$throw, done);
          }
          if ($1.tag === "Just") {
            return done(state2, $1._1);
          }
          fail();
        });
      })
    )))
  };
  var location2 = {
    attrName: "data-location",
    attrPrint: (v) => "(" + showIntImpl(v.x) + "," + showIntImpl(v.y) + ")",
    attrParse: /* @__PURE__ */ (() => {
      const $0 = withErrorMessage(satisfy((v) => v === "("))("'('");
      const $1 = withErrorMessage(satisfy((v) => v === ","))("','");
      return (state1, more, lift1, $$throw, done) => more((v1) => more((v2) => more((v1$1) => more((v2$1) => more((v1$2) => $0(
        state1,
        more,
        lift1,
        $$throw,
        (state2, a2) => more((v2$2) => more((v3) => $$int.attrParse(
          state2,
          more,
          lift1,
          $$throw,
          (state3, a$1) => more((v4) => more((v2$3) => more((v3$1) => $1(
            state3,
            more,
            lift1,
            $$throw,
            (state3$1, a$2) => more((v4$1) => more((v2$4) => {
              const $2 = withErrorMessage(satisfy((v) => v === ")"))("')'");
              return more((v1$3) => more((v2$5) => more((v1$4) => $$int.attrParse(
                state3$1,
                more,
                lift1,
                $$throw,
                (state2$1, a$3) => more((v2$6) => more((v3$2) => $2(state2$1, more, lift1, $$throw, (state3$2, a$4) => more((v4$2) => more((v2$7) => done(state3$2, { x: a$1, y: a$3 }))))))
              ))));
            }))
          ))))
        )))
      ))))));
    })()
  };
  var $$boolean = {
    attrName: "boolean",
    attrPrint: (v) => {
      if (v) {
        return "true";
      }
      return "false";
    },
    attrParse: /* @__PURE__ */ choice2([
      (state1, more, lift1, $$throw, done) => more((v1) => string("true")(state1, more, lift1, $$throw, (state2, a2) => more((v2) => done(state2, true)))),
      (state1, more, lift1, $$throw, done) => more((v1) => string("false")(state1, more, lift1, $$throw, (state2, a2) => more((v2) => done(state2, false))))
    ])
  };
  var isConnected = { ...$$boolean, attrName: "data-is-connected" };
  var isDragging = { ...$$boolean, attrName: "data-is-dragging" };
  var availablePiece = {
    attrName: "data-available-piece",
    attrPrint: unsafeCoerce,
    attrParse: (state1, more, lift1, $$throw, done) => more((v1) => rest(state1, more, lift1, $$throw, (state2, a2) => more((v2) => done(state2, a2))))
  };

  // output-es/Web.DOM.ParentNode/foreign.js
  var getEffProp = function(name2) {
    return function(node) {
      return function() {
        return node[name2];
      };
    };
  };
  var children = getEffProp("children");
  var _firstElementChild = getEffProp("firstElementChild");
  var _lastElementChild = getEffProp("lastElementChild");
  var childElementCount = getEffProp("childElementCount");
  function _querySelector(selector) {
    return function(node) {
      return function() {
        return node.querySelector(selector);
      };
    };
  }

  // output-es/Web.DOM.ParentNode/index.js
  var querySelector = (qs) => {
    const $0 = _querySelector(qs);
    return (x2) => {
      const $1 = $0(x2);
      return () => {
        const a$p = $1();
        return nullable(a$p, Nothing, Just);
      };
    };
  };

  // output-es/Guide.DOMNavigation/index.js
  var getElementByQuerySelector = (selector) => (element) => _bind(_liftEffect(querySelector(selector)(element)))((v2) => {
    if (v2.tag === "Nothing") {
      return _throwError(error("Selection not found: " + selector));
    }
    if (v2.tag === "Just") {
      return _pure(v2._1);
    }
    fail();
  });
  var getElementById = (id4) => (element) => getElementByQuerySelector("#" + id4)(element);
  var getElementByDataAttribute = (attr2) => (a2) => (element) => getElementByQuerySelector("[" + attr2.attrName + "='" + attr2.attrPrint(a2) + "']")(element);
  var getElementByClassName = (v) => (element) => getElementByQuerySelector("." + v)(element);

  // output-es/Web.HTML.HTMLDocument.ReadyState/index.js
  var $ReadyState = (tag) => tag;
  var Loading = /* @__PURE__ */ $ReadyState("Loading");
  var Interactive = /* @__PURE__ */ $ReadyState("Interactive");
  var Complete = /* @__PURE__ */ $ReadyState("Complete");
  var parse2 = (v) => {
    if (v === "loading") {
      return $Maybe("Just", Loading);
    }
    if (v === "interactive") {
      return $Maybe("Just", Interactive);
    }
    if (v === "complete") {
      return $Maybe("Just", Complete);
    }
    return Nothing;
  };

  // output-es/Web.HTML.HTMLDocument/foreign.js
  function _body(doc) {
    return doc.body;
  }
  function _readyState(doc) {
    return doc.readyState;
  }

  // output-es/Web.HTML.HTMLDocument/index.js
  var readyState = (doc) => () => {
    const a$p = _readyState(doc);
    const $0 = parse2(a$p);
    if ($0.tag === "Nothing") {
      return Loading;
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  };

  // output-es/Guide.DOMElements/index.js
  var bodyElement = /* @__PURE__ */ _bind(/* @__PURE__ */ _liftEffect(() => {
    const $0 = windowImpl();
    const $1 = document2($0)();
    const a$p = _body($1);
    return nullable(a$p, Nothing, Just);
  }))((v2) => {
    if (v2.tag === "Nothing") {
      return _throwError(error("Selection not found: body"));
    }
    if (v2.tag === "Just") {
      return _pure(v2._1);
    }
    fail();
  });
  var sidebar = /* @__PURE__ */ _bind(bodyElement)(/* @__PURE__ */ getElementById("sidebar-component"));
  var board = /* @__PURE__ */ _bind(bodyElement)(/* @__PURE__ */ getElementById("board-component"));
  var availablePiece2 = (pieceId) => _bind(_bind(sidebar)(getElementByClassName("available-pieces")))(getElementByDataAttribute(availablePiece)(pieceId));

  // output-es/Web.DOM.DOMTokenList/foreign.js
  function add(list) {
    return function(token) {
      return function() {
        return list.add(token);
      };
    };
  }
  function remove(list) {
    return function(token) {
      return function() {
        return list.remove(token);
      };
    };
  }
  function contains2(list) {
    return function(token) {
      return function() {
        return list.contains(token);
      };
    };
  }

  // output-es/Web.DOM.MutationObserver/foreign.js
  function mutationObserver(cb) {
    return function() {
      return new MutationObserver(function(mr, mo) {
        return cb(mr)(mo)();
      });
    };
  }
  function _observe(node) {
    return function(config) {
      return function(mo) {
        return function() {
          return mo.observe(node, config);
        };
      };
    };
  }
  function disconnect(mo) {
    return function() {
      return mo.disconnect();
    };
  }

  // output-es/Web.DOM.MutationRecord/foreign.js
  function addedNodes(mr) {
    return function() {
      return mr.addedNodes;
    };
  }

  // output-es/Web.DOM.Node/foreign.js
  var getEffProp2 = function(name2) {
    return function(node) {
      return function() {
        return node[name2];
      };
    };
  };
  var baseURI = getEffProp2("baseURI");
  var _ownerDocument = getEffProp2("ownerDocument");
  var _parentNode = getEffProp2("parentNode");
  var _parentElement = getEffProp2("parentElement");
  var childNodes = getEffProp2("childNodes");
  var _firstChild = getEffProp2("firstChild");
  var _lastChild = getEffProp2("lastChild");
  var _previousSibling2 = getEffProp2("previousSibling");
  var _nextSibling2 = getEffProp2("nextSibling");
  var _nodeValue = getEffProp2("nodeValue");
  var textContent = getEffProp2("textContent");
  function insertBefore(node1) {
    return function(node2) {
      return function(parent2) {
        return function() {
          parent2.insertBefore(node1, node2);
        };
      };
    };
  }
  function appendChild(node) {
    return function(parent2) {
      return function() {
        parent2.appendChild(node);
      };
    };
  }
  function removeChild2(node) {
    return function(parent2) {
      return function() {
        parent2.removeChild(node);
      };
    };
  }

  // output-es/Web.DOM.NodeList/foreign.js
  function toArray(list) {
    return function() {
      return [].slice.call(list);
    };
  }

  // output-es/Guide.Event/index.js
  var for_3 = /* @__PURE__ */ for_(applicativeEffect)(foldableArray);
  var nodeIsPiece = (node) => {
    const v = _unsafeReadProtoTagged(Nothing, Just, "Element", node);
    if (v.tag === "Just") {
      const $0 = classList(v._1);
      return () => {
        const tokenList = $0();
        return contains2(tokenList)("piece-component")();
      };
    }
    if (v.tag === "Nothing") {
      return () => false;
    }
    fail();
  };
  var nodeExists = (predicate) => (element) => {
    const $0 = childNodes(element);
    return () => {
      const $1 = $0();
      const children2 = toArray($1)();
      return foldM(monadEffect)((b) => (node) => {
        const $2 = predicate(node);
        return () => {
          const a$p = $2();
          return b || a$p;
        };
      })(false)(children2)();
    };
  };
  var nodeAddedEvent = (predicate) => (element) => _bind(suspendAff(never))((fiber) => _bind(_liftEffect(mutationObserver((records) => (ob) => for_3(records)((record) => {
    const $0 = addedNodes(record);
    return () => {
      const $1 = $0();
      const nodes = toArray($1)();
      return for_3(nodes)((node) => {
        const $2 = predicate(node);
        const $3 = _makeFiber(ffiUtil, killFiber(error("finished"))(fiber));
        return () => {
          const b = $2();
          if (b) {
            const fiber$1 = $3();
            fiber$1.run();
            return disconnect(ob)();
          }
        };
      })();
    };
  }))))((observer) => _bind(_liftEffect(_observe(element)({})(observer)))(() => joinFiber(fiber))));
  var pieceAddedEvent = (loc) => _bind(_bind(board)(getElementByDataAttribute(location2)(loc)))((element) => nodeAddedEvent(nodeIsPiece)(element));
  var pieceExistsEvent = (loc) => _bind(_bind(board)(getElementByDataAttribute(location2)(loc)))((element) => {
    const $0 = _pure();
    const $1 = pieceAddedEvent(loc);
    return _bind(_liftEffect(nodeExists(nodeIsPiece)(element)))((cond$p) => {
      if (cond$p) {
        return $0;
      }
      return $1;
    });
  });
  var levelStartedEvent = /* @__PURE__ */ _pure();

  // output-es/Record.Unsafe.Union/foreign.js
  function unsafeUnionFn(r1, r2) {
    var copy = {};
    for (var k1 in r2) {
      if ({}.hasOwnProperty.call(r2, k1)) {
        copy[k1] = r2[k1];
      }
    }
    for (var k2 in r1) {
      if ({}.hasOwnProperty.call(r1, k2)) {
        copy[k2] = r1[k2];
      }
    }
    return copy;
  }

  // output-es/RoughNotation.Config/index.js
  var $BracketType = (tag) => tag;
  var $RoughAnnotationType = (tag) => tag;
  var $RoughPadding = (tag, _1, _2, _3, _4) => ({ tag, _1, _2, _3, _4 });
  var Box = /* @__PURE__ */ $RoughAnnotationType("Box");
  var Circle = /* @__PURE__ */ $RoughAnnotationType("Circle");
  var Right3 = /* @__PURE__ */ $BracketType("Right");
  var showBracketType = {
    show: (v) => {
      if (v === "Left") {
        return "left";
      }
      if (v === "Right") {
        return "right";
      }
      if (v === "Top") {
        return "top";
      }
      if (v === "Bottom") {
        return "bottom";
      }
      fail();
    }
  };
  var toNativeConfig = (config) => {
    const $0 = unsafeSet("brackets");
    const $1 = arrayMap(showBracketType.show);
    const $2 = nullable(config.brackets, Nothing, Just);
    return (() => {
      if ($2.tag === "Nothing") {
        return unsafeCoerce;
      }
      if ($2.tag === "Just") {
        return $0($1($2._1));
      }
      fail();
    })()((() => {
      const $3 = unsafeSet("padding");
      const $4 = nullable(config.padding, Nothing, Just);
      if ($4.tag === "Nothing") {
        return config;
      }
      if ($4.tag === "Just") {
        return $3((() => {
          if ($4._1.tag === "Padding") {
            return [$4._1._1];
          }
          if ($4._1.tag === "FullPadding") {
            return [$4._1._1, $4._1._2, $4._1._3, $4._1._4];
          }
          fail();
        })())(config);
      }
      fail();
    })());
  };
  var defaultConfig = {
    animate: true,
    animationDuration: 800,
    color: "black",
    strokeWidth: 2,
    padding: /* @__PURE__ */ $RoughPadding("Padding", 5),
    iterations: 2,
    brackets: [Right3],
    multiline: false,
    rtl: false
  };

  // node_modules/rough-notation/lib/rough-notation.esm.js
  var t = "http://www.w3.org/2000/svg";
  var e = class {
    constructor(t2) {
      this.seed = t2;
    }
    next() {
      return this.seed ? (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random();
    }
  };
  function s(t2, e2, s2, i2, n2) {
    return { type: "path", ops: c(t2, e2, s2, i2, n2) };
  }
  function i(t2, e2, i2) {
    const n2 = (t2 || []).length;
    if (n2 > 2) {
      const s2 = [];
      for (let e3 = 0; e3 < n2 - 1; e3++)
        s2.push(...c(t2[e3][0], t2[e3][1], t2[e3 + 1][0], t2[e3 + 1][1], i2));
      return e2 && s2.push(...c(t2[n2 - 1][0], t2[n2 - 1][1], t2[0][0], t2[0][1], i2)), { type: "path", ops: s2 };
    }
    return 2 === n2 ? s(t2[0][0], t2[0][1], t2[1][0], t2[1][1], i2) : { type: "path", ops: [] };
  }
  function n(t2, e2, s2, n2, o2) {
    return function(t3, e3) {
      return i(t3, true, e3);
    }([[t2, e2], [t2 + s2, e2], [t2 + s2, e2 + n2], [t2, e2 + n2]], o2);
  }
  function o(t2, e2, s2, i2, n2) {
    return function(t3, e3, s3, i3) {
      const [n3, o2] = l(i3.increment, t3, e3, i3.rx, i3.ry, 1, i3.increment * h(0.1, h(0.4, 1, s3), s3), s3);
      let r2 = f(n3, null, s3);
      if (!s3.disableMultiStroke) {
        const [n4] = l(i3.increment, t3, e3, i3.rx, i3.ry, 1.5, 0, s3), o3 = f(n4, null, s3);
        r2 = r2.concat(o3);
      }
      return { estimatedPoints: o2, opset: { type: "path", ops: r2 } };
    }(t2, e2, n2, function(t3, e3, s3) {
      const i3 = Math.sqrt(2 * Math.PI * Math.sqrt((Math.pow(t3 / 2, 2) + Math.pow(e3 / 2, 2)) / 2)), n3 = Math.max(s3.curveStepCount, s3.curveStepCount / Math.sqrt(200) * i3), o2 = 2 * Math.PI / n3;
      let r2 = Math.abs(t3 / 2), h2 = Math.abs(e3 / 2);
      const c2 = 1 - s3.curveFitting;
      return r2 += a(r2 * c2, s3), h2 += a(h2 * c2, s3), { increment: o2, rx: r2, ry: h2 };
    }(s2, i2, n2)).opset;
  }
  function r(t2) {
    return t2.randomizer || (t2.randomizer = new e(t2.seed || 0)), t2.randomizer.next();
  }
  function h(t2, e2, s2, i2 = 1) {
    return s2.roughness * i2 * (r(s2) * (e2 - t2) + t2);
  }
  function a(t2, e2, s2 = 1) {
    return h(-t2, t2, e2, s2);
  }
  function c(t2, e2, s2, i2, n2, o2 = false) {
    const r2 = o2 ? n2.disableMultiStrokeFill : n2.disableMultiStroke, h2 = u(t2, e2, s2, i2, n2, true, false);
    if (r2)
      return h2;
    const a2 = u(t2, e2, s2, i2, n2, true, true);
    return h2.concat(a2);
  }
  function u(t2, e2, s2, i2, n2, o2, h2) {
    const c2 = Math.pow(t2 - s2, 2) + Math.pow(e2 - i2, 2), u2 = Math.sqrt(c2);
    let f2 = 1;
    f2 = u2 < 200 ? 1 : u2 > 500 ? 0.4 : -16668e-7 * u2 + 1.233334;
    let l2 = n2.maxRandomnessOffset || 0;
    l2 * l2 * 100 > c2 && (l2 = u2 / 10);
    const g2 = l2 / 2, d3 = 0.2 + 0.2 * r(n2);
    let p2 = n2.bowing * n2.maxRandomnessOffset * (i2 - e2) / 200, _2 = n2.bowing * n2.maxRandomnessOffset * (t2 - s2) / 200;
    p2 = a(p2, n2, f2), _2 = a(_2, n2, f2);
    const m2 = [], w = () => a(g2, n2, f2), v = () => a(l2, n2, f2);
    return o2 && (h2 ? m2.push({ op: "move", data: [t2 + w(), e2 + w()] }) : m2.push({ op: "move", data: [t2 + a(l2, n2, f2), e2 + a(l2, n2, f2)] })), h2 ? m2.push({ op: "bcurveTo", data: [p2 + t2 + (s2 - t2) * d3 + w(), _2 + e2 + (i2 - e2) * d3 + w(), p2 + t2 + 2 * (s2 - t2) * d3 + w(), _2 + e2 + 2 * (i2 - e2) * d3 + w(), s2 + w(), i2 + w()] }) : m2.push({ op: "bcurveTo", data: [p2 + t2 + (s2 - t2) * d3 + v(), _2 + e2 + (i2 - e2) * d3 + v(), p2 + t2 + 2 * (s2 - t2) * d3 + v(), _2 + e2 + 2 * (i2 - e2) * d3 + v(), s2 + v(), i2 + v()] }), m2;
  }
  function f(t2, e2, s2) {
    const i2 = t2.length, n2 = [];
    if (i2 > 3) {
      const o2 = [], r2 = 1 - s2.curveTightness;
      n2.push({ op: "move", data: [t2[1][0], t2[1][1]] });
      for (let e3 = 1; e3 + 2 < i2; e3++) {
        const s3 = t2[e3];
        o2[0] = [s3[0], s3[1]], o2[1] = [s3[0] + (r2 * t2[e3 + 1][0] - r2 * t2[e3 - 1][0]) / 6, s3[1] + (r2 * t2[e3 + 1][1] - r2 * t2[e3 - 1][1]) / 6], o2[2] = [t2[e3 + 1][0] + (r2 * t2[e3][0] - r2 * t2[e3 + 2][0]) / 6, t2[e3 + 1][1] + (r2 * t2[e3][1] - r2 * t2[e3 + 2][1]) / 6], o2[3] = [t2[e3 + 1][0], t2[e3 + 1][1]], n2.push({ op: "bcurveTo", data: [o2[1][0], o2[1][1], o2[2][0], o2[2][1], o2[3][0], o2[3][1]] });
      }
      if (e2 && 2 === e2.length) {
        const t3 = s2.maxRandomnessOffset;
        n2.push({ op: "lineTo", data: [e2[0] + a(t3, s2), e2[1] + a(t3, s2)] });
      }
    } else
      3 === i2 ? (n2.push({ op: "move", data: [t2[1][0], t2[1][1]] }), n2.push({ op: "bcurveTo", data: [t2[1][0], t2[1][1], t2[2][0], t2[2][1], t2[2][0], t2[2][1]] })) : 2 === i2 && n2.push(...c(t2[0][0], t2[0][1], t2[1][0], t2[1][1], s2));
    return n2;
  }
  function l(t2, e2, s2, i2, n2, o2, r2, h2) {
    const c2 = [], u2 = [], f2 = a(0.5, h2) - Math.PI / 2;
    u2.push([a(o2, h2) + e2 + 0.9 * i2 * Math.cos(f2 - t2), a(o2, h2) + s2 + 0.9 * n2 * Math.sin(f2 - t2)]);
    for (let r3 = f2; r3 < 2 * Math.PI + f2 - 0.01; r3 += t2) {
      const t3 = [a(o2, h2) + e2 + i2 * Math.cos(r3), a(o2, h2) + s2 + n2 * Math.sin(r3)];
      c2.push(t3), u2.push(t3);
    }
    return u2.push([a(o2, h2) + e2 + i2 * Math.cos(f2 + 2 * Math.PI + 0.5 * r2), a(o2, h2) + s2 + n2 * Math.sin(f2 + 2 * Math.PI + 0.5 * r2)]), u2.push([a(o2, h2) + e2 + 0.98 * i2 * Math.cos(f2 + r2), a(o2, h2) + s2 + 0.98 * n2 * Math.sin(f2 + r2)]), u2.push([a(o2, h2) + e2 + 0.9 * i2 * Math.cos(f2 + 0.5 * r2), a(o2, h2) + s2 + 0.9 * n2 * Math.sin(f2 + 0.5 * r2)]), [u2, c2];
  }
  function g(t2, e2) {
    return { maxRandomnessOffset: 2, roughness: "highlight" === t2 ? 3 : 1.5, bowing: 1, stroke: "#000", strokeWidth: 1.5, curveTightness: 0, curveFitting: 0.95, curveStepCount: 9, fillStyle: "hachure", fillWeight: -1, hachureAngle: -41, hachureGap: -1, dashOffset: -1, dashGap: -1, zigzagOffset: -1, combineNestedSvgPaths: false, disableMultiStroke: "double" !== t2, disableMultiStrokeFill: false, seed: e2 };
  }
  function d(e2, r2, h2, a2, c2, u2) {
    const f2 = [];
    let l2 = h2.strokeWidth || 2;
    const d3 = function(t2) {
      const e3 = t2.padding;
      if (e3 || 0 === e3) {
        if ("number" == typeof e3)
          return [e3, e3, e3, e3];
        if (Array.isArray(e3)) {
          const t3 = e3;
          if (t3.length)
            switch (t3.length) {
              case 4:
                return [...t3];
              case 1:
                return [t3[0], t3[0], t3[0], t3[0]];
              case 2:
                return [...t3, ...t3];
              case 3:
                return [...t3, t3[1]];
              default:
                return [t3[0], t3[1], t3[2], t3[3]];
            }
        }
      }
      return [5, 5, 5, 5];
    }(h2), p2 = void 0 === h2.animate || !!h2.animate, _2 = h2.iterations || 2, m2 = h2.rtl ? 1 : 0, w = g("single", u2);
    switch (h2.type) {
      case "underline": {
        const t2 = r2.y + r2.h + d3[2];
        for (let e3 = m2; e3 < _2 + m2; e3++)
          e3 % 2 ? f2.push(s(r2.x + r2.w, t2, r2.x, t2, w)) : f2.push(s(r2.x, t2, r2.x + r2.w, t2, w));
        break;
      }
      case "strike-through": {
        const t2 = r2.y + r2.h / 2;
        for (let e3 = m2; e3 < _2 + m2; e3++)
          e3 % 2 ? f2.push(s(r2.x + r2.w, t2, r2.x, t2, w)) : f2.push(s(r2.x, t2, r2.x + r2.w, t2, w));
        break;
      }
      case "box": {
        const t2 = r2.x - d3[3], e3 = r2.y - d3[0], s2 = r2.w + (d3[1] + d3[3]), i2 = r2.h + (d3[0] + d3[2]);
        for (let o2 = 0; o2 < _2; o2++)
          f2.push(n(t2, e3, s2, i2, w));
        break;
      }
      case "bracket": {
        const t2 = Array.isArray(h2.brackets) ? h2.brackets : h2.brackets ? [h2.brackets] : ["right"], e3 = r2.x - 2 * d3[3], s2 = r2.x + r2.w + 2 * d3[1], n2 = r2.y - 2 * d3[0], o2 = r2.y + r2.h + 2 * d3[2];
        for (const h3 of t2) {
          let t3;
          switch (h3) {
            case "bottom":
              t3 = [[e3, r2.y + r2.h], [e3, o2], [s2, o2], [s2, r2.y + r2.h]];
              break;
            case "top":
              t3 = [[e3, r2.y], [e3, n2], [s2, n2], [s2, r2.y]];
              break;
            case "left":
              t3 = [[r2.x, n2], [e3, n2], [e3, o2], [r2.x, o2]];
              break;
            case "right":
              t3 = [[r2.x + r2.w, n2], [s2, n2], [s2, o2], [r2.x + r2.w, o2]];
          }
          t3 && f2.push(i(t3, false, w));
        }
        break;
      }
      case "crossed-off": {
        const t2 = r2.x, e3 = r2.y, i2 = t2 + r2.w, n2 = e3 + r2.h;
        for (let o2 = m2; o2 < _2 + m2; o2++)
          o2 % 2 ? f2.push(s(i2, n2, t2, e3, w)) : f2.push(s(t2, e3, i2, n2, w));
        for (let o2 = m2; o2 < _2 + m2; o2++)
          o2 % 2 ? f2.push(s(t2, n2, i2, e3, w)) : f2.push(s(i2, e3, t2, n2, w));
        break;
      }
      case "circle": {
        const t2 = g("double", u2), e3 = r2.w + (d3[1] + d3[3]), s2 = r2.h + (d3[0] + d3[2]), i2 = r2.x - d3[3] + e3 / 2, n2 = r2.y - d3[0] + s2 / 2, h3 = Math.floor(_2 / 2), a3 = _2 - 2 * h3;
        for (let r3 = 0; r3 < h3; r3++)
          f2.push(o(i2, n2, e3, s2, t2));
        for (let t3 = 0; t3 < a3; t3++)
          f2.push(o(i2, n2, e3, s2, w));
        break;
      }
      case "highlight": {
        const t2 = g("highlight", u2);
        l2 = 0.95 * r2.h;
        const e3 = r2.y + r2.h / 2;
        for (let i2 = m2; i2 < _2 + m2; i2++)
          i2 % 2 ? f2.push(s(r2.x + r2.w, e3, r2.x, e3, t2)) : f2.push(s(r2.x, e3, r2.x + r2.w, e3, t2));
        break;
      }
    }
    if (f2.length) {
      const s2 = function(t2) {
        const e3 = [];
        for (const s3 of t2) {
          let t3 = "";
          for (const i3 of s3.ops) {
            const s4 = i3.data;
            switch (i3.op) {
              case "move":
                t3.trim() && e3.push(t3.trim()), t3 = `M${s4[0]} ${s4[1]} `;
                break;
              case "bcurveTo":
                t3 += `C${s4[0]} ${s4[1]}, ${s4[2]} ${s4[3]}, ${s4[4]} ${s4[5]} `;
                break;
              case "lineTo":
                t3 += `L${s4[0]} ${s4[1]} `;
            }
          }
          t3.trim() && e3.push(t3.trim());
        }
        return e3;
      }(f2), i2 = [], n2 = [];
      let o2 = 0;
      const r3 = (t2, e3, s3) => t2.setAttribute(e3, s3);
      for (const a3 of s2) {
        const s3 = document.createElementNS(t, "path");
        if (r3(s3, "d", a3), r3(s3, "fill", "none"), r3(s3, "stroke", h2.color || "currentColor"), r3(s3, "stroke-width", "" + l2), p2) {
          const t2 = s3.getTotalLength();
          i2.push(t2), o2 += t2;
        }
        e2.appendChild(s3), n2.push(s3);
      }
      if (p2) {
        let t2 = 0;
        for (let e3 = 0; e3 < n2.length; e3++) {
          const s3 = n2[e3], r4 = i2[e3], h3 = o2 ? c2 * (r4 / o2) : 0, u3 = a2 + t2, f3 = s3.style;
          f3.strokeDashoffset = "" + r4, f3.strokeDasharray = "" + r4, f3.animation = `rough-notation-dash ${h3}ms ease-out ${u3}ms forwards`, t2 += h3;
        }
      }
    }
  }
  var p = class {
    constructor(t2, e2) {
      this._state = "unattached", this._resizing = false, this._seed = Math.floor(Math.random() * 2 ** 31), this._lastSizes = [], this._animationDelay = 0, this._resizeListener = () => {
        this._resizing || (this._resizing = true, setTimeout(() => {
          this._resizing = false, "showing" === this._state && this.haveRectsChanged() && this.show();
        }, 400));
      }, this._e = t2, this._config = JSON.parse(JSON.stringify(e2)), this.attach();
    }
    get animate() {
      return this._config.animate;
    }
    set animate(t2) {
      this._config.animate = t2;
    }
    get animationDuration() {
      return this._config.animationDuration;
    }
    set animationDuration(t2) {
      this._config.animationDuration = t2;
    }
    get iterations() {
      return this._config.iterations;
    }
    set iterations(t2) {
      this._config.iterations = t2;
    }
    get color() {
      return this._config.color;
    }
    set color(t2) {
      this._config.color !== t2 && (this._config.color = t2, this.refresh());
    }
    get strokeWidth() {
      return this._config.strokeWidth;
    }
    set strokeWidth(t2) {
      this._config.strokeWidth !== t2 && (this._config.strokeWidth = t2, this.refresh());
    }
    get padding() {
      return this._config.padding;
    }
    set padding(t2) {
      this._config.padding !== t2 && (this._config.padding = t2, this.refresh());
    }
    attach() {
      if ("unattached" === this._state && this._e.parentElement) {
        !function() {
          if (!window.__rno_kf_s) {
            const t2 = window.__rno_kf_s = document.createElement("style");
            t2.textContent = "@keyframes rough-notation-dash { to { stroke-dashoffset: 0; } }", document.head.appendChild(t2);
          }
        }();
        const e2 = this._svg = document.createElementNS(t, "svg");
        e2.setAttribute("class", "rough-annotation");
        const s2 = e2.style;
        s2.position = "absolute", s2.top = "0", s2.left = "0", s2.overflow = "visible", s2.pointerEvents = "none", s2.width = "100px", s2.height = "100px";
        const i2 = "highlight" === this._config.type;
        if (this._e.insertAdjacentElement(i2 ? "beforebegin" : "afterend", e2), this._state = "not-showing", i2) {
          const t2 = window.getComputedStyle(this._e).position;
          (!t2 || "static" === t2) && (this._e.style.position = "relative");
        }
        this.attachListeners();
      }
    }
    detachListeners() {
      window.removeEventListener("resize", this._resizeListener), this._ro && this._ro.unobserve(this._e);
    }
    attachListeners() {
      this.detachListeners(), window.addEventListener("resize", this._resizeListener, { passive: true }), !this._ro && "ResizeObserver" in window && (this._ro = new window.ResizeObserver((t2) => {
        for (const e2 of t2)
          e2.contentRect && this._resizeListener();
      })), this._ro && this._ro.observe(this._e);
    }
    haveRectsChanged() {
      if (this._lastSizes.length) {
        const t2 = this.rects();
        if (t2.length !== this._lastSizes.length)
          return true;
        for (let e2 = 0; e2 < t2.length; e2++)
          if (!this.isSameRect(t2[e2], this._lastSizes[e2]))
            return true;
      }
      return false;
    }
    isSameRect(t2, e2) {
      const s2 = (t3, e3) => Math.round(t3) === Math.round(e3);
      return s2(t2.x, e2.x) && s2(t2.y, e2.y) && s2(t2.w, e2.w) && s2(t2.h, e2.h);
    }
    isShowing() {
      return "not-showing" !== this._state;
    }
    refresh() {
      this.isShowing() && !this.pendingRefresh && (this.pendingRefresh = Promise.resolve().then(() => {
        this.isShowing() && this.show(), delete this.pendingRefresh;
      }));
    }
    show() {
      switch (this._state) {
        case "unattached":
          break;
        case "showing":
          this.hide(), this._svg && this.render(this._svg, true);
          break;
        case "not-showing":
          this.attach(), this._svg && this.render(this._svg, false);
      }
    }
    hide() {
      if (this._svg)
        for (; this._svg.lastChild; )
          this._svg.removeChild(this._svg.lastChild);
      this._state = "not-showing";
    }
    remove() {
      this._svg && this._svg.parentElement && this._svg.parentElement.removeChild(this._svg), this._svg = void 0, this._state = "unattached", this.detachListeners();
    }
    render(t2, e2) {
      let s2 = this._config;
      e2 && (s2 = JSON.parse(JSON.stringify(this._config)), s2.animate = false);
      const i2 = this.rects();
      let n2 = 0;
      i2.forEach((t3) => n2 += t3.w);
      const o2 = s2.animationDuration || 800;
      let r2 = 0;
      for (let e3 = 0; e3 < i2.length; e3++) {
        const h2 = o2 * (i2[e3].w / n2);
        d(t2, i2[e3], s2, r2 + this._animationDelay, h2, this._seed), r2 += h2;
      }
      this._lastSizes = i2, this._state = "showing";
    }
    rects() {
      const t2 = [];
      if (this._svg)
        if (this._config.multiline) {
          const e2 = this._e.getClientRects();
          for (let s2 = 0; s2 < e2.length; s2++)
            t2.push(this.svgRect(this._svg, e2[s2]));
        } else
          t2.push(this.svgRect(this._svg, this._e.getBoundingClientRect()));
      return t2;
    }
    svgRect(t2, e2) {
      const s2 = t2.getBoundingClientRect(), i2 = e2;
      return { x: (i2.x || i2.left) - (s2.x || s2.left), y: (i2.y || i2.top) - (s2.y || s2.top), w: i2.width, h: i2.height };
    }
  };
  function _(t2, e2) {
    return new p(t2, e2);
  }

  // output-es/RoughNotation/foreign.js
  var annotate_ = (element) => (roughAnnotationType) => (config) => () => {
    fullConfig = { ...config };
    fullConfig.type = roughAnnotationType;
    return _(element, fullConfig);
  };
  var show_ = (annotation) => () => annotation.show();
  var remove_ = (annotation) => () => annotation.remove();
  var animationDuration_ = (annotation) => () => annotation.animationDuration;

  // output-es/RoughNotation/index.js
  var withAnnotation = (annotation) => (f2) => _bind(annotation)((a2) => $$finally(_liftEffect(remove_(a2)))(f2(a2)));
  var annotate = () => () => (element) => (roughAnnotationType) => (config) => _liftEffect(annotate_(element)((() => {
    if (roughAnnotationType === "Underline") {
      return "underline";
    }
    if (roughAnnotationType === "Box") {
      return "box";
    }
    if (roughAnnotationType === "Circle") {
      return "circle";
    }
    if (roughAnnotationType === "Highlight") {
      return "highlight";
    }
    if (roughAnnotationType === "StrikeThrough") {
      return "strike-through";
    }
    if (roughAnnotationType === "CrossedOff") {
      return "crossed-off";
    }
    if (roughAnnotationType === "Bracket") {
      return "bracket";
    }
    fail();
  })())(toNativeConfig(unsafeUnionFn(config, defaultConfig))));
  var showAnnotation = (annotation) => cancelWith(_bind(_liftEffect(animationDuration_(annotation)))((v) => _bind(_liftEffect(show_(annotation)))(() => _delay(
    Right,
    v
  ))))((v) => _liftEffect(remove_(annotation)));

  // output-es/Guide.Overlay/foreign.js
  var delayUntilClicked_ = (element) => (onError, onSuccess) => {
    const onClick = (event) => {
      onSuccess();
    };
    const options = { once: true };
    element.addEventListener("click", onClick, options);
    return function(cancelError, onCancelerError, onCancelerSuccess) {
      element.removeEventListener("click", onClick, options);
      onCancelerSuccess();
    };
  };
  var withDescription_ = (annotation) => (description) => () => {
    fontSize = 36;
    for (var i2 = 0; i2 < Math.min(3, description.length); i2++) {
      const newElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
      newElement.appendChild(document.createTextNode(description[i2]));
      newElement.setAttribute("x", (annotation._lastSizes[0].x + annotation._lastSizes[0].w + 15).toString());
      newElement.setAttribute("y", (annotation._lastSizes[0].y + fontSize * (i2 + 1)).toString());
      newElement.setAttribute("font-size", fontSize + "px");
      annotation._svg.appendChild(newElement);
    }
  };

  // output-es/Guide.Overlay/index.js
  var parOneOfMap = (f2) => {
    const $0 = foldrArray((x2) => _parAffAlt(f2(x2)))(plusAff.empty);
    return (x2) => _sequential($0(x2));
  };
  var killOn = (action) => (interuption) => _bind(forkAff(action))((actionFiber) => _bind(forkAff(applyAff.apply(_map($$const)(interuption))(killFiber(error(""))(actionFiber))))((haltFiber) => parOneOfMap(joinFiber)([
    actionFiber,
    haltFiber
  ])));
  var addPieceAnimation = (v) => {
    const $0 = v.idPiece;
    const $1 = v.location00;
    return _bind(withAnnotation(annotate()()($0)(Box)({ color: "#eb432d", iterations: 1 }))((annotation) => _bind(showAnnotation(annotation))(() => _bind(_liftEffect(withDescription_(annotation)([
      "Click a piece",
      "to add it to",
      "the board"
    ])))(() => fromEffectFnAff(delayUntilClicked_($0))))))(() => withAnnotation(annotate()()($1)(Circle)({
      color: "red",
      padding: $RoughPadding("Padding", 15),
      iterations: 2,
      animationDuration: 2e3
    }))((annotation) => _bind(showAnnotation(annotation))(() => _delay(Right, 2e3))));
  };
  var addPieceOverlay = (pieceId) => _bind(availablePiece2(pieceId))((idPiece2) => _bind(_bind(board)(getElementByDataAttribute(location2)({
    x: 0,
    y: 0
  })))((location00) => killOn(_bind(levelStartedEvent)(() => addPieceAnimation({ idPiece: idPiece2, location00 })))(applyAff.apply(_map((v) => identity)(pieceExistsEvent({
    x: 0,
    y: 0
  })))(_liftEffect(log2("added piece :("))))));

  // output-es/Resources.LevelSuites.TutorialSuite.Suite/index.js
  var bindReaderT3 = /* @__PURE__ */ bindReaderT(bindAff);
  var liftAff2 = /* @__PURE__ */ (() => monadAffReader(monadAffAff).liftAff)();
  var left = /* @__PURE__ */ mkLevel()()({
    goal: leftPiece,
    name: "Take a Left",
    description: " (Bonus, )",
    testCases: /* @__PURE__ */ binaryTestInputs([Left2]),
    availablePieces: [idPiece, orPiece]
  });
  var or2 = /* @__PURE__ */ mkLevel()()({
    goal: orPiece,
    name: "Two enter, one leaves",
    description: "",
    testCases: /* @__PURE__ */ binaryTestInputs([Left2, Up]),
    availablePieces: [idPiece, orPiece],
    unlocksUponCompletion: [left],
    enableBoardSizeChange: false,
    enableClickAndDragPaths: false
  });
  var negation = /* @__PURE__ */ (() => mkLevel()()({
    goal: notPiece,
    name: "Negation",
    description: "Negate the signal inputed on the Left and output it on the Right",
    testCases: binaryTestInputs([Left2]),
    requiresAutomaticTesting: false,
    availablePieces: [idPiece, notPiece],
    otherRestrictions: [],
    conversation: bindReaderT3.bind(sendMessage({
      user: $Maybe("Just", "mitch"),
      html: [$VDom("Text", "hello world")],
      action: _pure()
    }))(() => bindReaderT3.bind(sendMessage(button2("")("click me")(47)))((n2) => monadEffectReader(monadEffectAff).liftEffect(log2("got: " + showIntImpl(n2))))),
    unlocksUponCompletion: [or2],
    enableBoardSizeChange: false,
    enableClickAndDragPaths: false
  }))();
  var firstLevel = /* @__PURE__ */ (() => mkLevel()()({
    goal: idPiece,
    name: "From A to B",
    description: "Connect the signal (arrow) on the left to the arrow on the right.",
    testCases: binaryTestInputs([Left2]),
    availablePieces: [idPiece],
    conversation: bindReaderT3.bind(sendMessage(altMessage.alt(button2("yes")("Y")(true))(applyMessage.apply({
      action: _map((v) => identity)(_pure()),
      html: [$VDom("Text", "/")],
      user: Nothing
    })(button2("no")("N")(false)))))((playedBefore) => bindReaderT3.bind(_pure)((listener) => bindReaderT3.bind(sendMessageWithDelay({
      user: $Maybe("Just", "guide"),
      html: [$VDom("Text", "alright lets get going")],
      action: _pure()
    }))(() => bindReaderT3.bind(liftAff2(addPieceOverlay(idPiece.name)))(() => {
      const $0 = _pure();
      return (v) => $0;
    })))),
    unlocksUponCompletion: [negation],
    enableBoardSizeChange: false,
    enableClickAndDragPaths: false
  }))();
  var tutorialSuite = /* @__PURE__ */ toLevelSuite(foldableArray)("Tutorial Suite")([firstLevel, negation, or2, left]);

  // output-es/Game.Piece.ArithmeticPiece/index.js
  var fromFoldable11 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var mkSuccPiece = (capacity) => ({
    complexity: { space: 10, time: 0 },
    eval: (m2) => {
      const $0 = lookup(ordCardinalDirection)(Left2)(m2);
      const s2 = (() => {
        if ($0.tag === "Nothing") {
          return 0;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })();
      return $$$Map(
        "Node",
        1,
        1,
        Right2,
        (() => {
          if (capacity === "OneBit") {
            return s2 === 1;
          }
          if (capacity === "TwoBit") {
            return s2 === 3;
          }
          if (capacity === "FourBit") {
            return s2 === 15;
          }
          if (capacity === "EightBit") {
            return s2 === 255;
          }
          fail();
        })() ? 0 : s2 + 1 | 0,
        Leaf2,
        Leaf2
      );
    },
    isSimplifiable: Nothing,
    name: "succ",
    ports: fromFoldable11([
      $Tuple(Left2, { portType: Input, capacity }),
      $Tuple(Right2, { portType: Output, capacity })
    ]),
    shouldRipple: false,
    updateCapacity: (v) => (capacity$p) => $Maybe("Just", mkSuccPiece(capacity$p)),
    updatePort: (v) => (v1) => Nothing
  });
  var succPiece = /* @__PURE__ */ mkSuccPiece(TwoBit);

  // output-es/Resources.LevelSuites.TwoBit.Pieces/index.js
  var twoBitCrossOver = {
    complexity: { space: 20, time: 0 },
    eval: (m2) => {
      const $0 = lookup(ordCardinalDirection)(Left2)(m2);
      const s2 = (() => {
        if ($0.tag === "Nothing") {
          return 0;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })();
      return $$$Map(
        "Node",
        1,
        1,
        Right2,
        ((s2 >> 0 & 1) !== 0 ? 2 : 0) + ((s2 >> 1 & 1) !== 0 ? 1 : 0) | 0,
        Leaf2,
        Leaf2
      );
    },
    isSimplifiable: Nothing,
    name: "two-bit-cross-over",
    ports: /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray)([
      /* @__PURE__ */ $Tuple(Left2, { portType: Input, capacity: TwoBit }),
      /* @__PURE__ */ $Tuple(Right2, { portType: Output, capacity: TwoBit })
    ]),
    shouldRipple: false,
    updateCapacity: (v) => (v1) => Nothing,
    updatePort: (v) => (v1) => Nothing
  };

  // output-es/Resources.LevelSuites.TwoBitSuite/index.js
  var twoBitSuite = /* @__PURE__ */ toLevelSuite(foldableArray)("Two Bit")([
    /* @__PURE__ */ mkLevel()()({
      name: "From 2A to 2B",
      goal: /* @__PURE__ */ mkConnectionPiece({
        capacity: TwoBit,
        outputs: /* @__PURE__ */ $$$Map("Node", 1, 1, Right2, void 0, Leaf2, Leaf2)
      }),
      description: "This looks familiar, but the input and output ports have a capacity of 2 bits! Build a path between the left and the right, then use the '2' key to increase the capacity of the path. The capacity of each port is colour coded, only ports with the same capacity can connect!",
      availablePieces: [idPiece],
      testCases: [
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 0, Leaf2, Leaf2),
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 1, Leaf2, Leaf2),
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 2, Leaf2, Leaf2),
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 3, Leaf2, Leaf2)
      ]
    }),
    /* @__PURE__ */ mkLevel()()({
      name: "Lovers Lake",
      goal: fusePiece,
      description: "Use a fuse-piece to combine the inputs from the top and left, output the result to the right",
      availablePieces: [fusePiece, idPiece],
      testCases: [
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 0, Leaf2, Leaf2),
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 1, Leaf2, Leaf2),
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 2, Leaf2, Leaf2),
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 3, Leaf2, Leaf2)
      ]
    }),
    /* @__PURE__ */ mkLevel()()({
      name: "Two bit criss cross",
      goal: twoBitCrossOver,
      description: "Sever the input on the left with a sever-piece, cross over the signals, fuse them back together",
      availablePieces: [severPiece, fusePiece, idPiece],
      testCases: [
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 0, Leaf2, Leaf2),
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 1, Leaf2, Leaf2),
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 2, Leaf2, Leaf2),
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 3, Leaf2, Leaf2)
      ]
    }),
    /* @__PURE__ */ mkLevel()()({
      name: "Increment",
      goal: succPiece,
      description: "Add one to the two bit input signal. if the input is 3 (which has no successor), output signal 0",
      availablePieces: [xorPiece, notPiece, fusePiece, severPiece],
      testCases: [
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 0, Leaf2, Leaf2),
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 1, Leaf2, Leaf2),
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 2, Leaf2, Leaf2),
        /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, 3, Leaf2, Leaf2)
      ]
    })
  ]);

  // output-es/Resources.LevelSuites/index.js
  var forWithIndex = /* @__PURE__ */ (() => {
    const $0 = traversableWithIndexObject.traverseWithIndex(applicativeEffect);
    return (b) => (a2) => $0(a2)(b);
  })();
  var getProgress2 = /* @__PURE__ */ getProgress(localStorageLevelIdLevelP);
  var all2 = /* @__PURE__ */ (() => {
    const semigroupConj1 = { append: (v) => (v1) => v && v1 };
    const foldMap1 = foldMap({ mempty: true, Semigroup0: () => semigroupConj1 });
    return (f2) => foldMap1((v) => f2);
  })();
  var saveProgress2 = /* @__PURE__ */ saveProgress(localStorageLevelIdLevelP);
  var allLevelSuites = /* @__PURE__ */ fromFoldable2(foldableArray)(/* @__PURE__ */ arrayMap((suite) => $Tuple(
    suite.suiteName,
    suite
  ))([
    tutorialSuite,
    intermediateSuite,
    twoBitSuite,
    shiftingSuite
  ]));
  var getAllLevelProgress = /* @__PURE__ */ (() => {
    const $0 = forWithIndex(allLevelSuites)((suiteName) => (suite) => forWithIndex(suite.levels)((levelName) => (v) => getProgress2({ suiteName, levelName })));
    return () => {
      const unlockedLevels = $0();
      if (all2(isEmpty)(unlockedLevels)) {
        saveProgress2({ suiteName: tutorialSuite.suiteName, levelName: firstLevel.name })(Unlocked)();
        const $1 = (() => {
          const $12 = {};
          $12[firstLevel.name] = $Maybe("Just", Unlocked);
          return $12;
        })();
        return (() => {
          const $2 = {};
          $2[tutorialSuite.suiteName] = $1;
          return $2;
        })();
      }
      return unlockedLevels;
    };
  })();

  // output-es/AppM/index.js
  var monadEffectReader2 = /* @__PURE__ */ monadEffectReader(monadEffectAff);
  var logMessage2 = /* @__PURE__ */ logMessage(monadEffectReader2);
  var monadLoggerAppM = /* @__PURE__ */ (() => {
    const monadEffectLoggerT1 = monadEffectLoggerT(monadEffectReader2);
    return { log: (message2) => (v) => v(message2), MonadEffect0: () => monadEffectLoggerT1 };
  })();
  var monadAskGlobalStateAppM = /* @__PURE__ */ monadAskLoggerT(/* @__PURE__ */ (() => {
    const monadReaderT1 = monadReaderT(monadAff);
    return { ask: _pure, Monad0: () => monadReaderT1 };
  })());
  var monadAffAppM = /* @__PURE__ */ monadAffLoggerT(/* @__PURE__ */ monadAffReader(monadAffAff));
  var initialGlobalState = () => {
    const $0 = getAllLevelProgress();
    const levelProgress = { value: $0 };
    return { levelProgress };
  };
  var runAppM = (component13) => _bind(_liftEffect(initialGlobalState))((store) => _pure(hoist2(functorAff)((v) => v(logMessage2(Debug))(store))(component13)));

  // output-es/Data.Bifoldable/index.js
  var bifoldableTuple = {
    bifoldMap: (dictMonoid) => (f2) => (g2) => (v) => dictMonoid.Semigroup0().append(f2(v._1))(g2(v._2)),
    bifoldr: (f2) => (g2) => (z) => (v) => f2(v._1)(g2(v._2)(z)),
    bifoldl: (f2) => (g2) => (z) => (v) => g2(f2(z)(v._1))(v._2)
  };

  // output-es/Data.Bitraversable/index.js
  var bitraversableTuple = {
    bitraverse: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      return (f2) => (g2) => (v) => Apply0.apply(Apply0.Functor0().map(Tuple)(f2(v._1)))(g2(v._2));
    },
    bisequence: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      return (v) => Apply0.apply(Apply0.Functor0().map(Tuple)(v._1))(v._2);
    },
    Bifunctor0: () => bifunctorTuple,
    Bifoldable1: () => bifoldableTuple
  };

  // output-es/JSURI/foreign.js
  function encodeURIComponent_to_RFC3986(input) {
    return input.replace(/[!'()*]/g, function(c2) {
      return "%" + c2.charCodeAt(0).toString(16);
    });
  }
  function _encodeURIComponent(fail3, succeed, input) {
    try {
      return succeed(encodeURIComponent_to_RFC3986(encodeURIComponent(input)));
    } catch (err) {
      return fail3(err);
    }
  }
  function _decodeURIComponent(fail3, succeed, input) {
    try {
      return succeed(decodeURIComponent(input));
    } catch (err) {
      return fail3(err);
    }
  }

  // output-es/JSURI/index.js
  var encodeURIComponent2 = ($0) => _encodeURIComponent((v) => Nothing, Just, $0);

  // output-es/Routing.Duplex.Parser/index.js
  var $RouteError = (tag, _1, _2) => ({ tag, _1, _2 });
  var $RouteParser = (tag, _1, _2) => ({ tag, _1, _2 });
  var $RouteResult = (tag, _1, _2) => ({ tag, _1, _2 });
  var bitraverse = /* @__PURE__ */ (() => bitraversableTuple.bitraverse(applicativeEither))();
  var traverse2 = /* @__PURE__ */ (() => traversableArray.traverse(applicativeEither))();
  var EndOfPath = /* @__PURE__ */ $RouteError("EndOfPath");
  var take3 = /* @__PURE__ */ $RouteParser(
    "Chomp",
    (state) => {
      const v = unconsImpl((v2) => Nothing, (x2) => (xs) => $Maybe("Just", { head: x2, tail: xs }), state.segments);
      if (v.tag === "Just") {
        return $RouteResult("Success", { ...state, segments: v._1.tail }, v._1.head);
      }
      return $RouteResult("Fail", EndOfPath);
    }
  );
  var parsePath = /* @__PURE__ */ (() => {
    const $0 = bitraversableTuple.bitraverse(applicativeEither)((() => {
      const $02 = bitraverse((x2) => {
        const $03 = x2 === "" ? [] : split("/")(x2);
        if ($03.length === 2 && $03[0] === "" && $03[1] === "") {
          return $Either("Right", [""]);
        }
        return traverse2((str2) => {
          const v = _decodeURIComponent((v2) => Nothing, Just, str2);
          if (v.tag === "Nothing") {
            return $Either("Left", $RouteError("MalformedURIComponent", str2));
          }
          if (v.tag === "Just") {
            return $Either("Right", v._1);
          }
          fail();
        })($03);
      })((() => {
        const $03 = traverse2((() => {
          const $04 = bitraverse((str2) => {
            const v = _decodeURIComponent((v2) => Nothing, Just, str2);
            if (v.tag === "Nothing") {
              return $Either("Left", $RouteError("MalformedURIComponent", str2));
            }
            if (v.tag === "Just") {
              return $Either("Right", v._1);
            }
            fail();
          })((str2) => {
            const v = _decodeURIComponent((v2) => Nothing, Just, str2);
            if (v.tag === "Nothing") {
              return $Either("Left", $RouteError("MalformedURIComponent", str2));
            }
            if (v.tag === "Just") {
              return $Either("Right", v._1);
            }
            fail();
          });
          return (x2) => $04((() => {
            const v = indexOf("=")(x2);
            if (v.tag === "Just") {
              return $Tuple(take(v._1)(x2), drop(v._1 + length("=") | 0)(x2));
            }
            if (v.tag === "Nothing") {
              return $Tuple(x2, "");
            }
            fail();
          })());
        })());
        return (x2) => $03(x2 === "" ? [] : split("&")(x2));
      })());
      return (x2) => $02((() => {
        const v = indexOf("?")(x2);
        if (v.tag === "Just") {
          return $Tuple(take(v._1)(x2), drop(v._1 + length("?") | 0)(x2));
        }
        if (v.tag === "Nothing") {
          return $Tuple(x2, "");
        }
        fail();
      })());
    })())(Right);
    return (x2) => {
      const v = indexOf("#")(x2);
      const $1 = $0((() => {
        if (v.tag === "Just") {
          return $Tuple(take(v._1)(x2), drop(v._1 + length("#") | 0)(x2));
        }
        if (v.tag === "Nothing") {
          return $Tuple(x2, "");
        }
        fail();
      })());
      if ($1.tag === "Left") {
        return $Either("Left", $1._1);
      }
      if ($1.tag === "Right") {
        return $Either("Right", { segments: $1._1._1._1, params: $1._1._1._2, hash: $1._1._2 });
      }
      fail();
    };
  })();
  var functorRouteParser = {
    map: (f2) => (m2) => {
      if (m2.tag === "Alt") {
        return $RouteParser("Alt", arrayMap(functorRouteParser.map(f2))(m2._1));
      }
      if (m2.tag === "Chomp") {
        return $RouteParser(
          "Chomp",
          (x2) => {
            const $0 = m2._1(x2);
            if ($0.tag === "Fail") {
              return $RouteResult("Fail", $0._1);
            }
            if ($0.tag === "Success") {
              return $RouteResult("Success", $0._1, f2($0._2));
            }
            fail();
          }
        );
      }
      if (m2.tag === "Prefix") {
        return $RouteParser("Prefix", m2._1, functorRouteParser.map(f2)(m2._2));
      }
      fail();
    }
  };
  var end = /* @__PURE__ */ $RouteParser(
    "Chomp",
    (state) => {
      if (0 < state.segments.length) {
        return $RouteResult("Fail", $RouteError("ExpectedEndOfPath", state.segments[0]));
      }
      return $RouteResult("Success", state, void 0);
    }
  );
  var chompPrefix = (pre) => (state) => {
    if (0 < state.segments.length) {
      if (pre === state.segments[0]) {
        return $RouteResult("Success", { ...state, segments: sliceImpl(1, state.segments.length, state.segments) }, void 0);
      }
      return $RouteResult("Fail", $RouteError("Expected", pre, state.segments[0]));
    }
    return $RouteResult("Fail", EndOfPath);
  };
  var runRouteParser$lazy = /* @__PURE__ */ binding(() => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const state = go$a0, v = go$a1;
        if (v.tag === "Alt") {
          go$c = false;
          go$r = foldlArray((v1) => (v2) => {
            if (v1.tag === "Fail") {
              return runRouteParser$lazy()(state)(v2);
            }
            return v1;
          })($RouteResult("Fail", EndOfPath))(v._1);
          continue;
        }
        if (v.tag === "Chomp") {
          go$c = false;
          go$r = v._1(state);
          continue;
        }
        if (v.tag === "Prefix") {
          const v1 = chompPrefix(v._1)(state);
          if (v1.tag === "Fail") {
            go$c = false;
            go$r = $RouteResult("Fail", v1._1);
            continue;
          }
          if (v1.tag === "Success") {
            go$a0 = v1._1;
            go$a1 = v._2;
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  });
  var runRouteParser = /* @__PURE__ */ runRouteParser$lazy();
  var run2 = (p2) => (a2) => {
    const $0 = parsePath(a2);
    if ($0.tag === "Left") {
      return $Either("Left", $0._1);
    }
    if ($0.tag === "Right") {
      const $1 = runRouteParser($0._1)(p2);
      if ($1.tag === "Fail") {
        return $Either("Left", $1._1);
      }
      if ($1.tag === "Success") {
        return $Either("Right", $1._2);
      }
    }
    fail();
  };
  var applyRouteParser = {
    apply: (fx) => (x2) => $RouteParser(
      "Chomp",
      (state) => {
        const v = runRouteParser(state)(fx);
        if (v.tag === "Fail") {
          return $RouteResult("Fail", v._1);
        }
        if (v.tag === "Success") {
          const $0 = runRouteParser(v._1)(x2);
          if ($0.tag === "Fail") {
            return $RouteResult("Fail", $0._1);
          }
          if ($0.tag === "Success") {
            return $RouteResult("Success", $0._1, v._2($0._2));
          }
        }
        fail();
      }
    ),
    Functor0: () => functorRouteParser
  };
  var altSnoc = (v) => (v1) => {
    if (v1.tag === "Prefix") {
      const $0 = last(v);
      const $1 = (() => {
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })();
      if ($1.tag === "Prefix" && v1._1 === $1._1) {
        return snoc2((() => {
          if (v.length === 0) {
            fail();
          }
          return sliceImpl(0, v.length - 1 | 0, v);
        })())($RouteParser("Prefix", v1._1, altRouteParser.alt($1._2)(v1._2)));
      }
    }
    return snoc2(v)(v1);
  };
  var altRouteParser = {
    alt: (v) => (v1) => {
      if (v.tag === "Alt") {
        if (v1.tag === "Alt") {
          return $RouteParser("Alt", altAppend(v._1)(v1._1));
        }
        return $RouteParser("Alt", altSnoc(v._1)(v1));
      }
      if (v1.tag === "Alt") {
        return $RouteParser("Alt", altCons(v)(v1._1));
      }
      if (v.tag === "Prefix" && v1.tag === "Prefix" && v._1 === v1._1) {
        return $RouteParser("Prefix", v._1, altRouteParser.alt(v._2)(v1._2));
      }
      return $RouteParser("Alt", [v, v1]);
    },
    Functor0: () => functorRouteParser
  };
  var altCons = (v) => (v1) => {
    if (v.tag === "Prefix") {
      const $0 = (() => {
        if (0 < v1.length) {
          return v1[0];
        }
        fail();
      })();
      if ($0.tag === "Prefix" && v._1 === $0._1) {
        const $1 = unconsImpl((v$1) => Nothing, (v$1) => (xs) => $Maybe("Just", xs), v1);
        return [
          $RouteParser("Prefix", v._1, altRouteParser.alt(v._2)($0._2)),
          ...(() => {
            if ($1.tag === "Just") {
              return $1._1;
            }
            fail();
          })()
        ];
      }
    }
    return [v, ...v1];
  };
  var altAppend = (ls) => (rs) => {
    const $0 = last(ls);
    const $1 = (() => {
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })();
    if ($1.tag === "Prefix") {
      const $2 = (() => {
        if (0 < rs.length) {
          return rs[0];
        }
        fail();
      })();
      if ($2.tag === "Prefix" && $1._1 === $2._1) {
        const $3 = unconsImpl((v) => Nothing, (v) => (xs) => $Maybe("Just", xs), rs);
        const rs$p = [
          $RouteParser("Prefix", $1._1, altRouteParser.alt($1._2)($2._2)),
          ...(() => {
            if ($3.tag === "Just") {
              return $3._1;
            }
            fail();
          })()
        ];
        const $4 = (() => {
          if (ls.length === 0) {
            fail();
          }
          return sliceImpl(0, ls.length - 1 | 0, ls);
        })();
        if ($4.length > 0) {
          return altAppend($4)(rs$p);
        }
        return rs$p;
      }
    }
    return [...ls, ...rs];
  };

  // output-es/Routing.Duplex.Types/index.js
  var emptyRouteState = { segments: [], params: [], hash: "" };

  // output-es/Routing.Duplex.Printer/index.js
  var semigroupRoutePrinter = { append: (v) => (v1) => (x2) => v1(v(x2)) };
  var put = (str2) => (state) => ({ ...state, segments: snoc2(state.segments)(str2) });
  var printPath = (v) => (v.segments.length === 1 && v.segments[0] === "" ? "/" : joinWith("/")(mapMaybe(encodeURIComponent2)(v.segments))) + (v.params.length === 0 ? "" : "?" + joinWith("&")(mapMaybe((v$1) => {
    if (v$1._2 === "") {
      return _encodeURIComponent((v$2) => Nothing, Just, v$1._1);
    }
    const $0 = _encodeURIComponent((v$2) => Nothing, Just, v$1._1);
    const $1 = _encodeURIComponent((v$2) => Nothing, Just, v$1._2);
    const $2 = (() => {
      if ($1.tag === "Nothing") {
        return $Maybe("Just", "=");
      }
      if ($1.tag === "Just") {
        return $Maybe("Just", "=" + $1._1);
      }
      fail();
    })();
    if ($0.tag === "Nothing") {
      return $2;
    }
    if ($2.tag === "Nothing") {
      return $0;
    }
    if ($0.tag === "Just" && $2.tag === "Just") {
      return $Maybe("Just", $0._1 + $2._1);
    }
    fail();
  })(v.params))) + (v.hash === "" ? "" : "#" + v.hash);
  var monoidRoutePRinter = { mempty: (x2) => x2, Semigroup0: () => semigroupRoutePrinter };

  // output-es/Routing.Duplex/index.js
  var $RouteDuplex = (_1, _2) => ({ tag: "RouteDuplex", _1, _2 });
  var RouteDuplex = (value0) => (value1) => $RouteDuplex(value0, value1);
  var profunctorRouteDuplex = { dimap: (f2) => (g2) => (v) => $RouteDuplex((x2) => v._1(f2(x2)), functorRouteParser.map(g2)(v._2)) };
  var prefix = (s2) => (v) => $RouteDuplex(
    (a2) => {
      const $0 = v._1(a2);
      return (x2) => $0({ ...x2, segments: snoc2(x2.segments)(s2) });
    },
    $RouteParser("Prefix", s2, v._2)
  );
  var path = /* @__PURE__ */ (() => {
    const $0 = foldrArray(prefix);
    const $1 = split("/");
    return (x2) => {
      const $2 = $1(x2);
      return (a2) => $0(a2)($2);
    };
  })();
  var root = /* @__PURE__ */ path("");
  var parse3 = (v) => run2(v._2);
  var functorRouteDuplex = { map: (f2) => (m2) => $RouteDuplex(m2._1, functorRouteParser.map(f2)(m2._2)) };
  var end2 = (v) => $RouteDuplex(
    v._1,
    applyRouteParser.apply(functorRouteParser.map($$const)(v._2))(end)
  );
  var applyRouteDuplex = {
    apply: (v) => (v1) => $RouteDuplex(
      (x2) => {
        const $0 = v._1(x2);
        const $1 = v1._1(x2);
        return (x$1) => $1($0(x$1));
      },
      applyRouteParser.apply(v._2)(v1._2)
    ),
    Functor0: () => functorRouteDuplex
  };
  var applicativeRouteDuplex = {
    pure: /* @__PURE__ */ (() => {
      const $0 = RouteDuplex((v) => monoidRoutePRinter.mempty);
      return (x2) => $0($RouteParser("Chomp", (a2) => $RouteResult("Success", a2, x2)));
    })(),
    Apply0: () => applyRouteDuplex
  };

  // output-es/Routing.Duplex.Generic/index.js
  var identity15 = (x2) => x2;
  var noArgs = /* @__PURE__ */ (() => applicativeRouteDuplex.pure(NoArguments))();
  var gRouteProduct = { gRouteDuplexCtr: identity15 };
  var gRouteNoArguments = { gRouteDuplexCtr: identity15 };
  var product2 = (dictGRouteDuplexCtr) => (v) => (l2) => {
    const v1 = dictGRouteDuplexCtr.gRouteDuplexCtr(l2);
    return $RouteDuplex(
      (v2) => {
        const $0 = v._1(v2._1);
        const $1 = v1._1(v2._2);
        return (x2) => $1($0(x2));
      },
      applyRouteParser.apply(functorRouteParser.map(Product)(functorRouteParser.map(Argument)(v._2)))(v1._2)
    );
  };
  var gRouteSum = (dictGRouteDuplex) => (dictGRouteDuplex1) => ({
    gRouteDuplex: (end$p) => (r2) => {
      const v = dictGRouteDuplex.gRouteDuplex(end$p)(r2);
      const v1 = dictGRouteDuplex1.gRouteDuplex(end$p)(r2);
      return $RouteDuplex(
        (v2) => {
          if (v2.tag === "Inl") {
            return v._1(v2._1);
          }
          if (v2.tag === "Inr") {
            return v1._1(v2._1);
          }
          fail();
        },
        altRouteParser.alt(functorRouteParser.map(Inl)(v._2))(functorRouteParser.map(Inr)(v1._2))
      );
    }
  });
  var sum2 = (dictGeneric) => {
    const from = dictGeneric.from;
    const to = dictGeneric.to;
    return (dictGRouteDuplex) => {
      const $0 = dictGRouteDuplex.gRouteDuplex(end2);
      return (x2) => profunctorRouteDuplex.dimap(from)(to)($0(x2));
    };
  };
  var gRouteConstructor = (dictIsSymbol) => () => (dictGRouteDuplexCtr) => ({
    gRouteDuplex: (end$p) => (r2) => {
      const v = end$p(dictGRouteDuplexCtr.gRouteDuplexCtr(unsafeGet(dictIsSymbol.reflectSymbol($$Proxy))(r2)));
      return $RouteDuplex((v1) => v._1(v1), functorRouteParser.map(Constructor)(v._2));
    }
  });
  var gRouteAll = { gRouteDuplexCtr: (v) => $RouteDuplex((v1) => v._1(v1), functorRouteParser.map(Argument)(v._2)) };

  // output-es/Web.HTML.Location/foreign.js
  function hash3(location3) {
    return function() {
      return location3.hash;
    };
  }
  function setHash(hash4) {
    return function(location3) {
      return function() {
        location3.hash = hash4;
      };
    };
  }

  // output-es/Routing.Hash/index.js
  var setHash2 = (h2) => {
    const $0 = setHash(h2);
    return () => {
      const $1 = windowImpl();
      const $2 = location($1)();
      return $0($2)();
    };
  };
  var getHash = () => {
    const $0 = windowImpl();
    const $1 = location($0)();
    const a$p = hash3($1)();
    const $2 = stripPrefix("#")(a$p);
    if ($2.tag === "Nothing") {
      return "";
    }
    if ($2.tag === "Just") {
      return $2._1;
    }
    fail();
  };
  var foldHashes = (cb) => (init) => () => {
    const $0 = getHash();
    const $1 = init($0)();
    let ref = $1;
    const win = windowImpl();
    const listener = eventListener((v) => () => {
      const a$p = ref;
      const a$p$1 = getHash();
      const $2 = cb(a$p)(a$p$1)();
      return ref = $2;
    })();
    addEventListener2("hashchange")(listener)(false)(win)();
    return removeEventListener2("hashchange")(listener)(false)(win);
  };
  var matchesWith = (dictFoldable) => (parser) => (cb) => {
    const go = (a2) => {
      const $0 = indexl(dictFoldable)(0);
      return (x2) => {
        const $1 = $0(parser(x2));
        if ($1.tag === "Nothing") {
          return () => a2;
        }
        if ($1.tag === "Just") {
          const $2 = $1._1;
          const $3 = cb(a2)($2);
          return () => {
            $3();
            return $Maybe("Just", $2);
          };
        }
        fail();
      };
    };
    return foldHashes(($0) => go($0))(go(Nothing));
  };

  // output-es/Capability.Navigate/index.js
  var $Route = (tag, _1, _2) => ({ tag, _1, _2 });
  var Home = /* @__PURE__ */ $Route("Home");
  var About = /* @__PURE__ */ $Route("About");
  var Instructions = /* @__PURE__ */ $Route("Instructions");
  var LevelSelect = /* @__PURE__ */ $Route("LevelSelect");
  var genericRoute_ = {
    to: (x2) => {
      if (x2.tag === "Inl") {
        return Home;
      }
      if (x2.tag === "Inr") {
        if (x2._1.tag === "Inl") {
          return About;
        }
        if (x2._1.tag === "Inr") {
          if (x2._1._1.tag === "Inl") {
            return Instructions;
          }
          if (x2._1._1.tag === "Inr") {
            if (x2._1._1._1.tag === "Inl") {
              return LevelSelect;
            }
            if (x2._1._1._1.tag === "Inr") {
              return $Route("Level", x2._1._1._1._1._1, x2._1._1._1._1._2);
            }
          }
        }
      }
      fail();
    },
    from: (x2) => {
      if (x2.tag === "Home") {
        return $Sum("Inl", NoArguments);
      }
      if (x2.tag === "About") {
        return $Sum("Inr", $Sum("Inl", NoArguments));
      }
      if (x2.tag === "Instructions") {
        return $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments)));
      }
      if (x2.tag === "LevelSelect") {
        return $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments))));
      }
      if (x2.tag === "Level") {
        return $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inr", $Product(x2._1, x2._2)))));
      }
      fail();
    }
  };
  var underscoreSegment = /* @__PURE__ */ (() => profunctorRouteDuplex.dimap(replaceAll(" ")("_"))(replaceAll("_")(" "))($RouteDuplex(
    put,
    take3
  )))();
  var routeCodec = /* @__PURE__ */ root(/* @__PURE__ */ sum2(genericRoute_)(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: () => "Home"
  })()(gRouteNoArguments))(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: () => "About"
  })()(gRouteNoArguments))(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: () => "Instructions"
  })()(gRouteNoArguments))(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: () => "LevelSelect"
  })()(gRouteNoArguments))(/* @__PURE__ */ gRouteConstructor({ reflectSymbol: () => "Level" })()(gRouteProduct))))))({
    Home: noArgs,
    About: /* @__PURE__ */ prefix("about")(noArgs),
    Instructions: /* @__PURE__ */ prefix("how-to-play")(noArgs),
    LevelSelect: /* @__PURE__ */ prefix("level-select")(noArgs),
    Level: /* @__PURE__ */ prefix("level")(/* @__PURE__ */ product2(gRouteAll)(underscoreSegment)(underscoreSegment))
  }));
  var navigateTo = (dictMonadEffect) => (route) => dictMonadEffect.liftEffect(setHash2(printPath(routeCodec._1(route)(emptyRouteState))));

  // output-es/Unsafe.Reference/foreign.js
  function reallyUnsafeRefEq(a2) {
    return function(b) {
      return a2 === b;
    };
  }

  // output-es/Halogen.Subscription/index.js
  var traverse_3 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_1 = /* @__PURE__ */ traverse_3(foldableArray);
  var unsubscribe = (v) => v;
  var create = () => {
    let subscribers = [];
    return {
      emitter: (k) => () => {
        const $0 = subscribers;
        subscribers = [...$0, k];
        return () => {
          const $1 = subscribers;
          subscribers = deleteBy2(reallyUnsafeRefEq)(k)($1);
        };
      },
      listener: (a2) => {
        const $0 = traverse_1((k) => k(a2));
        return () => {
          const $1 = subscribers;
          return $0($1)();
        };
      }
    };
  };

  // output-es/Component.Title/index.js
  var value = /* @__PURE__ */ Property("value");
  var intercalate3 = /* @__PURE__ */ intercalate1(monoidString);
  var abedTitleText = [
    "    :::     :::::::::  :::::::::: ::::::::: ",
    "  :+: :+:   :+:    :+: :+:        :+:    :+:",
    " +:+   +:+  +:+    +:+ +:+        +:+    +:+",
    "+#++:++#++: +#++:++#+  +#++:++#   +#+    +:+",
    "+#+     +#+ +#+    +#+ +#+        +#+    +#+",
    "#+#     #+# #+#    #+# #+#        #+#    #+#",
    "###     ### #########  ########## ######### "
  ];
  var makeTitle = (titleText) => $VDom(
    "Elem",
    Nothing,
    "textarea",
    [
      id("title"),
      value(titleText),
      readOnly(true),
      cols(toCodePointArray(abedTitleText[0]).length - 4 | 0),
      rows(7)
    ],
    []
  );
  var html = /* @__PURE__ */ makeTitle(/* @__PURE__ */ intercalate3("\n")(abedTitleText));

  // output-es/Component.Layout.DefaultLayout/index.js
  var defaultLayoutHome = (inner) => $VDom(
    "Elem",
    Nothing,
    "div",
    [id("default-layout")],
    [html, $VDom("Elem", Nothing, "br", [], []), $VDom("Elem", Nothing, "div", [], [inner])]
  );
  var defaultLayout = (inner) => $VDom(
    "Elem",
    Nothing,
    "div",
    [id("default-layout")],
    [
      html,
      $VDom("Elem", Nothing, "br", [], []),
      $VDom("Elem", Nothing, "div", [], [inner]),
      $VDom("Elem", Nothing, "a", [href("#/")], [$VDom("Text", "<< Back to home")])
    ]
  );

  // output-es/Component.About/index.js
  var $Action = () => ({ tag: "DeleteProgress" });
  var DeleteProgress = /* @__PURE__ */ $Action();
  var component = (dictMonadAff) => ({
    eval: mkEval({
      ...defaultEval,
      handleAction: (v1) => monadEffectHalogenM(dictMonadAff.MonadEffect0()).liftEffect((() => {
        const $0 = confirm("Really delete all progress?");
        return () => {
          const $1 = windowImpl();
          const confirmDelete = $0($1)();
          if (confirmDelete) {
            return deleteProgress();
          }
        };
      })())
    }),
    initialState: (v) => ({}),
    render: (state) => defaultLayout($VDom(
      "Elem",
      Nothing,
      "div",
      [class_("about-component")],
      [
        $VDom("Elem", Nothing, "h1", [], [$VDom("Text", "About")]),
        $VDom("Elem", Nothing, "h2", [], [$VDom("Text", "This game created by Mitch Stevens")]),
        $VDom("Elem", Nothing, "br", [], []),
        $VDom("Text", "email me at "),
        $VDom("Elem", Nothing, "b", [], [$VDom("Text", "mitchstevens 95 at gmail dot com")]),
        $VDom("Elem", Nothing, "br", [], []),
        $VDom("Text", "Source Code: "),
        $VDom(
          "Elem",
          Nothing,
          "a",
          [href("github.com/MitchStevens/abed-ps")],
          [$VDom("Text", "https://github.com/MitchStevens/abed-ps")]
        ),
        $VDom("Elem", Nothing, "br", [], []),
        $VDom(
          "Elem",
          Nothing,
          "button",
          [$Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", DeleteProgress)))],
          [$VDom("Text", "Delete all progress")]
        )
      ]
    ))
  });

  // output-es/Halogen.HTML.Extras/index.js
  var navigationLink = (text) => (route) => $VDom(
    "Elem",
    Nothing,
    "a",
    [
      class_("link"),
      href("#" + printPath(routeCodec._1(route)(emptyRouteState)))
    ],
    [$VDom("Text", text)]
  );

  // output-es/Component.Home/index.js
  var component2 = (dictMonadAff) => ({
    eval: mkEval(defaultEval),
    initialState: (v) => ({ titleText: "" }),
    render: (v) => defaultLayoutHome($VDom(
      "Elem",
      Nothing,
      "div",
      [id("home-component")],
      [
        navigationLink("Choose a level")(LevelSelect),
        $VDom("Elem", Nothing, "br", [], []),
        navigationLink("How to play")(Instructions),
        $VDom("Elem", Nothing, "br", [], []),
        navigationLink("About")(About)
      ]
    ))
  });

  // output-es/Component.Instructions/index.js
  var $Action2 = (_1) => ({ tag: "NavigateTo", _1 });
  var component3 = (dictMonadAff) => {
    const navigateTo2 = navigateTo(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    return {
      eval: mkEval({ ...defaultEval, handleAction: (v1) => navigateTo2(v1._1) }),
      initialState: (v) => ({}),
      render: (state) => defaultLayout($VDom(
        "Elem",
        Nothing,
        "div",
        [],
        [
          $VDom("Elem", Nothing, "h1", [], [$VDom("Text", "How to play")]),
          $VDom("Elem", Nothing, "h2", [], [$VDom("Text", "UNDER CONSTRUCTION!")]),
          $VDom(
            "Elem",
            Nothing,
            "a",
            [
              $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $Action2(About)))),
              class_("link")
            ],
            [$VDom("Text", "About")]
          )
        ]
      ))
    };
  };

  // output-es/Capability.Animate/index.js
  var headShake = (dictMonadAff) => {
    const MonadEffect0 = dictMonadAff.MonadEffect0();
    const Monad0 = MonadEffect0.Monad0();
    const Bind1 = Monad0.Bind1();
    const for_9 = for_(Monad0.Applicative0())(foldableMaybe);
    return (selector) => Bind1.bind(MonadEffect0.liftEffect(() => {
      const $0 = windowImpl();
      return document2($0)();
    }))((htmlDocument) => Bind1.bind(MonadEffect0.liftEffect(querySelector(selector)(htmlDocument)))((maybeElement) => for_9(maybeElement)((element) => Bind1.bind(MonadEffect0.liftEffect(classList(element)))((tokenList) => Bind1.bind(MonadEffect0.liftEffect(add(tokenList)("head-shake")))(() => Bind1.bind(dictMonadAff.liftAff(_delay(
      Right,
      1e3
    )))(() => MonadEffect0.liftEffect(remove(tokenList)("head-shake"))))))));
  };

  // output-es/Halogen.Query.Event/index.js
  var traverse_4 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var eventListener2 = (eventType) => (target2) => (f2) => (push2) => {
    const $0 = eventListener((ev) => traverse_4(push2)(f2(ev)));
    return () => {
      const listener = $0();
      addEventListener2(eventType)(listener)(false)(target2)();
      return removeEventListener2(eventType)(listener)(false)(target2);
    };
  };

  // output-es/Capability.GlobalEventEmmiters/index.js
  var globalMouseMoveEventEmitter = () => {
    const $0 = windowImpl();
    const htmlDocument = document2($0)();
    return eventListener2("mousemove")(htmlDocument)(unsafeReadProtoTagged("MouseEvent"));
  };
  var globalKeyDownEventEmitter = () => {
    const $0 = windowImpl();
    const htmlDocument = document2($0)();
    return eventListener2("keydown")(htmlDocument)(unsafeReadProtoTagged("KeyboardEvent"));
  };

  // output-es/Data.Zipper/index.js
  var $Zipper = (_1, _2, _3) => ({ tag: "Zipper", _1, _2, _3 });
  var moveRight = (v) => {
    if (v._3.tag === "Nil") {
      return Nothing;
    }
    if (v._3.tag === "Cons") {
      return $Maybe("Just", $Zipper($List("Cons", v._2, v._1), v._3._1, v._3._2));
    }
    fail();
  };
  var moveLeft = (v) => {
    if (v._1.tag === "Nil") {
      return Nothing;
    }
    if (v._1.tag === "Cons") {
      return $Maybe("Just", $Zipper(v._1._2, v._1._1, $List("Cons", v._2, v._3)));
    }
    fail();
  };

  // output-es/Component.Board.Types/index.js
  var $Action3 = (tag, _1, _2) => ({ tag, _1, _2 });
  var $Output = (_1) => ({ tag: "NewBoardState", _1 });
  var $Query = (tag, _1, _2) => ({ tag, _1, _2 });
  var prop3 = /* @__PURE__ */ prop({ reflectSymbol: () => "inputs" })()();
  var getBoardPortEdge2 = /* @__PURE__ */ getBoardPortEdge(/* @__PURE__ */ monadStateStateT(monadIdentity));
  var GetBoard = (value0) => $Query("GetBoard", value0);
  var GetMouseOverLocation = (value0) => $Query("GetMouseOverLocation", value0);
  var SetInputs = (value0) => (value1) => $Query("SetInputs", value0, value1);
  var IncrementBoardSize = (value0) => $Query("IncrementBoardSize", value0);
  var DecrementBoardSize = (value0) => $Query("DecrementBoardSize", value0);
  var Initialise = /* @__PURE__ */ $Action3("Initialise");
  var PieceOutput = (value0) => $Action3("PieceOutput", value0);
  var MultimeterOutput = (value0) => $Action3("MultimeterOutput", value0);
  var Undo = /* @__PURE__ */ $Action3("Undo");
  var Redo = /* @__PURE__ */ $Action3("Redo");
  var EvaluateBoard = /* @__PURE__ */ $Action3("EvaluateBoard");
  var UpdatePieceComponents = /* @__PURE__ */ $Action3("UpdatePieceComponents");
  var LocationOnMouseDown = (value0) => (value1) => $Action3("LocationOnMouseDown", value0, value1);
  var LocationOnMouseOver = (value0) => (value1) => $Action3("LocationOnMouseOver", value0, value1);
  var LocationOnMouseUp = (value0) => (value1) => $Action3("LocationOnMouseUp", value0, value1);
  var LocationOnDragEnter = (value0) => (value1) => $Action3("LocationOnDragEnter", value0, value1);
  var LocationOnDragOver = (value0) => (value1) => $Action3("LocationOnDragOver", value0, value1);
  var LocationOnDrop = (value0) => (value1) => $Action3("LocationOnDrop", value0, value1);
  var BoardPortOnMouseLeave = /* @__PURE__ */ $Action3("BoardPortOnMouseLeave");
  var initialState = (v) => ({
    boardHistory: $Zipper(Nil, v.board, Nil),
    boardPorts: Leaf2,
    inputs: Leaf2,
    outputs: Leaf2,
    lastEvalWithPortInfo: Leaf2,
    isCreatingWire: Nothing,
    isMouseOverLocation: Nothing,
    isMouseOverBoardPort: Nothing
  });
  var _wireLocations = (dictWander) => {
    const Strong0 = dictWander.Strong0();
    const $0 = _Just(dictWander.Choice1());
    return (x2) => prop({ reflectSymbol: () => "isCreatingWire" })()()($$Proxy)(Strong0)($0(prop({ reflectSymbol: () => "locations" })()()($$Proxy)(Strong0)(x2)));
  };
  var _inputs = (dictStrong) => prop3($$Proxy)(dictStrong);
  var _board = (dictStrong) => (x2) => prop({ reflectSymbol: () => "boardHistory" })()()($$Proxy)(dictStrong)(dictStrong.Profunctor0().dimap((s2) => $Tuple(
    s2._2,
    (b) => $Zipper(s2._1, b, s2._3)
  ))((v) => v._2(v._1))(dictStrong.first(x2)));
  var boardPortInfo = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const $0 = Monad0.Bind1();
    const $1 = traversableWithIndexMap.traverseWithIndex(Monad0.Applicative0());
    return $0.bind(dictMonadState.state((s2) => $Tuple(s2.boardPorts, s2)))((boardPorts) => $0.bind(dictMonadState.state((s2) => $Tuple(
      _board(strongForget)(identity14)(s2),
      s2
    )))((board2) => $1((dir2) => (port2) => {
      const $2 = lookup(ordRelativeEdge)(getBoardPortEdge2(dir2)(board2)._1);
      return dictMonadState.state((s2) => $Tuple(
        (() => {
          const $3 = $2(s2.lastEvalWithPortInfo);
          if ($3.tag === "Nothing") {
            return { connected: false, port: port2, signal: 0 };
          }
          if ($3.tag === "Just") {
            return $3._1;
          }
          fail();
        })(),
        s2
      ));
    })(boardPorts)));
  };
  var liftBoardM = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Bind1 = Monad0.Bind1();
    const Applicative0 = Monad0.Applicative0();
    const for_9 = for_(Applicative0)(foldableEither);
    const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
    });
    return (boardM) => Bind1.bind(Bind1.Apply0().Functor0().map((b) => boardM(b))(dictMonadState.state((s2) => $Tuple(
      _board(strongForget)(identity14)(s2),
      s2
    ))))((eitherBoard) => Bind1.bind(for_9(eitherBoard)((v) => {
      const $0 = v._2;
      return $$void((() => {
        const $1 = _board(strongFn)((v$1) => $0);
        return dictMonadState.state((s2) => {
          const s$p = $1(s2);
          return $Tuple(s$p, s$p);
        });
      })());
    }))(() => Applicative0.pure(eitherBoard)));
  };

  // output-es/Halogen.Svg.Attributes.Color/index.js
  var $Color2 = (tag, _1, _2, _3, _4) => ({ tag, _1, _2, _3, _4 });
  var printColor = (v) => {
    if (v.tag === "RGB") {
      return "rgb(" + showIntImpl(v._1) + "," + showIntImpl(v._2) + "," + showIntImpl(v._3) + ")";
    }
    if (v.tag === "RGBA") {
      return "rgba(" + showIntImpl(v._1) + "," + showIntImpl(v._2) + "," + showIntImpl(v._3) + "," + showNumberImpl(v._4) + ")";
    }
    if (v.tag === "Named") {
      return v._1;
    }
    if (v.tag === "NoColor") {
      return "None";
    }
    fail();
  };

  // output-es/Halogen.Svg.Attributes.Transform/index.js
  var $Transform = (tag, _1, _2, _3, _4, _5, _6) => ({ tag, _1, _2, _3, _4, _5, _6 });
  var printTransform = (v) => {
    if (v.tag === "Matrix") {
      return "matrix(" + showNumberImpl(v._1) + "," + showNumberImpl(v._2) + "," + showNumberImpl(v._3) + "," + showNumberImpl(v._4) + "," + showNumberImpl(v._5) + "," + showNumberImpl(v._6) + ")";
    }
    if (v.tag === "Translate") {
      return "translate(" + showNumberImpl(v._1) + "," + showNumberImpl(v._2) + ")";
    }
    if (v.tag === "Scale") {
      return "scale(" + showNumberImpl(v._1) + "," + showNumberImpl(v._2) + ")";
    }
    if (v.tag === "Rotate") {
      return "rotate(" + showNumberImpl(v._1) + "," + showNumberImpl(v._2) + "," + showNumberImpl(v._3) + ")";
    }
    if (v.tag === "SkewX") {
      return "skewX(" + showNumberImpl(v._1) + ")";
    }
    if (v.tag === "SkewY") {
      return "skewY(" + showNumberImpl(v._1) + ")";
    }
    fail();
  };

  // output-es/Halogen.Svg.Attributes/index.js
  var y = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("y");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var x = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("x");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var width = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("width");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var viewBox = (x_) => (y_) => (w) => (h_) => $Prop(
    "Attribute",
    Nothing,
    "viewBox",
    joinWith(" ")(arrayMap(showNumberImpl)([x_, y_, w, h_]))
  );
  var transform = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("transform");
    const $1 = joinWith(" ");
    const $2 = arrayMap(printTransform);
    return (x$1) => $0($1($2(x$1)));
  })();
  var stroke = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("stroke");
    return (x$1) => $0(printColor(x$1));
  })();
  var stopOpacity = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("stop-opacity");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var stopColor = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("stop-color");
    return (x$1) => $0(printColor(x$1));
  })();
  var offset = /* @__PURE__ */ Attribute(Nothing)("offset");
  var id3 = /* @__PURE__ */ Attribute(Nothing)("id");
  var href3 = /* @__PURE__ */ Attribute(Nothing)("href");
  var height = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("height");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var gradientTransform = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("gradientTransform");
    const $1 = joinWith(" ");
    const $2 = arrayMap(printTransform);
    return (x$1) => $0($1($2(x$1)));
  })();
  var fill = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("fill");
    return (x$1) => $0(printColor(x$1));
  })();
  var dominantBaseline = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("dominant-baseline");
    return (x$1) => $0((() => {
      if (x$1 === "Auto") {
        return "auto";
      }
      if (x$1 === "UseScript") {
        return "use-script";
      }
      if (x$1 === "NoChange") {
        return "no-change";
      }
      if (x$1 === "ResetSize") {
        return "reset-size";
      }
      if (x$1 === "Ideographic") {
        return "ideographic";
      }
      if (x$1 === "Alphabetic") {
        return "alphabetic";
      }
      if (x$1 === "Hanging") {
        return "hanging";
      }
      if (x$1 === "Mathematical") {
        return "mathematical";
      }
      if (x$1 === "Central") {
        return "central";
      }
      if (x$1 === "BaselineMiddle") {
        return "middle";
      }
      if (x$1 === "TextAfterEdge") {
        return "text-after-edge";
      }
      if (x$1 === "TextBeforeEdge") {
        return "text-before-edge";
      }
      fail();
    })());
  })();
  var d2 = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("d");
    const $1 = joinWith(" ");
    return (x$1) => $0($1(x$1));
  })();
  var class_2 = /* @__PURE__ */ Attribute(Nothing)("class");

  // output-es/Halogen.Svg.Attributes.Baseline/index.js
  var $Baseline = (tag) => tag;
  var Hanging = /* @__PURE__ */ $Baseline("Hanging");

  // output-es/Web.UIEvent.KeyboardEvent/foreign.js
  function key(e2) {
    return e2.key;
  }
  function ctrlKey(e2) {
    return e2.ctrlKey;
  }

  // output-es/Web.UIEvent.MouseEvent/foreign.js
  function clientX(e2) {
    return e2.clientX;
  }
  function clientY(e2) {
    return e2.clientY;
  }
  function pageX(e2) {
    return e2.pageX;
  }
  function pageY(e2) {
    return e2.pageY;
  }

  // output-es/Component.Multimeter/index.js
  var $Action4 = (tag, _1) => ({ tag, _1 });
  var $Output2 = (_1, _2) => ({ tag: "SetCapacity", _1, _2 });
  var $Query2 = (tag, _1) => ({ tag, _1 });
  var power2 = /* @__PURE__ */ power(monoidString);
  var foldMap3 = /* @__PURE__ */ (() => foldableArray.foldMap(monoidString))();
  var enumFromTo2 = /* @__PURE__ */ enumFromTo(enumInt)(unfoldable1Array);
  var modify_ = (f2) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s2) => $Tuple(void 0, f2(s2))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var gets = (f2) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s2) => $Tuple(f2(s2), s2)),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var for_4 = /* @__PURE__ */ for_(freeApplicative)(foldableMaybe);
  var show1 = (v) => {
    if (v.tag === "Just") {
      return (v._1.info.connected ? "(Just { info: { connected: true, port: " : "(Just { info: { connected: false, port: ") + showPort.show(v._1.info.port) + ", signal: " + showSignal.show(v._1.info.signal) + " }, relativeEdge: " + showRelativeEdge.show(v._1.relativeEdge) + " })";
    }
    if (v.tag === "Nothing") {
      return "Nothing";
    }
    fail();
  };
  var traverse_5 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var Initialise2 = /* @__PURE__ */ $Action4("Initialise");
  var multimeterTextValues = (info2) => [
    (() => {
      const $0 = foldMap3((b) => {
        if (b) {
          return "1";
        }
        return "0";
      })((() => {
        const $02 = info2.signal;
        return arrayMap((n2) => ($02 >> n2 & 1) !== 0)(enumFromTo2((() => {
          const $1 = portCapacity(info2.port);
          if ($1 === "OneBit") {
            return 0;
          }
          if ($1 === "TwoBit") {
            return 1;
          }
          if ($1 === "FourBit") {
            return 3;
          }
          if ($1 === "EightBit") {
            return 7;
          }
          fail();
        })())(0));
      })());
      return power2(" ")(8 - toCodePointArray($0).length | 0) + $0;
    })(),
    (() => {
      const $0 = showIntImpl(info2.signal);
      return power2("0")(3 - toCodePointArray($0).length | 0) + $0;
    })(),
    showIntImpl((() => {
      const $0 = portCapacity(info2.port);
      if ($0 === "OneBit") {
        return 1;
      }
      if ($0 === "TwoBit") {
        return 2;
      }
      if ($0 === "FourBit") {
        return 4;
      }
      if ($0 === "EightBit") {
        return 8;
      }
      fail();
    })()) + "bit",
    info2.connected ? "true" : "fals"
  ];
  var defaultValues = ["--------", "---", "----", "----"];
  var multimeterText = /* @__PURE__ */ (() => {
    const $0 = zipWith2(apply)([
      (() => {
        const $02 = "BIN" + power2(" ")(5);
        return ($1) => $02 + $1;
      })(),
      (() => {
        const $02 = "DEC" + power2(" ")(10);
        return ($1) => $02 + $1;
      })(),
      ($02) => "Capacity:   " + $02,
      ($02) => "Connected:  " + $02
    ]);
    return (x2) => $0((() => {
      if (x2.tag === "Nothing") {
        return defaultValues;
      }
      if (x2.tag === "Just") {
        return multimeterTextValues(x2._1);
      }
      fail();
    })());
  })();
  var component4 = (dictMonadEffect) => {
    const monadEffectHalogenM2 = monadEffectHalogenM(dictMonadEffect);
    return {
      eval: mkEval({
        ...defaultEval,
        initialize: $Maybe("Just", Initialise2),
        handleAction: (v1) => {
          if (v1.tag === "Initialise") {
            const $0 = monadEffectHalogenM2.liftEffect(globalMouseMoveEventEmitter);
            return $Free(
              $0._1,
              snoc($0._2)((mouseMoveEmitter) => $Free(
                $FreeView(
                  "Bind",
                  $HalogenF("Subscribe", (v) => (k) => mouseMoveEmitter((x2) => k($Action4("GlobalMouseMove", x2))), identity11),
                  (x2) => $Free($FreeView("Return", x2), CatNil)
                ),
                snoc(snoc(CatNil)((x2) => $Free($FreeView("Return", void 0), CatNil)))(() => {
                  const $1 = monadEffectHalogenM2.liftEffect(globalKeyDownEventEmitter);
                  return $Free(
                    $1._1,
                    snoc($1._2)((keyDownEmitter) => $Free(
                      $FreeView(
                        "Bind",
                        $HalogenF("Subscribe", (v) => (k) => keyDownEmitter((x2) => k($Action4("GlobalKeyDown", x2))), identity11),
                        (x2) => $Free($FreeView("Return", x2), CatNil)
                      ),
                      snoc(CatNil)((x2) => $Free($FreeView("Return", void 0), CatNil))
                    ))
                  );
                })
              ))
            );
          }
          if (v1.tag === "GlobalMouseMove") {
            const $0 = v1._1;
            const $1 = modify_((v2) => ({ ...v2, currentPosition: { x: pageX($0), y: pageY($0) } }));
            return $Free(
              $1._1,
              snoc($1._2)(() => $Free($FreeView("Return", void 0), CatNil))
            );
          }
          if (v1.tag === "GlobalKeyDown") {
            const $0 = modify_((s2) => ({ ...s2, display: !s2.display }));
            if (key(v1._1) === "s") {
              return $Free(
                $0._1,
                snoc($0._2)(() => {
                  const $1 = gets((v2) => v2.focus);
                  const $2 = $Free(
                    $1._1,
                    snoc($1._2)((maybeFocus) => for_4(maybeFocus)((v2) => {
                      const v3 = key(v1._1);
                      if (v3 === "1") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output2(v2.relativeEdge, OneBit), void 0),
                            (x2) => $Free($FreeView("Return", x2), CatNil)
                          ),
                          CatNil
                        );
                      }
                      if (v3 === "2") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output2(v2.relativeEdge, TwoBit), void 0),
                            (x2) => $Free($FreeView("Return", x2), CatNil)
                          ),
                          CatNil
                        );
                      }
                      if (v3 === "3") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output2(v2.relativeEdge, FourBit), void 0),
                            (x2) => $Free($FreeView("Return", x2), CatNil)
                          ),
                          CatNil
                        );
                      }
                      if (v3 === "4") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output2(v2.relativeEdge, EightBit), void 0),
                            (x2) => $Free($FreeView("Return", x2), CatNil)
                          ),
                          CatNil
                        );
                      }
                      return $Free($FreeView("Return", void 0), CatNil);
                    }))
                  );
                  if (elem(eqString)(key(v1._1))(["1", "2", "3", "4"])) {
                    return $2;
                  }
                  return $Free($FreeView("Return", void 0), CatNil);
                })
              );
            }
            return $Free(
              $FreeView("Return", void 0),
              snoc(CatNil)(() => {
                const $1 = gets((v2) => v2.focus);
                const $2 = $Free(
                  $1._1,
                  snoc($1._2)((maybeFocus) => for_4(maybeFocus)((v2) => {
                    const v3 = key(v1._1);
                    if (v3 === "1") {
                      return $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF("Raise", $Output2(v2.relativeEdge, OneBit), void 0),
                          (x2) => $Free($FreeView("Return", x2), CatNil)
                        ),
                        CatNil
                      );
                    }
                    if (v3 === "2") {
                      return $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF("Raise", $Output2(v2.relativeEdge, TwoBit), void 0),
                          (x2) => $Free($FreeView("Return", x2), CatNil)
                        ),
                        CatNil
                      );
                    }
                    if (v3 === "3") {
                      return $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF("Raise", $Output2(v2.relativeEdge, FourBit), void 0),
                          (x2) => $Free($FreeView("Return", x2), CatNil)
                        ),
                        CatNil
                      );
                    }
                    if (v3 === "4") {
                      return $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF("Raise", $Output2(v2.relativeEdge, EightBit), void 0),
                          (x2) => $Free($FreeView("Return", x2), CatNil)
                        ),
                        CatNil
                      );
                    }
                    return $Free($FreeView("Return", void 0), CatNil);
                  }))
                );
                if (elem(eqString)(key(v1._1))(["1", "2", "3", "4"])) {
                  return $2;
                }
                return $Free($FreeView("Return", void 0), CatNil);
              })
            );
          }
          fail();
        },
        handleQuery: (v1) => {
          if (v1.tag === "NewFocus") {
            const $0 = v1._1;
            const $1 = modify_((v2) => ({ ...v2, focus: $0 }));
            return $Free(
              $1._1,
              snoc($1._2)(() => {
                const $2 = monadEffectHalogenM2.liftEffect(log2(show1($0)));
                return $Free(
                  $2._1,
                  snoc($2._2)(() => $Free($FreeView("Return", Nothing), CatNil))
                );
              })
            );
          }
          if (v1.tag === "SetSignal") {
            const $0 = v1._1;
            const $1 = gets((v2) => v2.focus);
            return $Free(
              $1._1,
              snoc(snoc($1._2)(traverse_5((focus2) => modify_((v2) => ({ ...v2, focus: $Maybe("Just", { ...focus2, info: { ...focus2.info, signal: $0 } }) })))))(() => $Free($FreeView("Return", Nothing), CatNil))
            );
          }
          fail();
        }
      }),
      initialState: (v) => ({ focus: Nothing, display: false, currentPosition: { x: 0, y: 0 } }),
      render: (state) => $VDom(
        "Elem",
        Nothing,
        "div",
        [
          id("multimeter"),
          classes(state.display ? ["display"] : ["hide"]),
          style("left: " + showIntImpl(state.currentPosition.x) + "px; top: " + showIntImpl(state.currentPosition.y) + "px;")
        ],
        [
          $VDom(
            "Elem",
            $Maybe("Just", "http://www.w3.org/2000/svg"),
            "svg",
            [viewBox(0)(0)(400)(400)],
            [
              $VDom(
                "Elem",
                $Maybe("Just", "http://www.w3.org/2000/svg"),
                "g",
                [],
                [
                  $VDom(
                    "Elem",
                    $Maybe("Just", "http://www.w3.org/2000/svg"),
                    "g",
                    [],
                    [
                      $VDom(
                        "Elem",
                        $Maybe("Just", "http://www.w3.org/2000/svg"),
                        "rect",
                        [id3("screen-border"), height(190), width(340)],
                        []
                      ),
                      $VDom(
                        "Elem",
                        $Maybe("Just", "http://www.w3.org/2000/svg"),
                        "g",
                        [transform([$Transform("Translate", 35, 12.5)])],
                        [
                          $VDom(
                            "Elem",
                            $Maybe("Just", "http://www.w3.org/2000/svg"),
                            "rect",
                            [
                              id3("screen-background"),
                              fill($Color2("RGB", 138, 248, 91)),
                              height(165),
                              width(270)
                            ],
                            []
                          ),
                          $VDom(
                            "Elem",
                            $Maybe("Just", "http://www.w3.org/2000/svg"),
                            "g",
                            [],
                            zipWithImpl(
                              (textYPosition) => (line) => $VDom(
                                "Elem",
                                $Maybe("Just", "http://www.w3.org/2000/svg"),
                                "text",
                                [
                                  stroke($Color2("Named", "black")),
                                  x(10),
                                  y(textYPosition),
                                  dominantBaseline(Hanging)
                                ],
                                [$VDom("Text", line)]
                              ),
                              arrayMap((i2) => 10 + i2 * 40)([0, 1, 2, 3]),
                              multimeterText(state.focus.tag === "Just" ? $Maybe("Just", state.focus._1.info) : Nothing)
                            )
                          )
                        ]
                      )
                    ]
                  )
                ]
              )
            ]
          )
        ]
      )
    };
  };

  // output-es/Component.Piece.Types/index.js
  var $Action5 = (tag, _1, _2) => ({ tag, _1, _2 });
  var $Output3 = (tag, _1, _2) => ({ tag, _1, _2 });
  var $Query3 = (tag, _1) => ({ tag, _1 });
  var OnDrop = (value0) => (value1) => $Action5("OnDrop", value0, value1);
  var OnMouseUp = (value0) => (value1) => $Action5("OnMouseUp", value0, value1);
  var PortOnMouseLeave = /* @__PURE__ */ $Action5("PortOnMouseLeave");
  var initialState2 = (v) => ({
    piece: v.piece,
    location: v.location,
    rotation: intMod(0)(4),
    isRotating: Nothing,
    isDragging: false,
    portStates: functorMap.map((port2) => ({ port: port2, signal: 0, connected: false }))(v.piece.ports)
  });

  // output-es/Component.Rendering.Path/index.js
  var renderPathWithEvents = (v) => (onMouseEnter) => (onMouseLeave) => $VDom(
    "Elem",
    $Maybe("Just", "http://www.w3.org/2000/svg"),
    "g",
    [],
    [
      $VDom("Elem", $Maybe("Just", "http://www.w3.org/2000/svg"), "defs", [], [v.gradient.def]),
      $VDom(
        "Elem",
        $Maybe("Just", "http://www.w3.org/2000/svg"),
        "path",
        [
          d2(v.path),
          v.attrs,
          $Prop("Attribute", Nothing, "fill", "url('#" + v.gradient.id + "')"),
          $Prop("Handler", "mouseenter", (ev) => $Maybe("Just", $Input("Action", onMouseEnter))),
          $Prop("Handler", "mouseleave", (ev) => $Maybe("Just", $Input("Action", onMouseLeave)))
        ],
        []
      )
    ]
  );
  var renderPath = (v) => $VDom(
    "Elem",
    $Maybe("Just", "http://www.w3.org/2000/svg"),
    "g",
    [],
    [
      $VDom("Elem", $Maybe("Just", "http://www.w3.org/2000/svg"), "defs", [], [v.gradient.def]),
      $VDom(
        "Elem",
        $Maybe("Just", "http://www.w3.org/2000/svg"),
        "path",
        [d2(v.path), v.attrs, $Prop("Attribute", Nothing, "fill", "url('#" + v.gradient.id + "')")],
        []
      )
    ]
  );

  // output-es/Component.Rendering.Gradient/index.js
  var clamp = (low) => (hi) => (x2) => {
    const v = ordInt.compare(low)(x2);
    const $0 = (() => {
      if (v === "LT") {
        return x2;
      }
      if (v === "EQ") {
        return low;
      }
      if (v === "GT") {
        return low;
      }
      fail();
    })();
    const v$1 = ordInt.compare(hi)($0);
    if (v$1 === "LT") {
      return hi;
    }
    if (v$1 === "EQ") {
      return hi;
    }
    if (v$1 === "GT") {
      return $0;
    }
    fail();
  };
  var identity16 = (x2) => x2;
  var intercalate4 = (sep) => (xs) => foldlArray((v) => (v1) => {
    if (v.init) {
      return { init: false, acc: v1 };
    }
    return { init: false, acc: v.acc + sep + v1 };
  })({ init: true, acc: "" })(xs).acc;
  var shadeColor = (percentage) => (v) => {
    if (v.tag === "RGB") {
      return $Color2(
        "RGB",
        clamp(0)(255)(intDiv(v._1 * (100 + percentage | 0) | 0, 100)),
        clamp(0)(255)(intDiv(v._2 * (100 + percentage | 0) | 0, 100)),
        clamp(0)(255)(intDiv(v._3 * (100 + percentage | 0) | 0, 100))
      );
    }
    if (v.tag === "RGBA") {
      return $Color2(
        "RGBA",
        clamp(0)(255)(intDiv(v._1 * (100 + percentage | 0) | 0, 100)),
        clamp(0)(255)(intDiv(v._2 * (100 + percentage | 0) | 0, 100)),
        clamp(0)(255)(intDiv(v._3 * (100 + percentage | 0) | 0, 100)),
        v._4
      );
    }
    return v;
  };
  var portColor = (port2) => (signal) => (signal === 0 ? shadeColor(-30) : identity16)((() => {
    const v = portCapacity(port2);
    if (v === "OneBit") {
      return $Color2("RGB", 117, 242, 191);
    }
    if (v === "TwoBit") {
      return $Color2("RGB", 120, 204, 250);
    }
    if (v === "FourBit") {
      return $Color2("RGB", 208, 135, 221);
    }
    if (v === "EightBit") {
      return $Color2("RGB", 228, 100, 156);
    }
    fail();
  })());
  var createPortGradient = (v) => {
    const color = portColor(v.port)(v.signal);
    const id4 = intercalate4("-")([
      "port-gradient",
      isInput(v.port) ? "in" : "out",
      v.signal === 0 ? "off" : "on",
      showIntImpl((() => {
        const $0 = portCapacity(v.port);
        if ($0 === "OneBit") {
          return 1;
        }
        if ($0 === "TwoBit") {
          return 2;
        }
        if ($0 === "FourBit") {
          return 4;
        }
        if ($0 === "EightBit") {
          return 8;
        }
        fail();
      })()) + "bit"
    ]);
    return {
      id: id4,
      def: (() => {
        const v1 = portType(v.port);
        return $VDom(
          "Elem",
          $Maybe("Just", "http://www.w3.org/2000/svg"),
          "linearGradient",
          [id3(id4), gradientTransform([$Transform("Rotate", 90, 0, 0)])],
          (() => {
            if (v1 === "Input") {
              return [
                $VDom(
                  "Elem",
                  $Maybe("Just", "http://www.w3.org/2000/svg"),
                  "stop",
                  [offset("5%"), stopColor(color), stopOpacity(0.5)],
                  []
                ),
                $VDom(
                  "Elem",
                  $Maybe("Just", "http://www.w3.org/2000/svg"),
                  "stop",
                  [offset("95%"), stopColor(color)],
                  []
                )
              ];
            }
            if (v1 === "Output") {
              return [
                $VDom(
                  "Elem",
                  $Maybe("Just", "http://www.w3.org/2000/svg"),
                  "stop",
                  [offset("5%"), stopColor(color), stopOpacity(0.5)],
                  []
                ),
                $VDom(
                  "Elem",
                  $Maybe("Just", "http://www.w3.org/2000/svg"),
                  "stop",
                  [offset("95%"), stopColor(color), stopOpacity(0)],
                  []
                )
              ];
            }
            fail();
          })()
        );
      })()
    };
  };

  // output-es/Halogen.Svg.Attributes.Path/index.js
  var $CommandPositionReference = (tag) => tag;
  var Rel = /* @__PURE__ */ $CommandPositionReference("Rel");
  var renderCommand2Args = (s_) => (ref) => (a_) => (b) => (() => {
    if (ref === "Rel") {
      return s_;
    }
    if (ref === "Abs") {
      return toUpper(s_);
    }
    fail();
  })() + showNumberImpl(a_) + ", " + showNumberImpl(b);
  var renderCommand4Args = (s_) => (ref) => (a_) => (b) => (c_) => (d_) => (() => {
    if (ref === "Rel") {
      return s_;
    }
    if (ref === "Abs") {
      return toUpper(s_);
    }
    fail();
  })() + showNumberImpl(a_) + ", " + showNumberImpl(b) + ", " + showNumberImpl(c_) + ", " + showNumberImpl(d_);

  // output-es/Component.Rendering.Wire/index.js
  var sub1 = /* @__PURE__ */ (() => ringTuple(ringNumber)(ringNumber).sub)();
  var tell = /* @__PURE__ */ (() => monadTellWriterT(monoidArray)(monadIdentity).tell)();
  var applicativeWriterT3 = /* @__PURE__ */ applicativeWriterT(monoidArray)(applicativeIdentity);
  var for_5 = /* @__PURE__ */ for_(applicativeWriterT3)(foldableMaybe);
  var toUnfoldable4 = /* @__PURE__ */ (() => {
    const $0 = unfoldableArray.unfoldr(stepUnfoldr);
    return (x2) => $0($MapIter("IterNode", x2, IterLeaf));
  })();
  var traverse_6 = /* @__PURE__ */ traverse_(applicativeWriterT3)(foldableArray);
  var show = /* @__PURE__ */ (() => showMap(showCardinalDirection)({
    show: (record) => (record.connected ? "{ connected: true, port: " : "{ connected: false, port: ") + showPort.show(record.port) + ", signal: " + showSignal.show(record.signal) + " }"
  }).show)();
  var stubPath = (v) => {
    if (v === "Up") {
      return [
        renderCommand2Args("l")(Rel)(0)(-25),
        renderCommand2Args("l")(Rel)(30)(0),
        renderCommand2Args("l")(Rel)(0)(25)
      ];
    }
    if (v === "Right") {
      return [
        renderCommand2Args("l")(Rel)(25)(0),
        renderCommand2Args("l")(Rel)(0)(30),
        renderCommand2Args("l")(Rel)(-25)(0)
      ];
    }
    if (v === "Down") {
      return [
        renderCommand2Args("l")(Rel)(0)(25),
        renderCommand2Args("l")(Rel)(-30)(0),
        renderCommand2Args("l")(Rel)(0)(-25)
      ];
    }
    if (v === "Left") {
      return [
        renderCommand2Args("l")(Rel)(-25)(0),
        renderCommand2Args("l")(Rel)(0)(-30),
        renderCommand2Args("l")(Rel)(25)(0)
      ];
    }
    fail();
  };
  var betweenPath = (to) => (from) => {
    const v = sub1((() => {
      if (from === "Up") {
        return $Tuple(35, 25);
      }
      if (from === "Right") {
        return $Tuple(75, 35);
      }
      if (from === "Down") {
        return $Tuple(65, 75);
      }
      if (from === "Left") {
        return $Tuple(25, 65);
      }
      fail();
    })())((() => {
      if (to === "Up") {
        return $Tuple(65, 25);
      }
      if (to === "Right") {
        return $Tuple(75, 65);
      }
      if (to === "Down") {
        return $Tuple(35, 75);
      }
      if (to === "Left") {
        return $Tuple(25, 35);
      }
      fail();
    })());
    if (from === "Up") {
      return [renderCommand4Args("q")(Rel)(v._1)(0)(v._1)(v._2)];
    }
    if (from === "Right") {
      return [renderCommand4Args("q")(Rel)(0)(v._2)(v._1)(v._2)];
    }
    if (from === "Down") {
      return [renderCommand4Args("q")(Rel)(v._1)(0)(v._1)(v._2)];
    }
    if (from === "Left") {
      return [renderCommand4Args("q")(Rel)(0)(v._2)(v._1)(v._2)];
    }
    fail();
  };
  var arrowPath = (v) => {
    if (v === "Up") {
      return [
        renderCommand2Args("l")(Rel)(0)(-13),
        renderCommand2Args("l")(Rel)(-10)(0),
        renderCommand2Args("l")(Rel)(25)(-12),
        renderCommand2Args("l")(Rel)(25)(12),
        renderCommand2Args("l")(Rel)(-10)(0),
        renderCommand2Args("l")(Rel)(0)(13)
      ];
    }
    if (v === "Right") {
      return [
        renderCommand2Args("l")(Rel)(13)(0),
        renderCommand2Args("l")(Rel)(0)(-10),
        renderCommand2Args("l")(Rel)(12)(25),
        renderCommand2Args("l")(Rel)(-12)(25),
        renderCommand2Args("l")(Rel)(0)(-10),
        renderCommand2Args("l")(Rel)(-13)(0)
      ];
    }
    if (v === "Down") {
      return [
        renderCommand2Args("l")(Rel)(0)(13),
        renderCommand2Args("l")(Rel)(10)(0),
        renderCommand2Args("l")(Rel)(-25)(12),
        renderCommand2Args("l")(Rel)(-25)(-12),
        renderCommand2Args("l")(Rel)(10)(0),
        renderCommand2Args("l")(Rel)(0)(-13)
      ];
    }
    if (v === "Left") {
      return [
        renderCommand2Args("l")(Rel)(-13)(0),
        renderCommand2Args("l")(Rel)(0)(10),
        renderCommand2Args("l")(Rel)(-12)(-25),
        renderCommand2Args("l")(Rel)(12)(-25),
        renderCommand2Args("l")(Rel)(0)(10),
        renderCommand2Args("l")(Rel)(13)(0)
      ];
    }
    fail();
  };
  var wirePath = (ports) => {
    const $0 = find(foldableMap)((portInfo) => isInput(portInfo.port))(ports);
    const info2 = (() => {
      if ($0.tag === "Nothing") {
        return _crashWith("assertion failed: wire path created with no inputs. ports: " + show(ports));
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })();
    return {
      path: for_5(unconsImpl((v) => Nothing, (x2) => (xs) => $Maybe("Just", { head: x2, tail: xs }), toUnfoldable4(ports)))((v) => {
        if (v.head._1 === "Up") {
          return bindWriterT(semigroupArray)(bindIdentity).bind(tell([
            renderCommand2Args("m")(Rel)(35)(25)
          ]))(() => traverse_6((v$1) => tell([
            ...(() => {
              if (isInput(v$1._1._2.port)) {
                return stubPath(v$1._1._1);
              }
              if (v$1._1._2.connected) {
                return stubPath(v$1._1._1);
              }
              return arrowPath(v$1._1._1);
            })(),
            ...betweenPath(v$1._1._1)(v$1._2)
          ]))(zipWithImpl(Tuple, toUnfoldable4(ports), arrayMap(fst)([...v.tail, v.head]))));
        }
        if (v.head._1 === "Right") {
          return bindWriterT(semigroupArray)(bindIdentity).bind(tell([
            renderCommand2Args("m")(Rel)(75)(35)
          ]))(() => traverse_6((v$1) => tell([
            ...(() => {
              if (isInput(v$1._1._2.port)) {
                return stubPath(v$1._1._1);
              }
              if (v$1._1._2.connected) {
                return stubPath(v$1._1._1);
              }
              return arrowPath(v$1._1._1);
            })(),
            ...betweenPath(v$1._1._1)(v$1._2)
          ]))(zipWithImpl(Tuple, toUnfoldable4(ports), arrayMap(fst)([...v.tail, v.head]))));
        }
        if (v.head._1 === "Down") {
          return bindWriterT(semigroupArray)(bindIdentity).bind(tell([
            renderCommand2Args("m")(Rel)(65)(75)
          ]))(() => traverse_6((v$1) => tell([
            ...(() => {
              if (isInput(v$1._1._2.port)) {
                return stubPath(v$1._1._1);
              }
              if (v$1._1._2.connected) {
                return stubPath(v$1._1._1);
              }
              return arrowPath(v$1._1._1);
            })(),
            ...betweenPath(v$1._1._1)(v$1._2)
          ]))(zipWithImpl(Tuple, toUnfoldable4(ports), arrayMap(fst)([...v.tail, v.head]))));
        }
        if (v.head._1 === "Left") {
          return bindWriterT(semigroupArray)(bindIdentity).bind(tell([
            renderCommand2Args("m")(Rel)(25)(65)
          ]))(() => traverse_6((v$1) => tell([
            ...(() => {
              if (isInput(v$1._1._2.port)) {
                return stubPath(v$1._1._1);
              }
              if (v$1._1._2.connected) {
                return stubPath(v$1._1._1);
              }
              return arrowPath(v$1._1._1);
            })(),
            ...betweenPath(v$1._1._1)(v$1._2)
          ]))(zipWithImpl(Tuple, toUnfoldable4(ports), arrayMap(fst)([...v.tail, v.head]))));
        }
        fail();
      })._2,
      gradient: createPortGradient(info2),
      attrs: $Prop(
        "Attribute",
        Nothing,
        isConnected.attrName,
        isConnected.attrPrint(info2.connected)
      )
    };
  };
  var renderWire = (portStates) => renderPathWithEvents(wirePath(portStates))($Action5(
    "PortOnMouseEnter",
    (() => {
      const $0 = findWithIndex(foldableWithIndexMap)((v) => (info2) => isInput(info2.port))(portStates);
      if ($0.tag === "Nothing") {
        return _crashWith("assertion failed: wire path created with no inputs. ports: " + show(portStates));
      }
      if ($0.tag === "Just") {
        return $0._1.index;
      }
      fail();
    })()
  ))(PortOnMouseLeave);

  // output-es/Component.Rendering.CrossOver/index.js
  var elem2 = /* @__PURE__ */ (() => {
    const any1 = foldableArray.foldMap((() => {
      const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
      return { mempty: false, Semigroup0: () => semigroupDisj1 };
    })());
    return (x2) => any1((y2) => {
      if (x2 === "Up") {
        return y2 === "Up";
      }
      if (x2 === "Right") {
        return y2 === "Right";
      }
      if (x2 === "Down") {
        return y2 === "Down";
      }
      return x2 === "Left" && y2 === "Left";
    });
  })();
  var renderDualInputDualOutputPiece = (v) => (v1) => (portStates) => {
    const $0 = v._2;
    const $1 = v1._2;
    const $2 = v._1;
    const $3 = v1._1;
    return $VDom(
      "Elem",
      $Maybe("Just", "http://www.w3.org/2000/svg"),
      "g",
      [],
      [
        renderPathWithEvents(wirePath(filterKeys(ordCardinalDirection)((v2) => elem2(v2)([
          $2,
          $0
        ]))(portStates)))($Action5("PortOnMouseEnter", $0))(PortOnMouseLeave),
        renderPathWithEvents(wirePath(filterKeys(ordCardinalDirection)((v2) => elem2(v2)([
          $3,
          $1
        ]))(portStates)))($Action5("PortOnMouseEnter", $1))(PortOnMouseLeave)
      ]
    );
  };

  // output-es/Component.Rendering.Port/index.js
  var portPath = (info2) => {
    if (portType(info2.port) === "Input") {
      return {
        path: [
          renderCommand2Args("m")(Rel)(40)(0),
          ...(() => {
            const v2 = portType(info2.port);
            if (v2 === "Input") {
              return arrowPath(Down);
            }
            if (v2 === "Output") {
              if (info2.connected) {
                return stubPath(Up);
              }
              return arrowPath(Up);
            }
            fail();
          })(),
          ...betweenPath(Up)(Up)
        ],
        gradient: createPortGradient(info2),
        attrs: $Prop(
          "Attribute",
          Nothing,
          isConnected.attrName,
          isConnected.attrPrint(info2.connected)
        )
      };
    }
    return {
      path: [
        renderCommand2Args("m")(Rel)(10)(25),
        ...(() => {
          const v2 = portType(info2.port);
          if (v2 === "Input") {
            return arrowPath(Down);
          }
          if (v2 === "Output") {
            if (info2.connected) {
              return stubPath(Up);
            }
            return arrowPath(Up);
          }
          fail();
        })(),
        ...betweenPath(Up)(Up)
      ],
      gradient: createPortGradient(info2),
      attrs: $Prop(
        "Attribute",
        Nothing,
        isConnected.attrName,
        isConnected.attrPrint(info2.connected)
      )
    };
  };

  // output-es/Component.Rendering.Piece/index.js
  var renderDefaultPiece = (state) => $VDom(
    "Elem",
    $Maybe("Just", "http://www.w3.org/2000/svg"),
    "g",
    [],
    [
      ...arrayBind(allDirections)((dir2) => [
        $VDom(
          "Elem",
          $Maybe("Just", "http://www.w3.org/2000/svg"),
          "g",
          [
            transform([
              $Transform(
                "Rotate",
                toNumber(clockwiseRotation(Up)(dir2)) * 90,
                50,
                50
              ),
              $Transform("Translate", 25, 0)
            ])
          ],
          arrayBind(fromFoldableImpl(
            foldableMaybe.foldr,
            lookup(ordCardinalDirection)(dir2)(state.portStates)
          ))((portInfo) => [
            renderPathWithEvents(portPath(portInfo))($Action5("PortOnMouseEnter", dir2))(PortOnMouseLeave)
          ])
        )
      ]),
      $VDom(
        "Elem",
        $Maybe("Just", "http://www.w3.org/2000/svg"),
        "g",
        [transform([$Transform("Translate", 30, 30)])],
        [
          $VDom(
            "Elem",
            $Maybe("Just", "http://www.w3.org/2000/svg"),
            "svg",
            [width(50), height(50)],
            [
              $VDom(
                "Elem",
                $Maybe("Just", "http://www.w3.org/2000/svg"),
                "image",
                [href3("./images/" + state.piece.name + ".png"), width(40), height(40)],
                []
              )
            ]
          )
        ]
      )
    ]
  );
  var renderPiece = (state) => $VDom(
    "Elem",
    $Maybe("Just", "http://www.w3.org/2000/svg"),
    "svg",
    [viewBox(0)(0)(100)(100)],
    [
      $VDom(
        "Elem",
        $Maybe("Just", "http://www.w3.org/2000/svg"),
        "g",
        [
          transform([
            $Transform(
              "Rotate",
              (() => {
                const $0 = toNumber(state.rotation) * 90;
                if (state.isRotating.tag === "Nothing") {
                  return $0;
                }
                if (state.isRotating.tag === "Just") {
                  return 57.29577951308232 * state.isRotating._1.currentRotation;
                }
                fail();
              })(),
              50,
              50
            )
          ])
        ],
        [
          (() => {
            if (isWirePiece(state.piece)) {
              return renderWire(state.portStates);
            }
            if (state.piece.name === crossPiece.name) {
              return renderDualInputDualOutputPiece($Tuple(Left2, Right2))($Tuple(
                Up,
                Down
              ))(state.portStates);
            }
            if (state.piece.name === cornerCutPiece.name) {
              return renderDualInputDualOutputPiece($Tuple(Left2, Down))($Tuple(
                Up,
                Right2
              ))(state.portStates);
            }
            if (state.piece.name === chickenPiece.name) {
              return renderDualInputDualOutputPiece($Tuple(Left2, Down))($Tuple(
                Right2,
                Up
              ))(state.portStates);
            }
            return renderDefaultPiece(state);
          })()
        ]
      )
    ]
  );

  // output-es/Halogen.Properties.Extras/index.js
  var contentEditable = /* @__PURE__ */ Property("contentEditable");

  // output-es/Web.HTML.HTMLElement/foreign.js
  function _read(nothing, just, value2) {
    var tag = Object.prototype.toString.call(value2);
    if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
      return just(value2);
    } else {
      return nothing;
    }
  }
  function setDraggable(draggable3) {
    return function(elt) {
      return function() {
        elt.draggable = draggable3;
      };
    };
  }

  // output-es/Halogen.Query/index.js
  var identity17 = (x2) => x2;
  var tell2 = () => (dictIsSymbol) => (dictOrd) => {
    const query2 = query()(dictIsSymbol)(dictOrd);
    return (slot3) => (label) => (req2) => {
      const $0 = query2(slot3)(label)(req2());
      return $Free($0._1, snoc($0._2)((x2) => $Free($FreeView("Return", void 0), CatNil)));
    };
  };
  var request = () => (dictIsSymbol) => (dictOrd) => {
    const query2 = query()(dictIsSymbol)(dictOrd);
    return (slot3) => (label) => (req2) => query2(slot3)(label)(req2(identity17));
  };
  var getHTMLElementRef = /* @__PURE__ */ (() => {
    const $0 = freeFunctor.map((v) => {
      if (v.tag === "Just") {
        return _read(Nothing, Just, v._1);
      }
      if (v.tag === "Nothing") {
        return Nothing;
      }
      fail();
    });
    return (x2) => $0($Free(
      $FreeView(
        "Bind",
        $HalogenF("GetRef", x2, identity11),
        (x$1) => $Free($FreeView("Return", x$1), CatNil)
      ),
      CatNil
    ));
  })();

  // output-es/Component.Piece/index.js
  var modify_2 = (f2) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s2) => $Tuple(void 0, f2(s2))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var traverse_7 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var sub12 = /* @__PURE__ */ (() => ringTuple(ringNumber)(ringNumber).sub)();
  var gets2 = (f2) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s2) => $Tuple(f2(s2), s2)),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var angleBetween = (v1) => (v2) => atan2(v1._1 * v2._2 - v2._1 * v1._2)(v1._1 * v2._1 + v1._2 * v2._2);
  var component5 = (dictMonadEffect) => {
    const $0 = monadEffectHalogenM(dictMonadEffect);
    return {
      eval: mkEval({
        finalize: Nothing,
        handleAction: (v) => {
          if (v.tag === "Initialise") {
            return $Free($FreeView("Return", void 0), CatNil);
          }
          if (v.tag === "OnDrop") {
            const $1 = v._1;
            const $2 = modify_2((v1) => ({ ...v1, isDragging: false }));
            return $Free(
              $2._1,
              snoc($2._2)(() => $Free(
                $FreeView(
                  "Bind",
                  $HalogenF("Raise", $Output3("Dropped", $1), void 0),
                  (x2) => $Free($FreeView("Return", x2), CatNil)
                ),
                CatNil
              ))
            );
          }
          if (v.tag === "OnDrag") {
            const $1 = modify_2((v1) => ({ ...v1, isDragging: true }));
            return $Free(
              $1._1,
              snoc($1._2)(() => $Free($FreeView("Return", void 0), CatNil))
            );
          }
          if (v.tag === "OnMouseDown") {
            const $1 = v._1;
            const $2 = getHTMLElementRef("piece");
            return $Free(
              $2._1,
              snoc($2._2)(traverse_7((he) => {
                const $3 = $0.liftEffect((() => {
                  const $32 = clientWidth(he);
                  return () => {
                    const a$p = $32();
                    return 0.5 * a$p;
                  };
                })());
                return $Free(
                  $3._1,
                  snoc($3._2)((r2) => {
                    const $4 = $0.liftEffect((() => {
                      const $42 = getBoundingClientRect(he);
                      return () => {
                        const bb = $42();
                        return $Tuple((bb.right + bb.left) / 2, (bb.bottom + bb.top) / 2);
                      };
                    })());
                    return $Free(
                      $4._1,
                      snoc($4._2)((c2) => {
                        const v1 = sub12($Tuple(toNumber(clientX($1)), toNumber(clientY($1))))(c2);
                        if (r2 * r2 > v1._1 * v1._1 + v1._2 * v1._2) {
                          return modify_2((v2) => ({ ...v2, isRotating: Nothing }));
                        }
                        const $5 = $0.liftEffect(setDraggable(false)(he));
                        return $Free(
                          $5._1,
                          snoc($5._2)(() => {
                            const $6 = gets2((v2) => v2.rotation);
                            return $Free(
                              $6._1,
                              snoc($6._2)((rotation) => modify_2((v2) => ({
                                ...v2,
                                isRotating: $Maybe(
                                  "Just",
                                  {
                                    initialClickPosition: $Tuple(
                                      toNumber(clientX($1)),
                                      toNumber(clientY($1))
                                    ),
                                    currentRotation: toNumber(rotation) * 1.5707963267948966
                                  }
                                ),
                                isDragging: false
                              })))
                            );
                          })
                        );
                      })
                    );
                  })
                );
              }))
            );
          }
          if (v.tag === "OnMouseMove") {
            const $1 = v._1;
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("GetRef", "piece", identity11),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              snoc(CatNil)(traverse_7((e2) => {
                const $2 = gets2((v1) => v1.isRotating);
                return $Free(
                  $2._1,
                  snoc($2._2)(traverse_7((v1) => {
                    const $3 = v1.initialClickPosition;
                    const $4 = gets2((v2) => v2.rotation);
                    return $Free(
                      $4._1,
                      snoc($4._2)((rotation) => {
                        const p2 = $Tuple(toNumber(clientX($1)), toNumber(clientY($1)));
                        const $5 = $0.liftEffect((() => {
                          const $52 = getBoundingClientRect(e2);
                          return () => {
                            const bb = $52();
                            return $Tuple((bb.right + bb.left) / 2, (bb.bottom + bb.top) / 2);
                          };
                        })());
                        return $Free(
                          $5._1,
                          snoc($5._2)((c2) => {
                            const angle = toNumber(rotation) * 1.5707963267948966 + angleBetween(sub12($3)(c2))(sub12(p2)(c2));
                            return modify_2((v2) => ({ ...v2, isRotating: $Maybe("Just", { initialClickPosition: $3, currentRotation: angle }) }));
                          })
                        );
                      })
                    );
                  }))
                );
              }))
            );
          }
          if (v.tag === "OnMouseUp") {
            const $1 = v._1;
            const $2 = gets2((v1) => v1.isRotating);
            return $Free(
              $2._1,
              snoc($2._2)(traverse_7((v1) => {
                const closestSnapPoint = intMod(unsafeClamp(round(4 * v1.currentRotation / 6.283185307179586)))(4);
                const $3 = gets2((v2) => v2.rotation);
                return $Free(
                  $3._1,
                  snoc($3._2)((rotation) => {
                    const $4 = modify_2((v2) => ({ ...v2, isRotating: Nothing }));
                    return $Free(
                      $4._1,
                      snoc($4._2)(() => $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF(
                            "Raise",
                            $Output3("Rotated", $1, intMod(closestSnapPoint + intMod(-rotation)(4) | 0)(4)),
                            void 0
                          ),
                          (x2) => $Free($FreeView("Return", x2), CatNil)
                        ),
                        CatNil
                      ))
                    );
                  })
                );
              }))
            );
          }
          if (v.tag === "OnKeyDown") {
            const $1 = gets2((v1) => v1.location);
            const $2 = snoc($1._2)((loc) => $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", $Output3("Rotated", loc, intMod(1)(4)), void 0),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              CatNil
            ));
            if (key(v._1) === "r") {
              return $Free(
                $1._1,
                snoc($2)(() => {
                  const $3 = gets2((v1) => v1.location);
                  const $4 = $Free(
                    $3._1,
                    snoc($3._2)((loc) => $Free(
                      $FreeView(
                        "Bind",
                        $HalogenF("Raise", $Output3("Rotated", loc, intMod(3)(4)), void 0),
                        (x2) => $Free($FreeView("Return", x2), CatNil)
                      ),
                      CatNil
                    ))
                  );
                  if (key(v._1) === "R") {
                    return $4;
                  }
                  return $Free($FreeView("Return", void 0), CatNil);
                })
              );
            }
            return $Free(
              $FreeView("Return", void 0),
              snoc(CatNil)(() => {
                const $3 = gets2((v1) => v1.location);
                const $4 = $Free(
                  $3._1,
                  snoc($3._2)((loc) => $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF("Raise", $Output3("Rotated", loc, intMod(3)(4)), void 0),
                      (x2) => $Free($FreeView("Return", x2), CatNil)
                    ),
                    CatNil
                  ))
                );
                if (key(v._1) === "R") {
                  return $4;
                }
                return $Free($FreeView("Return", void 0), CatNil);
              })
            );
          }
          if (v.tag === "PortOnMouseEnter") {
            const $1 = v._1;
            const $2 = gets2((v1) => v1.portStates);
            return $Free(
              $2._1,
              snoc($2._2)((portStates) => {
                const $3 = gets2((v1) => v1.location);
                return $Free(
                  $3._1,
                  snoc($3._2)((loc) => $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF(
                        "Raise",
                        $Output3(
                          "NewMultimeterFocus",
                          (() => {
                            const $4 = lookup(ordCardinalDirection)($1)(portStates);
                            if ($4.tag === "Just") {
                              return $Maybe("Just", { relativeEdge: { loc, dir: $1 }, info: $4._1 });
                            }
                            if ($4.tag === "Nothing") {
                              return Nothing;
                            }
                            fail();
                          })()
                        ),
                        void 0
                      ),
                      (x2) => $Free($FreeView("Return", x2), CatNil)
                    ),
                    CatNil
                  ))
                );
              })
            );
          }
          if (v.tag === "PortOnMouseLeave") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", $Output3("NewMultimeterFocus", Nothing), void 0),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              CatNil
            );
          }
          fail();
        },
        handleQuery: (v) => {
          if (v.tag === "SetPortStates") {
            const $1 = v._1;
            const $2 = modify_2((v1) => ({ ...v1, portStates: $1 }));
            return $Free(
              $2._1,
              snoc($2._2)(() => $Free($FreeView("Return", Nothing), CatNil))
            );
          }
          if (v.tag === "SetPiece") {
            const $1 = v._1;
            const $2 = modify_2((v1) => ({ ...v1, piece: $1 }));
            return $Free(
              $2._1,
              snoc($2._2)(() => $Free($FreeView("Return", Nothing), CatNil))
            );
          }
          if (v.tag === "SetRotation") {
            const $1 = v._1;
            const $2 = modify_2((v1) => ({ ...v1, rotation: $1 }));
            return $Free(
              $2._1,
              snoc($2._2)(() => $Free($FreeView("Return", Nothing), CatNil))
            );
          }
          fail();
        },
        initialize: Nothing,
        receive: (v) => Nothing
      }),
      initialState: initialState2,
      render: (state) => $VDom(
        "Elem",
        Nothing,
        "div",
        [
          classes(["piece-component"]),
          $Prop(
            "Attribute",
            Nothing,
            isDragging.attrName,
            isDragging.attrPrint(state.isDragging)
          ),
          $Prop("Attribute", Nothing, "data-rotation", showIntImpl(state.rotation)),
          $Prop("Attribute", Nothing, "data-piece-id", state.piece.name),
          draggable((() => {
            if (state.isRotating.tag === "Nothing") {
              return true;
            }
            if (state.isRotating.tag === "Just") {
              return false;
            }
            fail();
          })()),
          $Prop(
            "Ref",
            (x2) => $Maybe(
              "Just",
              $Input(
                "RefUpdate",
                "piece",
                (() => {
                  if (x2.tag === "Created") {
                    return $Maybe("Just", x2._1);
                  }
                  if (x2.tag === "Removed") {
                    return Nothing;
                  }
                  fail();
                })()
              )
            )
          ),
          contentEditable(true),
          (() => {
            const $1 = OnDrop(state.location);
            return $Prop("Handler", "dragend", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
          })(),
          $Prop("Handler", "drag", (ev) => $Maybe("Just", $Input("Action", $Action5("OnDrag", ev)))),
          $Prop(
            "Handler",
            "mousedown",
            (ev) => $Maybe("Just", $Input("Action", $Action5("OnMouseDown", ev)))
          ),
          $Prop(
            "Handler",
            "mousemove",
            (ev) => $Maybe("Just", $Input("Action", $Action5("OnMouseMove", ev)))
          ),
          (() => {
            const $1 = OnMouseUp(state.location);
            return $Prop("Handler", "mouseup", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
          })(),
          $Prop(
            "Handler",
            "keydown",
            (ev) => $Maybe("Just", $Input("Action", $Action5("OnKeyDown", ev)))
          )
        ],
        [renderPiece(state)]
      )
    };
  };

  // output-es/Data.Lens.Internal.Wander/index.js
  var wanderFunction = { wander: (t2) => t2(applicativeIdentity), Strong0: () => strongFn, Choice1: () => choiceFn };

  // output-es/Debug/foreign.js
  var req = typeof module === "undefined" ? void 0 : module.require;
  var util = function() {
    try {
      return req === void 0 ? void 0 : req("util");
    } catch (e2) {
      return void 0;
    }
  }();
  var now2 = function() {
    var perf;
    if (typeof performance !== "undefined") {
      perf = performance;
    } else if (req) {
      try {
        perf = req("perf_hooks").performance;
      } catch (e2) {
      }
    }
    return function() {
      return (perf || Date).now();
    };
  }();

  // output-es/Game.Piece/index.js
  var allPieces = [...allConnectionPieces, ...allUnivariatePieces, ...allBivariatePieces];
  var pieceVault = /* @__PURE__ */ fromFoldable(ordPieceId)(foldableArray)(/* @__PURE__ */ arrayMap((v) => $Tuple(
    v.name,
    v
  ))(allPieces));
  var pieceLookup = (pieceId) => {
    const message2 = "piece lookup crash on " + pieceId + "... WITH NO SURVIVORS";
    const $0 = lookup(ordPieceId)(pieceId)(pieceVault);
    if ($0.tag === "Nothing") {
      return _crashWith(message2);
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  };

  // output-es/Game.Board.Operation/index.js
  var _pieces4 = /* @__PURE__ */ _pieces(strongForget);
  var at3 = /* @__PURE__ */ (() => atMap(ordLocation).at)();
  var _pieces13 = /* @__PURE__ */ _pieces(strongFn);
  var ix2 = /* @__PURE__ */ (() => indexMap(ordLocation).ix)();
  var all3 = /* @__PURE__ */ (() => foldableArray.foldMap((() => {
    const semigroupConj1 = { append: (v) => (v1) => v && v1 };
    return { mempty: true, Semigroup0: () => semigroupConj1 };
  })()))();
  var updateRelEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Applicative0 = Monad0.Applicative0();
    const traverse_18 = traverse_(Applicative0)(foldableMaybe);
    const for_9 = for_(Applicative0)(foldableMaybe);
    const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
    });
    return (v) => (portType2) => {
      const $0 = v.dir;
      const $1 = v.loc;
      return Monad0.Bind1().bind((() => {
        const $2 = at3($1)(strongForget);
        return dictMonadState.state((s2) => $Tuple(_pieces4($2(identity14))(s2), s2));
      })())(traverse_18((info2) => for_9(info2.piece.updatePort($0)(portType2))((piece) => $$void((() => {
        const $2 = _pieces13(ix2($1)(strongFn)(choiceFn)(prop({ reflectSymbol: () => "piece" })()()($$Proxy)(strongFn)((v$1) => piece)));
        return dictMonadState.state((s2) => {
          const s$p = $2(s2);
          return $Tuple(s$p, s$p);
        });
      })()))));
    };
  };
  var updatePortsAround = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const for_9 = for_(Monad0.Applicative0())(foldableArray);
    const $0 = Monad0.Bind1();
    const getPortOnEdge2 = getPortOnEdge(dictMonadState);
    const adjacentRelativeEdge2 = adjacentRelativeEdge(dictMonadState);
    const updateRelEdge1 = updateRelEdge(dictMonadState);
    return (loc) => for_9(allDirections)((dir2) => {
      const relEdge = { loc, dir: dir2 };
      return $0.bind(getPortOnEdge2(relEdge))((maybePort) => $0.bind(adjacentRelativeEdge2(relEdge))((relEdge$p) => updateRelEdge1(relEdge$p)(maybePort.tag === "Just" ? $Maybe("Just", portType(maybePort._1)) : Nothing)));
    });
  };
  var movePiece = (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Monad0 = MonadThrow0.Monad0();
    const Bind1 = Monad0.Bind1();
    const $0 = Monad0.Applicative0();
    return (dictMonadState) => {
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      const assign3 = (p2, b) => $$void((() => {
        const $1 = p2((v) => b);
        return dictMonadState.state((s2) => {
          const s$p = $1(s2);
          return $Tuple(s$p, s$p);
        });
      })());
      const updatePortsAround1 = updatePortsAround(dictMonadState);
      return (src) => (dst) => Bind1.bind((() => {
        const $1 = at3(src)(strongForget);
        return dictMonadState.state((s2) => $Tuple(_pieces4($1(identity14))(s2), s2));
      })())((v) => {
        if (v.tag === "Just") {
          const $1 = v._1;
          return Bind1.bind((() => {
            const $2 = MonadThrow0.throwError($BoardError("LocationOccupied", dst));
            return Monad0.Bind1().bind(Bind1.Apply0().Functor0().map(isJust)((() => {
              const $3 = at3(dst)(strongForget);
              return dictMonadState.state((s2) => $Tuple(_pieces4($3(identity14))(s2), s2));
            })()))((b) => {
              if (b) {
                return $2;
              }
              return $0.pure();
            });
          })())(() => Bind1.bind((() => {
            const $2 = at3(src)(strongFn);
            return assign3((x2) => _pieces13($2(x2)), Nothing);
          })())(() => Bind1.bind((() => {
            const $2 = at3(dst)(strongFn);
            return assign3((x2) => _pieces13($2(x2)), $Maybe("Just", $1));
          })())(() => Bind1.bind(updatePortsAround1(src))(() => Bind1.bind(updatePortsAround1(dst))(() => Monad0.Applicative0().pure($1.piece))))));
        }
        if (v.tag === "Nothing") {
          return MonadThrow0.throwError($BoardError("LocationNotOccupied", src));
        }
        fail();
      });
    };
  };
  var increaseSize = (dictMonadState) => {
    const $$get = dictMonadState.state((s2) => $Tuple(s2, s2));
    return (dictMonadError) => {
      const MonadThrow0 = dictMonadError.MonadThrow0();
      const $0 = MonadThrow0.Monad0().Bind1();
      return $0.bind($$get)((v) => {
        const $1 = v.pieces;
        return $0.bind((() => {
          const $2 = v.size + 2 | 0;
          if (($2 & 1) === 0 || $2 < 3 || $2 > 9) {
            return MonadThrow0.throwError($BoardError("BadBoardSize", $2));
          }
          return MonadThrow0.Monad0().Applicative0().pure($2);
        })())((newSize) => {
          const $2 = { size: newSize, pieces: unsafeMapKey((v1) => ({ x: v1.x + 1 | 0, y: v1.y + 1 | 0 }))($1) };
          return dictMonadState.state((v$1) => $Tuple(void 0, $2));
        });
      });
    };
  };
  var getPieceInfo = (dictMonadState) => (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Monad0 = MonadThrow0.Monad0();
    const pure = Monad0.Applicative0().pure;
    return (loc) => Monad0.Bind1().bind((() => {
      const $0 = at3(loc)(strongForget);
      return dictMonadState.state((s2) => $Tuple(_pieces4($0(identity14))(s2), s2));
    })())((() => {
      const $0 = MonadThrow0.throwError($BoardError("LocationNotOccupied", loc));
      return (v2) => {
        if (v2.tag === "Nothing") {
          return $0;
        }
        if (v2.tag === "Just") {
          return pure(v2._1);
        }
        fail();
      };
    })());
  };
  var getPiece = (dictMonadState) => (dictMonadError) => {
    const getPieceInfo22 = getPieceInfo(dictMonadState)(dictMonadError);
    return (loc) => dictMonadError.MonadThrow0().Monad0().Bind1().Apply0().Functor0().map((v) => v.piece)(getPieceInfo22(loc));
  };
  var decreaseSize = (dictMonadState) => {
    const $$get = dictMonadState.state((s2) => $Tuple(s2, s2));
    return (dictMonadError) => {
      const MonadThrow0 = dictMonadError.MonadThrow0();
      const $0 = MonadThrow0.Monad0().Bind1();
      return $0.bind($$get)((v) => {
        const $1 = v.size;
        const $2 = v.pieces;
        return $0.bind((() => {
          const $3 = $1 - 2 | 0;
          if (($3 & 1) === 0 || $3 < 3 || $3 > 9) {
            return MonadThrow0.throwError($BoardError("BadBoardSize", $3));
          }
          return MonadThrow0.Monad0().Applicative0().pure($3);
        })())((newSize) => {
          const firstPieceOusideSquare = find(foldableSet)((x2) => !all3((x$1) => {
            if (x$1 < 1) {
              return false;
            }
            return x$1 <= $1;
          })([x2.x, x2.y]))(keys3($2));
          if (firstPieceOusideSquare.tag === "Just") {
            return MonadThrow0.throwError($BoardError("LocationOccupied", firstPieceOusideSquare._1));
          }
          if (firstPieceOusideSquare.tag === "Nothing") {
            const $3 = { size: newSize, pieces: unsafeMapKey((v1) => ({ x: v1.x - 1 | 0, y: v1.y - 1 | 0 }))($2) };
            return dictMonadState.state((v$1) => $Tuple(void 0, $3));
          }
          fail();
        });
      });
    };
  };
  var checkInsideBoard = (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Monad0 = MonadThrow0.Monad0();
    const $0 = Monad0.Applicative0();
    return (dictMonadState) => {
      const isInsideBoard2 = isInsideBoard(dictMonadState);
      return (loc) => {
        const $1 = MonadThrow0.throwError($BoardError("InvalidLocation", loc));
        return Monad0.Bind1().bind(Monad0.Bind1().Apply0().Functor0().map(boolNot)(isInsideBoard2(loc)))((b) => {
          if (b) {
            return $1;
          }
          return $0.pure();
        });
      };
    };
  };
  var removePieceNoUpdate = (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Monad0 = MonadThrow0.Monad0();
    const Bind1 = Monad0.Bind1();
    const checkInsideBoard1 = checkInsideBoard(dictMonadError);
    return (dictMonadState) => {
      const checkInsideBoard2 = checkInsideBoard1(dictMonadState);
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      return (loc) => Bind1.bind(checkInsideBoard2(loc))(() => Bind1.bind((() => {
        const $0 = at3(loc)(strongForget);
        return dictMonadState.state((s2) => $Tuple(_pieces4($0(identity14))(s2), s2));
      })())((maybePieceInfo) => {
        if (maybePieceInfo.tag === "Nothing") {
          return MonadThrow0.throwError($BoardError("LocationNotOccupied", loc));
        }
        if (maybePieceInfo.tag === "Just") {
          const $0 = maybePieceInfo._1;
          return Bind1.bind($$void((() => {
            const $1 = _pieces13(at3(loc)(strongFn)((v) => Nothing));
            return dictMonadState.state((s2) => {
              const s$p = $1(s2);
              return $Tuple(s$p, s$p);
            });
          })()))(() => Monad0.Applicative0().pure($0.piece));
        }
        fail();
      }));
    };
  };
  var removePiece = (dictMonadError) => {
    const Monad0 = dictMonadError.MonadThrow0().Monad0();
    const Bind1 = Monad0.Bind1();
    const removePieceNoUpdate1 = removePieceNoUpdate(dictMonadError);
    return (dictMonadState) => {
      const removePieceNoUpdate2 = removePieceNoUpdate1(dictMonadState);
      const updatePortsAround1 = updatePortsAround(dictMonadState);
      return (loc) => Bind1.bind(removePieceNoUpdate2(loc))((piece) => Bind1.bind(updatePortsAround1(loc))(() => Monad0.Applicative0().pure(piece)));
    };
  };
  var pieceDropped = (dictMonadState) => (dictMonadError) => {
    const movePiece1 = movePiece(dictMonadError)(dictMonadState);
    const removePiece1 = removePiece(dictMonadError)(dictMonadState);
    return (src) => (maybeDst) => {
      if (maybeDst.tag === "Just") {
        return movePiece1(src)(maybeDst._1);
      }
      if (maybeDst.tag === "Nothing") {
        return removePiece1(src);
      }
      fail();
    };
  };
  var rotatePieceBy = (dictMonadError) => {
    const Bind1 = dictMonadError.MonadThrow0().Monad0().Bind1();
    const checkInsideBoard1 = checkInsideBoard(dictMonadError);
    return (dictMonadState) => {
      const checkInsideBoard2 = checkInsideBoard1(dictMonadState);
      const getPiece1 = getPiece(dictMonadState)(dictMonadError);
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      const updatePortsAround1 = updatePortsAround(dictMonadState);
      return (loc) => (rot) => Bind1.bind(checkInsideBoard2(loc))(() => Bind1.bind(getPiece1(loc))(() => Bind1.bind($$void((() => {
        const $0 = _pieces13(ix2(loc)(strongFn)(choiceFn)(prop({ reflectSymbol: () => "rotation" })()()($$Proxy)(strongFn)((a2) => intMod(a2 + rot | 0)(4))));
        return dictMonadState.state((s2) => {
          const s$p = $0(s2);
          return $Tuple(s$p, s$p);
        });
      })()))(() => updatePortsAround1(loc))));
    };
  };
  var addPieceNoUpdate = (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Bind1 = MonadThrow0.Monad0().Bind1();
    const checkInsideBoard1 = checkInsideBoard(dictMonadError);
    return (dictMonadState) => {
      const checkInsideBoard2 = checkInsideBoard1(dictMonadState);
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      return (loc) => (piece) => (rotation) => Bind1.bind(checkInsideBoard2(loc))(() => Bind1.bind((() => {
        const $0 = at3(loc)(strongForget);
        return dictMonadState.state((s2) => $Tuple(_pieces4($0(identity14))(s2), s2));
      })())((pieceInfo) => {
        if (pieceInfo.tag === "Nothing") {
          return $$void((() => {
            const $0 = _pieces13(at3(loc)(strongFn)((v) => $Maybe("Just", { piece, rotation })));
            return dictMonadState.state((s2) => {
              const s$p = $0(s2);
              return $Tuple(s$p, s$p);
            });
          })());
        }
        if (pieceInfo.tag === "Just") {
          return MonadThrow0.throwError($BoardError("LocationOccupied", loc));
        }
        fail();
      }));
    };
  };
  var addPiece = (dictMonadError) => {
    const addPieceNoUpdate1 = addPieceNoUpdate(dictMonadError);
    return (dictMonadState) => {
      const addPieceNoUpdate2 = addPieceNoUpdate1(dictMonadState);
      const updatePortsAround1 = updatePortsAround(dictMonadState);
      return (loc) => (piece) => dictMonadError.MonadThrow0().Monad0().Bind1().bind(addPieceNoUpdate2(loc)(piece)(intMod(0)(4)))(() => updatePortsAround1(loc));
    };
  };

  // output-es/Game.Board.Path/index.js
  var $PathError = (tag, _1, _2) => ({ tag, _1, _2 });
  var fromFoldable14 = /* @__PURE__ */ foldlArray((m2) => (a2) => insert(ordCardinalDirection)(a2)()(m2))(Leaf2);
  var _pieces5 = /* @__PURE__ */ _pieces(strongForget);
  var at4 = /* @__PURE__ */ (() => atMap(ordLocation).at)();
  var fromFoldable15 = /* @__PURE__ */ foldrArray(Cons)(Nil);
  var PathIsEmpty = /* @__PURE__ */ $PathError("PathIsEmpty");
  var BoardError = (value0) => $PathError("BoardError", value0);
  var semigroupPathError = { append: (a2) => (v) => a2 };
  var triples = (v) => {
    if (v.tag === "Cons" && v._2.tag === "Cons" && v._2._2.tag === "Cons") {
      return $List(
        "Cons",
        $Tuple(v._1, $Tuple(v._2._1, $Tuple(v._2._2._1, void 0))),
        triples($List("Cons", v._2._1, $List("Cons", v._2._2._1, v._2._2._2)))
      );
    }
    return Nil;
  };
  var overlayWires = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const bindExceptT3 = bindExceptT(Monad0);
    const applicativeExceptT3 = applicativeExceptT(Monad0);
    const $0 = monadThrowExceptT(Monad0);
    const $1 = Monad0.Bind1().Apply0().Functor0();
    const withExceptT = (f2, v) => $1.map((v2) => {
      if (v2.tag === "Right") {
        return $Either("Right", v2._1);
      }
      if (v2.tag === "Left") {
        return $Either("Left", f2(v2._1));
      }
      fail();
    })(v);
    const monadErrorExceptT2 = monadErrorExceptT(Monad0);
    const monadStateExceptT2 = monadStateExceptT(dictMonadState);
    const addPieceNoUpdate2 = addPieceNoUpdate(monadErrorExceptT2)(monadStateExceptT2);
    const removePieceNoUpdate2 = removePieceNoUpdate(monadErrorExceptT2)(monadStateExceptT2);
    const $2 = altExceptT(semigroupPathError)(Monad0);
    return (v) => (v1) => {
      if (v1.tag === "Nothing") {
        return bindExceptT3.bind((() => {
          const v2 = clockwiseRotation(v.inputDirection)(v.outputDirection);
          if (v2 === 1) {
            return applicativeExceptT3.pure(leftPiece);
          }
          if (v2 === 2) {
            return applicativeExceptT3.pure(idPiece);
          }
          if (v2 === 3) {
            return applicativeExceptT3.pure(rightPiece);
          }
          return $0.throwError($PathError("WireInputEqualsOutput", v.inputDirection, v.outputDirection));
        })())((piece) => withExceptT(BoardError, addPieceNoUpdate2(v.location)(piece)(clockwiseRotation(Left2)(v.inputDirection))));
      }
      if (v1.tag === "Just") {
        const $3 = v1._1;
        const wireRotation = clockwiseRotation(v.inputDirection)(v.outputDirection);
        const extantRotation = clockwiseRotation($3.inputDirection)($3.outputDirection);
        const isChicken = bindExceptT3.bind((() => {
          const $4 = wireRotation === extantRotation;
          const $5 = $0.throwError($PathError("Other", "not a chicken"));
          if (!$4) {
            return $5;
          }
          if ($4) {
            return applicativeExceptT3.pure();
          }
          fail();
        })())(() => {
          const rot = clockwiseRotation(v.inputDirection)(Left2);
          return withExceptT(BoardError, bindExceptT3.bind(removePieceNoUpdate2($3.location))(() => addPieceNoUpdate2($3.location)(chickenPiece)(rot)));
        });
        const isCornerCut = bindExceptT3.bind((() => {
          const $4 = intMod(wireRotation + extantRotation | 0)(4) === intMod(0)(4);
          const $5 = $0.throwError($PathError(
            "Other",
            "not a cornercutRotation " + showIntImpl(intMod(wireRotation + extantRotation | 0)(4) * 90 | 0) + "\xB0"
          ));
          if (!$4) {
            return $5;
          }
          if ($4) {
            return applicativeExceptT3.pure();
          }
          fail();
        })())(() => bindExceptT3.bind((() => {
          const v2 = clockwiseRotation(v.inputDirection)($3.inputDirection);
          if (v2 === 1) {
            return applicativeExceptT3.pure(clockwiseRotation(Left2)(v.inputDirection));
          }
          if (v2 === 3) {
            return applicativeExceptT3.pure(clockwiseRotation(Left2)($3.inputDirection));
          }
          return $0.throwError($PathError("NoOverlay", v, $3));
        })())((rot) => withExceptT(
          BoardError,
          bindExceptT3.bind(removePieceNoUpdate2($3.location))(() => addPieceNoUpdate2($3.location)(cornerCutPiece)(rot))
        )));
        const isCrossOver = bindExceptT3.bind((() => {
          const $4 = wireRotation === intMod(2)(4) && extantRotation === intMod(2)(4);
          const $5 = $0.throwError($PathError("Other", "not a cross over"));
          if (!$4) {
            return $5;
          }
          if ($4) {
            return applicativeExceptT3.pure();
          }
          fail();
        })())(() => bindExceptT3.bind((() => {
          const v2 = clockwiseRotation(v.inputDirection)($3.inputDirection);
          if (v2 === 1) {
            return applicativeExceptT3.pure(clockwiseRotation(Left2)(v.inputDirection));
          }
          if (v2 === 3) {
            return applicativeExceptT3.pure(clockwiseRotation(Left2)($3.inputDirection));
          }
          return $0.throwError($PathError("NoOverlay", v, $3));
        })())((rot) => withExceptT(BoardError, bindExceptT3.bind(removePieceNoUpdate2($3.location))(() => addPieceNoUpdate2($3.location)(crossPiece)(rot)))));
        return bindExceptT3.bind((() => {
          const $4 = eqMap(eqCardinalDirection)(eqUnit).eq(fromFoldable14([
            v.inputDirection,
            v.outputDirection,
            $3.inputDirection,
            $3.outputDirection
          ]))(fromFoldable14(allDirections));
          const $5 = $0.throwError($PathError("Other", "all ports not filled"));
          if (!$4) {
            return $5;
          }
          if ($4) {
            return applicativeExceptT3.pure();
          }
          fail();
        })())(() => $2.alt(isCrossOver)($2.alt(isCornerCut)(isChicken)));
      }
      fail();
    };
  };
  var getWireAt = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const use2 = use(monadStateExceptT(dictMonadState));
    const applicativeExceptT3 = applicativeExceptT(Monad0);
    return (location3) => bindExceptT(Monad0).bind(use2((() => {
      const $0 = at4(location3)(strongForget);
      return (x2) => _pieces5($0(x2));
    })()))((v) => traversableMaybe.traverse(applicativeExceptT3)((info2) => {
      const inputDirection = rotateDirection(Left2)(info2.rotation);
      if (eqPiece.eq(info2.piece)(idPiece)) {
        return applicativeExceptT3.pure({ inputDirection, outputDirection: rotateDirection(Right2)(info2.rotation), location: location3 });
      }
      if (eqPiece.eq(info2.piece)(leftPiece)) {
        return applicativeExceptT3.pure({ inputDirection, outputDirection: rotateDirection(Up)(info2.rotation), location: location3 });
      }
      if (eqPiece.eq(info2.piece)(rightPiece)) {
        return applicativeExceptT3.pure({ inputDirection, outputDirection: rotateDirection(Down)(info2.rotation), location: location3 });
      }
      return monadThrowExceptT(Monad0).throwError($PathError("ObstructedByAnotherPiece", location3));
    })(v));
  };
  var createWire = (dictMonad) => {
    const $0 = monadThrowExceptT(dictMonad);
    const $1 = $0.Monad0().Applicative0().pure;
    return (l2) => (v) => (r2) => {
      const $2 = directionTo(v)(l2);
      if ($2.tag === "Nothing") {
        return $0.throwError($PathError("LocationsAreNotAdjacent", v, l2));
      }
      if ($2.tag === "Just") {
        const $3 = directionTo(v)(r2);
        if ($3.tag === "Nothing") {
          return $0.throwError($PathError("LocationsAreNotAdjacent", v, r2));
        }
        if ($3.tag === "Just") {
          if ((() => {
            if ($2._1 === "Up") {
              return $3._1 === "Up";
            }
            if ($2._1 === "Right") {
              return $3._1 === "Right";
            }
            if ($2._1 === "Down") {
              return $3._1 === "Down";
            }
            return $2._1 === "Left" && $3._1 === "Left";
          })()) {
            return $0.throwError($PathError("WireInputEqualsOutput", $2._1, $3._1));
          }
          return $1({ inputDirection: $2._1, outputDirection: $3._1, location: v });
        }
      }
      fail();
    };
  };
  var singleWirePiece = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const $0 = bindExceptT(Monad0);
    const createWire1 = createWire(Monad0);
    const getWireAt1 = getWireAt(dictMonadState);
    const overlayWires1 = overlayWires(dictMonadState);
    return (l2) => (v) => (r2) => $0.bind(createWire1(l2)(v)(r2))((wire) => $0.bind(getWireAt1(v))((maybeExtant) => overlayWires1(wire)(maybeExtant)));
  };
  var boardPathWithError = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const $0 = bindExceptT(Monad0);
    const $1 = monadThrowExceptT(Monad0);
    const $2 = $1.Monad0().Applicative0().pure;
    const liftEither = (v2) => {
      if (v2.tag === "Left") {
        return $1.throwError(v2._1);
      }
      if (v2.tag === "Right") {
        return $2(v2._1);
      }
      fail();
    };
    const $3 = applyExceptT(Monad0);
    const singleWirePiece1 = singleWirePiece(dictMonadState);
    return (initialDir) => (path2) => (terminalDir) => $0.bind(liftEither(0 < path2.length ? $Either("Right", path2[0]) : $Either("Left", PathIsEmpty)))((h2) => $0.bind((() => {
      const $4 = last(path2);
      return liftEither((() => {
        if ($4.tag === "Nothing") {
          return $Either("Left", PathIsEmpty);
        }
        if ($4.tag === "Just") {
          return $Either("Right", $4._1);
        }
        fail();
      })());
    })())((l2) => foldableList.foldr((a2) => (b) => $3.apply($3.Functor0().map((v) => identity)(a2))(b))(applicativeExceptT(Monad0).pure())(listMap((v) => singleWirePiece1(v._1)(v._2._1)(v._2._2._1))(triples(fromFoldable15([
      (() => {
        if (initialDir === "Up") {
          return { x: h2.x, y: h2.y - 1 | 0 };
        }
        if (initialDir === "Right") {
          return { x: h2.x + 1 | 0, y: h2.y };
        }
        if (initialDir === "Down") {
          return { x: h2.x, y: h2.y + 1 | 0 };
        }
        if (initialDir === "Left") {
          return { x: h2.x - 1 | 0, y: h2.y };
        }
        fail();
      })(),
      ...path2,
      (() => {
        if (terminalDir === "Up") {
          return { x: l2.x, y: l2.y - 1 | 0 };
        }
        if (terminalDir === "Right") {
          return { x: l2.x + 1 | 0, y: l2.y };
        }
        if (terminalDir === "Down") {
          return { x: l2.x, y: l2.y + 1 | 0 };
        }
        if (terminalDir === "Left") {
          return { x: l2.x - 1 | 0, y: l2.y };
        }
        fail();
      })()
    ]))))));
  };
  var addBoardPath = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Bind1 = Monad0.Bind1();
    const boardPathWithError1 = boardPathWithError(dictMonadState);
    const Applicative0 = Monad0.Applicative0();
    const for_9 = for_(Applicative0)(foldableMaybe);
    const updatePortsAround2 = updatePortsAround(dictMonadState);
    return (initialDir) => (path2) => (terminalDir) => Bind1.bind(Bind1.Apply0().Functor0().map(blush)(boardPathWithError1(initialDir)(path2)(terminalDir)))((maybePathError) => Bind1.bind((() => {
      const $0 = Bind1.bind(for_9(0 < path2.length ? $Maybe("Just", path2[0]) : Nothing)(updatePortsAround2))(() => for_9(last(path2))(updatePortsAround2));
      if ((() => {
        if (maybePathError.tag === "Nothing") {
          return true;
        }
        if (maybePathError.tag === "Just") {
          return false;
        }
        fail();
      })()) {
        return $0;
      }
      return Applicative0.pure();
    })())(() => Applicative0.pure((() => {
      if (maybePathError.tag === "Nothing") {
        return true;
      }
      if (maybePathError.tag === "Just") {
        return false;
      }
      fail();
    })())));
  };

  // output-es/Halogen.HTML/index.js
  var slot_ = () => (dictIsSymbol) => (dictOrd) => {
    const componentSlot2 = componentSlot()(dictIsSymbol)(dictOrd);
    return (label) => (p2) => (component13) => (input) => $VDom(
      "Widget",
      $ComponentSlot("ComponentSlot", componentSlot2(label)(p2)(component13)(input)((v) => Nothing))
    );
  };
  var slot = () => (dictIsSymbol) => (dictOrd) => {
    const componentSlot2 = componentSlot()(dictIsSymbol)(dictOrd);
    return (label) => (p2) => (component13) => (input) => (outputQuery) => $VDom(
      "Widget",
      $ComponentSlot("ComponentSlot", componentSlot2(label)(p2)(component13)(input)((x2) => $Maybe("Just", outputQuery(x2))))
    );
  };

  // output-es/Web.Event.Event/foreign.js
  function _target(e2) {
    return e2.target;
  }
  function preventDefault(e2) {
    return function() {
      return e2.preventDefault();
    };
  }

  // output-es/Component.Board/index.js
  var liftBoardM2 = /* @__PURE__ */ liftBoardM(monadStateHalogenM);
  var monadErrorStateT2 = /* @__PURE__ */ monadErrorStateT(/* @__PURE__ */ monadErrorExceptT(monadIdentity));
  var monadStateStateT3 = /* @__PURE__ */ monadStateStateT({
    Applicative0: () => applicativeExceptT(monadIdentity),
    Bind1: () => bindExceptT(monadIdentity)
  });
  var rotatePieceBy2 = /* @__PURE__ */ rotatePieceBy(monadErrorStateT2)(monadStateStateT3);
  var traverse_8 = /* @__PURE__ */ traverse_(freeApplicative);
  var traverse_12 = /* @__PURE__ */ traverse_8(foldableEither);
  var gets3 = (f2) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s2) => $Tuple(f2(s2), s2)),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var pieceDropped2 = /* @__PURE__ */ pieceDropped(monadStateStateT3)(monadErrorStateT2);
  var multimeterIsSymbol = { reflectSymbol: () => "multimeter" };
  var tell1 = /* @__PURE__ */ tell2()(multimeterIsSymbol)(ordUnit);
  var monadStateStateT1 = /* @__PURE__ */ monadStateStateT(monadIdentity);
  var capacityRipple2 = /* @__PURE__ */ capacityRipple(monadStateStateT1);
  var for_6 = /* @__PURE__ */ for_(freeApplicative)(foldableMaybe);
  var modify_3 = (f2) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s2) => $Tuple(void 0, f2(s2))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var modifying = (p2) => (f2) => {
    const $0 = p2(f2);
    return $Free(
      $FreeView(
        "Bind",
        $HalogenF(
          "State",
          (s2) => {
            const s$p = $0(s2);
            return $Tuple(s$p, s$p);
          }
        ),
        (x2) => $Free($FreeView("Return", x2), CatNil)
      ),
      snoc(CatNil)((x2) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var ix3 = /* @__PURE__ */ (() => indexMap(ordCardinalDirection).ix)();
  var traverse_22 = /* @__PURE__ */ traverse_8(foldableMaybe);
  var bindMaybeT2 = /* @__PURE__ */ bindMaybeT(freeMonad);
  var monadStateMaybeT2 = /* @__PURE__ */ monadStateMaybeT(monadStateHalogenM);
  var appendModifying = (p2) => (x2) => {
    const $0 = p2((a2) => [...a2, ...x2]);
    return $Free(
      $FreeView(
        "Bind",
        $HalogenF(
          "State",
          (s2) => {
            const s$p = $0(s2);
            return $Tuple(s$p, s$p);
          }
        ),
        (x$1) => $Free($FreeView("Return", x$1), CatNil)
      ),
      snoc(CatNil)((x$1) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var _wireLocations2 = /* @__PURE__ */ _wireLocations(wanderFunction);
  var map2 = (f2) => (v) => $Free(
    v._1,
    snoc(v._2)((x2) => $Free(
      $FreeView("Return", x2.tag === "Just" ? $Maybe("Just", f2(x2._1)) : Nothing),
      CatNil
    ))
  );
  var addBoardPath2 = /* @__PURE__ */ addBoardPath(monadStateStateT1);
  var buildEvaluableBoard2 = /* @__PURE__ */ buildEvaluableBoard(monadErrorEither);
  var evalWithPortInfo2 = /* @__PURE__ */ evalWithPortInfo(/* @__PURE__ */ monadReaderReaderT({
    Applicative0: () => applicativeStateT(monadIdentity),
    Bind1: () => bindStateT(monadIdentity)
  }))(/* @__PURE__ */ monadStateReaderT(monadStateStateT1));
  var show4 = /* @__PURE__ */ (() => showMap(showCardinalDirection)(showSignal).show)();
  var show6 = (record) => (record.connected ? "{ connected: true, port: " : "{ connected: false, port: ") + showPort.show(record.port) + ", signal: " + showSignal.show(record.signal) + " }";
  var _pieces6 = /* @__PURE__ */ _pieces(strongForget);
  var traverseWithIndex_2 = /* @__PURE__ */ traverseWithIndex_(freeApplicative)(foldableWithIndexMap);
  var pieceIsSymbol = { reflectSymbol: () => "piece" };
  var tell22 = /* @__PURE__ */ tell2()(pieceIsSymbol)(ordLocation);
  var getBoardPortEdge3 = /* @__PURE__ */ getBoardPortEdge(monadStateStateT1);
  var slot1 = /* @__PURE__ */ slot()(pieceIsSymbol)(ordLocation);
  var slot2 = /* @__PURE__ */ slot()(multimeterIsSymbol)(ordUnit);
  var _size3 = /* @__PURE__ */ _size(strongForget);
  var intercalate5 = /* @__PURE__ */ intercalate1(monoidString);
  var boardPortInfo2 = /* @__PURE__ */ boardPortInfo(monadStateStateT1);
  var getPieceInfo2 = /* @__PURE__ */ getPieceInfo(monadStateStateT3)(monadErrorStateT2);
  var addPiece2 = /* @__PURE__ */ addPiece(monadErrorStateT2)(monadStateStateT3);
  var removePiece2 = /* @__PURE__ */ removePiece(monadErrorStateT2)(monadStateStateT3);
  var show8 = /* @__PURE__ */ (() => showMap(showCardinalDirection)(showPort).show)();
  var forWithIndex_2 = /* @__PURE__ */ forWithIndex_(freeApplicative)(foldableWithIndexMap);
  var assign2 = (p2) => (b) => {
    const $0 = p2((v) => b);
    return $Free(
      $FreeView(
        "Bind",
        $HalogenF(
          "State",
          (s2) => {
            const s$p = $0(s2);
            return $Tuple(s$p, s$p);
          }
        ),
        (x2) => $Free($FreeView("Return", x2), CatNil)
      ),
      snoc(CatNil)((x2) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var at5 = /* @__PURE__ */ (() => atMap(ordCardinalDirection).at)();
  var increaseSize2 = /* @__PURE__ */ increaseSize(monadStateStateT3)(monadErrorStateT2);
  var decreaseSize2 = /* @__PURE__ */ decreaseSize(monadStateStateT3)(monadErrorStateT2);
  var getDirectionClicked = (me) => (bb) => {
    const $0 = toNumber(clientX(me)) - bb.left;
    const $1 = toNumber(clientY(me)) - bb.top;
    const isTopOrRight = $0 > $1;
    const isTopOrLeft = $0 + $1 < bb.width;
    if (!isTopOrRight) {
      if (!isTopOrLeft) {
        return Down;
      }
      if (isTopOrLeft) {
        return Left2;
      }
      fail();
    }
    if (isTopOrRight) {
      if (!isTopOrLeft) {
        return Right2;
      }
      if (isTopOrLeft) {
        return Up;
      }
    }
    fail();
  };
  var handleAction = (dictMonadAff) => {
    const MonadEffect0 = dictMonadAff.MonadEffect0();
    const monadEffectHalogenM2 = monadEffectHalogenM(MonadEffect0);
    const lift2 = monadTransHalogenM.lift(MonadEffect0.Monad0());
    const headShake2 = headShake(monadAffHalogenM(dictMonadAff));
    const $0 = monadEffectMaybe(monadEffectHalogenM2);
    return (dictMonadLogger) => {
      const debug2 = log$p(dictMonadLogger)(Debug);
      const warn2 = log$p(dictMonadLogger)(Warn);
      return (v) => {
        if (v.tag === "Initialise") {
          const $1 = monadEffectHalogenM2.liftEffect(globalKeyDownEventEmitter);
          return $Free(
            $1._1,
            snoc($1._2)((emitter) => $Free(
              $FreeView(
                "Bind",
                $HalogenF("Subscribe", (v$1) => (k) => emitter((x2) => k($Action3("GlobalOnKeyDown", x2))), identity11),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              snoc(snoc(CatNil)((x2) => $Free($FreeView("Return", void 0), CatNil)))(() => $Free(
                $FreeView(
                  "Bind",
                  $HalogenF(
                    "State",
                    (s2) => $Tuple(_board(strongForget)(identity14)(s2), s2)
                  ),
                  (x2) => $Free($FreeView("Return", x2), CatNil)
                ),
                snoc(snoc(CatNil)((x2) => $Free(
                  $FreeView("Return", $Output(x2)),
                  CatNil
                )))(raise)
              ))
            ))
          );
        }
        if (v.tag === "PieceOutput") {
          if (v._1.tag === "Rotated") {
            const $1 = v._1._1;
            const $2 = v._1._2;
            const $3 = liftBoardM2(rotatePieceBy2($1)($2));
            return $Free(
              $3._1,
              snoc($3._2)(traverse_12((v1) => {
                const $4 = v1._2;
                const $5 = lift2(debug2($$$Map(
                  "Node",
                  1,
                  1,
                  "rotation",
                  $Tag("StringTag", "Rotation " + showIntImpl($2 * 90 | 0) + "\xB0"),
                  Leaf2,
                  Leaf2
                ))("Piece rotated at " + showLocation.show($1)));
                return $Free(
                  $5._1,
                  snoc($5._2)(() => handleAction(dictMonadAff)(dictMonadLogger)($Action3("SetBoard", $4)))
                );
              }))
            );
          }
          if (v._1.tag === "Dropped") {
            const $1 = v._1._1;
            const $2 = lift2(debug2(Leaf2)("Piece dropped at " + showLocation.show($1)));
            return $Free(
              $2._1,
              snoc($2._2)(() => {
                const $3 = gets3((v1) => v1.isMouseOverLocation);
                return $Free(
                  $3._1,
                  snoc($3._2)((maybeDst) => {
                    const $4 = liftBoardM2(pieceDropped2($1)(maybeDst));
                    return $Free(
                      $4._1,
                      snoc($4._2)((eitherPiece) => {
                        if (eitherPiece.tag === "Left") {
                          const $5 = lift2(warn2(Leaf2)(showBoardError.show(eitherPiece._1)));
                          return $Free(
                            $5._1,
                            snoc($5._2)(() => headShake2("[data-location='" + location2.attrPrint($1) + "']"))
                          );
                        }
                        if (eitherPiece.tag === "Right") {
                          return $Free(
                            $FreeView(
                              "Bind",
                              $HalogenF(
                                "State",
                                (s2) => $Tuple(_board(strongForget)(identity14)(s2), s2)
                              ),
                              (x2) => $Free($FreeView("Return", x2), CatNil)
                            ),
                            snoc(CatNil)((board2) => handleAction(dictMonadAff)(dictMonadLogger)($Action3("SetBoard", board2)))
                          );
                        }
                        fail();
                      })
                    );
                  })
                );
              })
            );
          }
          if (v._1.tag === "NewMultimeterFocus") {
            const $1 = v._1._1;
            return tell1($$Proxy)()((v1) => $Query2("NewFocus", $1));
          }
          fail();
        }
        if (v.tag === "MultimeterOutput") {
          const $1 = v._1._1;
          const $2 = capacityRipple2($1)(v._1._2);
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF(
                "State",
                (s2) => $Tuple(_board(strongForget)(identity14)(s2), s2)
              ),
              (x2) => $Free($FreeView("Return", x2), CatNil)
            ),
            snoc(snoc(CatNil)((x2) => $Free($FreeView("Return", $2(x2)._2), CatNil)))((board$p) => {
              const $3 = handleAction(dictMonadAff)(dictMonadLogger)($Action3("SetBoard", board$p));
              return $Free(
                $3._1,
                snoc($3._2)(() => {
                  const $4 = gets3((v1) => v1.lastEvalWithPortInfo);
                  return $Free(
                    $4._1,
                    snoc($4._2)((signals) => {
                      const $5 = lookup(ordRelativeEdge)($1)(signals);
                      const focus2 = (() => {
                        if ($5.tag === "Just") {
                          return $Maybe("Just", { info: $5._1, relativeEdge: $1 });
                        }
                        if ($5.tag === "Nothing") {
                          return Nothing;
                        }
                        fail();
                      })();
                      return tell1($$Proxy)()((v1) => $Query2("NewFocus", focus2));
                    })
                  );
                })
              );
            })
          );
        }
        if (v.tag === "Undo") {
          const $1 = gets3((v1) => v1.boardHistory);
          return $Free(
            $1._1,
            snoc(snoc($1._2)((x2) => $Free($FreeView("Return", moveLeft(x2)), CatNil)))((maybeZipper) => for_6(maybeZipper)((t2) => {
              const $2 = modify_3((v1) => ({ ...v1, boardHistory: t2 }));
              return $Free($2._1, snoc($2._2)(() => handleAction(dictMonadAff)(dictMonadLogger)(EvaluateBoard)));
            }))
          );
        }
        if (v.tag === "Redo") {
          const $1 = gets3((v1) => v1.boardHistory);
          return $Free(
            $1._1,
            snoc(snoc($1._2)((x2) => $Free($FreeView("Return", moveRight(x2)), CatNil)))((maybeZipper) => for_6(maybeZipper)((t2) => {
              const $2 = modify_3((v1) => ({ ...v1, boardHistory: t2 }));
              return $Free($2._1, snoc($2._2)(() => handleAction(dictMonadAff)(dictMonadLogger)(EvaluateBoard)));
            }))
          );
        }
        if (v.tag === "ToggleInput") {
          const $1 = modifying((() => {
            const $12 = ix3(v._1)(strongFn)(choiceFn);
            return (x2) => prop({ reflectSymbol: () => "inputs" })()()($$Proxy)(strongFn)($12(x2));
          })())((signal) => {
            if (signal === 0) {
              return -1;
            }
            return 0;
          });
          return $Free($1._1, snoc($1._2)(() => handleAction(dictMonadAff)(dictMonadLogger)(EvaluateBoard)));
        }
        if (v.tag === "IncrementInput") {
          const $1 = v._1;
          const $2 = gets3((() => {
            const $22 = lookup(ordCardinalDirection)($1);
            return (x2) => $22(x2.boardPorts);
          })());
          return $Free(
            $2._1,
            snoc(snoc($2._2)(traverse_22((port2) => modifying((() => {
              const $3 = ix3($1)(strongFn)(choiceFn);
              return (x2) => prop({ reflectSymbol: () => "inputs" })()()($$Proxy)(strongFn)($3(x2));
            })())((signal) => {
              if ((() => {
                const $3 = portCapacity(port2);
                if ($3 === "OneBit") {
                  return signal === 1;
                }
                if ($3 === "TwoBit") {
                  return signal === 3;
                }
                if ($3 === "FourBit") {
                  return signal === 15;
                }
                if ($3 === "EightBit") {
                  return signal === 255;
                }
                fail();
              })()) {
                return 0;
              }
              return signal + 1 | 0;
            }))))(() => handleAction(dictMonadAff)(dictMonadLogger)(EvaluateBoard))
          );
        }
        if (v.tag === "DecrementInput") {
          const $1 = v._1;
          const $2 = gets3((() => {
            const $22 = lookup(ordCardinalDirection)($1);
            return (x2) => $22(x2.boardPorts);
          })());
          return $Free(
            $2._1,
            snoc(snoc($2._2)(traverse_22((port2) => modifying((() => {
              const $3 = ix3($1)(strongFn)(choiceFn);
              return (x2) => prop({ reflectSymbol: () => "inputs" })()()($$Proxy)(strongFn)($3(x2));
            })())((v1) => {
              if (v1 === 0) {
                const $3 = portCapacity(port2);
                if ($3 === "OneBit") {
                  return 1;
                }
                if ($3 === "TwoBit") {
                  return 3;
                }
                if ($3 === "FourBit") {
                  return 15;
                }
                if ($3 === "EightBit") {
                  return 255;
                }
                fail();
              }
              return v1 - 1 | 0;
            }))))(() => handleAction(dictMonadAff)(dictMonadLogger)(EvaluateBoard))
          );
        }
        if (v.tag === "SetOutputs") {
          const $1 = v._1;
          const $2 = modify_3((v1) => ({ ...v1, outputs: $1 }));
          return $Free(
            $2._1,
            snoc($2._2)(() => {
              const $3 = gets3((v1) => v1.isMouseOverBoardPort);
              return $Free(
                $3._1,
                snoc($3._2)(traverse_22((dir2) => tell1($$Proxy)()((v1) => $Query2(
                  "SetSignal",
                  (() => {
                    const $4 = lookup(ordCardinalDirection)(dir2)($1);
                    if ($4.tag === "Nothing") {
                      return 0;
                    }
                    if ($4.tag === "Just") {
                      return $4._1;
                    }
                    fail();
                  })()
                ))))
              );
            })
          );
        }
        if (v.tag === "BoardOnDragExit") {
          const $1 = modify_3((v1) => ({ ...v1, isCreatingWire: Nothing }));
          return $Free($1._1, snoc($1._2)(() => lift2(debug2(Leaf2)("Cancelled wire creation"))));
        }
        if (v.tag === "LocationOnMouseDown") {
          const $1 = v._1;
          const $2 = v._2;
          const $3 = bindMaybeT2.bind($Free(
            $FreeView("Return", nullable(_target($2), Nothing, Just)),
            CatNil
          ))((eventTarget) => bindMaybeT2.bind($Free(
            $FreeView("Return", _unsafeReadProtoTagged(Nothing, Just, "Element", eventTarget)),
            CatNil
          ))((element) => bindMaybeT2.bind($0.liftEffect(getBoundingClientRect(element)))((bb) => {
            const initialDirection = getDirectionClicked($2)(bb);
            return monadStateMaybeT2.state((s2) => $Tuple(void 0, { ...s2, isCreatingWire: $Maybe("Just", { initialDirection, locations: [$1] }) }));
          })));
          return $Free(
            $3._1,
            snoc($3._2)((x2) => $Free($FreeView("Return", void 0), CatNil))
          );
        }
        if (v.tag === "LocationOnMouseOver") {
          const $1 = v._1;
          const $2 = gets3((v1) => v1.isCreatingWire);
          return $Free(
            $2._1,
            snoc($2._2)(traverse_22((creatingWire) => {
              const $3 = last(creatingWire.locations);
              const $4 = appendModifying(_wireLocations2)([$1]);
              if ($3.tag === "Nothing" || !($3.tag === "Just" && $3._1.x === $1.x && $3._1.y === $1.y)) {
                return $4;
              }
              return $Free($FreeView("Return", void 0), CatNil);
            }))
          );
        }
        if (v.tag === "LocationOnMouseUp") {
          const $1 = v._2;
          const $2 = bindMaybeT2.bind(gets3((v1) => v1.isCreatingWire))((creatingWire) => bindMaybeT2.bind($Free(
            $FreeView("Return", nullable(_target($1), Nothing, Just)),
            CatNil
          ))((eventTarget) => bindMaybeT2.bind($Free(
            $FreeView("Return", _unsafeReadProtoTagged(Nothing, Just, "Element", eventTarget)),
            CatNil
          ))((element) => bindMaybeT2.bind($0.liftEffect(getBoundingClientRect(element)))((bb) => bindMaybeT2.bind(map2(addBoardPath2(creatingWire.initialDirection)(creatingWire.locations)(getDirectionClicked($1)(bb)))(monadStateMaybeT2.state((s2) => $Tuple(
            _board(strongForget)(identity14)(s2),
            s2
          ))))((v1) => bindMaybeT2.bind((() => {
            const $22 = applicativeMaybeT(freeMonad);
            const $3 = handleAction(dictMonadAff)(dictMonadLogger)($Action3("SetBoard", v1._2));
            const $4 = $Free(
              $3._1,
              snoc($3._2)((a$p) => $Free($FreeView("Return", $Maybe("Just", a$p)), CatNil))
            );
            if (v1._1) {
              return $4;
            }
            return $22.pure();
          })())(() => monadStateMaybeT2.state((s2) => $Tuple(void 0, { ...s2, isCreatingWire: Nothing }))))))));
          return $Free(
            $2._1,
            snoc($2._2)((x2) => $Free($FreeView("Return", void 0), CatNil))
          );
        }
        if (v.tag === "SetBoard") {
          const $1 = v._1;
          const $2 = lift2(debug2(Leaf2)("Updating board"));
          return $Free(
            $2._1,
            snoc($2._2)(() => {
              const $3 = monadEffectHalogenM2.liftEffect(log2(printBoard($1)));
              return $Free(
                $3._1,
                snoc($3._2)(() => {
                  const $4 = modify_3((s2) => ({ ...s2, boardHistory: $Zipper($List("Cons", s2.boardHistory._2, s2.boardHistory._1), $1, Nil) }));
                  return $Free(
                    $4._1,
                    snoc($4._2)(() => {
                      const $5 = handleAction(dictMonadAff)(dictMonadLogger)(EvaluateBoard);
                      return $Free(
                        $5._1,
                        snoc($5._2)(() => $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output($1), void 0),
                            (x2) => $Free($FreeView("Return", x2), CatNil)
                          ),
                          CatNil
                        ))
                      );
                    })
                  );
                })
              );
            })
          );
        }
        if (v.tag === "EvaluateBoard") {
          const $1 = gets3((v1) => v1.boardPorts);
          return $Free(
            $1._1,
            snoc($1._2)((boardPorts) => {
              const $2 = gets3((v1) => v1.inputs);
              return $Free(
                $2._1,
                snoc($2._2)((inputs) => {
                  const $3 = buildEvaluableBoard2(boardPorts);
                  return $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF(
                        "State",
                        (s2) => $Tuple(_board(strongForget)(identity14)(s2), s2)
                      ),
                      (x2) => $Free($FreeView("Return", x2), CatNil)
                    ),
                    snoc(snoc(CatNil)((x2) => $Free($FreeView("Return", $3(x2)), CatNil)))((eitherEvaluable) => {
                      if (eitherEvaluable.tag === "Left") {
                        return lift2(warn2(Leaf2)("Unable to build EvaluableBoard, BoardError: " + showBoardError.show(eitherEvaluable._1)));
                      }
                      if (eitherEvaluable.tag === "Right") {
                        const v1 = evalWithPortInfo2(inputs)(eitherEvaluable._1)(Leaf2);
                        const $4 = v1._1;
                        const $5 = v1._2;
                        const $6 = lift2(debug2(unsafeUnionWith(
                          ordString.compare,
                          $$const,
                          $$$Map("Node", 1, 1, "inputs", $Tag("StringTag", show4(inputs)), Leaf2, Leaf2),
                          $$$Map("Node", 1, 1, "outputs", $Tag("StringTag", show4($4)), Leaf2, Leaf2)
                        ))("Evaluating board"));
                        return $Free(
                          $6._1,
                          snoc($6._2)(() => {
                            const $7 = lift2(debug2((() => {
                              const go = (m$p, z$p) => {
                                if (m$p.tag === "Leaf") {
                                  return z$p;
                                }
                                if (m$p.tag === "Node") {
                                  return go(
                                    m$p._5,
                                    insert(ordString)(showRelativeEdge.show(m$p._3))($Tag(
                                      "StringTag",
                                      show6(m$p._4)
                                    ))(go(m$p._6, z$p))
                                  );
                                }
                                fail();
                              };
                              return go($5, Leaf2);
                            })())("Signals from board eval"));
                            return $Free(
                              $7._1,
                              snoc($7._2)(() => {
                                const $8 = modify_3((v2) => ({ ...v2, lastEvalWithPortInfo: $5 }));
                                return $Free(
                                  $8._1,
                                  snoc($8._2)(() => {
                                    const $9 = handleAction(dictMonadAff)(dictMonadLogger)($Action3("SetOutputs", $4));
                                    return $Free(
                                      $9._1,
                                      snoc($9._2)(() => handleAction(dictMonadAff)(dictMonadLogger)(UpdatePieceComponents))
                                    );
                                  })
                                );
                              })
                            );
                          })
                        );
                      }
                      fail();
                    })
                  );
                })
              );
            })
          );
        }
        if (v.tag === "UpdatePieceComponents") {
          const $1 = lift2(debug2(Leaf2)("Updating piece components"));
          return $Free(
            $1._1,
            snoc($1._2)(() => {
              const $2 = gets3((v1) => v1.lastEvalWithPortInfo);
              return $Free(
                $2._1,
                snoc($2._2)((signals) => $Free(
                  $FreeView(
                    "Bind",
                    $HalogenF(
                      "State",
                      (s2) => $Tuple(_board(strongForget)(_pieces6(identity14))(s2), s2)
                    ),
                    (x2) => $Free($FreeView("Return", x2), CatNil)
                  ),
                  snoc(CatNil)(traverseWithIndex_2((loc) => (info2) => {
                    const portStates = toLocalInputs(loc)(signals);
                    const $3 = tell22($$Proxy)(loc)((v1) => $Query3("SetPortStates", portStates));
                    return $Free(
                      $3._1,
                      snoc($3._2)(() => {
                        const $4 = tell22($$Proxy)(loc)((v1) => $Query3("SetPiece", info2.piece));
                        return $Free(
                          $4._1,
                          snoc($4._2)(() => tell22($$Proxy)(loc)((v1) => $Query3("SetRotation", info2.rotation)))
                        );
                      })
                    );
                  }))
                ))
              );
            })
          );
        }
        if (v.tag === "LocationOnDragEnter") {
          const $1 = v._1;
          const $2 = monadEffectHalogenM2.liftEffect(preventDefault(v._2));
          return $Free($2._1, snoc($2._2)(() => modify_3((v1) => ({ ...v1, isMouseOverLocation: $Maybe("Just", $1) }))));
        }
        if (v.tag === "LocationOnDragOver") {
          return monadEffectHalogenM2.liftEffect(preventDefault(v._2));
        }
        if (v.tag === "LocationOnDrop") {
          const $1 = v._2;
          const $2 = v._1;
          const $3 = modify_3((v1) => ({ ...v1, isMouseOverLocation: $Maybe("Just", $2) }));
          return $Free($3._1, snoc($3._2)(() => monadEffectHalogenM2.liftEffect(preventDefault($1))));
        }
        if (v.tag === "LocationOnDragLeave") {
          return modify_3((v1) => ({ ...v1, isMouseOverLocation: Nothing }));
        }
        if (v.tag === "GlobalOnKeyDown") {
          const v1 = key(v._1);
          if (v1 === "z") {
            const $1 = handleAction(dictMonadAff)(dictMonadLogger)(Undo);
            if (ctrlKey(v._1)) {
              return $1;
            }
            return $Free($FreeView("Return", void 0), CatNil);
          }
          if (v1 === "y") {
            const $1 = handleAction(dictMonadAff)(dictMonadLogger)(Redo);
            if (ctrlKey(v._1)) {
              return $1;
            }
            return $Free($FreeView("Return", void 0), CatNil);
          }
          if (v1 === "e") {
            const $1 = gets3((v2) => v2.isMouseOverBoardPort);
            return $Free(
              $1._1,
              snoc($1._2)(traverse_22((dir2) => handleAction(dictMonadAff)(dictMonadLogger)($Action3("IncrementInput", dir2))))
            );
          }
          if (v1 === "E") {
            const $1 = gets3((v2) => v2.isMouseOverBoardPort);
            return $Free(
              $1._1,
              snoc($1._2)(traverse_22((dir2) => handleAction(dictMonadAff)(dictMonadLogger)($Action3("DecrementInput", dir2))))
            );
          }
          return $Free($FreeView("Return", void 0), CatNil);
        }
        if (v.tag === "BoardPortOnMouseEnter") {
          const $1 = v._1;
          const $2 = modify_3((v1) => ({ ...v1, isMouseOverBoardPort: $Maybe("Just", $1) }));
          return $Free(
            $2._1,
            snoc($2._2)(() => {
              const $3 = getBoardPortEdge3($1);
              return $Free(
                $FreeView(
                  "Bind",
                  $HalogenF(
                    "State",
                    (s2) => $Tuple(_board(strongForget)(identity14)(s2), s2)
                  ),
                  (x2) => $Free($FreeView("Return", x2), CatNil)
                ),
                snoc(snoc(CatNil)((x2) => $Free($FreeView("Return", $3(x2)._1), CatNil)))((relativeEdge) => {
                  const $4 = gets3((v1) => v1.lastEvalWithPortInfo);
                  return $Free(
                    $4._1,
                    snoc($4._2)((signals) => {
                      const $5 = lookup(ordRelativeEdge)(relativeEdge)(signals);
                      const focus2 = $5.tag === "Just" ? $Maybe("Just", { info: $5._1, relativeEdge }) : Nothing;
                      return tell1($$Proxy)()((v1) => $Query2("NewFocus", focus2));
                    })
                  );
                })
              );
            })
          );
        }
        if (v.tag === "BoardPortOnMouseLeave") {
          const $1 = modify_3((v1) => ({ ...v1, isMouseOverBoardPort: Nothing }));
          return $Free($1._1, snoc($1._2)(() => tell1($$Proxy)()((v1) => $Query2("NewFocus", Nothing))));
        }
        fail();
      };
    };
  };
  var component6 = (dictMonadLogger) => {
    const debug2 = log$p(dictMonadLogger)(Debug);
    return (dictMonadAff) => {
      const MonadEffect0 = dictMonadAff.MonadEffect0();
      const component1 = component5(MonadEffect0);
      const component22 = component4(MonadEffect0);
      const headShake2 = headShake(monadAffHalogenM(dictMonadAff));
      const handleAction1 = handleAction(dictMonadAff)(dictMonadLogger);
      const lift2 = monadTransHalogenM.lift(MonadEffect0.Monad0());
      return {
        eval: mkEval({
          finalize: Nothing,
          handleAction: handleAction1,
          handleQuery: (v) => {
            if (v.tag === "GetBoard") {
              return $Free(
                $FreeView(
                  "Bind",
                  $HalogenF(
                    "State",
                    (s2) => $Tuple(_board(strongForget)(identity14)(s2), s2)
                  ),
                  (x2) => $Free($FreeView("Return", x2), CatNil)
                ),
                snoc(CatNil)((x2) => $Free(
                  $FreeView("Return", $Maybe("Just", v._1(x2))),
                  CatNil
                ))
              );
            }
            if (v.tag === "AddPiece") {
              const $0 = v._1;
              const $1 = liftBoardM2(addPiece2($0)(v._2));
              return $Free(
                $1._1,
                snoc(snoc($1._2)((v1) => {
                  if (v1.tag === "Left") {
                    return headShake2("[data-location='" + location2.attrPrint($0) + "']");
                  }
                  if (v1.tag === "Right") {
                    return handleAction1($Action3("SetBoard", v1._1._2));
                  }
                  fail();
                }))(() => $Free($FreeView("Return", Nothing), CatNil))
              );
            }
            if (v.tag === "RemovePiece") {
              const $0 = liftBoardM2(removePiece2(v._1));
              return $Free(
                $0._1,
                snoc(snoc($0._2)(traverse_12((v1) => handleAction1($Action3("SetBoard", v1._2)))))(() => $Free(
                  $FreeView("Return", Nothing),
                  CatNil
                ))
              );
            }
            if (v.tag === "GetMouseOverLocation") {
              const $0 = gets3((v1) => v1.isMouseOverLocation);
              return $Free(
                $0._1,
                snoc($0._2)((maybeDst) => $Free(
                  $FreeView("Return", maybeDst.tag === "Just" ? $Maybe("Just", v._1(maybeDst._1)) : Nothing),
                  CatNil
                ))
              );
            }
            if (v.tag === "SetGoalPorts") {
              const $0 = v._1;
              const $1 = lift2(debug2($$$Map(
                "Node",
                1,
                1,
                "boardPorts",
                $Tag("StringTag", show8($0)),
                Leaf2,
                Leaf2
              ))("Set goal ports on board"));
              return $Free(
                $1._1,
                snoc($1._2)(() => {
                  const $2 = modify_3((v1) => ({ ...v1, boardPorts: $0 }));
                  return $Free(
                    $2._1,
                    snoc($2._2)(() => {
                      const $3 = forWithIndex_2($0)((dir2) => (port2) => {
                        const $32 = assign2((() => {
                          const $33 = at5(dir2)(strongFn);
                          return (x2) => prop({ reflectSymbol: () => "inputs" })()()($$Proxy)(strongFn)($33(x2));
                        })())($Maybe("Just", 0));
                        if (isInput(port2)) {
                          return $32;
                        }
                        return $Free($FreeView("Return", void 0), CatNil);
                      });
                      return $Free(
                        $3._1,
                        snoc($3._2)(() => {
                          const $4 = handleAction1(EvaluateBoard);
                          return $Free(
                            $4._1,
                            snoc($4._2)(() => $Free($FreeView("Return", Nothing), CatNil))
                          );
                        })
                      );
                    })
                  );
                })
              );
            }
            if (v.tag === "SetInputs") {
              const $0 = assign2(_inputs(strongFn))(v._1);
              return $Free(
                $0._1,
                snoc($0._2)(() => {
                  const $1 = handleAction1(EvaluateBoard);
                  return $Free(
                    $1._1,
                    snoc($1._2)(() => {
                      const $2 = gets3((v1) => v1.outputs);
                      return $Free(
                        $2._1,
                        snoc($2._2)((x2) => $Free($FreeView("Return", $Maybe("Just", v._2(x2))), CatNil))
                      );
                    })
                  );
                })
              );
            }
            if (v.tag === "IncrementBoardSize") {
              const $0 = liftBoardM2(increaseSize2);
              return $Free(
                $0._1,
                snoc(snoc($0._2)(traverse_12((v1) => handleAction1($Action3("SetBoard", v1._2)))))(() => $Free(
                  $FreeView("Return", Nothing),
                  CatNil
                ))
              );
            }
            if (v.tag === "DecrementBoardSize") {
              const $0 = liftBoardM2(decreaseSize2);
              return $Free(
                $0._1,
                snoc(snoc($0._2)(traverse_12((v1) => handleAction1($Action3("SetBoard", v1._2)))))(() => $Free(
                  $FreeView("Return", Nothing),
                  CatNil
                ))
              );
            }
            fail();
          },
          initialize: $Maybe("Just", Initialise),
          receive: (v) => Nothing
        }),
        initialState,
        render: (state) => {
          const board2 = state.boardHistory._2;
          const n2 = _size3(identity14)(board2);
          const gridTemplate = "25fr repeat(" + showIntImpl(n2) + ", 100fr) 25fr";
          return $VDom(
            "Elem",
            Nothing,
            "div",
            [
              id("board-component"),
              $Prop(
                "Handler",
                "dragexit",
                (ev) => $Maybe("Just", $Input("Action", $Action3("BoardOnDragExit", ev)))
              ),
              style(intercalate5("; ")(["grid-template-columns: " + gridTemplate, "grid-template-rows:    " + gridTemplate]))
            ],
            [
              ...arrayBind(rangeImpl(0, n2 - 1 | 0))((i2) => arrayBind(rangeImpl(0, n2 - 1 | 0))((j) => {
                const loc = { x: i2, y: j };
                const $0 = getPieceInfo2(loc)(board2);
                const eitherPieceInfo = (() => {
                  if ($0.tag === "Left") {
                    return $Either("Left", $0._1);
                  }
                  if ($0.tag === "Right") {
                    return $Either("Right", $0._1._1);
                  }
                  fail();
                })();
                return [
                  $VDom(
                    "Elem",
                    Nothing,
                    "div",
                    [
                      $Prop("Attribute", Nothing, "data-location", location2.attrPrint({ x: i2, y: j })),
                      class_("piece"),
                      style(intercalate5("; ")(["grid-area: " + showIntImpl(j + 2 | 0) + " / " + showIntImpl(i2 + 2 | 0)])),
                      (() => {
                        const $1 = LocationOnMouseDown(loc);
                        return $Prop("Handler", "mousedown", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
                      })(),
                      (() => {
                        const $1 = LocationOnMouseOver(loc);
                        return $Prop("Handler", "mouseover", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
                      })(),
                      (() => {
                        const $1 = LocationOnMouseUp(loc);
                        return $Prop("Handler", "mouseup", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
                      })(),
                      (() => {
                        const $1 = LocationOnDragEnter(loc);
                        return $Prop("Handler", "dragenter", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
                      })(),
                      (() => {
                        const $1 = LocationOnDragOver(loc);
                        return $Prop("Handler", "dragover", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
                      })(),
                      $Prop(
                        "Handler",
                        "dragleave",
                        (ev) => $Maybe("Just", $Input("Action", $Action3("LocationOnDragLeave", ev)))
                      ),
                      (() => {
                        const $1 = LocationOnDrop(loc);
                        return $Prop("Handler", "drop", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
                      })()
                    ],
                    [
                      (() => {
                        if (eitherPieceInfo.tag === "Left") {
                          return $VDom(
                            "Elem",
                            Nothing,
                            "span",
                            [class_("piece-location-label")],
                            [$VDom("Text", showLocation.show(loc))]
                          );
                        }
                        if (eitherPieceInfo.tag === "Right") {
                          return slot1($$Proxy)(loc)(component1)({ piece: eitherPieceInfo._1.piece, location: loc })(PieceOutput);
                        }
                        fail();
                      })()
                    ]
                  )
                ];
              })),
              ...fromFoldableImpl(
                foldableMap.foldr,
                functorWithIndexMap.mapWithIndex((dir2) => (portInfo) => $VDom(
                  "Elem",
                  Nothing,
                  "div",
                  [
                    class_("board-port"),
                    $Prop(
                      "Handler",
                      "click",
                      (ev) => $Maybe("Just", $Input("Action", $Action3("ToggleInput", dir2)))
                    ),
                    $Prop("Attribute", Nothing, "data-direction", direction.attrPrint(dir2)),
                    style(intercalate5("; ")([
                      (() => {
                        if (dir2 === "Left") {
                          return "grid-area: " + showIntImpl(intDiv(n2, 2) + 2 | 0) + " / 1";
                        }
                        if (dir2 === "Right") {
                          return "grid-area: " + showIntImpl(intDiv(n2, 2) + 2 | 0) + " / " + showIntImpl(n2 + 2 | 0);
                        }
                        if (dir2 === "Up") {
                          return "grid-area: 1 / " + showIntImpl(intDiv(n2, 2) + 2 | 0);
                        }
                        if (dir2 === "Down") {
                          return "grid-area: " + showIntImpl(n2 + 2 | 0) + " / " + showIntImpl(intDiv(n2, 2) + 2 | 0);
                        }
                        fail();
                      })()
                    ]))
                  ],
                  [
                    $VDom(
                      "Elem",
                      $Maybe("Just", "http://www.w3.org/2000/svg"),
                      "svg",
                      [
                        elem(eqCardinalDirection)(dir2)([Up, Down]) ? viewBox(0)(0)(50)(25) : viewBox(12.5)(-12.5)(25)(50)
                      ],
                      [
                        $VDom(
                          "Elem",
                          $Maybe("Just", "http://www.w3.org/2000/svg"),
                          "g",
                          [
                            transform([
                              $Transform(
                                "Rotate",
                                90 * toNumber((() => {
                                  if (dir2 === "Up") {
                                    return 2;
                                  }
                                  if (dir2 === "Right") {
                                    return 3;
                                  }
                                  if (dir2 === "Down") {
                                    return 4;
                                  }
                                  if (dir2 === "Left") {
                                    return 5;
                                  }
                                  fail();
                                })()),
                                25,
                                12.5
                              )
                            ])
                          ],
                          [
                            renderPathWithEvents(portPath(portInfo))($Action3(
                              "BoardPortOnMouseEnter",
                              dir2
                            ))(BoardPortOnMouseLeave)
                          ]
                        )
                      ]
                    )
                  ]
                ))(boardPortInfo2(state)._1)
              ),
              slot2($$Proxy)()(component22)({})(MultimeterOutput)
            ]
          );
        }
      };
    };
  };

  // output-es/Effect.Now/foreign.js
  function now3() {
    return Date.now();
  }

  // output-es/Effect.Now/index.js
  var nowTime = () => {
    const a$p = now3();
    return toDateTime(a$p)._2;
  };

  // output-es/Component.Chat/foreign.js
  var toLocaleString = (hours) => (minutes) => (seconds) => new Date(2e3, 1, 1, hours - 1, minutes, seconds).toLocaleTimeString();

  // output-es/Component.Chat/index.js
  var $Action6 = (tag, _1) => ({ tag, _1 });
  var gets4 = (f2) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s2) => $Tuple(f2(s2), s2)),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var appendModifying2 = (p2) => (x2) => {
    const $0 = p2((a2) => [...a2, ...x2]);
    return $Free(
      $FreeView(
        "Bind",
        $HalogenF(
          "State",
          (s2) => {
            const s$p = $0(s2);
            return $Tuple(s$p, s$p);
          }
        ),
        (x$1) => $Free($FreeView("Return", x$1), CatNil)
      ),
      snoc(CatNil)((x$1) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var traverse_9 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var modify_4 = (f2) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s2) => $Tuple(void 0, f2(s2))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var Initialise3 = /* @__PURE__ */ $Action6("Initialise");
  var _messages = /* @__PURE__ */ prop({ reflectSymbol: () => "messages" })()()($$Proxy);
  var component7 = (dictMonadAff) => {
    const $0 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
    return {
      eval: mkEval({
        handleQuery: (v) => $Free($FreeView("Return", Nothing), CatNil),
        handleAction: (v) => {
          if (v.tag === "Initialise") {
            const $1 = $0.liftEffect(create);
            return $Free(
              $1._1,
              snoc($1._2)((v1) => {
                const $2 = v1.listener;
                return $Free(
                  $FreeView(
                    "Bind",
                    $HalogenF("Subscribe", (v$1) => (k) => v1.emitter((x2) => k($Action6("NewMessage", x2))), identity11),
                    (x2) => $Free($FreeView("Return", x2), CatNil)
                  ),
                  snoc(CatNil)(() => {
                    const $3 = gets4((v2) => v2.conversation);
                    return $Free(
                      $3._1,
                      snoc($3._2)((conversation) => {
                        const $4 = monadAffHalogenM(dictMonadAff).liftAff(forkAff(conversation($2)));
                        return $Free(
                          $4._1,
                          snoc($4._2)(() => $Free($FreeView("Return", void 0), CatNil))
                        );
                      })
                    );
                  })
                );
              })
            );
          }
          if (v.tag === "NewMessage") {
            const $1 = v._1.html;
            const $2 = v._1.user;
            const $3 = $0.liftEffect(nowTime);
            return $Free(
              $3._1,
              snoc($3._2)((timestamp) => {
                const $4 = appendModifying2(_messages(strongFn))([
                  {
                    timestamp,
                    user: (() => {
                      if ($2.tag === "Nothing") {
                        return "********";
                      }
                      if ($2.tag === "Just") {
                        return $2._1;
                      }
                      fail();
                    })(),
                    html: $VDom("Elem", Nothing, "div", [], $1)
                  }
                ]);
                return $Free(
                  $4._1,
                  snoc($4._2)(() => $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF("GetRef", "chat-component", identity11),
                      (x2) => $Free($FreeView("Return", x2), CatNil)
                    ),
                    snoc(CatNil)(traverse_9((element) => {
                      const $5 = $0.liftEffect(scrollHeight(element));
                      return $Free($5._1, snoc($5._2)((height2) => $0.liftEffect(setScrollTop(height2)(element))));
                    }))
                  ))
                );
              })
            );
          }
          if (v.tag === "OnScroll") {
            const $1 = getHTMLElementRef("chat-component");
            return $Free(
              $1._1,
              snoc($1._2)(traverse_9((element) => {
                const $2 = $0.liftEffect(scrollHeight(element));
                return $Free(
                  $2._1,
                  snoc($2._2)((height2) => {
                    const $3 = $0.liftEffect(scrollTop(element));
                    return $Free($3._1, snoc($3._2)((top) => modify_4((v1) => ({ ...v1, scrollToBottom: height2 === top }))));
                  })
                );
              }))
            );
          }
          fail();
        },
        initialize: $Maybe("Just", Initialise3),
        finalize: Nothing,
        receive: (v) => Nothing
      }),
      initialState: (v) => ({ conversation: v.conversation, messages: [], scrollToBottom: true }),
      render: (state) => $VDom(
        "Elem",
        Nothing,
        "div",
        [
          id("chat-component"),
          $Prop(
            "Ref",
            (x2) => $Maybe(
              "Just",
              $Input(
                "RefUpdate",
                "chat-component",
                (() => {
                  if (x2.tag === "Created") {
                    return $Maybe("Just", x2._1);
                  }
                  if (x2.tag === "Removed") {
                    return Nothing;
                  }
                  fail();
                })()
              )
            )
          ),
          $Prop("Handler", "scroll", (ev) => $Maybe("Just", $Input("Action", $Action6("OnScroll", ev))))
        ],
        [
          $VDom(
            "Elem",
            Nothing,
            "table",
            [],
            arrayMap((v) => $VDom(
              "Elem",
              Nothing,
              "tr",
              [],
              [
                $VDom(
                  "Elem",
                  Nothing,
                  "td",
                  [class_("timestamp")],
                  [$VDom("Text", toLocaleString(v.timestamp._1)(v.timestamp._2)(v.timestamp._3))]
                ),
                $VDom(
                  "Elem",
                  Nothing,
                  "td",
                  [$Prop("Attribute", Nothing, "data-username", v.user), class_("username")],
                  [$VDom("Elem", Nothing, "div", [], [$VDom("Text", v.user)])]
                ),
                $VDom("Elem", Nothing, "td", [class_("message")], [v.html])
              ]
            ))(state.messages)
          )
        ]
      )
    };
  };

  // output-es/Component.Rendering.CompletionStatus/index.js
  var $PortMarkup = (tag) => tag;
  var fromFoldable16 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var tell3 = /* @__PURE__ */ (() => monadTellWriterT(monoidArray)(monadIdentity).tell)();
  var forWithIndex_3 = /* @__PURE__ */ forWithIndex_(/* @__PURE__ */ applicativeWriterT(monoidArray)(applicativeIdentity))(foldableWithIndexMap);
  var None = /* @__PURE__ */ $PortMarkup("None");
  var Expected = /* @__PURE__ */ $PortMarkup("Expected");
  var NotExpected = /* @__PURE__ */ $PortMarkup("NotExpected");
  var toCompletionStatusDiagram = (piece) => {
    const testCompletionStatusDiagram = fromFoldable16([
      $Tuple(Up, { text: "SOme text goes here up", port: { portType: Input, capacity: OneBit }, markup: None }),
      $Tuple(
        Left2,
        { text: "a little text on the left", port: { portType: Input, capacity: OneBit }, markup: Expected }
      ),
      $Tuple(
        Right2,
        { text: "this is the output port", port: { portType: Output, capacity: OneBit }, markup: NotExpected }
      ),
      $Tuple(Down, { text: "text for down", port: { portType: Output, capacity: OneBit }, markup: None })
    ]);
    return (v) => testCompletionStatusDiagram;
  };
  var renderPort = (port2) => (markup) => (rot) => $VDom(
    "Elem",
    $Maybe("Just", "http://www.w3.org/2000/svg"),
    "svg",
    [
      rot === 0 || rot === 2 ? viewBox(0)(0)(50)(25) : viewBox(0)(0)(25)(50),
      class_2((() => {
        if (markup === "None") {
          return "";
        }
        if (markup === "Expected") {
          return "expected";
        }
        if (markup === "NotExpected") {
          return "not-expected";
        }
        fail();
      })())
    ],
    [
      $VDom(
        "Elem",
        $Maybe("Just", "http://www.w3.org/2000/svg"),
        "g",
        [
          transform([
            $Transform(
              "Rotate",
              isInput(port2) ? toNumber(rot) * 90 : toNumber(intMod(rot + 2 | 0)(4)) * 90,
              25,
              12.5
            ),
            rot === 0 || rot === 2 ? $Transform("Translate", 0, 0) : $Transform("Translate", -12.5, -12.5)
          ])
        ],
        [
          renderPath(portPath({
            port: { portType: Input, capacity: OneBit },
            connected: true,
            signal: 1
          }))
        ]
      )
    ]
  );
  var renderCompletionStatusDiagram = (ports) => $VDom(
    "Elem",
    Nothing,
    "div",
    [class_("completion-status-diagram")],
    bindWriterT(semigroupArray)(bindIdentity).bind(tell3([
      $VDom("Elem", Nothing, "div", [class_("centre")], [])
    ]))(() => forWithIndex_3(ports)((dir2) => (v) => tell3([
      $VDom(
        "Elem",
        Nothing,
        "div",
        [
          $Prop("Attribute", Nothing, "data-direction", direction.attrPrint(dir2)),
          class_("port")
        ],
        [renderPort(v.port)(v.markup)(clockwiseRotation(Up)(dir2))]
      ),
      $VDom(
        "Elem",
        Nothing,
        "div",
        [
          $Prop("Attribute", Nothing, "data-direction", direction.attrPrint(dir2)),
          class_("text")
        ],
        [$VDom("Text", v.text)]
      )
    ])))._2
  );

  // output-es/Component.Sidebar/index.js
  var $Action7 = (tag, _1, _2) => ({ tag, _1, _2 });
  var $Output4 = (tag, _1) => ({ tag, _1 });
  var member3 = (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = false;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = ordString.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = true;
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var BoardSizeIncremented = /* @__PURE__ */ $Output4("BoardSizeIncremented");
  var BoardSizeDecremented = /* @__PURE__ */ $Output4("BoardSizeDecremented");
  var TestsTriggered = /* @__PURE__ */ $Output4("TestsTriggered");
  var PieceOnDrop = (value0) => (value1) => $Action7("PieceOnDrop", value0, value1);
  var PieceOnClick = (value0) => (value1) => $Action7("PieceOnClick", value0, value1);
  var BackToLevelSelect = /* @__PURE__ */ $Action7("BackToLevelSelect");
  var IncrementBoardSize2 = /* @__PURE__ */ $Action7("IncrementBoardSize");
  var DecrementBoardSize2 = /* @__PURE__ */ $Action7("DecrementBoardSize");
  var DoNothing = /* @__PURE__ */ $Action7("DoNothing");
  var renderDescription = /* @__PURE__ */ (() => {
    const reduceStrings = (v) => {
      if (v.tag === "Cons") {
        if (v._2.tag === "Cons") {
          if (v._2._1.tag === "Right") {
            if (v._1.tag === "Right") {
              return reduceStrings($List("Cons", $Either("Right", v._1._1 + " " + v._2._1._1), v._2._2));
            }
            if (v._1.tag === "Left") {
              return $List(
                "Cons",
                $Either("Left", v._1._1),
                reduceStrings($List("Cons", $Either("Right", " " + v._2._1._1), v._2._2))
              );
            }
            return $List("Cons", v._1, reduceStrings(v._2));
          }
          if (v._1.tag === "Right" && v._2._1.tag === "Left") {
            return $List(
              "Cons",
              $Either("Right", v._1._1 + " "),
              $List("Cons", $Either("Left", v._2._1._1), reduceStrings(v._2._2))
            );
          }
        }
        return $List("Cons", v._1, reduceStrings(v._2));
      }
      if (v.tag === "Nil") {
        return Nil;
      }
      fail();
    };
    const $0 = listMap((v) => {
      if (v.tag === "Left") {
        return $VDom("Elem", Nothing, "span", [class_("piece-name")], [$VDom("Text", v._1)]);
      }
      if (v.tag === "Right") {
        return $VDom("Text", v._1);
      }
      fail();
    });
    const $1 = listMap((x2) => {
      if (!member3(x2)(pieceVault)) {
        return $Either("Right", x2);
      }
      return $Either("Left", x2);
    });
    const $2 = foldrArray(Cons)(Nil);
    const $3 = split(" ");
    return (x2) => $VDom(
      "Elem",
      Nothing,
      "div",
      [],
      fromFoldableImpl(foldableList.foldr, $0(reduceStrings($1($2($3(x2))))))
    );
  })();
  var component8 = (dictMonadAff) => {
    const navigateTo2 = navigateTo(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    return {
      eval: mkEval({
        finalize: Nothing,
        handleAction: (v) => {
          if (v.tag === "Initialise") {
            const $0 = v._1;
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("State", (v$1) => $Tuple(void 0, $0)),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "PieceOnDrop") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", $Output4("PieceDropped", v._1), void 0),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "PieceOnClick") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", $Output4("PieceAdded", v._1), void 0),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "BackToLevelSelect") {
            return navigateTo2(LevelSelect);
          }
          if (v.tag === "IncrementBoardSize") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", BoardSizeIncremented, void 0),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "DecrementBoardSize") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", BoardSizeDecremented, void 0),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "RunTestsClicked") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", TestsTriggered, void 0),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "DoNothing") {
            return $Free($FreeView("Return", void 0), CatNil);
          }
          fail();
        },
        handleQuery: (v) => $Free($FreeView("Return", Nothing), CatNil),
        initialize: Nothing,
        receive: (x2) => $Maybe("Just", $Action7("Initialise", x2))
      }),
      initialState: (x2) => x2,
      render: (state) => $VDom(
        "Elem",
        Nothing,
        "div",
        [id("sidebar-component")],
        [
          $VDom("Elem", Nothing, "h2", [], [$VDom("Text", state.level.name)]),
          $VDom("Elem", Nothing, "div", [], [renderDescription(state.level.description)]),
          $VDom("Elem", Nothing, "hr", [], []),
          $VDom("Elem", Nothing, "h4", [], [$VDom("Text", "Completion Status")]),
          $VDom(
            "Elem",
            Nothing,
            "span",
            [class_("completion-status")],
            [
              renderCompletionStatusDiagram(toCompletionStatusDiagram(state.level.goal)(state.completionStatus))
            ]
          ),
          $VDom("Elem", Nothing, "h4", [], [$VDom("Text", "Available pieces:")]),
          $VDom(
            "Elem",
            Nothing,
            "span",
            [class_("available-pieces")],
            arrayMap((piece) => $VDom(
              "Elem",
              Nothing,
              "div",
              [
                $Prop("Attribute", Nothing, "data-available-piece", piece.name),
                draggable(true),
                classes(["available-piece"]),
                (() => {
                  const $0 = PieceOnDrop(piece.name);
                  return $Prop("Handler", "dragend", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
                })(),
                (() => {
                  const $0 = PieceOnClick(piece.name);
                  return $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
                })()
              ],
              [
                bifunctorHTML.bimap(functorComponentSlot.map((v) => DoNothing))((v) => DoNothing)(renderPiece(initialState2({
                  piece,
                  location: { x: 0, y: 0 }
                }))),
                $VDom("Text", piece.name)
              ]
            ))(nubBy(ordPiece.compare)(state.level.availablePieces))
          ),
          $VDom("Elem", Nothing, "br", [], []),
          $VDom(
            "Elem",
            Nothing,
            "div",
            [classes(["board-size"])],
            [
              $VDom("Elem", Nothing, "b", [], [$VDom("Text", "Board size")]),
              $VDom(
                "Elem",
                Nothing,
                "div",
                [classes(["buttons"])],
                [
                  state.level.enableBoardSizeChange ? $VDom(
                    "Elem",
                    Nothing,
                    "button",
                    [$Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", DecrementBoardSize2)))],
                    [$VDom("Text", "-")]
                  ) : $VDom("Text", ""),
                  $VDom("Elem", Nothing, "b", [], [$VDom("Text", showIntImpl(state.boardSize))]),
                  state.level.enableBoardSizeChange ? $VDom(
                    "Elem",
                    Nothing,
                    "button",
                    [$Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", IncrementBoardSize2)))],
                    [$VDom("Text", "+")]
                  ) : $VDom("Text", "")
                ]
              )
            ]
          ),
          $VDom(
            "Elem",
            Nothing,
            "div",
            [classes(["give-up"])],
            [
              $VDom(
                "Elem",
                Nothing,
                "button",
                [$Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", BackToLevelSelect)))],
                [$VDom("Text", "Choose another level")]
              )
            ]
          )
        ]
      )
    };
  };

  // output-es/Data.TraversableWithIndex/index.js
  var traversableWithIndexArray = {
    traverseWithIndex: (dictApplicative) => {
      const sequence1 = traversableWithIndexArray.Traversable2().sequence(dictApplicative);
      return (f2) => {
        const $0 = traversableWithIndexArray.FunctorWithIndex0().mapWithIndex(f2);
        return (x2) => sequence1($0(x2));
      };
    },
    FunctorWithIndex0: () => functorWithIndexArray,
    FoldableWithIndex1: () => foldableWithIndexArray,
    Traversable2: () => traversableArray
  };

  // output-es/GlobalState/index.js
  var append = /* @__PURE__ */ unionWith(/* @__PURE__ */ unionWith((v) => (v1) => {
    if (v.tag === "Nothing") {
      return v1;
    }
    if (v1.tag === "Nothing") {
      return v;
    }
    if (v.tag === "Just" && v1.tag === "Just") {
      return $Maybe("Just", semigroupLevelProgress.append(v._1)(v1._1));
    }
    fail();
  }));
  var saveProgress3 = /* @__PURE__ */ saveProgress(localStorageLevelIdLevelP);
  var foldMapWithIndex = /* @__PURE__ */ foldMap(monoidFirst);
  var setLevelProgress = (dictMonadAsk) => {
    const Bind1 = dictMonadAsk.Monad0().Bind1();
    const ask1 = dictMonadAsk.ask;
    return (dictMonadEffect) => (v) => (progress) => {
      const $0 = v.levelName;
      const $1 = v.suiteName;
      const $2 = (() => {
        const $22 = {};
        $22[$0] = $Maybe("Just", progress);
        return $22;
      })();
      const o2 = (() => {
        const $3 = {};
        $3[$1] = $2;
        return $3;
      })();
      return Bind1.bind(dictMonadAsk.Monad0().Bind1().Apply0().Functor0().map((v1) => v1.levelProgress)(ask1))((ref) => Bind1.bind(dictMonadEffect.liftEffect(() => {
        const $3 = ref.value;
        ref.value = append(o2)($3);
      }))(() => dictMonadEffect.liftEffect(saveProgress3(v)(progress))));
    };
  };
  var lookupLevelId = (dictMonadAsk) => {
    const Monad0 = dictMonadAsk.Monad0();
    const ask1 = dictMonadAsk.ask;
    return (dictMonadEffect) => {
      const levelProgress2 = dictMonadAsk.Monad0().Bind1().bind(dictMonadAsk.Monad0().Bind1().Apply0().Functor0().map((v) => v.levelProgress)(ask1))((ref) => dictMonadEffect.liftEffect(() => ref.value));
      return (levelName) => Monad0.Bind1().bind(levelProgress2)((progress) => Monad0.Applicative0().pure(foldMapWithIndex((suiteName) => (levels) => {
        if (Object.hasOwn(levels, levelName)) {
          return $Maybe("Just", { levelName, suiteName });
        }
        return Nothing;
      })(progress)));
    };
  };

  // output-es/Component.Level/index.js
  var $Action8 = (tag, _1) => ({ tag, _1 });
  var boardIsSymbol = { reflectSymbol: () => "board" };
  var slot12 = /* @__PURE__ */ slot()(boardIsSymbol)(ordUnit);
  var slot_2 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "chat" })(ordUnit);
  var slot22 = /* @__PURE__ */ slot()({ reflectSymbol: () => "sidebar" })(ordUnit);
  var getBoardPorts3 = /* @__PURE__ */ getBoardPorts(/* @__PURE__ */ monadStateStateT(monadIdentity));
  var gets5 = (f2) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s2) => $Tuple(f2(s2), s2)),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var tell4 = /* @__PURE__ */ tell2()(boardIsSymbol)(ordUnit);
  var modify_5 = (f2) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s2) => $Tuple(void 0, f2(s2))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var _size4 = /* @__PURE__ */ _size(strongForget);
  var request2 = /* @__PURE__ */ request()(boardIsSymbol)(ordUnit);
  var for_7 = /* @__PURE__ */ for_(freeApplicative)(foldableMaybe);
  var traverse_10 = /* @__PURE__ */ traverse_(freeApplicative);
  var traverse_13 = /* @__PURE__ */ traverse_10(foldableMaybe);
  var show12 = (v) => {
    if (v.tag === "Just") {
      return "(Just " + showLocation.show(v._1) + ")";
    }
    if (v.tag === "Nothing") {
      return "Nothing";
    }
    fail();
  };
  var applicativeExceptT2 = /* @__PURE__ */ applicativeExceptT(freeMonad);
  var forWithIndex2 = /* @__PURE__ */ (() => {
    const $0 = traversableWithIndexArray.traverseWithIndex(applicativeExceptT2);
    return (b) => (a2) => $0(a2)(b);
  })();
  var bindExceptT2 = /* @__PURE__ */ bindExceptT(freeMonad);
  var modify_1 = /* @__PURE__ */ (() => {
    const $0 = monadStateExceptT(monadStateHalogenM);
    return (f2) => $0.state((s2) => $Tuple(void 0, f2(s2)));
  })();
  var runSingleTest2 = /* @__PURE__ */ runSingleTest(freeMonad);
  var traverse_23 = /* @__PURE__ */ traverse_10(foldableArray);
  var Initialise4 = /* @__PURE__ */ $Action8("Initialise");
  var BoardOutput = (value0) => $Action8("BoardOutput", value0);
  var SidebarOutput = (value0) => $Action8("SidebarOutput", value0);
  var component9 = (dictMonadAff) => {
    const component1 = component7(dictMonadAff);
    const component22 = component8(dictMonadAff);
    const MonadEffect0 = dictMonadAff.MonadEffect0();
    const lift1 = monadTransHalogenM.lift(MonadEffect0.Monad0());
    const monadEffectHalogenM2 = monadEffectHalogenM(MonadEffect0);
    return (dictMonadAsk) => {
      const monadAskHalogenM = {
        ask: $Free(
          $FreeView(
            "Bind",
            $HalogenF("Lift", dictMonadAsk.ask),
            (x2) => $Free($FreeView("Return", x2), CatNil)
          ),
          CatNil
        ),
        Monad0: () => freeMonad
      };
      const setLevelProgress2 = setLevelProgress(monadAskHalogenM)(monadEffectHalogenM2);
      const lookupLevelId2 = lookupLevelId(monadAskHalogenM)(monadEffectHalogenM2);
      return (dictMonadLogger) => {
        const component32 = component6(dictMonadLogger)(dictMonadAff);
        const debug2 = log$p(dictMonadLogger)(Debug);
        return {
          eval: mkEval({
            finalize: Nothing,
            handleAction: (v) => {
              if (v.tag === "Initialise") {
                const $0 = gets5((v1) => v1.level);
                return $Free(
                  $0._1,
                  snoc($0._2)((v1) => {
                    const $1 = lift1(debug2(Leaf2)("initialised level " + showStringImpl(v1.name)));
                    return $Free(
                      $1._1,
                      snoc($1._2)(() => {
                        const $2 = v1.goal;
                        return tell4($$Proxy)()((v2) => $Query("SetGoalPorts", $2.ports));
                      })
                    );
                  })
                );
              }
              if (v.tag === "BoardOutput") {
                const $0 = v._1._1;
                const $1 = gets5((v1) => v1.level);
                return $Free(
                  $1._1,
                  snoc($1._2)((level) => modify_5((v1) => ({
                    ...v1,
                    completionStatus: isReadyForTesting(level)($0),
                    boardSize: _size4(identity14)($0),
                    boardPorts: getBoardPorts3($0)._1
                  })))
                );
              }
              if (v.tag === "SidebarOutput") {
                if (v._1.tag === "PieceDropped") {
                  const $0 = v._1._1;
                  const $1 = request2($$Proxy)()(GetMouseOverLocation);
                  return $Free(
                    $1._1,
                    snoc($1._2)((maybeLocation) => for_7(maybeLocation)((loc) => tell4($$Proxy)()((v1) => $Query(
                      "AddPiece",
                      loc,
                      pieceLookup($0)
                    ))))
                  );
                }
                if (v._1.tag === "PieceAdded") {
                  const $0 = v._1._1;
                  const $1 = request2($$Proxy)()(GetBoard);
                  return $Free(
                    $1._1,
                    snoc($1._2)(traverse_13((board2) => {
                      const $2 = monadEffectHalogenM2.liftEffect(log2(show12(firstEmptyLocation(board2))));
                      return $Free(
                        $2._1,
                        snoc($2._2)(() => for_7(firstEmptyLocation(board2))((loc) => tell4($$Proxy)()((v1) => $Query(
                          "AddPiece",
                          loc,
                          pieceLookup($0)
                        ))))
                      );
                    }))
                  );
                }
                if (v._1.tag === "BoardSizeIncremented") {
                  const $0 = request2($$Proxy)()(IncrementBoardSize);
                  return $Free(
                    $0._1,
                    snoc($0._2)((x2) => $Free($FreeView("Return", void 0), CatNil))
                  );
                }
                if (v._1.tag === "BoardSizeDecremented") {
                  const $0 = request2($$Proxy)()(DecrementBoardSize);
                  return $Free(
                    $0._1,
                    snoc($0._2)((x2) => $Free($FreeView("Return", void 0), CatNil))
                  );
                }
                if (v._1.tag === "TestsTriggered") {
                  const $0 = gets5((v1) => v1.level);
                  return $Free(
                    $0._1,
                    snoc($0._2)((v1) => {
                      const numTests = v1.testCases.length;
                      const delayDuration = toNumber(intDiv(2e3, numTests));
                      const $1 = forWithIndex2(v1.testCases)((testIndex) => (testCase) => bindExceptT2.bind(modify_1((v2) => ({ ...v2, completionStatus: $CompletionStatus("RunningTest", { testIndex, numTests }) })))(() => bindExceptT2.bind(runSingleTest2(v1.goal)(testIndex)(testCase)((inputs) => {
                        const $12 = request2($$Proxy)()(SetInputs(inputs));
                        return $Free(
                          $12._1,
                          snoc($12._2)((x2) => $Free(
                            $FreeView(
                              "Return",
                              (() => {
                                if (x2.tag === "Nothing") {
                                  return Leaf2;
                                }
                                if (x2.tag === "Just") {
                                  return x2._1;
                                }
                                fail();
                              })()
                            ),
                            CatNil
                          ))
                        );
                      }))((res) => bindExceptT2.bind(monadAffExceptT(monadAffHalogenM(dictMonadAff)).liftAff(_delay(
                        Right,
                        delayDuration
                      )))(() => applicativeExceptT2.pure(res)))));
                      return $Free(
                        $1._1,
                        snoc($1._2)((testResult) => {
                          if (testResult.tag === "Left") {
                            const $2 = testResult._1;
                            return modify_5((v2) => ({ ...v2, completionStatus: $CompletionStatus("FailedTestCase", $2) }));
                          }
                          if (testResult.tag === "Right") {
                            const $2 = modify_5((v2) => ({ ...v2, completionStatus: Completed2 }));
                            return $Free(
                              $2._1,
                              snoc($2._2)(() => {
                                const $3 = gets5((v2) => v2.levelId);
                                return $Free(
                                  $3._1,
                                  snoc($3._2)((levelId) => {
                                    const $4 = setLevelProgress2(levelId)(Completed);
                                    return $Free(
                                      $4._1,
                                      snoc($4._2)(() => {
                                        const $5 = gets5((x2) => x2.level.unlocksUponCompletion);
                                        return $Free(
                                          $5._1,
                                          snoc($5._2)(traverse_23((v2) => {
                                            const $6 = lookupLevelId2(v2.name);
                                            return $Free(
                                              $6._1,
                                              snoc($6._2)(traverse_13((id4) => setLevelProgress2(id4)(Unlocked)))
                                            );
                                          }))
                                        );
                                      })
                                    );
                                  })
                                );
                              })
                            );
                          }
                          fail();
                        })
                      );
                    })
                  );
                }
              }
              fail();
            },
            handleQuery: (v) => $Free($FreeView("Return", Nothing), CatNil),
            initialize: $Maybe("Just", Initialise4),
            receive: (v) => Nothing
          }),
          initialState: (v) => ({ level: v.level, levelId: v.levelId, completionStatus: NotStarted, boardSize: 3, boardPorts: getBoardPorts3(standardBoard)._1 }),
          render: (v) => $VDom(
            "Elem",
            Nothing,
            "div",
            [id("puzzle-component")],
            [
              slot12($$Proxy)()(component32)({ board: standardBoard })(BoardOutput),
              slot_2($$Proxy)()(component1)({ conversation: v.level.conversation }),
              slot22($$Proxy)()(component22)({ level: v.level, completionStatus: v.completionStatus, boardSize: v.boardSize, boardPorts: v.boardPorts })(SidebarOutput)
            ]
          )
        };
      };
    };
  };

  // output-es/Component.LevelSelect/index.js
  var $Action9 = (tag, _1) => ({ tag, _1 });
  var toUnfoldable5 = /* @__PURE__ */ (() => {
    const $0 = toArrayWithKey(Tuple);
    return (x2) => toUnfoldable(unfoldableArray)($0(x2));
  })();
  var maximum = /* @__PURE__ */ (() => maximumBy(foldableObject)(ordMaybe(ordLevelProgress).compare))();
  var modify_6 = (f2) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s2) => $Tuple(void 0, f2(s2))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var Initialise5 = /* @__PURE__ */ $Action9("Initialise");
  var component10 = (dictMonadAsk) => {
    const monadAskHalogenM = {
      ask: $Free(
        $FreeView(
          "Bind",
          $HalogenF("Lift", dictMonadAsk.ask),
          (x2) => $Free($FreeView("Return", x2), CatNil)
        ),
        CatNil
      ),
      Monad0: () => freeMonad
    };
    const ask1 = monadAskHalogenM.ask;
    const setLevelProgress2 = setLevelProgress(monadAskHalogenM);
    return (dictMonadEffect) => {
      const monadEffectHalogenM2 = monadEffectHalogenM(dictMonadEffect);
      const levelProgress1 = monadAskHalogenM.Monad0().Bind1().bind(monadAskHalogenM.Monad0().Bind1().Apply0().Functor0().map((v) => v.levelProgress)(ask1))((ref) => monadEffectHalogenM2.liftEffect(() => ref.value));
      const setLevelProgress1 = setLevelProgress2(monadEffectHalogenM2);
      return {
        eval: mkEval({
          ...defaultEval,
          handleAction: (v1) => {
            if (v1.tag === "Initialise") {
              return $Free(levelProgress1._1, snoc(levelProgress1._2)((progress) => modify_6((v2) => ({ ...v2, levelProgress: progress }))));
            }
            if (v1.tag === "NavigateTo") {
              const $0 = v1._1.levelName;
              const $1 = v1._1.suiteName;
              const $2 = setLevelProgress1(v1._1)(Incomplete);
              return $Free(
                $2._1,
                snoc($2._2)(() => navigateTo(monadEffectHalogenM2)($Route("Level", $1, $0)))
              );
            }
            fail();
          },
          initialize: $Maybe("Just", Initialise5)
        }),
        initialState: (v) => ({ levelProgress: empty }),
        render: (state) => defaultLayout($VDom(
          "Elem",
          Nothing,
          "div",
          [id("puzzle-select-component")],
          [
            $VDom("Elem", Nothing, "h1", [], [$VDom("Text", "Level Select")]),
            $VDom(
              "Elem",
              Nothing,
              "div",
              [class_("level-suites")],
              arrayBind(toUnfoldable5(state.levelProgress))((v) => {
                const $0 = v._1;
                return [
                  $VDom(
                    "Elem",
                    Nothing,
                    "div",
                    [class_("level-suite")],
                    [
                      $VDom(
                        "Elem",
                        Nothing,
                        "h2",
                        [],
                        [
                          $VDom("Text", $0),
                          (() => {
                            const $1 = maximum(v._2);
                            const $2 = (() => {
                              if ($1.tag === "Just") {
                                return $1._1;
                              }
                              if ($1.tag === "Nothing") {
                                return Nothing;
                              }
                              fail();
                            })();
                            if ($2.tag === "Just") {
                              if ($2._1 === "Completed") {
                                return $VDom(
                                  "Elem",
                                  Nothing,
                                  "span",
                                  [$Prop("Attribute", Nothing, "data-puzzle-progress", "completed")],
                                  [$VDom("Text", "  \u2714")]
                                );
                              }
                              if ($2._1 === "Incomplete") {
                                return $VDom(
                                  "Elem",
                                  Nothing,
                                  "span",
                                  [$Prop("Attribute", Nothing, "data-puzzle-progress", "incomplete")],
                                  [$VDom("Text", " \u2736")]
                                );
                              }
                              if ($2._1 === "Unlocked") {
                                return $VDom(
                                  "Elem",
                                  Nothing,
                                  "span",
                                  [$Prop("Attribute", Nothing, "data-puzzle-progress", "unlocked")],
                                  []
                                );
                              }
                              fail();
                            }
                            if ($2.tag === "Nothing") {
                              return $VDom("Text", "\u{1F512}");
                            }
                            fail();
                          })()
                        ]
                      ),
                      $VDom(
                        "Elem",
                        Nothing,
                        "ul",
                        [],
                        arrayBind(toUnfoldable5(v._2))((v1) => {
                          const $1 = v1._1;
                          const $2 = v1._2;
                          return arrayBind((() => {
                            if ($2.tag === "Nothing") {
                              return false;
                            }
                            if ($2.tag === "Just") {
                              return true;
                            }
                            fail();
                          })() ? [void 0] : [])(() => [
                            $VDom(
                              "Elem",
                              Nothing,
                              "li",
                              [],
                              [
                                $VDom(
                                  "Elem",
                                  Nothing,
                                  "a",
                                  [
                                    $Prop(
                                      "Handler",
                                      "click",
                                      (ev) => $Maybe("Just", $Input("Action", $Action9("NavigateTo", { suiteName: $0, levelName: $1 })))
                                    )
                                  ],
                                  [
                                    $VDom("Text", $1),
                                    (() => {
                                      if ($2.tag === "Just") {
                                        if ($2._1 === "Completed") {
                                          return $VDom(
                                            "Elem",
                                            Nothing,
                                            "span",
                                            [$Prop("Attribute", Nothing, "data-puzzle-progress", "completed")],
                                            [$VDom("Text", "  \u2714")]
                                          );
                                        }
                                        if ($2._1 === "Incomplete") {
                                          return $VDom(
                                            "Elem",
                                            Nothing,
                                            "span",
                                            [$Prop("Attribute", Nothing, "data-puzzle-progress", "incomplete")],
                                            [$VDom("Text", " \u2736")]
                                          );
                                        }
                                        if ($2._1 === "Unlocked") {
                                          return $VDom(
                                            "Elem",
                                            Nothing,
                                            "span",
                                            [$Prop("Attribute", Nothing, "data-puzzle-progress", "unlocked")],
                                            []
                                          );
                                        }
                                        fail();
                                      }
                                      if ($2.tag === "Nothing") {
                                        return $VDom("Text", "\u{1F512}");
                                      }
                                      fail();
                                    })()
                                  ]
                                )
                              ]
                            )
                          ]);
                        })
                      )
                    ]
                  )
                ];
              })
            )
          ]
        ))
      };
    };
  };

  // output-es/Component.Routes/index.js
  var $Query4 = (_1, _2) => ({ tag: "Navigate", _1, _2 });
  var slot_1 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "home" })(ordUnit);
  var slot_22 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "about" })(ordUnit);
  var slot_3 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "instructions" })(ordUnit);
  var slot_4 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "levelSelect" })(ordUnit);
  var slot_5 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "level" })(ordUnit);
  var modify_7 = (f2) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s2) => $Tuple(void 0, f2(s2))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var component11 = (dictMonadAff) => {
    const component1 = component2(dictMonadAff);
    const component22 = component(dictMonadAff);
    const component32 = component3(dictMonadAff);
    const MonadEffect0 = dictMonadAff.MonadEffect0();
    const component42 = component9(dictMonadAff);
    const lift1 = monadTransHalogenM.lift(MonadEffect0.Monad0());
    return (dictMonadAsk) => {
      const component52 = component10(dictMonadAsk)(MonadEffect0);
      const component62 = component42(dictMonadAsk);
      return (dictMonadLogger) => {
        const component72 = component62(dictMonadLogger);
        const debug2 = log$p(dictMonadLogger)(Debug);
        return {
          eval: mkEval({
            finalize: Nothing,
            handleAction: (v) => $Free($FreeView("Return", void 0), CatNil),
            handleQuery: (v) => {
              const $0 = v._2;
              const $1 = v._1;
              const $2 = lift1(debug2(Leaf2)("Navigated to " + printPath(routeCodec._1($1)(emptyRouteState))));
              return $Free(
                $2._1,
                snoc($2._2)(() => {
                  const $3 = modify_7((v1) => ({ ...v1, route: $1 }));
                  return $Free(
                    $3._1,
                    snoc($3._2)(() => $Free($FreeView("Return", $Maybe("Just", $0)), CatNil))
                  );
                })
              );
            },
            initialize: Nothing,
            receive: (v) => Nothing
          }),
          initialState: (v) => ({ route: Home }),
          render: (v) => {
            if (v.route.tag === "Home") {
              return slot_1($$Proxy)()(component1)();
            }
            if (v.route.tag === "About") {
              return slot_22($$Proxy)()(component22)();
            }
            if (v.route.tag === "Instructions") {
              return slot_3($$Proxy)()(component32)();
            }
            if (v.route.tag === "LevelSelect") {
              return slot_4($$Proxy)()(component52)();
            }
            if (v.route.tag === "Level") {
              const $0 = _lookup(Nothing, Just, v.route._1, allLevelSuites);
              if ($0.tag === "Just") {
                const $1 = _lookup(Nothing, Just, v.route._2, $0._1.levels);
                if ($1.tag === "Just") {
                  return slot_5($$Proxy)()(component72)({ levelId: { suiteName: v.route._1, levelName: v.route._2 }, level: $1._1 });
                }
                if ($1.tag === "Nothing") {
                  return $VDom("Text", "coublent find tht roblem");
                }
                fail();
              }
              if ($0.tag === "Nothing") {
                return $VDom("Text", "coublent find tht roblem");
              }
            }
            fail();
          }
        };
      };
    };
  };

  // output-es/Halogen.Aff.Util/index.js
  var selectElement = (query2) => _bind(_liftEffect((() => {
    const $0 = querySelector(query2);
    return () => {
      const $1 = windowImpl();
      const $2 = document2($1)();
      return $0($2)();
    };
  })()))((mel) => _pure((() => {
    if (mel.tag === "Just") {
      return _read(Nothing, Just, mel._1);
    }
    if (mel.tag === "Nothing") {
      return Nothing;
    }
    fail();
  })()));
  var runHalogenAff = /* @__PURE__ */ runAff_((v2) => {
    if (v2.tag === "Left") {
      return throwException(v2._1);
    }
    if (v2.tag === "Right") {
      return () => {
      };
    }
    fail();
  });
  var awaitLoad = /* @__PURE__ */ makeAff((callback) => () => {
    const $0 = windowImpl();
    const $1 = document2($0)();
    const rs = readyState($1)();
    if (rs === "Loading") {
      const et = windowImpl();
      const listener = eventListener((v) => callback($Either("Right", void 0)))();
      addEventListener2("DOMContentLoaded")(listener)(false)(et)();
      const $2 = _liftEffect(removeEventListener2("DOMContentLoaded")(listener)(false)(et));
      return (v) => $2;
    }
    callback($Either("Right", void 0))();
    return nonCanceler;
  });

  // output-es/Data.Coyoneda/index.js
  var $CoyonedaF = (_1, _2) => ({ tag: "CoyonedaF", _1, _2 });

  // output-es/Effect.Ref/foreign.js
  var modifyImpl2 = function(f2) {
    return function(ref) {
      return function() {
        var t2 = f2(ref.value);
        ref.value = t2.state;
        return t2.value;
      };
    };
  };

  // output-es/Halogen.Query.HalogenQ/index.js
  var $HalogenQ = (tag, _1, _2) => ({ tag, _1, _2 });

  // output-es/Halogen.Aff.Driver.Eval/index.js
  var traverse_11 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var traverse_14 = /* @__PURE__ */ traverse_(applicativeAff);
  var traverse_24 = /* @__PURE__ */ traverse_14(foldableList);
  var parSequence_ = /* @__PURE__ */ parTraverse_(parallelAff)(applicativeParAff)(foldableList)(identity3);
  var traverse_32 = /* @__PURE__ */ traverse_14(foldableMaybe);
  var foldFree2 = /* @__PURE__ */ foldFree(monadRecAff);
  var alter2 = /* @__PURE__ */ alter(ordString);
  var unsubscribe2 = (sid) => (ref) => () => {
    const v = ref.value;
    const subs = v.subscriptions.value;
    return traverse_11(unsubscribe)((() => {
      const $0 = lookup(ordInt)(sid);
      if (subs.tag === "Just") {
        return $0(subs._1);
      }
      if (subs.tag === "Nothing") {
        return Nothing;
      }
      fail();
    })())();
  };
  var queueOrRun = (ref) => (au) => _bind(_liftEffect(() => ref.value))((v) => {
    if (v.tag === "Nothing") {
      return au;
    }
    if (v.tag === "Just") {
      return _liftEffect(() => ref.value = $Maybe("Just", $List("Cons", au, v._1)));
    }
    fail();
  });
  var handleLifecycle = (lchs) => (f2) => _bind(_liftEffect(() => lchs.value = { initializers: Nil, finalizers: Nil }))(() => _bind(_liftEffect(f2))((result) => _bind(_liftEffect(() => lchs.value))((v) => {
    const $0 = v.initializers;
    return _bind(traverse_24(forkAff)(v.finalizers))(() => _bind(parSequence_($0))(() => _pure(result)));
  })));
  var handleAff = /* @__PURE__ */ runAff_((v2) => {
    if (v2.tag === "Left") {
      return throwException(v2._1);
    }
    if (v2.tag === "Right") {
      return () => {
      };
    }
    fail();
  });
  var fresh = (f2) => (ref) => _bind(_liftEffect(() => ref.value))((v) => _liftEffect(modifyImpl2((i2) => ({ state: i2 + 1 | 0, value: f2(i2) }))(v.fresh)));
  var evalQ = (render) => (ref) => (q) => _bind(_liftEffect(() => ref.value))((v) => evalM(render)(ref)(v.component.eval($HalogenQ(
    "Query",
    $CoyonedaF((x2) => $Maybe("Just", x2), q),
    (v$1) => Nothing
  ))));
  var evalM = (render) => (initRef) => (v) => foldFree2((v1) => {
    if (v1.tag === "State") {
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const v3 = v1._1(v2.state);
        if (reallyUnsafeRefEq(v2.state)(v3._2)) {
          return _pure(v3._1);
        }
        const $0 = v3._1;
        return _bind(_liftEffect((() => {
          const $1 = { ...v2, state: v3._2 };
          return () => initRef.value = $1;
        })()))(() => _bind(handleLifecycle(v2.lifecycleHandlers)(render(v2.lifecycleHandlers)(initRef)))(() => _pure($0)));
      });
    }
    if (v1.tag === "Subscribe") {
      return _bind(fresh(SubscriptionId)(initRef))((sid) => _bind(_liftEffect(v1._1(sid)((x2) => {
        const $0 = handleAff(evalF(render)(initRef)($Input("Action", x2)));
        return () => {
          $0();
        };
      })))((finalize) => _bind(_liftEffect(() => initRef.value))((v2) => _bind(_liftEffect((() => {
        const $0 = functorMaybe.map(insert(ordInt)(sid)(finalize));
        const $1 = v2.subscriptions;
        return () => {
          const $2 = $1.value;
          $1.value = $0($2);
        };
      })()))(() => _pure(v1._2(sid))))));
    }
    if (v1.tag === "Unsubscribe") {
      const $0 = v1._2;
      return _bind(_liftEffect(unsubscribe2(v1._1)(initRef)))(() => _pure($0));
    }
    if (v1.tag === "Lift") {
      return v1._1;
    }
    if (v1.tag === "ChildQuery") {
      const $0 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v1$1) => {
        const $1 = $0._2;
        return _map($0._3)(_sequential($0._1(applicativeParAff)((v3) => _bind(_liftEffect(() => v3.value))((dsx) => evalQ(render)(dsx.selfRef)($1)))(v1$1.children)));
      });
    }
    if (v1.tag === "Raise") {
      const $0 = v1._2;
      const $1 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const $2 = v2.handlerRef;
        const $3 = v2.pendingOuts;
        return _bind(_liftEffect(() => $2.value))((handler) => _bind(queueOrRun($3)(handler($1)))(() => _pure($0)));
      });
    }
    if (v1.tag === "Par") {
      return _sequential(foldFreeAp(applicativeParAff)(identity10)((() => {
        const $0 = evalM(render)(initRef);
        return foldFreeAp(applicativeFreeAp)((x2) => $FreeAp("Lift", $0(x2)))(v1._1);
      })()));
    }
    if (v1.tag === "Fork") {
      const $0 = v1._1;
      return _bind(fresh(ForkId)(initRef))((fid) => _bind(_liftEffect(() => initRef.value))((v2) => {
        const $1 = v2.forks;
        return _bind(_liftEffect(() => ({ value: false })))((doneRef) => _bind(forkAff($$finally(_liftEffect((() => {
          const $2 = $$delete(ordInt)(fid);
          return () => {
            const $3 = $1.value;
            $1.value = $2($3);
            return doneRef.value = true;
          };
        })()))(evalM(render)(initRef)($0))))((fiber) => _bind(_liftEffect((() => {
          const $2 = insert(ordInt)(fid)(fiber);
          return () => {
            const b = doneRef.value;
            if (!b) {
              const $3 = $1.value;
              $1.value = $2($3);
              return;
            }
            if (b) {
              return;
            }
            fail();
          };
        })()))(() => _pure(v1._2(fid)))));
      }));
    }
    if (v1.tag === "Join") {
      const $0 = v1._2;
      const $1 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const $2 = v2.forks;
        return _bind(_liftEffect(() => $2.value))((forkMap) => _bind(traverse_32(joinFiber)(lookup(ordInt)($1)(forkMap)))(() => _pure($0)));
      });
    }
    if (v1.tag === "Kill") {
      const $0 = v1._2;
      const $1 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const $2 = v2.forks;
        return _bind(_liftEffect(() => $2.value))((forkMap) => _bind(traverse_32(killFiber(error("Cancelled")))(lookup(ordInt)($1)(forkMap)))(() => _pure($0)));
      });
    }
    if (v1.tag === "GetRef") {
      const $0 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => _pure(v1._2(lookup(ordString)($0)(v2.refs))));
    }
    fail();
  })(v);
  var evalF = (render) => (ref) => (v) => {
    if (v.tag === "RefUpdate") {
      const $0 = v._2;
      const $1 = v._1;
      return _liftEffect(() => {
        const $2 = ref.value;
        ref.value = { ...$2, refs: alter2((v$1) => $0)($1)($2.refs) };
      });
    }
    if (v.tag === "Action") {
      const $0 = v._1;
      return _bind(_liftEffect(() => ref.value))((v1) => evalM(render)(ref)(v1.component.eval($HalogenQ("Action", $0, void 0))));
    }
    fail();
  };

  // output-es/Halogen.Aff.Driver.State/index.js
  var initDriverState = (component13) => (input) => (handler) => (lchs) => () => {
    const selfRef = { value: {} };
    const childrenIn = { value: Leaf2 };
    const childrenOut = { value: Leaf2 };
    const handlerRef = { value: handler };
    const pendingQueries = { value: $Maybe("Just", Nil) };
    const pendingOuts = { value: $Maybe("Just", Nil) };
    const pendingHandlers = { value: Nothing };
    const fresh2 = { value: 1 };
    const subscriptions = { value: $Maybe("Just", Leaf2) };
    const forks = { value: Leaf2 };
    selfRef.value = {
      component: component13,
      state: component13.initialState(input),
      refs: Leaf2,
      children: Leaf2,
      childrenIn,
      childrenOut,
      selfRef,
      handlerRef,
      pendingQueries,
      pendingOuts,
      pendingHandlers,
      rendering: Nothing,
      fresh: fresh2,
      subscriptions,
      forks,
      lifecycleHandlers: lchs
    };
    return selfRef;
  };

  // output-es/Halogen.Aff.Driver/index.js
  var for_8 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
  var traverse_15 = /* @__PURE__ */ traverse_(applicativeAff)(foldableList);
  var traverse_16 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_25 = /* @__PURE__ */ traverse_16(foldableMaybe);
  var traverse_33 = /* @__PURE__ */ traverse_16(foldableMap);
  var parSequence_2 = /* @__PURE__ */ parTraverse_(parallelAff)(applicativeParAff)(foldableList)(identity3);
  var foreachSlot2 = /* @__PURE__ */ foreachSlot(applicativeEffect);
  var renderStateX_ = /* @__PURE__ */ (() => {
    const traverse_$1 = traverse_(applicativeEffect)(foldableMaybe);
    return (f2) => (st) => traverse_$1(f2)(st.rendering);
  })();
  var newLifecycleHandlers = () => ({ value: { initializers: Nil, finalizers: Nil } });
  var handlePending = (ref) => () => {
    const queue = ref.value;
    ref.value = Nothing;
    return for_8(queue)((() => {
      const $0 = traverse_15(forkAff);
      return (x2) => handleAff($0(reverse(x2)));
    })())();
  };
  var cleanupSubscriptionsAndForks = (v) => {
    const $0 = traverse_25(traverse_33(unsubscribe));
    const $1 = v.subscriptions;
    return () => {
      const $2 = $1.value;
      $0($2)();
      v.subscriptions.value = Nothing;
      const $3 = v.forks.value;
      traverse_33((() => {
        const $4 = killFiber(error("finalized"));
        return (x2) => handleAff($4(x2));
      })())($3)();
      return v.forks.value = Leaf2;
    };
  };
  var runUI = (renderSpec2) => (component13) => (i2) => {
    const squashChildInitializers = (lchs) => (preInits) => (st) => {
      const parentInitializer = evalM(render)(st.selfRef)(st.component.eval($HalogenQ("Initialize", void 0)));
      return () => {
        const $0 = lchs.value;
        lchs.value = {
          initializers: $List(
            "Cons",
            _bind(parSequence_2(reverse($0.initializers)))(() => _bind(parentInitializer)(() => _liftEffect((() => {
              const $1 = handlePending(st.pendingQueries);
              return () => {
                $1();
                return handlePending(st.pendingOuts)();
              };
            })()))),
            preInits
          ),
          finalizers: $0.finalizers
        };
      };
    };
    const runComponent = (lchs) => (handler) => (j) => (c2) => () => {
      const lchs$p = newLifecycleHandlers();
      const $$var = initDriverState(c2)(j)(handler)(lchs$p)();
      const pre = lchs.value;
      lchs.value = { initializers: Nil, finalizers: pre.finalizers };
      const $0 = $$var.value;
      render(lchs)($0.selfRef)();
      const $1 = $$var.value;
      squashChildInitializers(lchs)(pre.initializers)($1)();
      return $$var;
    };
    const renderChild = (lchs) => (handler) => (childrenInRef) => (childrenOutRef) => (slot3) => () => {
      const a$p = childrenInRef.value;
      const childrenIn = slot3.pop(a$p);
      const $$var = (() => {
        if (childrenIn.tag === "Just") {
          childrenInRef.value = childrenIn._1._2;
          const dsx = childrenIn._1._1.value;
          const $02 = _pure();
          dsx.handlerRef.value = (x2) => {
            const $12 = slot3.output(x2);
            if ($12.tag === "Nothing") {
              return $02;
            }
            if ($12.tag === "Just") {
              return handler($12._1);
            }
            fail();
          };
          handleAff(evalM(render)(dsx.selfRef)(dsx.component.eval($HalogenQ(
            "Receive",
            slot3.input,
            void 0
          ))))();
          return childrenIn._1._1;
        }
        if (childrenIn.tag === "Nothing") {
          return runComponent(lchs)((() => {
            const $02 = _pure();
            return (x2) => {
              const $12 = slot3.output(x2);
              if ($12.tag === "Nothing") {
                return $02;
              }
              if ($12.tag === "Just") {
                return handler($12._1);
              }
              fail();
            };
          })())(slot3.input)(slot3.component)();
        }
        fail();
      })();
      const a$p$1 = childrenOutRef.value;
      const $0 = warn("Halogen: Duplicate slot address was detected during rendering, unexpected results may occur");
      if ((() => {
        const $12 = slot3.get(a$p$1);
        if ($12.tag === "Nothing") {
          return false;
        }
        if ($12.tag === "Just") {
          return true;
        }
        fail();
      })()) {
        $0();
      }
      const $1 = childrenOutRef.value;
      childrenOutRef.value = slot3.set($$var)($1);
      const $2 = $$var.value;
      if ($2.rendering.tag === "Nothing") {
        return throwException(error("Halogen internal error: child was not initialized in renderChild"))();
      }
      if ($2.rendering.tag === "Just") {
        return renderSpec2.renderChild($2.rendering._1);
      }
      fail();
    };
    const render = (lchs) => ($$var) => () => {
      const v = $$var.value;
      const a$p = v.pendingHandlers.value;
      const shouldProcessHandlers = (() => {
        if (a$p.tag === "Nothing") {
          return true;
        }
        if (a$p.tag === "Just") {
          return false;
        }
        fail();
      })();
      if (shouldProcessHandlers) {
        v.pendingHandlers.value = $Maybe("Just", Nil);
      }
      v.childrenOut.value = Leaf2;
      v.childrenIn.value = v.children;
      const $0 = v.pendingHandlers;
      const rendering = renderSpec2.render((() => {
        const $12 = _map((v$1) => {
        });
        return (x2) => handleAff(queueOrRun($0)($12(evalF(render)(v.selfRef)(x2))));
      })())(renderChild(lchs)((() => {
        const $12 = _map((v$1) => {
        });
        return (x2) => queueOrRun(v.pendingQueries)(queueOrRun($0)($12(evalF(render)(v.selfRef)($Input(
          "Action",
          x2
        )))));
      })())(v.childrenIn)(v.childrenOut))(v.component.render(v.state))(v.rendering)();
      const children2 = v.childrenOut.value;
      const childrenIn = v.childrenIn.value;
      foreachSlot2(childrenIn)((v1) => () => {
        const childDS = v1.value;
        renderStateX_(renderSpec2.removeChild)(childDS)();
        return finalize(lchs)(childDS)();
      })();
      const $1 = v.selfRef.value;
      v.selfRef.value = { ...$1, rendering: $Maybe("Just", rendering), children: children2 };
      const $2 = monadRecEffect.tailRecM((v1) => () => {
        const handlers = $0.value;
        $0.value = $Maybe("Just", Nil);
        traverse_25((() => {
          const $22 = traverse_15(forkAff);
          return (x2) => handleAff($22(reverse(x2)));
        })())(handlers)();
        const mmore = $0.value;
        if ((() => {
          if (mmore.tag === "Nothing") {
            return false;
          }
          if (mmore.tag === "Just") {
            return mmore._1.tag === "Nil";
          }
          fail();
        })()) {
          $0.value = Nothing;
          return $Step("Done", void 0);
        }
        return $Step("Loop", void 0);
      })();
      if (shouldProcessHandlers) {
        return $2();
      }
    };
    const finalize = (lchs) => (st) => {
      const $0 = cleanupSubscriptionsAndForks(st);
      return () => {
        $0();
        const $1 = lchs.value;
        lchs.value = {
          initializers: $1.initializers,
          finalizers: $List(
            "Cons",
            evalM(render)(st.selfRef)(st.component.eval($HalogenQ("Finalize", void 0))),
            $1.finalizers
          )
        };
        return foreachSlot2(st.children)((v) => () => {
          const dsx = v.value;
          return finalize(lchs)(dsx)();
        })();
      };
    };
    return _bind(_liftEffect(newLifecycleHandlers))((lchs) => _bind(_liftEffect(() => ({ value: false })))((disposed) => handleLifecycle(lchs)(() => {
      const sio = create();
      const $0 = runComponent(lchs)((x2) => _liftEffect(sio.listener(x2)))(i2)(component13)();
      const dsx = $0.value;
      return {
        query: (() => {
          const $1 = dsx.selfRef;
          return (q) => _bind(_liftEffect(() => disposed.value))((v) => {
            if (v) {
              return _pure(Nothing);
            }
            return evalQ(render)($1)(q);
          });
        })(),
        messages: sio.emitter,
        dispose: handleLifecycle(lchs)(() => {
          const v = disposed.value;
          if (v) {
            return;
          }
          disposed.value = true;
          finalize(lchs)(dsx)();
          const v2 = dsx.selfRef.value;
          return for_8(v2.rendering)(renderSpec2.dispose)();
        })
      };
    })));
  };

  // output-es/Halogen.VDom.Driver/index.js
  var traverse_17 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var identity18 = (x2) => x2;
  var substInParent = (v) => (v1) => (v2) => {
    if (v2.tag === "Just") {
      if (v1.tag === "Just") {
        const $0 = insertBefore(v)(v1._1)(v2._1);
        return () => {
          $0();
        };
      }
      if (v1.tag === "Nothing") {
        const $0 = appendChild(v)(v2._1);
        return () => {
          $0();
        };
      }
    }
    return () => {
    };
  };
  var removeChild3 = (v) => {
    const $0 = v.node;
    const $1 = _parentNode($0);
    return () => {
      const a$p = $1();
      return traverse_17((pn) => removeChild2($0)(pn))(nullable(a$p, Nothing, Just))();
    };
  };
  var mkSpec = (handler) => (renderChildRef) => (document3) => ({
    buildWidget: (spec) => {
      const buildThunk2 = buildThunk(unsafeCoerce)(spec);
      const renderComponentSlot = (cs) => {
        const renderChild = renderChildRef.value;
        const rsx = renderChild(cs)();
        return $Step$p(
          rsx.node,
          Nothing,
          patch,
          (st) => {
            if (st.tag === "Just") {
              const $0 = st._1;
              return halt($0);
            }
          }
        );
      };
      const render = (slot3) => {
        if (slot3.tag === "ComponentSlot") {
          const $0 = slot3._1;
          return renderComponentSlot($0);
        }
        if (slot3.tag === "ThunkSlot") {
          const $0 = slot3._1;
          const step2 = buildThunk2($0);
          return $Step$p(
            step2._1,
            $Maybe("Just", step2),
            patch,
            (st) => {
              if (st.tag === "Just") {
                const $1 = st._1;
                return halt($1);
              }
            }
          );
        }
        fail();
      };
      const patch = (st, slot3) => {
        if (st.tag === "Just") {
          if (slot3.tag === "ComponentSlot") {
            const $0 = slot3._1;
            halt(st._1);
            return renderComponentSlot($0);
          }
          if (slot3.tag === "ThunkSlot") {
            const $0 = slot3._1;
            const step$p = step(st._1, $0);
            return $Step$p(
              step$p._1,
              $Maybe("Just", step$p),
              patch,
              (st$1) => {
                if (st$1.tag === "Just") {
                  const $1 = st$1._1;
                  return halt($1);
                }
              }
            );
          }
          fail();
        }
        return render(slot3);
      };
      return render;
    },
    buildAttributes: buildProp(handler),
    document: document3
  });
  var renderSpec = (document3) => (container) => ({
    render: (handler) => (child) => (v) => (v1) => {
      if (v1.tag === "Nothing") {
        return () => {
          const renderChildRef = { value: child };
          const machine = buildVDom(mkSpec(handler)(renderChildRef)(document3))(v);
          appendChild(machine._1)(container)();
          return { machine, node: machine._1, renderChildRef };
        };
      }
      if (v1.tag === "Just") {
        const $0 = v1._1.machine;
        const $1 = v1._1.node;
        const $2 = v1._1.renderChildRef;
        return () => {
          $2.value = child;
          const a$p = _parentNode($1)();
          const a$p$1 = _nextSibling2($1)();
          const machine$p = step($0, v);
          const $3 = substInParent(machine$p._1)(nullable(a$p$1, Nothing, Just))(nullable(
            a$p,
            Nothing,
            Just
          ));
          if (!reallyUnsafeRefEq($1)(machine$p._1)) {
            $3();
          }
          return { machine: machine$p, node: machine$p._1, renderChildRef: $2 };
        };
      }
      fail();
    },
    renderChild: identity18,
    removeChild: removeChild3,
    dispose: removeChild3
  });
  var runUI2 = (component13) => (i2) => (element) => _bind(_liftEffect(() => {
    const $0 = windowImpl();
    return document2($0)();
  }))((document3) => runUI(renderSpec(document3)(element))(component13)(i2));

  // output-es/Main/index.js
  var component12 = /* @__PURE__ */ component11(monadAffAppM)(monadAskGlobalStateAppM)(monadLoggerAppM);
  var rootElement = /* @__PURE__ */ _bind(/* @__PURE__ */ selectElement("#abed"))(/* @__PURE__ */ (() => {
    const $0 = _throwError(error("Could not find element #abed"));
    return (v2) => {
      if (v2.tag === "Nothing") {
        return $0;
      }
      if (v2.tag === "Just") {
        return _pure(v2._1);
      }
      fail();
    };
  })());
  var initialiseRouting = (onNewRoute) => {
    const $0 = matchesWith(foldableEither)(parse3(routeCodec))((old) => ($$new) => {
      const $02 = onNewRoute($$new);
      if (old.tag === "Nothing" || !(old.tag === "Just" && (() => {
        if (old._1.tag === "Home") {
          return $$new.tag === "Home";
        }
        if (old._1.tag === "About") {
          return $$new.tag === "About";
        }
        if (old._1.tag === "Instructions") {
          return $$new.tag === "Instructions";
        }
        if (old._1.tag === "LevelSelect") {
          return $$new.tag === "LevelSelect";
        }
        return old._1.tag === "Level" && $$new.tag === "Level" && old._1._1 === $$new._1 && old._1._2 === $$new._2;
      })())) {
        return $02;
      }
      return () => {
      };
    });
    return () => {
      $0();
    };
  };
  var main = /* @__PURE__ */ runHalogenAff(/* @__PURE__ */ _bind(/* @__PURE__ */ (() => {
    const monadEffectLoggerT1 = monadEffectLoggerT(monadEffectAff);
    return log$p({ log: (message2) => (v) => v(message2), MonadEffect0: () => monadEffectLoggerT1 })(Info)(Leaf2)("Starting ABED")(logMessage(monadEffectAff)(Info));
  })())(() => _bind(awaitLoad)(() => _bind(runAppM(component12))((rootComponent) => _bind(_bind(rootElement)(runUI2(rootComponent)()))((v) => _liftEffect(initialiseRouting((route) => runHalogenAff(v.query($Query4(
    route,
    void 0
  ))))))))));

  // <stdin>
  main();
})();
