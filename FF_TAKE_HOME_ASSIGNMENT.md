# FlowFuse Take-Home Assignment

## The node help tab mistakenly reset focus when arrow keys are used to switch between nodes

- [Issue](https://github.com/node-red/node-red/issues/5343)
- [PR](https://github.com/node-red/node-red/pull/5406)

### # What did you choose to build, and why?

I looked into NODE-RED issues for a way to contribute before I got an interview so I could learn more about NODE-RED and the environment here. I also hoped whatever I spent time on would not be wasted. This issue looked like a good candidate to allow me to interact with a specific part of the code and fix something.

I did not have a specific interpretation for this issue as the problem itself is specific. I wanted to follow the existing coding patterns being used (I did not see any reason to not follow the existing patterns).

During testing I found two bugs which I commented on in the PR. I didn't want the change set for this issue to grow, so I created separate issues for the new bugs and focused on the fix here for the original issue.

### # If you used AI as a tool while building this, how and why did you decide to use it?

In this ticket I used AI to give me high level summaries of the code structure, and to find where your components live. I found the fix myself as my goal was to just kind of poke around and learn something, not necessarily to move fast here.

## Junction error in Quick Add dialog

- [Issue](https://github.com/node-red/node-red/issues/5404)
- [PR](https://github.com/node-red/node-red/pull/5407)

### # What did you choose to build, and why?

Another ticket that seemed like a quick fix as I was just poking around NODE-RED. Not specifically done for the take home assignment. Including it since its just something I did.

Kazuhito also gave me a heart emoji for fixing his previous issue so I thought I could just fix another. Was just trying to be helpful as I poke around.

### # If you used AI as a tool while building this, how and why did you decide to use it?

I used no AI tool here either. The issue already had a link to the file where the error was being thrown and that it was related to the junction node gave me enough of a clue.

## TreeList component does not reveal items outside of scroll area on larger lists

- [Issue](https://github.com/node-red/node-red/issues/5420)
- [PR](https://github.com/node-red/node-red/pull/5421)

### # What did you choose to build, and why?

I found this bug while testing the changes in my first PR (The node help tab mistakenly reset focus when arrow keys are used to switch between nodes). Since I found it and was already in that part of the code base I thought I might as well fix it.

### # If you used AI as a tool while building this, how and why did you decide to use it?

I used no AI here. I saw and referenced other focus/reveal code in the file and just kept the pattern.

## TreeList component allows navigating to filtered out items with arrow keys

- [Issue](https://github.com/node-red/node-red/issues/5430)
- [PR](https://github.com/node-red/node-red/pull/5431)

### # What did you choose to build, and why?

Another bug I found while testing my first PR so thought I might as well fix it.

I interpreted the problem here as simply not taking into account filter state. I focused on trying to not make this a bigger change than it had to be. I didn't want to introduce potential bloat and increase the chance of unintended bugs.

When filtering the tree list, items are simply hidden in the DOM, but the list of items itself is not filtered, or any type of filtered flagging. This is what I intentionally left out when deciding on approach and just chose as a step 1 to just check if the item is hidden when doing arrow key navigation.

### # If you used AI as a tool while building this, how and why did you decide to use it?

I used AI to quickly find that `EditableList` is responsible for hiding filtered items with `.hide()` to know the current logic. Used it for speed.

## Migrate to NPM workspaces

- [PR](https://github.com/piotrbogun/node-red/pull/1)

### # What did you choose to build, and why?

I did this long before getting the take home assignment. Otherwise maybe would have picked something else. I picked this since I saw the modernization issues and was curious and liked the idea of maybe helping with modernizing the project. I also wanted to test AI use for this task and to do something other than my other changes (bug fixes) as I poked around.

My interpretation of this change was that the current code lives in `packages/node_modules/@node-red/*` as a pre NPM workspace workaround and to migrate the code into a more modern/standard file structure (such as `packages/*`) while having NPM workspaces handle package symlinking to `node_modules/@node-red/*`.

Main focus:

- Not breaking git history if possible from files being moved.
- Maintain backwards compatibility. NPM workspaces should treat the moved files as being in `node_modules/@node-red/*` so existing code/plugins should continue to work.
- Grunt build tasks should continue to work as before, updating file paths.
- Tests should continue to work, updating file paths.
- Application should run same as pre-change.
- Building/publishing should work as before (minor testing done, not ready for proper PR).

Things left out (or just didn't get to):

- Moving test files. I simply didn't get to this. Was lower priority. They still work, just needed to update paths.
- Look through any documentation that needs updating.
- Full integration testing needs to be finished.

Basically to just stick to the main focus on moving to NPM Workspaces.

### # If you used AI as a tool while building this, how and why did you decide to use it?

- [AI tasks.json file](https://github.com/piotrbogun/node-red/blob/POC/npm-workspaces-migration/tasks/tasks.json)
- [AI testing document](https://github.com/piotrbogun/node-red/blob/POC/npm-workspaces-migration/tasks/tasks-test.md)

I used AI heavily on this task to help me plan, document the work, keep track of the changes, to help with testing, and do the actual work. I did this by first creating a [tasks.json](https://github.com/piotrbogun/node-red/blob/POC/npm-workspaces-migration/tasks/tasks.json) and doing a planning to document all the work, tasks, and any other useful information, and to help me make sure I was not missing anything while moving quickly.

I was able to break down all the work into small tasks for the AI to tackle. I then had the AI go task by task with this type of prompt:

```
In the plans directory there is a tasks.json file with a project and tasks.

- Review the project and all the tasks.
- Pick one task to work on that YOU think is the most important to work on next.
- Reference any other helpful information.
- Only do a single task.
- Once a task is done, append this file to mark the task is done along with any other information that would be helpful for the next developer.
- If you find that more work needs to be done while working on your task, append that as a task that needs to be done to the file along with any information that would be helpful to complete the task for a future developer.
```

Each task was done with a fresh AI instance to optimize its context window so it would perform well. Each task had to be small (not so different from planning a sprint).

Using this file as work documentation, along with commit hashes for AI to diff against, I had the AI generate high level testing documentation based on the work we were doing.

The main manual work for me was reviewing the planned work for correctness, that I was not introducing scope, and doing manual testing to confirm things worked as expected (on top of the AI testing). Since most of the work was making sure files got moved correctly, any hard coded file paths were updated, or updating the grunt build paths, and no changes to any kind of logic, the AI was able to do these things much faster than me and it was faster for me to review and test for this type of work.
