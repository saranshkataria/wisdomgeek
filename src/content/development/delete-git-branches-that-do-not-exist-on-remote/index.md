---
title: 'Delete git branches that do not exist on remote'
description: 'After working on a project for a while, there will come a time when we will end up with a lot of local branches that have been merged on remote but still exist on our local machine. To delete git branches that do not exist on remote, we can perform&#46;&#46;&#46;'
pubDate: 'Dec 23, 2023'
updatedDate: 'Dec 23, 2023'
heroImage: './hero.png'
categories: ["Development"]
categoryHierarchy: ["Development"]
---

After working on a project for a while, there will come a time when we will end up with a lot of local branches that have been merged on remote but still exist on our local machine. To delete git branches that do not exist on remote, we can perform the following steps:

1. $1

2. $1

```
git fetch -p && git branch -vv | awk '/: gone]/{print $1}' | xargs git branch -d
```

**Note:** You need to be on the main/master branch because this command compares against the head and so you want to be on the branch to ensure that it does not get deleted.

## Breaking down the command

`git fetch -p`: fetches all the branches and commits from the remote repository. It updates the local repository, and the -p flag tells git to remove remote-tracking references (i.e., origin/branch-name) that no longer exist on the remote repository.

`&&`: is a logical operator that executes the second command only if the first one succeeds.

`git branch -vv`: lists all local and upstream branches in very verbose mode. It displays detailed information about each branch and also specifies "[gone]" next to a branch if the local branch's upstream branch does not exist.

`|awk '/:gone]/{print $1}'`: pipes the verbose output to awk which is used to process text. awk matches lines containing :gone]. In awk, a line is delimited by a whitespace by default and $1 refers to the first field in that line. So `{print $1}` prints the first field of the matching lines which is the branch names in this case.

`|xargs git branch -d`: pipes the output of the first field that we got from the previous part of the command (branch  names) to xargs. xargs is used to build and execute commands from input. So it runs git branch -d for every input line that it gets. So it deletes the branch names that it receives line by line for each input.

And thus we delete git branches that do not exist on remote one by one. Let us know in the comments if you have any questions.
