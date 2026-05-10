import { spawnSync } from "node:child_process";

const args = new Set(process.argv.slice(2));
const hasFirebaseFlag =
  args.has("--firebase") || process.env.npm_config_firebase === "true";
const hasGithubFlag =
  args.has("--github") || process.env.npm_config_github === "true";
const isDryRun =
  args.has("--dry-run") || process.env.npm_config_dry_run === "true";

const printUsage = () => {
  console.log("Usage:");
  console.log("  npm run deploy -- --firebase");
  console.log("  npm run deploy -- --github");
  console.log("Optional:");
  console.log("  npm run deploy -- --firebase --dry-run");
  console.log("  npm run deploy -- --github --dry-run");
  console.log("Also works:");
  console.log("  npm run deploy --firebase");
  console.log("  npm run deploy --github");
};

const runCommand = (command, commandArgs) => {
  if (isDryRun) {
    console.log(`[dry-run] ${command} ${commandArgs.join(" ")}`);
    return;
  }

  const result = spawnSync(command, commandArgs, {
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

if (hasFirebaseFlag && hasGithubFlag) {
  console.error("Please choose only one target: --firebase or --github");
  printUsage();
  process.exit(1);
}

if (hasFirebaseFlag) {
  console.log("Deploy target: Firebase Hosting");
  runCommand("npm", ["run", "build:firebase"]);
  runCommand("firebase", ["deploy", "--only", "hosting"]);
  process.exit(0);
}

if (hasGithubFlag) {
  console.log("Deploy target: GitHub Pages (trigger workflow)");
  runCommand("gh", ["workflow", "run", "deploy-pages.yml"]);
  console.log(
    "Workflow gestartet. Status prüfen mit: gh run list --workflow deploy-pages.yml",
  );
  process.exit(0);
}

console.error("No deploy target provided.");
printUsage();
process.exit(1);
