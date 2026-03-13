# Credits & Acknowledgments

solid-glass aims to be a comprehensive hub for glass effects on the web,
bringing together multiple approaches and engines under one roof.
We stand on the shoulders of excellent work by the community.

## SVG Refraction Engine

The physics-based SVG refraction engine (`solid-glass/engines/svg-refraction`)
is directly inspired by the outstanding work of **Kube (Chris Feijoo)**:

- **Blog post:** [Liquid Glass in the Browser: Refraction with CSS and SVG](https://kube.io/blog/liquid-glass-css-svg)
- **Source code:** [github.com/kube/kube.io](https://github.com/kube/kube.io/tree/main/app/data/articles/2025_10_04_liquid_glass_css_svg)
- **Author:** [Chris Feijoo](https://github.com/kube) — freelance software developer (TypeScript & GraphQL)

Chris's article provides an exceptional deep-dive into simulating glass refraction
on the web using Snell-Descartes law, SVG displacement maps, and specular highlights.
The surface equation functions, displacement map generation approach, and specular
highlight calculations in our engine are adapted from his implementation.

## Comparable Projects

Other notable glass effect implementations in the community:

| Project | Author | Approach |
|---------|--------|----------|
| [kube.io liquid glass](https://kube.io/blog/liquid-glass-css-svg) | Chris Feijoo | Physics-based SVG displacement + specular |
| [shuding/liquid-glass](https://github.com/shuding/liquid-glass) | Shu Ding | SVG filter-based liquid glass |
| [nikdelvin/liquid-glass](https://github.com/nikdelvin/liquid-glass) | nikdelvin | CSS + SVG filters, iOS 26 recreation |
| [ZeroxyDev/liquid-glass-js](https://github.com/ZeroxyDev/liquid-glass-js) | ZeroxyDev | Refractive displacement + spring physics |

## License

solid-glass is licensed under Apache 2.0. The SVG refraction engine
is an original implementation inspired by the techniques described in
the referenced works above.
