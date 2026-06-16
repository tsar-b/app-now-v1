import { loadConfig } from './lib/config.js';
import { runExport } from './pipeline/exportApproved.js';
import { runUpload } from './pipeline/uploadSupabase.js';
import { checkProject } from './pipeline/checkProject.js';
import { log } from './lib/logger.js';

const command = process.argv[2] ?? 'check';

async function main() {
  const config = await loadConfig();

  if (command === 'check') {
    await checkProject(config);
    return;
  }

  if (command === 'export') {
    await runExport(config);
    return;
  }

  if (command === 'upload') {
    await runUpload(config);
    return;
  }

  if (command === 'migrate') {
    const exportResult = await runExport(config);
    await runUpload(config, exportResult.outputDir);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  log.error(error.message);
  if (process.env.APPNOW_DEBUG === 'true') {
    console.error(error);
  }
  process.exit(1);
});
