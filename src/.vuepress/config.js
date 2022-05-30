const hope = require('vuepress-theme-hope')
const base = '/'
const hostname = 'https://www.daguang.me'

module.exports = hope.config({
	title: `Daguang's pages`,
	description: 'A Full-Stack Client Development✨',
	base,
	dest: './dist',
	themeConfig: {
		hostname,
		author: 'daguang',
		mdEnhance: {
			enableAll: true,
		},
	},
	plugins: [{ globalUIComponents: ['V2Notice'] }],
})
