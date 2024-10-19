
const getStories = async () => {

  try {
    let storiesRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    let storiesIds = await storiesRes.json();
    data = storiesIds;
    displayStories(data);
  } catch (err) {
    console.error(err);
  }
};

const getPolls = async () => {
  try {
    let storiesRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    let storiesIds = await storiesRes.json();
    data = storiesIds;
    displayPolls(data);
  } catch (err) {
    console.error(err);
  }
};

const getJobs = async () => {
  try {
    let jobsRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/jobstories.json"
    );
    let jobsIds = await jobsRes.json();
    displayJobs(jobsIds);
  } catch (err) {
    console.error(err);
  }
};

const displayStories = (data) => {
  cleanPrevData();
  data.forEach(async (id) => {
    try {
      let dataRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      let job = await dataRes.json();
      if ((job.type = "story")) {
        let ol = document.getElementById("threads");
        let li = document.createElement("li");
        li.classList = "thread";
        li.innerText = job.title;
        ol.appendChild(li);
      }
    } catch (err) {
      console.error(err);
    }
  });
};

const displayPolls = (data) => {
  cleanPrevData();
  data.forEach(async (id) => {
    try {
      let dataRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      let job = await dataRes.json();
      if ((job.type = "polls")) {
        let ol = document.getElementById("threads");
        let li = document.createElement("li");
        li.classList = "thread";
        li.innerText = job.title;
        ol.appendChild(li);
      }
    } catch (err) {
      console.error(err);
    }
  });
};

const displayJobs = (data) => {
  cleanPrevData();
  data.forEach(async (id) => {
    try {
      let dataRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      let job = await dataRes.json();
      let ol = document.getElementById("threads");
      let li = document.createElement("li");
      li.classList = "thread";
      li.innerText = job.title;
      ol.appendChild(li);
    } catch (err) {
      console.error(err);
    }
  });
};

const cleanPrevData = () => {
  let data = document.getElementById("threads");
  data.innerHTML = "";
};
