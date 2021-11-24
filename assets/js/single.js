var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEL = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function() {
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    getRepoIssues(repoName);

    if(repoName) {
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } else {
        document.location.replace("./index.html");
    }
}

var displayWarning = function(repo) {
    //add text to warning container
    limitWarningEL.textContent = "To see more than 30 issues, Visit ";

    var linkEl = document.querySelector("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    //append to warning container
    limitWarningEL.appendChild(linkEl);
};

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        //request was sucessful
        if (response.ok) {
            response.json().then(function(data) {
                //pass response data to dom function
                displayIssues(data);

                //check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }
        else {
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    // create a link element to take users to the issue on git hub
    for (var i = 0; i < issues.length; i++) {
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");
    
    // create span to hold the title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    //append to container
    issueEl.appendChild(titleEl);

    //create a type of element
    var typeEl = document.createElement("span");

    //check if issue is actual issue or pull request
    if (issues[i].pull_request) {
        typeEl.textContent = "(Pull Request)";
    } else {
        typeEl.textContent= "(Issue)";
    }
    //append to container
    issueContainerEl.appendChild(issueEl);

    //append to container
    issueEl.appendChild(typeEl);
}
};


getRepoName();