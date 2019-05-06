# Experimental Repo!!

If you've stumbled on this repo looking for elucidation, it won't have much, truth be told.  It's just an experiment to share with my team that has to do with handling long jobs on the server-side.

## Intro

All right, let's say that you're starting a long job with a lot of processing on the server side.  I don't want to go into specifics, but ours has file upload (the easy part), and then processing that file and running another web api to validate.  The process of handling and validating all that data could take a while, on the order of magnitude of 1 - 10 minutes.

The user should be able to:

- start a job,
- get the current status,
- cancel if necessary.

When it's done, the server will wait for an arbitrary long-ish period of time (c. 30 seconds) for a confirmation signal.  If it doesn't get it, that means that the user abandoned the page and therefore doesn't want this job.  It then reverses everything.

## Instructions

You will need Node >= 10.  I have some async generator logic, after all.

Navigate into the client and server folders in the command line (using two windows).  Run the following commands:

```cmd
npm install
npm start
```

You can also use Yarn.  That's fine.

## Projects

### Client

### Server
