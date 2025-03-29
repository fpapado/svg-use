**@svg-use/core**

---

# @svg-use/core

## Primary functions

These are the main transformation functions. You would typically use these when
implementing bundler plugins or codegen.

- [createJsModule](functions/createJsModule.md)
- [transformSvgForUseHref](functions/transformSvgForUseHref.md)

## Primary function defaults

The default / quick-start config for the primary functions. It is recommended
that you use these defaults if you are implementing a generic bundler plugin.
You can of course deviate from them for more bespoke use-cases.

- [defaultComponentFactory](variables/defaultComponentFactory.md)
- [defaultGetSvgIdAttribute](variables/defaultGetSvgIdAttribute.md)
- [getDefaultThemeSubstitutionFunction](functions/getDefaultThemeSubstitutionFunction.md)

## Other

- [ModuleFactoryOptions](interfaces/ModuleFactoryOptions.md)
- [ModuleFactoryParams](interfaces/ModuleFactoryParams.md)
- [ComponentFactory](type-aliases/ComponentFactory.md)
- [ComponentFactoryFunction](type-aliases/ComponentFactoryFunction.md)
- [GetSvgIdFunction](type-aliases/GetSvgIdFunction.md)
- [GetThemeSubstitutionFunction](type-aliases/GetThemeSubstitutionFunction.md)
- [Result](type-aliases/Result.md)
- [TransformOptions](type-aliases/TransformOptions.md)
- [UseHrefInfo](type-aliases/UseHrefInfo.md)
- [XastMakeThemeableOptions](type-aliases/XastMakeThemeableOptions.md)
- [defaultFallbackRootFill](variables/defaultFallbackRootFill.md)
- [svgoMakeThemeable](functions/svgoMakeThemeable.md)
- [xastMakeThemeable](functions/xastMakeThemeable.md)
