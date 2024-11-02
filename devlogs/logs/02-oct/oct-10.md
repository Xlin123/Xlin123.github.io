# Devlog 5

## Overview
Frontend stuff...
## Goals
- Get the terminal interface setup for frontend
## Accomplishments
- the UI is prepared, now I must make the connections + encryption.
- During one of my computer security labs we went through the process of setting up an apache2 server with https, this was the catalyst into realizing that I can indeed secure my websocket (looks like I was missing the right words to google). Along with that, I found out how to supply the cert + key into dart_frog. When the time comes to deploy the website I'll make sure to grab a free cert from Let's Encrypt.
- Hah, that lab really happened to bring me down a rabbit hole of figuring some future problems out:
    - So I first was running into an issue generating rsa keys on the front end and I realized I wasn't using the right package. (package was intended for backend, not supported by browsers)
    - That made me go look for the right package, web crypto api, which can only run with a secure context.
    - Looked into getting a CA cert off of Let's Encrypt and it brought me to certbot.
    - Which made me then ask, how will I serve + secure both my backend and frontend?
        - Conclusion: build release version of react app and then serve it with the same security context over dart_frog.
    - If I want to serve the same security context, I'll need to make sure to configure github pages properly when deploying but that's a later issue I can resolve. And I probably won't actually be needing a CA cert because it looks like github provides it.
    - Again, nice to figure out some deployment concerns now.


## Challenges
- Still same issue, worried about ts/js ability to make and encrypt stuff. Turning out to be a bit more challenging than I'd like.

## Lessons Learned
- Same thing... wrong tech == more dev work.
- Better you are at planning means the faster the work will be.


## Next Steps
- finish encryption

## Conclusion
 - Keep pushing!!