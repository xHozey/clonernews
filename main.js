let StoriesThread = [];
let JobsThread = [];
let PollsThread = [];
let container = document.getElementById('threads')
const getIds = async () => {
  try {
    let storiesRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    let jobsRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/jobstories.json"
    );
    let storiesIds = await storiesRes.json();
    let jobsIds = await jobsRes.json();
    fetchStories(storiesIds);
    fetchJobs(jobsIds);
    fetchPolls()
  } catch (err) {
    console.error(err);
  }
};

const fetchStories = (data) => {
  data.forEach(async (id) => {
    try {
      let dataRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      let job = await dataRes.json();
      StoriesThread.push({ text: job.title, by: job.by, time: job.time })
    } catch (err) {
      console.error(err);
    }
  });
};

const fetchPolls = async () => {
  let i = 126809;
  const fetchNext = async() => {
    try {
      let dataRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${i}.json`
      );
      let job = await dataRes.json();
      if (job.type == "poll") {
        PollsThread.push({ text: job.title, by: job.by, time: job.time })
      }
    } catch (err) {
      console.error(err);
    } finally {
      i++
      console.log('first loop')
      setTimeout(fetchNext, 200)
    }
  }
  fetchNext
};

const fetchJobs = (data) => {
  data.forEach(async (id) => {
    try {
      let dataRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      let job = await dataRes.json();
      JobsThread.push({ text: job.title, by: job.by, time: job.time })
    } catch (err) {
      console.error(err);
    }
  });
};

const displayStories = () => {
  StoriesThread.forEach((obj) => {
    
  })
}





getIds();
