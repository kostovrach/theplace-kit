module.exports = {
	apps: [
		{
			name: '<название_проекта>-frontend',
			script: '/srv/<название_проекта>/frontend/.output/server/index.mjs',
			cwd: '/srv/<название_проекта>',

			instances: 1,
			exec_mode: 'fork',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',

			// Логи
			output: '/srv/<название_проекта>/logs/output.log',
			error: '/srv/<название_проекта>/logs/error.log',
			combine_logs: false,

			env: {
				NODE_ENV: 'production',
				NITRO_PORT: 3000,
				NITRO_HOST: '0.0.0.0',           // для превью
            	// NITRO_HOST: '127.0.0.1',      // для продакшена с nginx
			},
		},
	],
};
