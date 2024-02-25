const getUsers = () => {
  let users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

const signUp = (data) => {
  let users = getUsers();
  if (users.length > 0) {
    let isFound = users.find((user) => user.email === data.email);
    if (isFound) {
      alert(
        "This email has already been registered. Please try again with another email."
      );
      // window.location = "./login.html";
      // location.reload();
      return;
    }
  }
  users.unshift(data);
  localStorage.setItem("users", JSON.stringify(users));
  alert("User account has been created successfully.");
  window.location = "./login.html";
};

const logIn = (data) => {
  let users = getUsers();
  let isFound = users.find((user) => user.email === data.email);
  if (isFound) {
    if (isFound.password === data.password) {
      localStorage.setItem("userLogedIn", JSON.stringify(isFound));
      alert("You have logged in successfully.");
      window.location = "./home.html";
    } else alert("Password is incorrect.");
  } else alert("Your account does not exists.");
};
