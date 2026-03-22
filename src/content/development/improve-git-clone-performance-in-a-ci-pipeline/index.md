---
title: 'Improve git clone performance in a CI pipeline'
description: 'Have you felt particularly annoyed by the time it takes to clone a large repository, especially one with a huge commit history? This post will discuss a simple but powerful technique to significantly improve git clone performance. The solution is called shallow cloning, which uses the –depth=1 flag with git&#46;&#46;&#46;'
pubDate: 'Mar 19, 2024'
updatedDate: 'Mar 19, 2024'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["Development"]
categoryHierarchy: ["Development"]
---

Have you felt particularly annoyed by the time it takes to clone a large repository, especially one with a huge commit history? This post will discuss a simple but powerful technique to significantly improve git clone performance.

The solution is called shallow cloning, which uses the `--depth=1` flag with `git clone`. The reason why this improves git clone performance is that it creates a clone of the git repository with history up to the depth field that we specify. So, in this case, only the most recent commit (and some necessary metadata) is fetched, and nothing else. This helps skip any older commits, tags, branches, etc. Skipping everything else helps reduce the download size and the time it takes. This is particularly useful to improve git clone performance on a CI server. All we need to do is use

```
git clone --depth=1 repository-url>
```

It is worth mentioning that while shallow cloning does improve the clone performance, it probably is not useful if you want access to the full commit history. It also means there is no branch history, so switching to a different branch would require additional fetches. So shallow cloning is ideal for continuous integration/deployment pipelines,  automated build systems, and cases where you want a quick setup for testing or performing code reviews.

If you are looking for other git-related hacks, do check out our posts about [removing file from git history](https://www.wisdomgeek.com/development/how-to-permanently-remove-a-file-from-git-history/) and [deleting git branches that do not exist on remote](https://www.wisdomgeek.com/development/delete-git-branches-that-do-not-exist-on-remote/).
