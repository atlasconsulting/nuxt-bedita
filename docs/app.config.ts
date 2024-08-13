export default defineAppConfig({
  docus: {
    title: 'Nuxt BEdita',
    description: 'Documentation of nuxt-bedita module.',
    socials: {
      github: 'atlasconsulting/nuxt-bedita',
      nuxt: {
        label: 'Nuxt',
        icon: 'simple-icons:nuxtdotjs',
        href: 'https://nuxt.com',
      },
    },
    aside: {
      level: 0,
      collapsed: false,
      exclude: [],
    },
    main: {
      padded: true,
      fluid: true,
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      fluid: true,
    },
  },
});
