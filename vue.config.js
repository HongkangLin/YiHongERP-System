const path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
function resolve(dir) {
	return path.join(__dirname, dir);
}

module.exports = {
	outputDir: 'erp',
	productionSourceMap: false,
	// ��vue.config.js�ļ����������
	configureWebpack: config => {
		if (isProduction) {
			// Ϊ���������޸�����...
			config.plugins.push(
				//���������Զ�ɾ��console
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
	// css�������
	css: {
		// �Ƿ�ʹ��css������ ExtractTextPlugin
		// ��ȡ CSS �ڿ�������ģʽ����Ĭ�ϲ������ģ���Ϊ���� CSS �����ز����ݡ�
		extract: isProduction?true:false,
		// ���� CSS source maps?
		sourceMap: false,
		// cssԤ����������
		// ���� CSS modules for all css / pre-processor files.
		modules: false,
	},
	chainWebpack: config => {
		config.resolve.symlinks(true) // �޸��ȸ���ʧЧ
		// config
		// 	.entry('index')
		// 	.add('babel-polyfill')
		// 	.end();
		// ������������
		if (isProduction) {
			// ɾ��Ԥ����
			config.plugins.delete('preload');
			config.plugins.delete('prefetch');
			// ѹ������
			config.optimization.minimize(true);
			// �ָ����
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