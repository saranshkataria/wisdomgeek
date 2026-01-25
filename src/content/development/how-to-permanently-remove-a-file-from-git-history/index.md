---
title: 'How to permanently remove a file from Git history'
description: 'We all make mistakes sometimes. Pushing files that contain some secrets or sensitive information to a Git repository is fairly common. And even if we revert the commit, it would still be present in the Git history of the project. In such cases, where we want to permanently remove a&#46;&#46;&#46;'
pubDate: 'Nov 12, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpg'
categories: ["Development"]
categoryHierarchy: ["Development"]
---

We all make mistakes sometimes. Pushing files that contain some secrets or sensitive information to a Git repository is fairly common. And even if we revert the commit, it would still be present in the Git history of the project. In such cases, where we want to permanently remove a file from Git history, we need to perform a couple of steps.

1. If the file involved some secrets, revoke them immediately

2. Add the file to gitignore.

Assuming it was a .env file,

```
echo '.env' >> .gitignore
```

3. Permanently remove a file from Git history:

```
git filter-branch --index-filter "git rm -rf --cached --ignore-unmatch .env" HEAD
```

If it is a different file, replace ".env" with the path of the file.

Note: This can be a time-consuming process as it revisits all of the git commits in history and removes the file from there.

4. Force push

```
git push --force
```

Since we rewrote a bunch of commits, we will have to do a force push to modify the git history of the project. If there are multiple branches on the project, or a team working on the project, this might be cumbersome and we would want to search for the commits manually and rebase them instead. 

Note: If we only wanted to remove the file and did not care about deleting it from the git history, we  would have used the command:

```
git rm -r --cached .env
```

And that is it. Drop-in a comment below if you have any questions.
