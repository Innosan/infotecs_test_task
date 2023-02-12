let tableContent = document.getElementById("table_content");
let filterButtons = document.getElementsByClassName("filter");

let ascOrder = true;

const fetchUsers = () => {
  return fetch("/data/users.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });
};

const displayUsers = (users) => {
  /**
   * Removing old exiting data from table
   * before filling it again with new sorted data
   * to prevent generating copies.
   */
  while (tableContent.firstChild) {
    tableContent.removeChild(tableContent.firstChild);
  }

  /**
   * Populating HTML with our user data.
   */
  users.forEach((user) => {
    const row = document.createElement("div"); // row represents our user
    row.classList.add("user");

    row.innerHTML = `
      <p class="user-firstname">${user.name.firstName}</p>
      <p class="user-lastname">${user.name.lastName}</p>
      <p class="user-about">${user.about}</p>
      <div class="user-eyecolor">
          <svg viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="5" fill="${user.eyeColor}"/>
          </svg>
      </div>
    `;

    tableContent.appendChild(row); // adding user row to the table
  });
};
const sortUsers = (users, key) => {
  return users.sort((a, b) => {
    let propA = a[key];
    let propB = b[key];

    if (key === "firstName" || key === "lastName") {
      propA = a.name[key];
      propB = b.name[key];
    }

    if (!ascOrder) {
      if (propA < propB) return 1;
      if (propA > propB) return -1;

      return 0;
    } else {
      if (propA < propB) return -1;
      if (propA > propB) return 1;

      return 0;
    }
  });
};

/**
 * Adding event listeners to every header button,
 * like First Name, Last Name etc.
 */
for (let button of filterButtons) {
  button.addEventListener("click", (event) => {
    const key = event.target.id.replace(" ", "");

    ascOrder = ascOrder !== true;

    fetchUsers().then((users) => {
      const sorted = sortUsers(users, key);
      displayUsers(sorted);
    });
  });
}

fetchUsers().then((users) => {
  displayUsers(users);
});
