# Taskbot

**Not ready for people to use, still experimenting**
*would love help*

Accept text, possibly from a stream, and parse for commands to then execute. For each command found, 
that command should be run through an array of parsers. Commands should be extracted from the message body.
Commands/Parsers should be run sequentially so the message body may be modified in the process -- similar to 
express/connect style functions.

# Install

```
npm install taskbot
```




## Initial Spec

- taskbot:
  - accepts:
    - [x] messages as text/plain
    - [x] messages as streams
    - [x] messages as buffers
  - commands
    - [x] \# as inline command
    - [ ] consider adding parsing via commander (somehow)
    - [ ] can accept list (considering similar to yaml list)
    - [ ] get sent through different parsers based on command name or regex
      - analogous with express routes
    - [x] are filtered out of text body automatically
      - [ ] make toggle for this in initialization object
  - parsers
    - [x] parses commands through array of parsers
    - [x] each parser is triggered on a keyword/command

#Additional Ideas

- [ ] post message receive hook: If I am sending emails at *x* time, run task *y*
- [ ] add headers to messages for things like webpages and emails
- [ ] add some email parser from npm, I don't want to split and decode email bodies on my own
- [ ] add html to txt email converter to prevent issues

#Contributing

Yes please. Select an issue/todo and pull request.
