let conf = ./spago.dhall

in conf // 
    { sources = conf.sources # [ "test/**/*.purs" ]
    , dependencies = conf.dependencies #
        [ "halogen-storybook"
        , "test-unit"
        , "quickcheck"
        ] 
    }
