function ValidateForm(options) {
  let validatedSeclectors = [];

  const getParent = (currentElement, parentSelector) => {
    while (currentElement.parentElement) {
      if (currentElement.parentElement.matches(parentSelector))
        return currentElement.parentElement;
      currentElement = currentElement.parentElement;
    }
  };

  const showErrorMessage = (element, message) => {
    const formGroup = getParent(element, options.formGroupSelector);
    if (formGroup) {
      if (formGroup.classList.contains("valid")) {
        formGroup.classList.remove("valid");
      }
      formGroup.classList.add("invalid");
      formGroup.querySelector(options.errorMessageSelector).innerHTML = message;

      // Validate the input field name and only for LOGIN form
      const labelNameInputElement = formGroup.querySelector("label.input-name");
      if (labelNameInputElement) {
        if (!element.value) {
          if (labelNameInputElement.classList.contains("invalid"))
            labelNameInputElement.classList.remove("invalid");
        } else labelNameInputElement.classList.add("invalid");
      }
    }
  };

  const showSuccesMessage = (element) => {
    const formGroup = getParent(element, options.formGroupSelector);
    if (formGroup) {
      if (formGroup.classList.contains("invalid")) {
        formGroup.classList.remove("invalid");
      }
      formGroup.classList.add("valid");
      formGroup.querySelector(options.errorMessageSelector).innerHTML = "";
    }
  };

  const validate = (inputElement, rule) => {
    let errorMessage = rule.test(inputElement.value);
    if (errorMessage) showErrorMessage(inputElement, errorMessage);
    else showSuccesMessage(inputElement);
    return !errorMessage;
  };

  const formElement = document.querySelector(options.formSelector);
  if (formElement) {
    // Validate and listen to SUBMIT event
    formElement.addEventListener("submit", (event) => {
      event.preventDefault();

      let isFormValid = true;
      options.rules.forEach((rule) => {
        const inputElement = formElement.querySelector(rule.selector);
        let isValid = validate(inputElement, rule);
        if (!isValid) isFormValid = false;
      });

      if (isFormValid) {
        if (typeof options.submitForm === "function") {
          let formValue = validatedSeclectors.reduce(
            (values, currentSelector) => {
              let inputElement = formElement.querySelector(currentSelector);
              values[inputElement.name] = inputElement.value;
              return values;
            },
            {}
          );
          options.submitForm(formValue);
        }
      }
    });

    // Validate and listen to events: blur, input, ...
    options.rules.forEach((rule) => {
      const inputElement = formElement.querySelector(rule.selector);
      validatedSeclectors.push(rule.selector);

      if (inputElement) {
        inputElement.addEventListener("blur", () => {
          validate(inputElement, rule);
        });

        inputElement.oninput = () => {
          getParent(inputElement, options.formGroupSelector).classList.remove(
            "invalid"
          );
          getParent(inputElement, options.formGroupSelector).querySelector(
            options.errorMessageSelector
          ).innerHTML = "";
        };
      }
    });

    // Show password field
    if (options.showPassword) {
      const checkBoxElement = formElement.querySelector(
        options.showPassword.selector
      );
      if (checkBoxElement) {
        const passwordField = formElement.querySelectorAll(
          "input[type=password]"
        );
        checkBoxElement.onchange = function () {
          options.showPassword.show(checkBoxElement, passwordField);
        };
      }
    }
  }
}

const isName = (selector, message) => {
  return {
    selector,
    test: (value) => {
      return value.trim() ? undefined : message.required;
    },
  };
};

const isEmail = (selector, message) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return {
    selector,
    test: (value) => {
      return !value.trim()
        ? message.required
        : !emailRegex.test(value.trim())
        ? message.invalid
        : undefined;
    },
  };
};

const isPassword = (selector, min, message) => {
  return {
    selector,
    test: (value) => {
      return !value
        ? message.required
        : value.length < min
        ? message.invalid
        : undefined;
    },
  };
};

const confirmPassword = (selector, getPassword, message) => {
  return {
    selector,
    test: (value) => {
      return !value
        ? message.required
        : value !== getPassword()
        ? message.invalid
        : undefined;
    },
  };
};

const showPassword = (selector) => {
  return {
    selector,
    show: (checkBoxElement, passwordInputElements) => {
      passwordInputElements.forEach(
        (input) => (input.type = checkBoxElement.checked ? "text" : "password")
      );
    },
  };
};

// Show password in REGISTER form
const iconShowPassword = document.querySelectorAll("i.show-password");
if (iconShowPassword) {
  iconShowPassword.forEach((element) => {
    element.addEventListener("click", () => {
      const passwordInputElement = element.parentElement.querySelector("input");

      if (passwordInputElement) {
        if (passwordInputElement.type === "password") {
          passwordInputElement.type = "text";
          element.classList.remove("fa-eye");
          element.classList.add("fa-eye-slash");
        } else {
          passwordInputElement.type = "password";
          element.classList.remove("fa-eye-slash");
          element.classList.add("fa-eye");
        }
      }
    });
  });
}

// Validate password and confirm password inputs when confirm password input
// has data and password input is changed
const passwordInputElement = document.querySelector("#signup-form #password");
if (passwordInputElement) {
  passwordInputElement.onfocus = () => {
    let confirmPasswordInputElement = document.querySelector(
      "#signup-form #confirm-password"
    );
    if (passwordInputElement.value || confirmPasswordInputElement.value) {
      passwordInputElement.oninput = () => {
        let formGroup = confirmPasswordInputElement.parentElement.parentElement;
        if (passwordInputElement.value === confirmPasswordInputElement.value) {
          if (formGroup.classList.contains("invalid")) {
            formGroup.classList.remove("invalid");
          }
          formGroup.classList.add("valid");
          formGroup.querySelector(".error-message").innerHTML = "";
        } else {
          if (formGroup.classList.contains("valid")) {
            formGroup.classList.remove("valid");
          }
          formGroup.classList.add("invalid");
          formGroup.querySelector(".error-message").innerHTML =
            "Password does not match";
        }

        let formGroupInput = passwordInputElement.parentElement.parentElement;
        if (formGroupInput) {
          formGroupInput.classList.remove("invalid");
          formGroupInput.querySelector(".error-message").innerHTML = "";
        }
      };
    }
  };
}
