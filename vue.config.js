const path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
function resolve(dir) {
	return path.join(__dirname, dir);
}

module.exports = {
	outputDir: 'erp',
	productionSourceMap: false,
	// 在vue.config.js文件中添加配置
	configureWebpack: config => {
		if (isProduction) {
			// 为生产环境修改配置...
			config.plugins.push(
				//生产环境自动删除console
				new UglifyJsPlugin({
					uglifyOptions: {
						compress: {
							warnings: false,
							drop_debugger: true,
							drop_console: true,
						},
					},
					sourceMap: false,
					parallel: true,
				})
			);
		}
	},
	// css相关配置
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		// 提取 CSS 在开发环境模式下是默认不开启的，因为它和 CSS 热重载不兼容。
		extract: isProduction?true:false,
		// 开启 CSS source maps?
		sourceMap: false,
		// css预设器配置项
		// 启用 CSS modules for all css / pre-processor files.
		modules: false,
	},
	chainWebpack: config => {
		config.resolve.symlinks(true) // 修复热更新失效
		// config
		// 	.entry('index')
		// 	.add('babel-polyfill')
		// 	.end();
		// 生产环境配置
		if (isProduction) {
			// 删除预加载
			config.plugins.delete('preload');
			config.plugins.delete('prefetch');
			// 压缩代码
			config.optimization.minimize(true);
			// 分割代码
			config.optimization.splitChunks({
				chunks: 'all'
			})
		}
	},
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