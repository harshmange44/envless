// TODO: Complete oAuth implementation
import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import { Command, Flags } from "@oclif/core";
import { blue, bold, cyan, grey, underline } from "kleur/colors";
import { LINKS } from "../lib/helpers";

const opn = require("better-opn");
const loader = spinner();
export default class Auth extends Command {
  static description = "Login to Envless or create an account";

  static flags = {
    with: Flags.string({
      char: "w",
      options: ["email", "github", "gitlab"],
    }),
  };

  static examples = [
    `
      $ envless auth
      $ envless auth --with email
      $ envless auth --with github
      $ envless auth --with gitlab
    `,
  ];

  async run(): Promise<void> {
    const version = this.config.version;
    await intro(`👋 ${bold(cyan(`Welcome to Envless ${grey(`${version}`)}`))}`);
    const { flags } = await this.parse(Auth);

    if (!flags.with) {
      const response: any = await select({
        message: "Login to Envless or create an account",
        options: [
          { label: "Continue with Email", value: "email" },
          { label: "Continue with GitHub", value: "github" },
          { label: "Continue with GitLab", value: "gitlab" },
        ],
      });

      isCancel(response) && triggerCancel();
      flags.with = response;
    }

    const loginUrl = `${LINKS.base}/auth?clientId=xxx`;
    await loader.start(`Please wait while verify few things...`);
    await new Promise((r) => setTimeout(r, 2000));
    await loader.stop(
      `Please visit this URL in your web browser: ${underline(
        blue(`${loginUrl}`),
      )}`,
    );
    await opn(loginUrl);

    const token = await text({
      message: "Please enter your verification token",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      validate: (input: string) => {
        if (!input || input.trim() === "" || input.trim().length < 10) {
          return `Please enter a valid verification token`;
        }
      },
    });

    isCancel(token) && triggerCancel();
    await outro(
      `👋 ${bold(
        cyan(`Welcome back ${underline(cyan(`${`John Doe`}`))}`),
      )}, you are now logged in!`,
    );
  }
}

const triggerCancel = () => {
  cancel("Opeartion cancelled");
  process.exit(0);
};
