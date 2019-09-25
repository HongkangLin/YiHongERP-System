const path = require('path');

function resolve(dir) {
	return path.join(__dirname, dir);
}

module.exports = {
	configureWebpack: {
		resolve: {
			alias: {
				'@public': resolve('public'),
				'@': resolve('src'),
				'^': resolve('views'),
				'#': resolve('src/components')
			}
		}
	},
	devServer: {
		port: '8080',
		proxy: {
			'^': {
				ws: false, // proxy websockets
				target: 'http://47.112.213.96',
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					'^': '/'
				}
			}
		}
	}
}