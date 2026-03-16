import { execSync } from "child_process";

import fs from "fs";

const repoPath = "./repo";

export function getCommits(range) {

  let since = "1 day ago";

  if (range === "7days") {
    since = "7 days ago";
  }

  const repoUrl = `https://${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}.git`;

  // clone repo if not exists
  if (!fs.existsSync(repoPath)) {

    console.log("Cloning repository...");

    execSync(`git clone ${repoUrl} ${repoPath}`, { stdio: "inherit" });

  } else {

    console.log("Updating repository...");

    execSync(`git -C ${repoPath} pull`, { stdio: "inherit" });

  }

  const command = `git -C ${repoPath} log --since="${since}" --pretty=format:"- %s"`;

  const commits = execSync(command).toString();

  return commits;
}
