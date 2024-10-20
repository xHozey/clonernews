let Posts = [];
let infinity = [];
let idsList = [];
let maxID;
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
    idsList = storiesIds.concat(jobsIds);
    maxID = await largestPost.json();
  } catch (err) {
    console.error(err);
  }
};

let start = 0;
let end = 10;
const fetchStoriesAndJobs = async () => {
  if (start <= idsList.length) {
    let current = idsList.slice(start, end);
    console.log(current)
    for (let id of current) {
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
    }
    start += 10;
    end += 10;
  }
};


const fetchPolls = async (largestPost) => {
  let i = largestPost;
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
        console.log("found one");
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
const showComments = (event) => {
  console.log("hi");
  let postDiv = event.target.closest(".post");
  let commentsDiv = postDiv.querySelector("div[id]");
  if (
    commentsDiv.style.display === "none" ||
    commentsDiv.style.display === ""
  ) {
    commentsDiv.style.display = "block";
  } else {
    commentsDiv.style.display = "none";
  }
};
let i = 0;
let y = 30;
const displayMore = async () => {
  fetchStoriesAndJobs()
  Posts.concat(infinity);
  Posts.sort((a, b) => {
    return b.time - a.time;
  });
  while (i < Posts.length) {
    if (i == y) {
      y += 10;
      return;
    }
    const unixTime = Posts[i].time;
    const date = new Date(unixTime * 1000);
    container.innerHTML += `<div class="post">
    <p>${Posts[i].text ? Posts[i].text : 'No Title Available'}</p>
    <a href="${Posts[i].url ? Posts[i].url : '#'}" target="_blank" class="url">${Posts[i].url ? Posts[i].url : 'No URL Available'}</a>
    <p>By: <span id="name">${Posts[i].by ? Posts[i].by : 'Unknown'}</span></p>
    <p>Type: <span id="type">${Posts[i].type ? Posts[i].type : 'N/A'}</span></p>
    <p>Created at: <span>${date.toLocaleString()}</span></p>
    <span class="show-comment">Show Comments...</span>
    <div id="${Posts[i].id}"></div>
    </div>`;
    if (Posts[i].kids) {
      await getComments(Posts[i].kids, Posts[i].id);
    }
    i++;
  }
};
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
      console.log(i);
    } catch (err) {
      console.error(err);
    }
  }
  comments.sort((a, b) => {
    return b.unixTime - a.unixTime;
  });
  let parentDiv = document.getElementById(parent);
  //parentDiv.style.display = "none";
  for (let i of comments) {
    parentDiv.innerHTML += `<p>${i.text}</p>
      <p>By: <span id="name">${i.by}</span></p>
      <p>Created at: <span>${i.date}</span></p>
      `;
  }
};

getIds().then(() => {
  fetchStoriesAndJobs().then(() => {
    displayMore();
  });
});


let currentID;
setInterval(async () => {
  let largestPostRes = await fetch(
    "https://hacker-news.firebaseio.com/v0/maxitem.json"
  );
  let largestPostID = await largestPostRes.json();
  if (currentID != largestPostID) {
    currentID = largestPostID
    await fetchNewData(currentID);
  }
}, 5000);
const fetchNewData = async (id) => {
  try {
    let postResponse = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    let metaData = await postResponse.json();
    console.log(id)
    console.log(metaData.type)
    if (metaData.type != "comment") {
      container.innerHTML = `<div class="post">
      <p>${metaData.text}</p>
      <a href="${
        metaData.url ? metaData.url : ""
      }" target="_blank" class="url">${metaData.url ? metaData.url : ""}<a>
        <p>By: <span id="name">${metaData.by}</span></p>
        <p>Type: <span id="type">${metaData.type}</span></p>
        <span class="show-comment">Show Comments...</span>
        <div id="${metaData.id}"></div>
        </div>
        ` + container.innerHTML
      alert("New Post!");
      currentID = id;
   }
  } catch (err) {
    console.error(err);
  }
};
