import { execSync } from "child_process";
import fs from "fs";

const repoPath = "./repo";
const branch = "dev"; // change if your repo uses master

export function getCommits(range) {

  let since = "1 day ago";

  if (range === "7days") {
    since = "7 days ago";
  }

  const repoUrl = `https://${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}.git`;

  if (!fs.existsSync(repoPath)) {

    console.log("Cloning repository..."), repoUrl;

    execSync(`git clone --branch ${branch} ${repoUrl} ${repoPath}`, { stdio: "inherit" });

  } else {

    console.log("Updating repository...", repoUrl);

    execSync(`git -C ${repoPath} fetch origin`, { stdio: "inherit" });

    execSync(`git -C ${repoPath} reset --hard origin/${branch}`, { stdio: "inherit" });

  }

  const command = `git -C ${repoPath} log origin/${branch} --since="${since}" --pretty=format:"- %s"`;

  return execSync(command).toString();
}