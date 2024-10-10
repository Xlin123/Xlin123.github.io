# Devlog 4

## Overview
Whew! Backend work mostly done, will needs some tweaks as we go!
## Goals
- Fledge out backend as we will need it to help visualize for IAC and frontend.
    - I know most people consider this a bit backwards, but I think it's more optimal for me as I'm solo + isn't super frontend heavy.
- IAC planning
## Accomplishments
- Backend Done!
- Planning to run IAC on my homelab, not sure exactly how that'll go but... I'd prefer that over cloud services for now (im poor)

## Challenges
- Yea.. so we got around my ws concerns. Like a secure websocket connection, we're going to need some initiliazation. 
    - for clarification before I explain
        - Server Requests = RSA
        - Data over websocket = AES (generated per session)
    - For Init:
        - Frontend sends a server request containing args + channelkey
        - This channel key will used to encrypt and decrypt on both sides.

## Lessons Learned
- Had a lot of flipflopping between coding patterns, I decided to opt for a couple:
    - a static manager for sessions
    - all incoming requests on the API will be initially handled by DefaultRequest --> this is the encrypted payload, with iv signature and publicKey.
    
    - after that, it gets turned into it's specific request type (websocket / newsession).


## Next Steps
- move to front end so I can get things running fully locally then worry about infra after.

## Conclusion
 Hard work is paying off, blank files are turning into actual things. Excited to continue.

## Additional Note:
I decided what to put on the containers!! 
I want to run some type of white hat distro, then we can have a mini network pen tester on my website!
 