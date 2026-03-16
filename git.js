import { execSync } from "child_process";

export function getCommits(range) {

  let since;

  if (range === "today") {
    since = "1 day ago";
  }

  if (range === "7days") {
    since = "7 days ago";
  }

  const command = `git log --since="${since}" --pretty=format:"- %s"`;

  return execSync(command).toString();
}