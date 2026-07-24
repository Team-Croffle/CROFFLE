import { Command } from "commander";
import prompts from "prompts";
import fs from "fs-extra";
import path from "path";
import picocolors from "picocolors";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createCommand = new Command("create")
  .description("Scaffold a new Croffle plugin project")
  .argument("[project-name]", "Name of the project directory")
  .action(async (projectNameArg) => {
    try {
      let projectName = projectNameArg;

      if (!projectName) {
        const response = await prompts({
          type: "text",
          name: "projectName",
          message: "Project name:",
          initial: "my-croffle-plugin",
        });
        projectName = response.projectName;
      }

      if (!projectName) {
        console.error(picocolors.red("Project name is required."));
        process.exit(1);
      }

      const targetPath = path.join(process.cwd(), projectName);
      if (fs.existsSync(targetPath)) {
        console.error(
          picocolors.red(`Target directory ${projectName} already exists!`),
        );
        process.exit(1);
      }

      const answers = await prompts([
        {
          type: "text",
          name: "pluginId",
          message: "Plugin ID (e.g. com.myname.myplugin):",
          initial: `com.example.${projectName.replace(/[^a-zA-Z0-9]/g, "")}`,
        },
        {
          type: "text",
          name: "pluginName",
          message: "Plugin Name (Display Name):",
          initial: "My Plugin",
        },
        {
          type: "text",
          name: "pluginDescription",
          message: "Description:",
          initial: "A wonderful plugin for Croffle",
        },
        {
          type: "text",
          name: "author",
          message: "Author Name:",
          initial: "Croffle Developer",
        },
        {
          type: "select",
          name: "template",
          message: "Select a template:",
          choices: [
            { title: "Vanilla TypeScript", value: "template-vanilla-ts" },
            { title: "Vue 3 + TypeScript", value: "template-vue-ts" },
            { title: "React + TypeScript", value: "template-react-ts" },
          ],
        },
      ]);

      if (!answers.pluginId) {
        console.log(picocolors.yellow("Operation cancelled."));
        return;
      }

      console.log(picocolors.cyan(`\nCreating project in ${targetPath}...`));

      const templateDir = path.join(
        __dirname,
        "../../templates",
        answers.template,
      );
      if (!fs.existsSync(templateDir)) {
        console.error(
          picocolors.red(
            `Template ${answers.template} not found at ${templateDir}.`,
          ),
        );
        process.exit(1);
      }

      // Copy template files
      await fs.copy(templateDir, targetPath);

      // Update plugin.json
      const pluginJsonPath = path.join(targetPath, "plugin.json");
      if (fs.existsSync(pluginJsonPath)) {
        const manifest = JSON.parse(await fs.readFile(pluginJsonPath, "utf8"));
        manifest.id = answers.pluginId;
        manifest.name = answers.pluginName;
        manifest.description = answers.pluginDescription;
        manifest.author = answers.author;
        await fs.writeFile(pluginJsonPath, JSON.stringify(manifest, null, 2));
      }

      // Update package.json
      const packageJsonPath = path.join(targetPath, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
        pkg.name = projectName;
        pkg.description = answers.pluginDescription;
        pkg.author = answers.author;
        await fs.writeFile(packageJsonPath, JSON.stringify(pkg, null, 2));
      }

      // Initialize git if possible
      try {
        execSync("git init", { cwd: targetPath, stdio: "ignore" });
      } catch (e) {
        // ignore
      }

      console.log(picocolors.green("\n✔ Project successfully created!"));
      console.log("\nNext steps:");
      console.log(picocolors.cyan(`  cd ${projectName}`));
      console.log(picocolors.cyan(`  yarn install`));
      console.log(picocolors.cyan(`  yarn dev\n`));
    } catch (error) {
      console.error(picocolors.red("Failed to scaffold project:"), error);
      process.exit(1);
    }
  });
