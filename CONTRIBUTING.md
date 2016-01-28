# Contributing

The Pull Request model provides a mechanism for multiple contributors to
successfully introduce changes to a repository in a concise and logical manner.
This is done by creating branches off of master and submitting a change via a
Pull Request. This is ensures a clean series of commits to master.

### Creating a Pull Request

* Clone the repository
    * `git clone https://github.com/oribtable/engine.git`
* Create a branch
    * `git checkout -b my_new_feature`
* Use commits to logically group changes
* Push your branch to Github
    * `git push origin my_new_feature`
* [Create a Pull Request][compare] using *master* as the **base** and your
  feature branch *my_new_feature* as the **compare**.
* Create an overview of why this change is important and details that may be
  relevant to understanding the change.
* Allow a friend or two to read over the Pull Request adding comments if
  necessary.
* Merge the Pull Request and enjoy your successful contribution!

This process is explained in more detail by the [Github Documentation][pr_docs]. 

### Keeping In Sync

Since all Pull Requests are merged into master it is possible for your local
repository to fall behind. You can always ensure you have the latest commits on
master by checking out your master branch and pulling the latest. Because all
commits are merged into master through the Pull Request this action is guaranteed
to always be a fast forward. 

```bash
git checkout master
git pull
```

### Dealing with Conflicts

If a Pull Request is merged that introduces conflicts with your Pull Request you
will be required to update your Pull Request resolved merge. You can do so by
checking out your feature branch and pulling master. This will attempt to merge
the latest master into your feature branch. You will be required to resolve the
merge conflicts.

```bash
git checkout my_feature_branch
git pull master
```

[compare]: https://github.com/orbitable/engine/compare
[pr_docs]: https://help.github.com/articles/using-pull-requests/
