## The Voice Memo Repository

### What is this?

This is a service consisting of a Javascript (React) frontend and Node backend for quickly and easily recording, storing, removing, and sharing short audio recordings made natively in the browser.

### What is this written in?

- Javascript (React),
- Node.js.

### What are some of the main features?

- Frontend (website):
  - Uses React with Material-UI to present a responsive and simple UI,
  - Uses the Media Stream API for native in-browser audio recording, compression, and playback,
  - Uses uuidv4 and the Web Storage API for identification purposes (no manual login/registration required to provide a list of a particular browser's past recordings).
- Backend (server):
  - Uses Express to provide a simple server,
  - Uses Multer for handling file uploads,
  - Uses lowdb for storing a database of recordings per user,
  - Regularly removes old recordings and their corresponding entries.

### What's the point?

Mostly practicing React, Node, and using various APIs.

That being said, there is a surprising lack of websites offering quick and easy ways of sharing and storing recordings made with the use of the Media Stream API. Most either still use Flash or only offer downloads of the recordings, without being able to share the recordings with others.

### How do I use this?

1. Provide necessary permissions,
2. Press record button (note: the Media Stream API only allows for recording on localhost or https),
3. Press stop button or wait 5 minutes,
4. Press play button to listen to recording (optional),
5. Press upload button,
6. Press copy icon next to new entry in list of recordings,
7. Share recording with other people.

### Where can I use this?

**[Check out this demo right here.](https://54ac.ovh:5441/)**

### How do I launch this myself?

1. `git clone https://github.com/54ac/voice-memo.git .`
2. `npm i`
3. `npm start`

---

### Future plans and things to do

- [x] ~~Upload demo,~~
- [ ] Split the record and play modes into separate components? Having them combined into one component is good for minmaxing purposes, but it's a bit of a mess to maintain,
- [ ] Move database to some NoSQL database (MongoDB)? Could be overkill.
