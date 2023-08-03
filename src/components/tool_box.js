/** @jsx jsx */
import {
  jsx,
  Box,
  Radio,
  Label,
  Input,
  Button,
  Heading,
  Textarea
} from "theme-ui";
import { rgba } from "polished";
import { useState } from "react";
import dotPattern from "assets/images/dot-pattern.png";
import axios from "axios";
const END_POINT = "http://localhost:3001/";

const SummarizeForm = ({ setText }) => {
  var article="";

  var [state, setState] = useState({
    source: "viaLink",
    numOfSentences: "",
    inputBox: <Box sx={styles.input}>
    <Label htmlFor="url" variant="styles.srOnly">
      Summarize
    </Label>
    <Input
      id="url"
      type="text"
      placeholder="Put your url here"
      onChange={handleURL}
    />
  </Box>
  });
  
  var [content,setContent] = useState({
    url:"",
    fileContent:"",
    rawText:"",
  });

  const handleSource = (e) => {
    if (e.target.value == "viaLink") {
      setState({
        ...state,
        source: e.target.value,
        inputBox:
          <Box sx={styles.input}>
            <Label htmlFor="url" variant="styles.srOnly">
              Summarize
            </Label>
            <Input
              id="url"
              type="text"
              placeholder="Put your url here"
              onChange={handleURL}
            />
          </Box>
      });
    }
    else if (e.target.value == "local") {
      setState({
        ...state,
        source: e.target.value,
        inputBox:
          <Box sx={styles.input}>
            <Label htmlFor="files" variant="styles.srOnly">
              Summarize
            </Label>
            <Input
              id="files"
              type="file"
              accept=".txt"
              size="1"
              onChange={handleFile}
            />
          </Box>
      });
    }else{
      setState({
        ...state,
        source: e.target.value,
        inputBox:
          <Box sx={styles.input}>
            <Label htmlFor="rawText" variant="styles.srOnly">
              Summarize
            </Label>
            <Textarea
              id="rawText"
              type="text"
              placeholder="Put your text here"
              onChange={handleRawText}
            />
          </Box>
      });
    }
  };

  function handleChoose(e) {
    setContent({
      ...content,
      url:"",
      fileContent:"",
      rawText:"",
    })
  };

  function handleURL(e) {
    setContent({
      ...content,
      url: e.target.value,
    })
  };

  const handleFile = async (e) => {
    const fr = await readFileAsync(e.target.files[0]);
    setContent({
      ...content,
      fileContent: fr,
    })
  };

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  function handleRawText(e) {
    setContent({
      ...content,
      rawText:e.target.value,
    })
  };

  const handleNumOfSentences = (e) => {
    setInputFilter(document.getElementById("numOfSentences"), function (value) {
      return /^\d*$/.test(value);
    });
    setState({
      ...state,
      numOfSentences: e.target.value,
    });
  };

  function setInputFilter(textbox, inputFilter, errMsg) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
      textbox.addEventListener(event, function (e) {
        if (inputFilter(this.value)) {
          if (["keydown", "mousedown", "focusout"].indexOf(e.type) >= 0) {
            this.classList.remove("input-error");
            this.setCustomValidity("");
          }
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.classList.add("input-error");
          this.setCustomValidity(errMsg);
          this.reportValidity();
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        }
        else {
          this.value = "";
        }
      });
    });
  }

  var handleSubmit = async (e) => {
    e.preventDefault();
    console.log(state.source);
    let isURLNull = false;

    if (state.source == "rawText") {
      article=content.rawText;
    }

    if (state.source == "viaLink") {
      console.log(content.url);
      if(content.url == ""){
        isURLNull=true
      }else{
      const res = await axios.post(`${END_POINT}parsed-from-url`, {
        url: content.url,
      });
      const parsedArticleFromURL = res.data.text;
      article = parsedArticleFromURL;
    }
    }

    if (state.source == "local") {
      article=content.fileContent;
    }

    if (isURLNull == true){
      setText("Please input URL.");
    }
    else if(article==""){
      setText("Can't read the input or the input is null.");
    }
    else{
    var response = await axios
      .post(`${END_POINT}summerized`, {
        article: article,
        length: state.numOfSentences.toLowerCase(),
      }).catch((error) => { 
      });
    console.log(response.data);
    setText(response.data.summerizedArticle);
    }
  };


  return (
    <Box sx={styles.formWrapper}>
      <Heading sx={styles.title}>Tool Box</Heading>
      <Box as="form" sx={styles.form} onSubmit={handleSubmit}>
        <Box sx={styles.radioGroup}>
          <Label>
            <Radio
              value="viaLink"
              name="source"
              defaultChecked={state.source === "viaLink"}
              onChange={handleSource}
              onClick={handleChoose}
            />
            Via Link
          </Label>
          <Label>
            <Radio
              value="local"
              name="source"
              onChange={handleSource}
              onClick={handleChoose}
            />
            Local
          </Label>
          <Label>
            <Radio
              value="rawText"
              name="source"
              onChange={handleSource}
              onClick={handleChoose}
            />
            Raw Text
          </Label>
        </Box>
        {state.inputBox}
        <Box sx={styles.input}>
          <Label htmlFor="numOfSentences" variant="styles.srOnly">
            Summarize
          </Label>
          <Input
            id="numOfSentences"
            type="text"
            placeholder="The willing number of sentences (can leave blank)"
            onChange={handleNumOfSentences}
          />
        </Box>
        <Box sx={styles.buttonGroup}>
          <Button variant="primary" sx={styles.submit}>
            Summarize
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SummarizeForm;

const styles = {
  formWrapper: {
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: "0px 24px 50px rgba(54, 91, 125, 0.05)",
    p: ["26px", null, null, "35px 40px 50px"],
    position: "relative",
    "::before, ::after": {
      background: `url(${dotPattern}) no-repeat right top`,
      content: [null, null, null, null, null, `''`],
      position: "absolute",
      width: 302,
      height: 347,
      zIndex: -1,
    },
    "::before": {
      left: "-60px",
      bottom: 15,
    },
    "::after": {
      right: "-41px",
      top: "-30px",
    },
  },
  title: {
    color: "textSecondary",
    fontWeight: "bold",
    fontSize: [6, null, null, 12, 8, 11],
    lineHeight: 1.4,
    letterSpacing: "heading",
    mb: [4, null, null, 5],
    textAlign: ["center", null, null, null, "left"],
  },
  form: {
    label: {
      alignItems: "center",
      cursor: "pointer",
      fontWeight: 400,
    },
  },
  radioGroup: {
    display: "flex",
    alignItems: ["flex-start", null, null, "center"],
    flexDirection: ["column", null, null, "row"],
    mb: [5, null, null, 5],
    "> label": {
      alignItems: "center",
      fontSize: [1, null, null, "15px"],
      width: "auto",
      "+ label": {
        ml: [null, null, null, 4],
        mt: [2, null, null, 0],
      },
    },
  },
  buttonGroup: {
    mt: [5, null, null, 8],
    span: {
      display: "flex",
      justifyContent: "center",
      color: rgba("#000", 0.4),
      fontWeight: "bold",
      fontSize: 1,
      lineHeight: 2.87,
    },
    button: {
      minHeight: [45, null, null, 60, 50, 60],
      width: "100%",
    },
  },
  input: {
    mb: [3, null, null, 4],
    justifyContent:"center", 
    alignItems:"center",
    input: {
      display: 'flex',
      justifyContent:"center", 
      alignItems:"center",
      minHeight: [45, null, null, 60, 50, 60],
      "::placeholder": {
        color: rgba("#02073E", 0.35),
      },
    },
    textarea:{
      mb: [3, null, null, 4],
      "::placeholder": {
        color: rgba("#02073E", 0.35),
      },
    }
  },
};