# Taskbot

**Not ready for people to use, still experimenting**
*would love help*

Accept text, possibly from a stream, and parse for commands to then execute. For each command found, 
that command should be run through an array of parsers. Commands should be extracted from the message body.
Commands/Parsers should be run sequentially so the message body may be modified in the process -- similar to 
express/connect style functions.

## Initial Spec

- taskbot:
  - accepts:
    - [ ] messages as text/plain
    - [ ] messages as streams
    - [ ] messages as buffers
  - commands
    - [ ] \# as inline command
    - [ ] can accept list (considering similar to yaml list)
    - [ ] get sent through different parsers based on command name or regex
      - analogous with express routes
    - [ ] are filtered out of text body automatically
      - [ ] make toggle for this in initialization object
  - parsers
    - [ ] filters commands from text body
    - [ ] each looks for commands
    - [ ] parses commands through array of parsers
    - [ ] each parser is triggered on a keyword/command


#Contributing

Yes please. Select an issue/todo and pull request.
