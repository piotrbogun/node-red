# FlowFuse Take-Home Assignment

Piotr Bogun

## The node help tab mistakenly resets focus when arrow keys are used to switch between nodes

- [Issue](https://github.com/node-red/node-red/issues/5343)
- [PR](https://github.com/node-red/node-red/pull/5406)

### (1) What did you choose to build, and why?

I originally picked this ticket long before the interview. I wanted to learn a little about NODE-RED and specifically the codebase. This ticket was well documented with the current and expected behavior and something I could do quickly. I estimated it would be a small fix. I also noticed that Kazuhito was creating many issues and going about fixing them so I thought, even if it was a minor fix, it would have some impact or be helpful.

My interpretation of the issue after initially running the app for the first time and reproducing the bug was that focus logic was already implemented but a case was missed.

### (2) If you used AI as a tool while building this, how and why did you decide to use it?

In this ticket I used AI to give me high level summaries of the code structure and to also find where the components live and to have it give me a quick summary at a glance. I didn't do this ticket for the interview, I was using it more to learn a little bit about the project.

The actual fix I found and implemented myself. I referenced the patterns that were already in the treelist file.

I didn't use AI to quickly solve this as I was using this ticket to learn a little about the code base and it gave me something specific to look at.

## Junction error in Quick Add dialog

- [Issue](https://github.com/node-red/node-red/issues/5404)
- [PR](https://github.com/node-red/node-red/pull/5407)

### (1) What did you choose to build, and why?

After doing the first bug fix Kazuhito gave me a heart emoji on my PR and I just decided to do this one for the same reasons. Specific issue, well documented (Kazuhito documented in the ticket the file the error was originating from), Kazuhito was working through these and I was already in the code so I just thought I'd do it. Was just trying to poke around and maybe be helpful at the same time.

My interpretation was basic. Attempting to access something that is undefined. This was specifically happening with the `junction` node. I searched the file for `junction` type code and found checks everywhere which gave me the clue needed to fix this.

### (2) If you used AI as a tool while building this, how and why did you decide to use it?

I did not use AI here. The issue already documented the file where the error originated and quick testing showed this was related to the junction node. I was just using this as a reason to look at specific code.

## TreeList component does not reveal items outside of scroll area on larger lists

- [Issue](https://github.com/node-red/node-red/issues/5420)
- [PR](https://github.com/node-red/node-red/pull/5421)

### (1) What did you choose to build, and why?

I found this bug while doing follow up tests and to document areas of the application I tested in response to the review comment on my PR. Since I found it and created an issue, and was already in the treeList component, I thought I would just go ahead and fix it.

My interpretation for this issue was that we were just missing the code here to scroll to the target. I saw the `reveal()` calls which had `Call reveal on a treelist target when it gets focused` documented. Adding this fixed the issue.

### (2) If you used AI as a tool while building this, how and why did you decide to use it?

I did not use AI here. Looking around I saw the focus/reveals calls and investigated/attempted that approach and kept the pattern. If this would not have worked I might have asked AI to look around depending on time.

## TreeList component allows navigating to filtered out items with arrow keys

- [Issue](https://github.com/node-red/node-red/issues/5430)
- [PR](https://github.com/node-red/node-red/pull/5431)

### (1) What did you choose to build, and why?

Another bug I found while testing my first PR so thought I might as well fix it.

I interpreted the problem here as simply not taking into account filter state. I focused on trying to not make this a bigger change than it had to be. I didn't want to introduce potential bloat and increase the chance of unintended bugs.

When filtering the tree list, items are simply hidden in the DOM, but the list of items itself is not filtered, or any type of filter flagging. I intentionally did not go with either of these approachs (I would lean towards actually filtering the items) as I was not sure what the preference would be from the developers. I did not want to introduce a big change. So I went with checking if the items are visible instead as an initial small approach to get feedback even though it means we are doing an extra check for DOM visibility.

### (2) If you used AI as a tool while building this, how and why did you decide to use it?

I used AI to quickly find that `EditableList` is responsible for hiding filtered items with `.hide()`, which helped me understand the current logic.

## Migrate to NPM workspaces

- [PR](https://github.com/piotrbogun/node-red/pull/1)

### (1) What did you choose to build, and why?

I did this long before getting the take home assignment. Otherwise, I might have picked something else. I picked this since I saw the modernization issues and was curious. Especially since the current NODE-RED code lives in `packages/node_mobules/@node-red` instead of a root `packages/*` directory. It would be nice if it didn't have to be this way. I also think modernizing the code can help with more people being willing to contribute to the project. Having said that, the current code works and making changes also introduces the risk of bugs or issues for users.

My interpretation of this change was that the current code lives in `packages/node_modules/@node-red/*` as a pre NPM workspace workaround and to migrate the code into a more modern file structure (such as `packages/*`) and having NPM workspaces handle package symlinking to `node_modules/@node-red/*`.

Main focus:

- Move relevant files to a top level `packages/*` directory.
- Maintain backwards compatibility. NPM workspaces should treat the moved files as being in `node_modules/@node-red/*` so existing code/plugins should continue to work.
- Grunt build tasks should continue to work as before, (updating file paths).
- Application should build/run same as pre-change.
- Tests should continue to work, updating file paths.
- Building/publishing should work as before (minor testing done, not ready for proper PR).

Things left out (or just didn't get to):

- Look through any documentation that needs updating.
- Full integration testing needs to be finished.

The goal was to stick to the main focus of moving to NPM workspaces. I prefer to do these refactors in individual change sets, so my goal was not to include moving away from Grunt and to do linting change sets.

### (2) If you used AI as a tool while building this, how and why did you decide to use it?

I used AI heavily on this task. I ran a planning with the AI to help it document the work required, break it down into small tasks, and to give it a rubric to organize/keep track of the in progress work. This was all based around a [tasks.json](https://github.com/piotrbogun/node-red/blob/POC/npm-workspaces-migration/tasks/tasks.json) file I created and had the AI modify further based on what might help it get the project done.

This also helped me track the work that was being done step by step and serves as nice documentation for someone else to reference or when reviewing the work done, or if they wanted to continue and use an AI themselves. Using this file, along with giving the AI commit hashes to diff against, was a helpful way to create a testing document.

- [AI tasks.json file](https://github.com/piotrbogun/node-red/blob/POC/npm-workspaces-migration/tasks/tasks.json)
- [AI testing document](https://github.com/piotrbogun/node-red/blob/POC/npm-workspaces-migration/tasks/tasks-test.md)

Once the work was planned, along with some other useful information, I had the AI go task by task to get the work done with this prompt:

```
In the plans directory there is a tasks.json file with a project and tasks.

- Review the project and all the tasks.
- Pick one task to work on that YOU think is the most important to work on next.
- Reference any other helpful information.
- Only do a single task.
- Once a task is done, append this file to mark the task is done along with any other information that would be helpful for the next developer.
- If you find that more work needs to be done while working on your task, append that as a task that needs to be done to the file along with any information that would be helpful to complete the task for a future developer.
```

This is the first time I went with this type of approach using AI. My tasks file could be (and has been slightly) improved since I used it here. This ended up being effective.

Each task was done with a fresh AI instance to optimize its context window, so it would perform well. Each task had to be small (not so different from planning a sprint).

The main manual work for me was reviewing the planned work for correctness, that I was not introducing scope, and doing manual testing to confirm things worked as expected (on top of the AI testing). Since most of the work was making sure files got moved correctly, any hard coded file paths were updated, or updating the grunt build paths, and no changes to any kind of logic, the AI was able to do these things much faster than me and it was faster for me to review and test for this ticket.
