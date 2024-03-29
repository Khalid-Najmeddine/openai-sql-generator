import {useState, useMemo} from "react";
import CodeDisplay from "./components/CodeDisplay";
import ManyMessagesDisplay from "./components/ManyMessagesDisplay";

interface ChatData {
  role: string;
  content: string;
}

const App = () => {

  const [value,setValue] = useState<string>("");

  const valueChange = (event:any) => {
    setValue(event.target.value);
  }

  const [chat,setChat] = useState<ChatData[]>([]);

  const getQuery = async () => {

    try {
      const options = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message: value})
      }
      const response = await fetch("http://localhost:8000/completions", options);
      const data = await response.json();
      console.log(data);
      const userMessage = {"role": "user", "content": value};
      setChat(oldChat => [...oldChat, data, userMessage])
    } 

    catch (error) {
      console.error(error);
    }

  }

const clearChat = () => {
  setValue("");
  setChat([]);
}

  const filteredUserMessages = useMemo(() => {
    return chat.filter((message) => message.role === "user");
  }, [chat]);


  const latestCode = useMemo(() => {
    return chat.filter((message) => message.role === "assistant").pop();
  }, [chat]);

  return (
    <div className="app">
      <ManyMessagesDisplay userMessages={filteredUserMessages}/>
      <input value={value} onChange={valueChange}/>
      <CodeDisplay text={latestCode?.content || ""}/>
      <div className="button-Container">
        <button id="get-Query" onClick={getQuery}>Get Query!</button>
        <button id="clear-Chat" onClick={clearChat}>Clear Chat!</button>
      </div>
    </div>
  );
}

export default App;
