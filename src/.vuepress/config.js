const hope = require('vuepress-theme-hope')
const base = process.env.BASE || '/'
const hostname = process.env.HOSTNAME || 'https://www.daguang.me'

module.exports = hope.config({
	title: `Daguang's pages`,
	description: '写代码这么好玩居然还给钱✨',
	base,
	dest: './dist',
	themeConfig: {
		hostname,
		author: 'xu.duqing',
		mdEnhance: {
			enableAll: true,
		},
	},
	plugins: [{ globalUIComponents: ['V2Notice'] }],
})
