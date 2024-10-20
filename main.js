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
    fetchPolls(largestPost);
    fetchStories(storiesIds);
    fetchJobs(jobsIds);
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
        url: story.url,
        id: story.id,
        comments: story.kids,
      });
    } catch (err) {
      console.error(err);
    }
  });
};

const fetchPolls = async (largestPost) => {
  let largeID = await largestPost.json();
  let i = largeID;

  const fetchNext = async () => {
    if (i === 0) return;
    try {
      let dataRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${i}.json`
      );
      let poll = await dataRes.json();
      if (poll.type === "poll") {
        infinity.push({
          text: poll.title,
          by: poll.by,
          time: poll.time,
          type: poll.type,
          url: poll.url,
          id: poll.id,
          comments: poll.kids,
        });
        //updates
      }
    } catch (err) {
      console.error(err);
    } finally {
      i--;
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
        url: job.url,
        id: job.id,
        comments: job.kids,
      });
    } catch (err) {
      console.error(err);
    }
  });
};

getIds();

const showComments = (id) => {
  let div = document.getElementById(id);
  if (div.style.display == "none") {
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
};

let i = 0;
let y = 30;
const displayMore = async () => {
  Posts.sort((a, b) => {
    return b.time - a.time;
  });
  while (i + 1) {
    if (i == y) {
      y += 30;
      return;
    }
    const unixTime = Posts[i].time;
    const date = new Date(unixTime * 1000);

    container.innerHTML += `<div class="post">
    <p>${Posts[i].text}</p>
    <a href="${Posts[i].url ? Posts[i].url : ""}" target="_blank" class="url">${
      Posts[i].url ? Posts[i].url : ""
    }<a>
    <p>By: <span id="name">${Posts[i].by}</span></p>
    <p>Type: <span id="type">${Posts[i].type}</span></p>
    <p>Created at: <span>${date.toLocaleString()}</span></p>
    <span class="show-comment">Show Comments...</span>
    <div id="${Posts[i].id}"></div>
    </div>
    `;
    getComments(Posts[i].kids, Posts[i].id);
    i++;
  }
};

setTimeout(() => {
  displayMore();
}, 5000);



const getComments = async (kids, parent) => {
  let comments = [];
  for (let i of kids) {
    try {
      let commentRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${i}.json`
      );
      let comment = await commentRes.json();
      const unixTime = comment.time;
      const date = new Date(unixTime * 1000);
      comments.push({
        user: comment.by,
        text: comment.text,
        date: date.toLocaleString(),
        unixTime: comment.time,
      });
    } catch (err) {
      console.error(err);
    }
  }
  comments.sort((a, b) => {
    return b.unixTime - a.unixTime;
  });
  let parentDiv = document.getElementById(parent);
  parentDiv.style.display = "none";
  for (let i of comments) {
    parentDiv.innerHTML += `<p>${i.text}</p>
      <p>By: <span id="name">${i.by}</span></p>
      <p>Created at: <span>${i.date}</span></p>
      `;
  }
};

//const refrechPosts = () => {};

