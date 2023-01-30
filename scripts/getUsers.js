import users from "/data/users.json" assert { type: "json" };

let tableContent = document.getElementById("table_content");

users.forEach((userData) => {
  let user;
  user = `
    <tr class="user">
        <td class="user-firstname">${userData.name.firstName}</td>
        <td class="user-lastname">${userData.name.lastName}</td>
        <td><p class="user-about">${userData.about}</p></td>
        <td class="user-eyecolor">${userData.eyeColor}</td>
    </tr>
  `;

  tableContent.innerHTML += user;
});
