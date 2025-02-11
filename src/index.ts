#!/usr/bin/env node
import inquirer from "inquirer";
import { readInput } from "./cli/readInput";
import getPackageManager from "./utils/getPackageManager";
import { logger } from "./utils/logger";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import installTailwind from "./cli/output/installTailwind.js";
import installDependencies from "./cli/output/installDependencies.js";
import createProject from "./cli/output/createProject.js";

async function main() {
  logger.info("Welcome to create-tw!\n");
  logger.success("The easiest way to create a Tailwind project\n");

  const input = await readInput();
  const pkgManager = getPackageManager();
  const projectDir = path.resolve(process.cwd(), input.appName);

  logger.info(`\nUsing: ${chalk.cyan.bold(pkgManager)}\n`);

  if (fs.existsSync(projectDir)) {
    // Ask to overwrite
    const answer = await inquirer.prompt({
      name: "overwrite",
      type: "confirm",
      message: `${chalk.yellow.bold(`Directory already exists. Overwrite?`)}`,
    });
    if (!answer.overwrite) {
      logger.error("Aborting...");
      process.exit(1);
    }

    fs.removeSync(projectDir);
  }

  await createProject(input);
  await installTailwind(input, projectDir);
  await installDependencies(input, projectDir);

  logger.info(`\nProject created in ${chalk.green.bold(projectDir)}\n`);
  logger.info(`${chalk.cyan.bold(`cd ${input.appName}`)}`);
  logger.info(
    `${chalk.cyan.bold(
      `${getPackageManager()} ${
        getPackageManager() === "npm" ? "run" : ""
      } dev`,
    )}\n`,
  );
  logger.log("Happy coding!");

  process.exit(0);
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
