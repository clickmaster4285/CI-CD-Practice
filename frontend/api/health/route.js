// app/api/health/route.js
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
   const checks = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      status: 'healthy',
      checks: {}
   };

   try {
      // Check if app is responding
      checks.checks.app = { status: 'ok' };

      // Check memory usage
      const memoryUsage = process.memoryUsage();
      checks.checks.memory = {
         heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
         heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
         status: memoryUsage.heapUsed < 500 * 1024 * 1024 ? 'ok' : 'warning'
      };

      // Check PM2 status
      const { stdout } = await execAsync('pm2 jlist');
      const processes = JSON.parse(stdout);
      const ourProcess = processes.find(p => p.name === 'ci-cd-frontend');

      checks.checks.pm2 = {
         status: ourProcess?.pm2_env?.status || 'unknown',
         restarts: ourProcess?.pm2_env?.restart_time || 0
      };

      // Check uptime
      checks.checks.uptime = {
         seconds: process.uptime(),
         human: formatUptime(process.uptime())
      };

      // Overall status
      if (checks.checks.memory.status === 'warning' ||
         checks.checks.pm2.status !== 'online') {
         checks.status = 'degraded';
      }

      return Response.json(checks, {
         status: checks.status === 'healthy' ? 200 : 503
      });

   } catch (error) {
      checks.status = 'unhealthy';
      checks.error = error.message;
      return Response.json(checks, { status: 500 });
   }
}

function formatUptime(seconds) {
   const days = Math.floor(seconds / 86400);
   const hours = Math.floor((seconds % 86400) / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);
   const secs = Math.floor(seconds % 60);

   return `${days}d ${hours}h ${minutes}m ${secs}s`;
}