// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Something',
    tagline: 'Bring the UI and we will bring the shop',
    url: 'https://your-docusaurus-test-site.com',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'FinnDore', // Usually your GitHub org/user name.
    projectName: 'Something', // Usually your repo name.
    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl: 'https://github.com/FinnDore/something'
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    editUrl: 'https://github.com/FinnDore/something'
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css')
                }
            })
        ]
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'Something',
                logo: {
                    alt: 'Something Logo',
                    src: 'img/logo.svg'
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'getting-started/cdk',
                        position: 'left',
                        label: 'Docs'
                    },
                    { to: '/blog', label: 'Blog', position: 'left' },

                    {
                        href: 'https://github.com/FinnDore/something',
                        label: 'GitHub',
                        position: 'right'
                    }
                ]
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: []
                    },

                    {
                        title: 'More',
                        items: [
                            {
                                label: 'Blog',
                                to: '/blog'
                            },
                            {
                                label: 'GitHub',
                                href: 'https://github.com/FinnDore/something'
                            }
                        ]
                    }
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Something, Inc. Built with Docusaurus.`
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme
            }
        })
};

module.exports = config;
