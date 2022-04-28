# Libraries

Libraries are abstractions of common functionality in the app, usually external interactions with APIs and eternal Libraries.

It is important that we abstract all external libraries we use here so that we can easily update the application in one place and not have to fuss with multiple component changes. Consider deprecating old methods and use the same interface where possible.

## Other Considerations

If your library will be used across many components frequently, consider adding it as a plugin.
