import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
	schema: 'prisma/schema.prisma',
	datasource: {
		// 🚀 Uses type-safe wrapper to read your database string
		url: env('DATABASE_URL'), 
	},
});