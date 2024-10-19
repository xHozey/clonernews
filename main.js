const stories = document.getElementById("Stories");
const jobs = document.getElementById("Jobs");
const polls = document.getElementById("Polls");
const storieDiv = document.createElement("div");
const jobDiv = document.createElement("div");
const pollDiv = document.createElement("div");

const getAllData = async () => {
  try {
    let response = await Promise.all([
      fetch("https://hacker-news.firebaseio.com/v0/topstories.json"),
      fetch("https://hacker-news.firebaseio.com/v0/jobstories.json"),
    ]);

    let storiesIds = await response[0].json();
    let jobsIds = await response[1].json();
    fetchStories(storiesIds);
    fetchPolls(storiesIds);
    fetchJobs(jobsIds);
  } catch (err) {
    console.error(err);
  }
};

const getStories = () => {
  jobs.innerHTML = "";
  polls.innerHTML = "";
  stories.append(storieDiv);
};

const getPolls = () => {
  jobs.innerHTML = "";
  stories.innerHTML = "";
  polls.append(pollDiv);
};

const getJobs = () => {
  polls.innerHTML = "";
  stories.innerHTML = "";
  jobs.append(jobDiv);
};

const fetchStories = (data) => {
  let index = 0; 
  const interval = setInterval(async () => {
    if (index >= data.length) {
      clearInterval(interval); 
      return;
    }
    
    try {
      let dataRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${data[index]}.json`
      );
      let job = await dataRes.json();
      
      if (job.type === "story") {
        let li = document.createElement("li");
        li.classList = "thread";
        let link = document.createElement("a");
        link.setAttribute("href", job.url);
        link.setAttribute("target", "_blank");
        link.textContent = job.title;
        storieDiv.append(li); 
      }
    } catch (err) {
      console.error(err);
    }

    index++; 
  }, 400);
};


const fetchPolls = (data) => {
  data.forEach(async (id) => {
    try {
      let dataRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      let job = await dataRes.json();
      if (job.type == "polls") {
        let li = document.createElement("li");
        li.classList = "thread";
        let link = document.createElement("a");
        link.setAttribute("href", job.url);
        link.setAttribute("target", "_blank");
        link.textContent = job.title;
        li.appendChild(link);
        pollDiv.append(li);
      }
    } catch (err) {
      console.error(err);
    }
  });
};

const fetchJobs = (data) => {
  data.forEach(async (id) => {
    try {
      let dataRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      let job = await dataRes.json();
      let li = document.createElement("li");
      li.classList = "thread";
      let link = document.createElement("a");
      link.setAttribute("href", job.url);
      link.setAttribute("target", "_blank");
      link.textContent = job.title;
      li.appendChild(link);
      jobDiv.append(li);
    } catch (err) {
      console.error(err);
    }
  });
};

getAllData();
