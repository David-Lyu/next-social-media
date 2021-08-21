import { useState } from 'react';
import classes from './form.module.css';
///////////////////////ONSUBMIT ON THE WORKS
/**
 * This component takes in props called inputs with properties: formName, config, submitFunc, onSubmit.
 * @param inputs is an array of an object with two properties:
 *    1) label: the name you want to put for the input.
 *    2) type: the input type you want to use.
 *    - The inputs are created in order of the objects in the array
 *    - Also if there is a password and confirm password inputs they should be next to each other.
 *  @param formName is the name of the form you want. Helps create react keys dynamically
 *  @param config is the configuration for the http request, so url and method
 *  @param submitFuc is a function predefined to do any logic with the data.
 *  @param csrfToken is a token to help prevent csrf attacks
 *  @param onSubmit will be used to overwrite the default onSubmit
 * It will also create the a controlled form for input verification
 * The body data that is being sent will be in JSON format, with the keys camelCased.
 *  - The label can have spaces in between and this will automatically take them
 * @returns Returns a form with its components
 */
function Form({ inputs, formName, config, submitFunc, csrfToken, onSubmit }) {
  const numOfInputs = inputs.length;
  const createState = {};
  const onChange = {};
  const [errors, setErrors] = useState({});

  /*Creates state dynamically. Not good practice according to documentation,
  but upon further reading since the size of array never changes it should not
  have changed any side-effects */
  for (let i = 0; i < numOfInputs; i++) {
    /* eslint-disable */
    const [state, setState] = useState({});
    createState[i] = { state, setState };
  }

  //creates onChange methods dynamically
  for (let i = 0; i < numOfInputs; i++) {
    onChange[i] = (e) => {
      const inputTag = e.currentTarget;
      createState[i].setState(inputTag);
      checkInputs(inputTag, i);
    };
  }
  if (!onSubmit) {
    onSubmit = async (e) => {
      e.preventDefault();
      let body = {};
      for (let i = 0; i < numOfInputs; i++) {
        if (!createState[i].state || !createState[i].state.value) {
          const message = 'Please fill out all the form inputs';
          helpSetErrors(errors, setErrors, formName, message);
          return;
        }

        //this creates the name for the data in the object making the label text into camelCase
        //by splitting into arrays and capitalizing the first letter of the string its
        //  split into except the first index(0) and then joins the arrays back together
        let nameChange = inputs[i].label.toLowerCase().split(' ');
        if (nameChange.length > 1) {
          for (let i = 0; i < nameChange.length; i++) {
            if (i === 0) continue;
            const string = nameChange[i];
            nameChange[i] = string[0].toUpperCase() + string.slice(1);
          }
        }

        body[nameChange.join('')] = createState[i].state.value;
      }

      if (errors.formName?.hasError) {
        helpSetErrors(errors, setErrors, formName, '');
      }

      for (const key in errors) {
        const error = errors[key];
        if (error.hasError) {
          const message = 'Not submitted please clear errors';
          helpSetErrors(errors, setErrors, formName, message);
          return;
        }
      }
      const fetchConfig = {
        method: config.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };

      const response = await (await fetch(config.url, fetchConfig)).json();
      if (!response) {
        const message = 'Could not get data';
        helpSetErrors(errors, setErrors, formName, message);
      }
      submitFunc(response);
    };
  }

  return (
    <form onSubmit={onSubmit} className={classes.form}>
      {csrfToken && <input type="hidden" value={csrfToken} key="csrf" />}
      {inputs.map((input, index) => (
        <div key={formName + input.label}>
          <label>
            {input.label}:
            <input
              type={input.type}
              value={createState[index.state]?.value}
              onChange={onChange[index]}
              required={true}
            />
          </label>
          {!errors[index]?.hasError ? null : <p>{errors[index].message}</p>}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );

  //helper function to check inputs
  function checkInputs(inputTag, index) {
    //checks inputs
    checkUserInputs(inputTag.value, index, errors, setErrors);

    switch (inputTag.type) {
      case 'password':
        checkPasswords(
          inputTag.value,
          inputTag.type,
          errors,
          setErrors,
          index,
          createState
        );
        break;
      case 'email':
        break;
      case 'tel':
        break;
      case 'text':
        break;
      default:
        setErrors({
          ...errors,
          [formName]: {
            hasErrors: true,
            message: 'INPUT TYPE NOT ACCEPTED...YET'
          }
        });
    }
  }
}

function checkUserInputs(value, index, errors, setErrors) {
  const noNoChar = new RegExp('[<>{}/]', 'g');
  const userInputs = new RegExp('[a-zA-Z0-9-_]', 'g');
  // regex [a-zA-Z][a-zA-Z0-9-_]{4,24}
  if (noNoChar.test(value) && value.length) {
    const message = 'You have invalid inputs. Ex: "<,>,{,},/,\\"';
    helpSetErrors(errors, setErrors, index, message);
    return;
  }

  if (!userInputs.test(value) && value.length) {
    const message =
      'Please put letters and numbers with a length of up to 25 characters';
    helpSetErrors(errors, setErrors, index, message);
    return;
  }

  if (value.length === 0 || errors[index]?.hasError) {
    helpSetErrors(errors, setErrors, index, '');
  }
  return;
}

function checkPasswords(value, type, errors, setErrors, index, stateObj) {
  if (stateObj[index - 1]?.state.type === 'password') {
    if (stateObj[index - 1].state.value === value || value.length === 0) {
      const message = '';
      helpSetErrors(errors, setErrors, index, message);
      return true;
    }

    if (stateObj[index - 1].state.value !== value) {
      const message = 'Password does not match';
      helpSetErrors(errors, setErrors, index, message);
      return false;
    }
  }

  if (stateObj[index + 1]?.state.type === 'password') {
    if (stateObj[index + 1].state.value === value || value.length === 0) {
      const message = '';
      helpSetErrors(errors, setErrors, index + 1, message);
      return true;
    }

    if (stateObj[index + 1].state.value !== value) {
      const message = 'Password does not match';
      helpSetErrors(errors, setErrors, index + 1, message);
      return false;
    }
  }
}

function checkTelephone() {
  // \(?(\d{3})\)?[-\.\s]?(\d{3})[-\.\s]?(\d{4})
}

function checkURL() {
  // [(http(s)?):\/\/(www\.)?\w-/=#%&\.\?]{2,}\.[a-z]{2,}([\w-/=#%&\.\?]*)
}

function checkEmailAddress() {
  // (\w\.?)+@[\w\.-]+\.\w{2,4}
}

/**
 *
 * @param {*errors The error state object that React handles
 * @param {*setErrors The setState object that React handles
 * @param {*key the key of the errors state to mutate, usually an index
 * @param {*message the error message you want to pass
 */
function helpSetErrors(errors, setErrors, key, message) {
  setErrors({
    ...errors,
    [key]: { hasError: !!message, message: message }
  });
}
export default Form;
