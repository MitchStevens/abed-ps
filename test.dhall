let conf = ./spago.dhall

in conf // 
    { sources = [ "src/Game/*.purs", "test/Game/*.purs" ]
    , dependencies = conf.dependencies #
        [ "test-unit"
        , "quickcheck"
        ] 
    }
    --{ sources = conf.sources # [ "test/**/*.purs" ]
