let tableContent = document.getElementById("table_content");
let filterButtons = document.getElementsByClassName("filter");

const itemsPerPage = 10;
let currentPage = 1;

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

/**
 * Function to display our data
 * in some container, tableContent for us.
 *
 * @param users - array of user data, sorted or not
 */
const displayUsers = (users) => {
	/**
	 * Removing old exiting data from table
	 * before filling it again with new sorted data
	 * to prevent generating copies.
	 */
	if (tableContent.firstChild) {
		tableContent.innerHTML = "";
	}

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	const paginatedUsers = users.slice(startIndex, endIndex);

	/**
	 * Populating HTML with our paginated user data.
	 */
	paginatedUsers.forEach((user) => {
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

	const totalPages = Math.ceil(users.length / itemsPerPage);
	const pagination = document.querySelector("#pagination_numbers");

	/**
	 * Generating pagination buttons
	 */
	for (let i = 1; i <= totalPages; i++) {
		const paginationButton = document.createElement("button");
		paginationButton.textContent = i.toString();

		if (i === currentPage) {
			paginationButton.classList.add("active");
		}

		paginationButton.addEventListener("click", () => {
			currentPage = i;
			displayUsers(users);
		});

		pagination.appendChild(paginationButton);
	}
};

/**
 * Sorts array of user by keyword
 *
 * @param users - array of user data
 * @param key - which prop we will sort, e.g. firstName or eyeColor
 * @returns {*}
 */
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
