let Posts = [];
let infinity = [];
let container = document.getElementById("threads");
const getIds = async () => {
  try {
    let storiesRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    let jobsRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/jobstories.json"
    );
    let largestPost = await fetch(
      "https://hacker-news.firebaseio.com/v0/maxitem.json"
    );
    let storiesIds = await storiesRes.json();
    let jobsIds = await jobsRes.json();
    fetchStories(storiesIds);
    fetchJobs(jobsIds);
    fetchPolls(largestPost);
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
      let story = await dataRes.json();
      Posts.push({
        text: story.title,
        by: story.by,
        time: story.time,
        type: story.type,
      });
    } catch (err) {
      console.error(err);
    }
  });
};

const fetchPolls = async (largestPost) => {
  let i = largestPost;
  if (i == 0) {
    return;
  }
  const fetchNext = async () => {
    try {
      let dataRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${i}.json`
      );
      let poll = await dataRes.json();
      if (poll.type == "poll") {
        infinity.push({
          text: poll.title,
          by: poll.by,
          time: poll.time,
          type: poll.type,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      i--;
      console.log("first loop");
      setTimeout(fetchNext, 200);
    }
  };
  fetchNext();
};

const fetchJobs = (data) => {
  data.forEach(async (id) => {
    try {
      let dataRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      let job = await dataRes.json();
      Posts.push({
        text: job.title,
        by: job.by,
        time: job.time,
        job: job.type,
      });
    } catch (err) {
      console.error(err);
    }
  });
};

getIds();

let i = 0;
let y = 30;
const displayMore = () => {
  console.log('clicked')
  Posts.concat(infinity);
  while (i+1) {
    if (i == y) {
      y += 30;
      return;
    }
    container.innerHTML += `<div class="post">
    <p>${Posts[i].text}</p>
    <p>Name: <span id="name">${Posts[i].by}</span></p>
    <p>Time: <span id="time">${Posts[i].time}</span></p>
    <p>Type: <span id="type">${Posts[i].type}</span></p>
    </div>
    `;
    i++;
  }
};
