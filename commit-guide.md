# Git Commit Style Guide

## Format of the Commit Message

```
{type}({scope}): {subject}
<BLANK LINE>
{body}
<BLANK LINE>
{footer}
```

## Rules for Commit Message

#### Length

- Keep lines under 80 characters in width.
- Subject line must not be longer than 60 characters (one line in Github PR description).

#### Subject - {subject}

Summary of the changes made.

- Must be present tense
- Written in the imperative
- First letter is not capitalized
- Does not end with a '.'

#### Allowed Types - {types}

- feat -> feature
- fix -> bug fix
- docs -> documentation
- style -> formatting, lint stuff
- refactor -> code restructure without changing external behavior
- test -> adding missing tests
- chore -> maintenance
- init -> initial commit
- rearrange -> files moved, added, deleted etc
- update -> update code (versions, library compatibility)

#### Scope - {scope}

Where the change was (i.e. the file, the component, the package).

#### Message Body - {body}

This gives details about the commit, including:

- motivation for the change (broken code, new feature, etc)
- contrast with previous behavior

Some rules for the body:

- Must be in present tense.
- Should be imperative.
- Lines must be less than 80 characters long.

#### Message Footer - {footer}

These are notes that someone should be aware of. Format footer in category blocks.

- TESTING -> how to test the change
- BREAKING CHANGE -> what is different now, additional things now needed, etc

For example:

```
TESTING: to test this change, bring up a new cluster and run the following
when the controller comes online:

    $ vagrant ssh -c "curl localhost:8000"
```

#### Referencing Issues

Reference issues it fixes, Jira tasks, etc.

- closes #14
- closes #14, #15

## Examples

```
feat(webrtc): add user tracking

This introduces tracking for new users on the webrtc media stream, it also allows us to disconnect and reconnect without closing or re-establishing the pipe.

closes #123

BREAKING CHANGE: This changes the interface of the WebRTC class and will break existing code.
```

Inspiration: [Git Commit Style Guide](https://gist.github.com/ericavonb/3c79e5035567c8ef3267)
